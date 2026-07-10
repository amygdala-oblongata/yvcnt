const { google } = require("googleapis");
const fs = require("fs");


// a very simple example of searching for youtube videos
function runSample(chaabi) {
  const youtube = google.youtube({
    version: "v3",
    auth: chaabi,
  });

  const name = "Y3UtMG1HQTh4NTA="
  
  youtube.videos
    .list({
      part: ["liveStreamingDetails", "statistics"],
      id: Buffer.from(name, "base64").toString(),
    })
    .then((res) => {
      const video = res.data.items[0];

      if (!video) {
        throw new Error("YouTube returned no video for the configured ID");
      }

      processCount(
        video.liveStreamingDetails?.concurrentViewers,
        video.statistics?.viewCount
      );
    });
}

function processCount(concurrentViewers, lifetimeViews) {
  const currentDate = new Date()
  const currentTime = currentDate.toLocaleString('en-US', {hour12:false})
  const legacyText = `${currentTime}, ${concurrentViewers}\n`
  const viewsText = `${currentDate.toISOString()}, ${concurrentViewers ?? ""}, ${lifetimeViews ?? ""}\n`

  const currentYear = currentDate.getFullYear()
  const currentMonth = (currentDate.getMonth()+1).toLocaleString('en-us', {minimumIntegerDigits:2})
  const filename = `${currentYear}_${currentMonth}.txt`

  // Keep writing the original format for consumers of the existing dataset.
  fs.appendFileSync(`./counts/${filename}`, legacyText);

  // The versioned dataset has an unambiguous timestamp and both view metrics.
  fs.mkdirSync("./views_v2", { recursive: true });
  fs.appendFileSync(`./views_v2/${filename}`, viewsText);

  console.log(viewsText)
}

if (module === require.main) {
  runSample(process.argv[2]);
}
module.exports = runSample;

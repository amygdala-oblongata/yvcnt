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
      part: "liveStreamingDetails",
      id: Buffer.from(name, "base64").toString(),
    })
    .then((res) =>
      processCount(res.data.items[0].liveStreamingDetails.concurrentViewers)
    );
}

function processCount(count) {
  const currentDate = new Date()
  const currentTime = currentDate.toLocaleString('en-US', {hour12:false})
  const newText = `${currentTime}, ${count}\n`

  const currentYear = currentDate.getFullYear()
  const currentMonth = (currentDate.getMonth()+1).toLocaleString('en-us', {minimumIntegerDigits:2})
  const outfile = `./counts/${currentYear}_${currentMonth}.txt`
  console.log(newText)
  fs.appendFileSync(outfile, newText);
}

if (module === require.main) {
  runSample(process.argv[2]);
}
module.exports = runSample;

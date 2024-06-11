const { google } = require("googleapis");
const fs = require("fs");


// a very simple example of searching for youtube videos
function runSample(chaabi, naam) {
  const youtube = google.youtube({
    version: "v3",
    auth: chaabi,
  });

  youtube.videos
    .list({
      part: "liveStreamingDetails",
      id: naam,
    })
    .then((res) =>
      processCount(res.data.items[0].liveStreamingDetails.concurrentViewers)
    );
}

function processCount(count) {
  const currentTime = new Date().toLocaleString('en-US', {hour12:false})
  const newText = `${currentTime}, ${count}\n`
  console.log(newText)
  fs.appendFileSync("counts.txt", newText);
}

if (module === require.main) {
  runSample(process.argv[2], process.argv[3]);
}
module.exports = runSample;

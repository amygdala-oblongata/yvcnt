const { google } = require("googleapis");
const fs = require("fs");


// a very simple example of searching for youtube videos
function runSample(chaabi, naam) {
  const youtube = google.youtube({
    version: "v3",
    auth: chaabi,
  });

  console.log(Buffer.from(naam).toString("base64"))
  
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
  runSample(process.argv[2], process.argv[3]);
}
module.exports = runSample;

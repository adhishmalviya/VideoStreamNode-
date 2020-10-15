const express = require("express");
const fs = require("fs");
const path = require("path");
const app = express();
//curl http://localhost:8001 -i -H "Range: bytes=0-1023"

app.get("/", function (req, res) {
  const path = "assets/sample.mp4";
  const stat = fs.statSync(path);
  const fileSize = stat.size;
  const range = req.headers.range;
  if (range) {
    console.log(range);
    const parts = range.replace(/bytes=/, "").split("-");
    const start = parseInt(parts[0], 10);
    const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
    const chunksize = end - start + 1;
    const file = fs.createReadStream(path, { start, end });
    const head = {
      "Content-Range": `bytes ${start}-${end}/${fileSize}`,
      "Accept-Ranges": "bytes",
      "Content-Length": chunksize,
      "Content-Type": "video/mp4",
    };
    res.writeHead(206, head);
    file.pipe(res);
  } else {
    console.log("else..");
    const head = {
      "Content-Length": fileSize,
      "Content-Type": "video/mp4",
    };
    res.writeHead(200, head);
    fs.createReadStream(path).pipe(res);
  }
});

app.listen(8001, function () {
  console.log("App is running on port 3000");
});

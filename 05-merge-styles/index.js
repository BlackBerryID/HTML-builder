const { readdir } = require("fs/promises");
const { createReadStream, createWriteStream } = require("fs");
const path = require("path");
const EventEmitter = require("events");
const emitter = new EventEmitter();
const dirPath = path.join(__dirname, "styles");
const writableStream = createWriteStream(
  `${__dirname}/project-dist/bundle.css`
);

async function readDirectory(dirPath) {
  const files = await readdir(dirPath, { withFileTypes: true });
  return files;
}

function readFiles(files) {
  for (const file of files) {
    if (
      file.isFile() &&
      path.extname(`${__dirname}/styles/${file.name}`) === ".css"
    ) {
      const readableStream = createReadStream(
        `${dirPath}/${file.name}`,
        "utf-8"
      );
      let data = "";
      readableStream.on("data", (chunk) => (data += chunk));
      readableStream.on("end", () => {
        emitter.emit("fileLoaded", data);
      });
      readableStream.on("error", (error) => console.log(error.message));
    }
  }
}

function writeFile(data) {
  writableStream.write(`${data}\n`, (err) => {
    if (err) {
      console.log(err.message);
    }
  });
}

readDirectory(path.join(__dirname, "styles")).then((filesArr) =>
  readFiles(filesArr)
);

emitter.on("fileLoaded", (data) => writeFile(data));

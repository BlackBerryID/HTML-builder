const { readdir, mkdir, rm, copyFile } = require("fs/promises");
const { createReadStream, createWriteStream } = require("fs");
const path = require("path");
const EventEmitter = require("events");
const emitter = new EventEmitter();
let htmlData = "";
let componentsNames = [];

// put toghether html components

function readhtml() {
  const readhtmlStream = createReadStream(
    `${__dirname}/template.html`,
    "utf-8"
  );
  readhtmlStream.on("data", (chunk) => (htmlData += chunk));
  readhtmlStream.on("end", () =>
    makeDir()
      .then(() => readDir())
      .then(() => insertComponents())
  );
  readhtmlStream.on("error", (error) => console.log(error.message));
}

async function makeDir() {
  // await rm(
  //   `${__dirname}/project-dist`,
  //   { recursive: true, force: true },
  //   (err) => {
  //     if (err) {
  //       console.log(err.message);
  //     }
  //   }
  // );
  await mkdir(`${__dirname}/project-dist`, { recursive: true }, (err) => {
    if (err) {
      console.log(err.message);
    }
  });
}

async function readDir() {
  componentsNames = await readdir(`${__dirname}/components`);
  componentsNames = componentsNames.map((item) => item.replace(/\..+$/, ""));
}

function insertComponents() {
  if (!componentsNames.length) {
    writehtml();
    return;
  }
  const currentComponent = componentsNames.pop();
  let componentData = "";
  const readhtmlStream = createReadStream(
    `${__dirname}/components/${currentComponent}.html`,
    "utf-8"
  );
  readhtmlStream.on("data", (chunk) => (componentData += chunk));
  readhtmlStream.on("end", () => {
    htmlData = htmlData.replace(`{{${currentComponent}}}`, componentData);
    insertComponents();
  });
  readhtmlStream.on("error", (error) => console.log(error.message));
}

function writehtml() {
  const writehtmlStream = createWriteStream(
    `${__dirname}/project-dist/index.html`
  );
  writehtmlStream.write(htmlData, (err) => {
    if (err) {
      console.log(err.message);
    }
  });
}

readhtml();

// put together css styles

let cssData = "";
let i = 1;

async function readDirectory(dirPath) {
  const files = await readdir(dirPath);
  return files;
}

function readFiles(files) {
  for (const file of files) {
    const readableStream = createReadStream(
      `${__dirname}/styles/${file}`,
      "utf-8"
    );
    let data = "";
    readableStream.on("data", (chunk) => (data += chunk));
    readableStream.on("end", () => {
      cssData += `${data}\n`;
      if (i++ === files.length) emitter.emit("fileLoaded");
    });
    readableStream.on("error", (error) => console.log(error.message));
  }
}

function writeFile(data) {
  const writableStream = createWriteStream(
    `${__dirname}/project-dist/style.css`
  );
  writableStream.write(`${data}`, (err) => {
    if (err) {
      console.log(err.message);
    }
  });
}

readDirectory(path.join(__dirname, "styles")).then((filesArr) =>
  readFiles(filesArr)
);

emitter.on("fileLoaded", () => writeFile(cssData));

// copy assets

async function cloneFilesFromDir() {
  await rm(
    `${__dirname}/project-dist/assets`,
    { force: true, recursive: true },
    (err) => {
      if (err) {
        console.error(error.message);
      }
    }
  );
  await mkdir(
    `${__dirname}/project-dist/assets`,
    { recursive: true },
    (err) => {
      if (err) {
        console.log(err.message);
      }
    }
  );
  const nestedDirNames = await readdir(`${__dirname}/assets`);
  for (const nestedDir of nestedDirNames) {
    const files = await readdir(`${__dirname}/assets/${nestedDir}`);
    await mkdir(
      `${__dirname}/project-dist/assets/${nestedDir}`,
      { recursive: true },
      (err) => {
        if (err) {
          console.log(err.message);
        }
      }
    );
    for (const file of files) {
      await copyFile(
        `${__dirname}/assets/${nestedDir}/${file}`,
        `${__dirname}/project-dist/assets/${nestedDir}/${file}`
      );
    }
  }
}

cloneFilesFromDir();

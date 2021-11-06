const { readdir } = require("fs/promises");
const { stat } = require("fs");
const path = require("path");
const dirPath = path.join(__dirname, "secret-folder");

async function displayFilesFromDirectory() {
  const files = await readdir(dirPath);
  for (const file of files) {
    stat(path.join(dirPath, file), (err, stats) => {
      if (err) return console.error(err.message);
      if (stats.isFile()) {
        let fileParse = path.parse(file);
        console.log(
          `${fileParse.name} - ${fileParse.ext.replace(".", "")} - ${
            stats.size / 1000
          }kb`
        );
      }
    });
  }
}

displayFilesFromDirectory();

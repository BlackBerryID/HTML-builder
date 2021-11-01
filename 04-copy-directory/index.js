const { copyFile, mkdir, rmdir, readdir } = require("fs/promises");
const path = require("path");
const dirPath = path.join(__dirname, "files");

async function cloneFilesFromDir() {
  await rmdir(`04-copy-directory/files-copy`, { recursive: true }, (err) => {
    if (err) {
      console.error(error.message);
    }
  });
  await mkdir(`04-copy-directory/files-copy`, { recursive: true }, (err) => {
    if (err) {
      console.log(err.message);
    }
  });
  const files = await readdir(dirPath);
  for (const file of files) {
    await copyFile(
      `04-copy-directory/files/${file}`,
      `04-copy-directory/files-copy/${file}`
    );
  }
}

cloneFilesFromDir();

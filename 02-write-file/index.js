const { stdin, stdout, exit } = process;
const fs = require("fs");
const path = require("path");

const filePath = path.join(__dirname, "text.txt");
const output = fs.createWriteStream(filePath);

stdin.on("data", (data) => {
  let dataString = data.toString();
  dataString = dataString.replace(/[\r\n]/g, "");
  if (dataString === "exit") {
    exit();
  }

  output.write(data, (err) => {
    if (err) {
      console.log(err.message);
    }
  });
});

process.on("exit", () =>
  stdout.write(`Спасибо, что выбрали авиакомпанию NodeAirlines. До свиданья.\n`)
);

process.on("SIGINT", () => {
  exit();
});

stdout.write(`Здравствуйте. Пожалуйста, введите информацию для записи.\n`);

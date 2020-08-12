const fs = require("fs");
const path = require("path");

// create a temporary directory
const directory = fs.mkdtempSync("savvy-tmp");

// join the output file path together
const filepath = path.join(directory, "output");

// create a new file in the temporary directory
fs.writeFileSync(filepath, "Hello from node");

// read the contents from the file, logging to stdout
const contents = fs.readFileSync(filepath, "utf8");

console.log(contents);

// delete the temporary directory
fs.rmdirSync(directory, { recursive: true });

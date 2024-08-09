const targetDir = process.argv.slice(0, 1)[0];

const fs = require("fs");
const path = require("path");

function iterateFilesInDirectory(dirPath) {
  fs.readdir(dirPath, (err, files) => {
    if (err) {
      console.error("Could not list the directory.", err);
      process.exit(1);
    }

    files.forEach((file, index) => {
      const filePath = path.join(dirPath, file);

      fs.stat(filePath, (error, stat) => {
        if (error) {
          console.error("Error stating file.", error);
          return;
        }

        if (stat.isFile()) console.log("%s is a file.", filePath);
        else if (stat.isDirectory())
          console.log("%s is a directory.", filePath);
      });
    });
  });
}

iterateFilesInDirectory(targetDir);
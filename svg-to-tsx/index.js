const fs = require("fs").promises;
const path = require("path");

const args = process.argv.slice();
const targetDir = args[2];

const COPY_FILE_PATH = "./copy.txt";
const REGEX_WIDTH = /width=\"(.*?)\"/g;
const REGEX_HEIGHT = /height=\"(.*?)\"/g;
const REGEX_FILL = /fill=\"(.*?)\"/g;

const templateFirstLine = `export default ({ size = 20, color = "white" }: { size: number; color: string }) => (`;
const templateLastLine = `);`;

async function iterateFilesInDirectory(dirPath) {
  try {
    const files = await fs.readdir(dirPath);

    for (let file of files) {
      const filePath = path.join(dirPath, file);
      const stat = await fs.stat(filePath);

      if (stat.isFile() && filePath.endsWith(".svg")) {
        await fs.writeFile(COPY_FILE_PATH, "");
        await fs.copyFile(filePath, COPY_FILE_PATH);

        let content = await fs.readFile(COPY_FILE_PATH, "utf8");
        content = content.replace(REGEX_WIDTH, "width={size}");
        content = content.replace(REGEX_HEIGHT, "height={size}");
        content = content.replace(REGEX_FILL, "fill={color}");
        const fullContent =
          templateFirstLine + "\n" + content + "\n" + templateLastLine;

        await fs.writeFile(filePath, fullContent);
        await fs.rename(filePath, filePath.replace(".svg", ".tsx"));
      }
    }
  } catch (err) {
    console.error("Could not list the directory.", err);
    process.exit(1);
  }
}

if (targetDir) {
  iterateFilesInDirectory(targetDir);
} else {
  console.error("Please provide a directory path as the first arg");
}

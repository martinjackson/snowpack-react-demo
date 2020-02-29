'use strict'

const fs = require('fs')
const path = require('path')
const mime = require('mime')

function scanDir(files, baseDir, subDir) {
  console.log(`scanning-${baseDir}-${subDir}-`);

  const newDir = path.join(baseDir, subDir);
  fs.readdirSync(newDir).forEach(fileName => {

    const filePath = path.join(baseDir, subDir, fileName);
    let stat
    try {
        stat = fs.lstatSync(filePath);
    } catch (e) {
        console.log(`fs.lstatSync(${filePath})`);
        throw e;
    }

    if (stat.isDirectory()) {
       scanDir(files, baseDir, fileName)
    } else {
      const fileDescriptor = fs.openSync(filePath, "r");
      const contentType = mime.getType(filePath);

      const fullName = path.join(subDir, fileName);

      files.set(`/${fullName}`, {
        fileDescriptor,
        headers: {
          "content-length": stat.size,
          "last-modified": stat.mtime.toUTCString(),
          "content-type": contentType
        }
      });
    }
  });
}

function getFiles (baseDir) {
  const files = new Map()

  scanDir(files, baseDir, '')

  return files
}

module.exports = {
  getFiles
}

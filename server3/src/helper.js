'use strict'

// taken from
// https://blog.risingstack.com/node-js-http-2-push/
// https://github.com/RisingStack/http2-push-example
// then modified to handle subdirectories
// then modified to use spdy -- to be compatable with express and express-graphql


const fs = require('fs')
const path = require('path')
const mime = require('mime')

function scanDir(files, baseDir, subDir) {
  const newDir = path.join(baseDir, subDir);
  let list = []
  try {
      list = fs.readdirSync(newDir)
  } catch(err) {
    console.log('err:', err.message);
    return
  }

  list.forEach(fileName => {

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
        filePath,
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

  console.log(`scanning ${baseDir}`);

  scanDir(files, baseDir, '')

  return files
}

module.exports = {
  getFiles
}

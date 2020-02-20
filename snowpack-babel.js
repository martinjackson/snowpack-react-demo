const fs = require('fs')
const path = require('path');
const babel = require("@babel/core");
const chokidar = require('chokidar');

var colors = require('colors');   // extending String.prototype


const verbose = false;

// TODO pull these from command line switches like babel does
const inDir = 'src'
const outDir = 'public'

const log = (msg) => {
  console.log('snowpack-babel:'.green, msg.green)
}

const verboseLog = (msg) => {
  if (verbose)
     console.log('snowpack-babel:'.gray, msg.gray)
}


const errLog = (msg) => {
  console.log('snowpack-babel Error:'.brightRed, msg.brightRed)
}


const watcher = chokidar.watch(inDir, {
  ignored: /(^|[\/\\])\../, // ignore dotfiles
  persistent: true
});

// Add event listeners.
watcher
  .on('add',    path  => { processFile(path, inDir, outDir) })
  .on('change', path  => { processFile(path, inDir, outDir) })
  .on('unlink', fname => { removeFile(path, inDir, outDir) })
  .on('error', error  => err(`watch error: ${error}`))
  .on('ready', () => log(`watching ${inDir} -> ${outDir}`))

const calcRelFile = (fname, inDir) => {
    const subDir = path.dirname(fname)
    if (fname.startsWith(inDir)) {
      fname = fname.substring(inDir.length);
    }

    if (fname.startsWith('/')) {
      fname = fname.substring(1);
    }

    return fname
  }

const removeFile = (fname, inDir, outDir) => {
    const relFname = calcRelFile(fname, inDir)
    const outFile = path.join(outDir, relFname)
    fs.unlink(outFile, (err) => {
      if (err) throw err;
      verboseLog(`remove ${fname} -> ${outFile}`)
      })
}

const dirCheck = (outFile) => {
  try {
    fs.mkdirSync(path.dirname(outFile));
  } catch (error) {
    if (error.code !== "EEXIST") {
      throw error;
    }
  }
}

const copyFile = (fname, outFile) => {
    dirCheck(outFile)
    fs.copyFile(fname, outFile, (err) => {
      if (err) {
        err(`ERR: ${fname} ==> ${outFile}    ERR:${err}`);
      }
      verboseLog(`${fname} ==> ${outFile}`);
    });
}

const writeFileAndMkDir = (outFile, content) => {
  dirCheck(outFile)
  fs.writeFileSync(outFile, content);
};


const okToProcess = (fname) => {
    return (fname.endsWith('.js') || fname.endsWith('.ts') || fname.endsWith('.jsx'))
  }

const processFile = (fname, inDir, outDir) => {

  const relFname = calcRelFile(fname, inDir)
  const outFile = path.join(outDir, relFname)

  if (!okToProcess(fname)) {
      copyFile(fname, outFile)
      if (fname.endsWith('.css'))
         injectCssInto(relFname, path.join(inDir,'index.html'))
      return
    }

    const options ={}
    babel.transformFile(fname, options, (err, result) => {
      if (err) {
        const row = (err.loc) ? err.loc.line : '?'
        const col = (err.loc) ? err.loc.column : '?'

        const firstLine = err.stack.split('\n')[0]
        const [ErrorType, fullfname, desc] = firstLine.split(/[:\(]/)
        if (!desc || !err.loc)
          errLog(`${fname} ${err.stack}`);
        else
          errLog(`${fname}:${row}:${col}  ${ErrorType}: ${desc}`)
        }
      else {
        writeFileAndMkDir(outFile, result.code)
        verboseLog(`${fname} --> ${outFile}`);

        // result: { code, map, ast }
      }
    });

}

const injectCssInto = (cssFile, htmlFile) => {
    const link = `<link rel="stylesheet" type="text/css" href="${cssFile}" />`
    const headEnd = '</head>'

    const lines = fs.readFileSync(htmlFile, 'utf-8').split(/\r?\n/)
    let i = lines.findIndex(element => element.includes(cssFile))
    if (i == -1) {  // css is missing from html=
      i = lines.findIndex(element => element.includes(headEnd))
      if (i == -1) {
        console.err('Unable to find ${headEnd} in ${htmlFile} in order to insert ${link}')
      } else {
        lines.splice(i, 0, link);  // insert at i with zero deletes
        try {
          fs.writeFileSync(htmlFile, lines.join('\n'));
          log(`updated ${htmlFile} with ${cssFile}`)
        } catch(err) {
          console.error(err);
        }
      }
    }
}

// Notes:
// This creates double events     fs.watch(inDir, (eventType, filename) => {
// using require('chokidar'); instead

// Why?
// because
//        "watch": "unbuffer babel src --out-dir lib --watch --copy-files --verbose 2>&1 | grep --color=always -v node_modules",
// almost did it...but the filename error message (row,col) was not vscode Alt-click-able like filename:row:col error message

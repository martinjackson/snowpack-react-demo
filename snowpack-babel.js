const fs = require('fs')
const path = require('path');
const babel = require("@babel/core");
const chokidar = require('chokidar');

const writeFileAndMkDir = require('./writeFileAndMkDir')

// TODO pull these from command line switches like babel does
const inDir = './src'
const outDir = './public'

// Something to use when events are received.
const log = console.log.bind(console);


const watcher = chokidar.watch(inDir, {
  ignored: /(^|[\/\\])\../, // ignore dotfiles
  persistent: true
});

// Add event listeners.
watcher
  .on('add',    path  => { processFile(path,outDir) })     // log(`File ${path} has been added`)
  .on('change', path  => { processFile(path,outDir) })     // log(`File ${path} has been changed`)
  .on('unlink', fname => { removeFile(path,outDir) })
  .on('error', error  => log(`Watcher error: ${error}`))
  .on('ready', () => log('Initial scan complete. Ready for changes'))

const removeFile = (fname,outDir) => {
    const outFile = path.join(outDir, path.basename(fname))
    fs.unlink(outFile, (err) => {
      if (err) throw err;
      log(`remove ${fname} -> ${outFile}`)
      })
    }

const copyFile = (fname, outFile) => {
    fs.copyFile(fname, outFile, (err) => {
      if (err) {
        log(`ERR: ${fname} ==> ${outFile}    ERR:${err}`);
      }
      log(`${fname} ==> ${outFile}`);
    });
  }

const okToProcess = (fname) => {
    return (fname.endsWith('.js') || fname.endsWith('.ts') || fname.endsWith('.jsx'))
  }

const processFile = (fname, outDir) => {

    if (!okToProcess(fname)) {
      const outFile = path.join(outDir, path.basename(fname))
      copyFile(fname, outFile)
      if (fname.endsWith('.css'))
         injectCssInto(outFile, path.join(inDir,'index.html'))
      return
    }

    const options ={}
    babel.transformFile(fname, options, (err, result) => {
      if (err) {
        const row = (err.loc) ? err.loc.line : '?'
        const col = (err.loc) ? err.loc.column : '?'

        const firstLine = err.stack.split('\n')[0]
        const [ErrorType, fullfname, desc] = firstLine.split(/[:\(]/)
        console.log(`${fname}:${row}:${col}  ${ErrorType}: ${desc}`)
        }
      else {
        const outFile = path.join(outDir, path.basename(fname))
        writeFileAndMkDir(outFile, result.code)
        console.log(`${fname} --> ${outFile}`);

        // result: { code, map, ast }
      }
    });

}

const injectCssInto = (cssFile, htmlFile) => {
    const link = `<link rel="stylesheet" type="text/css" href="/${cssFile}">`
    const headEnd = '</head>'

    const lines = fs.readFileSync(htmlFile, 'utf-8').split(/\r?\n/)
    let i = lines.findIndex(element => element.includes(link))
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

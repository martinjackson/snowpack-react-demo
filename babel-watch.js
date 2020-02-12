const fs = require('fs')
const path = require('path');
const babel = require("@babel/core");
const chokidar = require('chokidar');

const writeFileAndMkDir = require('./writeFileAndMkDir')

const inDir = './src'
const outDir = './lib'

const watcher = chokidar.watch(inDir, {
  ignored: /(^|[\/\\])\../, // ignore dotfiles
  persistent: true
});

// Something to use when events are received.
const log = console.log.bind(console);
// Add event listeners.
watcher
  .on('add', path => {
    // log(`File ${path} has been added`)
    processFile(path,outDir)
    })
  .on('change', path => {
    // log(`File ${path} has been changed`)
    processFile(path,outDir)
    })
  .on('unlink', fname => {
    const outFile = path.join(outDir, path.basename(fname))
    fs.unlink(fname, (err) => {
      if (err) {
        console.error(err)
        return
      }
      log(`remove ${fname} -> ${outFile}`)
      })
    })
  .on('error', error => log(`Watcher error: ${error}`))
  .on('ready', () => log('Initial scan complete. Ready for changes'))


  const copyFile = (fname, outDir) => {
    const outFile = path.join(outDir, path.basename(fname))
    fs.copyFile(fname, outFile, (err) => {
      if (err) throw err;
      console.log(`cp ${fname} --> ${outFile}`);
    });
  }

  const okToProcess = (fname) => {
    return (fname.endsWith('.js') || fname.endsWith('.ts') || fname.endsWith('.jsx'))
  }

  const processFile = (fname, outDir) => {

    if (!okToProcess(fname)) {
      copyFile(fname, outDir)
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

/*
double events

// eventType could be either 'rename' or 'change'. new file event and delete
// also generally emit 'rename'

fs.watch(inDir, (eventType, filename) => {
  const fname = path.join(inDir, filename)
  console.log(`${eventType} ${fname}`);
  processFile(fname, outDir)
  })
*/

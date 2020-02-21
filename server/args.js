
const {ArgumentParser} = require('argparse');

const version = '1.0.0'
const description = 'Fastify-example nodeJS http2 server for performance testing'

const processArgs = (version, description)
const argParser = new ArgumentParser({
  version,
  description,
  addHelp: true,
});
argParser.addArgument(['--port', '-p'], {
  type: Number,
  defaultValue: 8080,
  help: 'Port number. Defaults to 8080.',
});
argParser.addArgument(['--http2', '--h2'], {
  nargs: 0,
  help: 'Use HTTP/2. Defaults to true.',
});
argParser.addArgument(['--auto-push', '--ap'], {
  nargs: 0,
  dest: 'autoPush',
  help: 'Enable auto-push. Works only with --http2.',
});


const args = argParser.parseArgs();
if (args.autoPush && !args.http2) {
  // console.warn('--auto-push is supported only with --http2. HTTP/2 turned on');
  args.http2 = true;
}

module.exports = args;

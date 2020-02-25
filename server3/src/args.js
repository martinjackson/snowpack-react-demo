
const path = require('path')
const {ArgumentParser} = require('argparse');

const version = '1.0.0'
const description = 'nodeJS http2 server for performance testing'

const processArgs = (version, description)
const argParser = new ArgumentParser({
  version,
  description,
  addHelp: true,
});
argParser.addArgument(['--port', '-p'], {
  type: Number,
  defaultValue: 4000,
  help: 'Port number. Defaults to 4000.',
});
argParser.addArgument(['--home'], {
  type: String,
  defaultValue: '../public',
  help: "Home directory to serve assets, equates to / url. Defaults to '../public'.",
});

const args = argParser.parseArgs();

if (!args.home.startsWith('/')) {             // Relative Path detected
  args.home = path.join(__dirname, args.home)
}


module.exports = args;

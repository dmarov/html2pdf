const yaml = require('js-yaml');
const yargs = require('yargs');
const fs = require('fs');

const args = yargs
    .option('config', {
        default: 'config.yml',
    })
    .option('port', {
        demandOption: true,
        alias: 'p'
    })
    .option('public-key', {
        demandOption: true,
        alias: 'k',
    })
    .strict(true)
    .wrap(null)
    .config('config', function(configFile) {

        let content = fs.readFileSync(configFile, 'utf-8');
        let obj = yaml.safeLoad(content);

        return obj;

    })
    .version(`0.0.1`)   
    .parse();

module.exports = args;

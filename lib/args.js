const yargs = require('yargs');

const args = yargs
    .option('host', {
        demandOption: true,
        default: 'localhost',
        alias: 'h',
    })
    .option('port', {
        demandOption: true,
        alias: 'p'
    })
    .option('public-key', {
        demandOption: true,
        alias: 'pub',
    })
    .strict(true)
    .wrap(null)
    .version(`0.0.1`)   
    .example(`$0 -p=3004 --pub=keys/public.key`)
    .parse();

module.exports = args;

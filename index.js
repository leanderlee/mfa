#!/usr/local/bin/node
const program = require('commander');
const OTP = require('otp');
const DB = require('@diam/json-db');
const clipboard = require('copy-paste');
const pkg = require(__dirname + '/package.json');

const FILE = __dirname + '/.keys';

program
  .command('save <service> [id]')
  .description('Save key to DB')
  .action((service, id) => {
    if (service === 'save' || service === 'ls') {
      throw new Error('Cannot save, reserved keyword.');
    }
    const db = new DB(FILE);
    const data = db.readSync() || {};
    clipboard.paste((err, copied) => {
      const secret = (id || copied).replace(/\s+/g, '');
      if (!secret) {
        throw new Error('Nothing to save.');
      }
      data[service] = secret;
      db.writeSync(data);
      console.log('Saved "%s" to disk.', service);
    });
  });

program
  .command('ls')
  .description('List saved services')
  .action((service, id) => {
    const db = new DB(FILE);
    const data = db.readSync() || {};
    Object.keys(data).forEach(service => console.log(service));
  });

program
  .option('--no-copy')
  .description('Show mfa for coinbase')
  .action((service, cmd) => {
    const db = new DB(FILE);
    const data = db.readSync() || {};
    const secret = data[service];
    if (!secret) {
      throw new Error(`Unrecognized "${service}".`);
    }
    const otp = OTP({ secret });
    const token = otp.totp();
    console.log(token);
    if (cmd.copy) {
      clipboard.copy(token);
    }
  });

program
  .version(pkg.version)
  .usage('[save] <service> --no-copy')
  .parse(process.argv);

if (program.args.length === 0) {
  program.outputHelp();
}

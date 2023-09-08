// <.deploy.config.js>
// const user = ''
// const email = ''
// const account_id = ''
// const api_key = ''
// const worker_name = ''
// module.exports = { user, email, account_id, api_key, worker_name };
const axios = require("axios");
const fs = require("fs");

let config;
try {
  config = require('./.deploy.config2.js');
} catch (e) {
  config = {
    user: process.env['deploy_config_user'],
    email: process.env['deploy_config_email'],
    account_id: process.env['deploy_config_account_id'],
    api_key: process.env['deploy_config_api_key'],
    worker_name: process.env['deploy_config_worker_name']
  }
}

const {
  user,
  email,
  account_id,
  api_key,
  worker_name
} = config;



axios({
  method: 'PUT',
  data: fs.readFileSync('worker.js', 'utf-8'),
  headers: {
    "Content-Type": 'application/javascript',
    'Authorization': 'Bearer' + user,
    'X-Auth-Email': email,
    'X-Auth-Key': api_key
  },
  url: `https://api.cloudflare.com/client/v4/accounts/${account_id}/workers/scripts/${worker_name}`
}).then(res => {
  console.log(res.data);
}).catch(err => {
  console.log(err);
}).finally(() => {
  console.log('// finally');
});
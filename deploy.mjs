// <.deploy.config.mjs>
// const user = ''
// const email = ''
// const account_id = ''
// const api_key = ''
// const worker_name = ''
// export default { user, email, account_id, api_key, worker_name}

import axios from "axios";
import fs from "fs";

import config from './.deploy.config.mjs'

const {
    user,
    email,
    account_id,
    api_key,
    worker_name,
} = config

axios({
  method: 'PUT',
  data: fs.readFileSync('dist.js', 'utf-8'),
  headers: {
    "Content-Type": 'application/javascript',
    'Authorization': 'Bearer' + user,
    'X-Auth-Email': email,
    'X-Auth-Key': api_key
  },
  url: `https://api.cloudflare.com/client/v4/accounts/${account_id}/workers/scripts/${worker_name}`
})
.then(res=>{
    let data = res.data
    delete data.result.script
    console.log(data)

})
  .catch(err=>{
    console.log(err);
})
.finally(()=>{
    console.log('// finally');
  })


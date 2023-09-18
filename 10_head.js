/**
 * TG bot handle on cloudflare worker
 *
 *
 * Init Setting:
 *    curl https://api.telegram.org/bot$TG_BOT_TOKEN/setWebhook?url=$CF_WORKER_URL
 *    config woeker env TG_BOT_TOKEN
 *
 * @ctime: #BUILD_TIME
 */

const api_base = `https://api.telegram.org/bot${TG_BOT_TOKEN}`

addEventListener("fetch", event => {
  event.respondWith(handleRequest(event.request))
})

async function handleRequest(request) {
  if (request.method === "GET") {
    return new Response("worker alive! \nbuild at #BUILD_TIME")
  }
  if (request.method === "POST") {
    const payload = await request.json()
    request.payload = payload
    // Getting the POST request JSON payload
    if ('message' in payload) {
      // Checking if the payload comes from Telegram
      const chat_id = payload.message.chat.id

      const reply = async (content) => {
        let data = {
          chat_id,
          text: content, // TODO: 处理复合类型的消息回复
        }

        return await fetch(`${api_base}/sendMessage`,{
          method:'POST',
          body: JSON.stringify(data),
          headers:{
            "Content-Type": 'application/json'
          }
        }).then(resp => resp.json())
        

      }
      try {
        await onMessage(payload.message, reply, request)
      } catch (e) {
        await reply('Error: ' + e)
      }
    }
  }
  return new Response("OK") // Doesn't really matter
}


const _command_defs = {}
async function cmd_run(cmd, reply, req) {
  // TODO: 处理引号, 使用
  let argv = cmd.split(/\s+/)
  cmd = argv[0]
  argv.shift()

  if (_command_defs[cmd]) {
    //   try {
    return await _command_defs[cmd].run(argv, reply, req)
    //   } catch (e) {
    //      return await reply('Error: '+e)

    //   }
  }

  return await reply('command not found: ' + cmd)
}

function cmd_def(command, option, callback) {
  if (typeof option == 'function') {
    callback = option
    option = {}
  }

  let { help, usage, run } = option
  run = run || callback

  _command_defs[command] = {
    command,
    run,
    help,
    usage,
  }
}


function delay(sec) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve('delay: ' + sec)
    }, sec)
  })
}




async function tick(args, reply) {
  let [url, count = 10, step = 4] = args
  count = parseInt(count)
  step = parseInt(step)
  if (url) {
    let origin = 'https://' + new URL(url).hostname
    await reply(`ping ${url} (count=${count}) (step=${step})`)

    for (let i = 0; i < count; i++) {
      // console.log(i);
      let tasks = []
      let t1 = new Date().getTime()
      await reply(`count - ` + i + ' ...')
      for (let j = 0; j < step; j++) {
        let t = fetch(url, {
          timeout: 0,
          headers: {
            ...mkheaders(url)
            // 'Connection': 'keep-alive',
            // 'sec-ch-ua': '"Not A;Brand";v="99", "Chromium";v="98", "Google Chrome";v="98"',
            // 'sec-ch-ua-mobile': '?0',
            // 'sec-ch-ua-platform': '"Linux"',
            // 'DNT': '1',
            // 'Upgrade-Insecure-Requests': '1',
            // 'User-Agent': 'Mozilla/5.0 (X11; Debian; Linux x86_64; rv:85.0)  AppleWebKit/537.36 (KHTML, like Gecko) Chrome/98.0.4758.87 Safari/537.36',
            // 'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
            // 'origin': origin,
            // 'referer': url,
            // 'Sec-Fetch-Site': 'none',
            // 'Sec-Fetch-Mode': 'navigate',
            // 'Sec-Fetch-User': '?1',
            // 'Sec-Fetch-Dest': 'document',
            // 'Accept-Encoding': 'gzip, deflate, br',
            // 'Accept-Language': 'en-US,en;q=0.9',
            // zh-hans,zh-cn,zh,
          },
        }).then(async res => {
          let text = await res.text()
          // 验证内容
          // console.log(res.status, text.length);
          // console.log(res.headers);
          // console.log(text);
        })
        tasks.push(t)
        await delay2(2*Math.random())

      }

      try {
        await Promise.all(tasks)
        await delay2(2*Math.random())
      } finally {
        let t2 = new Date().getTime()
        let t3 = (t2 - t1) / 1000
        await reply(`count - ` + i + ' done. \n// t=' + t3)

      }
    }

    return

  }

  return await reply(`alive`)
}


function mkheaders(referer) {
  return {
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
    'Accept-Encoding': 'gzip, deflate, br',
    'Accept-Language': 'zh-CN,zh;q=0.9',
    'Cache-Control': 'max-age=0',
    'Dnt': '1',
    'Referer':referer,
    'Sec-Ch-Ua': '"Google Chrome";v="117", "Not;A=Brand";v="8", "Chromium";v="117"',
    'Sec-Ch-Ua-Mobile': '?0',
    'Sec-Ch-Ua-Platform': '"Windows"',
    'Sec-Fetch-Dest': 'document',
    'Sec-Fetch-Mode': 'navigate',
    'Sec-Fetch-Site': 'same-origin',
    'Sec-Fetch-User': '?1',
    'Upgrade-Insecure-Requests': '1',
    'User-Agent': 'Mozilla/5.0 (Windows NT 11.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/117.0.0.0 Safari/537.36',
  }
}

async function delay2(sec){
  return await new Promise((resolve=>{
    setTimeout(resolve,parseInt(sec*1000))
  }))
}

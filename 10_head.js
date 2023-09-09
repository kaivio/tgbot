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
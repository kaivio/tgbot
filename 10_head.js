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


addEventListener("fetch", event => {
  event.respondWith(handleRequest(event.request))
})

async function handleRequest(request) {
  if (request.method === "GET") {
    return  new Response("worker alive! \nbuild at #BUILD_TIME")
  }
  if (request.method === "POST") {
    const payload = await request.json()
    // Getting the POST request JSON payload
    if ('message' in payload) {
      // Checking if the payload comes from Telegram
      const chatId = payload.message.chat.id
      const replay = onMessage(payload.message, payload)

      // TODO: 处理复合类型的消息回复
      const text = typeof replay == typeof ''? replay: replay.message.text
      const url = `https://api.telegram.org/bot${TG_BOT_TOKEN}/sendMessage?chat_id=${chatId}&text=${text}`
      const data = await fetch(url).then(resp => resp.json())
      // Calling the API endpoint to send a telegram message
    }
  }
  return new Response("OK") // Doesn't really matter
}


const _command_defs = {}
function cmd_run(cmd, msg, payload){
  let argv = cmd.split(/\s+/)
  cmd = argv[0]
  argv.shift()

  if(_command_defs[cmd]){
    try{
      return _command_defs[cmd].run(argv, msg, payload)
    }catch(e){
      return 'Error: '+e.toString()
    }
  }
  return 'command not found: '+ cmd
}

function cmd_def(command, option, callback){
  if(typeof option == 'function'){
    callback = option
    option = {}
  }

  let {help, usage, run} = option
  run = run || callback

  _command_defs[command] = {
    command,
    run,
    help,
    usage,
  }
}

function onMessage(msg, payload){
  let {text} = msg
  if(text && text.startsWith('/')){
    return cmd_run(text)
  }

  return '现在无法此消息'
}


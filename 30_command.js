
cmd_def('/start', async (args, reply) => {
  return await reply(`欢迎！

  功能还在开发中，敬请期待。
  
  `)
})

cmd_def('/ping', async (args, reply) => {
  return await reply(`alive`)
})

cmd_def('/test', async (args, reply) => {
  return await reply(`test...`)
})

cmd_def('/echo', async (args, reply) => {
  return await reply(args.join(' '))
})

cmd_def('/debug', async (args, reply, req) => {
  let res = reply(`debug info:
version: #COMMIT_HASH
update message: #COMMIT_MSG
update time: #COMMIT_TIME
message info:
${JSON.stringify(req.payload, ' ', 2)}
`)
  //
  return await res
})



cmd_def('/log', async (args, reply) => {
  let id = 'log:' + new Date().getTime()
  let msg = args.join(' ')
  if (msg) {
    await KV.put(id, msg)
    // await KV.put(id, msg, {expirationTtl: secondsFromNow})
    reply("已记录")
  } else {
    reply(JSON.stringify('list log...'))

    let keys = (await KV.list({ prefix: "log:" })).keys
    let s = ''
    for (let k of keys) {
      k = k.name
      s += `[${k}] ` + await KV.get(k) + '\n'
    }
    
    await delay(1)
    reply(s)
  }
})

function delay(sec){
  return new Promise((resolve, reject)=>{
    setTimeout(()=>{
      resolve('delay: '+sec)
    }, sec)
  })
}



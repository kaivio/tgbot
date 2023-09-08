
cmd_def('/start', (args) => {
  return `欢迎！

功能还在开发中，敬请期待。
`
})

cmd_def('/ping', (args, reply) => {
  return `alive`
})

cmd_def('/test', (args, reply) => {
  return `test alive`
})

cmd_def('/echo', (args, reply) => {
  return args.join(' ')
})

cmd_def('/debug', async (args, reply, req) => {
  const payload = await req.json()

  let res = reply(`debug info:
version: #COMMIT_HASH
update message: #COMMIT_MSG
update time: #COMMIT_TIME
message info:
${JSON.stringify(payload, ' ', 2)}
`)
  //
  return res
})



cmd_def('/log', async (args, reply) => {
  let id = 'log:' + new Date().getTime()
  let msg = args.join(' ')
  if (msg) {
    await KV.put(id, msg)
    return reply("已记录")
  }else{
    return reply("(列出所有记录)")
  }
})




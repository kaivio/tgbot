
cmd_def('/start', (args)=>{
  return `欢迎！

功能还在开发中，敬请期待。
`
})

cmd_def('/ping', (args)=>{
  return `alive`
})

cmd_def('/test', (args)=>{
  return `test alive`
})

cmd_def('/echo', (args)=>{
  return args.join(' ')
})

cmd_def('/debug', (args, msg, payload)=>{
  return `debug info:
version: #COMMIT_HASH
update message: #COMMIT_MSG
update time: #COMMIT_TIME
message info:
${JSON.stringify(msg, ' ', 2)}
`
})






async function onMessage(msg, reply, req){
  let {text} = msg
  if(text && text.startsWith('/')){
    return await cmd_run(text, reply, req)
  }

 
  return await reply('现在无法处理此消息')
}

function onMessage(msg, payload){
  let {text} = msg
  if(text && text.startsWith('/')){
    return cmd_run(text)
  }

  return '现在无法此消息'
}
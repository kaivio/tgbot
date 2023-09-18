
cmd_def('/start', async (args, reply) => {
  return await reply(`欢迎！

  功能还在开发中，敬请期待。
  
  `)
})

cmd_def('/ping', async (args, reply) => {
  let [url, count = 10, step = 4] = args
  if (url) {
    let origin = 'https://' + new URL(url).hostname
    for (let i; i < count; i++) {
      let tasks = []
      let t1 = new Date().getTime()
      await reply(`count - ` + i + ' ...')
      for (let j; j < step; j++) {
        let t = fetch(url, {
          headers: {
            'Connection': 'keep-alive',
            'sec-ch-ua': '"Not A;Brand";v="99", "Chromium";v="98", "Google Chrome";v="98"',
            'sec-ch-ua-mobile': '?0',
            'sec-ch-ua-platform': '"Linux"',
            'DNT': '1',
            'Upgrade-Insecure-Requests': '1',
            'User-Agent': 'Mozilla/5.0 (X11; Debian; Linux x86_64; rv:85.0)  AppleWebKit/537.36 (KHTML, like Gecko) Chrome/98.0.4758.87 Safari/537.36',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
            'origin': origin,
            'referer': url,
            'Sec-Fetch-Site': 'same-site',
            'Sec-Fetch-Mode': 'navigate',
            'Sec-Fetch-User': '?1',
            'Sec-Fetch-Dest': 'document',
            'Accept-Encoding': 'gzip, deflate, br',
            'Accept-Language': 'zh-hans,zh-cn,zh,en-US,en;q=0.9',
          }

        })

        tasks.push(t)
      }

      try {
        await Promise.all(tasks)
      } finally {
        let t2 = new Date().getTime()
        let t3 = (t2 - t1) / 1000
        await reply(`count - ` + i + ' done. \n// t=' + t3)

      }
    }

    return await reply(`ping ${url} (count=${count}) (step=${step})`)

  }

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




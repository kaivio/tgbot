const simpleGit = require('simple-git');
const fs = require('fs')

const git = simpleGit(process.cwd(), { binary: '.git' })

function cat(file) {
  return fs.readFileSync(file, 'utf-8')
}

let template = `
${cat('10_head.js')}

${cat('20_message.js')}

${cat('30_command.js')}


`


const gitlog = require("gitlog").default;

const options = {
  repo: __dirname,
  number: 1,
  fields: ["hash", "abbrevHash", "subject", "authorName", "authorDate"],
  execOptions: { maxBuffer: 1000 * 1024 },
};

// Synchronous
const commit = gitlog(options)[0];
console.log(commit);


let reps = {
  '#BUILD_TIME': new Date().toISOString(),
  '#COMMIT_TIME': commit.authorDate,
  '#COMMIT_HASH': commit.abbrevHash,
  '#COMMIT_MSG': commit.subject,
}

for (let i in reps) {
  template = template.replaceAll(i, reps[i])
}

fs.writeFileSync('dist.js', template)
console.log('// done.');
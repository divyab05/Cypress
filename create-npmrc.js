const fs = require('fs');
const npmrc = `.npmrc`;

if (fs.existsSync(npmrc)) {
  log('npmrc file already exists...');
} else if (!process.env.GRP_NEXUS_NPM_TOKEN) {
  warn(
    'Environment variable GRP_NEXUS_NPM_TOKEN is not set.' + 'npmrc file will not be created and npm install may fail..'
  );
} else {
  try {
    fs.writeFileSync(
      npmrc,
      `@pb-design-studio:registry=https://nexus.pitneycloud.com/repository/npmjs-repos/
@sendtech-ui:registry=https://nexus.pitneycloud.com/repository/npmjs-repos/
always-auth=true
//nexus.pitneycloud.com/repository/npmjs-repos/:_auth="${process.env.GRP_NEXUS_NPM_TOKEN}"
`
    );
    success('npmrc file created.');
  } catch (e) {
    error('Error occurred while creating npmrc file.');
  }
}

function error(...args) {
  console.log('\x1b[31m', ...args, '\x1b[0m');
}

function success(...args) {
  console.log('\x1b[32m', ...args, "\x1b[0m'");
}

function warn(...args) {
  console.log('\x1b[33m', ...args, '\x1b[0m');
}

function log(...args) {
  console.log('\x1b[34m', ...args, '\x1b[0m');
}

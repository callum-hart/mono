const fs = require('fs');


const CONFIG_PATH = `${process.cwd()}/monoConfig.json`;


const isValid = () => {
  getConfig().then(config => {
    console.log(config);
  }, error => {
    console.log(`config not found, error: ${error}`);
  });
}

const getConfig = () => {
  return new Promise((resolve, reject) => {
    try {
      resolve(JSON.parse(fs.readFileSync(CONFIG_PATH)));
    } catch(e) {
      reject(e);
    }
  })
}

module.exports = { isValid };
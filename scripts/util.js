const fs = require('fs');

const getAllTargets = function () {
  return fs.readdirSync('packages').filter((dir) => {
    const targetDir = `packages/${dir}`;

    if (!fs.statSync(targetDir).isDirectory()) {
      return false;
    }

    return true;
  });
};

module.exports = {
  getAllTargets,
};

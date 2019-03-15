const {existsSync, mkdirSync } = require('fs');

const prepareDir = async (dir) => {
    if (!existsSync(dir)){
        mkdirSync(dir);
    }
}

exports.prepareDir = prepareDir;
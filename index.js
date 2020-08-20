
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const QN = require('qn');
const GhostStorageBase = require('ghost-storage-base');

function fixed2(value) {
  if (value >= 0 && value <= 9) {
    return `0${value}`;
  }

  return `${value}`;
}

function fixed3(value) {
  if (value >= 0 && value <= 9) {
    return `00${value}`;
  }

  if (value >= 10 && value <= 99) {
    return `0${value}`;
  }

  return `${value}`;
}

function fileMd5(filepath) {
  return new Promise((resolve, reject) => {
    const output = crypto.createHash('md5');
    const input = fs.createReadStream(filepath);

    input.on('error', (err) => {
      reject(err);
    })

    output.once('readable', () => {
      resolve(output.read().toString('hex'));
    });

    input.pipe(output);
  });
}

function generateFileKey(file, template) {
  template = template || 'ghost-storage/{md5}';
  const ext = path.extname(file.name);
  const basename = path.basename(file.name, ext);
  const date = new Date();

  if (/\[ext\]/g.test(template)) {
    template = template.replace(/\[ext\]/g, ext);
  }

  if (/\[name\]/g.test(template)) {
    template = template.replace(/\[name\]/g, basename);
  }

  if (/\[year\]/g.test(template)) {
    template = template.replace(/\[year\]/g, date.getFullYear());
  }

  if (/\[month\]/g.test(template)) {
    template = template.replace(/\[month\]/g, fixed2(date.getMonth() + 1));
  }

  if (/\[day\]/g.test(template)) {
    template = template.replace(/\[day\]/g, fixed2(date.getDate()));
  }

  if (/\[hour\]/g.test(template)) {
    template = template.replace(/\[hour\]/g, fixed2(date.getHours()));
  }

  if (/\[minute\]/g.test(template)) {
    template = template.replace(/\[minute\]/g, fixed2(date.getMinutes()));
  }

  if (/\[second\]/g.test(template)) {
    template = template.replace(/\[second\]/g, fixed2(date.getSeconds()));
  }

  if (/\[millisecond\]/g.test(template)) {
    template = template.replace(/\[millisecond\]/g, fixed3(date.getMilliseconds()));
  }

  if (/\[timestamp\]/g.test(template)) {
    template = template.replace(/\[timestamp\]/g, Date.now());
  }

  if (/\[md5\]/g.test(template)) {
    return fileMd5(file.path).then((md5String) => {
      return template.replace(/\[md5\]/g, md5String);
    });
  }

  return Promise.resolve(template);
}

class GhostStorageQn extends GhostStorageBase {
  constructor(options) {
    super(options);

    this.options = options || {};
    this.qnClient = QN.create(this.options);
  }

  save(file, targetDir) {
    return generateFileKey(file, this.options.template).then((key) => {
      return new Promise((resolve, reject) => {
        this.qnClient.uploadFile(file.path, { key }, (err, result) => {
          if (err) {
            return reject(err);
          }

          resolve(result.url);
        });
      });
    });
  }

  exists(filename, targetDir) {
    return new Promise((resolve, _reject) => {
      resolve(false);
    });
  }

  delete(filename, targetDir) {
    return new Promise((resolve, _reject) => {
      resolve(true);
    });
  }

  read(options) {
    return new Promise((_resolve, reject) => {
      reject(new Error('Not Implemented.'));
    });
  }

  serve() {
    return (_req, _res, next) => next();
  }
}

module.exports = GhostStorageQn;

# ghost-storage-qn
> qiniu storage for ghost server side

## Usage

* `git clone` or download zip from this git repositry, then `cd ghost-storage-qn` and run `npm i`
* upload the whole `ghost-storage-qn` folder to ghost's `content/adapters/storage`
* read below and finish the config.{env}.json file

## Config

``` javascript
{
  ...,
  "storage": {
    "active": "ghost-storage-qn",
    "ghost-storage-qn": {
      "accessKey": "your qiniu access key",
      "secretKey": "your qiniu secret key",
      "bucket": "your qiniu bucket name",
      "origin": "your cdn domain, which redirects to qiniu cname domain", // or "domain" instead
      "uploadURL": "https://up-z2.qiniup.com", // default is http://up.qiniu.com, but was abandoned by qiniu, use the upload domain of your qiniu zone instead. z2 may not fit you
      "template": "ghost/[md5]" // the path in bucket your file will be finally placed. use [definition] to get optional dynamic strings
    }
  },
  ...
}
```

### All definitions
* `[year]` 4 numbers
* `[month]` 2 numbers
* `[day]` 2 numbers
* `[hour]` 2 numbers
* `[minute]` 2 numbers
* `[second]` 2 numbers
* `[millisecond]` 3 numbers
* `[timestamp]` 13 numbers
* `[md5]` 32 characters and numbers
* `[name]` origin file name
* `[ext]` origin file extension, with `.`

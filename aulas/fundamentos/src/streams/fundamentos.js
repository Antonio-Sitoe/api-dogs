// process.stdin.pipe(process.stdout)

import { Readable, Writable } from 'node:stream'

class OneHundredStream extends Readable {
  index = 1
  _read() {
    const i = this.index++
    setTimeout(() => {
      if (i >= 100) {
        this.push(null)
      } else {
        const buf = Buffer.from(i.toString())
        this.push(buf)
      }
    }, 1000)
  }
}

class MultiplyTeas extends Writable {
  _write(chuck, encoding, callback) {
    console.log(Number(chuck.toString()) * 10)
    callback()
  }
}

new OneHundredStream().pipe(new MultiplyTeas())

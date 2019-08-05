# node-gp-phonegap

An example node-gp integration for phonegap-nfc.

# Get Started

```
git clone https://github.com/dcdc-io/node-gp-phonegap
cd node-gp-phonegap
npm install
```

# A hastie example:

note: see [www/js/index.js](https://github.com/dcdc-io/node-gp-phonegap/blob/master/www/js/index.js) for a full working example.

```javascript
// ...

// connect to device
await nfc.connect('android.nfc.tech.IsoDep', 500);

// write a logging transceive function around phonegap-nfc#transceive
const loggingTransceive = async function(buffer) {
    console.log(">> " + util.arrayBufferToHexString(buffer))
    const responseBuffer = Buffer.from(await nfc.transceive(util.arrayBufferToHexString(buffer)))
    console.log("<< " + util.arrayBufferToHexString(responseBuffer))
    return responseBuffer
}

// get a GlobalPlatform instance
const gpcard = new GlobalPlatform(loggingTransceive)
await gpcard.connect()

// get an array of applets and packages form the device
const applets = await gpcard.getApplets()
const packages = await gpcard.getPackages()

// install a .cap file from a buffer
const capBuffer = new JSZip()
await capBuffer.load(SOME_CAP_FILE_AS_BUFFER)
await gpcard.installAuto(capBuffer)

// ...
```

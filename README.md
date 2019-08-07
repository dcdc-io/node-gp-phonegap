# node-gp-phonegap

An example node-gp integration for phonegap-nfc.

# Get Started

```
git clone https://github.com/dcdc-io/node-gp-phonegap
cd node-gp-phonegap
npm install
```

You should use the supplied browersify bundle in the `/browser` directory of the `node-gp` module. You would typically reference the bundle as a `<script/>` tag in your `index.html`:

```html
<script type="text/javascript" src="js/nodegp-bundle.debug.js"></script>
```

In this repository we automate the copying of `nodegp-bundle.debug.js` into your project `www/js` directory so you don't have to, by using a hook found [here.](https://github.com/dcdc-io/node-gp-phonegap/blob/master/scripts/copybundle.js)

The bundle makes the `GlobalPlatform` class globally available so that you can reference it in subsequent scripts just as we do in the `index.js`. See [src/index.js](https://github.com/dcdc-io/node-gp-phonegap/blob/master/www/js/index.js) for a full working example.

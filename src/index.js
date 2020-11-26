/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

var JSZip = require("jszip")

var app = {
    // Application Constructor
    initialize: function() {
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
    },

    status: function(message) {
        document.getElementById("status").innerText = message
    },

    // deviceready Event Handler
    //
    // Bind any cordova events here. Common events are:
    // 'pause', 'resume', etc.
    onDeviceReady: function() {
        this.receivedEvent('deviceready');
        nfc.addTagDiscoveredListener(app.handleConnected);
    },

    doTestInstall: async function(gpcard) {
        // 1. detect applet
        //const applets = await gpcard.getApplets()
        // 2. if applet exists, remove it
        // 3. load applet

        const data = await app.fetchLocal("caps/javacard-ndef-full-plain.cap").then(r => r.arrayBuffer())
        debugger
        const zip = await JSZip.loadAsync(data)
        //const appletCap = new JSZip()
        
        const installResponse = await gpcard.installAuto(zip)
        // 4. check if allpet exists
    },

    fetchLocal: async function(url) {
        return new Promise(function (resolve, reject) {
            var xhr = new XMLHttpRequest
            xhr.onload = function () {
                resolve(new Response(xhr.response, { status: xhr.status }))
            }
            xhr.onerror = function () {
                reject(new TypeError('Local request failed'))
            }
            xhr.open('GET', url)
            xhr.responseType = "arraybuffer";
            xhr.send(null)
        })
    },

    handleConnected: async function(nfcEvent) {
        const techTypes = nfcEvent.tag.techTypes.join(", ")
        console.log("tag present with tech types " + techTypes)
        const tagId = nfc.bytesToHexString(nfcEvent.tag.id);    
        try {
            await nfc.connect('android.nfc.tech.IsoDep', 500);
            console.log('connected to IsoDep device ' + tagId);
            
            /** 
             * the primary integration function for node-gp
             * 
             * make sure to return a buffer (or buffer-like) object
            */
            const loggingTransceive = async function(buffer) {
                console.log(">> " + util.arrayBufferToHexString(buffer))
                const responseBuffer = Buffer.from(await nfc.transceive(util.arrayBufferToHexString(buffer)))
                console.log("<< " + util.arrayBufferToHexString(responseBuffer))
                return responseBuffer
            }

            const gpcard = new GlobalPlatform(loggingTransceive)
            await gpcard.connect()

            console.log("gpcard connected")

            /// ================================================================================
            // print some stuff
            const applets = await gpcard.getApplets()
            const packages = await gpcard.getPackages()
            app.status(`${applets.length} applets and ${packages.length} packages installed`)
            /// ================================================================================
            /// install an app
            await app.doTestInstall(gpcard)
            /// ================================================================================
            
        } catch (error) {
            console.error(error)
            app.status(error.toString())
        } finally {
            /**
             * warning! closing the connection assumes we have finished working with the device
             */
            await nfc.close()
        }
    },

    ensureResponseIs(expectedResponse, buffer) {
        const responseString = util.arrayBufferToHexString(buffer);
        if (expectedResponse !== responseString) {
            const error = 'Expecting ' + expectedResponse + ' but received ' + responseString;
            throw error;
        }
    },

    // Update DOM on a Received Event
    receivedEvent: function(id) {
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');

        console.log('Received Event: ' + id);


    }
};

app.initialize();
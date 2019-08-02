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

var app = {
    // Application Constructor
    initialize: function() {
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
    },

    // deviceready Event Handler
    //
    // Bind any cordova events here. Common events are:
    // 'pause', 'resume', etc.
    onDeviceReady: function() {
        this.receivedEvent('deviceready');
        nfc.addTagDiscoveredListener(app.handleConnected);
    },

    handleConnected: async function(nfcEvent) {

        document.getElementById("status").innerText = nfcEvent.tag.techTypes.join(", ")

        const tagId = nfc.bytesToHexString(nfcEvent.tag.id);
        console.log('Processing', tagId);
    
        try {
            await nfc.connect('android.nfc.tech.IsoDep', 500);
            console.log('xyz connected to', tagId);
            
            const trans = async function(buffer) {
                console.log("xyz sending a buffer")
                console.log("xyz = " + util.arrayBufferToHexString(buffer))
                const responseBuffer = Buffer.from(await nfc.transceive(util.arrayBufferToHexString(buffer)))
                console.log("xyz got a response buffer")
                console.log("xyz = " + util.arrayBufferToHexString(responseBuffer))
                return responseBuffer
            }

            const gpcard = new GlobalPlatform(trans)
            console.log("xyz new GlobalPlatform")

            await gpcard.connect()

            alert("gp connected")

            //let response = await nfc.transceive(DESFIRE_SELECT_PICC);
            //ensureResponseIs('9000', response);
            
            //response = await nfc.transceive(DESFIRE_SELECT_AID);
            //ensureResponseIs('9100', response);
            // 91a0 means the requested application not found
    
            // alert('Selected application AA AA AA');
    
            // more transcieve commands go here
            
        } catch (error) {
            console.log("xyz " + error.toString())
            alert(error);
        } finally {
            await nfc.close();
            console.log('closed');
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
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
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicity call 'app.receivedEvent(...);'
    onDeviceReady: function() {
		if (/10\./.test(device.version)) {
			var canvas = document.getElementById('myCanvas');
			canvas.width = window.innerWidth;
			canvas.height = window.innerHeight;

			window.Barcode = {
				scan : function(onSuccess, onError) {
					community.barcodescanner.startRead(onSuccess, onError,
							"myCanvas", function(data) {
								console.log("Started : " + data.successful);
							});
				}
			};
		} else {
			window.Barcode = {
				scan : function(onSuccess, onError) {
					cordova.exec(onSuccess, onError, "Barcode", "scan", [ {
						'tryHarder' : true
					} ]);
				}
			};
		}
        app.receivedEvent('deviceready');
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

function scanBarcode() {
	window.Barcode.scan(function(result) {
		if (result.cancelled)
			alert("the user cancelled the scan")
		else
			alert("we got a barcode: " + (result.value ? result.value : result))
		if (/10\./.test(device.version)) {
			community.barcodescanner.stopRead(function (data){
				console.log("Started : " + data.successful);
			}, function (data){
				console.log("Stopped : " + data.successful);
			});
		}
	}, function(error) {
		alert("scanning failed: " + (error.error ? error.description + "[" + error.state + "]" : error))
	});
}

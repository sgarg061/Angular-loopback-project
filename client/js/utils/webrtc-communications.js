var webrtcCommunications = (function() {
  'use strict';

  /********************************** SOCKET.IO SIGNALLING SERVER COMMS ******************************/
  var socketOptions = {
      transports: ['websocket'],
      'forceNew': true,
      'secure': false
  };

  var sockets = {};
  var connections = {};

  /********************************** WEBRTC COMMUNICATION ******************************/

  var STUN = {url: 'stun:stun.l.google.com:19302'};

  var iceServers = {
     iceServers: [STUN]
  };

  var sdpConstraints = {"offerToReceiveAudio":false, "offerToReceiveVideo":false};

  /********************************** CONNECTION CREATION ******************************/

  function createSocket(signallingServer, token, next) {
    console.log('connecting socket...');

    var socketInfo = {
      socket: null,
      ready: false
    };
    sockets[signallingServer] = socketInfo;
    var socket = io.connect(signallingServer + "?token=" + token, socketOptions);
    sockets[signallingServer].socket = socket;
      
    socket.on('connect', function () {
        console.log('connected to signalling server ' + signallingServer);
        sockets[signallingServer].ready = true;
        next();
    });

    socket.on('answer', function (data) {
        console.log('received answer: ' + JSON.stringify(data));

        var deviceId = data.deviceId;
        if (!connections[deviceId]) {
          console.log('ERROR: Device connection is not created: ' + deviceId);
          return;
        }

        var remoteSessionDescription = new RTCSessionDescription(data.answer);
        connections[deviceId].connection.setRemoteDescription(remoteSessionDescription, function () {
          connections[deviceId].hasAnswered = true;
        });
    });

    socket.on('ice', function (data){
      var candidate = data.candidate;
      var deviceId = data.deviceId;
      console.log('received ice candidate: ' + JSON.stringify(candidate));

      if (!connections[deviceId]) {
        console.log('ERROR: Device is not yet created: ' + deviceId);
        return;
      }

      remoteIceCandidate(connections[deviceId].connection, candidate);
    });

    socket.on('error', function (data){
      console.log('error...');
      console.log(data);
      console.log(data.deviceId);
      connections[data.deviceId].cb(new Error(data.msg));
    });
  }

  function remoteIceCandidate(connection, icecandidate) {
      console.log("### remoteIceCandidate: " + icecandidate);
      connection.addIceCandidate(new RTCIceCandidate(icecandidate), onAddIceCandidateSuccess, onAddIceCandidateError);
  }

  function onAddIceCandidateSuccess() {
    console.log("AddIceCandidate success.");
  }

  function onAddIceCandidateError(error) {
    console.log("Failed to add Ice Candidate: " + error.toString());
  }

  function createConnection(signallingServer, deviceId, msg, cb) {
    if (!sockets[signallingServer] || !sockets[signallingServer].ready) {
      var e = new Error('Connection not established');
      cb(e, null);
      return; 
    }

    // create webrtc connection
    var connection = new RTCPeerConnection(
      iceServers,
      {
        'optional': [{DtlsSrtpKeyAgreement: true},
                    {RtpDataChannels: false}]
      }
    );

    connection.ondatachannel = function(e) {
      console.log('ondatachannel: ' + JSON.stringify(e));
    };
    connection.onicecandidate = iceCallback;

    connection.oniceconnectionstatechange = function(event) { console.log('ice connection state change ***: ' + connection.iceConnectionState + ' event: ' + JSON.stringify(event)); };
    connection.onidentityresult = function() { console.log('onidentityresult ***'); };
    connection.onidpassertionerror = function() { console.log('onidpassertionerror ***'); };
    connection.onidpvalidationerror = function() { console.log('onidpvalidationerror ***'); };
    connection.onnegotiationneeded = function() { console.log('onnegotiationneeded ***'); };
    connection.onpeeridentity = function() { console.log('onpeeridentity ***'); };
    connection.onremovestream = function() { console.log('onremovestream ***'); };
    connection.onsignalingstatechange = function() { console.log('onsignalingstatechange *** state: ' + connection.signalingState); };

    function sendOffer() {
      console.log('creating offer...');
      connection.createOffer(function(offer) {

        connection.setLocalDescription(offer);      
        
        console.log('sending offer...');
        sockets[signallingServer].socket.emit('offer', {connectId: deviceId, offer: offer});

      }, failedToCreateOffer, sdpConstraints);
    }

    function failedToCreateOffer(state) {
      console.log('failure: ' + state);
    }

    function iceCallback(event) {
      var candidate = event.candidate;
      console.log('Received an ice candidate');
      
      if(!connection || !event || !candidate) {
        return;
      }

      if (candidate) {
        sockets[signallingServer].socket.emit('ice', {connectId: deviceId, candidate: event.candidate});
      }
    }

    var dataChannel;

    // Note: this must be called before an offer is made
    function setupDataChannel(cb) {
      console.log('setting up data channel');
      try {
        dataChannel = connection.createDataChannel('checkin', { reliable:true });

        dataChannel.onmessage = function (e) {
          console.log(e);
          cb(null, e);
        };

        dataChannel.onopen = function () {
          console.log("### Data Channel Open");
          if (msg) {
            dataChannel.send(msg);
            msg = null;
          }
        };
        dataChannel.onerror = function (error) {
          console.log("### Data Channel Error:", error);
        };
        dataChannel.onclose = function () {
          console.log("### Data Channel Closed");
        };

      } catch (e) { 
        console.warn("No connection data channel", e); 
      }
    }

    function initializeConnection(deviceId, cb) {
      var connectionInfo = {
        connection: connection,
        hasAnswered: false,
        cb: cb
      };
      connections[deviceId] = connectionInfo;

      setupDataChannel(cb);
      connections[deviceId].dataChannel = dataChannel;
      
      sendOffer(deviceId);
    }
    initializeConnection(deviceId, cb);
  }

/********************************** PUBLIC METHODS ******************************/

  return {
    webrtcCheckin: (function (token, deviceId, signallingServer, cb) {
      if (typeof sockets[signallingServer] !== 'object') {
        createSocket(signallingServer, token, function() {
          createConnection(signallingServer, deviceId, 'checkin', cb);
        });
      } else {
        if (typeof connections[deviceId] !== 'object') {
          createConnection(signallingServer, deviceId, 'checkin', cb);
        } else {

          if (connections[deviceId].hasAnswered) {

            connections[deviceId].dataChannel.onmessage = function (e) {
              console.log(e);
              cb(null, e);
            };

            connections[deviceId].dataChannel.send('checkin');
          } else {
            cb(new Error('Cannot connect with device'), null);
          }
        }
      }
    })
  };
}());




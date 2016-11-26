var StringBuilder = require('utility.strings');

var MessageBus = {
    log: function (m) { StringBuilder.log('message-bus', m)},
    noop: {
        event: 'noop'
    },
    ReceiveNext: function (type) {
        Memory.requests = Memory.requests || [];

        if (Memory.requests.length) {
            for (var i = 0; i < Memory.requests.length; ++i) {
                if (Memory.requests[i].resource == type) {
                    var request = Memory.requests.splice(i, 1);
                    return request[0];
                }
            }
        }

        return null;
    },
    RedoRequest: function (request) {
        Memory.requests.unshift(request);
    },
    Request: function (sender, request) {
        Memory.requests = Memory.requests || [];

        Memory.requests.push({
            sender: sender,
            resource: request
        });
    },
    ReceiveRequest: function () {
        Memory.requests = Memory.requests || [];

        if (Memory.requests.length) {
            return Memory.requests.shift();
        }

        return null;
    },
    Send: function (payload) {
        console.log(payload.id + ' requested ' + payload.event);
        Memory.messages.push(payload);
    },
    Read: function () {
        if (!Memory.messages) {
            Memory.messages = [];
        }
        if (Memory.messages.length) {
            return Memory.messages.shift();
        }

        return this.noop;
    }
};

module.exports = MessageBus;

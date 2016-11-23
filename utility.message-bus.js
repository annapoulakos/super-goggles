var MessageBus = {
    noop: {
        event: 'noop'
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

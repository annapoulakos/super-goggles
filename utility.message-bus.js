var MessageBus = {
    messages: [],
    noop: {
        event: 'noop'
    },
    Send: function (payload) {
        this.messages.push(payload);
    },
    Read: function () {
        if (this.messages.length) {
            return this.messagse.unshift();
        }

        return this.noop;
    }
};

module.exports = MessageBus;

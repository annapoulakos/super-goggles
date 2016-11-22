var MessageBus = require('utility.message-bus');

var PackHorse = {
    type: 'packhorse-v2',
    body: {
        Tier1: [CARRY,CARRY,MOVE,MOVE,MOVE],
        Tier2: [CARRY,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE,MOVE],
        Tier3: [CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE,MOVE]
    },
    memory: {
        role: 'packhorse-v2',
        currentMessage: {event: 'REFILL'}
    },
    execute: function (creep) {
        var action = creep.memory.currentMessage;

        if (action.event == 'noop') {
            var newMessage = MessageBus.Read();

            creep.memory.currentMessage = MessageBus.Read();
        }

        switch(creep.memory.currentMessage.event) {
            case 'NEED_ENERGY': 
                break;
            case 'REFILL':
                break;
            default: break;
        }
    }
};

module.exports = PackHorse;

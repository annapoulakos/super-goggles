var MessageBus = require('utility.message-bus');

var Upgrader = {
    type: 'upgrader-v2',
    body: {
        Tier1: [WORK,WORK,CARRY,MOVE],
        Tier2: [WORK,WORK,WORK,CARRY,MOVE],
        Tier3: [WORK,WORK,WORK,WORK,CARRY,CARRY,MOVE]
    },
    memory: {
        role: 'upgrader-v2',
        isV2: true
    },
    execute: function (creep) {
        var result = creep.upgradeController(creep.room.controller);

        switch (result) {
            case ERR_NOT_IN_RANGE: 
                creep.moveTo(creep.room.controller);
                creep.say('Moving...');
                break;
            case ERR_NOT_ENOUGH_ENERGY:
                if (!creep.memory.sentMessage) {
                    MessageBus.Send({
                        event: 'NEED_ENERGY',
                        id: creep.name
                    });
                    creep.say('Need Energy');
                    creep.memory.sentMessage = true;
                }
                break;
            case OK:
                creep.say('Upgrade');
                break;
        }
    }
};

module.exports = Upgrader;

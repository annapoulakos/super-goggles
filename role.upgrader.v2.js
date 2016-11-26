var MessageBus = require('utility.message-bus');

var Upgrader = {
    role: 'upgrader.v2',
    getOptimalBuild: function (energy) {
        var workParts = ((energy - 100) / 100)|0,
            carryParts = ((energy - 150) / 50)|0,
            moveParts = ((energy - 150) / 50)|0;

        workParts = workParts > 8? 8: workParts;
        moveParts = moveParts > 10? 10: moveParts;
        return {
            WORK: workParts,
            CARRY: carryParts,
            MOVE: moveParts
        };
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

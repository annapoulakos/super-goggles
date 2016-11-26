var MessageBus = require('utility.message-bus'),
    Constants = require('constants'),
    StringBuilder = require('utility.strings');

var Upgrader = {
    log: function (m) { StringBuilder.log('upgrader', m); },
    role: 'upgrader.v2',
    getOptimalBuild: function (energy) {
        var workParts = ((energy - (Constants.PartCosts.CARRY + Constants.PartCosts.MOVE)) / Constants.PartCosts.WORK)|0,
            carryParts = ((energy - (Constants.PartCosts.WORK + Constants.PartCosts.MOVE)) / Constants.PartCosts.CARRY)|0,
            moveParts = ((energy - (Constants.PartCosts.WORK + Constants.PartCosts.CARRY)) / Constants.PartCosts.MOVE)|0;

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
                break;
            case ERR_NOT_ENOUGH_ENERGY:
                if (!creep.memory.request) {
                    this.log(`${creep.name} is requesting energy be delivered.`);
                    MessageBus.Request(creep.name, RESOURCE_ENERGY);
                    creep.memory.request = true;
                }

                break;
        }
    }
};

module.exports = Upgrader;

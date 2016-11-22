var Upgrader = {
    parts: [WORK, CARRY, MOVE],
    memory: {
        role: 'upgrader',
        upgrading: false
    },
    getNextAction: function (creep) {
        if (creep.memory.upgrading) {
            if (creep.carry.energy == 0) {
                creep.memory.upgrading = false;
                return 'withdraw';
            } else {
                return 'upgrade';
            }
        } else {
            if (creep.carry.energy < creep.carryCapacity) {
                return 'withdraw';
            } else {
                creep.memory.upgrading = true;
                return 'upgrade';
            }
        }
    },
    execute: function (creep) {
        var action = this.getNextAction(creep);

        this[action](creep);
    },
    withdraw: function (creep) {
        var sources = creep.room.find(FIND_STRUCTURES, {
            filter: (structure) => {
                switch (structure.structureType) {
                    //case STRUCTURE_SPAWN: return structure.energy > 200;
                    //case STRUCTURE_EXTENSION: return structure.energy > 0;
                    case STRUCTURE_CONTAINER: return structure.store[RESOURCE_ENERGY] > 0;
                    default: return false;
                }
            }
        });

        if (sources.length > 0) {
            if (creep.withdraw(sources[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.moveTo(sources[0]);
                creep.say('Withdrawing');
            }
        }
    },
    upgrade: function (creep) {
        if (creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
            creep.moveTo(creep.room.controller);
            creep.say('Upgrading');
        }
    }
};

module.exports = Upgrader;

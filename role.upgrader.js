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
        var source = creep.pos.findClosestByRange(FIND_STRUCTURES, {filter: s => s.structureType == STRUCTURE_CONTAINER && s.store[RESOURCE_ENERGY] > 0});
        if (source) {
            if (creep.withdraw(source, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.moveTo(source);
                creep.say('Withdraw');
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

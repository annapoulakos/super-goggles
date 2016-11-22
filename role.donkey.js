var Donkey = {
    getNextAction: function (creep) {
        if (!creep.memory.action) {
            creep.memory.action = 'pickup';
        }

        if (creep.memory.action == 'pickup' && creep.carry.energy >= creep.carryCapacity) {
            creep.memory.action = 'deposit';
        } else if (creep.memory.action == 'deposit' && creep.carry.energy == 0) {
            creep.memory.action = 'pickup';
        }
    },
    execute: function (creep) {
        this.getNextAction(creep);

        if (this[creep.memory.action]) {
            this[creep.memory.action](creep);
        } else {
            console.log('There was an error with ' + creep.name + ' performing ' + creep.memory.action);
        }
    },
    pickup: function (creep) {
        var drops = creep.room.find(FIND_DROPPED_ENERGY);

        if (drops.length > 0) {
            if (creep.pickup(drops[0]) == ERR_NOT_IN_RANGE) {
                creep.moveTo(drops[0]);
                creep.say('Moving');
            }
        } else {
            creep.memory.action = 'deposit';
        }
    },
    deposit: function (creep) {
        var targets = creep.room.find(FIND_STRUCTURES, {
            filter: (structure) => {
                return (structure.structureType == STRUCTURE_EXTENSION ||
                    structure.structureType == STRUCTURE_SPAWN ||
                    structure.structureType == STRUCTURE_TOWER) &&
                    structure.energy < structure.energyCapacity;
            }
        });
        targets.sort((a,b) => (a.energy / a.energyCapacity) - (b.energy / b.energyCapacity));

        if (targets.length > 0) {
            if (creep.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.moveTo(targets[0]);
                creep.say('Moving');
            }
        } else {
            targets = creep.room.find(FIND_STRUCTURES, {
                filter: (structure) => structure.structureType == STRUCTURE_CONTAINER && structure.store[RESOURCE_ENERGY] < structure.storeCapacity
            });
            targets.sort((a,b) => (a.store[RESOURCE_ENERGY] / a.storeCapacity) - (b.store[RESOURCE_ENERGY] / b.storeCapacity));

            if (targets.length > 0) {
                if (creep.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets[0]);
                    creep.say('Moving');
                }
            }
        }
    }
};

module.exports = Donkey;

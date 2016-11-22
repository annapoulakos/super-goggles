var Repairer = {
    execute: function (creep) {
        if (creep.carry.energy == 0) {
            this.withdraw(creep);
        } else {
            this.doRepair(creep);
        }
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
    doRepair: function (creep) {
        var targets = this.getRepairPriority(creep.room);

        if (targets.length > 0) {
            if (creep.repair(targets[0].structure) == ERR_NOT_IN_RANGE) {
                creep.moveTo(targets[0].structure);
                creep.say('Repairing');
            }
        }
    },
    getRepairPriority: function (room) {
        var structures = room.find(FIND_STRUCTURES, { filter: structure => structure.hits < structure.hitsMax });
        var priorityValues = structures.map(structure => {
            var priority = 1000;
            var decayPercent = structure.hits / structure.hitsMax;

            if (structure.hits < 100) {
                priority += 100000 + (100 - structure.hits);
            } else {
                priority = priority * (100 * decayPercent )
            }

            return {
                priority: priority,
                structure: structure
            };
        });

        priorityValues.sort((a,b) => b.priority - a.priority);
        return priorityValues;
    },
};

module.exports = Repairer;

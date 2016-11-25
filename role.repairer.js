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
        // Repair containers first, so other creeps don't stop working.
        
        var structure = creep.pos.findClosestByRange(FIND_STRUCTURES, {filter: s => s.structureType == STRUCTURE_CONTAINER && s.hits < s.hitsMax});
        if (structure) {
            this.repair(structure, creep);
            return;
        }

        // Repair roads second, so we keep things running smoothly
        var road = creep.pos.findClosestByRange(FIND_STRUCTURES, {filter: s => s.structureType == STRUCTURE_ROAD && s.hits < s.hitsMax});
        if (road) {
            this.repair(road, creep);
            return;
        }

        // Repair non-walls next
        var structure = creep.pos.findClosestByRange(FIND_STRUCTURES, {filter: s => s.structureType != STRUCTURE_CONTAINER && s.structureType != STRUCTURE_ROAD && s.structureType != STRUCTURE_WALL && s.hits < s.hitsMax});
        if (structure) {
            this.repair(structure, creep);
        }

        // Finally, repair walls
        var walls = creep.room.find(FIND_STRUCTURES, {filter: s => s.structureType == STRUCTURE_WALL && s.hits < s.hitsMax});
        walls.sort((a,b) => b.hits - a.hits);

        if (walls.length) {
            this.repair(walls[0], creep);
        }
    },
    repair: function (target, creep) {
        creep.memory.targeting = {
            id: target.id || target.name,
            type: target.structureType
        };

        if (creep.repair(target) == ERR_NOT_IN_RANGE) {
            creep.moveTo(target);
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

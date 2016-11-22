var Harvester = {
    parts: [WORK, CARRY, MOVE],
    memory: {
        role: 'harvester',
        harvesting: false
    },
    getNextAction: function (creep) {
        if (creep.memory.harvesting) {
            if (creep.carry.energy < creep.carryCapacity) {
                return 'harvest';
            } else {
                creep.memory.harvesting = false;
                return 'deposit';
            }
        } else {
            if (creep.carry.energy > 0) {
                return 'deposit';
            } else {
                creep.memory.harvesting = true;
                return 'harvest';
            }
        }
        
    },
    execute: function (creep) {
        var action = this.getNextAction(creep);
        
        this[action](creep);
    },
    harvest: function (creep) {
        var sources = creep.room.find(FIND_SOURCES);

        if (!creep.memory.source) {
            creep.memory.source = {
                actual: null,
                turns: 0
            };
        }

        if (creep.memory.source.actual && creep.memory.source.turns < 4) {
            var actual = Game.getObjectById(creep.memory.source.actual);
            if (creep.harvest(actual) == ERR_NOT_IN_RANGE) {
                creep.moveTo(actual);
                creep.say('Harvesting');
            } else {
                creep.memory.source.turns++;
            }
        }

        var prioritizedSources = _.sortBy(sources, [function(source) {
            var priority;

            if (source.ticksToRegeneration == undefined) {
                priority = 10;
            } else if (source.energy == 0) {
                priority = 0;
            } else {
                priority = source.energy / source.ticksToRegeneration;
            }

            if (priority > 0 && source.ticksToRegeneration < 150) {
                priority = priority * (1 + (150 - source.ticksToRegeneration) / 250);
                if (source.ticksToRegeneration < 70) {
                    priority = priority + (70 - source.ticksToRegeneration)/10;
                }
            }
            return -1 * priority;
        }]);
        
        creep.memory.source.actual = prioritizedSources[0].id;
        creep.memory.source.turns = 0;
    },
    deposit: function (creep) {
        var targets = creep.room.find(FIND_STRUCTURES, {
            filter: (structure) => {
                return (structure.structureType == STRUCTURE_EXTENSION ||
                    structure.structureType == STRUCTURE_STORAGE ||
                    structure.structureType == STRUCTURE_SPAWN ||
                    structure.structureType == STRUCTURE_TOWER) &&
                    structure.energy < structure.energyCapacity;
            }
        });

        if (targets.length > 0) {
            if (creep.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.moveTo(targets[0]);
                creep.say('Depositing');
            }
        }
    }
};

module.exports = Harvester;

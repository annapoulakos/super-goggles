var Builder = {
    parts: [WORK, CARRY, MOVE],
    memory: {
        role: 'builder',
        building: true
    },
    getNextAction: function (creep) {
        if (creep.memory.building) {
            if (creep.carry.energy > 0) {
                return 'build';
            } else {
                creep.memory.building = false;
                return 'withdraw';
            }
        } else {
            if (creep.carry.energy < creep.carryCapacity) {
                return 'withdraw';
            } else {
                creep.memory.building = true;
                return 'build';
            }
        }
    },
    execute: function (creep) {
        var action = this.getNextAction(creep);
        this[action](creep);
    },
    withdraw: function (creep) {
        var source = creep.pos.findClosestByRange(FIND_STRUCTURES, {filter: s => s.structureType == STRUCTURE_CONTAINER && s.store[RESOURCE_ENERGY] > 0});
        if (!source) {
            source = creep.pos.findClosestByRange(FIND_STRUCTURES, {filter: s => s.structureType == STRUCTURE_EXTENSION && s.energy > (s.energyCapacity / 2)});
        }

        if (source) {
            if (creep.withdraw(source, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.moveTo(source);
                creep.say('Withdraw');
            }
        }
    },
    build: function (creep) {
        var lowHealth = creep.room.find(FIND_STRUCTURES, { filter: structure => structure.hits < 100 });
        
        if (lowHealth.length > 0) {
            this.doRepair(creep);
        } else {
            var priorities = this.getBuildPriority(creep.room);

            if (priorities.length > 0) {
                if (creep.build(priorities[0].site) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(priorities[0].site);
                    creep.say('Building');
                }
            } else {
                this.doRepair(creep);
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
    getBuildPriority: function (room) {
        var sites = room.find(FIND_CONSTRUCTION_SITES);

        var priorityValues = sites.map(site => {
            var progressPercent = site.progress / site.progressTotal;
            var priority = 100;

            switch (site.structureType) {
                case STRUCTURE_EXTENSION: priority += 100;
                case STRUCTURE_TOWER: priority += 50;
                case STRUCTURE_CONTAINER: priority += 10;
                default: break;
            }

            return {
                priority: priority * progressPercent,
                site: site
            };
        });

        priorityValues.sort((a,b) => b.priority - a.priority);

        return priorityValues;
    }
};

module.exports = Builder;

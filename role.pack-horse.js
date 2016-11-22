var PackHorse = {
    execute: function (creep) {
        if (!creep.memory.working && creep.carry.energy == creep.carryCapacity) {
            creep.memory.working = true;
        }

        if (creep.memory.working) {
            this.doWork(creep);
        } else {
            this.findResources(creep);
        }
    },
    doWork: function (creep) {
        var creeps = creep.room.find(FIND_MY_CREEPS, {filter: creep => creep.carry.energy < (creep.carryCapacity / 2)});

        if (creeps.length > 0) {
            creeps.sort((a,b) => b.energy - a.energy);
            if (creep.transfer(creeps[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.moveTo(creeps[0]);
                creep.say('Moving');
            }
        }
    },
    findResources: function (creep) {
        var target = creep.pos.findClosestByPath(FIND_DROPPED_ENERGY);

        if (target && creep.pickup(target) == ERR_NOT_IN_RANGE) {
            creep.moveTo(target);
            creep.say('Moving');
        }

        var target = creep.pos.findClosestByPath(FIND_STRUCTURES, {filter: structure => structure.structureType == STRUCTURE_CONTAINER && structure.store[RESOURCE_ENERGY] > 0});
        if (target && creep.withdraw(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
            creep.moveTo(target[0]);
            creep.say('Moving');
        }
    }
};

module.exports = PackHorse;

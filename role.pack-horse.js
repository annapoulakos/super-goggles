var PackHorse = {
    execute: function (creep) {
        if (creep.carry.energy == 0) {
            creep.memory.working = false;
        }

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
        var target = creep.pos.findClosestByRange(FIND_MY_CREEPS, {filter: c => c.carry.energy < (c.carryCapacity / 2)});

        if (target) {
            var result = creep.transfer(target, RESOURCE_ENERGY);

            switch (result) {
                case ERR_NOT_IN_RANGE: 
                    creep.moveTo(target);
                    creep.say('Moving');
                    break;
                case OK:
                    creep.memory.working = false;
                    break;
            }
        }
    },
    findResources: function (creep) {
        var target = creep.pos.findClosestByRange(FIND_DROPPED_ENERGY);
        if (target) {
            var result = creep.pickup(target);

            switch (result) {
                case ERR_NOT_IN_RANGE:
                    creep.moveTo(target);
                    creep.say('Moving');
                    break;
            }

            return;
        }

        var target = creep.pos.findClosestByRange(FIND_STRUCTURES, {filter: s => s.structureType == STRUCTURE_CONTAINER && s.store[RESOURCE_ENERGY] > 0});
        if (target) {
            var result = creep.withdraw(target, RESOURCE_ENERGY);

            switch (result) {
                case ERR_NOT_IN_RANGE:
                    creep.moveTo(target);
                    creep.say('Moving');
            }
        }
    }
};

module.exports = PackHorse;

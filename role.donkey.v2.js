var StringBuilder = require('utility.strings');

var Donkey = {
    log: function (m) {
        StringBuilder.log('donkey', m);
    },
    role: 'donkey.v2',
    getOptimalBuild: function (energy) {
        var counts = (energy / 100)|0;

        if (counts > 10) {
            counts = 10;
        }

        return {
            CARRY: counts,
            MOVE: counts
        };
    },
    findNextAction: function (creep) {
        if (creep.memory.action == 'search') {
            creep.memory.action = 'deposit';
            creep.memory.working = true;
            return;
        } else if (creep.memory.action == 'deposit') {
            creep.memory.action = 'search';
            creep.memory.working = true;
            return;
        }

        creep.memory.action = 'search';
        creep.memory.working = true;
    },
    search: function (creep) {
        if (creep.carry.energy == creep.carryCapacity) {
            creep.memory.working = false;
            return;
        }

        var drop = creep.pos.findClosestByRange(FIND_DROPPED_ENERGY);
        if (drop) {
            var result = creep.pickup(drop);

            switch (result) {
                case ERR_NOT_IN_RANGE: creep.moveTo(drop); break;
                case OK: creep.memory.working = creep.carry.energy == creep.carryCapacity; break;
            }
        } else {
            creep.memory.searching = creep.memory.searching || 0;
            creep.memory.searching++;

            if (creep.memory.searching > 5) {
                creep.memory.searching = 0;
                creep.memory.working = false;
                creep.say('Searching');
            }
        }
    },
    deposit: function (creep) {
        if (creep.carry.energy == 0) {
            creep.memory.working = false;
            return;
        }
        if (!creep.memory.depositTarget) {
            var target = this.findClosest(creep.pos, s => s.structureType == STRUCTURE_EXTENSION && s.energy < s.energyCapacity);

            if (!target) {
                target = this.findClosest(creep.pos, s => s.structureType == STRUCTURE_SPAWN && s.energy < s.energyCapacity);
            }

            if (!target) {
                target = this.findClosest(creep.pos, s => s.structureType == STRUCTURE_CONTAINER && s.store[RESOURCE_ENERGY] < s.storeCapacity);
            }

            creep.memory.depositTarget = target? target.id: null;
        }

        if (!creep.memory.depositTarget) {
            creep.memory.working = false;
        } else {
            var target = Game.getObjectById(creep.memory.depositTarget);

            var result = creep.transfer(target, RESOURCE_ENERGY);

            switch (result) {
                case ERR_NOT_IN_RANGE: creep.moveTo(target); break;
                case ERR_FULL: creep.memory.depositTarget = false;
                case OK:
                    if (creep.carry.energy == 0) {
                        creep.memory.working = false;
                        break;
                    }

                    if (target.structureType == STRUCTURE_CONTAINER && target.store[RESOURCE_ENERGY] == target.storeCapacity) {
                        creep.memory.depositTarget = null;
                    } else if (target.energy == target.energyCapacity) {
                        creep.memory.depositTarget = null;
                    }
                    break;
            }
        }
    },
    findClosest: function (pos, lambda)  {
        return pos.findClosestByRange(FIND_STRUCTURES, {filter: lambda});
    },
    execute: function (creep) {
        if (creep.memory.working) {
            this[creep.memory.action](creep);
        } else {
            this.findNextAction(creep);
        }
    }
};

module.exports = Donkey;

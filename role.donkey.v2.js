var Donkey = {
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
    execute: function (creep) {
        if (creep.memory.depositing) {
            var target = creep.pos.findClosestByRange(FIND_STRUCTURES, {filter: s => (s.structureType == STRUCTURE_EXTENSION || s.structureType == STRUCTURE_SPAWN) && s.energy < s.energyCapacity});

            if (!target) {
                target = creep.pos.findClosestByRange(FIND_STRUCTURES, {filter: s => s.structureType == STRUCTURE_CONTAINER && s.store[RESOURCE_ENERGY] < s.storeCapacity});
            }

            if (target) {
                this.transfer(creep, target);
            } else if (creep.carry.energy < creep.carryCapacity) {
                creep.memory.depositing = false;
            }
        } else {
            var drop = creep.pos.findClosestByRange(FIND_DROPPED_ENERGY);

            if (drop) {
                var result = creep.pickup(drop);

                switch (result) {
                    case ERR_NOT_IN_RANGE: creep.moveTo(drop); break;
                    case OK: creep.memory.depositing = creep.carry.energy == creep.carryCapacity; break;
                }
            } else {
                creep.memory.depositing = true;
            }
        }
    },
    transfer: function (creep, target) {
        var result = creep.transfer(target, RESOURCE_ENERGY);

        switch (result) {
            case ERR_NOT_IN_RANGE: creep.moveTo(target); break;
            case OK: creep.memory.depositing = creep.carry.energy == 0; break;
        }
    }
};

module.exports = Donkey;

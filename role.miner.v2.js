var Utility = require('utility');

var Miner = {
    role: 'miner.v2',
    getOptimalBuild: function (energy) {
        var workParts = energy < 550? (((energy - 50) / 10)|0): 5;
        var moveParts = ((energy - (100* workParts)) / 50)|0;
        moveParts = moveParts > 10? 10: moveParts;

        return {
            WORK: workParts,
            MOVE: moveParts
        }
    },
    execute: function (creep) {
        if (!creep.memory.harvestSourceId) {
            var miners = Utility.getCreepsByRole(this.role);
            var takenIds = miners.map(m => m.memory.harvestSourceId);

            var sources = creep.room.find(FIND_SOURCES, { filter: s => takenIds.map(id => s.id != id).reduce((a,b) => a&b) });

            if (sources.length) {
                creep.memory.harvestSourceId = sources[0].id;
            }
        }

        var source = Game.getObjectById(creep.memory.harvestSourceId);
        if (source) {
            var harvest = creep.harvest(source);

            switch (source) {
                case ERR_NOT_IN_RANGE: creep.moveTo(source); creep.say('Moving'); break;
                case ERR_NOT_ENOUGH_RESOURCES: creep.say('Empty'); break;
                case OK: creep.say('Mining'); break;
            }
        }
    }
};

module.exports = Miner;

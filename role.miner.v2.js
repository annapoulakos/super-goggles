var Utility = require('utility'),
    Constants = require('constants');

var Miner = {
    role: 'miner.v2',
    getOptimalBuild: function (energy) {
        var workParts = energy < 550? (((energy - Constants.PartCosts.MOVE) / Constants.PartCosts.WORK)|0): 5;
        var moveParts = ((energy - (Constants.PartCosts.WORK * workParts)) / Constants.PartCosts.MOVE)|0;

        workParts = Utility.clamp(workParts, 1, 5);
        moveParts = Utility.clamp(moveParts, 1, 10);

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

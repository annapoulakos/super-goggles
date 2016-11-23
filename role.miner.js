var Utility = require('utility');

var Miner = {
    sourceId: null,
    execute: function (creep) {
        var sources = creep.room.find(FIND_SOURCES);

        if (!creep.memory.harvestSourceId) {
            var miners = Utility.getCreepsByRole('miner');
            var takenIds = miners.map(m => m.memory.harvestSourceId);

            var sources = creep.room.find(FIND_SOURCES, {filter: s => {
                return takenIds.map(id => s.id != id).reduce((a,b) => a&b);
            }});

            if (sources.length) {
                creep.memory.harvestSourceId = sources[0].id;
            }
        }

        var source = Game.getObjectById(creep.memory.harvestSourceId);
        if (source) {
            var harvest = creep.harvest(source);

            switch (harvest) {
                case ERR_NOT_IN_RANGE: creep.moveTo(source); creep.say('Moving'); break;
            }
        }

        // for (var id in sources) {
        //     var source = sources[id];

        //     var harvest = creep.harvest(source);

        //     switch (harvest) {
        //         case ERR_NOT_IN_RANGE: creep.moveTo(source); creep.say('Moving'); return;
        //         case OK: return;
        //         default: break;
        //     }
        // }
    }
};

module.exports = Miner;

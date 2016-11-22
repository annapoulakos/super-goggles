var Miner = {
    sourceId: null,
    execute: function (creep) {
        var sources = creep.room.find(FIND_SOURCES);

        for (var id in sources) {
            var source = sources[id];

            var harvest = creep.harvest(source);

            switch (harvest) {
                case ERR_NOT_IN_RANGE: creep.moveTo(source); creep.say('Moving'); return;
                case OK: return;
                default: break;
            }
        }
    }
};

module.exports = Miner;

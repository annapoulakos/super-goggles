var Utility = require('utility');

var SquadDefinition = {
    miner: {
        id: '',
        donkey: {
            id: '',
            upgrader: {
                id: '',
                builder: {
                    id: '',
                    upgrader: {
                        id: ''
                    }
                },
                repairer: {
                    id: '',
                    upgrader: {
                        id: ''
                    }
                },
                packhorse: {
                    id: '',
                    upgrader: {
                        id: ''
                    }
                }
            }
        }
    }
};

var Squad = function (def) {
    this.definition = def;
};

var SquadManager = {
    squads: function (id) {
        if (id) {
            return new Squad(Memory.squads[id]);
        } else {
            return Memory.squads.map(s => new Squad(s));
        }
    },
    addSquad: function () {
        if (!Memory.squads) {
            Memory.squads = {};
        }

        var guid = Utility.newGuid();

        Memory.squads[guid] = SquadDefinition;

        return guid;
    },
    removeSquad: function (guid) {
        if (Memory.squads[guid]) {
            delete Memory.squads[guid];
            return true;
        }

        return false;
    }
};

module.exports = SquadManager;

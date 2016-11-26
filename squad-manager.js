var StringBuilder = require('utility.strings');

var SquadManager = {
    log: function (message) {
        StringBuilder.log('squad-manager', message);
    },
    AddWorker: function (room, type, name) {
        switch (type) {
            case 'miner': 
                room.memory.squads.production.forEach(squad => {
                    if (squad.miner.current.length < squad.miner.require) {
                        squad.miner.current.push(name);
                    }
                });
                break;
            case 'donkey':
                room.memory.squads.production.forEach(squad => {
                    if (squad.donkey.current.length < squad.donkey.require) {
                        squad.donkey.current.push(name);
                    }
                });
                break;
        }
    },
    QueueCreep: function (room) {
        if (!room.memory.squads) {
            this.log('Room has no squad configuration. Building a new squad configuration.');
            room.memory.squads = {
                combat: {
                    quantity: 0,
                    squads: []
                },
                production: {
                    quantity: room.find(FIND_SOURCES).length,
                    squads: []
                },
                infrastructure: {
                    quantity: 1,
                    squads: []
                }
            };

            for (var key in room.memory.squads) {
                for (var i = 0; i < room.memory.squads[key].quantity; ++i) {
                    this.log(`Creating new ${key} squad.`);
                    room.memory.squads[key].squads.push(this.createSquad(key, room));
                }
            }
        }

        var needsProduction = this.checkProductionNeeds(room.memory.squads.production);
        if (needsProduction) {
            this.log(`Production squad member '${needsProduction}' required.`);
            return needsProduction;
        }

        var needsInfrastructure = this.checkInfrastructureNeeds(room.memory.squads.infrastructure);
        if (needsInfrastructure) {
            this.log('Infrastructure squad member required.');
            return needsInfrastructure;
        }

        var needsCombat = this.checkCombatNeeds(room.memory.squads.infrastructure);
        if (needsCombat) {
            this.log('Combat squad member required.');
            return needsCombat;
        }

        this.log('No squad members required.');
        return;
    },
    checkProductionNeeds: function (config) {
        var requirements = config.squads.map(squad => {
            if (squad.miner.current.length < squad.miner.require) {
                return 'miner';
            } else if (squad.donkey.current.length < squad.donkey.require) {
                return 'donkey';
            }
        });

        if (requirements.length) {
            return requirements[0];
        }

        return false;
    },
    checkInfrastructureNeeds: function (config) {
        var requirements = config.squads.map(squad => {
            if (squad.packhorse.current.length < squad.packhorse.require) {
                return 'packhorse';
            } else if (squad.upgrader.current.length < squad.upgrader.require) {
                return 'upgrader';
            } else if (squad.builder.current.length < squad.builder.require) {
                return 'builder';
            } else if (squad.repairer.current.length < squad.repairer.require) {
                return 'repairer';
            }
        });

        if (requirements.length) {
            return requirements[0];
        }

        return false;
    },
    checkCombatNeeds: function (config) {
        return false;
    },
    createSquad: function (type, room) {
        var squadTypes = {
            production: {
                miner: {
                    require: 1,
                    current: []
                },
                donkey: {
                    require: 2,
                    current: []
                },
            },
            infrastructure: {
                builder: {
                    require: 0,
                    current: []
                },
                repairer: {
                    require: 0,
                    current: []
                },
                upgrader: {
                    require: 0,
                    current: []
                },
                packhorse: {
                    require: 0,
                    current: []
                },
            }
        };

        if (squadTypes[type]) {
            return squadTypes[type];
        }

        return null;
    }
};

module.exports = SquadManager;

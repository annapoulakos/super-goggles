var WorkerTypes = {
    Tier1: {
        General: [WORK, CARRY, MOVE],
        Worker: [WORK, WORK, MOVE],
        Transport: [CARRY, MOVE, MOVE]
    },
    Tier2: {
        General: [WORK, WORK, CARRY, MOVE, MOVE],
        Worker: [WORK, WORK, WORK, WORK, MOVE],
        Transport: [CARRY, CARRY, MOVE, MOVE, MOVE]
    },
    Tier3: {
        General: [WORK, WORK, WORK, CARRY, CARRY, MOVE, MOVE],
        Worker: [WORK, WORK, WORK, WORK, WORK, MOVE, MOVE],
        Transport: [CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE]
    }
};

var WorkerRoleCounts = {
    Tier1: [
        'harvester',
        'harvester',
        'harvester',
        'upgrader',
        'builder',
        'upgrader'
    ],
    Tier2: [
        'miner',
        'donkey',
        'donkey',
        'miner',
        'donkey',
        'donkey',
        'miner',
        'donkey',
        'donkey',
        'miner',
        'donkey',
        'donkey',
        'upgrader',
        'builder',
        'upgrader',
        'upgrader',
        'builder',
        'upgrader'
    ],
    Tier3:[
        'miner',
        'donkey',
        'donkey',
        'miner',
        'donkey',
        'donkey',
        'upgrader',
        'builder',
        'upgrader',
        'upgrader',
        'builder',
        'upgrader'
    ]
};

var WorkerRoleTypeMap = {
    harvester: 'General',
    upgrader: 'General',
    builder: 'General',
    miner: 'Worker',
    donkey: 'Transport'
};

var isTier = (creep, tier) => creep.memory.tier == tier;
var hasRole = (creep, role) => creep.memory.role == role;

var Worker = {
    execute: function (creep) {

    },
    initialize: function (creep) {
        creep.memory.initialized = true;
    },
    getCreepStats: function (spawn) {
        var creepCounts = {
                Tier1: _.filter(Game.creeps, (creep) => isTier(creep, 'Tier1')),
                Tier2: _.filter(Game.creeps, (creep) => isTier(creep, 'Tier2')),
                Tier3: _.filter(Game.creeps, (creep) => isTier(creep, 'Tier3'))
            },
            roleCounts = {
                Tier1: {
                    harvester: _.filter(creepCounts.Tier1, (creep) => hasRole(creep, 'harvester')),
                    upgrader: _.filter(creepCounts.Tier1, (creep) => hasRole(creep, 'upgrader')),
                    builder: _.filter(creepCounts.Tier1, (creep) => hasRole(creep, 'builder'))
                }
            };

        return {
            creepsByTier: creepCounts,
            creepsByRole: roleCounts
        };
    },
    createCreep: function (spawn) {

    }
};

module.exports = Worker;

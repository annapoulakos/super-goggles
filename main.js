require('creep-extensions');
require('tower-extensions');
require('room-extensions');

var Utility = require('utility'),
    StringBuilder = require('utility.strings'),
    Cleanup = require('utility.cleanup'),
    Spawn = require('utility.spawn'),
    SpawnManager = require('utility.spawn-manager'),
    Constants = require('constants'),
    Worker = require('role.worker'),
    Roles = {
        harvester: require('role.harvester'),
        upgrader: require('role.upgrader'),
        builder: require('role.builder'),
        miner: require('role.miner'),
        donkey: require('role.donkey'),
        repairer: require('role.repairer'),
        packhorse: require('role.packhorse')
    };

var energy = {};
var Schematics = {
    Worker: [WORK,WORK,WORK,WORK,MOVE],
    Transport: [CARRY,CARRY,MOVE,MOVE,MOVE],
    General: [WORK,WORK,CARRY,CARRY,MOVE]
};

var TieredSchematics = {
    Tier1: {
        Worker: [WORK,WORK,MOVE,MOVE],
        Transport: [CARRY,CARRY,CARRY,MOVE,MOVE,MOVE],
        General: [WORK,WORK,CARRY,MOVE]
    },
    Tier2: {
        Worker: [WORK,WORK,WORK,WORK,MOVE,MOVE],
        Transport: [CARRY,CARRY,MOVE,MOVE,MOVE],
        General: [WORK,WORK,CARRY,MOVE,MOVE]
    },
    Tier3: {
        Worker: [WORK,WORK,WORK,WORK,WORK,MOVE,MOVE],
        Transport: [CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE],
        General: [WORK,WORK,WORK,CARRY,MOVE,MOVE,MOVE]
    },
    Tier4: {
        Worker: [WORK,WORK,WORK,WORK,WORK,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE],
        Transport: [CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE]
    }
};

function make (schematic, role) {
    return Game.spawns['Spawn1'].createCreep(schematic, undefined, {role: role});
}

module.exports.loop = function () {
    Cleanup();

    var miners = _.filter(Game.creeps, (creep) => creep.memory.role == 'miner.v2');
    var donkeys = _.filter(Game.creeps, (creep) => creep.memory.role == 'donkey.v2');
    var builders = _.filter(Game.creeps, (creep) => creep.memory.role == 'builder');
    var upgraders = _.filter(Game.creeps, (creep) => creep.memory.role == 'upgrader');
    var repairers = _.filter(Game.creeps, creep => creep.memory.role == 'repairer');
    var packhorses = _.filter(Game.creeps, c => c.memory.role == 'packhorse.v2');

    var creeps = _.filter(Game.creeps, creep => creep);

    if (creeps.length < 10) {
        StringBuilder.log('kernel', `Creep needed ${creeps.length} / 13`);

        var name = '';
        var role = 'miner.v2';
        var tier = 'Tier1';
        var type = 'Worker';
        var schematic = [];

        var availableEnergy = Game.rooms['W8N3'].energyAvailable;

        if (availableEnergy <= 300) {
            tier = 'Tier1';
        } else if (availableEnergy <= 500) {
            tier = 'Tier2';
        } else if (availableEnergy <= 600) {
            tier = 'Tier3';
        }

        if (miners.length < 2) {
            var m = require('role.miner.v2');
            role = 'miner.v2';
            schematic = Utility.generateBodyFromParts(m.getOptimalBuild(Game.rooms['W8N3'].energyAvailable));
        } else if (donkeys.length < 4) {
            var d = require('role.donkey.v2');
            role = 'donkey.v2';
            schematic = Utility.generateBodyFromParts(d.getOptimalBuild(Game.rooms['W8N3'].energyAvailable));
        } else if (builders.length < 1) {
            role = 'builder';
            schematic = TieredSchematics[tier]['General'];
        } else if (repairers.length < 1) {
            type = 'General'; role = 'repairer';
            schematic = TieredSchematics[tier]['General'];
        } else if (packhorses.length < 1) {
            var p = require('role.packhorse.v2');
            role = 'packhorse.v2';
            schematic = Utility.generateBodyFromParts(p.getOptimalBuild(Game.rooms['W8N3'].energyAvailable));
        } else {
            type = 'General'; role = 'upgrader';
            schematic = TieredSchematics[tier]['General'];
        }

        name = make(schematic, role);

        switch (name) {
            case '': break;
            case ERR_BUSY: break;
            case ERR_NOT_ENOUGH_ENERGY: break;
            default: console.log('Building new worker, ' + name + ' (' + tier + '-' + role + '), from the broken pieces of ' + Memory.lastCreepName);
        }
    }

    for (var name in Game.rooms) {
        if (!energy[name]) {
            energy[name] = 0;
        }

        var available = Game.rooms[name].energyAvailable;
        var containers = _.filter(Game.rooms[name].find(FIND_STRUCTURES, {filter: (structure) => structure.structureType == STRUCTURE_CONTAINER}));
        available = available + containers.map(container => container.store[RESOURCE_ENERGY]).reduce((e, s) => e+s, 0);

        if (energy[name] != available) {
            energy[name] = available;
            var build = Game.rooms[name].energyAvailable, containered = available - build;
            StringBuilder.log('energy', `Room ${name}: Total ${available}, Containered ${containered}, Build, ${build}`);
        }
    }

    // Room Execution Loop
    //_.filter(Game.rooms, r => r).forEach(r => r.jpExecute());

    // Tower Execution Loop
    _.filter(Game.structures, s => s.structureType == STRUCTURE_TOWER).forEach(t => t.jpExecute());

    // Creep Execution Loop
    _.filter(Game.creeps, c => c).forEach(c => c.jpExecute());
};

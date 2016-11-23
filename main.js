var Utility = require('utility'),
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
        packhorse: require('role.pack-horse')
    };

var energy = {};
var Schematics = {
    Worker: [WORK,WORK,WORK,WORK,MOVE],
    Transport: [CARRY,CARRY,MOVE,MOVE,MOVE],
    General: [WORK,WORK,CARRY,CARRY,MOVE]
};

var TieredSchematics = {
    Tier1: {
        Worker: [WORK,WORK,MOVE],
        Transport: [CARRY,MOVE,MOVE],
        General: [WORK,CARRY,MOVE]
    },
    Tier2: {
        Worker: [WORK,WORK,WORK,WORK,MOVE],
        Transport: [CARRY,CARRY,MOVE,MOVE,MOVE],
        General: [WORK,WORK,CARRY,MOVE,MOVE]
    },
    Tier3: {
        Worker: [WORK,WORK,WORK,WORK,WORK,WORK,MOVE],
        Transport: [CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE],
        General: [WORK,WORK,WORK,CARRY,MOVE,MOVE,MOVE]
    }
};

function make (schematic, role) {
    return Game.spawns['Spawn1'].createCreep(schematic, undefined, {role: role});
}

module.exports.loop = function () {
    Cleanup();

    var miners = _.filter(Game.creeps, (creep) => creep.memory.role == 'miner');
    var donkeys = _.filter(Game.creeps, (creep) => creep.memory.role == 'donkey');
    var builders = _.filter(Game.creeps, (creep) => creep.memory.role == 'builder');
    var upgraders = _.filter(Game.creeps, (creep) => creep.memory.role == 'upgrader');
    var repairers = _.filter(Game.creeps, creep => creep.memory.role == 'repairer');
    var packHorses = _.filter(Game.creeps, creep => creep.memory.role == 'packhorse');

    var creeps = _.filter(Game.creeps, (creep) => !creep.memory.isV2);

    if (creeps.length < 18) {
        var name = '';
        var role = 'miner';
        var tier = 'Tier1';
        var type = 'Worker';

        if (creeps[0].room.energyAvailable > 650) {
            tier = 'Tier3';
        } else if (creeps[0].room.energyAvailable > 300) {
            tier = 'Tier2';
        }

        if (miners.length == 0) {
            type = 'Worker'; role = 'miner';
        } else if (miners.length >= 1 && donkeys.length < 2) {
            type = 'Transport'; role = 'donkey';
        } else if (miners.length == 1 && donkeys.length == 2) {
            type = 'Worker'; role = 'miner';
        } else if (miners.length == 2 && donkeys.length < 4) {
            type = 'Transport'; role = 'donkey';
        } else if (upgraders.length < 1) {
            type = 'General'; role = 'upgrader';
        } else if (upgraders.length >= 1 && builders.length < 1) {
            type = 'General'; role = 'builder';
        } else if (upgraders.length < 3) {
            type = 'General'; role = 'upgrader';
        } else if (repairers.length < 1) {
            type = 'General'; role = 'repairer';
        } else if (packHorses.length < 1) {
            type = 'Transport'; role = 'packhorse';
        } else {
            type = 'General'; role = 'upgrader';
        }

        name = make(TieredSchematics[tier][type], role);

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
            //console.log('Energy: Total - ' + available + ', Containered - ' + (available - Game.rooms[name].energyAvailable));
        }
    }

    var towers = _.filter(Game.structures, structure => structure.structureType == STRUCTURE_TOWER);
    _.forEach(towers, tower => {
        // var structure = tower.pos.findClosestByRange(FIND_STRUCTURES, { filter: structure => structure.hits < structure.hitsMax });
        // if (structure) {
        //     tower.repair(structure);
        // }

        var hostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
        if (hostile) {
            tower.attack(hostile);
        }
    });

    for (var name in Game.creeps) {
        var creep = Game.creeps[name];

        if (Roles[creep.memory.role]) {
            Roles[creep.memory.role].execute(creep);
        }
    }
};

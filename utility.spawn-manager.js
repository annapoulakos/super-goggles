var SpawnManager = {
    tieredSchematics: {
        tier1: {
            generalPurpose: [WORK, CARRY, MOVE],
            transport: [CARRY, CARRY, MOVE],
            courier: [CARRY, MOVE, MOVE],
            worker: [WORK, WORK, MOVE]
        },
        tier2: {
            generalPurpose: [WORK, WORK, CARRY, MOVE, MOVE],
            transport: [CARRY, CARRY, MOVE, MOVE, MOVE],
            worker: [WORK, WORK, WORK, WORK, MOVE],
            courier: [CARRY, MOVE, MOVE, MOVE, MOVE]
        }
    },
    levelQueues: [
        {
            "tier": 'tier1',
            "queue": [
                {"type": "generalPurpose", "role": "harvester"},
                {"type": "generalPurpose", "role": "harvester"},
                {"type": "generalPurpose", "role": "harvester"},
                {"type": "generalPurpose", "role": "harvester"},
                {"type": "generalPurpose", "role": "upgrader"},
                {"type": "generalPurpose", "role": "upgrader"},
                {"type": "generalPurpose", "role": "upgrader"},
                {"type": "generalPurpose", "role": "upgrader"},
                {"type": "generalPurpose", "role": "builder"},
                {"type": "generalPurpose", "role": "builder"}
            ]
        },
        {
            "tier": 'tier2',
            "queue": [
                {"type": "worker", "role": "miner"},
                {"type": "worker", "role": "miner"},
                {"type": "transport", "role": "donkey"},
                {"type": "transport", "role": "donkey"},
                {"type": "generalPurpose", "role": "builder"},
                {"type": "generalPurpose", "role": "builder"},
                {"type": "generalPurpose", "role": "upgrader"},
                {"type": "generalPurpose", "role": "upgrader"},
                {"type": "generalPurpose", "role": "upgrader"},
                {"type": "generalPurpose", "role": "upgrader"}
            ]
        }
    ],
    Initialize: function () {
        if (!Memory.initializeSpawnManager) {
            Memory.levelQueues = this.levelQueues;
            Memory.currentLevel = 0;
            Memory.experience = 0;
            Memory.initializeSpawnManager = true;
        }
    },
    QueueWorker: function (spawn) {
        var creeps = _.filter(Game.creeps, (creep) => creep);

        if (Memory.currentLevel = Memory.levelQueues.length) {
            Memory.currentLevel--;
        }
        if ((Memory.experience > Memory.levelQueues[Memory.currentLevel].queue.length * 2) && Memory.currentLevel < Memory.levelQueues[Memory.currentLevel].length) {
            Memory.currentLevel++;
            Memory.experience = 0;

        }


        if (creeps.length < Memory.levelQueues[Memory.currentLevel].queue.length) {
            var queueInfo = Memory.levelQueues[Memory.currentLevel],
                schematic = this.tieredSchematics[queueInfo.tier][queueInfo.queue[0].type];

            var canCreateCreep = spawn.canCreateCreep(schematic, undefined);
            switch (canCreateCreep) {
                case ERR_BUSY: break;
                case ERR_NOT_ENOUGH_ENERGY: break;
                case OK: 
                    var name = spawn.createCreep(schematic, undefined, { role: queueInfo.queue[0].role, tier: Memory.levelQueues[Memory.currentLevel].tier});
                    console.log('Created (' + queueInfo.queue[0].role + ') named ' + name);

                    Memory.levelQueues[Memory.currentLevel].queue.push(Memory.levelQueues[Memory.currentLevel].queue.shift());
                    Memory.experience++;
                    break;
                default: return;
            }
        }
    }
};

module.exports = SpawnManager;

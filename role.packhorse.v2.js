var MessageBus = require('utility.message-bus');

var PackHorse = {
    type: 'packhorse-v2',
    body: {
        Tier1: [CARRY,CARRY,MOVE,MOVE,MOVE],
        Tier2: [CARRY,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE,MOVE],
        Tier3: [CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE,MOVE]
    },
    memory: {
        role: 'packhorse-v2',
        currentTask: {event: 'REFILL'},
        isV2: true
    },
    execute: function (creep) {
        var action = creep.memory.currentTask;

        if (action.event == 'noop') {
            creep.memory.currentTask = MessageBus.Read();
        }

        switch(creep.memory.currentTask.event) {
            case 'NEED_ENERGY': 
                var target = Game.getObjectById(creep.memory.currentTask.id);
                if (target == null) {
                    creep.memory.currentTask = {event: 'noop'};
                } else {
                    if (creep.transfer(target) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(target);
                        creep.say('Moving');
                    }

                    if (target && target.carry.energy == target.carryCapacity) {
                        target.memory.sentMessage = false;
                        if (creep.carry.energy > (creep.carryCapacity / 2)) {
                            creep.memory.currentTask = {event: 'noop'};
                        } else {
                            creep.memory.currentTask = {event: 'REFILL'};
                        }
                    }
                }
                
                break;
            case 'REFILL':
                if (creep.carry.energy == creep.carryCapacity) {
                    creep.memory.currentTask = {event: 'noop'};
                }

                var closest = creep.pos.findClosestByRange(FIND_STRUCTURES, { filter: structure => structure.structureType == STRUCTURE_CONTAINER && structure.store[RESOURCE_ENERGY] > creep.carryCapacity});
                if (closest) {
                    if (creep.withdraw(closest, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(closest);
                        creep.say('Moving');
                    }
                }
                break;
            case 'noop':
                if (creep.carry.energy < creep.carryCapacity) {
                    creep.memory.currentTask = {event: 'REFILL'};
                }
            default: break;
        }
    }
};

module.exports = PackHorse;

var MessageBus = require('utility.message-bus'),
    StringBuilder = require('utility.strings'),
    Utility = require('utility'),
    Constants = require('constants');

var PackHorse = {
    log: function (m) { StringBuilder.log('packhorse', m); },
    getOptimalBuild: function (energy) {
        var counts = (energy / (Constants.PartCosts.CARRY + Constants.PartCosts.MOVE))|0;

        counts = Utility.clamp(counts, 1, 10);

        return {
            CARRY: counts,
            MOVE: counts
        }
    },
    defaultTask: { sender: 'self', resource: RESOURCE_ENERGY },
    refillEnergy: function (creep) {
        if (creep.carry.energy == creep.carryCapacity) {
            return;
        }

        var target = creep.pos.findClosestByRange(FIND_STRUCTURES, { filter: s => s.structureType == STRUCTURE_CONTAINER && s.store[RESOURCE_ENERGY] > 0 });
        if (target) {
            var result = creep.withdraw(target);

            switch (result) {
                case ERR_NOT_IN_RANGE: 
                    creep.moveTo(target);
                    break;
            }
        }
    },
    giveEnergy: function (creep) {
        var target = Game.getObjectById(creep.memory.currentTask.sender);

        if (target == null) {
            creep.memory.currentTask = this.defaultTask;
            this.refillEnergy(creep);
            return;
        }

        var result = creep.transfer(target);

        switch (result) {
            case ERR_INVALID_TARGET: 
                creep.memory.currentTask = this.defaultTask;
                break;
            case ERR_NOT_IN_RANGE: 
                creep.moveTo(target); 
                break;
            case ERR_NOT_ENOUGH_RESOURCES: 
                MessageBus.RedoRequest(creep.memory.currentTask);
                break;
            case ERR_FULL:
                target.memory.request = false;
                creep.memory.currentTask = this.defaultTask;
                break;
            case OK: 

        }
    },
    execute: function (creep) {
        creep.memory.currentTask = creep.memory.currentTask || null

        if (creep.carry.energy == 0) {
            creep.memory.currentTask = this.defaultTask;
        }

        if (creep.carry.energy == creep.carryCapacity && creep.memory.sender == 'self') {
            creep.memory.currentTask = MessageBus.ReceiveNext(RESOURCE_ENERGY);
        }

        if (creep.memory.currentTask == null) {
            creep.memory.currentTask = this.defaultTask;
        }

        switch (creep.memory.sender) {
            case 'self':
                this.refillEnergy(creep);
                break;
            default: 
                this.giveEnergy(creep);
                break;
        }


        return;
        var action = creep.memory.currentTask;

        if (action.event == 'noop') {
            creep.memory.currentTask = MessageBus.Read();
        }
    }
};

module.exports = PackHorse;

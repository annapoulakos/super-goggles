module.exports = function () {
    for(var name in Memory.creeps) {
        if (!Game.creeps[name]) {
            console.log('Our ' + Memory.creeps[name].role + ', ' + name + ', has died! Oh dear! Time to plan the funeral.');
            Memory.lastCreepName = name;
            delete Memory.creeps[name];
        }
    }
};

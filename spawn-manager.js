var CURRENT_VERSION = 'v2';

var StringBuilder = require('utility.strings');

var SpawnManager = {
    log: function (message) {
        StringBuilder.log('spawn-manager', message);
    },
    Build: function (creep, room) {
        this.log(`Building ${creep}`);

        var spawns = room.find(FIND_MY_SPAWNS);

        if (spawns.length) {
            var spawn = spawns[0];
            var worker = require(`role.${creep}.${CURRENT_VERSION}`),
                build = worker.getOptimalBuild(room.energyAvailable)

            this.log(`Creating new ${creep} at spawn location ${spawn.name}.`);
            this.log('Optimal Build: ' + JSON.stringify(build));

            spawn.createCreep(build, undefined, {role: `${creep}.${CURRENT_VERSION}`});
        } else {
            this.log('There was an error retrieving spawn information.');
        }
    }
};

module.exports = SpawnManager;

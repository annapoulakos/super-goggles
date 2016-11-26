var SquadManager = require('squad-manager'),
    SpawnManager = require('spawn-manager');

Room.prototype.jpExecute = function () {
    var creep = SquadManager.QueueCreep(this);

    if (creep) {
        SpawnManager.Build(creep, this);
    }

    // TODO: Manage automated building queue
    // TODO: Manage automated laboratory reactions
};


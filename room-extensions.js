var SquadManager = require('squad-manager');

Room.prototype.jpExecute = function () {
    var creep = SquadManager.QueueCreep(room);

    if (creep) {
        SpawnManager.Build(creep);
    }

    // TODO: Manage automated building queue
    // TODO: Manage automated laboratory reactions
};


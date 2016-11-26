var Parts = {
    WORK: WORK,
    MOVE: MOVE,
    CARRY: CARRY,
    ATTACK: ATTACK,
    RANGED_ATTACK: RANGED_ATTACK,
    CLAIM: CLAIM,
    HEAL: HEAL,
    TOUGH: TOUGH
};

module.exports = {
    getCreepsByRole: role => _.filter(Game.creeps, c => c.jpHasRole(role)),
    getCreepsByNotRole: role => _.filter(Game.creeps, c => !c.jpHasRole(role)),
    getCreepsExceptRoles: roles => _.filter(Game.creeps, c => !_.some(roles, c.memory.role)),
    newGuid: () => {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
            var r = Math.random()*16|0, v = c == 'x'? r: (r&0x3|0x8); 
            return v.toString(16);
        });
    },
    generateBodyFromParts: parts => {
        var body = [];

        for (var key in parts) {
            if (parts.hasOwnProperty(key)) {
                for (var i = 0; i < parts[key]; ++i) {
                    body.push(Parts[key]);
                }
            }
        }

        return body;
    },
    clamp: function (value, min, max) {
        return value < min
            ? min
            : (value > max
                ? max
                : value);
    },
    buildBest: function (role) {
        var worker = require(`role.${role}`),
            build = worker.getOptimalBuild(Game.rooms['W8N3'].energyAvailable),
            parts = this.generateBodyFromParts(build);

        Game.spawns['Spawn1'].createCreep(parts, undefined, {role: role});
    },
    killAll: function () {
        _.filter(Game.creeps, c => c).forEach(c => c.suicide());
    }
};

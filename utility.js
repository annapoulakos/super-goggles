Creep.prototype.jpHasRole = function (role) {
    return this.memory.role == role;
};

module.exports = {
    getCreepsByRole: role => _.filter(Game.creeps, c => c.jpHasRole(role)),
    getCreepsByNotRole: role => _.filter(Game.creeps, c => !c.jpHasRole(role)),
    getCreepsExceptRoles: roles => _.filter(Game.creeps, c => !_.some(roles, c.memory.role))
};

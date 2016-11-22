var Spawn = function (location, role) {
    return Game.spawns[location].createCreep(role.parts, undefined, role.memory);
}

module.exports = Spawn;

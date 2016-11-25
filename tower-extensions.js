StructureTower.prototype.jpExecute = function () {
    // var structure = this.pos.findClosestByRange(FIND_STRUCTURES, { filter: structure => structure.hits < structure.hitsMax });
    // if (structure) {
    //     this.repair(structure);
    // }

    var hostile = this.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
    if (hostile) {
        this.attack(hostile);
    }
}

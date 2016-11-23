Creep.prototype.jpHasRole = function (role) {
    return this.memory.role == role;
};

Creep.prototype.jpExecute = function () {
    // TODO: This needs to execute the current role.
    var role = require('role.' + this.memory.role);

    role.execute(this);
};

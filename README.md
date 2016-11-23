# screeps

This repository contains a bunch of random scripts for the game screeps. Your mileage may varry.

#### Roles

* `role.builder`: This worker role builds structures and has a fallback repair ability.
* `role.donkey`: This role picks up dropped energy and deposits it into storage in this priority: Spawn -> Extension -> Container -> Storage
* `role.harvester` **DEP**: This is a dual-purpose role which combines mining energy with depositing it. This role is deprecated.
* `role.miner`: This role goes to a source and harvests energy.
* `role.pack-horse`: This role scavenges dropped energy and feeds it to creeps in need.
* `role.pack-horse.v2` **BETA**: This role will work like the `role.pack-horse` except that it will be using the internal message bus to receive its orders.
* `role.repairer`: This role's primary focus is repairing.
* `role.upgrader`: This role's primary focus is upgrading the room controller
* `role.upgrader.v2` **BETA**: This role functions similarly to the `role.upgrader`, except that it does not find its own energy, instead using the internal message bus to request additional resources.
* `role.worker` **DEP**: This role is being deprecated, as I could not implement a rules engine.

#### Utilities

* `utility.cleanup`: This utility function cleans up dead creep memory. Will additionally perform other cleanup as well.
* `utility`: This object contains a number of utility methods.
* `utility.message-bus` **BETA**: This drives the internal message bus.
* `utility.spawn-manager` **DEP**: This deprecated module was meant to manage creep spawning. A beta version of my squad management tool is currently being worked on.
* `utility.spawn` **DEP**: This deprecated module lets you create creeps a little easier.



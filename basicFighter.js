({
    init() {
        this.lastActionTime = Date.now();
    this.myPlayerId = localPlayer.pid; // Replace on script start with opcode 139
    },

    isTargetingPlayer(mob, myPlayerId) {
        if (!mob || typeof mob.targetId !== "number") return false;
        const targetIndex = mob.targetId - 32768;
        return targetIndex === myPlayerId;
    },

    run(packet) {
        const now = Date.now();

        // Cooldown check: 5 seconds
        if ((now - this.lastActionTime) < 5000) {
            return;
        }

        const targetIds = [5123,5128]; // NPC ids - started with MEN

        for (const id of targetIds) {
            const mob = mobs[id];

            if (mob) {
                console.log(`Mob ID: ${id}, targetId: ${mob.targetId}`);
            }

            if (this.isTargetingPlayer(mob, this.myPlayerId)) {
                console.log(`Under attack by mob ID: ${id}`);
                outputStream.opcode(8);
                outputStream.p2(id);
                this.lastActionTime = now;
                return;
            }

            if (mob && mob.targetId === -1) {
                console.log(`Attacking idle mob ID: ${id}`);
                outputStream.opcode(8);
                outputStream.p2(id);
                this.lastActionTime = now;
                return;
            }
        }

        console.log("No valid target mobs available.");
    }
})

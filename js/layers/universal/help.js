/*=============vv=================\\
|| HELP.JS ||                     ||
>>=========//                     ||
|| This file contains information ||
|| to help players understand the ||
|| gameplay loop and features.    ||
\\================================*/

addLayer("h", {
        layer: "h", 
        name: "Help Layer", // This layer is linked on the side and provides guidance.
        startData() { return {
            unlocked: true,
            points: new Decimal(0),
        }},


        //Default functions, unknown if these are necessary
        convertToDecimal() {
            // Convert any layer-specific Decimal values (besides points, total, and best) from String to Decimal (used when loading save)
        },
        color:() => "#DCDB13",
        requires:() => new Decimal(0), // Can be a function that takes requirement increases into account
        resource: "prestige points", // Name of prestige currency
        baseResource: "points", // Name of resource prestige is based on
        baseAmount() {return player.points}, // Get the current amount of baseResource
        type: "none", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
        exponent: 0.5, // Prestige currency exponent
        base:() => hasUpgrade(this.layer, 11)?4:5, // Only needed for static layers, base of the formula (b^(x^exp))
        resCeil: false, // True if the cost needs to be rounded up (use when baseResource is static?)
        canBuyMax() {}, // Only needed for static layers with buy max
        gainMult() { // Calculate the multiplier for main currency from bonuses
            mult = new Decimal(1)
            if (hasUpgrade(this.layer, 166)) mult = mult.times(2) // These upgrades don't exist
            if (hasUpgrade(this.layer, 120)) mult = mult.times(upgEffect(this.layer, 120))
            return mult
        },
        gainExp() { // Calculate the exponent on main currency from bonuses
            return new Decimal(1)
        },
        row: "side", // Row the layer is in on the tree (0 is the first row)
        effect() {
            return {} // Formulas for any boosts inherent to resources in the layer. Can return a single value instead of an object if there is just one effect
        },
        upgrades: {
       },
        doReset(resettingLayer){
            //never resets lmao
        },
        layerShown() {return true}, // Condition for when layer appears on the tree
        update(diff) {
            if (player[this.layer].upgrades.includes(11)) player.points = player.points.add(tmp.pointGen.times(diff)).max(0)
            if (player[this.layer].upgrades.includes(13)) player[this.layer].acceleration = player[this.layer].acceleration.add(1/player[this.layer].acceleration)
        }, // Do any gameloop things (e.g. resource generation) inherent to this layer
        automate() {
        }, // Do any automation inherent to this layer if appropriate
        updateTemp() {
        }, // Do any necessary temp updating, not that important usually
        resetsNothing() {return false},
        onPrestige(gain) {

            return
        }, // Useful for if you gain secondary resources or have other interesting things happen to this layer when you reset it. You gain the currency after this function ends.

        hotkeys: [
            {key: "h", description: "H: open Help menu", onPress(){player.tab = "h"}},
        ],
        incr_order: [], // Array of layer names to have their order increased when this one is first unlocked

        tooltip() { // Optional, tooltip displays when the layer is unlocked
            let tooltip = "Help"
            return tooltip
        },
        shouldNotify() {},

tabFormat: {
    "Overview": {
        content: [
            ["display-text", "<h2>Overview</h2><br><br><p>TreeQuest is a puzzle-adventure game using The Modding Tree as an engine. Whilst there may [eventually]  be incremental features, TreeQuest is at its heart a game about puzzles/exploration.</p><br>\n\
            <p>The 'nodes' on the main screen represent a map of the area you're in, usually as though viewed from above - each node is a room or a part of an area, and may contain items or tasks to complete.</p><br>\n\
            <p>Your objective will vary, but can always be found in the 'Personal' node (the P in the side list). This tab contains various help topics, more of which will be added as you progress.</p><br><br><br>\n\
            Note: Use of [eventually] in these pages hints at functionality planned for a later update."],
        ],
    },
    "Tasks": {
        content: [
            ["display-text", "<h2>Tasks</h2><br><br><p>The primary way to make progress is to complete tasks. These tasks are represented in the form of buyables, and will all behave in a similar way. Tasks are colour-coded for easy recognition, as below:</p><br>\n\
            <ul><li style='color: #bf7f7f'>Red: this task cannot be completed right now. This usually means you lack a necessary item or a pre-requisite task has not yet been completed. The text will usually give you an indication of what you need to do first.</li>\n\
            <li style='color: #cfec23'>Amber: this task is available to be completed. The description will state what the task will do and provide a duration in seconds. Once you begin the task it will fill green to show its progress.</li>\n\
            <li style='color: #19fc3d'>Green: this task has been completed. It remains visible, usually with a hint to a subsequent task it enables you to complete.</li></ul><br><br>\n\
            <p>Tasks that remain visible and green will have one or more related tasks to complete. Once a task is completely finished with (if the task is stand-alone, or the final related task in the chain has been completed) its icon will disappear completely. Usually you will receive an item or the gameplay will change in some way.</p><br>\n\
            <p>Tasks take your entire focus, so only one can be completed at a time - starting a task will turn the others in the area red. In addition, if you leave the area before a task has been completed, your progress will be lost!</p>"],
        ],
    },
    "Oxygen": {
        content: [
            ["display-text", "<h2>Oxygen</h2><br><br><p>Your primary resource in this game is your oxygen level. This number is an abstraction that represents the number of seconds you can spend outside of safe zones (whilst still allowing for you to return to safety afterwards).</p><br>\n\
            <p>When you venture out of safety and perform tasks, the oxygen level will decrease. Once it hits zero, you will need to return to a safe zone, where your oxygen will automatically refill.</p><br>\n\
            <p>You start the game with one oxygen tank, granting you a total of ten seconds' venturing time. Finding additional tanks will increase this limit.</p><br><br>\n\
            In-progress task chains may reset if you run out of oxygen or stop venturing out, so you will need to plan your route to ensure you can complete all required tasks in time."],
        ],
        unlocked() { return player.p.chapter >= 0 }
    },
    "Fusebox": {
        content: [
            ["display-text", "<h2>Fusebox</h2><br><br><p>The fusebox allows you to control power to the eight corridor sections around the central maintenance room. Each room is represented by a slot on the grid.</p><br>\n\
            <p>You start with one fuse, in the Corridor 1 slot. You can click to remove this fuse, which will then allow you to place it in another corridor. As you find additional fuses, you can power multiple sections at once.</p><br>\n\
            <p>You can only venture in powered sections. You can change which sections are powered whilst still in 'venture' mode, but most tasks will reset if their section is powered off, or be uncompletable if a preceding section is. (There are exceptions to this. Whilst not required, they will let you 'sequence break', so feel free to experiment!)"]
        ],
        unlocked() { return player.p.chapter == 0 && player.p.fusebox_key }
    },
    "Generators": {
        content: [
            ["display-text", "<h2>Generators</h2><br><br><p>The eight generators (one each in nodes G1 through G8) will produce power when active. Each generator takes the power output from the previous one and performs some function to it, after a deduction for inefficiency. If a stable loop is formed - that is, if a generator has the same amount of power after a full loop - the average power level of all 8 generators will appear as the output in the MC layer.</p><br>\n\
            <p>You can toggle the generators on (or off) from the MC layer. This will kickstart the generators by feeding 100 power into generator 1. However, as five of the generators start broken, you won't be able to make a stable loop, so they'll switch back off again. By exploring further you'll be able to repair some/all of the generators, and produce power.</p><br>\n\
            <p>[Eventually], you will be able to swap out or improve generators to improve overall power generation.</p>"]
        ],
        unlocked() { return player.p.chapter >= 1 }
    },

    "Vertical Map": {
        content: [
            ["display-text", "<h2>Vertical Map</h2><br><br><p>Once you've activated the life support, you'll be able to access the Vertical Map, through the Main Elevator (ME) node. This will swap the tree from a top-down view of the basement, into a side-on view of the facility as a whole. Most nodes on the Vertical Map will be hidden, until you move into an adjacent node.</p><br>\n\
            <p>Nodes on the tree require a certain amount of power (see the Generators tab) to be 'powered' - below this level, they will be 'unpowered'. Nodes will behave differently based on whether or not they're powered, so you may need to increase your power output (or maybe even decrease it!) in order to proceed.</p><br>\n\
            <p>In the Vertical Map you'll find items that unlock/activate nodes on the 'normal' map. As the game proceeds it'll be worth revisiting regularly.</p>"]
        ],
        unlocked() { return player["vtb"].visited_ever }
    },

    "Neural Imprinting": {
        content: [
            ["display-text", "<h2>Neural Imprinting</h2><br><br><p>When the Network Interface (NI) node is unlocked/activated, it will become the Neural Imprinting (NI) node. This node houses a number of 'imprints' (essentially challenges) with quality-of-life gameplay improvements as their rewards.</p><br>\n\
            <p>You can hover over an imprint to see [a clue to? it's pretty opaque for now] its completion conditions. Each imprint can be completed one of two ways:</p><br>\n\
            <ul><li>Regular Completion: The 'standard' way to complete the objective. This will [usually? probably always] be linked to a mandatory point of progression.</li>\n\
            <li>Gold Completion: The 'challenge' way to complete the objective. This will usually require performing something outside of normal progression, and will allow you to access the reward early. If the gold condition is failed/missed, it will appear crossed out in red.</li></ul><br><br>\n\
            <p>The actual reward is the same either way - by the end of the game you'll have the same rewards, but attempting all-golds could prove a nice additional challenge. [At least, once there are more than two entries in there]</p>"]
        ],
        unlocked() { return player["p"].neural_imprinting_active }
    },

}

})

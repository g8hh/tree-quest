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

        tabFormat: {
            "tab 1": {
                content: [['display-text', 'sample']],
            }
        },

        //Default functions, unknown if these are necessary
        convertToDecimal() {
            // Convert any layer-specific Decimal values (besides points, total, and best) from String to Decimal (used when loading save)
        },
        color:() => "#4BDC13",
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
            {key: "p", desc: "C: reset for lollipops or whatever", onPress(){if (player[this.layer].unl) doReset(this.layer)}},
            {key: "ctrl+c" + this.layer, desc: "Ctrl+c: respec things", onPress(){if (player[this.layer].unl) respecBuyables(this.layer)}},
        ],
        incr_order: [], // Array of layer names to have their order increased when this one is first unlocked

        tooltip() { // Optional, tooltip displays when the layer is unlocked
            let tooltip = "Help"
            return tooltip
        },
        shouldNotify() {}
})
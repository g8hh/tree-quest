addLayer("mc", {
        layer: "mc", // This is assigned automatically, both to the layer and all upgrades, etc. Shown here so you know about it
        name: "Maintenance/Control", // This is optional, only used in a few places, If absent it just uses the layer id.
        symbol: "MC",
        startData() { return {
            unlocked: true,
            points: new Decimal(1),
            openDoors: new Decimal(0),
            buyables: {}, // You don't actually have to initialize this one
        }},
        convertToDecimal() {
            // Convert any layer-specific Decimal values (besides points, total, and best) from String to Decimal (used when loading save)
        },
        color:() => "#4BDC13",

        branches() {
            branchlist = ["g1","g2","g3","g4","g5","g6","g7","g8"]
            return branchlist
        },

        requires: new Decimal(0), // Can be a function that takes requirement increases into account
        resource: "power", // Name of prestige currency
        baseResource: "oxygen", // Name of resource prestige is based on
        baseAmount() {return player.points}, // Get the current amount of baseResource
        type: "none", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
        exponent: 0.5, // Prestige currency exponent
        base:() => 5, // Only needed for static layers, base of the formula (b^(x^exp))
        resCeil: false, // True if the cost needs to be rounded up (use when baseResource is static?)
        canBuyMax() {}, // Only needed for static layers with buy max
        gainMult() { // Calculate the multiplier for main currency from bonuses
            mult = new Decimal(0)
            return mult
        },
        gainExp() { // Calculate the exponent on main currency from bonuses
            return new Decimal(1)
        },
        row: 0, // Row the layer is in on the tree (0 is the first row)
        effect() {
            return {} // Formulas for any boosts inherent to resources in the layer. Can return a single value instead of an object if there is just one effect
        },

        tabFormat: [
            ['display-text', function() {
                return "sample text"
            }]
        ],

        milestones: {},
        upgrades: {},
buyables: {},

        doReset(resettingLayer){},
        layerShown() {return true}, // Condition for when layer appears on the tree

        powerBase() {
          return 10 //to flesh out, obviously  
        },
        update(diff) {

            temp_power = player[this.layer].points

            //C1
            temp_power = layers["g1"].powerCycle[temp_power,layers[this.layer].powerBase(),diff]
            //C2
            temp_power = layers["g2"].powerCycle[temp_power,layers[this.layer].powerBase(),diff]
            //C3
            temp_power = layers["g3"].powerCycle[temp_power,layers[this.layer].powerBase(),diff]
            //C4
            temp_power = layers["g4"].powerCycle[temp_power,layers[this.layer].powerBase(),diff]
            //C5
            temp_power = layers["g5"].powerCycle[temp_power,layers[this.layer].powerBase(),diff]
            //C6
            temp_power = layers["g6"].powerCycle[temp_power,layers[this.layer].powerBase(),diff]
            //C7
            temp_power = layers["g7"].powerCycle[temp_power,layers[this.layer].powerBase(),diff]
            //C8
            temp_power = layers["g8"].powerCycle[temp_power,layers[this.layer].powerBase(),diff]
            
            player[this.layer].points = temp_power

        }, // Do any gameloop things (e.g. resource generation) inherent to this layer
        automate() {}, // Do any automation inherent to this layer if appropriate
        updateTemp() {
        }, // Do any necessary temp updating, not that important usually
        resetsNothing() {return false},
        onPrestige(gain) {

            return
        }, // Useful for if you gain secondary resources or have other interesting things happen to this layer when you reset it. You gain the currency after this function ends.

        hotkeys: [
            {key: "p", description: "C: reset for lollipops or whatever", onPress(){if (player[this.layer].unlocked) doReset(this.layer)}},
        ],
        incr_order: [], // Array of layer names to have their order increased when this one is first unlocked

        tooltip() { // Optional, tooltip displays when the layer is unlocked
            let tooltip = formatWhole(player[this.layer].points) + " " + this.resource
            return tooltip
        },
        shouldNotify() { // Optional, layer will be highlighted on the tree if true.
                         // Layer will automatically highlight if an upgrade is purchasable.
        }
})
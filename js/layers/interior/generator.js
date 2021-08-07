//
// ######    ##
// ##  ##  ####
// ##        ##
// ##        ##
// ##  ##    ##
// ##  ##    ##
// ######  ######
//
addLayer("g1", {
        layer: "g1", // This is assigned automatically, both to the layer and all upgrades, etc. Shown here so you know about it
        name: "Generator 01", // This is optional, only used in a few places, If absent it just uses the layer id.
        startData() { return {
            unlocked: false,
            points: new Decimal(0),
            best: new Decimal(0),
            total: new Decimal(0),
            buyables: {}, // You don't actually have to initialize this one
        }},
        convertToDecimal() {
            // Convert any layer-specific Decimal values (besides points, total, and best) from String to Decimal (used when loading save)
        },
        color:() => "#4BDC13",
        branches: ["g8"],
        requires:() => new Decimal(5), // Can be a function that takes requirement increases into account
        resource: "C1 resources", // Name of prestige currency
        baseResource: "open doors", // Name of resource prestige is based on
        baseAmount() {return player.m.openDoors}, // Get the current amount of baseResource
        type: "none", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
        exponent: 0.5, // Prestige currency exponent
        base:() => 5, // Only needed for static layers, base of the formula (b^(x^exp))
        resCeil: false, // True if the cost needs to be rounded up (use when baseResource is static?)
        canBuyMax() {}, // Only needed for static layers with buy max
        gainMult() { // Calculate the multiplier for main currency from bonuses
            mult = new Decimal(1)
            return mult
        },
        gainExp() { // Calculate the exponent on main currency from bonuses
            return new Decimal(1)
        },
        row: 1, // Row the layer is in on the tree (0 is the first row)
        effect() {
            return {} // Formulas for any boosts inherent to resources in the layer. Can return a single value instead of an object if there is just one effect
        },
        upgrades: {
            rows: 1,
            cols: 1,
            11: {
                title:() => "Point Generation",
                description:() => "Gain points every second.",
                cost:() => new Decimal(1),
                unlocked() { return player[this.layer].unlocked }, // The upgrade is only visible when this is true
                effect() {
                    let ret = 1
                    if(player[this.layer].upgrades.includes(13)) ret = player[this.layer].acceleration
                    return ret;
                }
            }
       },
       buyables: {},
        doReset(resettingLayer){ // Triggers when this layer is being reset, along with the layer doing the resetting. Not triggered by lower layers resetting, but is by layers on the same row.
            fullLayerReset(this.layer)
        },
        layerShown() {return true}, // Condition for when layer appears on the tree

        powerCycle(power, base, diff) {
            if(false) { //Condition to be determined later, might become a switch
                return power
            } else {    //Default behaviour
                return power.add(base.div(diff))
            }
        },

        update(diff) {}, // Do any gameloop things (e.g. resource generation) inherent to this layer
        automate() {
        }, // Do any automation inherent to this layer if appropriate
        updateTemp() {
        }, // Do any necessary temp updating, not that important usually
        resetsNothing() {return false},
        onPrestige(gain) {

            return
        }, // Useful for if you gain secondary resources or have other interesting things happen to this layer when you reset it. You gain the currency after this function ends.

        incr_order: [], // Array of layer names to have their order increased when this one is first unlocked

        tooltip() { // Optional, tooltip displays when the layer is unlocked
            let tooltip = formatWhole(player[this.layer].points) + " " + this.resource
            return tooltip
        },
        shouldNotify() { // Optional, layer will be highlighted on the tree if true.
                         // Layer will automatically highlight if an upgrade is purchasable.
            
        }
})

//
// ######  ######
// ##  ##  ##  ##
// ##          ##
// ##      ######
// ##  ##  ##
// ##  ##  ##  
// ######  ######
//
addLayer("g2", {
        layer: "g2", // This is assigned automatically, both to the layer and all upgrades, etc. Shown here so you know about it
        name: "Generator 02", // This is optional, only used in a few places, If absent it just uses the layer id.
        startData() { return {
            unlocked: false,
            points: new Decimal(0),
            best: new Decimal(0),
            total: new Decimal(0),
            buyables: {}, // You don't actually have to initialize this one
        }},
        convertToDecimal() {
            // Convert any layer-specific Decimal values (besides points, total, and best) from String to Decimal (used when loading save)
        },
        color:() => "#4BDC13",
        branches: ["g1"],
        requires:() => new Decimal(100), // Can be a function that takes requirement increases into account
        resource: "torches", // Name of prestige currency
        baseResource: "points", // Name of resource prestige is based on
        baseAmount() {return player.points}, // Get the current amount of baseResource
        type: "none", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
        exponent: 0.5, // Prestige currency exponent
        base:() => 5, // Only needed for static layers, base of the formula (b^(x^exp))
        resCeil: false, // True if the cost needs to be rounded up (use when baseResource is static?)
        canBuyMax() {}, // Only needed for static layers with buy max
        gainMult() { // Calculate the multiplier for main currency from bonuses
            mult = new Decimal(1)
            return mult
        },
        gainExp() { // Calculate the exponent on main currency from bonuses
            return new Decimal(1)
        },
        row: 1, // Row the layer is in on the tree (0 is the first row)
        effect() {
            return {} // Formulas for any boosts inherent to resources in the layer. Can return a single value instead of an object if there is just one effect
        },
        upgrades: {
            rows: 1,
            cols: 1,
            11: {
                title:() => "Point Generation",
                desc:() => "Gain points every second.",
                cost:() => new Decimal(1),
                unlocked() { return player[this.layer].unlocked }, // The upgrade is only visible when this is true
                effect() {
                    let ret = 1
                    if(player[this.layer].upgrades.includes(13)) ret = player[this.layer].acceleration
                    return ret;
                }
            }
       },
       buyables: {},
        doReset(resettingLayer){ // Triggers when this layer is being reset, along with the layer doing the resetting. Not triggered by lower layers resetting, but is by layers on the same row.
            if(layers[resettingLayer].row > this.row) fullLayerReset(this.layer) // This is actually the default behavior
        },
        layerShown() {return true}, // Condition for when layer appears on the tree
        update(diff) {}, // Do any gameloop things (e.g. resource generation) inherent to this layer

        powerCycle(power, base, diff) {
            if(false) { //Condition to be determined later, might become a switch
                return power
            } else {    //Default behaviour
                return power.add(base.div(diff))
            }
        },

        automate() {
        }, // Do any automation inherent to this layer if appropriate
        updateTemp() {
        }, // Do any necessary temp updating, not that important usually
        resetsNothing() {return false},
        onPrestige(gain) {

            return
        }, // Useful for if you gain secondary resources or have other interesting things happen to this layer when you reset it. You gain the currency after this function ends.

        incr_order: [], // Array of layer names to have their order increased when this one is first unlocked

        tooltip() { // Optional, tooltip displays when the layer is unlocked
            let tooltip = formatWhole(player[this.layer].points) + " " + this.resource
            return tooltip
        },
        shouldNotify() { // Optional, layer will be highlighted on the tree if true.
                         // Layer will automatically highlight if an upgrade is purchasable.
            
        }
})

//
// ######  ######
// ##  ##  ##  ##
// ##          ##
// ##      ######
// ##  ##      ##
// ##  ##  ##  ##
// ######  ######
//
addLayer("g3", {
        layer: "g3", // This is assigned automatically, both to the layer and all upgrades, etc. Shown here so you know about it
        name: "Generator 03", // This is optional, only used in a few places, If absent it just uses the layer id.
        startData() { return {
            unlocked: false,
            points: new Decimal(0),
            best: new Decimal(0),
            total: new Decimal(0),
            buyables: {}, // You don't actually have to initialize this one
        }},
        convertToDecimal() {
            // Convert any layer-specific Decimal values (besides points, total, and best) from String to Decimal (used when loading save)
        },
        color:() => "#4BDC13",
        branches: ["g2"],
        requires:() => new Decimal(100), // Can be a function that takes requirement increases into account
        resource: "torches", // Name of prestige currency
        baseResource: "points", // Name of resource prestige is based on
        baseAmount() {return player.points}, // Get the current amount of baseResource
        type: "none", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
        exponent: 0.5, // Prestige currency exponent
        base:() => 5, // Only needed for static layers, base of the formula (b^(x^exp))
        resCeil: false, // True if the cost needs to be rounded up (use when baseResource is static?)
        canBuyMax() {}, // Only needed for static layers with buy max
        gainMult() { // Calculate the multiplier for main currency from bonuses
            mult = new Decimal(1)
            return mult
        },
        gainExp() { // Calculate the exponent on main currency from bonuses
            return new Decimal(1)
        },
        row: 1, // Row the layer is in on the tree (0 is the first row)
        effect() {
            return {} // Formulas for any boosts inherent to resources in the layer. Can return a single value instead of an object if there is just one effect
        },
        upgrades: {
            rows: 1,
            cols: 1,
            11: {
                title:() => "Point Generation",
                desc:() => "Gain points every second.",
                cost:() => new Decimal(1),
                unlocked() { return player[this.layer].unlocked }, // The upgrade is only visible when this is true
                effect() {
                    let ret = 1
                    if(player[this.layer].upgrades.includes(13)) ret = player[this.layer].acceleration
                    return ret;
                }
            }
       },
       buyables: {},
        doReset(resettingLayer){ // Triggers when this layer is being reset, along with the layer doing the resetting. Not triggered by lower layers resetting, but is by layers on the same row.
            if(layers[resettingLayer].row > this.row) fullLayerReset(this.layer) // This is actually the default behavior
        },
        layerShown() {return true}, // Condition for when layer appears on the tree
        update(diff) {}, // Do any gameloop things (e.g. resource generation) inherent to this layer

        powerCycle(power, base, diff) {
            if(false) { //Condition to be determined later, might become a switch
                return power
            } else {    //Default behaviour
                return power.add(base.div(diff))
            }
        },

        automate() {
        }, // Do any automation inherent to this layer if appropriate
        updateTemp() {
        }, // Do any necessary temp updating, not that important usually
        resetsNothing() {return false},
        onPrestige(gain) {

            return
        }, // Useful for if you gain secondary resources or have other interesting things happen to this layer when you reset it. You gain the currency after this function ends.

        incr_order: [], // Array of layer names to have their order increased when this one is first unlocked

        tooltip() { // Optional, tooltip displays when the layer is unlocked
            let tooltip = formatWhole(player[this.layer].points) + " " + this.resource
            return tooltip
        },
        shouldNotify() { // Optional, layer will be highlighted on the tree if true.
                         // Layer will automatically highlight if an upgrade is purchasable.
            
        }
})

//
// ######  ##  ##
// ##  ##  ##  ##
// ##      ##  ##
// ##      ######
// ##  ##      ##
// ##  ##      ##
// ######      ##
//
addLayer("g4", {
        layer: "g4", // This is assigned automatically, both to the layer and all upgrades, etc. Shown here so you know about it
        name: "Generator 04", // This is optional, only used in a few places, If absent it just uses the layer id.
        startData() { return {
            unlocked: false,
            points: new Decimal(0),
            best: new Decimal(0),
            total: new Decimal(0),
            buyables: {}, // You don't actually have to initialize this one
        }},
        convertToDecimal() {
            // Convert any layer-specific Decimal values (besides points, total, and best) from String to Decimal (used when loading save)
        },
        color:() => "#4BDC13",
        branches: ["g3"],
        requires:() => new Decimal(100), // Can be a function that takes requirement increases into account
        resource: "torches", // Name of prestige currency
        baseResource: "points", // Name of resource prestige is based on
        baseAmount() {return player.points}, // Get the current amount of baseResource
        type: "none", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
        exponent: 0.5, // Prestige currency exponent
        base:() => 5, // Only needed for static layers, base of the formula (b^(x^exp))
        resCeil: false, // True if the cost needs to be rounded up (use when baseResource is static?)
        canBuyMax() {}, // Only needed for static layers with buy max
        gainMult() { // Calculate the multiplier for main currency from bonuses
            mult = new Decimal(1)
            return mult
        },
        gainExp() { // Calculate the exponent on main currency from bonuses
            return new Decimal(1)
        },
        row: 1, // Row the layer is in on the tree (0 is the first row)
        effect() {
            return {} // Formulas for any boosts inherent to resources in the layer. Can return a single value instead of an object if there is just one effect
        },
        upgrades: {
            rows: 1,
            cols: 1,
            11: {
                title:() => "Point Generation",
                desc:() => "Gain points every second.",
                cost:() => new Decimal(1),
                unlocked() { return player[this.layer].unlocked }, // The upgrade is only visible when this is true
                effect() {
                    let ret = 1
                    if(player[this.layer].upgrades.includes(13)) ret = player[this.layer].acceleration
                    return ret;
                }
            }
       },
       buyables: {},
        doReset(resettingLayer){ // Triggers when this layer is being reset, along with the layer doing the resetting. Not triggered by lower layers resetting, but is by layers on the same row.
            if(layers[resettingLayer].row > this.row) fullLayerReset(this.layer) // This is actually the default behavior
        },
        layerShown() {return true}, // Condition for when layer appears on the tree
        update(diff) {}, // Do any gameloop things (e.g. resource generation) inherent to this layer

        powerCycle(power, base, diff) {
            if(false) { //Condition to be determined later, might become a switch
                return power
            } else {    //Default behaviour
                return power.add(base.div(diff))
            }
        },

        automate() {
        }, // Do any automation inherent to this layer if appropriate
        updateTemp() {
        }, // Do any necessary temp updating, not that important usually
        resetsNothing() {return false},
        onPrestige(gain) {

            return
        }, // Useful for if you gain secondary resources or have other interesting things happen to this layer when you reset it. You gain the currency after this function ends.

        incr_order: [], // Array of layer names to have their order increased when this one is first unlocked

        tooltip() { // Optional, tooltip displays when the layer is unlocked
            let tooltip = formatWhole(player[this.layer].points) + " " + this.resource
            return tooltip
        },
        shouldNotify() { // Optional, layer will be highlighted on the tree if true.
                         // Layer will automatically highlight if an upgrade is purchasable.
            
        }
})
//
// ######  ######
// ##  ##  ##  
// ##      ##
// ##      ######
// ##  ##      ##
// ##  ##  ##  ##
// ######  ######
//
addLayer("g5", {
        layer: "g5", // This is assigned automatically, both to the layer and all upgrades, etc. Shown here so you know about it
        name: "Generator 05", // This is optional, only used in a few places, If absent it just uses the layer id.
        startData() { return {
            unlocked: false,
            points: new Decimal(0),
            best: new Decimal(0),
            total: new Decimal(0),
            buyables: {}, // You don't actually have to initialize this one
        }},
        convertToDecimal() {
            // Convert any layer-specific Decimal values (besides points, total, and best) from String to Decimal (used when loading save)
        },
        color:() => "#4BDC13",
        branches: ["g4"],
        requires:() => new Decimal(100), // Can be a function that takes requirement increases into account
        resource: "torches", // Name of prestige currency
        baseResource: "points", // Name of resource prestige is based on
        baseAmount() {return player.points}, // Get the current amount of baseResource
        type: "none", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
        exponent: 0.5, // Prestige currency exponent
        base:() => 5, // Only needed for static layers, base of the formula (b^(x^exp))
        resCeil: false, // True if the cost needs to be rounded up (use when baseResource is static?)
        canBuyMax() {}, // Only needed for static layers with buy max
        gainMult() { // Calculate the multiplier for main currency from bonuses
            mult = new Decimal(1)
            return mult
        },
        gainExp() { // Calculate the exponent on main currency from bonuses
            return new Decimal(1)
        },
        row: 1, // Row the layer is in on the tree (0 is the first row)
        effect() {
            return {} // Formulas for any boosts inherent to resources in the layer. Can return a single value instead of an object if there is just one effect
        },
        upgrades: {
            rows: 1,
            cols: 1,
            11: {
                title:() => "Point Generation",
                desc:() => "Gain points every second.",
                cost:() => new Decimal(1),
                unlocked() { return player[this.layer].unlocked }, // The upgrade is only visible when this is true
                effect() {
                    let ret = 1
                    if(player[this.layer].upgrades.includes(13)) ret = player[this.layer].acceleration
                    return ret;
                }
            }
       },
       buyables: {},
        doReset(resettingLayer){ // Triggers when this layer is being reset, along with the layer doing the resetting. Not triggered by lower layers resetting, but is by layers on the same row.
            if(layers[resettingLayer].row > this.row) fullLayerReset(this.layer) // This is actually the default behavior
        },
        layerShown() {return true}, // Condition for when layer appears on the tree
        update(diff) {}, // Do any gameloop things (e.g. resource generation) inherent to this layer

        powerCycle(power, base, diff) {
            if(false) { //Condition to be determined later, might become a switch
                return power
            } else {    //Default behaviour
                return power.add(base.div(diff))
            }
        },

        automate() {
        }, // Do any automation inherent to this layer if appropriate
        updateTemp() {
        }, // Do any necessary temp updating, not that important usually
        resetsNothing() {return false},
        onPrestige(gain) {

            return
        }, // Useful for if you gain secondary resources or have other interesting things happen to this layer when you reset it. You gain the currency after this function ends.

        incr_order: [], // Array of layer names to have their order increased when this one is first unlocked

        tooltip() { // Optional, tooltip displays when the layer is unlocked
            let tooltip = formatWhole(player[this.layer].points) + " " + this.resource
            return tooltip
        },
        shouldNotify() { // Optional, layer will be highlighted on the tree if true.
                         // Layer will automatically highlight if an upgrade is purchasable.
            
        }
})

//
// ######  ######
// ##  ##  ##  ##
// ##      ##
// ##      ######
// ##  ##  ##  ##
// ##  ##  ##  ##
// ######  ######
//
addLayer("g6", {
        layer: "g6", // This is assigned automatically, both to the layer and all upgrades, etc. Shown here so you know about it
        name: "Generator 06", // This is optional, only used in a few places, If absent it just uses the layer id.
        startData() { return {
            unlocked: false,
            points: new Decimal(0),
            best: new Decimal(0),
            total: new Decimal(0),
            buyables: {}, // You don't actually have to initialize this one
        }},
        convertToDecimal() {
            // Convert any layer-specific Decimal values (besides points, total, and best) from String to Decimal (used when loading save)
        },
        color:() => "#4BDC13",
        branches: ["g5"],
        requires:() => new Decimal(100), // Can be a function that takes requirement increases into account
        resource: "torches", // Name of prestige currency
        baseResource: "points", // Name of resource prestige is based on
        baseAmount() {return player.points}, // Get the current amount of baseResource
        type: "none", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
        exponent: 0.5, // Prestige currency exponent
        base:() => 5, // Only needed for static layers, base of the formula (b^(x^exp))
        resCeil: false, // True if the cost needs to be rounded up (use when baseResource is static?)
        canBuyMax() {}, // Only needed for static layers with buy max
        gainMult() { // Calculate the multiplier for main currency from bonuses
            mult = new Decimal(1)
            return mult
        },
        gainExp() { // Calculate the exponent on main currency from bonuses
            return new Decimal(1)
        },
        row: 1, // Row the layer is in on the tree (0 is the first row)
        effect() {
            return {} // Formulas for any boosts inherent to resources in the layer. Can return a single value instead of an object if there is just one effect
        },
        upgrades: {
            rows: 1,
            cols: 1,
            11: {
                title:() => "Point Generation",
                desc:() => "Gain points every second.",
                cost:() => new Decimal(1),
                unlocked() { return player[this.layer].unlocked }, // The upgrade is only visible when this is true
                effect() {
                    let ret = 1
                    if(player[this.layer].upgrades.includes(13)) ret = player[this.layer].acceleration
                    return ret;
                }
            }
       },
       buyables: {},
        doReset(resettingLayer){ // Triggers when this layer is being reset, along with the layer doing the resetting. Not triggered by lower layers resetting, but is by layers on the same row.
//            if(layers[resettingLayer].row > this.row) fullLayerReset(this.layer) // This is actually the default behavior
            fullLayerReset(this.layer)
        },
        layerShown() {return true}, // Condition for when layer appears on the tree
        update(diff) {}, // Do any gameloop things (e.g. resource generation) inherent to this layer

        powerCycle(power, base, diff) {
            if(false) { //Condition to be determined later, might become a switch
                return power
            } else {    //Default behaviour
                return power.add(base.div(diff))
            }
        },

        automate() {
        }, // Do any automation inherent to this layer if appropriate
        updateTemp() {
        }, // Do any necessary temp updating, not that important usually
        resetsNothing() {return false},
        onPrestige(gain) {

            return
        }, // Useful for if you gain secondary resources or have other interesting things happen to this layer when you reset it. You gain the currency after this function ends.

        incr_order: [], // Array of layer names to have their order increased when this one is first unlocked

        tooltip() { // Optional, tooltip displays when the layer is unlocked
            let tooltip = formatWhole(player[this.layer].points) + " " + this.resource
            return tooltip
        },
        shouldNotify() { // Optional, layer will be highlighted on the tree if true.
                         // Layer will automatically highlight if an upgrade is purchasable.
            
        }
})

//
// ######  ######
// ##  ##  ##  ##
// ##      ##  ##
// ##          ##
// ##  ##      ##
// ##  ##      ##
// ######      ##
//
addLayer("g7", {
        layer: "g7", // This is assigned automatically, both to the layer and all upgrades, etc. Shown here so you know about it
        name: "Generator 07", // This is optional, only used in a few places, If absent it just uses the layer id.
        startData() { return {
            unlocked: false,
            points: new Decimal(0),
            best: new Decimal(0),
            total: new Decimal(0),
            buyables: {}, // You don't actually have to initialize this one
        }},
        convertToDecimal() {
            // Convert any layer-specific Decimal values (besides points, total, and best) from String to Decimal (used when loading save)
        },
        color:() => "#4BDC13",
        branches: ["g6"],
        requires:() => new Decimal(100), // Can be a function that takes requirement increases into account
        resource: "torches", // Name of prestige currency
        baseResource: "points", // Name of resource prestige is based on
        baseAmount() {return player.points}, // Get the current amount of baseResource
        type: "none", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
        exponent: 0.5, // Prestige currency exponent
        base:() => 5, // Only needed for static layers, base of the formula (b^(x^exp))
        resCeil: false, // True if the cost needs to be rounded up (use when baseResource is static?)
        canBuyMax() {}, // Only needed for static layers with buy max
        gainMult() { // Calculate the multiplier for main currency from bonuses
            mult = new Decimal(1)
            return mult
        },
        gainExp() { // Calculate the exponent on main currency from bonuses
            return new Decimal(1)
        },
        row: 1, // Row the layer is in on the tree (0 is the first row)
        effect() {
            return {} // Formulas for any boosts inherent to resources in the layer. Can return a single value instead of an object if there is just one effect
        },
        upgrades: {
            rows: 1,
            cols: 1,
            11: {
                title:() => "Point Generation",
                desc:() => "Gain points every second.",
                cost:() => new Decimal(1),
                unlocked() { return player[this.layer].unlocked }, // The upgrade is only visible when this is true
                effect() {
                    let ret = 1
                    if(player[this.layer].upgrades.includes(13)) ret = player[this.layer].acceleration
                    return ret;
                }
            }
       },
       buyables: {},
        doReset(resettingLayer){ // Triggers when this layer is being reset, along with the layer doing the resetting. Not triggered by lower layers resetting, but is by layers on the same row.
            if(layers[resettingLayer].row > this.row) fullLayerReset(this.layer) // This is actually the default behavior
        },
        layerShown() {return true}, // Condition for when layer appears on the tree
        update(diff) {}, // Do any gameloop things (e.g. resource generation) inherent to this layer

        powerCycle(power, base, diff) {
            if(false) { //Condition to be determined later, might become a switch
                return power
            } else {    //Default behaviour
                return power.add(base.div(diff))
            }
        },

        automate() {
        }, // Do any automation inherent to this layer if appropriate
        updateTemp() {
        }, // Do any necessary temp updating, not that important usually
        resetsNothing() {return false},
        onPrestige(gain) {

            return
        }, // Useful for if you gain secondary resources or have other interesting things happen to this layer when you reset it. You gain the currency after this function ends.

        incr_order: [], // Array of layer names to have their order increased when this one is first unlocked

        tooltip() { // Optional, tooltip displays when the layer is unlocked
            let tooltip = formatWhole(player[this.layer].points) + " " + this.resource
            return tooltip
        },
        shouldNotify() { // Optional, layer will be highlighted on the tree if true.
                         // Layer will automatically highlight if an upgrade is purchasable.
            
        }
})

//
// ######  ######
// ##  ##  ##  ##
// ##      ##  ##
// ##      ######
// ##  ##  ##  ##
// ##  ##  ##  ##
// ######  ######
//
addLayer("g8", {
        layer: "g8", // This is assigned automatically, both to the layer and all upgrades, etc. Shown here so you know about it
        name: "Generator 08", // This is optional, only used in a few places, If absent it just uses the layer id.
        startData() { return {
            unlocked: false,
            points: new Decimal(0),
            best: new Decimal(0),
            total: new Decimal(0),
            buyables: {}, // You don't actually have to initialize this one
        }},
        convertToDecimal() {
            // Convert any layer-specific Decimal values (besides points, total, and best) from String to Decimal (used when loading save)
        },
        color:() => "#4BDC13",
        branches: ["g7"],
        requires:() => new Decimal(100), // Can be a function that takes requirement increases into account
        resource: "torches", // Name of prestige currency
        baseResource: "points", // Name of resource prestige is based on
        baseAmount() {return player.points}, // Get the current amount of baseResource
        type: "none", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
        exponent: 0.5, // Prestige currency exponent
        base:() => 5, // Only needed for static layers, base of the formula (b^(x^exp))
        resCeil: false, // True if the cost needs to be rounded up (use when baseResource is static?)
        canBuyMax() {}, // Only needed for static layers with buy max
        gainMult() { // Calculate the multiplier for main currency from bonuses
            mult = new Decimal(1)
            return mult
        },
        gainExp() { // Calculate the exponent on main currency from bonuses
            return new Decimal(1)
        },
        row: 1, // Row the layer is in on the tree (0 is the first row)
        effect() {
            return {} // Formulas for any boosts inherent to resources in the layer. Can return a single value instead of an object if there is just one effect
        },
        upgrades: {
            rows: 1,
            cols: 1,
            11: {
                title:() => "Point Generation",
                desc:() => "Gain points every second.",
                cost:() => new Decimal(1),
                unlocked() { return player[this.layer].unlocked }, // The upgrade is only visible when this is true
                effect() {
                    let ret = 1
                    if(player[this.layer].upgrades.includes(13)) ret = player[this.layer].acceleration
                    return ret;
                }
            }
       },
       buyables: {},
        doReset(resettingLayer){ // Triggers when this layer is being reset, along with the layer doing the resetting. Not triggered by lower layers resetting, but is by layers on the same row.
            if(layers[resettingLayer].row > this.row) fullLayerReset(this.layer) // This is actually the default behavior
        },
        layerShown() {return true}, // Condition for when layer appears on the tree
        update(diff) {}, // Do any gameloop things (e.g. resource generation) inherent to this layer

        powerCycle(power, base, diff) {
            if(false) { //Condition to be determined later, might become a switch
                return power
            } else {    //Default behaviour
                return power.add(base.div(diff))
            }
        },

        automate() {
        }, // Do any automation inherent to this layer if appropriate
        updateTemp() {
        }, // Do any necessary temp updating, not that important usually
        resetsNothing() {return false},
        onPrestige(gain) {

            return
        }, // Useful for if you gain secondary resources or have other interesting things happen to this layer when you reset it. You gain the currency after this function ends.

        incr_order: [], // Array of layer names to have their order increased when this one is first unlocked

        tooltip() { // Optional, tooltip displays when the layer is unlocked
            let tooltip = formatWhole(player[this.layer].points) + " " + this.resource
            return tooltip
        },
        shouldNotify() { // Optional, layer will be highlighted on the tree if true.
                         // Layer will automatically highlight if an upgrade is purchasable.
            
        }
})

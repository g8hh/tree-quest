//
// ######    ##
// ##  ##  ####
// ##        ##
// ##        ##
// ##        ##
// ##  ##    ##
// ######  ######
//
addLayer("c1", {
        layer: "c1", // This is assigned automatically, both to the layer and all upgrades, etc. Shown here so you know about it
        name: "Corridor 01", // This is optional, only used in a few places, If absent it just uses the layer id.
        startData() { return {
            unlocked: false,
            points: new Decimal(0),
            best: new Decimal(0),
            total: new Decimal(0),
            generatorType: 0,
            buyables: {}, // You don't actually have to initialize this one
        }},
        convertToDecimal() {
            // Convert any layer-specific Decimal values (besides points, total, and best) from String to Decimal (used when loading save)
        },
        color:() => "#4BDC13",
        branches: ["c8"],
        requires:() => new Decimal(5), // Can be a function that takes requirement increases into account
        resource: "power", // Name of prestige currency
        baseResource: "oxygen", // Name of resource prestige is based on
        baseAmount() {return player.m.points}, // Get the current amount of baseResource
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
       buyables: {
        rows:2,
        cols:3,
        11: {
                title:() => "Grab Fusebox Key", // Optional, displayed at the top in a larger font
                cost(x) { // cost for buying xth buyable, can be an object if there are multiple currencies
                    return 0
                },
                effect(x) { // Effects of owning x of the items, x is a decimal
                },
                display() { // Everything else displayed in the buyable button after the title
                    displaytext = "(2 seconds)\n\
                    Find the fusebox key from the scattered items in the corridor."

                    if(player[this.layer].buyables[this.id].gt(0)) displaytext = displaytext + "\n\
                    Time remaining: " + format(player[this.layer].buyables[this.id]) + " seconds."
                    return displaytext
                },
                unlocked() { return player["p"].chapter == "prologue" && player["p"].key_fusebox.eq(0) }, 
                canAfford() {
                    return !layerAnyBuyables(this.layer)
                },
                buy() { 
                        player[this.layer].buyables[this.id] = new Decimal(2)
                },
                buyMax() {}, // You'll have to handle this yourself if you want
                style() {
                    buyablePct = player[this.layer].buyables[this.id].div(2).mul(100)
                    if(buyablePct.eq(0)) buyablePct = new Decimal(100)
                    return {
                        'background': 'linear-gradient(to bottom, ' + buyableAvailableColour + ' ' + buyablePct + '%, ' + buyableProgressColour + ' ' + buyablePct + '%)'
                    }
                }
            },
        12: {
                title() {
                    return "Auxiliary Power Cable"
                }, // Optional, displayed at the top in a larger font
                cost(x) {return 0},
                effect(x) {},
                display() { // Everything else displayed in the buyable button after the title
                    displaytext = "(1 second)\n\
                    Pick up the end of the auxiliary power cable extending from the wall."

                    if(player[this.layer].buyables[this.id].gt(0)) displaytext = displaytext + "\n\
                    Time remaining: " + format(player[this.layer].buyables[this.id]) + " seconds."
                    if(player["p"].c1_holding_cable.eq(1)) return "You are holding the power cable in your hand.\n\
                        The spring-loaded winch will retract it if you drop it."
                    if(player["p"].c7_plugged_in.eq(1)) return "The cable is plugged in to the Corridor 7 outlet."
                    return displaytext
                },
                unlocked() { return player["p"].chapter == "prologue" && player["p"].key_fusebox.eq(1) && player["p"].c2_tank_retrieved.eq(0)}, 
                canAfford() {
                    return !layerAnyBuyables(this.layer) && player["p"].c1_holding_cable.eq(0) && player["p"].c7_plugged_in.eq(0);
                },
                buy() { 
                        player[this.layer].buyables[this.id] = new Decimal(1)
                },
                buyMax() {}, // You'll have to handle this yourself if you want
                style() {
                    buyablePct = player[this.layer].buyables[this.id].div(1).mul(100)
                    if(buyablePct.eq(0)) buyablePct = new Decimal(100)
                    if(player["p"].c1_holding_cable.eq(1)) return {
                        'background-color': buyableProgressColour
                    }
                    if(!this.canAfford() && player[this.layer].buyables[this.id].eq(0)) return {
                        'background-color': buyableLockedColour
                    }
                     return {
                        'background': 'linear-gradient(to bottom, ' + buyableAvailableColour + ' ' + buyablePct + '%, ' + buyableProgressColour + ' ' + buyablePct + '%)'
                    }
                }
            },
            13: {
                title() {
                    if(player["p"].c6_filter_override.eq(0)) return "Fan Controls Locked Out"
                    if(player["p"].c1_fan_disabled.eq(1)) return "Overhead Fan Disabled"
                    return "Disable Overhead Fan"
                },
                cost(x) {return 0},
                effect(x) {},
                display() { // Everything else displayed in the buyable button after the title
                    displaytext = "(4 seconds)\n\
                    Disable the overhead fan in the vent space above Corridor 1."

                    if(player[this.layer].buyables[this.id].gt(0)) displaytext = displaytext + "\n\
                    Time remaining: " + format(player[this.layer].buyables[this.id]) + " seconds."
                    if(player["p"].c6_filter_override.eq(0)) return "Controls for the fan in the vent space above.\n\
                        The controls are locked out due to high air toxicity levels."
                    if(player["p"].c1_fan_disabled.eq(1)) return "The fan in the vent space overhead has been disabled."
                    return displaytext
                },
                unlocked() { return player["p"].chapter == "prologue" && player["p"].key_fusebox.eq(1) && player["p"].c8_fuses_retrieved.eq(0)}, 
                canAfford() {
                    return !layerAnyBuyables(this.layer) && player["p"].c6_filter_override.eq(1) && player["p"].c1_fan_disabled.eq(0);
                },
                buy() { 
                        player[this.layer].buyables[this.id] = new Decimal(4)
                },
                buyMax() {}, // You'll have to handle this yourself if you want
                style() {
                    buyablePct = player[this.layer].buyables[this.id].div(4).mul(100)
                    if(buyablePct.eq(0)) buyablePct = new Decimal(100)
                    if(player["p"].c1_fan_disabled.eq(1)) return {
                        'background-color': buyableProgressColour
                    }
                    if(!this.canAfford() && player[this.layer].buyables[this.id].eq(0)) return {
                        'background-color': buyableLockedColour
                    }
                    return {
                        'background': 'linear-gradient(to bottom, ' + buyableAvailableColour + ' ' + buyablePct + '%, ' + buyableProgressColour + ' ' + buyablePct + '%)'
                    }
                }
            },
        21: {
                title:() => "Repair Circuit",
                cost(x) {
                    return 0
                },
                effect(x) {
                    return 0
                },
                display() {
                    displaytext = "(5 seconds)\n\
                    Repair the electronic and life support circuits in this corridor."

                    if(player[this.layer].buyables[this.id].gt(0)) displaytext = displaytext + "\n\
                    Time remaining: " + format(player[this.layer].buyables[this.id]) + " seconds."
                    if(player["p"].circuit_repaired[1].eq(1)) displaytext = "Corridor circuit repaired. If the corridor loses power, the circuit will break.\n\
                    Circuit components repaired: " + player["p"].total_circuits_repaired + "/8"
                    return displaytext
                },
                unlocked() { return player["p"].chapter == "prologue" && player["p"].key_fusebox.eq(1)},
                canAfford() {return !layerAnyBuyables(this.layer) && player["p"].circuit_repaired[1].eq(0)},
                buy() {player[this.layer].buyables[this.id] = new Decimal(5)},
                style() {
                    buyablePct = player[this.layer].buyables[this.id].div(5).mul(100)
                    if(buyablePct.eq(0)) buyablePct = new Decimal(100)
                    if(player["p"].circuit_repaired[1].eq(1)) return {
                        'background-color': buyableProgressColour
                    }
                    if(!this.canAfford() && player[this.layer].buyables[this.id].eq(0)) return {
                        'background-color': buyableLockedColour
                    }
                     return {
                        'background': 'linear-gradient(to bottom, ' + buyableAvailableColour + ' ' + buyablePct + '%, ' + buyableProgressColour + ' ' + buyablePct + '%)'
                    }
                }
            },
        },
        doReset(resettingLayer){ // Triggers when this layer is being reset, along with the layer doing the resetting. Not triggered by lower layers resetting, but is by layers on the same row.
            //nothing yet lol
        },
        layerShown() {return true}, // Condition for when layer appears on the tree
        update(diff) {
            if(player["p"].chapter == "prologue") {
                if(player["p"].key_fusebox.eq(1) && player.m.buyables[12].eq(0)) player[this.layer].unlocked = false
                else player[this.layer].unlocked = hasUpgrade("m",11)

                //Effect countdown for buyable 11
                if(player[this.layer].buyables[11].gt(0)) {
                    if(player.tab != "c1") player[this.layer].buyables[11] = new Decimal(0)
                    else {
                        player[this.layer].buyables[11] = player[this.layer].buyables[11].sub(diff).max(0)
                        if(player[this.layer].buyables[11].eq(0)) {
                            player["p"].key_fusebox = new Decimal(1)
                            player["p"].spent_fuses = new Decimal(1)
                            player["m"].buyables[12] = new Decimal(1)
                        }
                    }
                }


                //Effect countdown for buyable 12
                if(player[this.layer].buyables[12].gt(0)) {
                    if(player.tab != "c1") player[this.layer].buyables[12] = new Decimal(0)
                    else {
                        player[this.layer].buyables[12] = player[this.layer].buyables[12].sub(diff).max(0)
                        if(player[this.layer].buyables[12].eq(0)) {
                            player["p"].c1_holding_cable = new Decimal(1)
                        }
                    }
                }

                //Effect countdown for buyable 13
                if(player[this.layer].buyables[13].gt(0)) {
                    if(player.tab != "c1") player[this.layer].buyables[13] = new Decimal(0)
                    else {
                        player[this.layer].buyables[13] = player[this.layer].buyables[13].sub(diff).max(0)
                        if(player[this.layer].buyables[13].eq(0)) {
                            player["p"].c1_fan_disabled = new Decimal(1)
                        }
                    }
                }

                //Effect countdown for buyable 21
                if(player[this.layer].buyables[21].gt(0)) {
                    if(player.tab != "c1") player[this.layer].buyables[21] = new Decimal(0)
                    else {
                        player[this.layer].buyables[21] = player[this.layer].buyables[21].sub(diff).max(0)
                        if(player[this.layer].buyables[21].eq(0)) {
                            layers["p"].setCircuit(1,1)
                        }
                    }
                }
            } else {    //Chapter 1 onwards, generation loop
                player[this.layer].unlocked = true
            }

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
            {key: "p", desc: "C: reset for lollipops or whatever", onPress(){if (player[this.layer].unlocked) doReset(this.layer)}},
            {key: "ctrl+c" + this.layer, desc: "Ctrl+c: respec things", onPress(){if (player[this.layer].unlocked) respecBuyables(this.layer)}},
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

//
// ######  ######
// ##  ##  ##  ##
// ##          ##
// ##      ######
// ##      ##
// ##  ##  ##  
// ######  ######
//
addLayer("c2", {
        layer: "c2", // This is assigned automatically, both to the layer and all upgrades, etc. Shown here so you know about it
        name: "Corridor 02", // This is optional, only used in a few places, If absent it just uses the layer id.
        startData() { return {
            unlocked: false,
            points: new Decimal(0),
            best: new Decimal(0),
            total: new Decimal(0),
            generatorType: 0,
            buyables: {}, // You don't actually have to initialize this one
        }},
        convertToDecimal() {
            // Convert any layer-specific Decimal values (besides points, total, and best) from String to Decimal (used when loading save)
        },
        color:() => "#4BDC13",
        branches: ["c1"],
        requires:() => new Decimal(100), // Can be a function that takes requirement increases into account
        resource: "power", // Name of prestige currency
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
       buyables: {
        rows:2,
        cols:2,
        11: {
                title() {
                    if(player["p"].c6_diagnostic_run.eq(0)) return "Clogged Garbage Disposal"
                    return "Remove Oxygen Tank"
                },
                cost(x) { // cost for buying xth buyable, can be an object if there are multiple currencies
                    return 0
                },
                effect(x) { // Effects of owning x of the items, x is a decimal
                },
                display() { // Everything else displayed in the buyable button after the title
                    displaytext = "(2 seconds)\n\
                    Pull the oxygen tank out of the garbage disposal."

                    if(player[this.layer].buyables[this.id].gt(0)) displaytext = displaytext + "\n\
                    Time remaining: " + format(player[this.layer].buyables[this.id]) + " seconds."
                    if(player["p"].c6_diagnostic_run.eq(0)) return "The garbage disposal is jammed, by what appears to be a metal tank."
                    return displaytext
                },
                unlocked() { return player["p"].chapter == "prologue" && player["p"].c2_tank_retrieved.eq(0) },
                canAfford() {
                    return !layerAnyBuyables(this.layer) && player["p"].c6_diagnostic_run.eq(1);
                },
                buy() { 
                        player[this.layer].buyables[this.id] = new Decimal(2)
                },
                buyMax() {}, // You'll have to handle this yourself if you want
                style() {
                    buyablePct = player[this.layer].buyables[this.id].div(2).mul(100)
                    if(buyablePct.eq(0)) buyablePct = new Decimal(100)
                    if(!this.canAfford() && player[this.layer].buyables[this.id].eq(0)) return {
                        'background-color': buyableLockedColour
                    }
                     return {
                        'background': 'linear-gradient(to bottom, ' + buyableAvailableColour + ' ' + buyablePct + '%, ' + buyableProgressColour + ' ' + buyablePct + '%)'
                    }
                }
            },
        12: {
                title() {
                    if(player["p"].c2_wires_fed.eq(1) || player["p"].c4_loose_wires.eq(0)) return "Damaged Overhead Vent"
                    return "Feed Wires into Vent"
                },
                cost(x) {return 0},
                effect(x) {},
                display() { // Everything else displayed in the buyable button after the title
                    displaytext = "(6 seconds)\n\
                    Carefully feed the live wires along the overhead vent, to avoid touching the sides."

                    if(player["m"].buyables[33].eq(0)) displaytext = "(4 seconds)\n\
                    Feed the unpowered wires along the overhead vent."

                    if(player["p"].c2_unpowered_collision.eq(1)) displaytext = "(6 seconds)\n\
                    The wire has jammed the overhead fan above Corridor 1. It'll take a little longer to feed it through."


                    if(player[this.layer].buyables[this.id].gt(0)) displaytext = displaytext + "\n\
                    Time remaining: " + format(player[this.layer].buyables[this.id]) + " seconds."
                    if(player["p"].c2_wires_fed.eq(1)) return "The wires have been fed along the vent and are touching the emergency sensor."
                    if(player["p"].c2_failed_completion.eq(1)) return "The wires collided with the Corridor 1 fan and touched the side.\n\
                    The resulting shock caused you to recoil and lose your breath."
                    if(player["p"].c4_loose_wires.eq(0)) return "The overhead vent is damaged here.\n\
                    It runs across the north wall, towards Corridor 8."
                    return displaytext
                },
                unlocked() { return player["p"].chapter == "prologue" && player["p"].c8_fuses_retrieved.eq(0) },
                canAfford() {
                    return !layerAnyBuyables(this.layer) && player["p"].c4_loose_wires.eq(1) && player["p"].c2_wires_fed.eq(0);
                },
                buy() { 
                        player["p"].c2_failed_completion = new Decimal(0) //Unflag failure if reattempted
                        if(player["m"].buyables[33].eq(0)) player[this.layer].buyables[this.id] = new Decimal(4) //Shorter time limit if wires off since less care needed
                        else player[this.layer].buyables[this.id] = new Decimal(6) //Longer duration for if the wires are live
                },
                buyMax() {}, // You'll have to handle this yourself if you want
                style() {
                    buyablePct = player[this.layer].buyables[this.id].div(6).mul(100)
                    if(buyablePct.eq(0)) buyablePct = new Decimal(100)
                    if(player["p"].c2_wires_fed.eq(1)) return {
                        'background-color': buyableProgressColour
                    }
                    if(!this.canAfford() && player[this.layer].buyables[this.id].eq(0)) return {
                        'background-color': buyableLockedColour
                    }
                     return {
                        'background': 'linear-gradient(to bottom, ' + buyableAvailableColour + ' ' + buyablePct + '%, ' + buyableProgressColour + ' ' + buyablePct + '%)'
                    }
                }
            },
            21: {
                title:() => "Repair Circuit",
                cost(x) {
                    return 0
                },
                effect(x) {
                    return 0
                },
                display() {
                    displaytext = "(5 seconds)\n\
                    Repair the electronic and life support circuits in this corridor."

                    if(player[this.layer].buyables[this.id].gt(0)) displaytext = displaytext + "\n\
                    Time remaining: " + format(player[this.layer].buyables[this.id]) + " seconds."
                    if(player["p"].circuit_repaired[2].eq(1)) displaytext = "Corridor circuit repaired. If the corridor loses power, the circuit will break.\n\
                    Circuit components repaired: " + player["p"].total_circuits_repaired + "/8"
                    return displaytext
                },
                unlocked() { return player["p"].chapter == "prologue" && player["p"].key_fusebox.eq(1)},
                canAfford() {return !layerAnyBuyables(this.layer) && player["p"].circuit_repaired[2].eq(0)},
                buy() {player[this.layer].buyables[this.id] = new Decimal(5)},
                style() {
                    buyablePct = player[this.layer].buyables[this.id].div(5).mul(100)
                    if(buyablePct.eq(0)) buyablePct = new Decimal(100)
                    if(player["p"].circuit_repaired[2].eq(1)) return {
                        'background-color': buyableProgressColour
                    }
                    if(!this.canAfford() && player[this.layer].buyables[this.id].eq(0)) return {
                        'background-color': buyableLockedColour
                    }
                     return {
                        'background': 'linear-gradient(to bottom, ' + buyableAvailableColour + ' ' + buyablePct + '%, ' + buyableProgressColour + ' ' + buyablePct + '%)'
                    }
                }
            },
        },
        doReset(resettingLayer){ // Triggers when this layer is being reset, along with the layer doing the resetting. Not triggered by lower layers resetting, but is by layers on the same row.
            //nothing yet lol
        },
        layerShown() {return true}, // Condition for when layer appears on the tree
        update(diff) {
            if(player.m.buyables[13].eq(0)) player[this.layer].unlocked = false
            else player[this.layer].unlocked = hasUpgrade("m",11)


            //Effect countdown for buyable 11
            if(player[this.layer].buyables[11].gt(0)) {
                if(player.tab != "c2") player[this.layer].buyables[11] = new Decimal(0)
                else {
                    player[this.layer].buyables[11] = player[this.layer].buyables[11].sub(diff).max(0)
                    if(player[this.layer].buyables[11].eq(0)) {
                        player["p"].c2_tank_retrieved = new Decimal(1)
                        player["p"].tanks = player["p"].tanks.add(1)
                    }
                }
            }

            //Effect countdown for buyable 12
            if(player[this.layer].buyables[12].gt(0)) {
                if(player.tab != "c2") {
                    player[this.layer].buyables[12] = new Decimal(0)
                    player["p"].c2_unpowered_collision = new Decimal(0) //Reset collision flag if action is interrupted
                } else {
                    player[this.layer].buyables[12] = player[this.layer].buyables[12].sub(diff).max(0)
                    if(player[this.layer].buyables[12].lt(3) && player["p"].c1_fan_disabled.eq(0) && player["m"].buyables[33].eq(1)) { //C4 powered on, live wires touch fan
                        player.points = player.points.sub(3) //Reduce oxygen due to lost breath
                        player[this.layer].buyables[12] = new Decimal(0) //Cancel action
                        player["p"].c2_failed_completion = new Decimal(1) //Flag for failure text to appear
                    } else if(player[this.layer].buyables[12].lt(2) && player["p"].c1_fan_disabled.eq(0) && player["m"].buyables[33].eq(0) && player["p"].c2_unpowered_collision.eq(0)) { //C4 powered off, unpowered wires touch fan
                        player[this.layer].buyables[12] = player[this.layer].buyables[12].add(2) //Add 2 seconds for time to navigate around fan
                        player["p"].c2_unpowered_collision = new Decimal(1) //Flag for unpowered wire colliding with fan
                    } else if(player[this.layer].buyables[12].eq(0)) {
                        player["p"].c2_wires_fed = new Decimal(1)
                    }
                }
            }

            //Effect countdown for buyable 21
            if(player[this.layer].buyables[21].gt(0)) {
                if(player.tab != "c2") player[this.layer].buyables[21] = new Decimal(0)
                else {
                    player[this.layer].buyables[21] = player[this.layer].buyables[21].sub(diff).max(0)
                    if(player[this.layer].buyables[21].eq(0)) {
                        layers["p"].setCircuit(2,1)
                    }
                }
            }

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
            {key: "p", desc: "C: reset for lollipops or whatever", onPress(){if (player[this.layer].unlocked) doReset(this.layer)}},
            {key: "ctrl+c" + this.layer, desc: "Ctrl+c: respec things", onPress(){if (player[this.layer].unlocked) respecBuyables(this.layer)}},
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

//
// ######  ######
// ##  ##  ##  ##
// ##          ##
// ##      ######
// ##          ##
// ##  ##  ##  ##
// ######  ######
//
addLayer("c3", {
        layer: "c3", // This is assigned automatically, both to the layer and all upgrades, etc. Shown here so you know about it
        name: "Corridor 03", // This is optional, only used in a few places, If absent it just uses the layer id.
        startData() { return {
            unlocked: false,
            points: new Decimal(0),
            best: new Decimal(0),
            total: new Decimal(0),
            generatorType: 0,
            buyables: {}, // You don't actually have to initialize this one
        }},
        convertToDecimal() {
            // Convert any layer-specific Decimal values (besides points, total, and best) from String to Decimal (used when loading save)
        },
        color:() => "#4BDC13",
        branches: ["c2"],
        requires:() => new Decimal(100), // Can be a function that takes requirement increases into account
        resource: "power", // Name of prestige currency
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
       buyables: {
        rows:2,
        cols:2,
        11: {
                title() {
                    if(player["p"].c7_vents_open.eq(0)) return "What's in the vent?"
                    return "Retrieve Oxygen Tank"
                },
                cost(x) { // cost for buying xth buyable, can be an object if there are multiple currencies
                    return 0
                },
                effect(x) { // Effects of owning x of the items, x is a decimal
                },
                display() { // Everything else displayed in the buyable button after the title
                    displaytext = "(2 seconds)\n\
                    Reach into the open vent and grab the oxygen tank."

                    if(player[this.layer].buyables[this.id].gt(0)) displaytext = displaytext + "\n\
                    Time remaining: " + format(player[this.layer].buyables[this.id]) + " seconds."
                    if(player["p"].c7_vents_open.eq(0)) return "You can see something in the vent, but the steel cover is firmly in place..."
                    return displaytext
                },
                unlocked() { return player["p"].chapter == "prologue" && player["p"].c3_tank_retrieved.eq(0) },
                canAfford() {
                    return !layerAnyBuyables(this.layer) && player["p"].c7_vents_open.eq(1);
                },
                buy() { 
                        player[this.layer].buyables[this.id] = new Decimal(2)
                },
                buyMax() {}, // You'll have to handle this yourself if you want
                style() {
                    buyablePct = player[this.layer].buyables[this.id].div(2).mul(100)
                    if(buyablePct.eq(0)) buyablePct = new Decimal(100)
                    if(!this.canAfford() && player[this.layer].buyables[this.id].eq(0)) return {
                        'background-color': buyableLockedColour
                    }
                     return {
                        'background': 'linear-gradient(to bottom, ' + buyableAvailableColour + ' ' + buyablePct + '%, ' + buyableProgressColour + ' ' + buyablePct + '%)'
                    }
                }
            },
            12: {
                title() {
                    if(player["p"].c5_lock_scanned.eq(1) && player["p"].c3_lock_analysed.eq(0)) return "Analyse Lock"
                    return "Lock Reprogrammer Station"
                },
                cost(x) {return 0},
                effect(x) {},
                display() { // Everything else displayed in the buyable button after the title
                    displaytext = "(6 seconds)\n\
                    Analyse the lock data and create a breaker code."

                    if(player[this.layer].buyables[this.id].gt(0)) displaytext = displaytext + "\n\
                    Time remaining: " + format(player[this.layer].buyables[this.id]) + " seconds."
                    if(player["p"].c3_lock_analysed.eq(1)) return "The lock has been analysed, and can now be opened with the handheld reprogrammer."
                    if(player["p"].c8_reprogrammer_taken.eq(0)) return "A base station for reprogramming electronic locks.\n\
                    The handheld scanner and unlocker appears to be missing."
                    if(player["p"].c5_lock_scanned.eq(0)) return "A base station for reprogramming electronic locks.\n\
                    If you scan a lock, you can analyse it here."
                    return displaytext
                },
                unlocked() { return player["p"].chapter == "prologue" && player["p"].c5_fuses_retrieved.eq(0) },
                canAfford() {
                    return !layerAnyBuyables(this.layer) && player["p"].c5_lock_scanned.eq(1) && player["p"].c3_lock_analysed.eq(0);
                },
                buy() { 
                        player[this.layer].buyables[this.id] = new Decimal(6)
                },
                buyMax() {}, // You'll have to handle this yourself if you want
                style() {
                    buyablePct = player[this.layer].buyables[this.id].div(5).mul(100)
                    if(buyablePct.eq(0)) buyablePct = new Decimal(100)
                    if(player["p"].c3_lock_analysed.eq(1)) return {
                        'background-color': buyableProgressColour
                    }
                    if(!this.canAfford() && player[this.layer].buyables[this.id].eq(0)) return {
                        'background-color': buyableLockedColour
                    }
                     return {
                        'background': 'linear-gradient(to bottom, ' + buyableAvailableColour + ' ' + buyablePct + '%, ' + buyableProgressColour + ' ' + buyablePct + '%)'
                    }
                }
            },
            21: {
                title:() => "Repair Circuit",
                cost(x) {
                    return 0
                },
                effect(x) {
                    return 0
                },
                display() {
                    displaytext = "(5 seconds)\n\
                    Repair the electronic and life support circuits in this corridor."

                    if(player[this.layer].buyables[this.id].gt(0)) displaytext = displaytext + "\n\
                    Time remaining: " + format(player[this.layer].buyables[this.id]) + " seconds."
                    if(player["p"].circuit_repaired[3].eq(1)) displaytext = "Corridor circuit repaired. If the corridor loses power, the circuit will break.\n\
                    Circuit components repaired: " + player["p"].total_circuits_repaired + "/8"
                    return displaytext
                },
                unlocked() { return player["p"].chapter == "prologue" && player["p"].key_fusebox.eq(1)},
                canAfford() {return !layerAnyBuyables(this.layer) && player["p"].circuit_repaired[3].eq(0)},
                buy() {player[this.layer].buyables[this.id] = new Decimal(5)},
                style() {
                    buyablePct = player[this.layer].buyables[this.id].div(5).mul(100)
                    if(buyablePct.eq(0)) buyablePct = new Decimal(100)
                    if(player["p"].circuit_repaired[3].eq(1)) return {
                        'background-color': buyableProgressColour
                    }
                    if(!this.canAfford() && player[this.layer].buyables[this.id].eq(0)) return {
                        'background-color': buyableLockedColour
                    }
                     return {
                        'background': 'linear-gradient(to bottom, ' + buyableAvailableColour + ' ' + buyablePct + '%, ' + buyableProgressColour + ' ' + buyablePct + '%)'
                    }
                }
            },
        },
        doReset(resettingLayer){ // Triggers when this layer is being reset, along with the layer doing the resetting. Not triggered by lower layers resetting, but is by layers on the same row.
            //nothing yet lol
        },
        layerShown() {return true}, // Condition for when layer appears on the tree
        update(diff) {
            if(player.m.buyables[23].eq(0)) player[this.layer].unlocked = false
            else player[this.layer].unlocked = hasUpgrade("m",11)

            //Effect countdown for buyable 11
            if(player[this.layer].buyables[11].gt(0)) {
                if(player.tab != "c3") player[this.layer].buyables[11] = new Decimal(0)
                else {
                    player[this.layer].buyables[11] = player[this.layer].buyables[11].sub(diff).max(0)
                    if(player[this.layer].buyables[11].eq(0)) {
                        player["p"].c3_tank_retrieved = new Decimal(1)
                        player["p"].tanks = player["p"].tanks.add(1)
                    }
                }
            }

            //Effect countdown for buyable 12
            if(player[this.layer].buyables[12].gt(0)) {
                if(player.tab != "c3") player[this.layer].buyables[12] = new Decimal(0)
                else {
                    player[this.layer].buyables[12] = player[this.layer].buyables[12].sub(diff).max(0)
                    if(player[this.layer].buyables[12].eq(0)) {
                        player["p"].c3_lock_analysed = new Decimal(1)
                    }
                }
            }

            //Effect countdown for buyable 21
            if(player[this.layer].buyables[21].gt(0)) {
                if(player.tab != "c3") player[this.layer].buyables[21] = new Decimal(0)
                else {
                    player[this.layer].buyables[21] = player[this.layer].buyables[21].sub(diff).max(0)
                    if(player[this.layer].buyables[21].eq(0)) {
                        layers["p"].setCircuit(3,1)
                    }
                }
            }

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
            {key: "p", desc: "C: reset for lollipops or whatever", onPress(){if (player[this.layer].unlocked) doReset(this.layer)}},
            {key: "ctrl+c" + this.layer, desc: "Ctrl+c: respec things", onPress(){if (player[this.layer].unlocked) respecBuyables(this.layer)}},
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

//
// ######  ##  ##
// ##  ##  ##  ##
// ##      ##  ##
// ##      ######
// ##          ##
// ##  ##      ##
// ######      ##
//
addLayer("c4", {
        layer: "c4", // This is assigned automatically, both to the layer and all upgrades, etc. Shown here so you know about it
        name: "Corridor 04", // This is optional, only used in a few places, If absent it just uses the layer id.
        startData() { return {
            unlocked: false,
            points: new Decimal(0),
            best: new Decimal(0),
            total: new Decimal(0),
            generatorType: 0,
            buyables: {}, // You don't actually have to initialize this one
        }},
        convertToDecimal() {
            // Convert any layer-specific Decimal values (besides points, total, and best) from String to Decimal (used when loading save)
        },
        color:() => "#4BDC13",
        branches: ["c3"],
        requires:() => new Decimal(100), // Can be a function that takes requirement increases into account
        resource: "power", // Name of prestige currency
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
       buyables: {
        rows:2,
        cols:2,
        11: {
                title:() => "Remove Fuse from Wall",
                cost(x) {return 0},
                effect(x) {},
                display() { // Everything else displayed in the buyable button after the title
                    displaytext = "(4 seconds)\n\
                    Remove a fuse from the southern wall panel."

                    if(player[this.layer].buyables[this.id].gt(0)) displaytext = displaytext + "\n\
                    Time remaining: " + format(player[this.layer].buyables[this.id]) + " seconds."
                    if(player["p"].c4_failed_completion.eq(1)) return "The anti-tamper system has kicked in. You will need to wait or cycle power to the corridor to reset it."
                    return displaytext
                },
                unlocked() { return player["p"].chapter == "prologue" && player["p"].c4_fuse_retrieved.eq(0) }, 
                canAfford() {
                    return !layerAnyBuyables(this.layer) && player["p"].c4_failed_completion.eq(0);
                },
                buy() { 
                        player[this.layer].buyables[this.id] = new Decimal(4)
                },
                buyMax() {}, // You'll have to handle this yourself if you want
                style() {
                    buyablePct = player[this.layer].buyables[this.id].div(4).mul(100)
                    if(buyablePct.eq(0)) buyablePct = new Decimal(100)
                    if(!this.canAfford() && player[this.layer].buyables[this.id].eq(0)) return {
                        'background-color': buyableLockedColour
                    }
                     return {
                        'background': 'linear-gradient(to bottom, ' + buyableAvailableColour + ' ' + buyablePct + '%, ' + buyableProgressColour + ' ' + buyablePct + '%)'
                    }
                }
            },
            12: {
                title:() => "Grab Loose Wires",
                cost(x) {return 0},
                effect(x) {},
                display() { // Everything else displayed in the buyable button after the title
                    displaytext = "(2 seconds)\n\
                    Damage to the wall has exposed live wiring. You could (carefully) pull it out some distance."

                    if(player[this.layer].buyables[this.id].gt(0)) displaytext = displaytext + "\n\
                    Time remaining: " + format(player[this.layer].buyables[this.id]) + " seconds."
                    if(player["p"].c4_loose_wires.eq(1)) return "You are holding the live wires from the wall."
                    return displaytext
                },
                unlocked() { return player["p"].chapter == "prologue" && player["p"].c8_fuses_retrieved.eq(0) }, 
                canAfford() {
                    return !layerAnyBuyables(this.layer) && player["p"].c4_loose_wires.eq(0);
                },
                buy() { 
                        player[this.layer].buyables[this.id] = new Decimal(2)
                },
                buyMax() {}, // You'll have to handle this yourself if you want
                style() {
                    buyablePct = player[this.layer].buyables[this.id].div(2).mul(100)
                    if(buyablePct.eq(0)) buyablePct = new Decimal(100)
                    if(player["p"].c4_loose_wires.eq(1)) return {
                        'background-color': buyableProgressColour
                    }
                    if(!this.canAfford() && player[this.layer].buyables[this.id].eq(0)) return {
                        'background-color': buyableLockedColour
                    }
                     return {
                        'background': 'linear-gradient(to bottom, ' + buyableAvailableColour + ' ' + buyablePct + '%, ' + buyableProgressColour + ' ' + buyablePct + '%)'
                    }
                }
            },
            21: {
                title:() => "Repair Circuit",
                cost(x) {
                    return 0
                },
                effect(x) {
                    return 0
                },
                display() {
                    displaytext = "(5 seconds)\n\
                    Repair the electronic and life support circuits in this corridor."

                    if(player[this.layer].buyables[this.id].gt(0)) displaytext = displaytext + "\n\
                    Time remaining: " + format(player[this.layer].buyables[this.id]) + " seconds."
                    if(player["p"].circuit_repaired[4].eq(1)) displaytext = "Corridor circuit repaired. If the corridor loses power, the circuit will break.\n\
                    Circuit components repaired: " + player["p"].total_circuits_repaired + "/8"
                    return displaytext
                },
                unlocked() { return player["p"].chapter == "prologue" && player["p"].key_fusebox.eq(1)},
                canAfford() {return !layerAnyBuyables(this.layer) && player["p"].circuit_repaired[4].eq(0)},
                buy() {player[this.layer].buyables[this.id] = new Decimal(5)},
                style() {
                    buyablePct = player[this.layer].buyables[this.id].div(5).mul(100)
                    if(buyablePct.eq(0)) buyablePct = new Decimal(100)
                    if(player["p"].circuit_repaired[4].eq(1)) return {
                        'background-color': buyableProgressColour
                    }
                    if(!this.canAfford() && player[this.layer].buyables[this.id].eq(0)) return {
                        'background-color': buyableLockedColour
                    }
                     return {
                        'background': 'linear-gradient(to bottom, ' + buyableAvailableColour + ' ' + buyablePct + '%, ' + buyableProgressColour + ' ' + buyablePct + '%)'
                    }
                }
            },
        },
        doReset(resettingLayer){ // Triggers when this layer is being reset, along with the layer doing the resetting. Not triggered by lower layers resetting, but is by layers on the same row.
            //nothing yet lol
        },
        layerShown() {return true}, // Condition for when layer appears on the tree
        update(diff) {
            if(player.m.buyables[33].eq(0)) player[this.layer].unlocked = false
            else player[this.layer].unlocked = hasUpgrade("m",11)

            //Effect countdown for buyable 11
            if(player[this.layer].buyables[11].gt(0)) {
                if(player.tab != "c4") player[this.layer].buyables[11] = new Decimal(0)
                else {
                    player[this.layer].buyables[11] = player[this.layer].buyables[11].sub(diff).max(0)
                    if(player[this.layer].buyables[11].lt(1) && player["p"].c5_tamper_bypassed.eq(0)) {
                        player[this.layer].buyables[11] = new Decimal(0)
                        player["p"].c4_failed_completion = new Decimal(1)
                    } else if(player[this.layer].buyables[11].eq(0)) {
                        player["p"].fuses = player["p"].fuses.add(1)
                        player["p"].c4_fuse_retrieved = new Decimal(1)
                    }
                }
            }

            //Effect countdown for buyable 12
            if(player[this.layer].buyables[12].gt(0)) {
                if(player.tab != "c4") player[this.layer].buyables[12] = new Decimal(0)
                else {
                    player[this.layer].buyables[12] = player[this.layer].buyables[12].sub(diff).max(0)
                    if(player[this.layer].buyables[12].eq(0)) {
                        player["p"].c4_loose_wires = new Decimal(1)
                    }
                }
            }

            //Effect countdown for buyable 21
            if(player[this.layer].buyables[21].gt(0)) {
                if(player.tab != "c4") player[this.layer].buyables[21] = new Decimal(0)
                else {
                    player[this.layer].buyables[21] = player[this.layer].buyables[21].sub(diff).max(0)
                    if(player[this.layer].buyables[21].eq(0)) {
                        layers["p"].setCircuit(4,1)
                    }
                }
            }
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
            {key: "p", desc: "C: reset for lollipops or whatever", onPress(){if (player[this.layer].unlocked) doReset(this.layer)}},
            {key: "ctrl+c" + this.layer, desc: "Ctrl+c: respec things", onPress(){if (player[this.layer].unlocked) respecBuyables(this.layer)}},
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
//
// ######  ######
// ##  ##  ##  
// ##      ##
// ##      ######
// ##          ##
// ##  ##  ##  ##
// ######  ######
//
addLayer("c5", {
        layer: "c5", // This is assigned automatically, both to the layer and all upgrades, etc. Shown here so you know about it
        name: "Corridor 05", // This is optional, only used in a few places, If absent it just uses the layer id.
        startData() { return {
            unlocked: false,
            points: new Decimal(0),
            best: new Decimal(0),
            total: new Decimal(0),
            generatorType: 0,
            buyables: {}, // You don't actually have to initialize this one
        }},
        convertToDecimal() {
            // Convert any layer-specific Decimal values (besides points, total, and best) from String to Decimal (used when loading save)
        },
        color:() => "#4BDC13",
        branches: ["c4"],
        requires:() => new Decimal(100), // Can be a function that takes requirement increases into account
        resource: "power", // Name of prestige currency
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
       buyables: {
        rows:2,
        cols:2,
        11: {
                title:() => "Bypass Tamper Security",
                cost(x) {return 0},
                effect(x) {},
                display() { // Everything else displayed in the buyable button after the title
                    displaytext = "(4 seconds)\n\
                    Bypass the anti-tamper system on the southern wall panels."

                    if(player[this.layer].buyables[this.id].gt(0)) displaytext = displaytext + "\n\
                    Time remaining: " + format(player[this.layer].buyables[this.id]) + " seconds."
                    if(player["p"].c5_tamper_bypassed.eq(1)) return "The anti-tamper system has been bypassed."
                    return displaytext
                },
                unlocked() { return player["p"].chapter == "prologue" && player["p"].c4_fuse_retrieved.eq(0) }, 
                canAfford() {
                    return !layerAnyBuyables(this.layer) && player["p"].c5_tamper_bypassed.eq(0);
                },
                buy() { 
                        player[this.layer].buyables[this.id] = new Decimal(4)
                },
                buyMax() {}, // You'll have to handle this yourself if you want
                style() {
                    buyablePct = player[this.layer].buyables[this.id].div(4).mul(100)
                    if(buyablePct.eq(0)) buyablePct = new Decimal(100)
                    if(player["p"].c5_tamper_bypassed.eq(1)) return {
                        'background-color': buyableProgressColour
                    }
                    if(!this.canAfford() && player[this.layer].buyables[this.id].eq(0)) return {
                        'background-color': buyableLockedColour
                    }
                     return {
                        'background': 'linear-gradient(to bottom, ' + buyableAvailableColour + ' ' + buyablePct + '%, ' + buyableProgressColour + ' ' + buyablePct + '%)'
                    }
                }
            },
            12: {
                title() {
                    if(player["p"].c3_lock_analysed.eq(1)) return "Crack Lock"
                    if(player["p"].c8_reprogrammer_taken.eq(1) && player["p"].c5_lock_scanned.eq(0)) return "Scan Lock"
                    return "Locked Electronics Closet"
                },
                cost(x) {return 0},
                effect(x) {},
                display() { // Everything else displayed in the buyable button after the title
                    displaytext = "A closet containing spare electrical components. The lock resets whenever the power is cycled."

                    if(player["p"].c8_reprogrammer_taken.eq(1)) displaytext = "(4 seconds)\n\
                    Scan the lock with the handheld reprogrammer."

                    if(player["p"].c5_lock_scanned.eq(1)) displaytext = "A closet containing spare electrical components. The lock resets whenever the power is cycled.\n\
                    Your reprogrammer has scanned the lock and is ready for analysis."

                    if(player["p"].c3_lock_analysed.eq(1)) displaytext = "(4 seconds)\n\
                    Crack the lock open using the reprogrammer's bypass codes."

                    if(player[this.layer].buyables[this.id].gt(0)) displaytext = displaytext + "\n\
                    Time remaining: " + format(player[this.layer].buyables[this.id]) + " seconds."
                    return displaytext
                },
                unlocked() { return player["p"].chapter == "prologue" && player["p"].c5_fuses_retrieved.eq(0) }, 
                canAfford() {
                    return !layerAnyBuyables(this.layer) && (player["p"].c3_lock_analysed.eq(1) || (player["p"].c8_reprogrammer_taken.eq(1) && player["p"].c5_lock_scanned.eq(0)));
                },
                buy() { 
                        player[this.layer].buyables[this.id] = new Decimal(4)
                },
                buyMax() {}, // You'll have to handle this yourself if you want
                style() {
                    buyablePct = player[this.layer].buyables[this.id].div(4).mul(100)
                    if(buyablePct.eq(0)) buyablePct = new Decimal(100)
                    if(!this.canAfford() && player[this.layer].buyables[this.id].eq(0)) return {
                        'background-color': buyableLockedColour
                    }
                     return {
                        'background': 'linear-gradient(to bottom, ' + buyableAvailableColour + ' ' + buyablePct + '%, ' + buyableProgressColour + ' ' + buyablePct + '%)'
                    }
                }
            },
            21: {
                title:() => "Repair Circuit",
                cost(x) {
                    return 0
                },
                effect(x) {
                    return 0
                },
                display() {
                    displaytext = "(5 seconds)\n\
                    Repair the electronic and life support circuits in this corridor."

                    if(player[this.layer].buyables[this.id].gt(0)) displaytext = displaytext + "\n\
                    Time remaining: " + format(player[this.layer].buyables[this.id]) + " seconds."
                    if(player["p"].circuit_repaired[5].eq(1)) displaytext = "Corridor circuit repaired. If the corridor loses power, the circuit will break.\n\
                    Circuit components repaired: " + player["p"].total_circuits_repaired + "/8"
                    return displaytext
                },
                unlocked() { return player["p"].chapter == "prologue" && player["p"].key_fusebox.eq(1)},
                canAfford() {return !layerAnyBuyables(this.layer) && player["p"].circuit_repaired[5].eq(0)},
                buy() {player[this.layer].buyables[this.id] = new Decimal(5)},
                style() {
                    buyablePct = player[this.layer].buyables[this.id].div(5).mul(100)
                    if(buyablePct.eq(0)) buyablePct = new Decimal(100)
                    if(player["p"].circuit_repaired[5].eq(1)) return {
                        'background-color': buyableProgressColour
                    }
                    if(!this.canAfford() && player[this.layer].buyables[this.id].eq(0)) return {
                        'background-color': buyableLockedColour
                    }
                     return {
                        'background': 'linear-gradient(to bottom, ' + buyableAvailableColour + ' ' + buyablePct + '%, ' + buyableProgressColour + ' ' + buyablePct + '%)'
                    }
                }
            },
        },
        doReset(resettingLayer){ // Triggers when this layer is being reset, along with the layer doing the resetting. Not triggered by lower layers resetting, but is by layers on the same row.
            //nothing yet lol
        },
        layerShown() {return true}, // Condition for when layer appears on the tree
        update(diff) {
            if(player.m.buyables[32].eq(0)) player[this.layer].unlocked = false
            else player[this.layer].unlocked = hasUpgrade("m",11)

            //Effect countdown for buyable 11
            if(player[this.layer].buyables[11].gt(0)) {
                if(player.tab != "c5") player[this.layer].buyables[11] = new Decimal(0)
                else {
                    player[this.layer].buyables[11] = player[this.layer].buyables[11].sub(diff).max(0)
                    if(player[this.layer].buyables[11].eq(0)) {
                        player["p"].c5_tamper_bypassed = new Decimal(1)
                    }
                }
            }

            //Effect countdown for buyable 12
            if(player[this.layer].buyables[12].gt(0)) {
                if(player.tab != "c5") player[this.layer].buyables[12] = new Decimal(0)
                else {
                    player[this.layer].buyables[12] = player[this.layer].buyables[12].sub(diff).max(0)
                    if(player[this.layer].buyables[12].eq(0)) {
                        if(player["p"].c3_lock_analysed.eq(1)) { //If true this is the second run, to get the fuses
                            player["p"].c5_fuses_retrieved = new Decimal(1)
                            player["p"].fuses = player["p"].fuses.add(2)
                        } else player["p"].c5_lock_scanned = new Decimal(1) //If this is hit it's the only other possibility
                    }
                }
            }

            //Effect countdown for buyable 21
            if(player[this.layer].buyables[21].gt(0)) {
                if(player.tab != "c5") player[this.layer].buyables[21] = new Decimal(0)
                else {
                    player[this.layer].buyables[21] = player[this.layer].buyables[21].sub(diff).max(0)
                    if(player[this.layer].buyables[21].eq(0)) {
                        layers["p"].setCircuit(5,1)
                    }
                }
            }
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
            {key: "p", desc: "C: reset for lollipops or whatever", onPress(){if (player[this.layer].unlocked) doReset(this.layer)}},
            {key: "ctrl+c" + this.layer, desc: "Ctrl+c: respec things", onPress(){if (player[this.layer].unlocked) respecBuyables(this.layer)}},
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

//
// ######  ######
// ##  ##  ##  ##
// ##      ##
// ##      ######
// ##      ##  ##
// ##  ##  ##  ##
// ######  ######
//
addLayer("c6", {
        layer: "c6", // This is assigned automatically, both to the layer and all upgrades, etc. Shown here so you know about it
        name: "Corridor 06", // This is optional, only used in a few places, If absent it just uses the layer id.
        startData() { return {
            unlocked: false,
            points: new Decimal(0),
            best: new Decimal(0),
            total: new Decimal(0),
            generatorType: 0,
            buyables: {}, // You don't actually have to initialize this one
        }},
        convertToDecimal() {
            // Convert any layer-specific Decimal values (besides points, total, and best) from String to Decimal (used when loading save)
        },
        color:() => "#4BDC13",
        branches: ["c5"],
        requires:() => new Decimal(100), // Can be a function that takes requirement increases into account
        resource: "power", // Name of prestige currency
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
       buyables: {
        rows:2,
        cols:3,
        11: {
                title:() => "Retrieve Fuse", // Optional, displayed at the top in a larger font
                cost(x) { // cost for buying xth buyable, can be an object if there are multiple currencies
                    return 0
                },
                effect(x) { // Effects of owning x of the items, x is a decimal
                },
                display() { // Everything else displayed in the buyable button after the title
                    displaytext = "(5 seconds)\n\
                    Remove a fuse from a damaged wall panel."

                    if(player[this.layer].buyables[this.id].gt(0)) displaytext = displaytext + "\n\
                    Time remaining: " + format(player[this.layer].buyables[this.id]) + " seconds."
                    return displaytext
                },
                unlocked() { return player["p"].chapter == "prologue" && player["p"].c6_fuse_retrieved.eq(0) }, 
                canAfford() {
                    return !layerAnyBuyables(this.layer);
                },
                buy() { 
                        player[this.layer].buyables[this.id] = new Decimal(5)
                },
                buyMax() {}, // You'll have to handle this yourself if you want
                style() {
                    buyablePct = player[this.layer].buyables[this.id].div(5).mul(100)
                    if(buyablePct.eq(0)) buyablePct = new Decimal(100)
                    if(!this.canAfford() && player[this.layer].buyables[this.id].eq(0)) return {
                        'background-color': buyableLockedColour
                    }
                     return {
                        'background': 'linear-gradient(to bottom, ' + buyableAvailableColour + ' ' + buyablePct + '%, ' + buyableProgressColour + ' ' + buyablePct + '%)'
                    }
                }
            },
        12: {
                title() {// Optional, displayed at the top in a larger font
                    if(player["p"].c6_diagnostic_run.eq(1)) return "Blockage Found!"
                    if(player["p"].c7_plugged_in.eq(1) && player["m"].buyables[12].eq(1)) return "Run Garbage Disposal Diagnostic" //If wire plugged in and C1 has power
                    return  "Unpowered Maintenance Terminal"
                },
                cost(x) { // cost for buying xth buyable, can be an object if there are multiple currencies
                    return 0
                },
                effect(x) { // Effects of owning x of the items, x is a decimal
                },
                display() { // Everything else displayed in the buyable button after the title
                    displaytext = "(5 seconds)\n\
                    Errors have been detected in the garbage disposal system.\n\
                    You can run a diagnostic from this terminal."

                    if(player[this.layer].buyables[this.id].gt(0)) displaytext = displaytext + "\n\
                    Time remaining: " + format(player[this.layer].buyables[this.id]) + " seconds."
                    if(player["p"].c6_diagnostic_run.eq(1)) return "A blockage has been detected. The garbage disposal has been opened.\n\
                    Please remove the blockage."
                    if(player["p"].c7_plugged_in.eq(0)) return "A blank maintenance terminal, connected to an auxiliary power socket in Corridor 7."
                    if(player["m"].buyables[12].eq(0)) return "A blank maintenance terminal. The cable from Corridor 1 is connected but unpowered." //When wire connected but C1 off
                    if(player["m"].buyables[13].eq(0)) return "Garbage disposal unit, Corridor 2 - unable to query status.\n\
                    Please check there is power to the unit." //Cannot run check if corridor 2 is off
                    return displaytext
                },
                unlocked() { return player["p"].chapter == "prologue" && player["p"].c2_tank_retrieved.eq(0) }, 
                canAfford() {
                    return !layerAnyBuyables(this.layer) && player["p"].c7_plugged_in.eq(1) && player["p"].c6_diagnostic_run.eq(0) && player["m"].buyables[12].eq(1) && player["m"].buyables[13].eq(1);
                },
                buy() { 
                        player[this.layer].buyables[this.id] = new Decimal(5)
                },
                buyMax() {}, // You'll have to handle this yourself if you want
                style() {
                    buyablePct = player[this.layer].buyables[this.id].div(5).mul(100)
                    if(buyablePct.eq(0)) buyablePct = new Decimal(100)
                    if(player["p"].c6_diagnostic_run.eq(1)) return {
                        'background-color': buyableProgressColour
                    }
                    if(!this.canAfford() && player[this.layer].buyables[this.id].eq(0)) return {
                        'background-color': buyableLockedColour
                    }
                     return {
                        'background': 'linear-gradient(to bottom, ' + buyableAvailableColour + ' ' + buyablePct + '%, ' + buyableProgressColour + ' ' + buyablePct + '%)'
                    }
                }
            },
            13: {
                title() {// Optional, displayed at the top in a larger font
                    if(player["p"].c6_filter_override.eq(1)) return "Filtration System Overridden"
                    return  "Override Filtration System"
                },
                cost(x) {return 0},
                effect(x) {},
                display() { // Everything else displayed in the buyable button after the title
                    displaytext = "(5 seconds)\n\
                    Disable the automatic filtration system.\n\
                    Life support is broken anyway, so what's the harm?"

                    if(player[this.layer].buyables[this.id].gt(0)) displaytext = displaytext + "\n\
                    Time remaining: " + format(player[this.layer].buyables[this.id]) + " seconds."
                    if(player["p"].c6_filter_override.eq(1)) return "The filtration system has been overridden.\n\
                    Safety locks on fan controls are disabled."
                    return displaytext
                },
                unlocked() { return player["p"].chapter == "prologue" && player["p"].c8_fuses_retrieved.eq(0) }, 
                canAfford() {
                    return !layerAnyBuyables(this.layer) && player["p"].c6_filter_override.eq(0);
                },
                buy() { 
                        player[this.layer].buyables[this.id] = new Decimal(5)
                },
                buyMax() {}, // You'll have to handle this yourself if you want
                style() {
                    buyablePct = player[this.layer].buyables[this.id].div(5).mul(100)
                    if(buyablePct.eq(0)) buyablePct = new Decimal(100)
                    if(player["p"].c6_filter_override.eq(1)) return {
                        'background-color': buyableProgressColour
                    }
                    if(!this.canAfford() && player[this.layer].buyables[this.id].eq(0)) return {
                        'background-color': buyableLockedColour
                    }
                     return {
                        'background': 'linear-gradient(to bottom, ' + buyableAvailableColour + ' ' + buyablePct + '%, ' + buyableProgressColour + ' ' + buyablePct + '%)'
                    }
                }
            },
            21: {
                title:() => "Repair Circuit",
                cost(x) {
                    return 0
                },
                effect(x) {
                    return 0
                },
                display() {
                    displaytext = "(5 seconds)\n\
                    Repair the electronic and life support circuits in this corridor."

                    if(player[this.layer].buyables[this.id].gt(0)) displaytext = displaytext + "\n\
                    Time remaining: " + format(player[this.layer].buyables[this.id]) + " seconds."
                    if(player["p"].circuit_repaired[6].eq(1)) displaytext = "Corridor circuit repaired. If the corridor loses power, the circuit will break.\n\
                    Circuit components repaired: " + player["p"].total_circuits_repaired + "/8"
                    return displaytext
                },
                unlocked() { return player["p"].chapter == "prologue" && player["p"].key_fusebox.eq(1)},
                canAfford() {return !layerAnyBuyables(this.layer) && player["p"].circuit_repaired[6].eq(0)},
                buy() {player[this.layer].buyables[this.id] = new Decimal(5)},
                style() {
                    buyablePct = player[this.layer].buyables[this.id].div(5).mul(100)
                    if(buyablePct.eq(0)) buyablePct = new Decimal(100)
                    if(player["p"].circuit_repaired[6].eq(1)) return {
                        'background-color': buyableProgressColour
                    }
                    if(!this.canAfford() && player[this.layer].buyables[this.id].eq(0)) return {
                        'background-color': buyableLockedColour
                    }
                     return {
                        'background': 'linear-gradient(to bottom, ' + buyableAvailableColour + ' ' + buyablePct + '%, ' + buyableProgressColour + ' ' + buyablePct + '%)'
                    }
                }
            },
       },
        doReset(resettingLayer){ // Triggers when this layer is being reset, along with the layer doing the resetting. Not triggered by lower layers resetting, but is by layers on the same row.
            //nothing yet lol
        },
        layerShown() {return true}, // Condition for when layer appears on the tree
        update(diff) {
            if(player.m.buyables[31].eq(0)) player[this.layer].unlocked = false
            else player[this.layer].unlocked = hasUpgrade("m",11)

            //Effect countdown for buyable 11
            if(player[this.layer].buyables[11].gt(0)) {
                if(player.tab != "c6") player[this.layer].buyables[11] = new Decimal(0)
                else {
                    player[this.layer].buyables[11] = player[this.layer].buyables[11].sub(diff).max(0)
                    if(player[this.layer].buyables[11].eq(0)) {
                        player["p"].c6_fuse_retrieved = new Decimal(1)
                        player["p"].fuses = player["p"].fuses.add(1)
                    }
                }
            }

            //Effect countdown for buyable 12
            if(player[this.layer].buyables[12].gt(0)) {
                if(player.tab != "c6") player[this.layer].buyables[12] = new Decimal(0)
                else {
                    player[this.layer].buyables[12] = player[this.layer].buyables[12].sub(diff).max(0)
                    if(player[this.layer].buyables[12].eq(0)) {
                        player["p"].c6_diagnostic_run = new Decimal(1)
                    }
                }
            }

            //Effect countdown for buyable 13
            if(player[this.layer].buyables[13].gt(0)) {
                if(player.tab != "c6") player[this.layer].buyables[13] = new Decimal(0)
                else {
                    player[this.layer].buyables[13] = player[this.layer].buyables[13].sub(diff).max(0)
                    if(player[this.layer].buyables[13].eq(0)) {
                        player["p"].c6_filter_override = new Decimal(1)
                    }
                }
            }

            //Effect countdown for buyable 21
            if(player[this.layer].buyables[21].gt(0)) {
                if(player.tab != "c6") player[this.layer].buyables[21] = new Decimal(0)
                else {
                    player[this.layer].buyables[21] = player[this.layer].buyables[21].sub(diff).max(0)
                    if(player[this.layer].buyables[21].eq(0)) {
                        layers["p"].setCircuit(6,1)
                    }
                }
            }

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
            {key: "p", desc: "C: reset for lollipops or whatever", onPress(){if (player[this.layer].unlocked) doReset(this.layer)}},
            {key: "ctrl+c" + this.layer, desc: "Ctrl+c: respec things", onPress(){if (player[this.layer].unlocked) respecBuyables(this.layer)}},
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

//
// ######  ######
// ##  ##  ##  ##
// ##      ##  ##
// ##          ##
// ##          ##
// ##  ##      ##
// ######      ##
//
addLayer("c7", {
        layer: "c7", // This is assigned automatically, both to the layer and all upgrades, etc. Shown here so you know about it
        name: "Corridor 07", // This is optional, only used in a few places, If absent it just uses the layer id.
        startData() { return {
            unlocked: false,
            points: new Decimal(0),
            best: new Decimal(0),
            total: new Decimal(0),
            generatorType: 0,
            buyables: {}, // You don't actually have to initialize this one
        }},
        convertToDecimal() {
            // Convert any layer-specific Decimal values (besides points, total, and best) from String to Decimal (used when loading save)
        },
        color:() => "#4BDC13",
        branches: ["c6"],
        requires:() => new Decimal(100), // Can be a function that takes requirement increases into account
        resource: "power", // Name of prestige currency
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
       buyables: {
        rows:2,
        cols:2,
        11: {
                title() {
                    return "Open the side vents"
                },
                cost(x) { // cost for buying xth buyable, can be an object if there are multiple currencies
                    return 0
                },
                effect(x) { // Effects of owning x of the items, x is a decimal
                },
                display() { // Everything else displayed in the buyable button after the title
                    displaytext = "(3 seconds)\n\
                    Open the electromagnetic vents on either side of the corridor."

                    if(player[this.layer].buyables[this.id].gt(0)) displaytext = displaytext + "\n\
                    Time remaining: " + format(player[this.layer].buyables[this.id]) + " seconds."
                    if(player["p"].c7_vents_open.eq(1)) return "The vents are now open."
                    return displaytext
                },
                unlocked() { return player["p"].chapter == "prologue" && player["p"].c3_tank_retrieved.eq(0) },
                canAfford() {
                    return !layerAnyBuyables(this.layer) && player["p"].c7_vents_open.eq(0);
                },
                buy() { 
                        player[this.layer].buyables[this.id] = new Decimal(3)
                },
                buyMax() {}, // You'll have to handle this yourself if you want
                style() {
                    buyablePct = player[this.layer].buyables[this.id].div(3).mul(100)
                    if(buyablePct.eq(0)) buyablePct = new Decimal(100)
                    if(player["p"].c7_vents_open.eq(1)) return {
                        'background-color': buyableProgressColour
                    }
                    if(!this.canAfford() && player[this.layer].buyables[this.id].eq(0)) return {
                        'background-color': buyableLockedColour
                    }
                     return {
                        'background': 'linear-gradient(to bottom, ' + buyableAvailableColour + ' ' + buyablePct + '%, ' + buyableProgressColour + ' ' + buyablePct + '%)'
                    }
                }
            },
        12: {
                title() {
                    if(player["p"].c1_holding_cable.eq(1)) return "Plug in Auxiliary Power Cable"
                    return "Auxiliary Power Inlet"
                },
                cost(x) { return 0 },
                effect(x) {},
                display() {
                    displaytext = "(2 seconds)\n\
                    Plug the auxiliary power cable into the wall socket."
                    if(player[this.layer].buyables[this.id].gt(0)) displaytext = displaytext + "\n\
                    Time remaining: " + format(player[this.layer].buyables[this.id]) + " seconds."
                    if(player["p"].c7_plugged_in.eq(1)) return "The cable is plugged in, held in place by electromagnets.\n\
                        Power is being supplied to the maintenance terminal in Corridor 6."
                    if(player["p"].c1_holding_cable.eq(0)) return "An auxiliary power inlet connected to the maintenance terminal in Corridor 6.\n\
                        Perhaps there's a cable you can use nearby."
                    return displaytext
                },
                unlocked() { return player["p"].chapter == "prologue" && player["p"].c2_tank_retrieved.eq(0) },
                canAfford() {
                    return !layerAnyBuyables(this.layer) && player["p"].c1_holding_cable.eq(1);
                },
                buy() { 
                        player[this.layer].buyables[this.id] = new Decimal(2)
                },
                buyMax() {}, // You'll have to handle this yourself if you want
                style() {
                    buyablePct = player[this.layer].buyables[this.id].div(2).mul(100)
                    if(buyablePct.eq(0)) buyablePct = new Decimal(100)
                    if(player["p"].c7_plugged_in.eq(1)) return {
                        'background-color': buyableProgressColour
                    }
                    if(!this.canAfford() && player[this.layer].buyables[this.id].eq(0)) return {
                        'background-color': buyableLockedColour
                    }
                     return {
                        'background': 'linear-gradient(to bottom, ' + buyableAvailableColour + ' ' + buyablePct + '%, ' + buyableProgressColour + ' ' + buyablePct + '%)'
                    }
                }
            },
            21: {
                title:() => "Repair Circuit",
                cost(x) {
                    return 0
                },
                effect(x) {
                    return 0
                },
                display() {
                    displaytext = "(5 seconds)\n\
                    Repair the electronic and life support circuits in this corridor."

                    if(player[this.layer].buyables[this.id].gt(0)) displaytext = displaytext + "\n\
                    Time remaining: " + format(player[this.layer].buyables[this.id]) + " seconds."
                    if(player["p"].circuit_repaired[7].eq(1)) displaytext = "Corridor circuit repaired. If the corridor loses power, the circuit will break.\n\
                    Circuit components repaired: " + player["p"].total_circuits_repaired + "/8"
                    return displaytext
                },
                unlocked() { return player["p"].chapter == "prologue" && player["p"].key_fusebox.eq(1)},
                canAfford() {return !layerAnyBuyables(this.layer) && player["p"].circuit_repaired[7].eq(0)},
                buy() {player[this.layer].buyables[this.id] = new Decimal(5)},
                style() {
                    buyablePct = player[this.layer].buyables[this.id].div(5).mul(100)
                    if(buyablePct.eq(0)) buyablePct = new Decimal(100)
                    if(player["p"].circuit_repaired[7].eq(1)) return {
                        'background-color': buyableProgressColour
                    }
                    if(!this.canAfford() && player[this.layer].buyables[this.id].eq(0)) return {
                        'background-color': buyableLockedColour
                    }
                     return {
                        'background': 'linear-gradient(to bottom, ' + buyableAvailableColour + ' ' + buyablePct + '%, ' + buyableProgressColour + ' ' + buyablePct + '%)'
                    }
                }
            },
        },
        doReset(resettingLayer){ // Triggers when this layer is being reset, along with the layer doing the resetting. Not triggered by lower layers resetting, but is by layers on the same row.
            //nothing yet lol
        },
        layerShown() {return true}, // Condition for when layer appears on the tree
        update(diff) {
            if(player.m.buyables[21].eq(0)) player[this.layer].unlocked = false
            else player[this.layer].unlocked = hasUpgrade("m",11)

            //Effect countdown for buyable 11
            if(player[this.layer].buyables[11].gt(0)) {
                if(player.tab != "c7") player[this.layer].buyables[11] = new Decimal(0)
                else {
                    player[this.layer].buyables[11] = player[this.layer].buyables[11].sub(diff).max(0)
                    if(player[this.layer].buyables[11].eq(0)) {
                        player["p"].c7_vents_open = new Decimal(1)
                    }
                }
            }

            //Effect countdown for buyable 12
            if(player[this.layer].buyables[12].gt(0)) {
                if(player.tab != "c7") player[this.layer].buyables[12] = new Decimal(0)
                else {
                    player[this.layer].buyables[12] = player[this.layer].buyables[12].sub(diff).max(0)
                    if(player[this.layer].buyables[12].eq(0)) {
                        player["p"].c1_holding_cable = new Decimal(0)
                        player["p"].c7_plugged_in = new Decimal(1)
                    }
                }
            }

            //Effect countdown for buyable 21
            if(player[this.layer].buyables[21].gt(0)) {
                if(player.tab != "c7") player[this.layer].buyables[21] = new Decimal(0)
                else {
                    player[this.layer].buyables[21] = player[this.layer].buyables[21].sub(diff).max(0)
                    if(player[this.layer].buyables[21].eq(0)) {
                        layers["p"].setCircuit(7,1)
                    }
                }
            }

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
            {key: "p", desc: "C: reset for lollipops or whatever", onPress(){if (player[this.layer].unlocked) doReset(this.layer)}},
            {key: "ctrl+c" + this.layer, desc: "Ctrl+c: respec things", onPress(){if (player[this.layer].unlocked) respecBuyables(this.layer)}},
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

//
// ######  ######
// ##  ##  ##  ##
// ##      ##  ##
// ##      ######
// ##      ##  ##
// ##  ##  ##  ##
// ######  ######
//
addLayer("c8", {
        layer: "c8", // This is assigned automatically, both to the layer and all upgrades, etc. Shown here so you know about it
        name: "Corridor 08", // This is optional, only used in a few places, If absent it just uses the layer id.
        startData() { return {
            unlocked: false,
            points: new Decimal(0),
            best: new Decimal(0),
            total: new Decimal(0),
            generatorType: 0,
            buyables: {}, // You don't actually have to initialize this one
        }},
        convertToDecimal() {
            // Convert any layer-specific Decimal values (besides points, total, and best) from String to Decimal (used when loading save)
        },
        color:() => "#4BDC13",
        branches: ["c7"],
        requires:() => new Decimal(100), // Can be a function that takes requirement increases into account
        resource: "power", // Name of prestige currency
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
       buyables: {
        rows:2,
        cols:2,
        11: {
                title() {
                    return "Pick up Reprogrammer"
                },
                cost(x) {return 0},
                effect(x) {},
                display() { // Everything else displayed in the buyable button after the title
                    displaytext = "(1 second)\n\
                    Pick up the handheld lock reprogrammer terminal."

                    if(player[this.layer].buyables[this.id].gt(0)) displaytext = displaytext + "\n\
                    Time remaining: " + format(player[this.layer].buyables[this.id]) + " seconds."
                    return displaytext
                },
                unlocked() { return player["p"].chapter == "prologue" && player["p"].c8_reprogrammer_taken.eq(0) },
                canAfford() {
                    return !layerAnyBuyables(this.layer);
                },
                buy() { 
                        player[this.layer].buyables[this.id] = new Decimal(1)
                },
                buyMax() {}, // You'll have to handle this yourself if you want
                style() {
                    buyablePct = player[this.layer].buyables[this.id].div(1).mul(100)
                    if(buyablePct.eq(0)) buyablePct = new Decimal(100)
                    if(!this.canAfford() && player[this.layer].buyables[this.id].eq(0)) return {
                        'background-color': buyableLockedColour
                    }
                     return {
                        'background': 'linear-gradient(to bottom, ' + buyableAvailableColour + ' ' + buyablePct + '%, ' + buyableProgressColour + ' ' + buyablePct + '%)'
                    }
                }
            },
        12: {
                title() {
                    if(player["p"].c2_wires_fed.eq(1) && player["m"].buyables[33].eq(1)) return "Remove Fuses from Circuit Box"
                    return "Emergency System Circuit Box"
                },
                cost(x) { return 0 },
                effect(x) {},
                display() {
                    displaytext = "(3 seconds)\n\
                    Remove the fuses from the emergency system."
                    if(player[this.layer].buyables[this.id].gt(0)) displaytext = displaytext + "\n\
                    Time remaining: " + format(player[this.layer].buyables[this.id]) + " seconds."
                    if(player["p"].c2_wires_fed.eq(0)) return "The circuit box for the emergency systems.\n\
                    Should unlock if the sensor in the vents is shorted out."
                    if(player["m"].buyables[33].eq(0)) return "The circuit box for the emergency systems.\n\
                    The wires from corridor 4 are now touching the sensor, but unpowered."  //Displays if the wires have been fed but C4 is switched off
                    return displaytext
                },
                unlocked() { return player["p"].chapter == "prologue" && player["p"].c8_fuses_retrieved.eq(0) },
                canAfford() {
                    return !layerAnyBuyables(this.layer) && player["p"].c2_wires_fed.eq(1) && player["m"].buyables[33].eq(1)
                },
                buy() { 
                        player[this.layer].buyables[this.id] = new Decimal(3)
                },
                buyMax() {}, // You'll have to handle this yourself if you want
                style() {
                    buyablePct = player[this.layer].buyables[this.id].div(3).mul(100)
                    if(buyablePct.eq(0)) buyablePct = new Decimal(100)
                    if(!this.canAfford() && player[this.layer].buyables[this.id].eq(0)) return {
                        'background-color': buyableLockedColour
                    }
                     return {
                        'background': 'linear-gradient(to bottom, ' + buyableAvailableColour + ' ' + buyablePct + '%, ' + buyableProgressColour + ' ' + buyablePct + '%)'
                    }
                }
            },
            21: {
                title:() => "Repair Circuit",
                cost(x) {
                    return 0
                },
                effect(x) {
                    return 0
                },
                display() {
                    displaytext = "(5 seconds)\n\
                    Repair the electronic and life support circuits in this corridor."

                    if(player[this.layer].buyables[this.id].gt(0)) displaytext = displaytext + "\n\
                    Time remaining: " + format(player[this.layer].buyables[this.id]) + " seconds."
                    if(player["p"].circuit_repaired[8].eq(1)) displaytext = "Corridor circuit repaired. If the corridor loses power, the circuit will break.\n\
                    Circuit components repaired: " + player["p"].total_circuits_repaired + "/8"
                    return displaytext
                },
                unlocked() { return player["p"].chapter == "prologue" && player["p"].key_fusebox.eq(1)},
                canAfford() {return !layerAnyBuyables(this.layer) && player["p"].circuit_repaired[8].eq(0)},
                buy() {player[this.layer].buyables[this.id] = new Decimal(5)},
                style() {
                    buyablePct = player[this.layer].buyables[this.id].div(5).mul(100)
                    if(buyablePct.eq(0)) buyablePct = new Decimal(100)
                    if(player["p"].circuit_repaired[8].eq(1)) return {
                        'background-color': buyableProgressColour
                    }
                    if(!this.canAfford() && player[this.layer].buyables[this.id].eq(0)) return {
                        'background-color': buyableLockedColour
                    }
                     return {
                        'background': 'linear-gradient(to bottom, ' + buyableAvailableColour + ' ' + buyablePct + '%, ' + buyableProgressColour + ' ' + buyablePct + '%)'
                    }
                }
            },
        },
        doReset(resettingLayer){ // Triggers when this layer is being reset, along with the layer doing the resetting. Not triggered by lower layers resetting, but is by layers on the same row.
            //nothing yet lol
        },
        layerShown() {return true}, // Condition for when layer appears on the tree
        update(diff) {
            if(player.m.buyables[11].eq(0)) player[this.layer].unlocked = false
            else player[this.layer].unlocked = hasUpgrade("m",11)

            //Effect countdown for buyable 11
            if(player[this.layer].buyables[11].gt(0)) {
                if(player.tab != "c8") player[this.layer].buyables[11] = new Decimal(0)
                else {
                    player[this.layer].buyables[11] = player[this.layer].buyables[11].sub(diff).max(0)
                    if(player[this.layer].buyables[11].eq(0)) {
                        player["p"].c8_reprogrammer_taken = new Decimal(1)
                    }
                }
            }

            //Effect countdown for buyable 12
            if(player[this.layer].buyables[12].gt(0)) {
                if(player.tab != "c8") player[this.layer].buyables[12] = new Decimal(0)
                else {
                    player[this.layer].buyables[12] = player[this.layer].buyables[12].sub(diff).max(0)
                    if(player[this.layer].buyables[12].eq(0)) {
                        player["p"].c8_fuses_retrieved = new Decimal(1)
                        player["p"].fuses = player["p"].fuses.add(3)
                    }
                }
            }

            //Effect countdown for buyable 21
            if(player[this.layer].buyables[21].gt(0)) {
                if(player.tab != "c8") player[this.layer].buyables[21] = new Decimal(0)
                else {
                    player[this.layer].buyables[21] = player[this.layer].buyables[21].sub(diff).max(0)
                    if(player[this.layer].buyables[21].eq(0)) {
                        layers["p"].setCircuit(8,1)
                    }
                }
            }
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
            {key: "p", desc: "C: reset for lollipops or whatever", onPress(){if (player[this.layer].unlocked) doReset(this.layer)}},
            {key: "ctrl+c" + this.layer, desc: "Ctrl+c: respec things", onPress(){if (player[this.layer].unlocked) respecBuyables(this.layer)}},
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

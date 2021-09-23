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
        name: "Corridor 1", // This is optional, only used in a few places, If absent it just uses the layer id.
        startData() { return {
            unlocked: false,
            points: new Decimal(0),
            
            
            generatorType: 0,
            buyables: {}, // You don't actually have to initialize this one
        }},
        convertToDecimal() {
            // Convert any layer-specific Decimal values (besides points, total, and best) from String to Decimal (used when loading save)
        },
    color() {
        if (player["m"].buyables[12].eq(1) || !player["p"].fusebox_key) return "gold";
        else return "grey";
    },
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
        row: 1, // Row the layer is in on the tree (0 is the first row)
        effect() {
            return {} // Formulas for any boosts inherent to resources in the layer. Can return a single value instead of an object if there is just one effect
        },

        tabFormat: [
            ['display-text', function() {
                    //Flavour text before life support repaired
                    return "<h2>CORRIDOR 1</h2><br><br>\n\
                    A single fluorescent bulb flickers overhead, illuminating the northern section of the corridor. Rubble lines the floor - it seems part of the ceiling has collapsed here.<br><br>\n\
                    A panel on the north wall controls the overhead ventilation fans. Beside it, lower down, is an auxiliary power cable - it should provide enough charge to power one system.<br><br>\n\
                    A filing cabinet, once inside the maintenance room, lies on the floor, its contents spilled out.";
            }],
            "blank",
            "buyables"
        ],


        upgrades: {},

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
                unlocked() { return !player["p"].fusebox_key }, 
                canAfford() {
                    return !layerAnyBuyables(this.layer)
                },
                buy() { 
                        player[this.layer].buyables[this.id] = new Decimal(2);
                        player["p"].is_acting = true;
                },
                buyMax() {}, // You'll have to handle this yourself if you want
                style() {
                    if(player.points.lte(0)) return {'background-color': buyableLockedColour}
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
                    if(player["p"].c1_holding_cable) return "You are holding the power cable in your hand.\n\
                        The spring-loaded winch will retract it if you drop it."
                    if(player["p"].c7_plugged_in) return "The cable is plugged in to the Corridor 7 outlet."
                    return displaytext
                },
                unlocked() { return player["p"].fusebox_key && !player["p"].c2_tank_retrieved}, 
                canAfford() {
                    return !layerAnyBuyables(this.layer) && !player["p"].c1_holding_cable && !player["p"].c7_plugged_in;
                },
                buy() { 
                        player[this.layer].buyables[this.id] = new Decimal(1);
                        player["p"].is_acting = true;
                },
                buyMax() {}, // You'll have to handle this yourself if you want
                style() {
                    if(player.points.lte(0)) return {'background-color': buyableLockedColour}
                    buyablePct = player[this.layer].buyables[this.id].div(1).mul(100)
                    if(buyablePct.eq(0)) buyablePct = new Decimal(100)
                    if(player["p"].c1_holding_cable) return {
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
                    if(!player["p"].c6_filter_override) return "Fan Controls Locked Out"
                    if(player["p"].c1_fan_disabled) return "Overhead Fan Disabled"
                    return "Disable Overhead Fan"
                },
                cost(x) {return 0},
                effect(x) {},
                display() { // Everything else displayed in the buyable button after the title
                    displaytext = "(4 seconds)\n\
                    Disable the overhead fan in the vent space above Corridor 1."

                    if(player[this.layer].buyables[this.id].gt(0)) displaytext = displaytext + "\n\
                    Time remaining: " + format(player[this.layer].buyables[this.id]) + " seconds."
                    if(!player["p"].c6_filter_override) return "Controls for the fan in the vent space above.\n\
                        The controls are locked out due to high air toxicity levels."
                    if(player["p"].c1_fan_disabled) return "The fan in the vent space overhead has been disabled."
                    return displaytext
                },
                unlocked() { return player["p"].fusebox_key && !player["p"].c8_fuses_retrieved}, 
                canAfford() {
                    return !layerAnyBuyables(this.layer) && player["p"].c6_filter_override && !player["p"].c1_fan_disabled;
                },
                buy() { 
                        player[this.layer].buyables[this.id] = new Decimal(4);
                        player["p"].is_acting = true;
                },
                buyMax() {}, // You'll have to handle this yourself if you want
                style() {
                    if(player.points.lte(0)) return {'background-color': buyableLockedColour}
                    buyablePct = player[this.layer].buyables[this.id].div(4).mul(100)
                    if(buyablePct.eq(0)) buyablePct = new Decimal(100)
                    if(player["p"].c1_fan_disabled) return {
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
                unlocked() { return player["p"].fusebox_key},
                canAfford() {return !layerAnyBuyables(this.layer) && player["p"].circuit_repaired[1].eq(0)},
                buy() {
                    player[this.layer].buyables[this.id] = new Decimal(5);
                    player["p"].is_acting = true;
                },
                style() {
                    if(player.points.lte(0)) return {'background-color': buyableLockedColour}
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
            if(player["p"].fusebox_key && player.m.buyables[12].eq(0)) player[this.layer].unlocked = false
            else player[this.layer].unlocked = player.points.gt(0) && hasUpgrade("m",11)

            //Effect countdown for buyable 11
            if(player[this.layer].buyables[11].gt(0)) {
                if(player.tab != "c1") {
                    player[this.layer].buyables[11] = new Decimal(0);
                    player["p"].is_acting = false;
                } else {
                    player[this.layer].buyables[11] = player[this.layer].buyables[11].sub(diff).max(0)
                    if(player[this.layer].buyables[11].eq(0)) {
                        player["p"].fusebox_key = true
                        doPopup("item","Fusebox Key");
                        player["p"].spent_fuses = new Decimal(1)
                        player["m"].buyables[12] = new Decimal(1)
                        player["p"].is_acting = false;
                    }
                }
            }


            //Effect countdown for buyable 12
            if(player[this.layer].buyables[12].gt(0)) {
                if(player.tab != "c1") {
                    player[this.layer].buyables[12] = new Decimal(0);
                    player["p"].is_acting = false;
                } else {
                    player[this.layer].buyables[12] = player[this.layer].buyables[12].sub(diff).max(0)
                    if(player[this.layer].buyables[12].eq(0)) {
                        player["p"].c1_holding_cable = true;
                        player["p"].is_acting = false;
                    }
                }
            }

            //Effect countdown for buyable 13
            if(player[this.layer].buyables[13].gt(0)) {
                if(player.tab != "c1") {
                    player[this.layer].buyables[13] = new Decimal(0);
                    player["p"].is_acting = false;
                } else {
                    player[this.layer].buyables[13] = player[this.layer].buyables[13].sub(diff).max(0)
                    if(player[this.layer].buyables[13].eq(0)) {
                        player["p"].c1_fan_disabled = true;
                        player["p"].is_acting = false;
                    }
                }
            }

            //Effect countdown for buyable 21
            if(player[this.layer].buyables[21].gt(0)) {
                if(player.tab != "c1") {
                    player[this.layer].buyables[21] = new Decimal(0);
                    player["p"].is_acting = false;
                } else {
                    player[this.layer].buyables[21] = player[this.layer].buyables[21].sub(diff).max(0)
                    if(player[this.layer].buyables[21].eq(0)) {
                        layers["p"].setCircuit(1,1);
                        player["p"].is_acting = false;
                    }
                }
            }
        }, // Do any gameloop things (e.g. resource generation) inherent to this layer

        tooltip() { return layers[this.layer].name },
        tooltipLocked() { return layers[this.layer].name },

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
        name: "Corridor 2", // This is optional, only used in a few places, If absent it just uses the layer id.
        startData() { return {
            unlocked: false,
            points: new Decimal(0),
            
            
            generatorType: 0,
            buyables: {}, // You don't actually have to initialize this one
        }},
        convertToDecimal() {
            // Convert any layer-specific Decimal values (besides points, total, and best) from String to Decimal (used when loading save)
        },
    color() {
        if (player["m"].buyables[13].eq(1)) return "gold";
        else return "grey";
    },
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
        row: 1, // Row the layer is in on the tree (0 is the first row)
        effect() {
            return {} // Formulas for any boosts inherent to resources in the layer. Can return a single value instead of an object if there is just one effect
        },

        tabFormat: [
            ['display-text', function() {
                    //Flavour text before life support repaired
                    return "<h2>CORRIDOR 2</h2><br><br>\n\
                    The northeast corner of the corridor is in quite poor condition. The floor has been torn up in places and your footing is uneven.<br><br>\n\
                    There's a massive hole in the ventilation pipe running above the northern corridors. It's not large enough to climb into, but you could reach up or feed something through.<br><br>\n\
                    The garbage disposal unit on the eastern wall has seen better days, but should still operate in theory."
            }],
            "blank",
            "buyables"
        ],
        
        upgrades: {},
       buyables: {
        rows:2,
        cols:2,
        11: {
                title() {
                    if(!player["p"].c6_diagnostic_run) return "Clogged Garbage Disposal"
                    return "Remove Oxygen Tank"
                },
                cost(x) { // cost for buying xth buyable, can be an object if there are multiple currencies
                    return 0
                },
                effect(x) { // Effects of owning x of the items, x is a decimal
                },
                display() { // Everything else displayed in the buyable button after the title
                    displaytext = "(2 seconds)\n\
                    Pull out the oxygen tank blocking the garbage disposal."

                    if(player[this.layer].buyables[this.id].gt(0)) displaytext = displaytext + "\n\
                    Time remaining: " + format(player[this.layer].buyables[this.id]) + " seconds."
                    if(!player["p"].c6_diagnostic_run) return "The garbage disposal chute is jammed shut. It cannot be opened by hand."
                    return displaytext
                },
                unlocked() { return !player["p"].c2_tank_retrieved },
                canAfford() {
                    return !layerAnyBuyables(this.layer) && player["p"].c6_diagnostic_run;
                },
                buy() { 
                        player[this.layer].buyables[this.id] = new Decimal(2);
                        player["p"].is_acting = true;
                },
                buyMax() {}, // You'll have to handle this yourself if you want
                style() {
                    if(player.points.lte(0)) return {'background-color': buyableLockedColour}
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
                    if(player["p"].c2_wires_fed || !player["p"].c4_loose_wires) return "Damaged Overhead Vent"
                    return "Feed Wires into Vent"
                },
                cost(x) {return 0},
                effect(x) {},
                display() { // Everything else displayed in the buyable button after the title
                    displaytext = "(6 seconds)\n\
                    Carefully feed the live wires along the overhead vent, to avoid touching the sides."

                    if(player["m"].buyables[33].eq(0)) displaytext = "(4 seconds)\n\
                    Feed the unpowered wires along the overhead vent."

                    if(player["p"].c2_unpowered_collision) displaytext = "(6 seconds)\n\
                    The wire has jammed the overhead fan above Corridor 1. It'll take a little longer to feed it through."


                    if(player[this.layer].buyables[this.id].gt(0)) displaytext = displaytext + "\n\
                    Time remaining: " + format(player[this.layer].buyables[this.id]) + " seconds."
                    if(player["p"].c2_wires_fed) return "The wires have been fed along the vent and are touching the emergency sensor."
                    if(player["p"].c2_failed_completion) return "The wires collided with the Corridor 1 fan and touched the side.\n\
                    The resulting shock caused you to recoil and lose your breath."
                    if(!player["p"].c4_loose_wires) return "The overhead vent is damaged here.\n\
                    It runs across the north wall, towards Corridor 8."
                    return displaytext
                },
                unlocked() { return !player["p"].c8_fuses_retrieved },
                canAfford() {
                    return !layerAnyBuyables(this.layer) && player["p"].c4_loose_wires && !player["p"].c2_wires_fed;
                },
                buy() { 
                        player["p"].c2_failed_completion = false //Unflag failure if reattempted
                        if(player["m"].buyables[33].eq(0)) player[this.layer].buyables[this.id] = new Decimal(4) //Shorter time limit if wires off since less care needed
                        else player[this.layer].buyables[this.id] = new Decimal(6) //Longer duration for if the wires are live
                        player["p"].is_acting = true;
                },
                buyMax() {}, // You'll have to handle this yourself if you want
                style() {
                    if(player.points.lte(0)) return {'background-color': buyableLockedColour}
                    buyablePct = player[this.layer].buyables[this.id].div(6).mul(100)
                    if(player["m"].buyables[33].eq(0) && !player["p"].c2_unpowered_collision) buyablePct = player[this.layer].buyables[this.id].div(4).mul(100)
                    if(buyablePct.eq(0)) buyablePct = new Decimal(100)
                    if(player["p"].c2_wires_fed) return {
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
                unlocked() { return player["p"].fusebox_key},
                canAfford() {return !layerAnyBuyables(this.layer) && player["p"].circuit_repaired[2].eq(0)},
                buy() {
                    player[this.layer].buyables[this.id] = new Decimal(5);
                    player["p"].is_acting = true;
                },
                style() {
                    if(player.points.lte(0)) return {'background-color': buyableLockedColour}
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
            else player[this.layer].unlocked = player.points.gt(0) && hasUpgrade("m",11)


            //Effect countdown for buyable 11
            if(player[this.layer].buyables[11].gt(0)) {
                if(player.tab != "c2") {
                    player[this.layer].buyables[11] = new Decimal(0);
                    player["p"].is_acting = false;
                } else {
                    player[this.layer].buyables[11] = player[this.layer].buyables[11].sub(diff).max(0)
                    if(player[this.layer].buyables[11].eq(0)) {
                        player["p"].c2_tank_retrieved = true
                        player["p"].tanks = player["p"].tanks.add(1)
                        doPopup("item","Oxygen Tank");
                        player["p"].is_acting = false;
                    }
                }
            }

            //Effect countdown for buyable 12
            if(player[this.layer].buyables[12].gt(0)) {
                if(player.tab != "c2") {
                    player[this.layer].buyables[12] = new Decimal(0)
                    player["p"].c2_unpowered_collision = false //Reset collision flag if action is interrupted
                    player["p"].is_acting = false;
                } else {
                    player[this.layer].buyables[12] = player[this.layer].buyables[12].sub(diff).max(0)
                    if(player[this.layer].buyables[12].lt(3) && !player["p"].c1_fan_disabled && player["m"].buyables[33].eq(1)) { //C4 powered on, live wires touch fan
                        player.points = player.points.sub(1) //Reduce oxygen due to lost breath
                        player[this.layer].buyables[12] = new Decimal(0) //Cancel action
                        player["p"].c2_failed_completion = true //Flag for failure text to appear
                        player["p"].is_acting = false;
                    } else if(player[this.layer].buyables[12].lt(2) && !player["p"].c1_fan_disabled && player["m"].buyables[33].eq(0) && !player["p"].c2_unpowered_collision) { //C4 powered off, unpowered wires touch fan
                        player[this.layer].buyables[12] = player[this.layer].buyables[12].add(2) //Add 2 seconds for time to navigate around fan
                        player["p"].c2_unpowered_collision = true //Flag for unpowered wire colliding with fan
                    } else if(player[this.layer].buyables[12].eq(0)) {
                        player["p"].c2_wires_fed = true
                        player["p"].is_acting = false;
                    }
                }
            }

            //Effect countdown for buyable 21
            if(player[this.layer].buyables[21].gt(0)) {
                if(player.tab != "c2") {
                    player[this.layer].buyables[21] = new Decimal(0);
                    player["p"].is_acting = false;
                } else {
                    player[this.layer].buyables[21] = player[this.layer].buyables[21].sub(diff).max(0)
                    if(player[this.layer].buyables[21].eq(0)) {
                        layers["p"].setCircuit(2,1)
                        player["p"].is_acting = false;
                    }
                }
            }

        }, // Do any gameloop things (e.g. resource generation) inherent to this layer

        tooltip() { return layers[this.layer].name },
        tooltipLocked() { return layers[this.layer].name },

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
        name: "Corridor 3", // This is optional, only used in a few places, If absent it just uses the layer id.
        startData() { return {
            unlocked: false,
            points: new Decimal(0),
            
            
            generatorType: 0,
            buyables: {}, // You don't actually have to initialize this one
        }},
        convertToDecimal() {
            // Convert any layer-specific Decimal values (besides points, total, and best) from String to Decimal (used when loading save)
        },
    color() {
        if (player["m"].buyables[23].eq(1)) return "gold";
        else return "grey";
    },
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
        row: 1, // Row the layer is in on the tree (0 is the first row)
        effect() {
            return {} // Formulas for any boosts inherent to resources in the layer. Can return a single value instead of an object if there is just one effect
        },

        tabFormat: [
            ['display-text', function() {
                    //Flavour text before life support repaired
                    return "<h2>CORRIDOR 3</h2><br><br>\n\
                    The eastern side of the corridor has been mostly untouched by the incident. There are superficial issues with the walls but nothing compromising.<br><br>\n\
                    The ground level vent in the east wall looks to be in decent condition.<br><br>\n\
                    The key reprogrammer terminal has fallen against the inner wall. It's on its side but still seems to be functioning perfectly."
            }],
            "blank",
            "buyables"
        ],

        upgrades: {},
       buyables: {
        rows:2,
        cols:2,
        11: {
                title() {
                    if(!player["p"].c7_vents_open) return "What's in the vent?"
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
                    if(!player["p"].c7_vents_open) return "You can see something in the vent, but the steel cover is firmly in place..."
                    return displaytext
                },
                unlocked() { return !player["p"].c3_tank_retrieved },
                canAfford() {
                    return !layerAnyBuyables(this.layer) && player["p"].c7_vents_open;
                },
                buy() { 
                        player[this.layer].buyables[this.id] = new Decimal(2);
                        player["p"].is_acting = true;
                },
                buyMax() {}, // You'll have to handle this yourself if you want
                style() {
                    if(player.points.lte(0)) return {'background-color': buyableLockedColour}
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
                    if(player["p"].c5_lock_scanned && !player["p"].c3_lock_analysed) return "Analyse Lock"
                    return "Lock Reprogrammer Station"
                },
                cost(x) {return 0},
                effect(x) {},
                display() { // Everything else displayed in the buyable button after the title
                    displaytext = "(6 seconds)\n\
                    Analyse the lock data and create a breaker code."

                    if(player[this.layer].buyables[this.id].gt(0)) displaytext = displaytext + "\n\
                    Time remaining: " + format(player[this.layer].buyables[this.id]) + " seconds."
                    if(player["p"].c3_lock_analysed) return "The lock has been analysed, and can now be opened with the handheld reprogrammer."
                    if(!player["p"].c8_reprogrammer_taken) return "A base station for reprogramming electronic locks.\n\
                    The handheld scanner and unlocker appears to be missing."
                    if(!player["p"].c5_lock_scanned) return "A base station for reprogramming electronic locks.\n\
                    If you scan a lock, you can analyse it here."
                    return displaytext
                },
                unlocked() { return !player["p"].c5_fuses_retrieved },
                canAfford() {
                    return !layerAnyBuyables(this.layer) && player["p"].c5_lock_scanned && !player["p"].c3_lock_analysed;
                },
                buy() { 
                        player[this.layer].buyables[this.id] = new Decimal(6);
                        player["p"].is_acting = true;
                },
                buyMax() {}, // You'll have to handle this yourself if you want
                style() {
                    if(player.points.lte(0)) return {'background-color': buyableLockedColour}
                    buyablePct = player[this.layer].buyables[this.id].div(6).mul(100)
                    if(buyablePct.eq(0)) buyablePct = new Decimal(100)
                    if(player["p"].c3_lock_analysed) return {
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
                unlocked() { return player["p"].fusebox_key},
                canAfford() {return !layerAnyBuyables(this.layer) && player["p"].circuit_repaired[3].eq(0)},
                buy() {
                    player[this.layer].buyables[this.id] = new Decimal(5);
                    player["p"].is_acting = true;
                },
                style() {
                    if(player.points.lte(0)) return {'background-color': buyableLockedColour}
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
            else player[this.layer].unlocked = player.points.gt(0) && hasUpgrade("m",11)

            //Effect countdown for buyable 11
            if(player[this.layer].buyables[11].gt(0)) {
                if(player.tab != "c3") {
                    player[this.layer].buyables[11] = new Decimal(0);
                    player["p"].is_acting = false;
                } else {
                    player[this.layer].buyables[11] = player[this.layer].buyables[11].sub(diff).max(0)
                    if(player[this.layer].buyables[11].eq(0)) {
                        player["p"].c3_tank_retrieved = true
                        player["p"].tanks = player["p"].tanks.add(1)
                        doPopup("item","Oxygen Tank");
                        player["p"].is_acting = false;
                    }
                }
            }

            //Effect countdown for buyable 12
            if(player[this.layer].buyables[12].gt(0)) {
                if(player.tab != "c3") {
                    player[this.layer].buyables[12] = new Decimal(0)
                    player["p"].is_acting = false;
                } else {
                    player[this.layer].buyables[12] = player[this.layer].buyables[12].sub(diff).max(0)
                    if(player[this.layer].buyables[12].eq(0)) {
                        player["p"].c3_lock_analysed = true;
                        player["p"].is_acting = false;
                    }
                }
            }

            //Effect countdown for buyable 21
            if(player[this.layer].buyables[21].gt(0)) {
                if(player.tab != "c3") {
                    player[this.layer].buyables[21] = new Decimal(0);
                    player["p"].is_acting = false;
                } else {
                    player[this.layer].buyables[21] = player[this.layer].buyables[21].sub(diff).max(0)
                    if(player[this.layer].buyables[21].eq(0)) {
                        layers["p"].setCircuit(3,1);
                        player["p"].is_acting = false;
                    }
                }
            }

        }, // Do any gameloop things (e.g. resource generation) inherent to this layer

        tooltip() { return layers[this.layer].name },
        tooltipLocked() { return layers[this.layer].name },

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
        name: "Corridor 4", // This is optional, only used in a few places, If absent it just uses the layer id.
        startData() { return {
            unlocked: false,
            points: new Decimal(0),
            
            
            generatorType: 0,
            buyables: {}, // You don't actually have to initialize this one
        }},
        convertToDecimal() {
            // Convert any layer-specific Decimal values (besides points, total, and best) from String to Decimal (used when loading save)
        },
    color() {
        if (player["m"].buyables[33].eq(1)) return "gold";
        else return "grey";
    },
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
        row: 1, // Row the layer is in on the tree (0 is the first row)
        effect() {
            return {} // Formulas for any boosts inherent to resources in the layer. Can return a single value instead of an object if there is just one effect
        },

        tabFormat: [
            ['display-text', function() {
                    //Flavour text before life support repaired
                    return "<h2>CORRIDOR 4</h2><br><br>\n\
                    The southeast corner of the corridor has suffered massive structural damage. The wall has crumbled away, revealing exposed, sparking wires.<br><br>\n\
                    A circuit board ordinarily obscured by a panel is exposed as well - perhaps you can salvage something from it."
            }],
            "blank",
            "buyables"
        ],

        upgrades: {},
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
                    if(player["p"].c4_failed_completion) return "The anti-tamper system has kicked in. You will need to wait or cycle power to the corridor to reset it."
                    return displaytext
                },
                unlocked() { return !player["p"].c4_fuse_retrieved }, 
                canAfford() {
                    return !layerAnyBuyables(this.layer) && !player["p"].c4_failed_completion;
                },
                buy() { 
                        player[this.layer].buyables[this.id] = new Decimal(4)
                        player["p"].is_acting = true;
                },
                buyMax() {}, // You'll have to handle this yourself if you want
                style() {
                    if(player.points.lte(0)) return {'background-color': buyableLockedColour}
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
                    if(player["p"].c4_loose_wires) return "You are holding the live wires from the wall."
                    return displaytext
                },
                unlocked() { return !player["p"].c8_fuses_retrieved }, 
                canAfford() {
                    return !layerAnyBuyables(this.layer) && !player["p"].c4_loose_wires;
                },
                buy() { 
                        player[this.layer].buyables[this.id] = new Decimal(2)
                        player["p"].is_acting = true;
                },
                buyMax() {}, // You'll have to handle this yourself if you want
                style() {
                    if(player.points.lte(0)) return {'background-color': buyableLockedColour}
                    buyablePct = player[this.layer].buyables[this.id].div(2).mul(100)
                    if(buyablePct.eq(0)) buyablePct = new Decimal(100)
                    if(player["p"].c4_loose_wires) return {
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
                unlocked() { return player["p"].fusebox_key},
                canAfford() {return !layerAnyBuyables(this.layer) && player["p"].circuit_repaired[4].eq(0)},
                buy() {
                    player[this.layer].buyables[this.id] = new Decimal(5);
                    player["p"].is_acting = true;
                },
                style() {
                    if(player.points.lte(0)) return {'background-color': buyableLockedColour}
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
            else player[this.layer].unlocked = player.points.gt(0) && hasUpgrade("m",11)

            //Effect countdown for buyable 11
            if(player[this.layer].buyables[11].gt(0)) {
                if(player.tab != "c4") {
                    player[this.layer].buyables[11] = new Decimal(0);
                    player["p"].is_acting = false;
                } else {
                    player[this.layer].buyables[11] = player[this.layer].buyables[11].sub(diff).max(0)
                    if(player[this.layer].buyables[11].lt(1) && !player["p"].c5_tamper_bypassed) {
                        player[this.layer].buyables[11] = new Decimal(0)
                        player["p"].c4_failed_completion = true
                        player["p"].is_acting = false;
                    } else if(player[this.layer].buyables[11].eq(0)) {
                        player["p"].fuses = player["p"].fuses.add(1)
                        player["p"].c4_fuse_retrieved = true
                        doPopup("item","Fuse");
                        player["p"].is_acting = false;
                    }
                }
            }

            //Effect countdown for buyable 12
            if(player[this.layer].buyables[12].gt(0)) {
                if(player.tab != "c4") {
                    player[this.layer].buyables[12] = new Decimal(0)
                    player["p"].is_acting = false;
                } else {
                    player[this.layer].buyables[12] = player[this.layer].buyables[12].sub(diff).max(0)
                    if(player[this.layer].buyables[12].eq(0)) {
                        player["p"].c4_loose_wires = true
                        player["p"].is_acting = false;
                    }
                }
            }

            //Effect countdown for buyable 21
            if(player[this.layer].buyables[21].gt(0)) {
                if(player.tab != "c4") {
                    player[this.layer].buyables[21] = new Decimal(0)
                    player["p"].is_acting = false;
                } else {
                    player[this.layer].buyables[21] = player[this.layer].buyables[21].sub(diff).max(0)
                    if(player[this.layer].buyables[21].eq(0)) {
                        layers["p"].setCircuit(4,1)
                        player["p"].is_acting = false;
                    }
                }
            }
        }, // Do any gameloop things (e.g. resource generation) inherent to this layer

        tooltip() { return layers[this.layer].name },
        tooltipLocked() { return layers[this.layer].name },

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
        name: "Corridor 5", // This is optional, only used in a few places, If absent it just uses the layer id.
        startData() { return {
            unlocked: false,
            points: new Decimal(0),
            
            
            generatorType: 0,
            buyables: {}, // You don't actually have to initialize this one
        }},
        convertToDecimal() {
            // Convert any layer-specific Decimal values (besides points, total, and best) from String to Decimal (used when loading save)
        },
    color() {
        if (player["m"].buyables[32].eq(1)) return "gold";
        else return "grey";
    },
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
        row: 1, // Row the layer is in on the tree (0 is the first row)
        effect() {
            return {} // Formulas for any boosts inherent to resources in the layer. Can return a single value instead of an object if there is just one effect
        },

        tabFormat: [
            ['display-text', function() {
                    //Flavour text before life support repaired
                    return "<h2>CORRIDOR 5</h2><br><br>\n\
                    One of the overhead bulbs blinks out intermittently, distracting your eye. Otherwise, this section of corridor is quite intact.<br><br>\n\
                    A self-locking electronic supply closet lies on the floor. Presumably someone was working here recently, before the incident."
            }],
            "blank",
            "buyables"
        ],

        upgrades: {},
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
                    if(player["p"].c5_tamper_bypassed) return "The anti-tamper system has been bypassed."
                    return displaytext
                },
                unlocked() { return !player["p"].c4_fuse_retrieved }, 
                canAfford() {
                    return !layerAnyBuyables(this.layer) && !player["p"].c5_tamper_bypassed;
                },
                buy() { 
                        player[this.layer].buyables[this.id] = new Decimal(4)
                        player["p"].is_acting = true;
                },
                buyMax() {}, // You'll have to handle this yourself if you want
                style() {
                    if(player.points.lte(0)) return {'background-color': buyableLockedColour}
                    buyablePct = player[this.layer].buyables[this.id].div(4).mul(100)
                    if(buyablePct.eq(0)) buyablePct = new Decimal(100)
                    if(player["p"].c5_tamper_bypassed) return {
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
                    if(player["p"].c5_incorrect_tried) return "Incorrect Code!"
                    if(player["p"].c3_lock_analysed) return "Crack Lock"
                    if(player["p"].c8_reprogrammer_taken && !player["p"].c5_lock_scanned) return "Scan Lock"
                    return "Locked Electronics Closet"
                },
                cost(x) {return 0},
                effect(x) {},
                display() { // Everything else displayed in the buyable button after the title
                    displaytext = "A closet containing spare electrical components. The lock resets whenever the power is cycled."

                    if(player["p"].c8_reprogrammer_taken) displaytext = "(4 seconds)\n\
                    Scan the lock with the handheld reprogrammer."

                    if(player["p"].c5_lock_scanned) displaytext = "A closet containing spare electrical components. The lock resets whenever the power is cycled.\n\
                    Your reprogrammer has scanned the lock and is ready for analysis."

                    if(player["p"].c3_lock_analysed) displaytext = "(4 seconds)\n\
                    Crack the lock open using the reprogrammer's bypass codes."

                    if(player["p"].c5_incorrect_tried) displaytext = "(4 seconds)\n\
                    The lock code has changed since being scanned. You'll need to scan it again."

                    if(player[this.layer].buyables[this.id].gt(0)) displaytext = displaytext + "\n\
                    Time remaining: " + format(player[this.layer].buyables[this.id]) + " seconds."
                    return displaytext
                },
                unlocked() { return !player["p"].c5_fuses_retrieved }, 
                canAfford() {
                    return !layerAnyBuyables(this.layer) && (player["p"].c3_lock_analysed || (player["p"].c8_reprogrammer_taken && !player["p"].c5_lock_scanned));
                },
                buy() { 
                        player[this.layer].buyables[this.id] = new Decimal(4)
                        player["p"].is_acting = true;
                },
                buyMax() {}, // You'll have to handle this yourself if you want
                style() {
                    if(player.points.lte(0)) return {'background-color': buyableLockedColour}
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
                unlocked() { return player["p"].fusebox_key},
                canAfford() {return !layerAnyBuyables(this.layer) && player["p"].circuit_repaired[5].eq(0)},
                buy() {
                    player[this.layer].buyables[this.id] = new Decimal(5);
                    player["p"].is_acting = true;
                },
                style() {
                    if(player.points.lte(0)) return {'background-color': buyableLockedColour}
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
            else player[this.layer].unlocked = player.points.gt(0) && hasUpgrade("m",11)

            //Effect countdown for buyable 11
            if(player[this.layer].buyables[11].gt(0)) {
                if(player.tab != "c5") {
                    player[this.layer].buyables[11] = new Decimal(0)
                    player["p"].is_acting = false;
                } else {
                    player[this.layer].buyables[11] = player[this.layer].buyables[11].sub(diff).max(0)
                    if(player[this.layer].buyables[11].eq(0)) {
                        player["p"].c5_tamper_bypassed = true
                        player["p"].is_acting = false;
                    }
                }
            }

            //Effect countdown for buyable 12
            if(player[this.layer].buyables[12].gt(0)) {
                if(player.tab != "c5") {
                    player[this.layer].buyables[12] = new Decimal(0)
                    player["p"].is_acting = false;
                } else {
                    player[this.layer].buyables[12] = player[this.layer].buyables[12].sub(diff).max(0)
                    if (player[this.layer].buyables[12].lt(1.5) && player["p"].c5_incorrect_scan) { // If C5 has been powered off and on...
                        player["p"].c5_incorrect_scan = false;
                        player["p"].c5_lock_scanned = false;
                        player["p"].c5_incorrect_tried = true;
                        player["p"].c3_lock_analysed = false;
                        player[this.layer].buyables[12] = new Decimal(0);
                        player["p"].is_acting = false;
                    } else if (player[this.layer].buyables[12].eq(0)) {
                        if(player["p"].c3_lock_analysed) { //If true this is the second run, to get the fuses
                            player["p"].c5_fuses_retrieved = true
                            player["p"].fuses = player["p"].fuses.add(2)
                            doPopup("item","Fuses (2x)");
                        } else {
                            player["p"].c5_lock_scanned = true //If this is hit it's the only other possibility
                            player["p"].c5_incorrect_scan = false;
                            player["p"].c5_incorrect_tried = false;
                        }
                        player["p"].is_acting = false;
                    }
                }
            }

            //Effect countdown for buyable 21
            if(player[this.layer].buyables[21].gt(0)) {
                if(player.tab != "c5") {
                    player[this.layer].buyables[21] = new Decimal(0)
                    player["p"].is_acting = false;
                } else {
                    player[this.layer].buyables[21] = player[this.layer].buyables[21].sub(diff).max(0)
                    if(player[this.layer].buyables[21].eq(0)) {
                        layers["p"].setCircuit(5,1)
                        player["p"].is_acting = false;
                    }
                }
            }
        }, // Do any gameloop things (e.g. resource generation) inherent to this layer

        tooltip() { return layers[this.layer].name },
        tooltipLocked() { return layers[this.layer].name },

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
        name: "Corridor 6", // This is optional, only used in a few places, If absent it just uses the layer id.
        startData() { return {
            unlocked: false,
            points: new Decimal(0),
            
            
            generatorType: 0,
            buyables: {}, // You don't actually have to initialize this one
        }},
        convertToDecimal() {
            // Convert any layer-specific Decimal values (besides points, total, and best) from String to Decimal (used when loading save)
        },
    color() {
        if (player["m"].buyables[31].eq(1)) return "gold";
        else return "grey";
    },
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
        row: 1, // Row the layer is in on the tree (0 is the first row)
        effect() {
            return {} // Formulas for any boosts inherent to resources in the layer. Can return a single value instead of an object if there is just one effect
        },

        tabFormat: [
            ['display-text', function() {
                    //Flavour text before life support repaired
                    return "<h2>CORRIDOR 6</h2><br><br>\n\
                    Many of the maintenance terminals in this section have been damaged - one in particular lies open, its innards exposed.<br><br>\n\
                    The filtration system seems to be functional, and garbage control looks intact, though it would need additional power to function. All other systems are offline."
            }],
            "blank",
            "buyables"
        ],

        upgrades: {},
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
                unlocked() { return !player["p"].c6_fuse_retrieved }, 
                canAfford() {
                    return !layerAnyBuyables(this.layer);
                },
                buy() { 
                        player[this.layer].buyables[this.id] = new Decimal(5)
                        player["p"].is_acting = true;
                },
                buyMax() {}, // You'll have to handle this yourself if you want
                style() {
                    if(player.points.lte(0)) return {'background-color': buyableLockedColour}
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
                    if(player["p"].c6_diagnostic_run) return "Blockage Found!"
                    if(player["p"].c7_plugged_in && player["m"].buyables[12].eq(1)) return "Run Garbage Disposal Diagnostic" //If wire plugged in and C1 has power
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
                    if(player["p"].c6_diagnostic_run) return "A blockage has been detected. The garbage disposal has been opened.\n\
                    Please remove the blockage."
                    if(!player["p"].c7_plugged_in) return "A blank maintenance terminal, connected to an auxiliary power socket in Corridor 7."
                    if(player["m"].buyables[12].eq(0)) return "A blank maintenance terminal. The cable from Corridor 1 is connected but unpowered." //When wire connected but C1 off
                    if(player["m"].buyables[13].eq(0)) return "Garbage disposal unit, Corridor 2 - unable to query status.\n\
                    Please check there is power to the unit." //Cannot run check if corridor 2 is off
                    return displaytext
                },
                unlocked() { return !player["p"].c2_tank_retrieved }, 
                canAfford() {
                    return !layerAnyBuyables(this.layer) && player["p"].c7_plugged_in && !player["p"].c6_diagnostic_run && player["m"].buyables[12].eq(1) && player["m"].buyables[13].eq(1);
                },
                buy() { 
                        player[this.layer].buyables[this.id] = new Decimal(5)
                        player["p"].is_acting = true;
                },
                buyMax() {}, // You'll have to handle this yourself if you want
                style() {
                    if(player.points.lte(0)) return {'background-color': buyableLockedColour}
                    buyablePct = player[this.layer].buyables[this.id].div(5).mul(100)
                    if(buyablePct.eq(0)) buyablePct = new Decimal(100)
                    if(player["p"].c6_diagnostic_run) return {
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
                    if(player["p"].c6_filter_override) return "Filtration System Overridden"
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
                    if(player["p"].c6_filter_override) return "The filtration system has been overridden.\n\
                    Safety locks on fan controls are disabled."
                    return displaytext
                },
                unlocked() { return !player["p"].c8_fuses_retrieved }, 
                canAfford() {
                    return !layerAnyBuyables(this.layer) && !player["p"].c6_filter_override;
                },
                buy() { 
                        player[this.layer].buyables[this.id] = new Decimal(5)
                        player["p"].is_acting = true;
                },
                buyMax() {}, // You'll have to handle this yourself if you want
                style() {
                    if(player.points.lte(0)) return {'background-color': buyableLockedColour}
                    buyablePct = player[this.layer].buyables[this.id].div(5).mul(100)
                    if(buyablePct.eq(0)) buyablePct = new Decimal(100)
                    if(player["p"].c6_filter_override) return {
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
                unlocked() { return player["p"].fusebox_key},
                canAfford() {return !layerAnyBuyables(this.layer) && player["p"].circuit_repaired[6].eq(0)},
                buy() {
                    player[this.layer].buyables[this.id] = new Decimal(5);
                    player["p"].is_acting = true;
                },
                style() {
                    if(player.points.lte(0)) return {'background-color': buyableLockedColour}
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
            else player[this.layer].unlocked = player.points.gt(0) && hasUpgrade("m",11)

            //Effect countdown for buyable 11
            if(player[this.layer].buyables[11].gt(0)) {
                if(player.tab != "c6") {
                    player[this.layer].buyables[11] = new Decimal(0);
                    player["p"].is_acting = false;
                } else {
                    player[this.layer].buyables[11] = player[this.layer].buyables[11].sub(diff).max(0)
                    if(player[this.layer].buyables[11].eq(0)) {
                        player["p"].c6_fuse_retrieved = true
                        player["p"].fuses = player["p"].fuses.add(1)
                        doPopup("item","Fuse");
                        player["p"].is_acting = false;
                    }
                }
            }

            //Effect countdown for buyable 12
            if(player[this.layer].buyables[12].gt(0)) {
                if(player.tab != "c6") {
                    player[this.layer].buyables[12] = new Decimal(0)
                    player["p"].is_acting = false;
                } else {
                    player[this.layer].buyables[12] = player[this.layer].buyables[12].sub(diff).max(0)
                    if(player[this.layer].buyables[12].eq(0)) {
                        player["p"].c6_diagnostic_run = true
                        player["p"].is_acting = false;
                    }
                }
            }

            //Effect countdown for buyable 13
            if(player[this.layer].buyables[13].gt(0)) {
                if(player.tab != "c6") {
                    player[this.layer].buyables[13] = new Decimal(0)
                    player["p"].is_acting = false;
                } else {
                    player[this.layer].buyables[13] = player[this.layer].buyables[13].sub(diff).max(0)
                    if(player[this.layer].buyables[13].eq(0)) {
                        player["p"].c6_filter_override = true
                        player["p"].is_acting = false;
                    }
                }
            }

            //Effect countdown for buyable 21
            if(player[this.layer].buyables[21].gt(0)) {
                if(player.tab != "c6") {
                    player[this.layer].buyables[21] = new Decimal(0)
                    player["p"].is_acting = false;
                } else {
                    player[this.layer].buyables[21] = player[this.layer].buyables[21].sub(diff).max(0)
                    if(player[this.layer].buyables[21].eq(0)) {
                        layers["p"].setCircuit(6,1)
                        player["p"].is_acting = false;
                    }
                }
            }

        }, // Do any gameloop things (e.g. resource generation) inherent to this layer

        tooltip() { return layers[this.layer].name },
        tooltipLocked() { return layers[this.layer].name },

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
        name: "Corridor 7", // This is optional, only used in a few places, If absent it just uses the layer id.
        startData() { return {
            unlocked: false,
            points: new Decimal(0),
            
            
            generatorType: 0,
            buyables: {}, // You don't actually have to initialize this one
        }},
        convertToDecimal() {
            // Convert any layer-specific Decimal values (besides points, total, and best) from String to Decimal (used when loading save)
        },
    color() {
        if (player["m"].buyables[21].eq(1)) return "gold";
        else return "grey";
    },
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
        row: 1, // Row the layer is in on the tree (0 is the first row)
        effect() {
            return {} // Formulas for any boosts inherent to resources in the layer. Can return a single value instead of an object if there is just one effect
        },

        tabFormat: [
            ['display-text', function() {
                    //Flavour text before life support repaired
                    return "<h2>CORRIDOR 7</h2><br><br>\n\
                    The outer wall of the corridor is beginning to cave in, but it seems stable for the time being. The ground level vent and its override controls are still accessible, at a stretch.<br><br>\n\
                    There's an auxiliary power socket near the section to the south, that looks to still be in working order."
            }],
            "blank",
            "buyables"
        ],

        upgrades: {},
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
                    Open the electromagnetic vents in the corridors east and west of the maintenance room."

                    if(player[this.layer].buyables[this.id].gt(0)) displaytext = displaytext + "\n\
                    Time remaining: " + format(player[this.layer].buyables[this.id]) + " seconds."
                    if(player["p"].c7_vents_open) return "The vents in Corridors 3 and 7 are now open."
                    return displaytext
                },
                unlocked() { return !player["p"].c3_tank_retrieved },
                canAfford() {
                    return !layerAnyBuyables(this.layer) && !player["p"].c7_vents_open;
                },
                buy() { 
                        player[this.layer].buyables[this.id] = new Decimal(3)
                        player["p"].is_acting = true;
                },
                buyMax() {}, // You'll have to handle this yourself if you want
                style() {
                    if(player.points.lte(0)) return {'background-color': buyableLockedColour}
                    buyablePct = player[this.layer].buyables[this.id].div(3).mul(100)
                    if(buyablePct.eq(0)) buyablePct = new Decimal(100)
                    if(player["p"].c7_vents_open) return {
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
                    if(player["p"].c1_holding_cable) return "Plug in Auxiliary Power Cable"
                    return "Auxiliary Power Inlet"
                },
                cost(x) { return 0 },
                effect(x) {},
                display() {
                    displaytext = "(2 seconds)\n\
                    Plug the auxiliary power cable into the wall socket."
                    if(player[this.layer].buyables[this.id].gt(0)) displaytext = displaytext + "\n\
                    Time remaining: " + format(player[this.layer].buyables[this.id]) + " seconds."
                    if(player["p"].c7_plugged_in) return "The cable is plugged in, held in place by electromagnets.\n\
                        Power is being supplied to the maintenance terminal in Corridor 6."
                    if(!player["p"].c1_holding_cable) return "An auxiliary power inlet connected to the maintenance terminal in Corridor 6.\n\
                        Perhaps there's a cable you can use nearby."
                    return displaytext
                },
                unlocked() { return !player["p"].c2_tank_retrieved },
                canAfford() {
                    return !layerAnyBuyables(this.layer) && player["p"].c1_holding_cable;
                },
                buy() { 
                        player[this.layer].buyables[this.id] = new Decimal(2)
                        player["p"].is_acting = true;
                },
                buyMax() {}, // You'll have to handle this yourself if you want
                style() {
                    if(player.points.lte(0)) return {'background-color': buyableLockedColour}
                    buyablePct = player[this.layer].buyables[this.id].div(2).mul(100)
                    if(buyablePct.eq(0)) buyablePct = new Decimal(100)
                    if(player["p"].c7_plugged_in) return {
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
                unlocked() { return player["p"].fusebox_key},
                canAfford() {return !layerAnyBuyables(this.layer) && player["p"].circuit_repaired[7].eq(0)},
                buy() {
                    player[this.layer].buyables[this.id] = new Decimal(5)
                    player["p"].is_acting = true;
                },
                style() {
                    if(player.points.lte(0)) return {'background-color': buyableLockedColour}
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
            else player[this.layer].unlocked = player.points.gt(0) && hasUpgrade("m",11)

            //Effect countdown for buyable 11
            if(player[this.layer].buyables[11].gt(0)) {
                if(player.tab != "c7") {
                    player[this.layer].buyables[11] = new Decimal(0)
                    player["p"].is_acting = false;
                } else {
                    player[this.layer].buyables[11] = player[this.layer].buyables[11].sub(diff).max(0)
                    if(player[this.layer].buyables[11].eq(0)) {
                        player["p"].c7_vents_open = true
                        player["p"].is_acting = false;
                    }
                }
            }

            //Effect countdown for buyable 12
            if(player[this.layer].buyables[12].gt(0)) {
                if(player.tab != "c7") {
                    player[this.layer].buyables[12] = new Decimal(0)
                    player["p"].is_acting = false;
                } else {
                    player[this.layer].buyables[12] = player[this.layer].buyables[12].sub(diff).max(0)
                    if(player[this.layer].buyables[12].eq(0)) {
                        player["p"].c1_holding_cable = false
                        player["p"].c7_plugged_in = true
                        player["p"].is_acting = false;
                    }
                }
            }

            //Effect countdown for buyable 21
            if(player[this.layer].buyables[21].gt(0)) {
                if(player.tab != "c7") {
                    player[this.layer].buyables[21] = new Decimal(0)
                    player["p"].is_acting = false;
                } else {
                    player[this.layer].buyables[21] = player[this.layer].buyables[21].sub(diff).max(0)
                    if(player[this.layer].buyables[21].eq(0)) {
                        layers["p"].setCircuit(7,1)
                        player["p"].is_acting = false;
                    }
                }
            }

        }, // Do any gameloop things (e.g. resource generation) inherent to this layer

        tooltip() { return layers[this.layer].name },
        tooltipLocked() { return layers[this.layer].name },
        
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
        name: "Corridor 8", // This is optional, only used in a few places, If absent it just uses the layer id.
        startData() { return {
            unlocked: false,
            points: new Decimal(0),
            
            
            generatorType: 0,
            buyables: {}, // You don't actually have to initialize this one
        }},
        convertToDecimal() {
            // Convert any layer-specific Decimal values (besides points, total, and best) from String to Decimal (used when loading save)
        },
    color() {
        if (player["m"].buyables[11].eq(1)) return "gold";
        else return "grey";
    },
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
        row: 1, // Row the layer is in on the tree (0 is the first row)
        effect() {
            return {} // Formulas for any boosts inherent to resources in the layer. Can return a single value instead of an object if there is just one effect
        },

        tabFormat: [
            ['display-text', function() {
                    //Flavour text before life support repaired
                    return "<h2>CORRIDOR 8</h2><br><br>\n\
                    The source  of the atmospheric issues seems to be here. Toxic air is seeping in through the ventilation system, which is still pumping the fumes in despite the lack of power.<br><br>\n\
                    Whoever was here before you was trying to crack the lock on the filtration circuit box, but it looks like they fled or worse before they had a chance to finish the job."
            }],
            "blank",
            "buyables"
        ],

        upgrades: {},
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
                unlocked() { return !player["p"].c8_reprogrammer_taken },
                canAfford() {
                    return !layerAnyBuyables(this.layer);
                },
                buy() { 
                        player[this.layer].buyables[this.id] = new Decimal(1)
                        player["p"].is_acting = true;
                },
                buyMax() {}, // You'll have to handle this yourself if you want
                style() {
                    if(player.points.lte(0)) return {'background-color': buyableLockedColour}
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
                    if(player["p"].c2_wires_fed && player["m"].buyables[33].eq(1)) return "Remove Fuses from Circuit Box"
                    return "Emergency System Circuit Box"
                },
                cost(x) { return 0 },
                effect(x) {},
                display() {
                    displaytext = "(3 seconds)\n\
                    Remove the fuses from the emergency system."
                    if(player[this.layer].buyables[this.id].gt(0)) displaytext = displaytext + "\n\
                    Time remaining: " + format(player[this.layer].buyables[this.id]) + " seconds."
                    if(!player["p"].c2_wires_fed) return "The circuit box for the emergency systems.\n\
                    Should unlock if the sensor in the vents is shorted out."
                    if(player["m"].buyables[33].eq(0)) return "The circuit box for the emergency systems.\n\
                    The wires from corridor 4 are now touching the sensor, but unpowered."  //Displays if the wires have been fed but C4 is switched off
                    return displaytext
                },
                unlocked() { return !player["p"].c8_fuses_retrieved },
                canAfford() {
                    return !layerAnyBuyables(this.layer) && player["p"].c2_wires_fed && player["m"].buyables[33].eq(1)
                },
                buy() { 
                        player[this.layer].buyables[this.id] = new Decimal(3)
                        player["p"].is_acting = true;
                },
                buyMax() {}, // You'll have to handle this yourself if you want
                style() {
                    if(player.points.lte(0)) return {'background-color': buyableLockedColour}
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
                unlocked() { return player["p"].fusebox_key},
                canAfford() {return !layerAnyBuyables(this.layer) && player["p"].circuit_repaired[8].eq(0)},
                buy() {
                    player[this.layer].buyables[this.id] = new Decimal(5)
                    player["p"].is_acting = true;
                },
                style() {
                    if(player.points.lte(0)) return {'background-color': buyableLockedColour}
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
            else player[this.layer].unlocked = player.points.gt(0) && hasUpgrade("m",11)

            //Effect countdown for buyable 11
            if(player[this.layer].buyables[11].gt(0)) {
                if(player.tab != "c8") {
                    player[this.layer].buyables[11] = new Decimal(0)
                    player["p"].is_acting = false;
                } else {
                    player[this.layer].buyables[11] = player[this.layer].buyables[11].sub(diff).max(0)
                    if(player[this.layer].buyables[11].eq(0)) {
                        player["p"].c8_reprogrammer_taken = true
                        doPopup("item","Lock Reprogrammer")
                        player["p"].is_acting = false;
                    }
                }
            }

            //Effect countdown for buyable 12
            if(player[this.layer].buyables[12].gt(0)) {
                if(player.tab != "c8") {
                    player[this.layer].buyables[12] = new Decimal(0)
                    player["p"].is_acting = false;
                } else {
                    player[this.layer].buyables[12] = player[this.layer].buyables[12].sub(diff).max(0)
                    if(player[this.layer].buyables[12].eq(0)) {
                        player["p"].c8_fuses_retrieved = true
                        player["p"].fuses = player["p"].fuses.add(3)
                        doPopup("item","Fuses (3x)");
                        player["p"].is_acting = false;
                    }
                }
            }

            //Effect countdown for buyable 21
            if(player[this.layer].buyables[21].gt(0)) {
                if(player.tab != "c8") {
                    player[this.layer].buyables[21] = new Decimal(0)
                    player["p"].is_acting = false;
                } else {
                    player[this.layer].buyables[21] = player[this.layer].buyables[21].sub(diff).max(0)
                    if(player[this.layer].buyables[21].eq(0)) {
                        layers["p"].setCircuit(8,1)
                        player["p"].is_acting = false;
                    }
                }
            }
        }, // Do any gameloop things (e.g. resource generation) inherent to this layer

        tooltip() { return layers[this.layer].name },
        tooltipLocked() { return layers[this.layer].name },

        shouldNotify() { // Optional, layer will be highlighted on the tree if true.
                         // Layer will automatically highlight if an upgrade is purchasable.
            
        }
})

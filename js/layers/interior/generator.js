//   ##    ##  ##    ##    ####    ######  ####  
// ##  ##  ##  ##  ##  ##  ##  ##  ##      ##  ##
// ##      ##  ##  ##  ##  ##  ##  ##      ##  ##
//   ##    ######  ######  ####    ######  ##  ##
//     ##  ##  ##  ##  ##  ##  ##  ##      ##  ##
// ##  ##  ##  ##  ##  ##  ##  ##  ##      ##  ##
//   ##    ##  ##  ##  ##  ##  ##  ######  ####  

generatorTypes = {
    "broken": {
        name: "Broken Generator",
        description: "This generator is broken and will leak power.",
        effectDescription: "Power -2",
        generate(power) {
            return power.minus(2);
        }
    },
    "basic": {
        name: "Basic Generator",
        description: "This generator will increase power marginally.",
        effectDescription: "Power +5, then *1.1",
        generate(power) {
            return power.add(5).times(1.1);
        }
    }
};

//
//   ##      ##
// ##  ##  ####
// ##        ##
// ##  ##    ##
// ##  ##    ##
// ##  ##    ##
//   ##    ######
//
addLayer("g1", {
    layer: "g1", // This is assigned automatically, both to the layer and all upgrades, etc. Shown here so you know about it
    name: "Generator 01", // This is optional, only used in a few places, If absent it just uses the layer id.
    startData() { return {
        unlocked: true,
        points: new Decimal(0),
        best: new Decimal(0),
        total: new Decimal(0),
        generatorType: "broken",
        efficiency: 0.5,
        buyables: {}, // You don't actually have to initialize this one
    }},
    branches: ["g8"],
    type: "none",
    row: 1,

    color() {
        if (getClickableState("mc",11) == "OFF") return "grey";
        if (player[this.layer].generatorType == "broken") return "gold";
        return "#77bf5f";
    },

    buyables: {
        11: {
            title() {
                return "Broken Generator";
            },
            cost(x) { // cost for buying xth buyable, can be an object if there are multiple currencies
                return 0
            },
            effect(x) { // Effects of owning x of the items, x is a decimal
            },
            display() { // Everything else displayed in the buyable button after the title
                displaytext = "(7 seconds)\n\
                Replace the burnt-out relay in the generator..";

                if(player[this.layer].buyables[this.id].gt(0)) displaytext = displaytext + "\n\
                Time remaining: " + format(player[this.layer].buyables[this.id]) + " seconds."

                if (!player["p"].g1_part_owned) return "The generator is only partly functional - one of the electronic relays has burnt out.";

                if (getClickableState("mc",11) == "ON") return "It's too dangerous to work on the generator whilst it's active.";

                return displaytext;
            },

            unlocked() { return player[this.layer].generatorType == "broken"; },

            canAfford() {
                return !layerAnyBuyables(this.layer) && getClickableState("mc",11) == "OFF" && player["p"].g1_part_owned;
            },

            buy() { 
                    player[this.layer].buyables[this.id] = new Decimal(7)
                    player["p"].is_acting = true;
                },
            buyMax() {}, // You'll have to handle this yourself if you want
            style() {
                if(player.points.lte(0)) return {'background-color': buyableLockedColour}
                buyablePct = player[this.layer].buyables[this.id].div(7).mul(100)
                if(buyablePct.eq(0)) buyablePct = new Decimal(100)
                if(!this.canAfford() && player[this.layer].buyables[this.id].eq(0)) return {
                    'background-color': buyableLockedColour
                }
                 return {
                    'background': 'linear-gradient(to bottom, ' + buyableAvailableColour + ' ' + buyablePct + '%, ' + buyableProgressColour + ' ' + buyablePct + '%)'
                }
            }

        },

    },

    update(diff) {

        // Buyable handling
        if(player[this.layer].buyables[11].gt(0)) {    //First buyable, "Search Toolbox"

            if (player.tab != this.layer) { // If player leaves the tab, reset the tasks
                player[this.layer].buyables[11] = new Decimal(0);
                player["p"].is_acting = false;
            } else {    // Decrement buyables
                player[this.layer].buyables[11] = player[this.layer].buyables[11].minus(diff).max(0);
                if (player[this.layer].buyables[11].lte(0)) {   //When completed:
                    player[this.layer].generatorType = "basic";
                    player["p"].is_acting = false;
                }
            }
        }

    },

    tabFormat: [
        ["display-text", "<h2>GENERATOR 1</h2>"],
        "blank",
        "blank",
        ["display-text", function() { return "<h3>Generator type: " + player[this.layer].generatorType + "</h3>" } ],
        ["display-text", function() { return "<h3>Generator effect: " + generatorTypes[player[this.layer].generatorType].effectDescription + "</h3>" } ],
        ["display-text", function() { return "<h3>Current efficiency: " + player[this.layer].efficiency + "</h3>" } ],
        ["display-text", function() { return "<h3>Last power output: " + format(player[this.layer].points) + "</h3>" } ],
        "blank",
        "blank",
        "buyables"
    ],


    tooltip() { // Optional, tooltip displays when the layer is unlocked
        return this.name;
    },
})

//
//   ##      ##
// ##  ##  ##  ##
// ##          ##
// ##  ##    ##
// ##  ##  ##
// ##  ##  ##
//   ##    ######
//
addLayer("g2", {
    layer: "g2", // This is assigned automatically, both to the layer and all upgrades, etc. Shown here so you know about it
    name: "Generator 02", // This is optional, only used in a few places, If absent it just uses the layer id.
    startData() { return {
        unlocked: true,
        points: new Decimal(0),
        best: new Decimal(0),
        total: new Decimal(0),
        generatorType: "basic",
        efficiency: 0.5,
        buyables: {}, // You don't actually have to initialize this one
    }},
    branches: ["g1"],
    type: "none", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    row: 1, // Row the layer is in on the tree (0 is the first row)

    color() {
        if (getClickableState("mc",11) == "OFF") return "grey";
        if (player[this.layer].generatorType == "broken") return "gold";
        return "#77bf5f";
    },

   buyables: {
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
    },
    doReset(resettingLayer){ // Triggers when this layer is being reset, along with the layer doing the resetting. Not triggered by lower layers resetting, but is by layers on the same row.
        fullLayerReset(this.layer)
    },
    layerShown() {return true}, // Condition for when layer appears on the tree


    update(diff) {

        if(player[this.layer].buyables[11].gt(0)) {    //First buyable, "Oxygen Tank/Garbage Disposal"

            if (player.tab != this.layer) { // If player leaves the tab, reset the tasks
                player[this.layer].buyables[11] = new Decimal(0);
                player["p"].is_acting = false;
            } else {    // Decrement buyables
                player[this.layer].buyables[11] = player[this.layer].buyables[11].minus(diff).max(0);
                if (player[this.layer].buyables[11].lte(0)) {   //When completed:
                    player["p"].c2_tank_retrieved = true
                    player["p"].tanks = player["p"].tanks.add(1)
                    doPopup("item","Oxygen Tank");
                player["p"].is_acting = false;
                }
            }
        }

    }, // Do any gameloop things (e.g. resource generation) inherent to this layer

    tabFormat: [
        ["display-text", "<h2>GENERATOR 2</h2>"],
        "blank",
        "blank",
        ["display-text", function() { return "<h3>Generator type: " + player[this.layer].generatorType + "</h3>" } ],
        ["display-text", function() { return "<h3>Generator effect: " + generatorTypes[player[this.layer].generatorType].effectDescription + "</h3>" } ],
        ["display-text", function() { return "<h3>Current efficiency: " + player[this.layer].efficiency + "</h3>" } ],
        ["display-text", function() { return "<h3>Last power output: " + format(player[this.layer].points) + "</h3>" } ],
        "blank",
        "blank",
        "buyables"
    ],

    tooltip() { // Optional, tooltip displays when the layer is unlocked
        return this.name;
    },
})

//
//   ##      ##
// ##  ##  ##  ##
// ##          ##
// ##  ##    ##
// ##  ##      ##
// ##  ##  ##  ##
//   ##      ##
//
addLayer("g3", {
    layer: "g3", // This is assigned automatically, both to the layer and all upgrades, etc. Shown here so you know about it
    name: "Generator 03", // This is optional, only used in a few places, If absent it just uses the layer id.
    startData() { return {
        unlocked: true,
        points: new Decimal(0),
        best: new Decimal(0),
        total: new Decimal(0),
        generatorType: "broken",
        efficiency: 0.5,
        buyables: {}, // You don't actually have to initialize this one
    }},
    branches: ["g2"],
    type: "none", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    row: 1, // Row the layer is in on the tree (0 is the first row)

    color() {
        if (getClickableState("mc",11) == "OFF") return "grey";
        if (player[this.layer].generatorType == "broken") return "gold";
        return "#77bf5f";
    },

    buyables: {
        11: {
            title() {
                return "Overheating Generator";
            },
            cost(x) { // cost for buying xth buyable, can be an object if there are multiple currencies
                return 0
            },
            effect(x) { // Effects of owning x of the items, x is a decimal
            },
            display() { // Everything else displayed in the buyable button after the title
                displaytext = "(6 seconds)\n\
                Install the evaporator coil in the generator.";

                if(player[this.layer].buyables[this.id].gt(0)) displaytext = displaytext + "\n\
                Time remaining: " + format(player[this.layer].buyables[this.id]) + " seconds."

                if (!player["p"].g3_part_owned) return "This generator overheats when running. It appears the evaporator coil is missing.";

                if (getClickableState("mc",11) == "ON") return "It's too dangerous to work on the generator whilst it's active.";

                return displaytext;
            },

            unlocked() { return player[this.layer].generatorType == "broken"; },

            canAfford() {
                return !layerAnyBuyables(this.layer) && getClickableState("mc",11) == "OFF" && player["p"].g3_part_owned;
            },

            buy() { 
                    player[this.layer].buyables[this.id] = new Decimal(6)
                    player["p"].is_acting = true;
                },
            buyMax() {}, // You'll have to handle this yourself if you want
            style() {
                if(player.points.lte(0)) return {'background-color': buyableLockedColour}
                buyablePct = player[this.layer].buyables[this.id].div(6).mul(100)
                if(buyablePct.eq(0)) buyablePct = new Decimal(100)
                if(!this.canAfford() && player[this.layer].buyables[this.id].eq(0)) return {
                    'background-color': buyableLockedColour
                }
                 return {
                    'background': 'linear-gradient(to bottom, ' + buyableAvailableColour + ' ' + buyablePct + '%, ' + buyableProgressColour + ' ' + buyablePct + '%)'
                }
            }

        },

    },

    update(diff) {

        // Buyable handling
        if(player[this.layer].buyables[11].gt(0)) {    //First buyable, "Search Toolbox"

            if (player.tab != this.layer) { // If player leaves the tab, reset the tasks
                player[this.layer].buyables[11] = new Decimal(0);
                player["p"].is_acting = false;
            } else {    // Decrement buyables
                player[this.layer].buyables[11] = player[this.layer].buyables[11].minus(diff).max(0);
                if (player[this.layer].buyables[11].lte(0)) {   //When completed:
                    player[this.layer].generatorType = "basic";
                    player["p"].is_acting = false;
                }
            }
        }

    },

    tabFormat: [
        ["display-text", "<h2>GENERATOR 3</h2>"],
        "blank",
        "blank",
        ["display-text", function() { return "<h3>Generator type: " + player[this.layer].generatorType + "</h3>" } ],
        ["display-text", function() { return "<h3>Generator effect: " + generatorTypes[player[this.layer].generatorType].effectDescription + "</h3>" } ],
        ["display-text", function() { return "<h3>Current efficiency: " + player[this.layer].efficiency + "</h3>" } ],
        ["display-text", function() { return "<h3>Last power output: " + format(player[this.layer].points) + "</h3>" } ],
        "blank",
        "blank",
        "buyables"
    ],

    tooltip() { // Optional, tooltip displays when the layer is unlocked
        return this.name;
    },
})

//
//   ##    ##  ##
// ##  ##  ##  ##
// ##      ##  ##
// ##  ##  ######
// ##  ##      ##
// ##  ##      ##
//   ##        ##
//
addLayer("g4", {
    layer: "g4", // This is assigned automatically, both to the layer and all upgrades, etc. Shown here so you know about it
    name: "Generator 04", // This is optional, only used in a few places, If absent it just uses the layer id.
    startData() { return {
        unlocked: true,
        points: new Decimal(0),
        best: new Decimal(0),
        total: new Decimal(0),
        generatorType: "basic",
        efficiency: 0.5,
        buyables: {}, // You don't actually have to initialize this one
    }},
    branches: ["g3"],
    type: "none", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    row: 1, // Row the layer is in on the tree (0 is the first row)

    color() {
        if (getClickableState("mc",11) == "OFF") return "grey";
        if (player[this.layer].generatorType == "broken") return "gold";
        return "#77bf5f";
    },

   buyables: {
       ////////////
       // to add //
       ////////////
   },
    doReset(resettingLayer){ // Triggers when this layer is being reset, along with the layer doing the resetting. Not triggered by lower layers resetting, but is by layers on the same row.
        fullLayerReset(this.layer)
    },
    layerShown() {return true}, // Condition for when layer appears on the tree


    update(diff) {}, // Do any gameloop things (e.g. resource generation) inherent to this layer

    tabFormat: [
        ["display-text", "<h2>GENERATOR 4</h2>"],
        "blank",
        "blank",
        ["display-text", function() { return "<h3>Generator type: " + player[this.layer].generatorType + "</h3>" } ],
        ["display-text", function() { return "<h3>Generator effect: " + generatorTypes[player[this.layer].generatorType].effectDescription + "</h3>" } ],
        ["display-text", function() { return "<h3>Current efficiency: " + player[this.layer].efficiency + "</h3>" } ],
        ["display-text", function() { return "<h3>Last power output: " + format(player[this.layer].points) + "</h3>" } ],
    ],

    tooltip() { // Optional, tooltip displays when the layer is unlocked
        return this.name;
    },
})

//
//   ##    ######
// ##  ##  ##
// ##      ##
// ##  ##  ####
// ##  ##      ##
// ##  ##  ##  ##
//   ##      ##  
//
addLayer("g5", {
    layer: "g5", // This is assigned automatically, both to the layer and all upgrades, etc. Shown here so you know about it
    name: "Generator 05", // This is optional, only used in a few places, If absent it just uses the layer id.
    startData() { return {
        unlocked: true,
        points: new Decimal(0),
        best: new Decimal(0),
        total: new Decimal(0),
        generatorType: "broken",
        efficiency: 0.5,
        buyables: {}, // You don't actually have to initialize this one
    }},
    branches: ["g4"],
    type: "none", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    row: 1, // Row the layer is in on the tree (0 is the first row)

    color() {
        if (getClickableState("mc",11) == "OFF") return "grey";
        if (player[this.layer].generatorType == "broken") return "gold";
        return "#77bf5f";
    },

    buyables: {
        11: {
            title() {
                return "Broken Generator";
            },
            cost(x) { // cost for buying xth buyable, can be an object if there are multiple currencies
                return 0
            },
            effect(x) { // Effects of owning x of the items, x is a decimal
            },
            display() { // Everything else displayed in the buyable button after the title
                displaytext = "(10 seconds)\n\
                Install the voltage regulator into the generator.";

                if(player[this.layer].buyables[this.id].gt(0)) displaytext = displaytext + "\n\
                Time remaining: " + format(player[this.layer].buyables[this.id]) + " seconds."

                if (!player["p"].g5_part_owned) return "This generator is missing a voltage regulator, now part of the life support system.";

                if (getClickableState("mc",11) == "ON") return "It's too dangerous to work on the generator whilst it's active.";

                return displaytext;
            },

            unlocked() { return player[this.layer].generatorType == "broken"; },

            canAfford() {
                return !layerAnyBuyables(this.layer) && getClickableState("mc",11) == "OFF" && player["p"].g5_part_owned;
            },

            buy() { 
                    player[this.layer].buyables[this.id] = new Decimal(10)
                    player["p"].is_acting = true;
                },
            buyMax() {}, // You'll have to handle this yourself if you want
            style() {
                if(player.points.lte(0)) return {'background-color': buyableLockedColour}
                buyablePct = player[this.layer].buyables[this.id].div(10).mul(100)
                if(buyablePct.eq(0)) buyablePct = new Decimal(100)
                if(!this.canAfford() && player[this.layer].buyables[this.id].eq(0)) return {
                    'background-color': buyableLockedColour
                }
                 return {
                    'background': 'linear-gradient(to bottom, ' + buyableAvailableColour + ' ' + buyablePct + '%, ' + buyableProgressColour + ' ' + buyablePct + '%)'
                }
            }

        },

    },

    update(diff) {

        // Buyable handling
        if(player[this.layer].buyables[11].gt(0)) {    //First buyable, "Fix Generator"

            if (player.tab != this.layer) { // If player leaves the tab, reset the tasks
                player[this.layer].buyables[11] = new Decimal(0);
                player["p"].is_acting = false;
            } else {    // Decrement buyables
                player[this.layer].buyables[11] = player[this.layer].buyables[11].minus(diff).max(0);
                if (player[this.layer].buyables[11].lte(0)) {   //When completed:
                    player[this.layer].generatorType = "basic";
                    player["p"].is_acting = false;
                }
            }
        }

    },

    tabFormat: [
        ["display-text", "<h2>GENERATOR 5</h2>"],
        "blank",
        "blank",
        ["display-text", function() { return "<h3>Generator type: " + player[this.layer].generatorType + "</h3>" } ],
        ["display-text", function() { return "<h3>Generator effect: " + generatorTypes[player[this.layer].generatorType].effectDescription + "</h3>" } ],
        ["display-text", function() { return "<h3>Current efficiency: " + player[this.layer].efficiency + "</h3>" } ],
        ["display-text", function() { return "<h3>Last power output: " + format(player[this.layer].points) + "</h3>" } ],
        "blank",
        "blank",
        "buyables"
    ],

    tooltip() { // Optional, tooltip displays when the layer is unlocked
        return this.name;
    },
})

//
//   ##      ##
// ##  ##  ##  ##
// ##      ##
// ##  ##  ####
// ##  ##  ##  ##
// ##  ##  ##  ##
//   ##      ##
//
addLayer("g6", {
    layer: "g6", // This is assigned automatically, both to the layer and all upgrades, etc. Shown here so you know about it
    name: "Generator 06", // This is optional, only used in a few places, If absent it just uses the layer id.
    startData() { return {
        unlocked: true,
        points: new Decimal(0),
        best: new Decimal(0),
        total: new Decimal(0),
        generatorType: "broken",
        efficiency: 0.5,
        buyables: {}, // You don't actually have to initialize this one
    }},
    branches: ["g5"],
    type: "none", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    row: 1, // Row the layer is in on the tree (0 is the first row)

    color() {
        if (getClickableState("mc",11) == "OFF") return "grey";
        if (player[this.layer].generatorType == "broken") return "gold";
        return "#77bf5f";
    },

    buyables: {
        11: {
            title() {
                return "Broken Generator";
            },
            cost(x) { // cost for buying xth buyable, can be an object if there are multiple currencies
                return 0
            },
            effect(x) { // Effects of owning x of the items, x is a decimal
            },
            display() { // Everything else displayed in the buyable button after the title
                displaytext = "(9 seconds)\n\
                Install the rotary motor into the generator.";

                if(player[this.layer].buyables[this.id].gt(0)) displaytext = displaytext + "\n\
                Time remaining: " + format(player[this.layer].buyables[this.id]) + " seconds."

                if (!player["p"].g6_part_owned) return "A damaged power generator. It needs a replacement rotary motor to repair.";

                if (getClickableState("mc",11) == "ON") return "It's too dangerous to work on the generator whilst it's active.";

                return displaytext;
            },

            unlocked() { return player["g6"].generatorType == "broken"; },

            canAfford() {
                return !layerAnyBuyables(this.layer) && getClickableState("mc",11) == "OFF" && player["p"].g6_part_owned;
            },

            buy() { 
                    player[this.layer].buyables[this.id] = new Decimal(9)
                    player["p"].is_acting = true;
                },
            buyMax() {}, // You'll have to handle this yourself if you want
            style() {
                if(player.points.lte(0)) return {'background-color': buyableLockedColour}
                buyablePct = player[this.layer].buyables[this.id].div(9).mul(100)
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
                return "Run Garbage Disposal Diagnostic"
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
                return displaytext
            },
            unlocked() { return !player["p"].c2_tank_retrieved }, 
            canAfford() {
                return !layerAnyBuyables(this.layer) && !player["p"].c6_diagnostic_run;
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

    },

    update(diff) {

        // Buyable handling
        if(player[this.layer].buyables[11].gt(0)) {    //First buyable, "Search Toolbox"

            if (player.tab != this.layer) { // If player leaves the tab, reset the tasks
                player[this.layer].buyables[11] = new Decimal(0);
                player["p"].is_acting = false;
            } else {    // Decrement buyables
                player[this.layer].buyables[11] = player[this.layer].buyables[11].minus(diff).max(0);
                if (player[this.layer].buyables[11].lte(0)) {   //When completed:
                    player[this.layer].generatorType = "basic";
                    player["p"].is_acting = false;
                }
            }
        }

        if(player[this.layer].buyables[12].gt(0)) {    //First buyable, "Disposal Diagnostic"

            if (player.tab != this.layer) { // If player leaves the tab, reset the tasks
                player[this.layer].buyables[12] = new Decimal(0);
                player["p"].is_acting = false;
            } else {    // Decrement buyables
                player[this.layer].buyables[12] = player[this.layer].buyables[12].minus(diff).max(0);
                if (player[this.layer].buyables[12].lte(0)) {   //When completed:
                    player["p"].c6_diagnostic_run = true
                    player["p"].is_acting = false;
                }
            }
        }
    },

    tabFormat: [
        ["display-text", "<h2>GENERATOR 6</h2>"],
        "blank",
        "blank",
        ["display-text", function() { return "<h3>Generator type: " + player[this.layer].generatorType + "</h3>" } ],
        ["display-text", function() { return "<h3>Generator effect: " + generatorTypes[player[this.layer].generatorType].effectDescription + "</h3>" } ],
        ["display-text", function() { return "<h3>Current efficiency: " + player[this.layer].efficiency + "</h3>" } ],
        ["display-text", function() { return "<h3>Last power output: " + format(player[this.layer].points) + "</h3>" } ],
        "blank",
        "blank",
        "buyables"
    ],

    tooltip() { // Optional, tooltip displays when the layer is unlocked
        return this.name;
    },
})

//
//   ##    ######
// ##  ##  ##  ##
// ##          ##
// ##  ##      ##
// ##  ##    ##
// ##  ##    ##
//   ##      ##
//
addLayer("g7", {
    layer: "g7", // This is assigned automatically, both to the layer and all upgrades, etc. Shown here so you know about it
    name: "Generator 07", // This is optional, only used in a few places, If absent it just uses the layer id.
    startData() { return {
        unlocked: true,
        points: new Decimal(0),
        best: new Decimal(0),
        total: new Decimal(0),
        generatorType: "broken",
        efficiency: 0.5,
        buyables: {}, // You don't actually have to initialize this one
    }},
    branches: ["g6"],
    type: "none", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    row: 1, // Row the layer is in on the tree (0 is the first row)

    color() {
        if (getClickableState("mc",11) == "OFF") return "grey";
        if (player[this.layer].generatorType == "broken") return "gold";
        return "#77bf5f";
    },

    buyables: {
        11: {
            title() {
                return "Unfinished Generator";
            },
            cost(x) { // cost for buying xth buyable, can be an object if there are multiple currencies
                return 0
            },
            effect(x) { // Effects of owning x of the items, x is a decimal
            },
            display() { // Everything else displayed in the buyable button after the title
                displaytext = "(11 seconds)\n\
                Install the alternator into the generator.";

                if(player[this.layer].buyables[this.id].gt(0)) displaytext = displaytext + "\n\
                Time remaining: " + format(player[this.layer].buyables[this.id]) + " seconds."

                if (!player["p"].g7_part_owned) return "This generator looks incomplete - the alternator is missing.";

                if (getClickableState("mc",11) == "ON") return "It's too dangerous to work on the generator whilst it's active.";

                return displaytext;
            },

            unlocked() { return player[this.layer].generatorType == "broken"; },

            canAfford() {
                return !layerAnyBuyables(this.layer) && getClickableState("mc",11) == "OFF" && player["p"].g7_part_owned;
            },

            buy() { 
                player[this.layer].buyables[this.id] = new Decimal(11)
                player["p"].is_acting = true;
            },
            buyMax() {}, // You'll have to handle this yourself if you want
            style() {
                if(player.points.lte(0)) return {'background-color': buyableLockedColour}
                buyablePct = player[this.layer].buyables[this.id].div(11).mul(100)
                if(buyablePct.eq(0)) buyablePct = new Decimal(100)
                if(!this.canAfford() && player[this.layer].buyables[this.id].eq(0)) return {
                    'background-color': buyableLockedColour
                }
                 return {
                    'background': 'linear-gradient(to bottom, ' + buyableAvailableColour + ' ' + buyablePct + '%, ' + buyableProgressColour + ' ' + buyablePct + '%)'
                }
            }

        },

    },

    update(diff) {

        // Buyable handling
        if(player[this.layer].buyables[11].gt(0)) {    //First buyable, "Search Toolbox"

            if (player.tab != this.layer) { // If player leaves the tab, reset the tasks
                player[this.layer].buyables[11] = new Decimal(0);
                player["p"].is_acting = false;
            } else {    // Decrement buyables
                player[this.layer].buyables[11] = player[this.layer].buyables[11].minus(diff).max(0);
                if (player[this.layer].buyables[11].lte(0)) {   //When completed:
                    player[this.layer].generatorType = "basic";
                    player["p"].is_acting = false;
                }
            }
        }

    },

    tabFormat: [
        ["display-text", "<h2>GENERATOR 7</h2>"],
        "blank",
        "blank",
        ["display-text", function() { return "<h3>Generator type: " + player[this.layer].generatorType + "</h3>" } ],
        ["display-text", function() { return "<h3>Generator effect: " + generatorTypes[player[this.layer].generatorType].effectDescription + "</h3>" } ],
        ["display-text", function() { return "<h3>Current efficiency: " + player[this.layer].efficiency + "</h3>" } ],
        ["display-text", function() { return "<h3>Last power output: " + format(player[this.layer].points) + "</h3>" } ],
        "blank",
        "blank",
        "buyables"
    ],

    tooltip() { // Optional, tooltip displays when the layer is unlocked
        return this.name;
    },
})

//
//   ##      ##
// ##  ##  ##  ##
// ##      ##  ##
// ##  ##    ##
// ##  ##  ##  ##
// ##  ##  ##  ##
//   ##      ##
//
addLayer("g8", {
    layer: "g8", // This is assigned automatically, both to the layer and all upgrades, etc. Shown here so you know about it
    name: "Generator 08", // This is optional, only used in a few places, If absent it just uses the layer id.
    startData() { return {
        unlocked: true,
        points: new Decimal(0),
        best: new Decimal(0),
        total: new Decimal(0),
        generatorType: "basic",
        efficiency: 0.5,
        buyables: {}, // You don't actually have to initialize this one
    }},
    branches: ["g7"],
    type: "none", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    row: 1, // Row the layer is in on the tree (0 is the first row)

    color() {
        if (getClickableState("mc",11) == "OFF") return "grey";
        if (player[this.layer].generatorType == "broken") return "gold";
        return "#77bf5f";
    },

   buyables: {
       ////////////
       // to add //
       ////////////
   },
    doReset(resettingLayer){ // Triggers when this layer is being reset, along with the layer doing the resetting. Not triggered by lower layers resetting, but is by layers on the same row.
        fullLayerReset(this.layer)
    },
    layerShown() {return true}, // Condition for when layer appears on the tree


    update(diff) {}, // Do any gameloop things (e.g. resource generation) inherent to this layer

    tabFormat: [
        ["display-text", "<h2>GENERATOR 8</h2>"],
        "blank",
        "blank",
        ["display-text", function() { return "<h3>Generator type: " + player[this.layer].generatorType + "</h3>" } ],
        ["display-text", function() { return "<h3>Generator effect: " + generatorTypes[player[this.layer].generatorType].effectDescription + "</h3>" } ],
        ["display-text", function() { return "<h3>Current efficiency: " + player[this.layer].efficiency + "</h3>" } ],
        ["display-text", function() { return "<h3>Last power output: " + format(player[this.layer].points) + "</h3>" } ],
    ],

    tooltip() { // Optional, tooltip displays when the layer is unlocked
        return this.name;
    },
})
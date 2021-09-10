addLayer("ini", {
    name() {
        if (player["p"].neural_imprinting_active) return "Neural imprinting";
        return "Network Interface";
    },
    symbol: "NI", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
        points: new Decimal(0),
        golds: [],
    }},
    color() {
        if (player["p"].neural_imprinting_active) return "#77bf5f";
        return "grey";
    },
    branches: ["g2"],
    requires: new Decimal(10), // Can be a function that takes requirement increases into account
    resource: "prestige points", // Name of prestige currency
    baseResource: "points", // Name of resource prestige is based on
    baseAmount() {return player.points}, // Get the current amount of baseResource
    type: "none", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0.5, // Prestige currency exponent
    gainMult() {},
    gainExp() {},
    row: 2, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [],
    layerShown() { return true; },
    tooltip() { return this.name() },
    tooltipLocked() { return this.name() },

    buyables: {

        11: {
            title() {
                if (player["p"].ni_box_position == this.layer) return "Install the mystery box";
                return "Network Interface?";
            },
            cost(x) { // cost for buying xth buyable, can be an object if there are multiple currencies
                return 0
            },
            effect(x) { // Effects of owning x of the items, x is a decimal
            },
            display() { // Everything else displayed in the buyable button after the title
                displaytext = "(10 seconds)\n\
                Install the mysterious box found upstairs. It seems like it slots right into place here.";

                if(player[this.layer].buyables[this.id].gt(0)) displaytext = displaytext + "\n\
                Time remaining: " + format(player[this.layer].buyables[this.id]) + " seconds."
                if (player["p"].ni_box_position != this.layer) return "A network interface of sorts, with three prongs in the shape of a triangle. Something should fit here...";
                return displaytext;
            },

            unlocked() { return !player["p"].neural_imprinting_active; },    // This is to change when I've made a variable for the box's current position or whatever

            canAfford() {
                return !layerAnyBuyables(this.layer) && player["p"].ni_box_position == this.layer;
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
    
        12: {
            title() {
                return "Spare Part?";
            },
            cost(x) { // cost for buying xth buyable, can be an object if there are multiple currencies
                return 0
            },
            effect(x) { // Effects of owning x of the items, x is a decimal
            },
            display() { // Everything else displayed in the buyable button after the title
                displaytext = "(2 seconds)\n\
                There was an extra part inside the box. It might come in handy elsewhere.";

                if(player[this.layer].buyables[this.id].gt(0)) displaytext = displaytext + "\n\
                Time remaining: " + format(player[this.layer].buyables[this.id]) + " seconds."
                return displaytext;
            },

            unlocked() { return player["p"].neural_imprinting_active && !player["p"].g7_part_owned; },    // This is to change when I've made a variable for the box's current position or whatever

            canAfford() {
                return !layerAnyBuyables(this.layer);
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
                if(!this.canAfford() && player[this.layer].buyables[this.id].eq(0)) return {
                    'background-color': buyableLockedColour
                }
                 return {
                    'background': 'linear-gradient(to bottom, ' + buyableAvailableColour + ' ' + buyablePct + '%, ' + buyableProgressColour + ' ' + buyablePct + '%)'
                }
            }

        },
    

    },

//  ######  ##  ##  ####    ####    ######  ##  ##  ######    ##  
//    ##    ######  ##  ##  ##  ##    ##    ##  ##    ##    ##  ##
//    ##    ######  ##  ##  ##  ##    ##    ######    ##    ##    
//    ##    ##  ##  ####    ####      ##    ######    ##      ##  
//    ##    ##  ##  ##      ##  ##    ##    ######    ##        ##
//    ##    ##  ##  ##      ##  ##    ##    ##  ##    ##    ##  ##
//  ######  ##  ##  ##      ##  ##  ######  ##  ##    ##      ##

    milestones: {
        // Milestones are defined with gold/fails like so:
        // IMPRINT 1: CALM MIND ALPHA
        1: {
            requirementDescription: "Calm Mind α",
            effectDescription: "Consume oxygen at half the normal rate, when idle. (Useless for current content. Sorry!)",
            golded: false,

            toggles: [["ini","calm_mind_alpha_active"]],

            done() {
                return false || this.gold();
            },
            gold() {
                return player["p"].neural_imprinting_active && !this.failed();
            },
            failed() {
                return false;
            },
            onComplete() {
                if (this.gold()) player[this.layer].golds.push(this.id);
            },
            tooltip() {
                tip = "";

                if (!player[this.layer].golds.includes(this.id)) {
                    if (hasMilestone(this.layer, this.id)) tip += "<span class='doneConditionNI'>";
                    tip += "Regular completion: N/A."
                    if (hasMilestone(this.layer, this.id)) tip += " </span>";
                    tip += "<br>";
                }

                if (player[this.layer].golds.includes(this.id)) tip += "<span class='goldConditionNI'>";
                else if (hasMilestone(this.layer, this.id) || this.failed()) tip += "<span class='failedConditionNI'>";
                tip += "Gold completion: Reactivate the life support systems."
                if (player[this.layer].golds.includes(this.id) || this.failed() || hasMilestone(this.layer, this.id)) tip += "</span>";

                return tip;
            },
            style() {
                if (player[this.layer].golds.includes(this.id)) return {
                    "background-color": "gold"
                }
            }
        },

        // IMPRINT 2: TIME COMPRESSION ALPHA

        2: {
            requirementDescription: "Time Compression α",
            effectDescription: "Tasks consume the same amount of oxygen but complete twice as quickly.",

            toggles: [["ini","time_comp_alpha_active"]],

            done() {
                return false || this.gold();
            },
            gold() {
                return (player["p"].chapter_0_two_tanks == 1 && player["p"].neural_imprinting_active) && !this.failed();
            },
            failed() {
                return player["p"].chapter_0_two_tanks == -1
            },
            onComplete() {
                if (this.gold()) player[this.layer].golds.push(this.id);
            },
            tooltip() {
                tip = "";

                if (!player[this.layer].golds.includes(this.id)) {
                    if (hasMilestone(this.layer, this.id)) tip += "<span class='doneConditionNI'>";
                    tip += "Regular completion: Currently unimplemented."
                    if (hasMilestone(this.layer, this.id)) tip += " </span>";
                    tip += "<br>";
                }

                if (player[this.layer].golds.includes(this.id)) tip += "<span class='goldConditionNI'>";
                else if (hasMilestone(this.layer, this.id) || this.failed()) tip += "<span class='failedConditionNI'>";
                tip += "Gold completion: Reactivate life support with only two oxygen tanks."
                if (player[this.layer].golds.includes(this.id) || this.failed() || hasMilestone(this.layer, this.id)) tip += "</span>";

                return tip;
            },
            style() {
                if (player[this.layer].golds.includes(this.id)) return {
                    "background-color": "gold"
                }
            }
        },
    },

    update(diff) {

        // Buyable handling

        if(player[this.layer].buyables[11].gt(0)) { //First buyable, "Install box"

            if (player.tab != this.layer) { // If player leaves the tab, reset the tasks
                player[this.layer].buyables[11] = new Decimal(0);
                player["p"].is_acting = false;
            } else {    // Decrement buyables
                player[this.layer].buyables[11] = player[this.layer].buyables[11].minus(diff).max(0);
                if (player[this.layer].buyables[11].lte(0)) {   //When completed:
                    player["p"].neural_imprinting_active = true;  // Activate the "true" Neural imprinting layer
                    if (options.speedrunMode) {
                        player.interstitialName = "neural_imprinting";
                        player.showInterstitial = true;
                    }
                    player["p"].is_acting = false;
                }
            }
        }        

        if(player[this.layer].buyables[12].gt(0)) {    //Second buyable, "Spare Parts"

            if (player.tab != this.layer) { // If player leaves the tab, reset the tasks
                player[this.layer].buyables[12] = new Decimal(0);
                player["p"].is_acting = false;
            } else {    // Decrement buyables
                player[this.layer].buyables[12] = player[this.layer].buyables[12].minus(diff).max(0);
                if (player[this.layer].buyables[12].lte(0)) {   //When completed:
                    player["p"].g7_part_owned = true;
                    doPopup("item","Alternator");
                    player["p"].is_acting = false;
                }
            }
        }        
    },


    tabFormat: [
        
        ["display-text",function() {
            if (player["p"].neural_imprinting_active) return `<h2>NEURAL IMPRINTING</h2><br><br>
            A giant screen covers one wall of the room, displaying neural readouts and blueprints of your brain. Most of the details are far too technical for you to understand, but a section towards the left provides two more legible lists - "Experiences" and "Imprints".<br><br>
            The terminal attached to the monitor will allow you select from the available imprints, and by using the connected headset in the centre of the room you can apply them to your own mind, to enhance your mental capabilities.<br><br>

            [Hover over the imprints to see their completion requirements.]`;
            return `<h2>NETWORK INTERFACE</h2><br><br>
            A wall-mounted terminal dominates most of this room, with a single wide screen spanning from corner to corner. Wires trail across the floor to what resembles a dentist's chair in the centre of the room, connecting to an oversized headset built in to the chair. Both the terminal and the headset are completely unresponsive<br><br>
            A large part of the terminal appears to be missing. There are no signs of damage, but there is a conspicuous gap to one end. On the wall within the gap is some kind of interface - three large prongs, that would likely slide into the back of the missing device.`;
        }],
        "blank",
        "buyables",
        "blank",
        function() { if (player["p"].neural_imprinting_active) return "milestones"; }
    ],

    shouldNotify() {
        return player["p"].ni_box_position == this.layer && !player["p"].neural_imprinting_active;
    }
})
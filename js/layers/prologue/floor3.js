//  ##        ##    ####  
//  ##      ##  ##  ##  ##
//  ##      ##  ##  ##  ##
//  ##      ######  ####  
//  ##      ##  ##  ##  ##
//  ##      ##  ##  ##  ##
//  ######  ##  ##  ####  

addLayer("plab", {
    layer: "plab", // This is assigned automatically, both to the layer and all upgrades, etc. Shown here so you know about it
    symbol() {
        return "??";
    },
    name: "LABORATORY", // This is optional, only used in a few places, If absent it just uses the layer id.
    startData() { return {
        unlocked: false,
        points: new Decimal(0),
        best: new Decimal(0),
        total: new Decimal(0),
        buyables: {}, // You don't actually have to initialize this one

        visited_ever: false, // Whether the player has ever been to this layer

    }},

    layerShown() {
        if (player["pdec"].visited_ever) return true;
        else if(layers["pf3"].layerShown()) return "ghost";
        else return false;
    },

    branches: ["pdec"],

    update(diff) {

        // Set visited flag
        if (player.tab == this.layer && player[this.layer].visited_ever == false) player[this.layer].visited_ever = true;

    },

    color() {
        return "gold";
    },

    tooltip() {
        tip = this.name;
        return tip;
    },
    lockedTooltip() { return this.tooltip(); }

})

//  ####    ######    ##      ##    ##  ##  ######    ##    ##  ##  ######  ##  ##    ##    ######  ######    ##    ##  ##
//  ##  ##  ##      ##  ##  ##  ##  ##  ##    ##    ##  ##  ######    ##    ##  ##  ##  ##    ##      ##    ##  ##  ##  ##
//  ##  ##  ##      ##      ##  ##  ######    ##    ##  ##  ######    ##    ######  ##  ##    ##      ##    ##  ##  ######
//  ##  ##  ######  ##      ##  ##  ######    ##    ######  ##  ##    ##    ######  ######    ##      ##    ##  ##  ######
//  ##  ##  ##      ##      ##  ##  ######    ##    ##  ##  ##  ##    ##    ######  ##  ##    ##      ##    ##  ##  ######
//  ##  ##  ##      ##  ##  ##  ##  ##  ##    ##    ##  ##  ##  ##    ##    ##  ##  ##  ##    ##      ##    ##  ##  ##  ##
//  ####    ######    ##      ##    ##  ##    ##    ##  ##  ##  ##  ######  ##  ##  ##  ##    ##    ######    ##    ##  ##

addLayer("pdec", {
    layer: "pdec", // This is assigned automatically, both to the layer and all upgrades, etc. Shown here so you know about it
    symbol() {
        if (player[this.layer].visited_ever) return "DC";
        else return "??";
    },
    name: "DECONTAMINATION", // This is optional, only used in a few places, If absent it just uses the layer id.
    startData() { return {
        unlocked: true,
        points: new Decimal(0),
        best: new Decimal(0),
        total: new Decimal(0),
        buyables: {}, // You don't actually have to initialize this one
        
        undressed: false,
        decontaminated: false,
        dressed: false,

        visited_ever: false, // Whether the player has ever been to this layer

    }},

    layerShown() {
        if (player["pf3"].visited_ever) return true;
        else if(layers["pf3"].layerShown()) return "ghost";
        else return false;
    },

    branches: ["pf3"],

    buyables: {

        11: {
            title() {
                return "Locker #44";
            },
            cost(x) { // cost for buying xth buyable, can be an object if there are multiple currencies
                return 0
            },
            effect(x) { // Effects of owning x of the items, x is a decimal
            },
            display() { // Everything else displayed in the buyable button after the title
                displaytext = "(6 seconds)\n\
                Remove your flight suit and stow it in the locker.";

                if (player[this.layer].decontaminated) displaytext = "(6 seconds)\n\
                Put on the maintenance uniform provided for you."

                if(player[this.layer].buyables[this.id].gt(0)) displaytext = displaytext + "\n\
                Time remaining: " + format(player[this.layer].buyables[this.id]) + " seconds."

                if (player[this.layer].undressed && !player[this.layer].decontaminated) return "The locker storing your flight suit and new maintenance uniform.";
                return displaytext;
            },
            unlocked() { return !player[this.layer].dressed; },
            canAfford() {
                return !layerAnyBuyables(this.layer) && (!player[this.layer].undressed || player[this.layer].decontaminated);
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
                if (player[this.layer].undressed && !player[this.layer].decontaminated) return {'background-color': buyableProgressColour};
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
                return "Decontamination Chamber";
            },
            cost(x) { // cost for buying xth buyable, can be an object if there are multiple currencies
                return 0
            },
            effect(x) { // Effects of owning x of the items, x is a decimal
            },
            display() { // Everything else displayed in the buyable button after the title
                displaytext = "(12 seconds)\n\
                Activate the decontamination system, to clean off anything hazardous from outside the facility.";

                if(player[this.layer].buyables[this.id].gt(0)) displaytext = displaytext + "\n\
                Time remaining: " + format(player[this.layer].buyables[this.id]) + " seconds."

                if (!player[this.layer].undressed) return "A decontamination system, normally used for visitors to the laboratory. You'll need to undress before using it."
                return displaytext;
            },
            duration() {
                return 12;
            },
            unlocked() { return !player[this.layer].decontaminated; },
            canAfford() {
                return !layerAnyBuyables(this.layer) && player[this.layer].undressed;
            },
            buy() { 
                player[this.layer].buyables[this.id] = new Decimal(this.duration())
                player["p"].is_acting = true;
            },
            buyMax() {}, // You'll have to handle this yourself if you want
            style() {
                if(player.points.lte(0)) return {'background-color': buyableLockedColour}
                buyablePct = player[this.layer].buyables[this.id].div(this.duration()).mul(100)
                if(buyablePct.eq(0)) buyablePct = new Decimal(100)
                if(!this.canAfford() && player[this.layer].buyables[this.id].eq(0)) return {
                    'background-color': buyableLockedColour
                }
                 return {
                    'background': 'linear-gradient(to bottom, ' + buyableAvailableColour + ' ' + buyablePct + '%, ' + buyableProgressColour + ' ' + buyablePct + '%)'
                }
            }

        }

    },

    update(diff) {

        // Set visited flag
        if (player.tab == this.layer && player[this.layer].visited_ever == false) player[this.layer].visited_ever = true;

        if(player[this.layer].buyables[11].gt(0)) {    //First buyable, "Lockers"

            if (player.tab != this.layer) { // If player leaves the tab, reset the tasks
                player[this.layer].buyables[11] = new Decimal(0);
                player["p"].is_acting = false;
            } else {    // Decrement buyables
                player[this.layer].buyables[11] = player[this.layer].buyables[11].minus(diff).max(0);
                if (player[this.layer].buyables[11].lte(0)) {   //When completed:

                    if (!player[this.layer].decontaminated) {   // First run, undress - lock layers
                        for (layer of ["pf3","pf2","pcor","prec"]) {
                            player[layer].unlocked = false;
                        }
                        player[this.layer].undressed = true;
                    } else {    // Second run, dress - unlock layers
                        for (layer of ["pf3","pf2","pcor","prec"]) player[layer].unlocked = true;
                        player[this.layer].dressed = true;
                    }
                    player["p"].is_acting = false;
                }
            }
        }        

        if(player[this.layer].buyables[12].gt(0)) {    //Second buyable, "Decontamination"

            if (player.tab != this.layer) { // If player leaves the tab, reset the tasks
                player[this.layer].buyables[12] = new Decimal(0);
                player["p"].is_acting = false;
            } else {    // Decrement buyables
                player[this.layer].buyables[12] = player[this.layer].buyables[12].minus(diff).max(0);
                if (player[this.layer].buyables[12].lte(0)) {   //When completed:

                    player[this.layer].decontaminated = true;
                    player["p"].is_acting = false;

                }
            }
        }        
    },

    color() {
        return "gold"
    },

    tabFormat: [
        ["display-text","<h2>DECONTAMINATION</h2>"],
        "blank",
        ["display-text","Following the signs for Lambda Division leads you to a large white room. In the centre stands a row of decontamination units - the sort used to clean off radiation or microbes after visiting somewhere unknown.<br><br>\n\
        On either side of the units are a set of lockers - presumably used for storing scientists' personal effects when they're working, and vice versa."],
        "blank",
        "buyables"
    ],

    tooltip() {
        tip = this.name;
        return tip;
    },
    lockedTooltip() { return this.tooltip(); }

})

//  ######    ##  
//  ##      ##  ##
//  ##          ##
//  ######    ##  
//  ##          ##
//  ##      ##  ##
//  ##        ##  

addLayer("pf3", {
    layer: "pf3", // This is assigned automatically, both to the layer and all upgrades, etc. Shown here so you know about it
    symbol: "3F",
    name: "FLOOR 03", // This is optional, only used in a few places, If absent it just uses the layer id.
    startData() { return {
        unlocked: true,
        points: new Decimal(0),
        best: new Decimal(0),
        total: new Decimal(0),
        buyables: {}, // You don't actually have to initialize this one

        visited_ever: false, // Whether the player has ever been to this layer

    }},

    layerShown() {
        if (player["pf2"].visited_ever) return true;
        else return false;
    },

    branches: ["pf2"],

    color() {
        return "gold";
    },

    clickables: {
        "basement": {
            title: "B",
            style() {
                return {
                    "min-height": "40px",
                    "height": "40px",
                    "width": "80px"
                }
            },
            canClick() { return player["pbf"].unlocked; },
            onClick() { showTab("pbf"); }
        },
        "one": {
            title: "1",
            canClick() { return false; },
            style() {
                return {
                    "min-height": "40px",
                    "height": "40px",
                    "width": "40px"
                }
            }
        },
        "two": {
            title: "2",
            canClick() { return (player.tab != "pf2") },
            onClick() { showTab("pf2");},
            style() {
                return {
                    "min-height": "40px",
                    "height": "40px",
                    "width": "40px"
                }
            }
        },
        "three": {
            title: "3",
            canClick() { return (player.tab != "pf3") },
            onClick() { showTab("pf3");},
            style() {
                return {
                    "min-height": "40px",
                    "height": "40px",
                    "width": "40px"
                }
            }
        },
        "four": {
            title: "4",
            canClick() { return false; },
            style() {
                return {
                    "min-height": "40px",
                    "height": "40px",
                    "width": "40px"
                }
            }
        },
        "five": {
            title: "5",
            canClick() { return false; },
            style() {
                return {
                    "min-height": "40px",
                    "height": "40px",
                    "width": "40px"
                }
            }
        },
    },

    bars: {
        liftscreen: {
            direction: RIGHT,
            width: 80,
            height: 60,
            display() { return `<h2>${layers[this.layer].symbol}</h2>`; },
            baseStyle() { return {'background-color': 'black'};},
            fillStyle() { return {'background-color': 'black'};}
        }
    },

    update(diff) {

        // Set visited flag
        if (player.tab == this.layer && player[this.layer].visited_ever == false) player[this.layer].visited_ever = true;

    },

    tabFormat: [
        ["display-text","<h2>MAIN ELEVATOR (3F)"],
        "blank",
        ["display-text",function() { 

            text = "The main central elevator for the facility. Currently on the third floor.<br><br>"
            
            if (player["pf2"].key_used) text += "You can now ride the elevator down to the basement floor."
            else text += "You've been given permission to visit the second and third floors for now - best not to go wandering elsewhere on your first day here.";

            return text;

        }],
       "blank",
        ["display-text","The signposts outside the elevator read:"],
        "blank",
        ["row",[
            ["display-text",
            `<h3 style='text-align: right'>\<--3F WEST</h3>
            <p style='text-align: right'>Laboratory</p>`],
            ["display-text","&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp"],
            ["display-text",
            `<h3 style='text-align: left'>3F EAST--\></h3>
            <p style='text-align: left'>Loading Dock</p>`]
        ]],
        "blank",
        "blank",
        "blank",
        ["row",[
            ["column",[
                ["bar","liftscreen"],
                ["row",[["clickable","three"],["clickable","four"]]],
                ["row",[["clickable","one"],["clickable","two"]]],
                ["clickable","basement"]
            ]],
        ["layer-proxy",["pf2",["buyables"]]]
        ]]
    ],

    tooltip() {
        tip = this.name;
        return tip;
    },
    lockedTooltip() { return this.tooltip(); }

})
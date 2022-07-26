addLayer("vtb", {
    layer: "vtb", // This is assigned automatically, both to the layer and all upgrades, etc. Shown here so you know about it
    symbol: "BF",
    name: "BASEMENT FLOOR", // This is optional, only used in a few places, If absent it just uses the layer id.
    startData() { return {
        unlocked: true,
        points: new Decimal(0),
        best: new Decimal(0),
        total: new Decimal(0),
        buyables: {}, // You don't actually have to initialize this one
        
        visited_ever: false, // Whether the player has ever been to this layer

        // Temporary conditions
        ladder_to_f1: false,
    }},

    clickables: {
        "exit": {
            title: "Exit the Elevator",
            canClick() { return true; },
            onClick() {
                // Reset the state of the rooms - leaving elevator is like a reset for the vertical tree
                layers[this.layer].doReset("vtb");

                // Remove large objects from BF, place them at IME
                if (player["p"].ni_box_position == "vtb") player["p"].ni_box_position = "ime";
                if (player["p"].sm_suit_position == "vtb") player["p"].sm_suit_position = "ime";

                // Swap to the Interior (flat) tree
                showNavTab("interior");
                showTab("ime");
            }
        },
        
    },

    buyables: {
        11: {
            title() {
                return "Climb the shaft to 1F"
            },
            cost(x) { // cost for buying xth buyable, can be an object if there are multiple currencies
                return 0
            },
            effect(x) { // Effects of owning x of the items, x is a decimal
            },
            display() { // Everything else displayed in the buyable button after the title
                displaytext = "(10 seconds)\n\
                Raise the emergency ladder attached to the lift, which you can scale to reach the first floor."

                if(player[this.layer].buyables[this.id].gt(0)) displaytext = displaytext + "\n\
                Time remaining: " + format(player[this.layer].buyables[this.id]) + " seconds."
                if(player["vtb"].ladder_to_f1) return "The emergency ladder has been raised to 1F."
                return displaytext
            },
            unlocked() { return player["mc"].points.lt(layers["vt1"].powerRequirement) },
            canAfford() {
                return !layerAnyBuyables(this.layer) && !player["vtb"].ladder_to_f1;
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
                if(player["vtb"].ladder_to_f1) return {
                    'background-color': buyableProgressColour
                }
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

        // Lock status...hopefully this will lock the whole tree
        player[this.layer].unlocked = true; // Unlock by default
        // Lock the tree down while the player is trapped in the Security Room
        if (player["p"].dropped_down && player["p"].security_swipe_status != 1) player[this.layer].unlocked = false;

        // Set visited flag
        if (player.tab == this.layer && player[this.layer].visited_ever == false) player[this.layer].visited_ever = true;

        if(player[this.layer].buyables[11].gt(0)) {    //First buyable, "1F Ladder"

            if (player.tab != this.layer) { // If player leaves the tab, reset the tasks
                player[this.layer].buyables[11] = new Decimal(0);
                player["p"].is_acting = false;
            } else {    // Decrement buyables
                player[this.layer].buyables[11] = player[this.layer].buyables[11].minus(diff).max(0);
                if (player[this.layer].buyables[11].lte(0)) {   //When completed:
                    player[this.layer].ladder_to_f1 = true;
                    player["p"].is_acting = false;
                }
            }
        }        

        if (player["mc"].points.gte(layers["vt1"].powerRequirement)) player[this.layer].ladder_to_f1 = false;   // Cancel/remove the ladder if F1 is powered, it's unnecessary

    },

    doReset(resettingLayer) {
        // Reset this layer
        layerDataReset(this.layer,["visited_ever"]);
        // Reset the floor above
        layers["vt1"].doReset("vtb");
    },

    tabFormat: [
        ["display-text","<h2>BASEMENT FLOOR</h2>"],
        "blank",
        ["display-text",function() { 
            text = "The main central elevator for the installation. With the current level of power, ";

            max_floor = 0;
            for (floor of ["vt1","vt2","vt3"]) {
                if (player["mc"].points.gte(layers[floor].powerRequirement)) max_floor++;
                else break;
            }
            
            if (max_floor == 0) text += "the elevator cannot move from the basement floor.";
            else text += `the elevator can go as high as ${max_floor}F.`;

            text += "<br><br>There's an emergency hatch on the roof of the elevator, with a small ladder you can extend upwards from it. It should be high enough to scale one extra floor if need be."

            if (player["p"].ni_box_position == this.layer) { 
                text += "<br><br>A warning on the panel reads <span style='color: #bf7f7f'>WEIGHT LIMIT EXCEEDED</span>. You'll need to exit the elevator and remove the box from it."
            }
            if (player["p"].sm_suit_position == this.layer) { 
                text += "<br><br>A warning on the panel reads <span style='color: #bf7f7f'>WEIGHT LIMIT EXCEEDED</span>. You'll need to exit the elevator and remove the Exosuit from it."
            }
            return text;
        }],
        "blank",
        ["clickable","exit"],
        "blank",
        "buyables"
    ],

    color: "gold",

    tooltip() { return this.name; },
    lockedTooltip() { return this.tooltip(); }
})
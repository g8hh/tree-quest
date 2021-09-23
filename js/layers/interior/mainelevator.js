addLayer("ime", {
    name: "Main Elevator",
    symbol: "ME", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
        points: new Decimal(0),
    }},

    clickables: {
        11: {
            title: "Enter the Elevator",
            canClick() { return true; },
            onClick() {
                showNavTab("vertical");
                showTab("vtb");
            }
        }
    },

    color: "#77bf5f",
    branches: ["g6"],

    buyables: {

        11: {
            title() {
                return "Move Box to Network Interface";
            },
            cost(x) { // cost for buying xth buyable, can be an object if there are multiple currencies
                return 0
            },
            effect(x) { // Effects of owning x of the items, x is a decimal
            },
            display() { // Everything else displayed in the buyable button after the title
                displaytext = "(9 seconds)\n\
                Drag the box towards the network interface - the holes in the box match the plug there."

                if(player[this.layer].buyables[this.id].gt(0)) displaytext = displaytext + "\n\
                Time remaining: " + format(player[this.layer].buyables[this.id]) + " seconds."
                return displaytext;
            },

            unlocked() { return player["p"].ni_box_position == this.layer; },    // This is to change when I've made a variable for the box's current position or whatever

            canAfford() {
                return !layerAnyBuyables(this.layer);
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
            title() {
                return "Move Exosuit to Secluded Mountings";
            },
            cost(x) { // cost for buying xth buyable, can be an object if there are multiple currencies
                return 0
            },
            effect(x) { // Effects of owning x of the items, x is a decimal
            },
            display() { // Everything else displayed in the buyable button after the title
                displaytext = "(9 seconds)\n\
                Drag the exosuit towards the maintenance mountings."

                if(player[this.layer].buyables[this.id].gt(0)) displaytext = displaytext + "\n\
                Time remaining: " + format(player[this.layer].buyables[this.id]) + " seconds."
                return displaytext;
            },

            unlocked() { return player["p"].sm_suit_position == this.layer; },    // This is to change when I've made a variable for the box's current position or whatever

            canAfford() {
                return !layerAnyBuyables(this.layer);
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

    },

    update(diff) {

        // Buyable handling

        if(player[this.layer].buyables[11].gt(0)) {    //First buyable, "Move NI box to NI layer"

            if (player.tab != this.layer) { // If player leaves the tab, reset the tasks
                player[this.layer].buyables[11] = new Decimal(0);
                player["p"].is_acting = false;
            } else {    // Decrement buyables
                player[this.layer].buyables[11] = player[this.layer].buyables[11].minus(diff).max(0);
                if (player[this.layer].buyables[11].lte(0)) {   //When completed:
                    player["p"].ni_box_position = "ini";
                    showTab("ini");
                    player["p"].is_acting = false;
                }
            }
        }

        if(player[this.layer].buyables[12].gt(0)) {    //Second buyable, "Move exosuit to SM layer"

            if (player.tab != this.layer) { // If player leaves the tab, reset the tasks
                player[this.layer].buyables[12] = new Decimal(0);
                player["p"].is_acting = false;
            } else {    // Decrement buyables
                player[this.layer].buyables[12] = player[this.layer].buyables[12].minus(diff).max(0);
                if (player[this.layer].buyables[12].lte(0)) {   //When completed:
                    player["p"].sm_suit_position = "ism";
                    showTab("ism");
                    player["p"].is_acting = false;

                }
            }
        }

    },

    tabFormat: [
        ["display-text","<h2>MAIN ELEVATOR</h2>"],
        "blank",
        ["display-text","The lockdown has been lifted, and the elevator doors lie open. You should be able to make your way back up the facility, this way - but with power at a premium, you'll only be able to ride it partway up."],
        "blank",
        "clickables",
        "blank",
        "buyables"
    ],

    tooltip() { return this.name; },
})
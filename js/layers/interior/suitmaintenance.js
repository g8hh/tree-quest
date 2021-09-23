addLayer("ism", {
    name() {
        if (player["p"].suit_maintenance_active) return "Suit Maintenance";
        return "Secluded Mountings";
    },
    symbol: "SM", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
        points: new Decimal(0),

        // Variables for component types, current and alltime maxes
        // Some of these might move to P later
        air_current: 0,
        air_max: 0,
        earth_current: 0,
        earth_max: 0,
        fire_current: 0,
        fire_max: 0,
        water_current: 0,
        water_max: 0
    }},


    color() {
        if (player["p"].suit_maintenance_active) return "#77bf5f";
        return "grey";
    },
    branches: ["g8"],
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
                if (player["p"].sm_suit_position == this.layer) return "Mount the Exosuit";
                return "Empty Mountings";
            },
            cost(x) { // cost for buying xth buyable, can be an object if there are multiple currencies
                return 0
            },
            effect(x) { // Effects of owning x of the items, x is a decimal
            },
            display() { // Everything else displayed in the buyable button after the title
                displaytext = "(10 seconds)\n\
                Transfer the Model #### Exosuit onto the mountings, allowing for charging and repairs.";

                if(player[this.layer].buyables[this.id].gt(0)) displaytext = displaytext + "\n\
                Time remaining: " + format(player[this.layer].buyables[this.id]) + " seconds."
                if (player["p"].sm_suit_position != this.layer) return "An empty set of maintenance mountings, designed for use with a range of Exosuit models.";
                return displaytext;
            },

            unlocked() { return !player["p"].suit_maintenance_active; },    // This is to change when I've made a variable for the box's current position or whatever

            canAfford() {
                return !layerAnyBuyables(this.layer) && player["p"].sm_suit_position == this.layer;
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
        }
    },

    bars: {
        aircomponent: {
            direction: RIGHT,
            width: 400,
            height: 50,
            display: "UNKNOWN COMPONENT",
            progress() { return player[this.layer].air_current / 5; },
            baseStyle() {
                barpct = 100 * player[this.layer].air_max / 5;
                return { 'background': 'repeating-linear-gradient( 135deg, black, black 20px, #bf8f8f 20px, #bf8f8f 40px)'}
                // return { 'background': 'linear-gradient(to right, #333333 ' + barpct + '%, #000000 ' + barpct + '%)' };
            },
            fillStyle: { 'background-color': 'aqua' }
        },
        earthcomponent: {
            direction: RIGHT,
            width: 400,
            height: 50,
            display: "UNKNOWN COMPONENT",
            progress() { return player[this.layer].earth_current / 5; },
            baseStyle() {
                barpct = 100 * player[this.layer].earth_max / 5;
                return { 'background': 'repeating-linear-gradient( 135deg, black, black 20px, #bf8f8f 20px, #bf8f8f 40px)'}
                // return { 'background': 'linear-gradient(to right, #333333 ' + barpct + '%, #000000 ' + barpct + '%)' };
            },
            fillStyle: { 'background-color': 'green' }
        },
        firecomponent: {
            direction: RIGHT,
            width: 400,
            height: 50,
            display: "UNKNOWN COMPONENT",
            progress() { return player[this.layer].fire_current / 5; },
            baseStyle() {
                barpct = 100 * player[this.layer].fire_max / 5;
                return { 'background': 'repeating-linear-gradient( 135deg, black, black 20px, #bf8f8f 20px, #bf8f8f 40px)'}
                // return { 'background': 'linear-gradient(to right, #333333 ' + barpct + '%, #000000 ' + barpct + '%)' };
            },
            fillStyle: { 'background-color': 'red' }
        },
        watercomponent: {
            direction: RIGHT,
            width: 400,
            height: 50,
            display: "UNKNOWN COMPONENT",
            progress() { return player[this.layer].water_current / 5; },
            baseStyle() {
                barpct = 100 * player[this.layer].water_max / 5;
                return { 'background': 'repeating-linear-gradient( 135deg, black, black 20px, #bf8f8f 20px, #bf8f8f 40px)'}
                // return { 'background': 'linear-gradient(to right, #333333 ' + barpct + '%, #000000 ' + barpct + '%)' };
            },
            fillStyle: { 'background-color': 'blue' }
        },
    },

    clickables: {
        // 11 through 14 correspond to "aircomponent" bar
        // so on for 2x,3x,4x as earth,fire,water

        /////////////////////////////////////////
        // TODO : GIVE THESE BUTTONS AN EFFECT //
        /////////////////////////////////////////

        11: {   // Minimise Air Component
            title: "MIN",
            canClick() { return player[this.layer].air_current > 0; },
            onClick() { player[this.layer].air_current = 0; }
        },
        12: {   // Decrease Air Component
            title: "-",
            canClick() { return player[this.layer].air_current > 0; },
            onClick() { player[this.layer].air_current -= 1; }
        },
        13: {   // Increase Air Component
            title: "+",
            canClick() { return player[this.layer].air_current < player[this.layer].air_max; },
            onClick() { player[this.layer].air_current += 1; }
        },
        14: {   // Maximise Air Component
            title: "MAX",
            canClick() { return player[this.layer].air_current < player[this.layer].air_max; },
            onClick() { player[this.layer].air_current = player[this.layer].air_max; }
        },
        21: {   // Minimise Earth Component
            title: "MIN",
            canClick() { return player[this.layer].earth_current > 0; },
            onClick() { player[this.layer].earth_current = 0; }
        },
        22: {   // Decrease Earth Component
            title: "-",
            canClick() { return player[this.layer].earth_current > 0; },
            onClick() { player[this.layer].earth_current -= 1; }
        },
        23: {   // Increase Earth Component
            title: "+",
            canClick() { return player[this.layer].earth_current < player[this.layer].earth_max; },
            onClick() { player[this.layer].earth_current += 1; }
        },
        24: {   // Maximise Earth Component
            title: "MAX",
            canClick() { return player[this.layer].earth_current < player[this.layer].earth_max; },
            onClick() { player[this.layer].earth_current = player[this.layer].earth_max; }
        },
        31: {   // Minimise Fire Component
            title: "MIN",
            canClick() { return player[this.layer].fire_current > 0; },
            onClick() { player[this.layer].fire_current = 0; }
        },
        32: {   // Decrease Fire Component
            title: "-",
            canClick() { return player[this.layer].fire_current > 0; },
            onClick() { player[this.layer].fire_current -= 1; }
        },
        33: {   // Increase Fire Component
            title: "+",
            canClick() { return player[this.layer].fire_current < player[this.layer].fire_max; },
            onClick() { player[this.layer].fire_current += 1; }
        },
        34: {   // Maximise Fire Component
            title: "MAX",
            canClick() { return player[this.layer].fire_current < player[this.layer].fire_max; },
            onClick() { player[this.layer].fire_current = player[this.layer].fire_max; }
        },
        41: {   // Minimise Water Component
            title: "MIN",
            canClick() { return player[this.layer].water_current > 0; },
            onClick() { player[this.layer].water_current = 0; }
        },
        42: {   // Decrease Water Component
            title: "-",
            canClick() { return player[this.layer].water_current > 0; },
            onClick() { player[this.layer].water_current -= 1; }
        },
        43: {   // Increase Water Component
            title: "+",
            canClick() { return player[this.layer].water_current < player[this.layer].water_max; },
            onClick() { player[this.layer].water_current += 1; }
        },
        44: {   // Maximise Water Component
            title: "MAX",
            canClick() { return player[this.layer].water_current < player[this.layer].water_max; },
            onClick() { player[this.layer].water_current = player[this.layer].water_max; }
        },
    },

    update(diff) {

        // Buyable handling

        if(player[this.layer].buyables[11].gt(0)) { //First buyable, "Mount Exosuit"

            if (player.tab != this.layer) { // If player leaves the tab, reset the tasks
                player[this.layer].buyables[11] = new Decimal(0);
                player["p"].is_acting = false;
            } else {    // Decrement buyables
                player[this.layer].buyables[11] = player[this.layer].buyables[11].minus(diff).max(0);
                if (player[this.layer].buyables[11].lte(0)) {   //When completed:
                    player["p"].suit_maintenance_active = true;  // Activate the "true" Neural imprinting layer
                    player["p"].is_acting = false;
                }
            }
        }        
    },

    tabFormat: [
        function() {
            if (player["p"].suit_maintenance_active) // to replace with the unlock condition for "true" SM layer 
            return ["column",[
                ["display-text", "<h2>SUIT MAINTENANCE</h2>"],
                "blank",
                ["display-text","An exosuit sits in the centre of the room. There are tools here to upgrade it...if you have the right components."],
                "blank",
                ["display-text","Power consumption: 0MJ/1000MJ (or something)"],
                "blank",
                "blank",
                "blank",
                // ["display-text","AIR COMPONENT MAYBE"],
                ["row",[
                    ["clickable",11],
                    ["clickable",12],
                    ["bar","aircomponent"],
                    ["clickable",13],
                    ["clickable",14],
                ]],
                "blank",
                // ["display-text","EARTH COMPONENT MAYBE"],
                ["row",[
                    ["clickable",21],
                    ["clickable",22],
                    ["bar","earthcomponent"],
                    ["clickable",23],
                    ["clickable",24],
                ]],
                "blank",
                // ["display-text","FIRE COMPONENT MAYBE"],
                ["row",[
                    ["clickable",31],
                    ["clickable",32],
                    ["bar","firecomponent"],
                    ["clickable",33],
                    ["clickable",34],
                ]],
                "blank",
                // ["display-text","WATER COMPONENT MAYBE"],
                ["row",[
                    ["clickable",41],
                    ["clickable",42],
                    ["bar","watercomponent"],
                    ["clickable",43],
                    ["clickable",44],
                ]],
            ]];
            else // to show when the suit is NOT present. 
            return ["column",[
                ["display-text", "<h2>SECLUDED MOUNTINGS</h2>"],
                "blank",
                ["display-text",`This room appears to be a maintenance bay of some kind. In the centre of the room stands a set of mounting points, for a heavy-duty exosuit, and surrounding it are robotic arms sporting a range of tools, currently lying dormant.
                This was probably a place for quick repairs or loadout changes to maintenance staff's exosuits, but there's no equipment around to maintain right now...`],
                "blank",
                "buyables"
            ]]
        }
    ],

    shouldNotify() {
        return player["p"].sm_suit_position == this.layer && !player["p"].suit_maintenance_active;
    }

})
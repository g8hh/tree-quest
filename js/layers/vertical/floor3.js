//  ####    ##  ##  ######  ##  ##  ######  ####            ##        ##    ####  
//  ##  ##  ##  ##    ##    ##  ##  ##      ##  ##          ##      ##  ##  ##  ##
//  ##  ##  ##  ##    ##    ######  ##      ##  ##          ##      ##  ##  ##  ##
//  ####    ##  ##    ##    ######  ######  ##  ##          ##      ######  ####  
//  ##  ##  ##  ##    ##    ######  ##      ##  ##          ##      ##  ##  ##  ##
//  ##  ##  ##  ##    ##    ##  ##  ##      ##  ##          ##      ##  ##  ##  ##
//  ##  ##    ##    ######  ##  ##  ######  ####            ######  ##  ##  ####  

addLayer("vt3l2", {
    layer: "vt3l2", // This is assigned automatically, both to the layer and all upgrades, etc. Shown here so you know about it
    symbol() {
        if (player[this.layer].visited_ever) return "RL";
        else return "??";
    },
    name: "RUINED LABORATORY", // This is optional, only used in a few places, If absent it just uses the layer id.
    startData() { return {
        unlocked: true,
        points: new Decimal(0),
        best: new Decimal(0),
        total: new Decimal(0),
        buyables: {}, // You don't actually have to initialize this one

        visited_ever: false, // Whether the player has ever been to this layer

    }},

    powerRequirement: 12,

    layerShown() {
        if (player["vt3l1"].visited_ever) return true;
        else if(layers["vt3"].layerShown()) return "ghost";
        else return false;
    },

    branches: ["vt3l1"],

    buyables: {
        11: {
            title() {
                return "Slide the device over the edge";
            },
            cost(x) { // cost for buying xth buyable, can be an object if there are multiple currencies
                return 0
            },
            effect(x) {},
            display() { // Everything else displayed in the buyable button after the title
                displaytext = "(9 seconds)\n\
                Push the large device in the room westwards, over the edge of the hole."

                if(player[this.layer].buyables[this.id].gt(0)) displaytext = displaytext + "\n\
                Time remaining: " + format(player[this.layer].buyables[this.id]) + " seconds."

                return displaytext;
            },

            unlocked() { return !player["p"].lab_device_pushed; },    // This is to change when I've made a variable for the box's current position or whatever

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
                return "Slide the device to Decontamination";
            },
            cost(x) { // cost for buying xth buyable, can be an object if there are multiple currencies
                return 0
            },
            effect(x) { // Effects of owning x of the items, x is a decimal
            },
            display() { // Everything else displayed in the buyable button after the title

                return "The door is jacked up - you cannot fit the device through it.";

            },

            unlocked() { return !player["p"].lab_device_pushed;},    // This is to change when I've made a variable for the box's current position or whatever

            canAfford() {
                return !layerAnyBuyables(this.layer) && false;  // Cannot be slid - in theory never possible to reach this buyable with the door open
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

        // Control locking
        player[this.layer].unlocked = player["vt3l1"].unlocked && (player["mc"].points.gte(this.powerRequirement) || player["p"].pried_door_to_3lab);

        // Set visited flag
        if (player.tab == this.layer && player[this.layer].visited_ever == false) player[this.layer].visited_ever = true;

        // Buyable handling
        if(player[this.layer].buyables[11].gt(0)) {    //First buyable, "Move box to 1F"

            if (player.tab != this.layer) { // If player leaves the tab, reset the tasks
                player[this.layer].buyables[11] = new Decimal(0);
                player["p"].is_acting = false;
            } else {    // Decrement buyables
                player[this.layer].buyables[11] = player[this.layer].buyables[11].minus(diff).max(0);
                if (player[this.layer].buyables[11].lte(0)) {   //When completed:
                    player["p"].lab_device_pushed = true;
                    player["p"].is_acting = false;
                }
            }
        }        

        // No need for second buyable handling - it *should* be impossible to ever activate it

    },

    color() {
        if (player["mc"].points.gte(this.powerRequirement)) return "gold";
        else return "grey";
    },

    tabFormat: [
        ["display-text","<h2>RUINED LABORATORY</h2>"],
        "blank",
        ["display-text",`The Lambda Division laboratory is in ruins. Much of the room no longer exists - there's a huge hole in the floor, and various pieces of equipment dangle uselessly from the ceiling above. What does remain is charred black.
        It looks as though something exploded in this room, quite possibly the same explosion you'd heard on your elevator ride down.<br><br>
        It's nearly impossible to tell what research was being conducted here. Any paper records would have been incinerated. One terminal in the far corner looks to be intact, but you have no way of reaching it across the chasm.`],
        "blank",
        "buyables"
    ],

    tooltip() {
        tip = this.name;
        if (!player[this.layer].visited_ever) tip = tip.replace(/./g,"?");
        if (player["mc"].points.lt(this.powerRequirement)) tip += "<br> (unpowered)";
        return tip;
    }

})

//  ####    ######    ##      ##    ##  ##  ######    ##    ##  ##  ######  ##  ##    ##    ######  ######    ##    ##  ##
//  ##  ##  ##      ##  ##  ##  ##  ##  ##    ##    ##  ##  ######    ##    ##  ##  ##  ##    ##      ##    ##  ##  ##  ##
//  ##  ##  ##      ##      ##  ##  ######    ##    ##  ##  ######    ##    ######  ##  ##    ##      ##    ##  ##  ######
//  ##  ##  ######  ##      ##  ##  ######    ##    ######  ##  ##    ##    ######  ######    ##      ##    ##  ##  ######
//  ##  ##  ##      ##      ##  ##  ######    ##    ##  ##  ##  ##    ##    ######  ##  ##    ##      ##    ##  ##  ######
//  ##  ##  ##      ##  ##  ##  ##  ##  ##    ##    ##  ##  ##  ##    ##    ##  ##  ##  ##    ##      ##    ##  ##  ##  ##
//  ####    ######    ##      ##    ##  ##    ##    ##  ##  ##  ##  ######  ##  ##  ##  ##    ##    ######    ##    ##  ##

addLayer("vt3l1", {
    layer: "vt3l1", // This is assigned automatically, both to the layer and all upgrades, etc. Shown here so you know about it
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

        visited_ever: false, // Whether the player has ever been to this layer

    }},

    powerRequirement: 8,

    layerShown() {
        if (player["vt3"].visited_ever) return true;
        else if(layers["vt3"].layerShown()) return "ghost";
        else return false;
    },

    branches: ["vt3"],

    buyables: {

        11: {
            title() {
                if (!player["p"].tools_owned) return "Steel Doorway";
                if (player["p"].pried_door_to_3lab) {
                    if (player["mc"].points.gte(layers["vt3l2"].powerRequirement)) return "Retrieve Jack";
                    return "Remove the jack from the Laboratory door.";
                }
                return "Pry open the door to Laboratory";
            },
            cost(x) { // cost for buying xth buyable, can be an object if there are multiple currencies
                return 0
            },
            effect(x) { // Effects of owning x of the items, x is a decimal
            },
            display() { // Everything else displayed in the buyable button after the title
                displaytext = "(10 seconds)\n\
                Use the jack to lift the door enough so you can slide under it."

                if (player["p"].pried_door_to_3lab) {
                    displaytext = "(5 seconds)\n\
                Remove the jack, and allow the door to close."

                if (player["mc"].points.gte(layers["vt3l2"].powerRequirement)) displaytext = "(1 second)\n\
                Pick up the jack from the open doorway."
                }

                if(player[this.layer].buyables[this.id].gt(0)) displaytext = displaytext + "\n\
                Time remaining: " + format(player[this.layer].buyables[this.id]) + " seconds."

                if (player["p"].jack_used && !player["p"].pried_door_to_3lab) return "A heavy steel door. Without power you'll need the jack to hold it open."
                if (!player["p"].tools_owned) return "A heavy steel door. Without power it would need to be held open."
                return displaytext
            },
            duration() {
                if (player["p"].pried_door_to_3lab) {
                    if (player["mc"].points.gte(layers["vt3l2"].powerRequirement)) return 1;
                    return 5;
                }
                return 10;
            },
            unlocked() { return player["mc"].points.lt(layers["vt3l2"].powerRequirement) || player["p"].pried_door_to_3lab; },
            canAfford() {
                return !layerAnyBuyables(this.layer) && player["p"].tools_owned && (player["p"].pried_door_to_3lab || !player["p"].jack_used);
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

        },

        12: {
            title() {
                return "Scientists' Lockers";
            },
            cost(x) { // cost for buying xth buyable, can be an object if there are multiple currencies
                return 0
            },
            effect(x) { // Effects of owning x of the items, x is a decimal
            },
            display() { // Everything else displayed in the buyable button after the title
                displaytext = "(6 seconds)\n\
                Search through the lockers and retrieve anything useful."

                if(player[this.layer].buyables[this.id].gt(0)) displaytext = displaytext + "\n\
                Time remaining: " + format(player[this.layer].buyables[this.id]) + " seconds."

                return displaytext
            },
            duration() {
                return 6;
            },
            unlocked() { return !player["p"].crowbar_owned; },
            canAfford() {
                return !layerAnyBuyables(this.layer);
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

        // Control locking
        player[this.layer].unlocked = player["vt3"].unlocked && (player["mc"].points.gte(this.powerRequirement) || player["p"].pried_door_to_3l);

        // Set visited flag
        if (player.tab == this.layer && player[this.layer].visited_ever == false) player[this.layer].visited_ever = true;

        if(player[this.layer].buyables[11].gt(0)) {    //First buyable, "Pry Laboratory Door"

            if (player.tab != this.layer) { // If player leaves the tab, reset the tasks
                player[this.layer].buyables[11] = new Decimal(0);
                player["p"].is_acting = false;
            } else {    // Decrement buyables
                player[this.layer].buyables[11] = player[this.layer].buyables[11].minus(diff).max(0);
                if (player[this.layer].buyables[11].lte(0)) {   //When completed:

                    player["p"].pried_door_to_3lab = !player["p"].pried_door_to_3lab;
                    player["p"].jack_used = !player["p"].jack_used;
                    player["p"].is_acting = false;

                }
            }
        }        

        if(player[this.layer].buyables[12].gt(0)) {    //Second buyable, "Search Lockers"

            if (player.tab != this.layer) { // If player leaves the tab, reset the tasks
                player[this.layer].buyables[12] = new Decimal(0);
                player["p"].is_acting = false;
            } else {    // Decrement buyables
                player[this.layer].buyables[12] = player[this.layer].buyables[12].minus(diff).max(0);
                if (player[this.layer].buyables[12].lte(0)) {   //When completed:
                    player["p"].crowbar_owned = true;
                    doPopup("item","Crowbar");
                    // To add a memo here, maybe?
                    player["p"].is_acting = false;

                }
            }
        }        
    },

    color() {
        if (player["mc"].points.gte(this.powerRequirement)) return "gold";
        else return "grey";
    },

    tabFormat: [
        ["display-text","<h2>DECONTAMINATION</h2>"],
        "blank",
        ["display-text",`The Decontamination room looks much as it did when you arrived. Rows of lockers on either side, and the decontamination units splitting the room in two.
        The units are open, though, allowing you to pass through without cleaning - probably a safety feature invoked in the evacuation.<br><br>
        Unfortunately, locker #44 - as with most of the lockers on the "casual side" - is completely empty. Your flight suit is nowhere to be found.
        Whether the staff took it to your accommodation, wherever that is, or an opportunistic escapee stole it on their way out, is impossible to say.`],
        "blank",
        "buyables"
    ],

    tooltip() {
        tip = this.name;
        if (!player[this.layer].visited_ever) tip = tip.replace(/./g,"?");
        if (player["mc"].points.lt(this.powerRequirement)) tip += "<br> (unpowered)";
        return tip;
    }

})

//  ######    ##  
//  ##      ##  ##
//  ##          ##
//  ######    ##  
//  ##          ##
//  ##      ##  ##
//  ##        ##  

addLayer("vt3", {
    layer: "vt3", // This is assigned automatically, both to the layer and all upgrades, etc. Shown here so you know about it
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

    powerRequirement: 7,   // This number is the amount of average power generation required, to provide power to this node,

    layerShown() {
        if (player["vt2"].visited_ever) return true;
        else return false;
    },

    branches: ["vt2"],

    color() {
        if (player["mc"].points.gte(this.powerRequirement)) return "gold";
        else return "grey";
    },

    buyables: {

        11: {
            title() {
                if (!player["p"].tools_owned) return "Steel Doorway";
                if (player["p"].pried_door_to_3l) {
                    if (player["mc"].points.gte(layers["vt3l1"].powerRequirement)) return "Retrieve Jack";
                    return "Remove the jack from the Decontamination door.";
                }
                return "Pry open the door to Decontamination"
            },
            cost(x) { // cost for buying xth buyable, can be an object if there are multiple currencies
                return 0
            },
            effect(x) { // Effects of owning x of the items, x is a decimal
            },
            display() { // Everything else displayed in the buyable button after the title
                displaytext = "(10 seconds)\n\
                Use the jack to lift the door enough so you can slide under it."

                if (player["p"].pried_door_to_3l) {
                    displaytext = "(5 seconds)\n\
                Remove the jack, and allow the door to close."

                if (player["mc"].points.gte(layers["vt3l1"].powerRequirement)) displaytext = "(1 second)\n\
                Pick up the jack from the open doorway."
                }

                if(player[this.layer].buyables[this.id].gt(0)) displaytext = displaytext + "\n\
                Time remaining: " + format(player[this.layer].buyables[this.id]) + " seconds."

                if (player["p"].jack_used && !player["p"].pried_door_to_3l) return "A heavy steel door. Without power you'll need the jack to hold it open."
                if (!player["p"].tools_owned) return "A heavy steel door. Without power it would need to be held open."
                return displaytext
            },
            duration() {
                if (player["p"].pried_door_to_3l) {
                    if (player["mc"].points.gte(layers["vt3l1"].powerRequirement)) return 1;
                    return 5;
                }
                return 10;
            },
            unlocked() { return player["mc"].points.lt(layers["vt3l1"].powerRequirement) || player["p"].pried_door_to_3l; },
            canAfford() {
                return !layerAnyBuyables(this.layer) && player["p"].tools_owned && (player["p"].pried_door_to_3l || !player["p"].jack_used);
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

        },

        12: {
            title() {
                if (player["mc"].points.gte(layers[this.layer].powerRequirement)) return "SecLock Terminal";
                if (player["p"].third_floor_swipe_status == -1) return "Insufficient Authorisation";
                return "Unpowered Terminal";
            },
            cost(x) { // cost for buying xth buyable, can be an object if there are multiple currencies
                return 0
            },
            effect(x) { // Effects of owning x of the items, x is a decimal
            },
            display() { // Everything else displayed in the buyable button after the title
                displaytext = "(0.5 seconds)\n\
                A SecLock security terminal with a card swipe slot, controlling the door to the passage east of 3F. LEVEL 2 authorisation is required."

                if(player[this.layer].buyables[this.id].gt(0)) displaytext = displaytext + "\n\
                Time remaining: " + format(player[this.layer].buyables[this.id]) + " seconds."

                if (player["p"].third_floor_swipe_status == -1) displaytext = `Your current clearance (LEVEL ${player["p"].seclock}) is insufficient for this terminal (LEVEL 2).`;
                if (!player["p"].id_card) displaytext = "A terminal with a card swipe slot. You'd need an ID card to use it.";
                if (player["mc"].points.lt(layers[this.layer].powerRequirement)) displaytext = "A terminal with a card swipe slot. It's currently unresponsive.";
                 return displaytext;
            },

            unlocked() { return player["p"].third_floor_swipe_status != 1; },    // This is to change when I've made a variable for the box's current position or whatever

            canAfford() {
                return !layerAnyBuyables(this.layer) && player["p"].id_card && player["mc"].points.gte(layers[this.layer].powerRequirement);
            },

            buy() { 
                player[this.layer].buyables[this.id] = new Decimal(0.5)
                player["p"].is_acting = true;
            },
            buyMax() {}, // You'll have to handle this yourself if you want
            style() {
                if(player.points.lte(0)) return {'background-color': buyableLockedColour}
                buyablePct = player[this.layer].buyables[this.id].div(0.5).mul(100)
                if(buyablePct.eq(0)) buyablePct = new Decimal(100)
                if(!this.canAfford() && player[this.layer].buyables[this.id].eq(0)) return {
                    'background-color': buyableLockedColour
                }
                 return {
                    'background': 'linear-gradient(to top, ' + buyableAvailableColour + ' ' + buyablePct + '%, ' + buyableProgressColour + ' ' + buyablePct + '%)'
                }
            }

        },
    },

    update(diff) {

        // Lock/unlock layer
        player[this.layer].unlocked = player["vt2"].unlocked && (player["vt2"].ladder_to_f3 || player["mc"].points.gte(this.powerRequirement));

        // Set visited flag
        if (player.tab == this.layer && player[this.layer].visited_ever == false) player[this.layer].visited_ever = true;

        if(player[this.layer].buyables[11].gt(0)) {    //Second buyable, "Pry 1R Door"

            if (player.tab != this.layer) { // If player leaves the tab, reset the tasks
                player[this.layer].buyables[11] = new Decimal(0);
                player["p"].is_acting = false;
            } else {    // Decrement buyables
                player[this.layer].buyables[11] = player[this.layer].buyables[11].minus(diff).max(0);
                if (player[this.layer].buyables[11].lte(0)) {   //When completed:

                    player["p"].pried_door_to_3l = !player["p"].pried_door_to_3l;
                    player["p"].jack_used = !player["p"].jack_used;
                    player["p"].is_acting = false;

                }
            }
        }        

        if(player[this.layer].buyables[12].gt(0)) {    // Second Buyable, "SecLock Terminal"

            if (player.tab != this.layer) { // If player leaves the tab, reset the tasks
                player[this.layer].buyables[12] = new Decimal(0);
                player["p"].is_acting = false;
            } else {    // Decrement buyables
                player[this.layer].buyables[12] = player[this.layer].buyables[12].minus(diff).max(0);
                if (player[this.layer].buyables[12].lte(0)) {   //When completed:

                    if (player["p"].seclock >= 2) {
                        player["p"].third_floor_swipe_status = 1;
                    } else {
                        player["p"].third_floor_swipe_status = -1;
                    }
                    player["p"].is_acting = false;

                }
            }
        }

        // Reset swipe panel status on leave, if failed
        if (player["p"].third_floor_swipe_status == -1 && player.tab != this.layer) player["p"].third_floor_swipe_status = 0;


    },

    doReset(resettingLayer) {
        // Reset layers on this floor
        for (l of ["vt3l2","vt3l1","vt3","vt3r1","vt3r2"]) {
            layerDataReset(l,["visited_ever"]);
        }
        // Reset the floor above
        // layers["vt4"].doReset("vt3"); // Doesn't exist yet
    },

    tabFormat: [
        ["display-text","<h2>MAIN ELEVATOR (3F)</h2>"],
        "blank",
        ["display-text",function() { 

            if (player["mc"].points.gte(layers[this.layer].powerRequirement)) {    // Text to show if powered on
                text = "The main central elevator for the installation. With the current level of power, ";

                max_floor = 0;
                for (floor of ["vt1","vt2","vt3"]) {
                    if (player["mc"].points.gte(layers[floor].powerRequirement)) max_floor++;
                    else break;
                }
                
                if (max_floor == 0) text += "the elevator cannot move from the basement floor.";
                else text += `the elevator can go as high as ${max_floor}F.`;

                text += "<br><br>There's an emergency hatch on the roof of the elevator, but looking through it, you can see the elevator shaft above is blocked. You won't be able to scale further with the ladder.";

                return text;
            } else {    // Text to show if climbed up to this layer
                text = "You've climbed up the emergency ladder to this floor. The next floor up is out of reach - you'd need to restore more power to the elevator, and ride it higher, to proceed upwards."
                return text;
            }
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
        "buyables"
    ],

    tooltip() {
        tip = this.name;
        if (player["mc"].points.lt(this.powerRequirement)) tip += "<br> (unpowered)";
        return tip;
    }

})

//  ##  ##  ######    ##    ####      ##  
//  ##  ##    ##    ##  ##  ##  ##  ####  
//  ##  ##    ##        ##  ##  ##    ##  
//  ##  ##    ##      ##    ####      ##  
//  ##  ##    ##        ##  ##  ##    ##  
//    ##      ##    ##  ##  ##  ##    ##  
//    ##      ##      ##    ##  ##  ######

addLayer("vt3r1", {
    layer: "vt3r1", // This is assigned automatically, both to the layer and all upgrades, etc. Shown here so you know about it
    symbol() {
        if (player[this.layer].visited_ever) return "3R";
        else return "??";
    },
    name: "FLOOR 03 RIGHT 1", // This is optional, only used in a few places, If absent it just uses the layer id.
    startData() { return {
        unlocked: true,
        points: new Decimal(0),
        best: new Decimal(0),
        total: new Decimal(0),
        buyables: {}, // You don't actually have to initialize this one

        visited_ever: false, // Whether the player has ever been to this layer

    }},

    layerShown() {
        if (player["vt3"].visited_ever) return true;
        else if(layers["vt3"].layerShown()) return "ghost";
        else return false;
    },

    branches: ["vt3"],

    powerRequirement: 66,

    update(diff) {

        // Control locking
        player[this.layer].unlocked = false; // Always locked, until I code SECLOCK 2 etc.
        //        player[this.layer].unlocked = player["mc"].points.gte(this.powerRequirement) || player["vt3"].unlocked;

        // Set visited flag
        if (player.tab == this.layer && player[this.layer].visited_ever == false) player[this.layer].visited_ever = true;

    },

    color() {
        if (player["mc"].points.gte(this.powerRequirement)) return "gold";
        else return "grey";
    },

    tabFormat: [
        ["display-text","FLOOR 03 RIGHT 1"],
        "blank",
        "buyables"
    ],

    tooltip() {
        tip = this.name;
        if (!player[this.layer].visited_ever) tip = tip.replace(/./g,"?");
        if (player["mc"].points.lt(this.powerRequirement)) tip += "<br> (unpowered)";
        return tip;
    }

})

//  ##  ##  ######    ##    ####      ##  
//  ##  ##    ##    ##  ##  ##  ##  ##  ##
//  ##  ##    ##        ##  ##  ##      ##
//  ##  ##    ##      ##    ####      ##  
//  ##  ##    ##        ##  ##  ##  ##    
//    ##      ##    ##  ##  ##  ##  ##    
//    ##      ##      ##    ##  ##  ######

addLayer("vt3r2", {
    layer: "vt3r2", // This is assigned automatically, both to the layer and all upgrades, etc. Shown here so you know about it
    symbol() {
        if (player[this.layer].visited_ever) return "3>";
        else return "??";
    },
    name: "FLOOR 03 RIGHT 2", // This is optional, only used in a few places, If absent it just uses the layer id.
    startData() { return {
        unlocked: true,
        points: new Decimal(0),
        best: new Decimal(0),
        total: new Decimal(0),
        buyables: {}, // You don't actually have to initialize this one

        visited_ever: false, // Whether the player has ever been to this layer

    }},

    layerShown() {
        if (player["vt3r1"].visited_ever) return true;
        else if(layers["vt3"].layerShown()) return "ghost";
        else return false;
    },

    branches: ["vt3r1"],

    powerRequirement: 999,

    update(diff) {

        // Control locking
        player[this.layer].unlocked = false; // Always locked until I code unlock requirements for VT3R1
        //        player[this.layer].unlocked = player["mc"].points.gte(this.powerRequirement) || player["vt3"].unlocked;

        // Set visited flag
        if (player.tab == this.layer && player[this.layer].visited_ever == false) player[this.layer].visited_ever = true;

    },

    color() {
        if (player["mc"].points.gte(this.powerRequirement)) return "gold";
        else return "grey";
    },

    tabFormat: [
        ["display-text","FLOOR 03 RIGHT 2"],
        "blank",
        "buyables"
    ],

    tooltip() {
        tip = this.name;
        if (!player[this.layer].visited_ever) tip = tip.replace(/./g,"?");
        if (player["mc"].points.lt(this.powerRequirement)) tip += "<br> (unpowered)";
        return tip;
    }

})

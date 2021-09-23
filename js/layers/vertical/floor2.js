//  ####    ######    ##    ######  ####    ######  ######    ##    ##  ##
//  ##  ##  ##      ##  ##  ##      ##  ##    ##      ##    ##  ##  ##  ##
//  ##  ##  ##      ##      ##      ##  ##    ##      ##    ##  ##  ######
//  ####    ######  ##      ######  ####      ##      ##    ##  ##  ######
//  ##  ##  ##      ##      ##      ##        ##      ##    ##  ##  ######
//  ##  ##  ##      ##  ##  ##      ##        ##      ##    ##  ##  ##  ##
//  ##  ##  ######    ##    ######  ##        ##    ######    ##    ##  ##

addLayer("vt2l2", {
    layer: "vt2l2", // This is assigned automatically, both to the layer and all upgrades, etc. Shown here so you know about it
    symbol() {
        if (player[this.layer].visited_ever) return "RC";
        else return "??";
    },
    name: "RECEPTION", // This is optional, only used in a few places, If absent it just uses the layer id.
    startData() { return {
        unlocked: true,
        points: new Decimal(0),
        best: new Decimal(0),
        total: new Decimal(0),
        buyables: {}, // You don't actually have to initialize this one

        visited_ever: false, // Whether the player has ever been to this layer

    }},

    powerRequirement: 9,

    layerShown() {
        if (player["vt2l1"].visited_ever) return true;
        else if(layers["vt2"].layerShown()) return "ghost";
        else return false;
    },

    branches: ["vt2l1"],

    buyables: {
        11: {
            title() {
                return "Drop down";
            },
            cost(x) { // cost for buying xth buyable, can be an object if there are multiple currencies
                return 0
            },
            effect(x) {},
            display() { // Everything else displayed in the buyable button after the title
                displaytext = "(2 seconds)\n\
                Drop down the hole in the floor, into the security room."

                if(player[this.layer].buyables[this.id].gt(0)) displaytext = displaytext + "\n\
                Time remaining: " + format(player[this.layer].buyables[this.id]) + " seconds."

                return displaytext;
            },

            unlocked() { return player["p"].lab_device_pushed; },    // This is to change when I've made a variable for the box's current position or whatever

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

        12: {
            title() {
                return "ID Card";
            },
            cost(x) { // cost for buying xth buyable, can be an object if there are multiple currencies
                return 0
            },
            effect(x) {},
            display() { // Everything else displayed in the buyable button after the title
                displaytext = "(2 seconds)\n\
                The ID card you forgot to pick up is lying on the ground, a little dusty but still intact."

                if(player[this.layer].buyables[this.id].gt(0)) displaytext = displaytext + "\n\
                Time remaining: " + format(player[this.layer].buyables[this.id]) + " seconds."

                return displaytext;
            },

            unlocked() { return !player["p"].id_card && !player["p"].lab_device_pushed; },    // This isn't right yet I know

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

    update(diff) {

        // Control locking
        player[this.layer].unlocked =  player["vt2l1"].unlocked && player["p"].l2_door_forced;

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
                    player["p"].dropped_down = true;
                    player["vt1l2"].unlocked = true;
                    showTab("vt1l2");
                    player["p"].is_acting = false;
                }
            }
        }        

        if(player[this.layer].buyables[12].gt(0)) {    //First buyable, "ID Card"

            if (player.tab != this.layer) { // If player leaves the tab, reset the tasks
                player[this.layer].buyables[12] = new Decimal(0);
                player["p"].is_acting = false;
            } else {    // Decrement buyables
                player[this.layer].buyables[12] = player[this.layer].buyables[12].minus(diff).max(0);
                if (player[this.layer].buyables[12].lte(0)) {   //When completed:
                    player["p"].id_card = true;
                    doPopup("item","ID Card");
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
        ["display-text","<h2>FLOOR 02 LEFT 2</h2>"],
        "blank",
        ["display-text",function() {
            text = `The reception is desolate. The lack of the receptionist alone makes the room feel like a different place altogether, but the state of the area seals the deal. There's a gaping hole in place of what was the ceiling, and rubble litters the floor.<br><br>`

            if (player["p"].lab_device_pushed) text += "There's a gaping hole in the floor now, too, thanks to your handiwork. You can see down into the security room from here.";
            else text += "The floor in here looks to be extremely damaged, too. Another solid impact and it might give way entirely."

            return text;
        }],
        "blank",
        "buyables"
    ],

    tooltip() {
        tip = this.name;
        if (!player[this.layer].visited_ever) tip = tip.replace(/./g,"?");
        if (player["mc"].points.lt(this.powerRequirement)) tip += "<br> (unpowered)";
        return tip;
    },

})

//    ##      ##    ####    ####    ######  ####      ##    ####  
//  ##  ##  ##  ##  ##  ##  ##  ##    ##    ##  ##  ##  ##  ##  ##
//  ##      ##  ##  ##  ##  ##  ##    ##    ##  ##  ##  ##  ##  ##
//  ##      ##  ##  ####    ####      ##    ##  ##  ##  ##  ####  
//  ##      ##  ##  ##  ##  ##  ##    ##    ##  ##  ##  ##  ##  ##
//  ##  ##  ##  ##  ##  ##  ##  ##    ##    ##  ##  ##  ##  ##  ##
//    ##      ##    ##  ##  ##  ##  ######  ####      ##    ##  ##

addLayer("vt2l1", {
    layer: "vt2l1", // This is assigned automatically, both to the layer and all upgrades, etc. Shown here so you know about it
    symbol() {
        if (player[this.layer].visited_ever) return "CD";
        else return "??";
    },
    name: "CORRIDOR", // This is optional, only used in a few places, If absent it just uses the layer id.
    startData() { return {
        unlocked: true,
        points: new Decimal(0),
        best: new Decimal(0),
        total: new Decimal(0),
        buyables: {}, // You don't actually have to initialize this one

        visited_ever: false, // Whether the player has ever been to this layer

    }},

    powerRequirement: 6,

    layerShown() {
        if (player["vt2"].visited_ever) return true;
        else if(layers["vt2"].layerShown()) return "ghost";
        else return false;
    },

    branches: ["vt2"],


    buyables: {
        11: {
            title() {
                return "Broken Security Door";
            },
            cost(x) { // cost for buying xth buyable, can be an object if there are multiple currencies
                return 0
            },
            effect(x) { // Effects of owning x of the items, x is a decimal
            },
            display() { // Everything else displayed in the buyable button after the title
                displaytext = "(9 seconds)\n\
                Use the crowbar to force open the broken door."

                if(player[this.layer].buyables[this.id].gt(0)) displaytext = displaytext + "\n\
                Time remaining: " + format(player[this.layer].buyables[this.id]) + " seconds."

                if (!player["p"].crowbar_owned) return "The door is damaged, you can see through it but you'll need force to pull it open.";

                return displaytext;
            },

            unlocked() { return !player["p"].l2_door_forced; },    // This is to change when I've made a variable for the box's current position or whatever

            canAfford() {
                return !layerAnyBuyables(this.layer) && player["p"].crowbar_owned;
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
                return "Damaged Locking Mechanism";
            },
            cost(x) { // cost for buying xth buyable, can be an object if there are multiple currencies
                return 0
            },
            effect(x) { // Effects of owning x of the items, x is a decimal
            },
            display() { // Everything else displayed in the buyable button after the title
                displaytext = "(6 seconds)\n\
                Disassemble the remnants of the lock and retrieve any useful parts."

                if(player[this.layer].buyables[this.id].gt(0)) displaytext = displaytext + "\n\
                Time remaining: " + format(player[this.layer].buyables[this.id]) + " seconds."

                return displaytext;
            },

            unlocked() { return player["p"].l2_door_forced && !player["p"].g1_part_owned; },

            canAfford() {
                return !layerAnyBuyables(this.layer) && player["p"].tools_owned;    // Likely unnecessary but ensure they have the screwdriver
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

        // Control locking
        player[this.layer].unlocked = player["vt2"].unlocked;

        // Set visited flag
        if (player.tab == this.layer && player[this.layer].visited_ever == false) player[this.layer].visited_ever = true;

        // Buyable handling
        if(player[this.layer].buyables[11].gt(0)) {    //First buyable, "Broken Door"

            if (player.tab != this.layer) { // If player leaves the tab, reset the tasks
                player[this.layer].buyables[11] = new Decimal(0);
                player["p"].is_acting = false;
            } else {    // Decrement buyables
                player[this.layer].buyables[11] = player[this.layer].buyables[11].minus(diff).max(0);
                if (player[this.layer].buyables[11].lte(0)) {   //When completed:
                    player["p"].l2_door_forced = true;
                    player["p"].is_acting = false;
                }
            }
        }

        if(player[this.layer].buyables[12].gt(0)) {    //Second buyable, "Disassemble Lock"

            if (player.tab != this.layer) { // If player leaves the tab, reset the tasks
                player[this.layer].buyables[12] = new Decimal(0);
                player["p"].is_acting = false;
            } else {    // Decrement buyables
                player[this.layer].buyables[12] = player[this.layer].buyables[12].minus(diff).max(0);
                if (player[this.layer].buyables[12].lte(0)) {   //When completed:
                    doPopup("item","Electronic Relay");
                    player["p"].g1_part_owned = true;
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
        ["display-text","<h2>CORRIDOR</h2>"],
        "blank",
        ["display-text",`The corridor is about as empty as before. One of the potted plants has been knocked over, in the rush to escape. One of the bathrooms is leaking water out into the hallway.`],
        "blank",
        ["display-text",function() {
            if (player["p"].l2_door_forced) return `A damaged SecLock security door rests against the wall, pried free from the frame.`
            else return `The SecLock door blocks the way - no longer propped open, but considerably bent out of shape.`
        }],
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

//    ##    ######
//  ##  ##  ##    
//      ##  ##    
//    ##    ######
//  ##      ##    
//  ##      ##    
//  ######  ##    

addLayer("vt2", {
    layer: "vt2", // This is assigned automatically, both to the layer and all upgrades, etc. Shown here so you know about it
    symbol: "2F",
    name: "FLOOR 02", // This is optional, only used in a few places, If absent it just uses the layer id.
    startData() { return {
        unlocked: true,
        points: new Decimal(0),
        best: new Decimal(0),
        total: new Decimal(0),
        buyables: {}, // You don't actually have to initialize this one

        visited_ever: false, // Whether the player has ever been to this layer

        ladder_to_f3: false,    // Ladder extended upwards to allow passage to F3

    }},

    powerRequirement: 5,   // This number is the amount of average power generation required, to provide power to this node,

    layerShown() {
        if (player["vt1"].visited_ever) return true;
        else return false;
    },

    branches: ["vt1"],

    color() {
        if (player["mc"].points.gte(this.powerRequirement)) return "gold";
        else return "grey";
    },

    buyables: {
        11: {
            title() {
                return "Climb the shaft to 3F"
            },
            cost(x) { // cost for buying xth buyable, can be an object if there are multiple currencies
                return 0
            },
            effect(x) { // Effects of owning x of the items, x is a decimal
            },
            display() { // Everything else displayed in the buyable button after the title
                displaytext = "(10 seconds)\n\
                Raise the emergency ladder attached to the lift, which you can scale to reach the third floor."

                if(player[this.layer].buyables[this.id].gt(0)) displaytext = displaytext + "\n\
                Time remaining: " + format(player[this.layer].buyables[this.id]) + " seconds."
                if(player["vt1"].ladder_to_f2) return "The emergency ladder has been raised to 3F."
                return displaytext
            },
            unlocked() { return player["mc"].points.gte(layers["vt2"].powerRequirement) && player["mc"].points.lt(layers["vt3"].powerRequirement) },
            canAfford() {
                return !layerAnyBuyables(this.layer) && !player["vt2"].ladder_to_f3;
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
                if(player["vt2"].ladder_to_f3) return {
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

        // Lock/unlock layer
        player[this.layer].unlocked = player["vt1"].unlocked && (player["vt1"].ladder_to_f2 || player["mc"].points.gte(this.powerRequirement))

        // Set visited flag
        if (player.tab == this.layer && player[this.layer].visited_ever == false) player[this.layer].visited_ever = true;

        // Buyable handling
        if(player[this.layer].buyables[11].gt(0)) {    //First buyable, "3F Ladder"

            if (player.tab != this.layer) { // If player leaves the tab, reset the tasks
                player[this.layer].buyables[11] = new Decimal(0);
                player["p"].is_acting = false;
            } else {    // Decrement buyables
                player[this.layer].buyables[11] = player[this.layer].buyables[11].minus(diff).max(0);
                if (player[this.layer].buyables[11].lte(0)) {   //When completed:
                    player[this.layer].ladder_to_f3 = true;
                    showTab("vt3");
                    player["p"].is_acting = false;
                }
            }
        }        

    },

    doReset(resettingLayer) {
        // Reset layers on this floor
        for (l of ["vt2l2","vt2l1","vt2","vt2r1","vt2r2"]) {
            layerDataReset(l,["visited_ever"]);
        }
        // Reset the floor above
        layers["vt3"].doReset("vt2");
    },

    tabFormat: [
        ["display-text","<h2>MAIN ELEVATOR (2F)"],
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

                text += "<br><br>There's an emergency hatch on the roof of the elevator, with a small ladder you can extend upwards from it. It should be high enough to scale one extra floor if need be."

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
            `<h3 style='text-align: right'>\<--2F WEST</h3>
            <p style='text-align: right'>Reception</p>`],
            ["display-text","&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp"],
            ["display-text",
            `<h3 style='text-align: left'>2F EAST--\></h3>
            <p style='text-align: left'>Museum</p>`]
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

//  ######  ##  ##  ######  ####    ##  ##  ##  ##    ##    ##  ##
//  ##      ##  ##    ##    ##  ##  ##  ##  ##  ##  ##  ##  ##  ##
//  ##      ######    ##    ##  ##  ##  ##  ##  ##  ##  ##  ##  ##
//  ######  ######    ##    ####    ##  ##  ##  ##  ######  ##  ##
//  ##      ######    ##    ##  ##    ##    ######  ##  ##    ##  
//  ##      ##  ##    ##    ##  ##    ##    ######  ##  ##    ##  
//  ######  ##  ##    ##    ##  ##    ##    ##  ##  ##  ##    ##  

addLayer("vt2r1", {
    layer: "vt2r1", // This is assigned automatically, both to the layer and all upgrades, etc. Shown here so you know about it
    symbol() {
        if (player[this.layer].visited_ever) return "EW";
        else return "??";
    },
    name: "ENTRYWAY", // This is optional, only used in a few places, If absent it just uses the layer id.
    startData() { return {
        unlocked: true,
        points: new Decimal(0),
        best: new Decimal(0),
        total: new Decimal(0),
        buyables: {}, // You don't actually have to initialize this one

        visited_ever: false, // Whether the player has ever been to this layer

    }},

    layerShown() {
        if (player["vt2"].visited_ever) return true;
        else if(layers["vt2"].layerShown()) return "ghost";
        else return false;
    },

    branches: ["vt2"],

    powerRequirement: 7,

    buyables: {
        11: {
            title() {
                return "Move Exosuit to Elevator";
            },
            cost(x) { // cost for buying xth buyable, can be an object if there are multiple currencies
                return 0
            },
            effect(x) { // Effects of owning x of the items, x is a decimal
            },
            display() { // Everything else displayed in the buyable button after the title
                displaytext = "(9 seconds)\n\
                Drag the exosuit westwards, into the 2F Elevator."

                if(player[this.layer].buyables[this.id].gt(0)) displaytext = displaytext + "\n\
                Time remaining: " + format(player[this.layer].buyables[this.id]) + " seconds."
                return displaytext;
            },

            unlocked() { return player["p"].sm_suit_position == this.layer; },

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
                return "Search Toolbox";
            },
            cost(x) { // cost for buying xth buyable, can be an object if there are multiple currencies
                return 0
            },
            effect(x) { // Effects of owning x of the items, x is a decimal
            },
            display() { // Everything else displayed in the buyable button after the title
                displaytext = "(7 seconds)\n\
                Search the toolbox and take anything useful."

                if(player[this.layer].buyables[this.id].gt(0)) displaytext = displaytext + "\n\
                Time remaining: " + format(player[this.layer].buyables[this.id]) + " seconds."
                return displaytext;
            },

            unlocked() { return !player["p"].tools_owned; },    // This is to change when I've made a variable for the box's current position or whatever

            canAfford() {
                return !layerAnyBuyables(this.layer);
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

        13: {
            title() {
                return "Move Exosuit to Museum";
            },
            cost(x) { // cost for buying xth buyable, can be an object if there are multiple currencies
                return 0
            },
            effect(x) { // Effects of owning x of the items, x is a decimal
            },
            display() { // Everything else displayed in the buyable button after the title
                displaytext = "(9 seconds)\n\
                Drag the exosuit eastwards, into the museum."

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

        // Control locking
        player[this.layer].unlocked = player["vt2"].unlocked;

        // Set visited flag
        if (player.tab == this.layer && player[this.layer].visited_ever == false) player[this.layer].visited_ever = true;

        // Buyable handling
        if(player[this.layer].buyables[11].gt(0)) {    //First Buyable, "Move Exosuit to Elevator"

            if (player.tab != this.layer) { // If player leaves the tab, reset the tasks
                player[this.layer].buyables[11] = new Decimal(0);
                player["p"].is_acting = false;
            } else {    // Decrement buyables
                player[this.layer].buyables[11] = player[this.layer].buyables[11].minus(diff).max(0);
                if (player[this.layer].buyables[11].lte(0)) {   //When completed:
                    player["p"].sm_suit_position = "vtb";
                    showTab("vtb");
                    player["p"].is_acting = false;

                }
            }
        }

        if(player[this.layer].buyables[12].gt(0)) {    //Second buyable, "Search Toolbox"

            if (player.tab != this.layer) { // If player leaves the tab, reset the tasks
                player[this.layer].buyables[12] = new Decimal(0);
                player["p"].is_acting = false;
            } else {    // Decrement buyables
                player[this.layer].buyables[12] = player[this.layer].buyables[12].minus(diff).max(0);
                if (player[this.layer].buyables[12].lte(0)) {   //When completed:
                    player["p"].tools_owned = true;
                    doPopup("item","Handheld Jack");
                    doPopup("item","Screwdriver");
                    player["p"].is_acting = false;

                }
            }
        }

        if(player[this.layer].buyables[13].gt(0)) {    //Third buyable, "Move suit to museum"

            if (player.tab != this.layer) { // If player leaves the tab, reset the tasks
                player[this.layer].buyables[13] = new Decimal(0);
                player["p"].is_acting = false;
            } else {    // Decrement buyables
                player[this.layer].buyables[13] = player[this.layer].buyables[13].minus(diff).max(0);
                if (player[this.layer].buyables[13].lte(0)) {   //When completed:
                    player["p"].sm_suit_position = "vt2r2";
                    showTab("vt2r2");
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
        ["display-text","<h2>ENTRYWAY</h2>"],
        "blank",
        ["display-text",`The corridor leading up to the museum. What would be a quite impressive-looking arch frames the path inside...would be, that is, if it wasn't currently in pieces.
        Scaffolding surrounds what's left of the feature, with tools and the odd hard-hat scattered around the floor. It looks as though this reconstruction had been going on for a while before you arrived.`],
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

//  ##  ##  ##  ##    ##    ######  ##  ##  ##  ##
//  ######  ##  ##  ##  ##  ##      ##  ##  ######
//  ######  ##  ##  ##      ##      ##  ##  ######
//  ##  ##  ##  ##    ##    ######  ##  ##  ##  ##
//  ##  ##  ##  ##      ##  ##      ##  ##  ##  ##
//  ##  ##  ##  ##  ##  ##  ##      ##  ##  ##  ##
//  ##  ##    ##      ##    ######    ##    ##  ##

addLayer("vt2r2", {
    layer: "vt2r2", // This is assigned automatically, both to the layer and all upgrades, etc. Shown here so you know about it
    symbol() {
        if (player[this.layer].visited_ever) return "M";
        else return "??";
    },
    name: "MUSEUM", // This is optional, only used in a few places, If absent it just uses the layer id.
    startData() { return {
        unlocked: true,
        points: new Decimal(0),
        best: new Decimal(0),
        total: new Decimal(0),
        buyables: {}, // You don't actually have to initialize this one

        visited_ever: false, // Whether the player has ever been to this layer

    }},

    layerShown() {
        if (player["vt2r1"].visited_ever) return true;
        else if(layers["vt2"].layerShown()) return "ghost";
        else return false;
    },

    branches: ["vt2r1"],

    powerRequirement: 9,

    update(diff) {

        // Control locking
        player[this.layer].unlocked = player["vt2r1"].unlocked;

        // Set visited flag
        if (player.tab == this.layer && player[this.layer].visited_ever == false) player[this.layer].visited_ever = true;

    },

    buyables: {
        11: {
            title() {
                return "Exosuit Display";
            },
            cost(x) { // cost for buying xth buyable, can be an object if there are multiple currencies
                return 0
            },
            effect(x) { // Effects of owning x of the items, x is a decimal
            },
            display() { // Everything else displayed in the buyable button after the title
                displaytext = "(9 seconds)\n\
                Drag the exosuit westwards, into the next room."

                if(player[this.layer].buyables[this.id].gt(0)) displaytext = displaytext + "\n\
                Time remaining: " + format(player[this.layer].buyables[this.id]) + " seconds."
                if (player["p"].museum_swipe_status != 1) displaytext = "There's a Model #### Exosuit in the centre of the area. Four metal claws are holding it in place.";
                return displaytext;
            },

            unlocked() { return player["p"].sm_suit_position == this.layer; },    // This is to change when I've made a variable for the box's current position or whatever

            canAfford() {
                return !layerAnyBuyables(this.layer) && player["p"].museum_swipe_status == 1;  
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
                if (player["mc"].points.gte(layers[this.layer].powerRequirement)) return "SecLock Terminal";
                if (player["p"].museum_swipe_status == -1) return "Insufficient Authorisation";
                return "Unpowered Terminal";
            },
            cost(x) { // cost for buying xth buyable, can be an object if there are multiple currencies
                return 0
            },
            effect(x) { // Effects of owning x of the items, x is a decimal
            },
            display() { // Everything else displayed in the buyable button after the title
                displaytext = "(0.5 seconds)\n\
                A SecLock security terminal with a card swipe slot, controlling the lock on the displays. LEVEL 1 authorisation is required."

                if(player[this.layer].buyables[this.id].gt(0)) displaytext = displaytext + "\n\
                Time remaining: " + format(player[this.layer].buyables[this.id]) + " seconds."

                if (player["p"].museum_swipe_status == -1) displaytext = `Your current clearance (LEVEL ${player["p"].seclock}) is insufficient for this terminal (LEVEL 1).`;
                if (!player["p"].id_card) displaytext = "A terminal with a card swipe slot. You'd need an ID card to use it.";
                if (player["mc"].points.lt(layers[this.layer].powerRequirement)) displaytext = "A terminal with a card swipe slot. It's currently unresponsive.";
                 return displaytext;
            },

            unlocked() { return player["p"].museum_swipe_status != 1; },    // This is to change when I've made a variable for the box's current position or whatever

            canAfford() {
                return !layerAnyBuyables(this.layer) && player["p"].id_card && player["mc"].points.gte(layers[this.layer].powerRequirement);  // Not written yet
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

        // Control locking
        player[this.layer].unlocked = player["vt2r1"].unlocked;

        // Set visited flag
        if (player.tab == this.layer && player[this.layer].visited_ever == false) player[this.layer].visited_ever = true;

        // Buyable handling
        if(player[this.layer].buyables[11].gt(0)) {    //First buyable, "Move Exosuit"

            if (player.tab != this.layer) { // If player leaves the tab, reset the tasks
                player[this.layer].buyables[11] = new Decimal(0);
                player["p"].is_acting = false;
            } else {    // Decrement buyables
                player[this.layer].buyables[11] = player[this.layer].buyables[11].minus(diff).max(0);
                if (player[this.layer].buyables[11].lte(0)) {   //When completed:
                    player["p"].sm_suit_position = "vt2r1";
                    showTab("vt2r1");
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

                    if (player["p"].seclock >= 1) {
                        player["p"].museum_swipe_status = 1;
                    } else {
                        player["p"].museum_swipe_status = -1;
                    }
                    player["p"].is_acting = false;

                }
            }
        }

        // Reset swipe panel status on leave, if failed
        if (player["p"].museum_swipe_status == -1 && player.tab != this.layer) player["p"].museum_swipe_status = 0;

    },

    color() {
        if (player["mc"].points.gte(this.powerRequirement)) return "gold";
        else return "grey";
    },

    tabFormat: [
        ["display-text","<h2>MUSEUM</h2>"],
        "blank",
        ["display-text",function() {
            text = `This wing touts itself as a museum, a monument to the work done at this facility. Unfortunately it's currently a monument to opportunism - almost every exhibit in the room has been taken. That, or the facility's work revolves around empty, damaged displays. `

            if (player["mc"].points.gte(layers[this.layer].powerRequirement)) text += `The information panels beside the exhibits are powered on, but most simply read "ERROR".`
            else text += `The information panels by the exhibits lie dormant and unpowered.`

            text += `<br><br>`;

            if (player["p"].sm_suit_position == this.layer) {
                text += `The sole remaining exhibit is a rather large Exosuit in the centre of the room.`
                if (player["mc"].points.gte(layers[this.layer].powerRequirement)) text += `Its information panel details the safety benefits of exploring in a metal suit twice your size, but sadly doesn't explain what kind of work such protection would be necessary for.`
            } else text += `The central plinth in the room is most conspicuously empty, now you've removed the Exosuit. The four metal claws have retracted into the base.`
            
            return text;
        }],
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

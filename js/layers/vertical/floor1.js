//    ##    ######    ##    ##  ##  ####    ######  ######  ##  ##
//  ##  ##  ##      ##  ##  ##  ##  ##  ##    ##      ##    ##  ##
//  ##      ##      ##      ##  ##  ##  ##    ##      ##    ##  ##
//    ##    ######  ##      ##  ##  ####      ##      ##      ##  
//      ##  ##      ##      ##  ##  ##  ##    ##      ##      ##  
//  ##  ##  ##      ##  ##  ##  ##  ##  ##    ##      ##      ##  
//    ##    ######    ##      ##    ##  ##  ######    ##      ##  
addLayer("vt1l2", {
    layer: "vt1l2", // This is assigned automatically, both to the layer and all upgrades, etc. Shown here so you know about it

    symbol() {
        if (player[this.layer].visited_ever) return "SR";
        else return "??";
    },

    name: "SECURITY ROOM", // This is optional, only used in a few places, If absent it just uses the layer id.
    startData() { return {
        unlocked: false,
        points: new Decimal(0),
        best: new Decimal(0),
        total: new Decimal(0),
        buyables: {}, // You don't actually have to initialize this one
        visited_ever: false, // Whether the player has ever been to this layer
        seclock_stage: 0,   // Which step of the SecLock bar process currently on, defaults 0
        seclock_code: ["_","_","_","_","_","_","_","_"],    // Array of inputs for SecLock authorisation
        bar_progress: 0 // Progress of the bar filling
    }},

    layerShown() {
        if (player["vt1l1"].visited_ever || player[this.layer].visited_ever) return true;
        else return "ghost";
    },

    branches: ["vt1l1"],

    powerRequirement: 0,    // As the Security Room, it has its own backup power

    color() {
        if (player["mc"].points.gte(this.powerRequirement)) return "gold";
        else return "grey";
    },

    seclock_correct_codes: {
        1: [1,2,3,4,5,6,7,2],
        2: [1,2,3,4,5,6,7,"N"]  // This is unmatchable, intentionally until I add it lmao
    },

    clickables: {

        rows: 4,
        cols: 3,

        "one": {
            title: "1",
            canClick() {
                return player[this.layer].seclock_stage == 2 && player[this.layer].seclock_code[7] == "_";
            },
            onClick() {
                for (index in player[this.layer].seclock_code) {
                    if (player[this.layer].seclock_code[index] == "_") {
                        player[this.layer].seclock_code[index] = 1;
                        break;
                    }
                }
            }
        },
        "two": {
            title: "2",
            canClick() {
                return player[this.layer].seclock_stage == 2 && player[this.layer].seclock_code[7] == "_";
            },
            onClick() {
                for (index in player[this.layer].seclock_code) {
                    if (player[this.layer].seclock_code[index] == "_") {
                        player[this.layer].seclock_code[index] = 2;
                        break;
                    }
                }
            }
        },
        "three": {
            title: "3",
            canClick() {
                return player[this.layer].seclock_stage == 2 && player[this.layer].seclock_code[7] == "_";
            },
            onClick() {
                for (index in player[this.layer].seclock_code) {
                    if (player[this.layer].seclock_code[index] == "_") {
                        player[this.layer].seclock_code[index] = 3;
                        break;
                    }
                }
            }
        },
        "four": {
            title: "4",
            canClick() {
                return player[this.layer].seclock_stage == 2 && player[this.layer].seclock_code[7] == "_";
            },
            onClick() {
                for (index in player[this.layer].seclock_code) {
                    if (player[this.layer].seclock_code[index] == "_") {
                        player[this.layer].seclock_code[index] = 4;
                        break;
                    }
                }
            }
        },
        "five": {
            title: "5",
            canClick() {
                return player[this.layer].seclock_stage == 2 && player[this.layer].seclock_code[7] == "_";
            },
            onClick() {
                for (index in player[this.layer].seclock_code) {
                    if (player[this.layer].seclock_code[index] == "_") {
                        player[this.layer].seclock_code[index] = 5;
                        break;
                    }
                }
            }
        },
        "six": {
            title: "6",
            canClick() {
                return player[this.layer].seclock_stage == 2 && player[this.layer].seclock_code[7] == "_";
            },
            onClick() {
                for (index in player[this.layer].seclock_code) {
                    if (player[this.layer].seclock_code[index] == "_") {
                        player[this.layer].seclock_code[index] = 6;
                        break;
                    }
                }
            }
        },
        "seven": {
            title: "7",
            canClick() {
                return player[this.layer].seclock_stage == 2 && player[this.layer].seclock_code[7] == "_";
            },
            onClick() {
                for (index in player[this.layer].seclock_code) {
                    if (player[this.layer].seclock_code[index] == "_") {
                        player[this.layer].seclock_code[index] = 7;
                        break;
                    }
                }
            }
        },
        "eight": {
            title: "8",
            canClick() {
                return player[this.layer].seclock_stage == 2 && player[this.layer].seclock_code[7] == "_";
            },
            onClick() {
                for (index in player[this.layer].seclock_code) {
                    if (player[this.layer].seclock_code[index] == "_") {
                        player[this.layer].seclock_code[index] = 8;
                        break;
                    }
                }
            }
        },
        "nine": {
            title: "9",
            canClick() {
                return player[this.layer].seclock_stage == 2 && player[this.layer].seclock_code[7] == "_";
            },
            onClick() {
                for (index in player[this.layer].seclock_code) {
                    if (player[this.layer].seclock_code[index] == "_") {
                        player[this.layer].seclock_code[index] = 9;
                        break;
                    }
                }
            }
        },
        "clear": {
            title: "CLR",
            canClick() {
                return (player[this.layer].seclock_stage == 2 && player[this.layer].seclock_code[0] != "_") || player[this.layer].seclock_stage == 4;
            },
            onClick() {
                if (player[this.layer].seclock_stage == 2) {    // Clearing one character - find last non-blank and remove it
                    for (var index = player[this.layer].seclock_code.length - 1; index >= 0; index--) {
                        if (player[this.layer].seclock_code[index] != "_") {
                            player[this.layer].seclock_code[index] = "_";
                            break;
                        }
                    }
                }
                if (player[this.layer].seclock_stage == 4) {    //Clearing all characters after incorrect (return to code entry)
                    player[this.layer].seclock_code = ["_","_","_","_","_","_","_","_"];
                    player[this.layer].seclock_stage = 2;
                }
        }
        },
        "zero": {
            title: "0",
            canClick() {
                return player[this.layer].seclock_stage == 2 && player[this.layer].seclock_code[7] == "_";
            },
            onClick() {
                for (index in player[this.layer].seclock_code) {
                    if (player[this.layer].seclock_code[index] == "_") {
                        player[this.layer].seclock_code[index] = 0;
                        break;
                    }
                }
            }
        },
        "enter": {
            title: "ENT",
            canClick() {
                return player[this.layer].seclock_stage == 2 && player[this.layer].seclock_code[7] != "_";
            },
            onClick() {
                player[this.layer].seclock_stage = 3;
                player[this.layer].bar_progress = 0;
            }
        },
        "swipe": {
            title: "S<br>W<br>I<br>P<br>E",
            style: {"height": "160px"},
            canClick() {
                return player["p"].id_card && (player[this.layer].seclock_stage == 0 || player[this.layer].seclock_stage == 5);
            },
            onClick() {
                player[this.layer].seclock_code = ["_","_","_","_","_","_","_","_"];    // In case it needs clearing down e.g. after stage 5
                player[this.layer].seclock_stage = 1;
                player[this.layer].bar_progress = 0;
            }
        }

    },

    bars: {
        securitybar: {
            direction: RIGHT,
            width: 400,
            height: 50,
            progress() { 
                switch(player[this.layer].seclock_stage) {
                    case 1:
                        return player[this.layer].bar_progress;
                    case 3:
                        return player[this.layer].bar_progress / 5;
                    default:
                        return 0;
                }


             },
            fillStyle: { 'background-color': 'darkgoldenrod' },

            display() {
                switch(player[this.layer].seclock_stage) {
                    case 0: // Initial when entering layer
                        text = "SecLock Security Uplift system online.<br>Please swipe an access card to begin.";
                        break;
                    case 1: // After hitting SWIPE
                        text = "Analysing...";
                        break;
                    case 2: // After SWIPE Analysing "load"
                        text = `Current authorisation: LEVEL ${player["p"].seclock}<br>LEVEL ${player["p"].seclock + 1} authorisation code:`;

                        for (char of player[this.layer].seclock_code) text += ` ${char}`;                        

                        break;
                    case 3: // After entering code
                        text = "Checking...";
                        break;
                    case 4: // After incorrect code "checked"
                        text = "Authorisation code <span style='color: red'>INVALID</span><br>Please press CLR to try again.";
                        break;
                    case 5: // After correct code checked
                        text = `Authorisation code <span style='color: green'>VALID</span><br>Your clearance is now LEVEL ${player["p"].seclock}`;
                        break;
                }
                return text;
//                return "Current SecLock authorisation: LEVEL 0<br>LEVEL 1 authorisation code: _ _ _ _ _ _ _ _"
            }
        },
    },

    buyables: {
        11: {
            title() {
                return "Wrecked Device";
            },
            cost(x) { // cost for buying xth buyable, can be an object if there are multiple currencies
                return 0
            },
            effect(x) { // Effects of owning x of the items, x is a decimal
            },
            display() { // Everything else displayed in the buyable button after the title
                displaytext = "(6 seconds)\n\
                Salvage parts from the now-useless device you dropped through the ceiling."

                if(player[this.layer].buyables[this.id].gt(0)) displaytext = displaytext + "\n\
                Time remaining: " + format(player[this.layer].buyables[this.id]) + " seconds."
                return displaytext;
            },

            unlocked() { return !player["p"].g5_part_owned; },    // This is to change when I've made a variable for the box's current position or whatever

            canAfford() {
                return !layerAnyBuyables(this.layer);
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

        12: {
            title() {
                if (player["p"].security_swipe_status == -1) return "Insufficient Authorisation";
                return "SecLock Terminal";
            },
            cost(x) { // cost for buying xth buyable, can be an object if there are multiple currencies
                return 0
            },
            effect(x) { // Effects of owning x of the items, x is a decimal
            },
            display() { // Everything else displayed in the buyable button after the title
                displaytext = "(0.5 seconds)\n\
                A SecLock security terminal with a card swipe slot, controlling the door to the Security Room. LEVEL 1 authorisation is required."

                if(player[this.layer].buyables[this.id].gt(0)) displaytext = displaytext + "\n\
                Time remaining: " + format(player[this.layer].buyables[this.id]) + " seconds."

                if (!player["p"].id_card) displaytext = "A terminal with a card swipe slot. You'd need an ID card to use it.";
                if (player["p"].security_swipe_status == -1) displaytext = `Your current clearance (LEVEL ${player["p"].seclock}) is insufficient for this terminal (LEVEL 1).`;
                 return displaytext;
            },

            unlocked() { return player["p"].security_swipe_status != 1; },    // This is to change when I've made a variable for the box's current position or whatever

            canAfford() {
                return !layerAnyBuyables(this.layer) && player["p"].id_card;
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

        13: {
            title() {
                return "ID Card";
            },
            cost(x) { // cost for buying xth buyable, can be an object if there are multiple currencies
                return 0
            },
            effect(x) {},
            display() { // Everything else displayed in the buyable button after the title
                displaytext = "(2 seconds)\n\
                The ID card you forgot - it's fallen through the hole in the floor, from Reception."

                if(player[this.layer].buyables[this.id].gt(0)) displaytext = displaytext + "\n\
                Time remaining: " + format(player[this.layer].buyables[this.id]) + " seconds."

                return displaytext;
            },

            unlocked() { return !player["p"].id_card },    // This isn't right yet I know

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

        // SecLock system handling
        if (player[this.layer].seclock_stage != 0 && player.tab != this.layer) player[this.layer].seclock_stage = 0;

        if (player[this.layer].seclock_stage == 1) {    // Bar animation after swiping
            player[this.layer].bar_progress += diff;
            if (player[this.layer].bar_progress >= 1) player[this.layer].seclock_stage = 2;    // Go to code entry
        }

        if (player[this.layer].seclock_stage == 3) {    // Checking code
            player[this.layer].bar_progress += diff;
            if (player[this.layer].bar_progress >= 5) {
                player_code = "";
                correct_code = "";

                for (i=0;i < this.seclock_correct_codes[player["p"].seclock + 1].length;i++) {
                    player_code += player[this.layer].seclock_code[i];
                    correct_code += this.seclock_correct_codes[player["p"].seclock + 1][i];
                }

                console.log (player_code + " " + correct_code);

                if (player_code == correct_code) {   // If code correct (slice to remove the vue listener)
                    player["p"].seclock += 1;
                    player[this.layer].seclock_stage = 5;
                } else {    // If not correct...
                    player[this.layer].seclock_stage = 4;
                }
            }
        }

        // Lock status handling
        player[this.layer].unlocked = ((player["p"].dropped_down && player["p"].security_swipe_status != 1) || player["p"].security_swipe_status == 1 && player["vt1l1"].unlocked)

        // Set visited flag
        if (player.tab == this.layer && player[this.layer].visited_ever == false) player[this.layer].visited_ever = true;

        // Buyable handling
        if(player[this.layer].buyables[11].gt(0)) {    //First buyable, "Wrecked Device"

            if (player.tab != this.layer) { // If player leaves the tab, reset the tasks
                player[this.layer].buyables[11] = new Decimal(0);
                player["p"].is_acting = false;
            } else {    // Decrement buyables
                player[this.layer].buyables[11] = player[this.layer].buyables[11].minus(diff).max(0);
                if (player[this.layer].buyables[11].lte(0)) {   //When completed:
                    player["p"].g5_part_owned = true;
                    doPopup("item","Voltage Regulator");
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

                    if (player["p"].seclock >= 1) { // If somehow succeeded, this should be impossible to hit but just in case
                        player["p"].security_swipe_status = 1;
                    } else {
                        player["p"].security_swipe_status = -1;
                    }
                    player["p"].is_acting = false;

                }
            }
        }

        if(player[this.layer].buyables[13].gt(0)) {    //Third buyable, "ID Card"

            if (player.tab != this.layer) { // If player leaves the tab, reset the tasks
                player[this.layer].buyables[13] = new Decimal(0);
                player["p"].is_acting = false;
            } else {    // Decrement buyables
                player[this.layer].buyables[13] = player[this.layer].buyables[13].minus(diff).max(0);
                if (player[this.layer].buyables[13].lte(0)) {   //When completed:
                    player["p"].id_card = true;
                    doPopup("item","ID Card");
                    player["p"].is_acting = false;
                }
            }
        }        


    },

    tabFormat: [
        ["display-text","<h2>SECURITY ROOM</h2>"],
        "blank",
        ["display-text",function() {

        text = `The security centre for the installation. Looks like ordinarily four or five employees would be stationed here. One wall is completely covered with monitors - CCTV, perhaps? - but there's nothing on any of the screens, and the controls nearby seem totally unresponsive.<br><br>
        The one thing that does seem to still function is a sturdy metal terminal with "SecLock" emblazoned down the side of it. A panel on the front allows you to swipe a card and enter a code. The screen blinks incessantly, waiting for some input.`
        
        if (player["p"].seclock == 0) text += `<br><br>A sticky note attached to the back of the terminal has a series of crossed-out numbers on it, followed by '12345672' Presumably a password of some sort?`;

        return text;

        }],
        "blank",
        "buyables",
        "blank",
        ["bar","securitybar"],
        "blank",
        ["row",[
            ["column",[
                ["clickable","one"],
                ["clickable","four"],
                ["clickable","seven"],
                ["clickable","clear"]
            ]],
            ["column",[
                ["clickable","two"],
                ["clickable","five"],
                ["clickable","eight"],
                ["clickable","zero"]
            ]],
            ["column",[
                ["clickable","three"],
                ["clickable","six"],
                ["clickable","nine"],
                ["clickable","enter"]
            ]],
            ["clickable","swipe"]
        ]]

    ],

    tooltip() {
        tip = this.name;
        if (!player[this.layer].visited_ever) tip = tip.replace(/./g,"?");
        if (player["mc"].points.lt(this.powerRequirement)) tip += "<br> (unpowered)";
        return tip;
    },
    lockedTooltip() {
        return this.tooltip();
    }

})

//  ##  ##  ######    ##    ######  ######  ####    ##  ##  ##      ######
//  ##  ##  ##      ##  ##    ##      ##    ##  ##  ##  ##  ##      ##    
//  ##  ##  ##      ##        ##      ##    ##  ##  ##  ##  ##      ##    
//  ##  ##  ######    ##      ##      ##    ####    ##  ##  ##      ######
//  ##  ##  ##          ##    ##      ##    ##  ##  ##  ##  ##      ##    
//    ##    ##      ##  ##    ##      ##    ##  ##  ##  ##  ##      ##    
//    ##    ######    ##      ##    ######  ####      ##    ######  ######

addLayer("vt1l1", {
    layer: "vt1l1", // This is assigned automatically, both to the layer and all upgrades, etc. Shown here so you know about it

    symbol() {
        if (player[this.layer].visited_ever) return "VB";
        else return "??";
    },

    name: "VESTIBULE", // This is optional, only used in a few places, If absent it just uses the layer id.
    startData() { return {
        unlocked: true,
        points: new Decimal(0),
        best: new Decimal(0),
        total: new Decimal(0),
        buyables: {}, // You don't actually have to initialize this one

        visited_ever: false, // Whether the player has ever been to this layer

    }},

    layerShown() {
        if (player["vt1"].visited_ever) return true;
        else return "ghost";
    },

    branches: ["vt1"],

    powerRequirement: 2,

    buyables: {
        11: {
            title() {
                return "Damaged Fan";
            },
            cost(x) { // cost for buying xth buyable, can be an object if there are multiple currencies
                return 0
            },
            effect(x) { // Effects of owning x of the items, x is a decimal
            },
            display() { // Everything else displayed in the buyable button after the title
                displaytext = "(2 seconds)\n\
                An upright fan that's seen better days. You should be able to salvage the rotary motor from it."

                if(player[this.layer].buyables[this.id].gt(0)) displaytext = displaytext + "\n\
                Time remaining: " + format(player[this.layer].buyables[this.id]) + " seconds."
                return displaytext;
            },

            unlocked() { return !player["p"].g6_part_owned; },

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
                if (player["mc"].points.gte(layers[this.layer].powerRequirement)) return "SecLock Terminal";
                if (player[this.layer].card_swipe_status == -1) return "Insufficient Authorisation";
                return "Unpowered Terminal";
            },
            cost(x) { // cost for buying xth buyable, can be an object if there are multiple currencies
                return 0
            },
            effect(x) { // Effects of owning x of the items, x is a decimal
            },
            display() { // Everything else displayed in the buyable button after the title
                displaytext = "(0.5 seconds)\n\
                A SecLock security terminal with a card swipe slot, controlling the door to the Security Room. LEVEL 1 authorisation is required."

                if(player[this.layer].buyables[this.id].gt(0)) displaytext = displaytext + "\n\
                Time remaining: " + format(player[this.layer].buyables[this.id]) + " seconds."

                if (player[this.layer].card_swipe_status == -1) displaytext = `Your current clearance (LEVEL ${player["p"].seclock}) is insufficient for this terminal (LEVEL 1).`;
                if (!player["p"].id_card) displaytext = "A terminal with a card swipe slot. You'd need an ID card to use it.";
                if (player["mc"].points.lt(layers[this.layer].powerRequirement)) displaytext = "A terminal with a card swipe slot. It's currently unresponsive.";
                 return displaytext;
            },

            unlocked() { return player["p"].security_swipe_status != 1; },

            canAfford() {
                return !layerAnyBuyables(this.layer) && player["mc"].points.gte(player[this.layer].powerRequirement) && player["p"].id_card;
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
        player[this.layer].unlocked = player["vt1"].unlocked;

        // Set visited flag
        if (player.tab == this.layer && player[this.layer].visited_ever == false) player[this.layer].visited_ever = true;

        // Buyable handling
        if(player[this.layer].buyables[11].gt(0)) {    //First buyable, "Search Toolbox"

            if (player.tab != this.layer) { // If player leaves the tab, reset the tasks
                player[this.layer].buyables[11] = new Decimal(0);
                player["p"].is_acting = false;
            } else {    // Decrement buyables
                player[this.layer].buyables[11] = player[this.layer].buyables[11].minus(diff).max(0);
                if (player[this.layer].buyables[11].lte(0)) {   //When completed:
                    player["p"].g6_part_owned = true;
                    doPopup("item","Rotary Motor");
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

                    if (player["p"].seclock >= 1) { // If somehow succeeded, this should be impossible to hit but just in case
                        player["p"].security_swipe_status = 1;
                    } else {
                        player[this.layer].card_swipe_status = -1;
                    }
                    player["p"].is_acting = false;

                }
            }
        }

        // Reset swipe panel status on leave - if my game logic is correct this swipe should be impossible to succeed at
        if (player["p"].museum_swipe_status == -1 && player.tab != this.layer) player[this.layer].card_swipe_status = 0;


    },


    color() {
        if (player["mc"].points.gte(this.powerRequirement)) return "gold";
        else return "grey";
    },

    tabFormat: [
        ["display-text","<h2>VESTIBULE</h2>"],
        "blank",
        ["display-text",function() {
            text = `The signposts for Security lead to this room - what appears to be a waiting room outside the security office proper, perhaps to keep visitors from seeing sensitive information?
            There's little outside, but a few chairs and a damaged upright fan.`;
            if (player["p"].security_swipe_status != 1) text += "<br><br>An imposing door, clearly branded SECLOCK, blocks entry into the office itself. It's locked tightly and won't budge."
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
    lockedTooltip() {
        return this.tooltip();
    }

})

//    ##    ######
//  ####    ##    
//    ##    ##    
//    ##    ######
//    ##    ##    
//    ##    ##    
//  ######  ##    

addLayer("vt1", {
    layer: "vt1", // This is assigned automatically, both to the layer and all upgrades, etc. Shown here so you know about it
    symbol: "1F",
    name: "FLOOR 01", // This is optional, only used in a few places, If absent it just uses the layer id.
    startData() { return {
        unlocked: true,
        points: new Decimal(0),
        best: new Decimal(0),
        total: new Decimal(0),
        buyables: {}, // You don't actually have to initialize this one

        visited_ever: false, // Whether the player has ever been to this layer

        ladder_to_f2: false,    // Ladder extended upwards to allow passage to F2

    }},

    branches: ["vtb"],

    powerRequirement: 3,   // This number is the amount of average power generation required, to provide power to this node,

    color() {
        if (player["mc"].points.gte(this.powerRequirement)) return "gold";
        else return "grey";
    },

    buyables: {
        11: {
            title() {
                return "Climb the shaft to 2F"
            },
            cost(x) { // cost for buying xth buyable, can be an object if there are multiple currencies
                return 0
            },
            effect(x) { // Effects of owning x of the items, x is a decimal
            },
            display() { // Everything else displayed in the buyable button after the title
                displaytext = "(10 seconds)\n\
                Raise the emergency ladder attached to the lift, which you can scale to reach the second floor."

                if(player[this.layer].buyables[this.id].gt(0)) displaytext = displaytext + "\n\
                Time remaining: " + format(player[this.layer].buyables[this.id]) + " seconds."
                if(player["vt1"].ladder_to_f2) return "The emergency ladder has been raised to 2F."
                return displaytext
            },
            unlocked() { return player["mc"].points.gte(layers["vt1"].powerRequirement) && player["mc"].points.lt(layers["vt2"].powerRequirement) },
            canAfford() {
                return !layerAnyBuyables(this.layer) && !player["vt1"].ladder_to_f2;
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
                if(player["vt1"].ladder_to_f2) return {
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
                if (!player["p"].tools_owned) return "Steel Doorway";
                if (player["p"].pried_door_to_1r) {
                    if (player["mc"].points.gte(layers["vt1r1"].powerRequirement)) return "Retrieve Jack";
                    return "Remove the jack from the 1R door.";
                }
                return "Pry open the door to 1R"
            },
            cost(x) { // cost for buying xth buyable, can be an object if there are multiple currencies
                return 0
            },
            effect(x) { // Effects of owning x of the items, x is a decimal
            },
            display() { // Everything else displayed in the buyable button after the title
                displaytext = "(10 seconds)\n\
                Use the jack to lift the door enough so you can slide under it."

                if (player["p"].pried_door_to_1r) {
                    displaytext = "(5 seconds)\n\
                Remove the jack, and allow the door to close."

                if (player["mc"].points.gte(layers["vt1r1"].powerRequirement)) displaytext = "(1 second)\n\
                Pick up the jack from the open doorway."
                }

                if(player[this.layer].buyables[this.id].gt(0)) displaytext = displaytext + "\n\
                Time remaining: " + format(player[this.layer].buyables[this.id]) + " seconds."

                if (player["p"].jack_used && !player["p"].pried_door_to_1r) return "A heavy steel door. Without power you'll need the jack to hold it open."
                if (!player["p"].tools_owned) return "A heavy steel door. Without power it would need to be held open."
                return displaytext
            },
            duration() {
                if (player["p"].pried_door_to_1r) {
                    if (player["mc"].points.gte(layers["vt1r1"].powerRequirement)) return 1;
                    return 5;
                }
                return 10;
            },
            unlocked() { return player["mc"].points.lt(layers["vt1r1"].powerRequirement) || player["p"].pried_door_to_1r },
            canAfford() {
                return !layerAnyBuyables(this.layer) && player["p"].tools_owned && (player["p"].pried_door_to_1r || !player["p"].jack_used);
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

        // Lock/unlock layer
        if (player["vtb"].unlocked && (player["vtb"].ladder_to_f1 || player["mc"].points.gte(this.powerRequirement))) player[this.layer].unlocked = true;
        else player[this.layer].unlocked = false;

        // Lock the tree if the weight limit is met in the elevator
        if ((player["p"].ni_box_position == "vtb")) player[this.layer].unlocked = false;
        if ((player["p"].sm_suit_position == "vtb")) player[this.layer].unlocked = false;


        // Set visited flag
        if (player.tab == this.layer && player[this.layer].visited_ever == false) player[this.layer].visited_ever = true;

        // Buyable handling
        if(player[this.layer].buyables[11].gt(0)) {    //First buyable, "1F Ladder"

            if (player.tab != this.layer) { // If player leaves the tab, reset the tasks
                player[this.layer].buyables[11] = new Decimal(0);
                player["p"].is_acting = false;
            } else {    // Decrement buyables
                player[this.layer].buyables[11] = player[this.layer].buyables[11].minus(diff).max(0);
                if (player[this.layer].buyables[11].lte(0)) {   //When completed:
                    player[this.layer].ladder_to_f2 = true;
                    showTab("vt2");
                    player["p"].is_acting = false;
                }
            }
        }        

        if(player[this.layer].buyables[12].gt(0)) {    //Second buyable, "Pry 1R Door"

            if (player.tab != this.layer) { // If player leaves the tab, reset the tasks
                player[this.layer].buyables[12] = new Decimal(0);
                player["p"].is_acting = false;
            } else {    // Decrement buyables
                player[this.layer].buyables[12] = player[this.layer].buyables[12].minus(diff).max(0);
                if (player[this.layer].buyables[12].lte(0)) {   //When completed:

                    player["p"].pried_door_to_1r = !player["p"].pried_door_to_1r;
                    player["p"].jack_used = !player["p"].jack_used;
                    player["p"].is_acting = false;

                }
            }
        }        

    },

    doReset(resettingLayer) {
        // Reset layers on this floor
        for (l of ["vt1l2","vt1l1","vt1","vt1r1","vt1r2"]) {
            layerDataReset(l,["visited_ever"]);
        }
        // Reset the floor above
        layers["vt2"].doReset("vt1");
    },

    tabFormat: [
        ["display-text","<h2>MAIN ELEVATOR (1F)"],
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
            `<h3 style='text-align: right'>\<--1F WEST</h3>
            <p style='text-align: right'>Security</p>`],
            ["display-text","&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp"],
            ["display-text",
            `<h3 style='text-align: left'>1F EAST--\></h3>
            <p style='text-align: left'>Post Room</p>`]
        ]],
        "blank",
        ["display-text", function() {
            text = "";
            text += "The doorway to the west is open. ";
            text += "A steel door blocks off the route to the right, ";
            if (player["mc"].points.gte(player["vt1r1"].powerRequirement)) text += "but it can be lifted trivially with the control panel beside it.";
            else text += "and the connected control panel has no power. The door is too heavy to lift unaided."
        }],
        "blank",
        "buyables"
    ],

    tooltip() {
        tip = this.name;
        if (player["mc"].points.lt(this.powerRequirement)) tip += "<br> (unpowered)";
        return tip;
    },
    tooltipLocked() {
        return this.tooltip();
    },
})

//  ####      ##      ##    ######          ####      ##      ##    ##  ##
//  ##  ##  ##  ##  ##  ##    ##            ##  ##  ##  ##  ##  ##  ######
//  ##  ##  ##  ##  ##        ##            ##  ##  ##  ##  ##  ##  ######
//  ####    ##  ##    ##      ##            ####    ##  ##  ##  ##  ##  ##
//  ##      ##  ##      ##    ##            ##  ##  ##  ##  ##  ##  ##  ##
//  ##      ##  ##  ##  ##    ##            ##  ##  ##  ##  ##  ##  ##  ##
//  ##        ##      ##      ##            ##  ##    ##      ##    ##  ##

addLayer("vt1r1", {
    layer: "vt1r1", // This is assigned automatically, both to the layer and all upgrades, etc. Shown here so you know about it

    symbol() {
        if (player[this.layer].visited_ever) return "PR";
        else return "??";
    },

    name: "POST ROOM", // This is optional, only used in a few places, If absent it just uses the layer id.
    startData() { return {
        unlocked: true,
        points: new Decimal(0),
        best: new Decimal(0),
        total: new Decimal(0),
        buyables: {}, // You don't actually have to initialize this one

        visited_ever: false, // Whether the player has ever been to this layer

    }},

    layerShown() {
        if (player["vt1"].visited_ever) return true;
        else return "ghost";
    },

    branches: ["vt1"],

    powerRequirement: 4,

    buyables: {
        11: {
            title() {
                return "Slide the big crate to the elevator";
            },
            cost(x) { // cost for buying xth buyable, can be an object if there are multiple currencies
                return 0
            },
            effect(x) {},
            display() { // Everything else displayed in the buyable button after the title
                displaytext = "(9 seconds)\n\
                Push the large crate in the room westwards, into the elevator."

                if(player[this.layer].buyables[this.id].gt(0)) displaytext = displaytext + "\n\
                Time remaining: " + format(player[this.layer].buyables[this.id]) + " seconds."

                if(player["mc"].points.lt(layers[this.layer].powerRequirement)) return "The door is only jacked up enough for you to slip through. The box is far too large to fit.";
                return displaytext;
            },

            unlocked() { return player["p"].ni_box_position == this.layer; },    // This is to change when I've made a variable for the box's current position or whatever

            canAfford() {
                return !layerAnyBuyables(this.layer) && player["mc"].points.gte(layers[this.layer].powerRequirement);
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
                if (player["vt1r2"].visited_ever) return "Slide the big crate to Post Storage";
                return "Slide the big crate to the next room";
            },
            cost(x) { // cost for buying xth buyable, can be an object if there are multiple currencies
                return 0
            },
            effect(x) { // Effects of owning x of the items, x is a decimal
            },
            display() { // Everything else displayed in the buyable button after the title
                displaytext = "(9 seconds)\n\
                Push the large crate in the room eastwards, into the next room."

                if(player[this.layer].buyables[this.id].gt(0)) displaytext = displaytext + "\n\
                Time remaining: " + format(player[this.layer].buyables[this.id]) + " seconds."

                if (!player["vt1r2"].unlocked) return "The security door to 1> is locked. The box cannot be moved that way.";

                return displaytext;
            },

            unlocked() { return player["p"].ni_box_position == this.layer;},    // This is to change when I've made a variable for the box's current position or whatever

            canAfford() {
                return !layerAnyBuyables(this.layer) && player["vt1r2"].unlocked;
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
        player[this.layer].unlocked = player["vt1"].unlocked && (player["mc"].points.gte(this.powerRequirement) || player["p"].pried_door_to_1r);

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
                    player["p"].ni_box_position = "vtb";
                    showTab("vtb");
                    player["p"].is_acting = false;
                }
            }
        }        

        if(player[this.layer].buyables[12].gt(0)) {    //Second buyable, "Move box to 1>"

            if (player.tab != this.layer) { // If player leaves the tab, reset the tasks
                player[this.layer].buyables[12] = new Decimal(0);
                player["p"].is_acting = false;
            } else {    // Decrement buyables
                player[this.layer].buyables[12] = player[this.layer].buyables[12].minus(diff).max(0);
                if (player[this.layer].buyables[12].lte(0)) {   //When completed:
                    player["p"].ni_box_position = "vt1r2";
                    showTab("vt1r2");
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
        ["display-text","<h2>POST ROOM</h2>"],
        "blank",
        ["display-text",function() {
            
            text = `The first room off the eastern corridor looks to be a depot for post. The incoming pile has a few items of junk mail, all addressed to the building. The outgoing pile is empty.
            An inspection of the room doesn't reveal any useful documentation - no manifests, or shipping logs, or even delivery or pickup schedules.`;
            
            if (player["mc"].points.gte(layers["vt1l2"].powerRequirement)) text += `<br><br>An audible sparking can be heard from the next room - the flooded floor is electrified, and unsafe to walk through whilst the power is on.`;
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
    lockedTooltip() {
        return this.tooltip();
    }

})

//  ####      ##      ##    ######            ##    ######    ##    ####      ##      ##    ######
//  ##  ##  ##  ##  ##  ##    ##            ##  ##    ##    ##  ##  ##  ##  ##  ##  ##  ##  ##    
//  ##  ##  ##  ##  ##        ##            ##        ##    ##  ##  ##  ##  ##  ##  ##      ##    
//  ####    ##  ##    ##      ##              ##      ##    ##  ##  ####    ######  ##  ##  ######
//  ##      ##  ##      ##    ##                ##    ##    ##  ##  ##  ##  ##  ##  ##  ##  ##    
//  ##      ##  ##  ##  ##    ##            ##  ##    ##    ##  ##  ##  ##  ##  ##  ##  ##  ##    
//  ##        ##      ##      ##              ##      ##      ##    ##  ##  ##  ##    ##    ######

addLayer("vt1r2", {
    layer: "vt1r2", // This is assigned automatically, both to the layer and all upgrades, etc. Shown here so you know about it

    symbol() {
        if (player[this.layer].visited_ever) return "PS";
        else return "??";
    },

    name: "POST STORAGE", // This is optional, only used in a few places, If absent it just uses the layer id.
    startData() { return {
        unlocked: true,
        points: new Decimal(0),
        best: new Decimal(0),
        total: new Decimal(0),
        buyables: {}, // You don't actually have to initialize this one

        visited_ever: false, // Whether the player has ever been to this layer

    }},

    layerShown() {
        if (player["vt1r1"].visited_ever) return true;
        else return "ghost";
    },

    branches: ["vt1r1"],

    powerRequirement: 5,

    buyables: {
        11: {
            title() {
                return "Slide the big crate to the Post Room";
            },
            cost(x) { // cost for buying xth buyable, can be an object if there are multiple currencies
                return 0
            },
            effect(x) { // Effects of owning x of the items, x is a decimal
            },
            display() { // Everything else displayed in the buyable button after the title
                displaytext = "(9 seconds)\n\
                Push the large crate in the room westwards, into the next room."

                if(player[this.layer].buyables[this.id].gt(0)) displaytext = displaytext + "\n\
                Time remaining: " + format(player[this.layer].buyables[this.id]) + " seconds."
                return displaytext;
            },

            unlocked() { return player["p"].ni_box_position == this.layer; },    // This is to change when I've made a variable for the box's current position or whatever

            canAfford() {
                return !layerAnyBuyables(this.layer) && !player["mc"].points.lt(player[this.layer].powerRequirement);
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
                return "Broken Air Conditioner";
            },
            cost(x) { // cost for buying xth buyable, can be an object if there are multiple currencies
                return 0
            },
            effect(x) { // Effects of owning x of the items, x is a decimal
            },
            display() { // Everything else displayed in the buyable button after the title
                displaytext = "(6 seconds)\n\
                Disassemble the air conditioning unit, and salvage any useful parts."

                if(player[this.layer].buyables[this.id].gt(0)) displaytext = displaytext + "\n\
                Time remaining: " + format(player[this.layer].buyables[this.id]) + " seconds."

                if (player["p"].ni_box_position != this.layer) return "A broken air conditoning unit. It's too high to reach, without something to stand on.";

                return displaytext;
            },

            unlocked() { return !player["p"].g3_part_owned; },    // This is to change when I've made a variable for the box's current position or whatever

            canAfford() {
                return !layerAnyBuyables(this.layer) && player["p"].ni_box_position == this.layer;
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
        // Layer unlocked if 1R is unlocked, AND 1> is UNpowered
        player[this.layer].unlocked = player["vt1r1"].unlocked && player["mc"].points.lt(this.powerRequirement);

        // Set visited flag
        if (player.tab == this.layer && player[this.layer].visited_ever == false) player[this.layer].visited_ever = true;

        // Buyable handling

        if(player[this.layer].buyables[11].gt(0)) { //First buyable, "Move box to 1R"

            if (player.tab != this.layer) { // If player leaves the tab, reset the tasks
                player[this.layer].buyables[11] = new Decimal(0);
                player["p"].is_acting = false;
            } else {    // Decrement buyables
                player[this.layer].buyables[11] = player[this.layer].buyables[11].minus(diff).max(0);
                if (player[this.layer].buyables[11].lte(0)) {   //When completed:
                    player["p"].ni_box_position = "vt1r1";
                    showTab("vt1r1");
                    player["p"].is_acting = false;
                }
            }
        }        

        if(player[this.layer].buyables[12].gt(0)) {    //Second buyable, "Get GENERATOR 03 PART"   

            if (player.tab != this.layer) { // If player leaves the tab, reset the tasks
                player[this.layer].buyables[12] = new Decimal(0);
                player["p"].is_acting = false;
            } else {    // Decrement buyables
                player[this.layer].buyables[12] = player[this.layer].buyables[12].minus(diff).max(0);
                if (player[this.layer].buyables[12].lte(0)) {   //When completed:
                    player["p"].g3_part_owned = true;
                    doPopup("item","Evaporator Coil");
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
        ["display-text","<h2>POST STORAGE</h2>"],
        "blank",
        ["display-text",`A small supply room, off the side of the main post room. There are shelves on either side, lined with boxes of envelopes, address labels, stamps...nothing out of the ordinary.
        A steady stream of water is flowing out of an air conditioning unit high on one wall. The floor is covered - but as the power to this room is still off, it's safe to traverse.`],
        "blank",
        "buyables"
    ],

    tooltip() {
        tip = this.name;
        if (!player[this.layer].visited_ever) tip = tip.replace(/./g,"?");
        if (player["mc"].points.lt(this.powerRequirement)) tip += "<br> (unpowered)";
        return tip;
    },
    lockedTooltip() {
        return this.tooltip();
    }

})

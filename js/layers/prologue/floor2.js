//  ####    ######    ##    ######  ####    ######  ######    ##    ##  ##
//  ##  ##  ##      ##  ##  ##      ##  ##    ##      ##    ##  ##  ##  ##
//  ##  ##  ##      ##      ##      ##  ##    ##      ##    ##  ##  ######
//  ####    ######  ##      ######  ####      ##      ##    ##  ##  ######
//  ##  ##  ##      ##      ##      ##        ##      ##    ##  ##  ######
//  ##  ##  ##      ##  ##  ##      ##        ##      ##    ##  ##  ##  ##
//  ##  ##  ######    ##    ######  ##        ##    ######    ##    ##  ##

addLayer("prec", {
    layer: "prec", // This is assigned automatically, both to the layer and all upgrades, etc. Shown here so you know about it
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

        visited_ever: true, // Whether the player has ever been to this layer

    }},

    buyables: {
        11: {
            title() {
                return "ID Card";
            },
            cost(x) { // cost for buying xth buyable, can be an object if there are multiple currencies
                return 0
            },
            effect(x) {},
            display() { // Everything else displayed in the buyable button after the title
                displaytext = "(2 seconds)\n\
                Your new ID card, confirming your status as a new maintenance employee."

                if(player[this.layer].buyables[this.id].gt(0)) displaytext = displaytext + "\n\
                Time remaining: " + format(player[this.layer].buyables[this.id]) + " seconds."

                return displaytext;
            },

            unlocked() { return player["pdec"].dressed && !player["p"].id_card; },    // This isn't right yet I know

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
                return "Elevator Key";
            },
            cost(x) { // cost for buying xth buyable, can be an object if there are multiple currencies
                return 0
            },
            effect(x) {},
            display() { // Everything else displayed in the buyable button after the title
                displaytext = "(2 seconds)\n\
                A key to the main elevator, allowing it to visit the Maintenance basement floor."

                if(player[this.layer].buyables[this.id].gt(0)) displaytext = displaytext + "\n\
                Time remaining: " + format(player[this.layer].buyables[this.id]) + " seconds."

                return displaytext;
            },

            unlocked() { return player["pdec"].dressed && !player["p"].elevator_key; },    // This isn't right yet I know

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


        // Set visited flag
        if (player.tab == this.layer && player[this.layer].visited_ever == false) player[this.layer].visited_ever = true;

        // Buyable handling
        if(player[this.layer].buyables[11].gt(0)) {    //First buyable, "ID Card"

            if (player.tab != this.layer) { // If player leaves the tab, reset the tasks
                player[this.layer].buyables[11] = new Decimal(0);
                player["p"].is_acting = false;
            } else {    // Decrement buyables
                player[this.layer].buyables[11] = player[this.layer].buyables[11].minus(diff).max(0);
                if (player[this.layer].buyables[11].lte(0)) {   //When completed:
                    player["p"].id_card = true;
                    doPopup("item","ID Card");
                    player["p"].is_acting = false;
                }
            }
        }        

        if(player[this.layer].buyables[12].gt(0)) {    //First buyable, "Move box to 1F"

            if (player.tab != this.layer) { // If player leaves the tab, reset the tasks
                player[this.layer].buyables[12] = new Decimal(0);
                player["p"].is_acting = false;
            } else {    // Decrement buyables
                player[this.layer].buyables[12] = player[this.layer].buyables[12].minus(diff).max(0);
                if (player[this.layer].buyables[12].lte(0)) {   //When completed:
                    player["p"].elevator_key = true;
                    doPopup("item","Elevator Key");
                    player["p"].is_acting = false;
                }
            }
        }        

    },

    color() {
        return "gold";
    },

    tabFormat: [
        ["display-text","<h2>RECEPTION</h2>"],
        "blank",
        ["display-text",function() {

            if (player["pdec"].dressed) {
                return `"Ah, hello again! I see you found the locker okay." The receptionist starts talking to you again as soon as you enter the room. "We'll have someone clean your gear and take it up to your room, once one's assigned to you. Your supervisor will fill you in about all that, though."<br><br>
                "For now, though..." As though rehearsed, the printer spits out a card, your face featured prominently on the front. "Here you go! Your ID is all ready. You don't have any access yet, so head straight down to Maintenance and your boss will get things sorted."<br><br>
                "Oh, one more thing - here's the elevator key. You need this to get down to the basement." A nondescript key, with a red tag labelled 'BF', sits next to your ID on the table. "You'd best get going now. Have a wonderful day!"`;
            }
            else {
                return `"Welcome! You must be the new maintenance contractor, right?" The receptionist beckons you over to the desk, whilst flicking through a stack of papers. "Heard you ran into a little trouble on the way in, hope you're feeling alright. If you need I can have you taken to the sickbay." You dismiss the concerns - you feel fine, a little shaken at most.<br><br>
                "Glad to hear it! In that case, we'll go ahead and get you started. Look up, please." The moment you glance upwards, a bright flash fills your eyes - as it fades you see the lens of a camera pointing down at you. "That's perfect. I'll get your ID printed for you now, it'll just take a few minutes."<br><br>
                In the meantime, why don't you get changed out of your flight gear? There's a new uniform ready for you, locker... #44. Just head up the elevator to the third floor, and follow the signs for the Lambda Division labs. You can clean yourself up in the decontamination pods too, I'm sure they won't mind."`;
            }
        }],
        "blank",
        "buyables"
    ],

    tooltip() {
        tip = this.name;
        if (player["mc"].points.lt(this.powerRequirement)) tip += "<br> (unpowered)";
        return tip;
    }

})

//    ##      ##    ####    ####    ######  ####      ##    ####  
//  ##  ##  ##  ##  ##  ##  ##  ##    ##    ##  ##  ##  ##  ##  ##
//  ##      ##  ##  ##  ##  ##  ##    ##    ##  ##  ##  ##  ##  ##
//  ##      ##  ##  ####    ####      ##    ##  ##  ##  ##  ####  
//  ##      ##  ##  ##  ##  ##  ##    ##    ##  ##  ##  ##  ##  ##
//  ##  ##  ##  ##  ##  ##  ##  ##    ##    ##  ##  ##  ##  ##  ##
//    ##      ##    ##  ##  ##  ##  ######  ####      ##    ##  ##

addLayer("pcor", {
    layer: "pcor", // This is assigned automatically, both to the layer and all upgrades, etc. Shown here so you know about it
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

    layerShown() {
        return true;
    },

    branches: ["prec"],

    update(diff) {

        // Set visited flag
        if (player.tab == this.layer && player[this.layer].visited_ever == false) player[this.layer].visited_ever = true;
    },

    color() {
        return "gold";
    },

    tabFormat: [
        ["display-text","<h2>CORRIDOR</h2>"],
        "blank",
        ["display-text",`A largely featureless corridor, connecting the Reception and the central elevator. Bathrooms lead off from either side, and pots of decorative greenery fill the corners.<br><br>
        The entry to Reception looks to be a security door, the panel beside it reading "SecLock LEVEL 1". Normally it'd keep visitors from wandering into the building, but right now it's propped open.`]
    ],

    tooltip() {
        tip = this.name;
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

addLayer("pf2", {
    layer: "pf2", // This is assigned automatically, both to the layer and all upgrades, etc. Shown here so you know about it
    symbol: "2F",
    name: "FLOOR 02", // This is optional, only used in a few places, If absent it just uses the layer id.
    startData() { return {
        unlocked: true,
        points: new Decimal(0),
        best: new Decimal(0),
        total: new Decimal(0),
        buyables: {}, // You don't actually have to initialize this one

        visited_ever: false, // Whether the player has ever been to this layer

    }},

    layerShown() {
        if (player["pcor"].visited_ever) return true;
        else return false;
    },

    branches: ["pcor"],

    color() {
        return "gold";
    },

    buyables: {
        11: {
            title() {
                return "BF Key Slot"
            },
            cost(x) { // cost for buying xth buyable, can be an object if there are multiple currencies
                return 0
            },
            effect(x) { // Effects of owning x of the items, x is a decimal
            },
            display() { // Everything else displayed in the buyable button after the title
                displaytext = "(4 seconds)\n\
                Use the elevator key, to activate the button for the basement floor.."

                if(player[this.layer].buyables[this.id].gt(0)) displaytext = displaytext + "\n\
                Time remaining: " + format(player[this.layer].buyables[this.id]) + " seconds."
                if (player[this.layer].key_used) return "The keyhole controlling access to BF. Your basement key is inserted.";
                if(!player["p"].elevator_key) return "A keyhole next to the 'BF' button. It likely controls access to that floor.";
                return displaytext
            },
            unlocked() { return true; },
            canAfford() {
                return !layerAnyBuyables(this.layer) && player["p"].elevator_key && !player[this.layer].key_used;
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
                if (player[this.layer].key_used) return {'background-color': buyableProgressColour };
                if(!this.canAfford() && player[this.layer].buyables[this.id].eq(0)) return {
                    'background-color': buyableLockedColour
                }
                 return {
                    'background': 'linear-gradient(to bottom, ' + buyableAvailableColour + ' ' + buyablePct + '%, ' + buyableProgressColour + ' ' + buyablePct + '%)'
                }
            }

        },

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

        // Buyable handling
        if(player[this.layer].buyables[11].gt(0)) {    //First buyable, "BF Key"

            if (player.tab != "pf2" && player.tab != "pf3") { // If player leaves the elevator, reset the tasks
                player[this.layer].buyables[11] = new Decimal(0);
                player["p"].is_acting = false;
            } else {    // Decrement buyables
                player[this.layer].buyables[11] = player[this.layer].buyables[11].minus(diff).max(0);
                if (player[this.layer].buyables[11].lte(0)) {   //When completed:
                    player[this.layer].key_used = true;
                    player["pbf"].unlocked = true;
                    player["p"].is_acting = false;
                }
            }
        }        

    },

    tabFormat: [
        ["display-text","<h2>MAIN ELEVATOR (2F)"],
        "blank",
        ["display-text",function() { 

            text = "The main central elevator for the facility. Currently on the second floor.<br><br>"
            
            if (player["pf2"].key_used) text += "You can now ride the elevator down to the basement floor."
            else text += "You've been given permission to visit the second and third floors for now - best not to go wandering elsewhere on your first day here.";

            return text;

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
        "blank",
        "blank",
        ["row",[
            ["column",[
                ["bar","liftscreen"],
                ["row",[["clickable","three"],["clickable","four"]]],
                ["row",[["clickable","one"],["clickable","two"]]],
                ["clickable","basement"]
            ]],
        "buyables"
        ]]

    ],

    tooltip() {
        tip = this.name;
        return tip;
    }

})
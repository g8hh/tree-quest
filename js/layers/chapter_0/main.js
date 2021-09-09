addLayer("m", {
        layer: "m", // This is assigned automatically, both to the layer and all upgrades, etc. Shown here so you know about it
        name: "Maintenance", // This is optional, only used in a few places, If absent it just uses the layer id.
        startData() { return {
            unlocked: true,
            points: new Decimal(0),
            buyables: {}, // You don't actually have to initialize this one
        }},
        convertToDecimal() {
            // Convert any layer-specific Decimal values (besides points, total, and best) from String to Decimal (used when loading save)
        },
        color:() => "#77bf5f",

//        unlocked() { return player.points.gt(5) },

        branches() {
            branchlist = [];
            if(player[this.layer].buyables[12].eq(1) || !player["p"].fusebox_key) branchlist.push("c1");
            if(player[this.layer].buyables[13].eq(1)) branchlist.push("c2");
            if(player[this.layer].buyables[23].eq(1)) branchlist.push("c3");
            if(player[this.layer].buyables[33].eq(1)) branchlist.push("c4");
            if(player[this.layer].buyables[32].eq(1)) branchlist.push("c5");
            if(player[this.layer].buyables[31].eq(1)) branchlist.push("c6");
            if(player[this.layer].buyables[21].eq(1)) branchlist.push("c7");
            if(player[this.layer].buyables[11].eq(1)) branchlist.push("c8");
            return branchlist;
        },

        canReset: true,

        milestonePopups: false,
        requires: new Decimal(0), // Can be a function that takes requirement increases into account
        resource: "power", // Name of prestige currency
        baseResource: "oxygen", // Name of resource prestige is based on
        baseAmount() {return player.points}, // Get the current amount of baseResource
        type: "none", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
        row: 0, // Row the layer is in on the tree (0 is the first row)
//        row: 1, // Row the layer is in on the tree (0 is the first row)
        effect() {
            return {} // Formulas for any boosts inherent to resources in the layer. Can return a single value instead of an object if there is just one effect
        },

        tabFormat: [
            ['display-text', function() {
                //Start of game - maintenance before finding the fusebox
                if(!player["p"].fusebox_key) return "<h2>MAINTENANCE</h2><br><br>\n\
                Life support in the majority of the facility has failed. You were the poor sap they sent to check out the fault, and whilst you were down here, it gave out entirely.\n\
                Most of the facility has locked down to buy time for the occupants to evacuate, so you're unable to leave the area.<br><br>\n\
                Fortunately, you've managed to barricade yourself in the maintenance room, where the surplus oxygen is stored.\n\
                There's a small oxygen tank in the room. With that, it should be possible to venture outside, if only for a few seconds at a time before returning to fill up again.<br><br>\n\
                Unfortunately, the power is also out in most of the surrounding corridor, making it impossible to see, much less use most of the systems. A single light illuminates the north part of the ring.\n\
                If you can get into the fuse box you may be able to move the light around and explore...and with a little luck, finally repair the life support systems."
                
                //Maintenance after opening the fusebox
                else return "<h2>MAINTENANCE</h2><br><br>\n\
                Life support in the majority of the facility has failed. You were the poor sap they sent to check out the fault, and whilst you were down here, it gave out entirely.\n\
                Most of the facility has locked down to buy time for the occupants to evacuate, so you're unable to leave the area.<br><br>\n\
                Fortunately, you've managed to barricade yourself in the maintenance room, where the surplus oxygen is stored.\n\
                There's a small oxygen tank in the room. With that, it should be possible to venture outside, if only for a few seconds at a time before returning to fill up again.<br><br>\n\
                Now you have the key to the fusebox, you can power other sections of the corridor. Hopefully you can find more fuses, and repair the life support system."
            }],
            "blank",
            "milestones",
            "upgrades",
            "clickables",
            function() {
                for (buyid of [11,12,13,21,23,31,32,33]) {
                    if (!getBuyableAmount("m", buyid).eq(1) && player["p"].fusebox_key) {
                        distext = "You have " + player["p"].fuses + "/" + player["p"].fuses.add(player["p"].spent_fuses) + " fuses remaining."
                        return ["display-text", distext];
                    }
                }
            },
            "blank",
            function() {
                for (buyid of [11,12,13,21,23,31,32,33]) {
                    if (!getBuyableAmount("m", buyid).eq(1)) {
                        return "buyables";
                    }
                }
            }
        ],

        milestones: {
            0: {
                unlocked() {return player["p"].fusebox_key},
                requirementDescription() {
                    return "[LIFE SUPPORT RING: " + player["p"].total_circuits_repaired + "/8]"
                },
                done() {
                    return player["p"].total_circuits_repaired.eq(8)
                },
                effectDescription() {
                    if(player["p"].total_circuits_repaired.lt(8)) return "Power and repair the life support system in all eight corridors to activate it."
                    return "You can now explore the corridors without relying on oxygen reserves."
                },
                style() {
                    lifeSupportPct = player["p"].total_circuits_repaired.div(8).mul(100)
                    return {
                        'background': 'linear-gradient(to right, #77bf5f ' + lifeSupportPct + '%, #bf8f8f ' + lifeSupportPct + '%)'
                    }
                }
            },
            1: {
                unlocked() {return true},
                requirementDescription() {
                    if(player.points.lt(layers["p"].maxOxygen()) && !hasUpgrade(this.layer, 11)) return "[REFILLING OXYGEN]"
                    if(hasUpgrade("m", 11)) return "[OXYGEN DEPLETING]"
                    return "[OXYGEN FULL]"
                },
                done() {
                    return layers[this.layer].milestones[this.id].unlocked && player.points < layers["p"].maxOxygen()
                },
                effectDescription() {
                    if(player.points.lt(layers["p"].maxOxygen()) && !hasUpgrade(this.layer, 11)) return "You can venture out again once your reserves have refilled."
                    if(hasUpgrade("m", 11)) return "Your oxygen is steadily depleting. You will be forced to return here once it empties."
                    return "You are ready to venture out."
                },
                style() {
                    oxygenPct = player.points.div(layers["p"].maxOxygen()).mul(100)
                    return {
                        'background': 'linear-gradient(to right, #77bf5f ' + oxygenPct + '%, #bf8f8f ' + oxygenPct + '%)'
                    }
                }
            },
        },
        upgrades: {
            rows: 1,
            cols: 3,
            11: {
                title:() => "Venture Out",
                description() {
                    if(hasUpgrade(this.layer, 11)) return
                    if(player.points.lt(layers["p"].maxOxygen())) return "You cannot venture out until your oxygen reserves are full."
                    return "Open the door. Oxygen will steadily deplete."
                },
                cost:() => new Decimal(0),
                unlocked() { return !hasUpgrade(this.layer, 11) && player.points.gte(layers["p"].maxOxygen()) && player["p"].total_circuits_repaired.lt(8) }, // The upgrade is only visible when this is true
                effect() {
                    let ret = -1
                    return ret;
                },
            },
            12: {
                title:() => "Return and Rest",
                description() {
                    return "Close the doors, and wait for oxygen to replenish."
                },
                cost:() => new Decimal(0),
                unlocked() { return hasUpgrade(this.layer, 11) }, // The upgrade is only visible when this is true
                effect() {
                    if(hasUpgrade(this.layer, 12)) layers[this.layer].doReset(this.layer)
                },
            },
/*
            13: {
                title:() => "Activate Life Support",
                description() {
                    return "The circuit has been fully repaired. Throw the switch and reactivate life support! [END OF CHAPTER 0]"
                },
                cost:() => new Decimal(0),
                unlocked() { return player.points.gte(layers["p"].maxOxygen()) && player["p"].total_circuits_repaired.eq(8)}, // The upgrade is only visible when this is true
                effect() {
                    if(hasUpgrade(this.layer, 13)) {
                        // Commented out below line to allow for v0.1 endgame checking
                        // player["p"].tanks = new Decimal(3) //Sanity check - it's possible to skip a tank, this gives it back (to expand to give achievement/recognition)
                        player["p"].chapter = 1;
                    }
                },
            },
*/
        },

        clickables: {
            11: {
                title: "Activate Life Support",
                display() { return "The circuit has been fully repaired. Throw the switch and reactivate life support!"; },
                unlocked() { return player.points.gte(layers["p"].maxOxygen()) && player["p"].total_circuits_repaired.eq(8); },
                canClick() { return true; },
                onClick() {
                    showNavTab("interior");
                    showTab("mc");
                    if (player["p"].tanks.eq(2)) {
                        player["p"].chapter_0_two_tanks = 1;
                    } else {
                        player["p"].chapter_0_two_tanks = -1;
                    }
                    player.interstitialName = "chapter_1";
                    player.showInterstitial = true;
                }
                     
            }
        },
//
// ####    ##  ##  ##  ##    ##    ####    ##      ######    ##  
// ##  ##  ##  ##  ##  ##  ##  ##  ##  ##  ##      ##      ##  ##
// ##  ##  ##  ##  ##  ##  ##  ##  ##  ##  ##      ##      ##    
// ####    ##  ##    ##    ######  ####    ##      ######    ##  
// ##  ##  ##  ##    ##    ##  ##  ##  ##  ##      ##          ##
// ##  ##  ##  ##    ##    ##  ##  ##  ##  ##      ##      ##  ##
// ####      ##      ##    ##  ##  ####    ######  ######    ##  
//
buyables: {
        rows: 3,
        cols: 3,

        11: {
                title:() => "C8 Fuse Slot", // Optional, displayed at the top in a larger font
                cost(x) { // cost for buying xth buyable, can be an object if there are multiple currencies
                    return 1
                },
                effect(x) { // Effects of owning x of the items, x is a decimal
                },
                display() { // Everything else displayed in the buyable button after the title
                    if(player[this.layer].buyables[this.id].eq(1)) return "+1 fuse\n\
                    Turns off the lights in corridor 8."
                    if(player["p"].fuses.eq(0)) return "You have no fuses to place in this slot."
                    return "-1 fuse\n\
                    Turns on the lights in Corridor 8."
                },
                unlocked() { return player["p"].fusebox_key }, 
                canAfford() {
                    if(player[this.layer].buyables[this.id].gte(1)) return true
                    return (player["p"].fuses.gte(1))
                },
                buy() { 
                    if(player[this.layer].buyables[this.id].eq(1)) {
                        player["p"].fuses = player["p"].fuses.add(1)
                        player[this.layer].buyables[this.id] = new Decimal(0)
                        player["p"].spent_fuses = player["p"].spent_fuses.sub(1)
                        layers["p"].setCircuit(8,0) //Break the circuit in this corridor
                    } else {
                        player["p"].fuses = player["p"].fuses.sub(1)
                        player[this.layer].buyables[this.id] = new Decimal(1)
                        player["p"].spent_fuses = player["p"].spent_fuses.add(1)
                    }
                },
                style() {
                    if(player[this.layer].buyables[this.id].eq(1)) return {
                        'background-color': '#CFBC23'
                    }
                    if(player["p"].fuses.eq(0)) return {
                        'background-color': '#442222',
                        'color': '#FFFFFF'
                    }
                    return {
                        'background-color': '#333333',
                        'color': '#FFFFFF'
                    }
                },
                buyMax() {}, // You'll have to handle this yourself if you want
            },
        12: {
                title:() => "C1 Fuse Slot", // Optional, displayed at the top in a larger font
                cost(x) { // cost for buying xth buyable, can be an object if there are multiple currencies
                    return 1
                },
                effect(x) { // Effects of owning x of the items, x is a decimal
                },
                display() { // Everything else displayed in the buyable button after the title
                    if(player[this.layer].buyables[this.id].eq(1)) return "+1 fuse\n\
                    Turns off the lights in corridor 1."
                    if(player["p"].fuses.eq(0)) return "You have no fuses to place in this slot."
                    return "-1 fuse\n\
                    Turns on the lights in Corridor 1."
                },
                unlocked() { return player["p"].fusebox_key }, 
                canAfford() {
                    if(player[this.layer].buyables[this.id].gte(1)) return true
                    return (player["p"].fuses.gte(1))
                },
                buy() { 
                    if(player[this.layer].buyables[this.id].eq(1)) {
                        player["p"].fuses = player["p"].fuses.add(1)
                        player[this.layer].buyables[this.id] = new Decimal(0)
                        player["p"].spent_fuses = player["p"].spent_fuses.sub(1)
                        player["p"].c6_diagnostic_run = false //Power down C6 terminal when off
                        player["p"].c1_fan_disabled = false //Re-enable the fan in C1
                        layers["p"].setCircuit(1,0) //Break the circuit in this corridor
                    } else {
                        player["p"].fuses = player["p"].fuses.sub(1)
                        player[this.layer].buyables[this.id] = new Decimal(1)
                        player["p"].spent_fuses = player["p"].spent_fuses.add(1)
                    }
                },
                style() {
                    if(player[this.layer].buyables[this.id].eq(1)) return {
                        'background-color': '#CFBC23'
                    }
                    if(player["p"].fuses.eq(0)) return {
                        'background-color': '#442222',
                        'color': '#FFFFFF'
                    }
                    return {
                        'background-color': '#333333',
                        'color': '#FFFFFF'
                    }
                },
                buyMax() {}, // You'll have to handle this yourself if you want
            },
        13: {
                title:() => "C2 Fuse Slot", // Optional, displayed at the top in a larger font
                cost(x) { // cost for buying xth buyable, can be an object if there are multiple currencies
                    return 1
                },
                effect(x) { // Effects of owning x of the items, x is a decimal
                },
                display() { // Everything else displayed in the buyable button after the title
                    if(player[this.layer].buyables[this.id].eq(1)) return "+1 fuse\n\
                    Turns off the lights in corridor 2."
                    if(player["p"].fuses.eq(0)) return "You have no fuses to place in this slot."
                    return "-1 fuse\n\
                    Turns on the lights in Corridor 2."
                },
                unlocked() { return player["p"].fusebox_key }, 
                canAfford() {
                    if(player[this.layer].buyables[this.id].gte(1)) return true
                    return (player["p"].fuses.gte(1))
                },
                buy() { 
                    if(player[this.layer].buyables[this.id].eq(1)) {
                        player["p"].fuses = player["p"].fuses.add(1)
                        player[this.layer].buyables[this.id] = new Decimal(0)
                        player["p"].spent_fuses = player["p"].spent_fuses.sub(1)
                        player["p"].c6_diagnostic_run = false //Reset compactor diagnostic in Corridor 6
                        layers["p"].setCircuit(2,0) //Break the circuit in this corridor
                    } else {
                        player["p"].fuses = player["p"].fuses.sub(1)
                        player[this.layer].buyables[this.id] = new Decimal(1)
                        player["p"].spent_fuses = player["p"].spent_fuses.add(1)
                    }
                },
                style() {
                    if(player[this.layer].buyables[this.id].eq(1)) return {
                        'background-color': '#CFBC23'
                    }
                    if(player["p"].fuses.eq(0)) return {
                        'background-color': '#442222',
                        'color': '#FFFFFF'
                    }
                    return {
                        'background-color': '#333333',
                        'color': '#FFFFFF'
                    }
                },
                buyMax() {}, // You'll have to handle this yourself if you want
            },
        21: {
                title:() => "C7 Fuse Slot", // Optional, displayed at the top in a larger font
                cost(x) { // cost for buying xth buyable, can be an object if there are multiple currencies
                    return 1
                },
                effect(x) { // Effects of owning x of the items, x is a decimal
                },
                display() { // Everything else displayed in the buyable button after the title
                    if(player[this.layer].buyables[this.id].eq(1)) return "+1 fuse\n\
                    Turns off the lights in corridor 7."
                    if(player["p"].fuses.eq(0)) return "You have no fuses to place in this slot."
                    return "-1 fuse\n\
                    Turns on the lights in Corridor 7."
                },
                unlocked() { return player["p"].fusebox_key }, 
                canAfford() {
                    if(player[this.layer].buyables[this.id].gte(1)) return true
                    return (player["p"].fuses.gte(1))
                },
                buy() { 
                    if(player[this.layer].buyables[this.id].eq(1)) {
                        player["p"].fuses = player["p"].fuses.add(1)
                        player[this.layer].buyables[this.id] = new Decimal(0)
                        player["p"].spent_fuses = player["p"].spent_fuses.sub(1)
                        player["p"].c7_vents_open = false //Close the vents if Corridor 7 is powered down
                        layers["p"].setCircuit(7,0) //Break the circuit in this corridor
                    } else {
                        player["p"].fuses = player["p"].fuses.sub(1)
                        player[this.layer].buyables[this.id] = new Decimal(1)
                        player["p"].spent_fuses = player["p"].spent_fuses.add(1)
                    }
                },
                style() {
                    if(player[this.layer].buyables[this.id].eq(1)) return {
                        'background-color': '#CFBC23'
                    }
                    if(player["p"].fuses.eq(0)) return {
                        'background-color': '#442222',
                        'color': '#FFFFFF'
                    }
                    return {
                        'background-color': '#333333',
                        'color': '#FFFFFF'
                    }
                },
                buyMax() {}, // You'll have to handle this yourself if you want
            },
        22: {
                title:() => "FUSEBOX", // Optional, displayed at the top in a larger font
                cost(x) { // cost for buying xth buyable, can be an object if there are multiple currencies
                    return 1
                },
                effect(x) { // Effects of owning x of the items, x is a decimal
                },
                display() { // Everything else displayed in the buyable button after the title
                    return "Place fuses in the slots to provide power to that section of the corridor.\n\
                    Removing a fuse may revert certain changes."
                },
                unlocked() { return player["p"].fusebox_key }, 
                canAfford() {},
                buy() {},
                buyMax() {}, // You'll have to handle this yourself if you want
                style() {
                    return {
                        'background-color': '#000000',
                        'color': '#CCCCCC'
                    }
                }

            },
        23: {
                title:() => "C3 Fuse Slot", // Optional, displayed at the top in a larger font
                cost(x) { // cost for buying xth buyable, can be an object if there are multiple currencies
                    return 1
                },
                effect(x) { // Effects of owning x of the items, x is a decimal
                },
                display() { // Everything else displayed in the buyable button after the title
                    if(player[this.layer].buyables[this.id].eq(1)) return "+1 fuse\n\
                    Turns off the lights in corridor 3."
                    if(player["p"].fuses.eq(0)) return "You have no fuses to place in this slot."
                    return "-1 fuse\n\
                    Turns on the lights in Corridor 3."
                },
                unlocked() { return player["p"].fusebox_key }, 
                canAfford() {
                    if(player[this.layer].buyables[this.id].gte(1)) return true
                    return (player["p"].fuses.gte(1))
                },
                buy() { 
                    if(player[this.layer].buyables[this.id].eq(1)) {
                        player["p"].fuses = player["p"].fuses.add(1)
                        player[this.layer].buyables[this.id] = new Decimal(0)
                        player["p"].spent_fuses = player["p"].spent_fuses.sub(1)
                        layers["p"].setCircuit(3,0) //Break the circuit in this corridor
                    } else {
                        player["p"].fuses = player["p"].fuses.sub(1)
                        player[this.layer].buyables[this.id] = new Decimal(1)
                        player["p"].spent_fuses = player["p"].spent_fuses.add(1)
                    }
                },
                style() {
                    if(player[this.layer].buyables[this.id].eq(1)) return {
                        'background-color': '#CFBC23'
                    }
                    if(player["p"].fuses.eq(0)) return {
                        'background-color': '#442222',
                        'color': '#FFFFFF'
                    }
                    return {
                        'background-color': '#333333',
                        'color': '#FFFFFF'
                    }
                },
                buyMax() {}, // You'll have to handle this yourself if you want
            },
        31: {
                title:() => "C6 Fuse Slot", // Optional, displayed at the top in a larger font
                cost(x) { // cost for buying xth buyable, can be an object if there are multiple currencies
                    return 1
                },
                effect(x) { // Effects of owning x of the items, x is a decimal
                },
                display() { // Everything else displayed in the buyable button after the title
                    if(player[this.layer].buyables[this.id].eq(1)) return "+1 fuse\n\
                    Turns off the lights in corridor 6."
                    if(player["p"].fuses.eq(0)) return "You have no fuses to place in this slot."
                    return "-1 fuse\n\
                    Turns on the lights in Corridor 6."
                },
                unlocked() { return player["p"].fusebox_key }, 
                canAfford() {
                    if(player[this.layer].buyables[this.id].gte(1)) return true
                    return (player["p"].fuses.gte(1))
                },
                buy() { 
                    if(player[this.layer].buyables[this.id].eq(1)) {
                        player["p"].fuses = player["p"].fuses.add(1)
                        player[this.layer].buyables[this.id] = new Decimal(0)
                        player["p"].spent_fuses = player["p"].spent_fuses.sub(1)
                        player["p"].c6_diagnostic_run = false //Power down C6 terminal when off
                        player["p"].c6_filter_override = false //Re-enable the filter in C6
                        player["p"].c1_fan_disabled = false //Re-enable the fan in C1
                        layers["p"].setCircuit(6,0) //Break the circuit in this corridor
                    } else {
                        player["p"].fuses = player["p"].fuses.sub(1)
                        player[this.layer].buyables[this.id] = new Decimal(1)
                        player["p"].spent_fuses = player["p"].spent_fuses.add(1)
                    }
                },
                style() {
                    if(player[this.layer].buyables[this.id].eq(1)) return {
                        'background-color': '#CFBC23'
                    }
                    if(player["p"].fuses.eq(0)) return {
                        'background-color': '#442222',
                        'color': '#FFFFFF'
                    }
                    return {
                        'background-color': '#333333',
                        'color': '#FFFFFF'
                    }
                },
                buyMax() {}, // You'll have to handle this yourself if you want
            },
        32: {
                title:() => "C5 Fuse Slot", // Optional, displayed at the top in a larger font
                cost(x) { // cost for buying xth buyable, can be an object if there are multiple currencies
                    return 1
                },
                effect(x) { // Effects of owning x of the items, x is a decimal
                },
                display() { // Everything else displayed in the buyable button after the title
                    if(player[this.layer].buyables[this.id].eq(1)) return "+1 fuse\n\
                    Turns off the lights in corridor 5."
                    if(player["p"].fuses.eq(0)) return "You have no fuses to place in this slot."
                    return "-1 fuse\n\
                    Turns on the lights in Corridor 5."
                },
                unlocked() { return player["p"].fusebox_key }, 
                canAfford() {
                    if(player[this.layer].buyables[this.id].gte(1)) return true
                    return (player["p"].fuses.gte(1))
                },
                buy() { 
                    if(player[this.layer].buyables[this.id].eq(1)) {
                        player["p"].fuses = player["p"].fuses.add(1)
                        player[this.layer].buyables[this.id] = new Decimal(0)
                        player["p"].spent_fuses = player["p"].spent_fuses.sub(1)
                        player["p"].c5_tamper_bypassed = false //Disable the tamper bypass in corridor 5 (for corridor 4)
                        if (player["p"].c5_lock_scanned) {
                            player["p"].c5_incorrect_scan = true;   // Scan no longer valid as the lock has reset
                        }
                        layers["p"].setCircuit(5,0) //Break the circuit in this corridor
                    } else {
                        player["p"].fuses = player["p"].fuses.sub(1)
                        player[this.layer].buyables[this.id] = new Decimal(1)
                        player["p"].spent_fuses = player["p"].spent_fuses.add(1)
                    }
                },
                style() {
                    if(player[this.layer].buyables[this.id].eq(1)) return {
                        'background-color': '#CFBC23'
                    }
                    if(player["p"].fuses.eq(0)) return {
                        'background-color': '#442222',
                        'color': '#FFFFFF'
                    }
                    return {
                        'background-color': '#333333',
                        'color': '#FFFFFF'
                    }
                },
                buyMax() {}, // You'll have to handle this yourself if you want
            },
        33: {
                title:() => "C4 Fuse Slot", // Optional, displayed at the top in a larger font
                cost(x) { // cost for buying xth buyable, can be an object if there are multiple currencies
                    return 1
                },
                effect(x) { // Effects of owning x of the items, x is a decimal
                },
                display() { // Everything else displayed in the buyable button after the title
                    if(player[this.layer].buyables[this.id].eq(1)) return "+1 fuse\n\
                    Turns off the lights in corridor 4."
                    if(player["p"].fuses.eq(0)) return "You have no fuses to place in this slot."
                    return "-1 fuse\n\
                    Turns on the lights in Corridor 4."
                },
                unlocked() { return player["p"].fusebox_key }, 
                canAfford() {
                    if(player[this.layer].buyables[this.id].gte(1)) return true
                    return (player["p"].fuses.gte(1))
                },
                buy() { 
                    if(player[this.layer].buyables[this.id].eq(1)) {
                        player["p"].fuses = player["p"].fuses.add(1)
                        player[this.layer].buyables[this.id] = new Decimal(0)
                        player["p"].spent_fuses = player["p"].spent_fuses.sub(1)
                        layers["p"].setCircuit(4,0) //Break the circuit in this corridor
                        player["p"].c4_failed_completion = false
                    } else {
                        player["p"].fuses = player["p"].fuses.sub(1)
                        player[this.layer].buyables[this.id] = new Decimal(1)
                        player["p"].spent_fuses = player["p"].spent_fuses.add(1)
                    }
                },
                style() {
                    if(player[this.layer].buyables[this.id].eq(1)) return {
                        'background-color': '#CFBC23'
                    }
                    if(player["p"].fuses.eq(0)) return {
                        'background-color': '#442222',
                        'color': '#FFFFFF'
                    }
                    return {
                        'background-color': '#333333',
                        'color': '#FFFFFF'
                    }
                },
                buyMax() {}, // You'll have to handle this yourself if you want
            },

        },

//  ####    ######    ##    ######  ######          ##        ##      ##    ####  
//  ##  ##  ##      ##  ##  ##        ##            ##      ##  ##  ##  ##  ##  ##
//  ##  ##  ##      ##      ##        ##            ##      ##  ##  ##  ##  ##  ##
//  ####    ######    ##    ######    ##            ##      ##  ##  ##  ##  ####  
//  ##  ##  ##          ##  ##        ##            ##      ##  ##  ##  ##  ##       
//  ##  ##  ##      ##  ##  ##        ##            ##      ##  ##  ##  ##  ##    
//  ##  ##  ######    ##    ######    ##            ######    ##      ##    ##    
//
//

        doReset(resettingLayer) { // Triggers when this layer is being reset, along with the layer doing the resetting. Not triggered by lower layers resetting, but is by layers on the same row.
            m_reset_to_keep = []
            //Pre-reset checks to retain variables:
            //If fusebox key owned retain fuse configuration
            if(player["p"].fusebox_key) {
                m_reset_to_keep.push("buyables")
//                temp_buyables = player[this.layer].buyables;
            }

            //If circuit not fully complete, reset it
            //NOT DOING THIS - SHOULD BE UNNECESSARY
            //            if(player["p"].total_circuits_repaired.lt(8)) layers["p"].resetCircuits()

            //Close vents in Corridors 3 and 7
            player["p"].c7_vents_open = false

            //Disable tamper bypass in Corridor 5 (for Corridor 4)
            player["p"].c5_tamper_bypassed = false
            //Clear the tamper lockdown on Corridor 4
            player["p"].c4_failed_completion = false

            //Reset the lock in Corridor 5
            player["p"].c5_lock_scanned = false
            //Reset the lock analysis in Corridor 3
            player["p"].c3_lock_analysed = false
            //Reset the incorrect scan flags
            player["p"].c5_incorrect_scan = false;
            player["p"].c5_incorrect_tried = false;

            //Drop the cable from Corridor 1
            player["p"].c1_holding_cable = false
            //Unplug the cable from Corridor 7
            player["p"].c7_plugged_in = false
            //Reset the maintenance diagnostic in Corridor 6
            player["p"].c6_diagnostic_run = false

            //Return wires to wall in Corridor 4
            player["p"].c4_loose_wires = false
            //Reset filter override in Corridor 6
            player["p"].c6_filter_override = false
            //Reactivate fan in Corridor 1
            player["p"].c1_fan_disabled = false
            //"Unfeed" the wires from Corridor 2
            player["p"].c2_wires_fed = false
            //For safety, ensure no records of collision still linger in Corridor 2
            player["p"].c2_failed_completion = false
            player["p"].c2_unpowered_collision = false

            //Perform reset
            layerDataReset(this.layer,m_reset_to_keep)

            //Post-reset variable re-adding
/*
            if(player["p"].fusebox_key) {
                player[this.layer].buyables = temp_buyables;
            }
*/

            //Set oxygen low so it builds up again ("refills")
            player.points = new Decimal(0.01)

            //Return the player to the central tab
            showTab("m");
            return
        },
        layerShown() {return true}, // Condition for when layer appears on the tree
        update(diff) {
                //Reset if oxygen runs out (return to maintenance)
                if (player.points.lte(0) && player.tab == "m") layers[this.layer].doReset(this.layer)
                //Gradually refill oxygen when not venturing out
                if (player.points.lt(layers["p"].maxOxygen()) && !hasUpgrade(this.layer, 11)) player.points = player.points.add(player.points.div(5)).min(layers["p"].maxOxygen())
        }, // Do any gameloop things (e.g. resource generation) inherent to this layer
        automate() {
        }, // Do any automation inherent to this layer if appropriate
        updateTemp() {
        }, // Do any necessary temp updating, not that important usually
        resetsNothing() {return false},
        onPrestige(gain) {

            return
        }, // Useful for if you gain secondary resources or have other interesting things happen to this layer when you reset it. You gain the currency after this function ends.

        hotkeys: [
            {key: "m", description: "M: Return to the Maintenance room", onPress(){showTab("m")},unlocked() { return player["p"].chapter == 0}},
        ],
        incr_order: [], // Array of layer names to have their order increased when this one is first unlocked

        tooltip() { return layers[this.layer].name },
        tooltipLocked() { return layers[this.layer].name },

        shouldNotify() { // Optional, layer will be highlighted on the tree if true.
            return player.points.lte(0)             
        }
})
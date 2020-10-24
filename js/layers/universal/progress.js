/*=============vv=================\\
|| SPOILERS.JS ||                 ||
>>=============//                 ||
|| This file contains heavy       ||
|| progression spoilers!          ||
|| I'd advise only reading ahead  ||
|| once you've finished the game. ||
\\================================*/

addLayer("p", {
        layer: "p", 
        name: "Progress Layer", // This is a hidden, inaccessible layer, used for tracking quest progress
        startData() { return {
            unl: true,
            points: new Decimal(0),
            best: new Decimal(0),
            total: new Decimal(0),

            //Which "chapter" of the mod you're on - make a huge difference to certain layers
            chapter: "prologue",
            
            tanks: new Decimal(1), //Oxygen tanks - each gives 10 seconds of air

            //Fusebox
            key_fusebox: new Decimal(0), //Finding the fusebox key - unlocks fusebox in "m" layer
            fuses: new Decimal(0), //Total fuses found - can be used in the fusebox in "m" layer
            spent_fuses: new Decimal(0), //Total fuses used in the fusebox in "m" layer

            //Corridor Quests
            c6_fuse_retrieved: new Decimal(0), //Completing the "Retrieve Fuse" task in Corridor 6

            c7_vents_open: new Decimal(0), //Completing the "Open Side Vents" task in Corridor 7
            c3_tank_retrieved: new Decimal(0), //Completing the "Retrieve Oxygen Tank" task in Corridor 3

            c5_tamper_bypassed: new Decimal(0), //Tamper bypass activated in Corridor 5
            c4_failed_completion: new Decimal(0), //C4 completed without completing C5 placeholder first
            c4_fuse_retrieved: new Decimal(0), //Completing the "Remove Fuse from Wall" task in Corridor 4 successfully

            c8_reprogrammer_taken: new Decimal(0), //Picked up the key reprogrammer from Corridor 8

            c5_lock_scanned: new Decimal(0), //Scanned the lock in Corridor 5 using the reprogrammer
            c3_lock_analysed: new Decimal(0), //Analysed C5's lock at the reprogrammer terminal in Corridor 3
            c5_fuses_retrieved: new Decimal(0), //Retrieved the two fuses behind the lock in Corridor 5

            c1_holding_cable: new Decimal(0), //Picked up the auxiliary cable from Corridor 1
            c7_plugged_in: new Decimal(0), //Plugged the cable from Corridor 1 into the socket in Corridor 7
            c6_diagnostic_run: new Decimal(0), //Ran the garbage disposal diagnostic in Corridor 6
            c2_tank_retrieved: new Decimal(0), //Retrieved the oxygen tank from the garbage disposal in Corridor 2

            c6_filter_override: new Decimal(0), //Disabled the air filtration warning in Corridor 6
            c4_loose_wires: new Decimal(0), //Picked up the loose wires from Corridor 4
            c1_fan_disabled: new Decimal(0), //Disabled the overhead fan in Corridor 1
            c2_wires_fed: new Decimal(0), //Fed loose wires through the ceiling in Corridor 2
            c2_failed_completion: new Decimal(0), //Loose wires collided with fan in Corridor 1
            c2_unpowered_collision: new Decimal(0), //Loose wires collided with fan in Corridor 1, whilst unpowered
            c8_fuses_retrieved: new Decimal(0), //Completing the "Remove Fuses" task in Corridor 8


            //Corridor Circuit Loop
            circuit_repaired: { //Object to store completions of circuit repair in Corridors 1 through 8
                1: new Decimal(0),
                2: new Decimal(0),
                3: new Decimal(0),
                4: new Decimal(0),
                5: new Decimal(0),
                6: new Decimal(0),
                7: new Decimal(0),
                8: new Decimal(0)
            },   

            total_circuits_repaired: new Decimal(0),   //Tracker for the total number of circuits fixed

        }},

        //Helper functions for above storage

        tabFormat: {
            "tab 1": {
                content: [['display-text', 'sample']],
            }
        },

        maxOxygen() { //Returns the maximum amount of oxygen based on current total of tanks
            return player[this.layer].tanks.mul(10) //For now, base 10 seconds per tank
        },

        setCircuit(corridor, status) {  //One-line call to change circuit and recalculate total, takes corridor number (1-8) and status (0 or 1)
            player[this.layer].circuit_repaired[corridor] = new Decimal(status)
            layers[this.layer].sumCircuits()
            console.log(corridor + " and " + status)
        },

        sumCircuits() { //Add up circuit completions after a change
            tcr = new Decimal(0)

            for (var i = 8; i >= 1; i--) {
                tcr = tcr.add(player[this.layer].circuit_repaired[i])
            }
            player[this.layer].total_circuits_repaired = new Decimal(tcr)
        },

        resetCircuits() {   //Set all circuits back to 0 (unfixed)
            player[this.layer].circuit_repaired = {
                1: new Decimal(0),
                2: new Decimal(0),
                3: new Decimal(0),
                4: new Decimal(0),
                5: new Decimal(0),
                6: new Decimal(0),
                7: new Decimal(0),
                8: new Decimal(0)
            }
            layers[this.layer].sumCircuits()
        },

        //Default functions, unknown if these are necessary
        convertToDecimal() {
            // Convert any layer-specific Decimal values (besides points, total, and best) from String to Decimal (used when loading save)
        },
        color:() => "#4BDC13",
        requires:() => new Decimal(0), // Can be a function that takes requirement increases into account
        resource: "prestige points", // Name of prestige currency
        baseResource: "points", // Name of resource prestige is based on
        baseAmount() {return player.points}, // Get the current amount of baseResource
        type: "none", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
        exponent: 0.5, // Prestige currency exponent
        base:() => hasUpgrade(this.layer, 11)?4:5, // Only needed for static layers, base of the formula (b^(x^exp))
        resCeil: false, // True if the cost needs to be rounded up (use when baseResource is static?)
        canBuyMax() {}, // Only needed for static layers with buy max
        gainMult() { // Calculate the multiplier for main currency from bonuses
            mult = new Decimal(1)
            if (hasUpgrade(this.layer, 166)) mult = mult.times(2) // These upgrades don't exist
            if (hasUpgrade(this.layer, 120)) mult = mult.times(upgEffect(this.layer, 120))
            return mult
        },
        gainExp() { // Calculate the exponent on main currency from bonuses
            return new Decimal(1)
        },
        row: "side", // Row the layer is in on the tree (0 is the first row)
        effect() {
            return {} // Formulas for any boosts inherent to resources in the layer. Can return a single value instead of an object if there is just one effect
        },
        upgrades: {
            rows: 1,
            cols: 3,
            11: {
                title:() => "Point Generation",
                desc:() => "Gain points every second.",
                cost:() => new Decimal(1),
                unl() { return player[this.layer].unl }, // The upgrade is only visible when this is true
                effect() {
                    let ret = 1
                    if(player[this.layer].upgrades.includes(13)) ret = player[this.layer].acceleration
                    return ret;
                }
            },
            12: {
                desc:() => "Point generation is faster based on your unspent Prestige Points.",
                cost:() => new Decimal(1),
                unl() { return (hasUpgrade(this.layer, 11))},
                effect() { // Calculate bonuses from the upgrade. Can return a single value or an object with multiple values
                    let ret = player[this.layer].points.add(2).pow(player[this.layer].upgrades.includes(24)?1.1:(player[this.layer].upgrades.includes(14)?0.75:0.5)) 
                    if (ret.gte("1e20000000")) ret = ret.sqrt().times("1e10000000")
                    return ret;
                },
                effectDisplay(fx) { return format(fx)+"x" }, // Add formatting to the effect
            },
            13: {
                title:() => "Point Acceleration",
                desc:() => "The first upgrade increases points by Acceleration instead of by 1.",
                cost:() => new Decimal(5),
                unl() {return (hasUpgrade(this.layer, 12))},
                effect() {
                    let ret = player[this.layer].acceleration;
                    return ret;
                }
            }
       },
        doReset(resettingLayer){
            //never resets lmao
        },
        layerShown() {return true}, // Condition for when layer appears on the tree
        update(diff) {
            if (player[this.layer].upgrades.includes(11)) player.points = player.points.add(tmp.pointGen.times(diff)).max(0)
            if (player[this.layer].upgrades.includes(13)) player[this.layer].acceleration = player[this.layer].acceleration.add(1/player[this.layer].acceleration)
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
            {key: "p", desc: "C: reset for lollipops or whatever", onPress(){if (player[this.layer].unl) doReset(this.layer)}},
            {key: "ctrl+c" + this.layer, desc: "Ctrl+c: respec things", onPress(){if (player[this.layer].unl) respecBuyables(this.layer)}},
        ],
        incr_order: [], // Array of layer names to have their order increased when this one is first unlocked

        microtabs: {
            stuff: {
                first: {
                    content: ["upgrades", ["display-text", function() {return "confirmed"}]]
                },
                second: {
                    content: [["upgrade", 11],
                            ["row", [["upgrade", 11], "blank", "blank", ["upgrade", 11],]],
                        
                        ["display-text", function() {return "double confirmed"}]]
                },
            },
            otherStuff: {
                // There could be another set of microtabs here
            }
        },

        tooltip() { // Optional, tooltip displays when the layer is unlocked
            let tooltip = formatWhole(player[this.layer].points) + " " + this.resource
            return tooltip
        },
        shouldNotify() { // Optional, layer will be highlighted on the tree if true.
                         // Layer will automatically highlight if an upgrade is purchasable.
            return (player.p.buyables[11] == 1)
        }
})
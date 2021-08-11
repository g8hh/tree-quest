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
            unlocked: true,
            points: new Decimal(0),
            best: new Decimal(0),
            total: new Decimal(0),

            //Which "chapter" of the mod you're on - make a huge difference to certain layers
            chapter: "prologue",
            
            tanks: new Decimal(1), //Oxygen tanks - each gives 10 seconds of air

            //Fusebox
            fusebox_key: false, //Finding the fusebox key - unlocks fusebox in "m" layer
            fuses: new Decimal(0), //Total fuses found - can be used in the fusebox in "m" layer
            spent_fuses: new Decimal(0), //Total fuses used in the fusebox in "m" layer

            //Corridor Quests
            c6_fuse_retrieved: false, //Completing the "Retrieve Fuse" task in Corridor 6

            c7_vents_open: false, //Completing the "Open Side Vents" task in Corridor 7
            c3_tank_retrieved: false, //Completing the "Retrieve Oxygen Tank" task in Corridor 3

            c5_tamper_bypassed: false, //Tamper bypass activated in Corridor 5
            c4_failed_completion: false, //C4 completed without completing C5 placeholder first
            c4_fuse_retrieved: false, //Completing the "Remove Fuse from Wall" task in Corridor 4 successfully

            c8_reprogrammer_taken: false, //Picked up the key reprogrammer from Corridor 8

            c5_lock_scanned: false, //Scanned the lock in Corridor 5 using the reprogrammer
            c3_lock_analysed: false, //Analysed C5's lock at the reprogrammer terminal in Corridor 3
            c5_fuses_retrieved: false, //Retrieved the two fuses behind the lock in Corridor 5

            c1_holding_cable: false, //Picked up the auxiliary cable from Corridor 1
            c7_plugged_in: false, //Plugged the cable from Corridor 1 into the socket in Corridor 7
            c6_diagnostic_run: false, //Ran the garbage disposal diagnostic in Corridor 6
            c2_tank_retrieved: false, //Retrieved the oxygen tank from the garbage disposal in Corridor 2

            c6_filter_override: false, //Disabled the air filtration warning in Corridor 6
            c4_loose_wires: false, //Picked up the loose wires from Corridor 4
            c1_fan_disabled: false, //Disabled the overhead fan in Corridor 1
            c2_wires_fed: false, //Fed loose wires through the ceiling in Corridor 2
            c2_failed_completion: false, //Loose wires collided with fan in Corridor 1
            c2_unpowered_collision: false, //Loose wires collided with fan in Corridor 1, whilst unpowered
            c8_fuses_retrieved: false, //Completing the "Remove Fuses" task in Corridor 8


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

        maxOxygen() { //Returns the maximum amount of oxygen based on current total of tanks
            return player[this.layer].tanks.mul(10) //For now, base 10 seconds per tank
        },

        setCircuit(corridor, status) {  //One-line call to change circuit and recalculate total, takes corridor number (1-8) and status (0 or 1)
            player[this.layer].circuit_repaired[corridor] = new Decimal(status)
            layers[this.layer].sumCircuits()
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


        //Inventory formatting function
        formattedInventory() {
            inventoryArray = []

            //Oxygen tanks
            inventoryArray.push(['display-text', '<h2>Inventory</h2><br><br>You possess the following:<br>'])
            if (player.p.fusebox_key) inventoryArray.push(['display-text','The key to the fusebox in the Maintenance room.']);
            if (player.p.tanks.gt(0)) inventoryArray.push(['display-text', player.p.tanks + ' oxygen tank' + (player.p.tanks.gt(1)?'s':'') + ', granting ' + formatWhole(layers.p.maxOxygen()) + ' seconds of exploration time.']);
            if (player.p.fuses.add(player.p.spent_fuses).gt(0)) inventoryArray.push(['display-text', player.p.fuses.add(player.p.spent_fuses) + ' fuse' + (player.p.fuses.add(player.p.spent_fuses).gt(1)?'s':'') + ', ' + (player.p.fuses.eq(0)?'all ':'') + (player.p.spent_fuses.eq(0)?'none':player.p.spent_fuses) + ' of which are in use.']);
            if (player.p.c8_reprogrammer_taken) inventoryArray.push(['display-text', 'A handheld lock scanning device, only usable within the central corridor.']);


            return inventoryArray
        },

        formattedChallenges() {
            challengesArray = []

            challengesArray.push(['display-text', '<h2>Challenges</h2><br>'])

            return challengesArray
        },


        //Microtabs - for use with Story
        microtabs: {
            "Story": {
                "Introduction": {
                    content: [["display-text", "<br><h2>Introduction</h2><br><br>\n\
                    \"Quality maintenance is hard to find around there.\" That's apparently all the explanation HQ thought you needed, before shipping you off to a planet you'd never even heard of.\n\
                    Six days later, your ship arrived nose-first a couple of miles from the site after a close shave with an asteroid belt. It's in no state to fly any time soon, but this is a year-long assignment, so you weren't too concerned.\n\
                    You made your way to your residence- and workplace-to-be.<br><br>\n\
                    After checking in past the guards, and changing out of your flight suit into your maintenance overalls, the receptionist sent you straight to the service elevator, to check in with the onsite officer in the basement office.. No introduction, no explanation as to where you were or what this company even did.\n\
                    You thought you noticed a hint of urgency in her voice - maybe climate control in the boardroom was on the fritz.<br><br>\n\
                    As the elevator descended, what sounded like a rather concerning explosion shook the building. As it approached the bottom,  an odd smell filled the air and it became harder and harder for you to breathe.\n\
                    Pulling your shirt up over your mouth, you darted out of the elevator the moment it reached the bottom. Toxic fumes were billowing into the room, and rubble was everywhere. Anyone who was working down here had presumably managed to flee before the explosion hit.\n\
                    You managed to dive into the maintenance office - which, mercifully, still had clean air inside it - and seal the door behind you, before passing out.<br><br>\n\
                    When you came to, you surveyed the room. Most of the systems were offline, but a diagnostic panel was still functioning. From that you got a basic sense of the situation: power and life support to the building had failed after some kind of impact or explosion, and only basic systems were online.\n\
                    The entirety of the staff had evacuated, leaving you alone in a facility you'd arrived at today...assuming this was even still the same day. To make matters worse, the facility had automatically locked the basement down to contain the issue, and without power lifting the blast doors would be impossible. You were trapped down here.<br><br>\n\
                    Waiting seemed pointless, so you took a look through the schematics in the room. It looks as though the corridor surrounding this room houses the life support system - and if you could get that back online, you'd be able to set up some power generation from the components here.\n\
                    You managed to piece together a basic respirator, and found a portable air tank you could take with you. It'd only let you stay out for a few moments but it should be enough to start working on repairs. Better than waiting for a rescue that might never come."]]
                },
                "Prologue": {
                    content: [["display-text", "prologue story gaming"]],
                    unlocked() { return false } // To write this once the prologue is passable
                }
            }
        },

        //Tab layout
        tabFormat: {
            "Inventory": {
                content: function() {return layers.p.formattedInventory()},
            },
            "Story": {
                content: [
                    ["display-text","<h2>Story</h2>"],
                    ["microtabs", "Story"]
                ],
            },
/* Excluded because with no post-prologue content there's no need for challenges
            "Challenges": {
                content: function() {return layers.p.formattedChallenges()},
            }
*/
        },

        //Default functions, unknown if these are necessary
        convertToDecimal() {
            // Convert any layer-specific Decimal values (besides points, total, and best) from String to Decimal (used when loading save)
        },
        color:() => "#4B63DC",
        requires:() => new Decimal(0), // Can be a function that takes requirement increases into account
        resource: "prestige points", // Name of prestige currency
        baseResource: "points", // Name of resource prestige is based on
        baseAmount() {return player.points}, // Get the current amount of baseResource
        type: "none", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
        row: "side", // Row the layer is in on the tree (0 is the first row)
        effect() {
            return {} // Formulas for any boosts inherent to resources in the layer. Can return a single value instead of an object if there is just one effect
        },
        upgrades: {},
        doReset(resettingLayer){
            //never resets lmao
        },
        layerShown() {return true}, // Condition for when layer appears on the tree
        update(diff) {
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
            {key: "p", description: "P: open Personal menu", onPress(){player.tab = "p"}},
        ],
        incr_order: [], // Array of layer names to have their order increased when this one is first unlocked

        tooltip() { // Optional, tooltip displays when the layer is unlocked
            let tooltip = "Personal"
            return tooltip
        },
        shouldNotify() { // Optional, layer will be highlighted on the tree if true.
                         // Layer will automatically highlight if an upgrade is purchasable.
            return (player.p.buyables[11] == 1)
        }
})
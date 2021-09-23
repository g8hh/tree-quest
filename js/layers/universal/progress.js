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

            // Boolean to show if a "task" is underway - important for various time-related effects
            is_acting: false,

            //Which "chapter" of the mod you're on - make a huge difference to certain layers
            chapter: -1,

            // Prologue items
            id_card: false,
            elevator_key: false,
            
            tanks: new Decimal(0), //Oxygen tanks - each gives 10 seconds of air

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
            c5_incorrect_scan: false,   //C5 powered off after scanning
            c5_incorrect_tried: false,  //C5 tried with incorrect scan data
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

            chapter_0_two_tanks: 0, // Flag for whether or not "two tanks challenge" completed

            // Vertical tower
            seclock: 0, // The SECLOCK (Security Lock) authorisation level, allows for unlocking certain doors/tasks

            ni_box_position: "vt1r1",  // Position of the Neural Imprinting upgrade crate - either "vt1r1" for 1R layer, "vt1r2" for 1> layer, "vtb" for BF layer

            tools_owned: false,    // Tools (jack, screwdriver...and more?) collected from vt2r1 toolbox
            jack_used: false,   // Jack (above) in use in a doorway somewhere
            // Jack in-use toggles - now to be stored here so they don't reset
            pried_door_to_1r: false,
            pried_door_to_3l: false,
            pried_door_to_3lab: false,

            crowbar_owned: false,   // Crowbar retrieved from locker
            l2_door_forced: false,  // Door from 2L to 2< forced open with crowbar

            lab_device_pushed: false,   // Large device in the Laboratory pushed over the edge
            dropped_down: false,    // Dropped into Security - this will prevent softlocks

            // Swipe statuses: 0 for default, 1 for success, -1 for failure
            security_swipe_status: 0,   // Status of the Security Room's swipe (unlocks Security Room)
            museum_swipe_status: 0, // Status of the museum SecLock Terminal's swipe (controls ability to move Exosuit)
            third_floor_swipe_status: 0,   // Status of the 3F door's swipe (unlocks access to 3R) - name will likely change


            sm_suit_position: "vt2r2",  // Position of the Exosuit, defaults to Museum

            g1_part_owned: false,   // Generator part to fix G1 located
            g3_part_owned: false,   // Generator part to fix G3 located
            g5_part_owned: false,   // Generator part to fix G5 located
            g6_part_owned: false,   // Generator part to fix G6 located
            g7_part_owned: false,   // Generator part to fix G7 located

            // True Layer Activations
            neural_imprinting_active: false,
            suit_maintenance_active: false,

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
            inventoryArray.push(['display-text', '<h2>Inventory</h2><br><br>You possess the following:<br>'])

            // Prologue
            if (player["p"].id_card) inventoryArray.push (['display-text','A personal ID card, granting access to the facility.']);
            if (player["p"].chapter == -1 && player["p"].elevator_key && !player["pf2"].key_used) inventoryArray.push (['display-text','A nondescript key for the elevator, labelled "BF".']);

            // Chapter 0
            if (player.p.fusebox_key) inventoryArray.push(['display-text','The key to the fusebox in the Maintenance room.']);
            if (player.p.tanks.gt(0)) inventoryArray.push(['display-text', player.p.tanks + ' oxygen tank' + (player.p.tanks.gt(1)?'s':'') + ', granting ' + formatWhole(layers.p.maxOxygen()) + ' seconds of exploration time.']);
            if (player.p.fuses.add(player.p.spent_fuses).gt(0)) inventoryArray.push(['display-text', player.p.fuses.add(player.p.spent_fuses) + ' fuse' + (player.p.fuses.add(player.p.spent_fuses).gt(1)?'s':'') + ', ' + (player.p.fuses.eq(0)?'all ':'') + (player.p.spent_fuses.eq(0)?'none':player.p.spent_fuses) + ' of which are in use.']);
            if (player.p.c8_reprogrammer_taken) inventoryArray.push(['display-text', 'A handheld lock scanning device.']);

            // Chapter 1
            if (player.p.tools_owned) {
                inventoryArray.push(['display-text', 'A portable jack, used to hold up heavy objects.']);
                inventoryArray.push(['display-text', 'A flathead screwdriver.']);
            }

            if (player.p.g1_part_owned && player["g1"].generatorType == "broken") inventoryArray.push(['display-text', 'An electronic relay, retrieved from a damaged door lock.']);
            if (player.p.g3_part_owned && player["g3"].generatorType == "broken") inventoryArray.push(['display-text', 'An evaporator coil, salvaged from an air conditioning unit.']);
            if (player.p.g5_part_owned && player["g5"].generatorType == "broken") inventoryArray.push(['display-text', 'A voltage regulator, acquired from an unusual device you destroyed.']);
            if (player.p.g6_part_owned && player["g6"].generatorType == "broken") inventoryArray.push(['display-text', 'A rotary motor, salvaged from a broken fan.']);
            if (player.p.g7_part_owned && player["g7"].generatorType == "broken") inventoryArray.push(['display-text', 'An alternator, found alongside the neural imprinting gear.']);

            if (inventoryArray.length == 1) inventoryArray = [['display-text','Your inventory is currently empty.']];
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
                "Descent": {
                    content: [["display-text", function() { return interstitialList["chapter_0"].content }]],
                    unlocked() { return player["p"].chapter >= 0 }
                },
                "Stability": {
                    content: [["display-text", function() { return interstitialList["chapter_1"].content }]],
                    unlocked() { return player["p"].chapter >= 1 }
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
                unlocked() { return player["p"].chapter >= 0; }
            },
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
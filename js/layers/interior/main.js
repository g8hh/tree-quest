addLayer("mc", {
        layer: "mc", // This is assigned automatically, both to the layer and all upgrades, etc. Shown here so you know about it
        name: "Main Control", // This is optional, only used in a few places, If absent it just uses the layer id.
        symbol: "MC",
        startData() { return {
            unlocked: true,
            points: new Decimal(1),
            openDoors: new Decimal(0),
            buyables: {}, // You don't actually have to initialize this one
            clickables: {11: "OFF"},
            generatorLog: []
        }},
        convertToDecimal() {
            // Convert any layer-specific Decimal values (besides points, total, and best) from String to Decimal (used when loading save)
        },
        color: "#77bf5f",

        branches() {
            branchlist = ["g1","g2","g3","g4","g5","g6","g7","g8"]
            return branchlist
        },

        requires: new Decimal(0), // Can be a function that takes requirement increases into account
        resource: "power", // Name of prestige currency
        baseResource: "oxygen", // Name of resource prestige is based on
        baseAmount() {return player.points}, // Get the current amount of baseResource
        type: "none", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
        exponent: 0.5, // Prestige currency exponent
        base:() => 5, // Only needed for static layers, base of the formula (b^(x^exp))
        resCeil: false, // True if the cost needs to be rounded up (use when baseResource is static?)
        canBuyMax() {}, // Only needed for static layers with buy max
        gainMult() { // Calculate the multiplier for main currency from bonuses
            mult = new Decimal(0)
            return mult
        },
        gainExp() { // Calculate the exponent on main currency from bonuses
            return new Decimal(1)
        },
        row: 0, // Row the layer is in on the tree (0 is the first row)
        effect() {
            return {} // Formulas for any boosts inherent to resources in the layer. Can return a single value instead of an object if there is just one effect
        },

        tabFormat: [
            ['display-text','<h2>MAIN CONTROL</h2>'],
            "blank",
            ['display-text',`After reactivating life support, you took some time to explore the maintenance room. It appears this room serves as some form of central control for power and other critical systems.
            For now, as life support appears to be stable, you turned your focus to power generation.<br><br>
            From what you understand, the installation can produce its own power from a series of eight generators daisy-chained together. Between the damage to the building, and your own repairs to life support, the generators are functionally limited at best and outright broken at worst.
            If you can repair a couple of the generators, you should be able to produce a stable loop, though it'd only provide enough power for the first couple of floors of an installation this size.`],
            "blank",
            ['display-text',function() {
                text = `<h3>The generator loop is currently `;
                if (getClickableState(this.layer, 11) == "ON") text += `<span style='color: green'>ONLINE</span>.</h3>`;
                else text += `<span style='color: #bf8f8f'>OFFLINE</span>.</h3>`;
                return text;
            }],
            "blank",
            ['display-text',function() { return '<h3>Average power output: ' + format(player[this.layer].points) + '</h3>'; }],
            "blank",
            "clickables",
            "blank",
            ['display-text', function() {
                text = "<h3>LOG</h3><br>";

                for (entry in player[this.layer].generatorLog) {
                    text += "<br>" + player[this.layer].generatorLog[entry];
                }

                return text;
            }]
        ],

        clickables: {
            11: {
                title() {
                    return getClickableState(this.layer, this.id);
                },
                display() { 
                    if (getClickableState(this.layer,this.id) == "OFF") return "Click to turn ON.";
                    else return "Click to turn OFF."
                },
                canClick() { return true; },
                onClick() {
                    if (getClickableState(this.layer,this.id) == "OFF") {
                        setClickableState(this.layer, this.id, "ON");
                        player["g8"].points = new Decimal(100); // Initiate cycle with power to G8
                    }
                    else {
                        setClickableState(this.layer, this.id, "OFF");
                        // Drain power from all 8 gens
                        player["g1"].points = new Decimal(0);
                        player["g2"].points = new Decimal(0);
                        player["g3"].points = new Decimal(0);
                        player["g4"].points = new Decimal(0);
                        player["g5"].points = new Decimal(0);
                        player["g6"].points = new Decimal(0);
                        player["g7"].points = new Decimal(0);
                        player["g8"].points = new Decimal(0);
                        player["mc"].points = new Decimal(0);   // Set average to 0 too, important!
                        player["mc"].generatorLog = [];
                    }
                },
                style() {
                    if (getClickableState(this.layer, this.id) == "ON") color = "#77bf7f";
                    else color = "grey";
                    return {"background-color": color};
                }
            }
        },

        update(diff) {

            if (getClickableState(this.layer, 11) == "ON" && player["g8"].points.gt(0)) { // to replace with if power cycle active

                ///////////////////////////
                // POWER GENERATION LOOP //
                ///////////////////////////
                temp_power = player["g8"].points
                
                average_power = new Decimal(0);

                player[this.layer].generatorLog = [];

                for (l of ["g1","g2","g3","g4","g5","g6","g7","g8"]) {
                    if (temp_power.eq(0)) {
                        player[l].points = temp_power;
                    } else {
                        temp_power = temp_power.times(player[l].efficiency);
                        
                        player[this.layer].generatorLog.push (l + ": " + format(temp_power) + " power (" + player[l].efficiency * 100 + "% efficiency)");

                        temp_power = generatorTypes[player[l].generatorType].generate(temp_power).max(0);

                        player[this.layer].generatorLog.push(l + ": " + format(temp_power) + " power (" + generatorTypes[player[l].generatorType].effectDescription + ")");

                        player[l].points = temp_power;

                        average_power = average_power.add(temp_power);

                    }

                }

                average_power = average_power.div(8);

                if (player["g8"].points.eq(0)) {
                    average_power = new Decimal(0);
                    player[this.layer].generatorLog.push("<span style='color: #bf8f8f'>CRITICAL ERROR: Power loop unsustainable.</span>");
                }

                player[this.layer].points = average_power;

            }


        }, // Do any gameloop things (e.g. resource generation) inherent to this layer
        tooltip() { // Optional, tooltip displays when the layer is unlocked
            return this.name;
        },

        // Utility functions, might keep might ditch
        spark() {
            player[this.layer].points = new Decimal(100);
        },

        drain() {
            player[this.layer].points = new Decimal(0);
        },

})
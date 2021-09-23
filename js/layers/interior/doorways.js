addLayer("ind", {
    name: "North Doorway", //This is the layer one space above corridor 8, to rename when I know its purpose
    symbol: "ND", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
        points: new Decimal(0),
    }},
    color: "grey",
    branches: ["g1"],
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
    layerShown(){return true},

    tabFormat: [
        ["display-text", `<h2>NORTH DOORWAY</h2><br><br>
        <h3>WARNING</h3><br>
        Exterior atmospheric conditions are rated <span style='color: #bf8f8f'>[DEADLY]</span>.<br>
        Exosuit required for safe traversal.`]
    ],

    tooltip() { return layers[this.layer].name },
    tooltipLocked() { return layers[this.layer].name },

})

addLayer("ied", {
    name: "East Doorway", //This is the layer one space above corridor 8, to rename when I know its purpose
    symbol: "ED", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
        points: new Decimal(0),
    }},
    color: "grey",
    branches: ["g3"],
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
    layerShown(){return true},

    tabFormat: [
        ["display-text", `<h2>EAST DOORWAY</h2><br><br>
        <h3>WARNING</h3><br>
        Exterior atmospheric conditions are rated <span style='color: #bf8f8f'>[DEADLY]</span>.<br>
        Exosuit required for safe traversal.`]
    ],

    tooltip() { return layers[this.layer].name },
    tooltipLocked() { return layers[this.layer].name },

})

addLayer("iwd", {
    name: "West Doorway", //This is the layer one space above corridor 8, to rename when I know its purpose
    symbol: "WD", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
        points: new Decimal(0),
    }},
    color: "grey",
    branches: ["g7"],
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
    layerShown(){return true},

    tabFormat: [
        ["display-text", `<h2>WEST DOORWAY</h2><br><br>
        <h3>WARNING</h3><br>
        Exterior atmospheric conditions are rated <span style='color: #bf8f8f'>[DEADLY]</span>.<br>
        Exosuit required for safe traversal.`]
    ],

    tooltip() { return layers[this.layer].name },
    tooltipLocked() { return layers[this.layer].name },

})

addLayer("isd", {
    name: "South Doorway", //This is the layer one space above corridor 8, to rename when I know its purpose
    symbol: "SD", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
        points: new Decimal(0),
    }},
    color: "grey",
    branches: ["g5"],
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
    layerShown(){return true},

    tabFormat: [
        ["display-text", `<h2>SOUTH DOORWAY</h2><br><br>
        <h3>WARNING</h3><br>
        Exterior atmospheric conditions are rated <span style='color: #bf8f8f'>[DEADLY]</span>.<br>
        Exosuit required for safe traversal.`]
    ],

    tooltip() { return layers[this.layer].name },
    tooltipLocked() { return layers[this.layer].name },

})


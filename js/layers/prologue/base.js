addLayer("pbf", {
    layer: "pbf", // This is assigned automatically, both to the layer and all upgrades, etc. Shown here so you know about it
    symbol: "BF",
    name: "BASEMENT FLOOR", // This is optional, only used in a few places, If absent it just uses the layer id.
    startData() { return {
        unlocked: false,
        points: new Decimal(0),
        best: new Decimal(0),
        total: new Decimal(0),
        buyables: {}, // You don't actually have to initialize this one
        
        visited_ever: false, // Whether the player has ever been to this layer

    }},

    branches: ["pf2"],

    layerShown() {
        if (player["pf2"].visited_ever) return true;
        else return false;
    },
    
    update(diff) {

        if (player.tab == this.layer) {  // Looks like my summer vacation is...over
            player.interstitialName = "chapter_0";
            player.showInterstitial = true;
            showTab("m");
            showNavTab("chapter0");
        }

    },


    color: "gold",

    tooltip() { return this.name; },
    lockedTooltip() { return this.tooltip(); }

})
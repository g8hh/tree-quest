// THIS IS AN EMPTY NODE TO BALANCE OUT THE TREE, I HAVE NO IDEA IF I'LL KEEP IT LMAO

addLayer("ien", {
    name() {
        // "Suit Maintenance", //This is the layer one space above corridor 8, to rename when I know its purpose
        return "Empty Node";
    },
    symbol: "EN", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
        points: new Decimal(0),
    }},

    layerShown: "ghost",

})
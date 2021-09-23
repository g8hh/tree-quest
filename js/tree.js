var layoutInfo = {
    startTab: "prec",
    startNavTab: "prologue",
	showTree: true,

    treeLayout: ""

    
}


// A "ghost" layer which offsets other layers in the tree
addNode("blank", {
    layerShown: "ghost",
}, 
)

addLayer("prologue", {
    tabFormat: [["tree", [
        ["plab","pdec","pf3"],
        ["prec","pcor","pf2"],
        ["blank"],
        ["blank","blank","pbf"],
    ]]],

    previousTab: "",
    leftTab: true,
});

addLayer("chapter0", {
    tabFormat: [["tree", [
        ["c8","c1","c2"],
        ["c7","m","c3"],
        ["c6","c5","c4"],
    ]]],

    previousTab: "",
    leftTab: true,
});


addLayer("interior", {
    tabFormat: [["tree", [
        ["ism","ind","ini"],
        ["g8","g1","g2"],
        ["iwd","g7","mc","g3","ied"],
        ["ime","g6","g5","g4","ien"],
        ["isd"],
    ]]],

    previousTab: "",
    leftTab: true,
});

addLayer("vertical", {
    tabFormat: [["tree", [
        ["vt3l2","vt3l1","vt3","vt3r1","vt3r2"],
        ["vt2l2","vt2l1","vt2","vt2r1","vt2r2"],
        ["vt1l2","vt1l1","vt1","vt1r1","vt1r2"],
        ["vtb"]
    ]]]
})

/*
addLayer("northworld", {
    tabFormat: [["tree", [
        ["n3w2","n3w1","n3c","n3e1","n3e2"],
        ["n2w4","n2w3","n2w2","n2w1","n2c","n2e1","n2e2","n2e3","n2e4"],
        ["n1w3","n1w2","n1w1","n1c","n1e1","n1e2","n1e3"],
        ["n0w2","n0w1","n0c","n0e1","n0e2"],
    ]]],

    previousTab: "",
    leftTab: true,
});
*/
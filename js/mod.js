let modInfo = {
	name: "TreeQuest",
	id: "treequest-nova",
	author: "smiley#0443",
	pointsName: "oxygen",
	modFiles: [
		"tree.js",
		
		// Universal layers
		"layers/universal/progress.js",
		"layers/universal/help.js",

		// Chapter 0 interior layers
		"layers/chapter_0/main.js",
		"layers/chapter_0/corridor.js",

		// Main game interior layers
		"layers/interior/main.js",
		"layers/interior/generator.js",
		"layers/interior/doorways.js"

		// North layers
		],

		

	discordName: "",
	discordLink: "",
	initialStartPoints: new Decimal (10), // Used for hard resets and new players
	offlineLimit: 0,  // In hours
}

// Set your version in num and name
let VERSION = {
	num: "0.1.2-re",
	name: "Seedlings [CHAPTER 0]",
}

let changelog = `<h1>TreeQuest Changelog:</h1><br><br>

<h3>v0.1.2-re (Seedlings [CHAPTER 0])</h3><br>
 - Ports game to new version of TMT, with all associated technical changes<br>
 - Rearranges files under the hood to make things run more smoothly going forwards. Chapter 0 is still the prologue there's no new content yet sorry<br>
 - Uh...probably...still works? Yell at me if it's broken anything major, I tried to test it I promise<br><br>

<h3>v0.1.2 (TELL ME! [PROLOGUE])</h3><br>
 - Implements "notification" system<br>
 - All item pickups now give an "obtained item" notification<br><br>

<h3>v0.1.1 (Deathproof [PROLOGUE])</h3><br>
 - No longer forces you to return to Maintenance when oxygen runs out<br>
 - Maintenance layer now highlights when oxygen runs out<br><br>

<h3>v0.1 (Corridors of Time [PROLOGUE]) - First release</h3><br>
- Prologue content of the game (nine layers)<br>
- Help layer with four tabs<br>
- Personal layer with Inventory and Story tabs, with one Story entry`


//
let winText = `Congratulations! You have reached the end and beaten this game, but for now...`

// If you add new functions anywhere inside of a layer, and those functions have an effect when called, add them here.
// (The ones here are examples, all official functions are already taken care of)
var doNotCallTheseFunctionsEveryTick = [
	"setCircuit",
	"sumCircuits",
	"resetCircuits",
	"powerCycle",
	"powerBase",
	"formattedInventory",
	"formattedStory",
	"formattedChallenges"
];

function getStartPoints(){
    return new Decimal(modInfo.initialStartPoints)
}

// Determines if it should show points/sec
function canGenPoints(){
	return true
}

// Calculate points/sec!
function getPointGen() {
	if(!hasUpgrade("m", 11)) return new Decimal(0)
	let gain = new Decimal(upgradeEffect("m", 11))
	return gain
}

// You can add non-layer related variables that should to into "player" and be saved here, along with default values
function addedPlayerData() { return {
}}

// Display extra things at the top of the page
var displayThings = [
	function() { if(player.points.lte(0)) return "<span style='color: red'>You are out of oxygen - return to the Maintenance room!</span>"}
]

// Determines when the game "ends"
function isEndgame() {
	return (player.p.chapter == "Chapter 1");
}



// Less important things beyond this point!

// Style for the background, can be a function
var backgroundStyle = {

}

// You can change this if you have things that can be messed up by long tick lengths
function maxTickLength() {
	return(3600) // Default is 1 hour which is just arbitrarily large
}

// Use this if you need to undo inflation from an older version. If the version is older than the version that fixed the issue,
// you can cap their current resources with this.
function fixOldSave(oldVersion){
}

//Constants for buyable colours (I might put this elsewhere if there's a better place for it)
const buyableAvailableColour = '#CFEC23'
const buyableProgressColour = '#19FC3D'
const buyableLockedColour = '#bf8f8f'

//Function to determine if any of a layer's buyables are owned
function layerAnyBuyables(layer) {
	for(buyable in player[layer].buyables) {
		if(player[layer].buyables[buyable].gt(0)) return true
	}
	return false
}

//Function to begin game
function beginGame() {
	player.beginGame = true;
	showTab("none")
}

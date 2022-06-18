let modInfo = {
	name: "TreeQuest",
	id: "treequest-nova",
	author: "smiley#0432",
	pointsName: "oxygen",
	modFiles: [

		// Tree layouts
		"tree.js",
		
		// Prologue interior layers
		"layers/prologue/base.js",
		"layers/prologue/floor2.js",
		"layers/prologue/floor3.js",

		// Chapter 0 interior layers
		"layers/chapter_0/main.js",
		"layers/chapter_0/corridor.js",

		// Main game interior layers
		"layers/interior/main.js",
		"layers/interior/generator.js",
		"layers/interior/doorways.js",
		"layers/interior/neuralimprinting.js",
		"layers/interior/suitmaintenance.js",
		"layers/interior/emptynode.js",
		"layers/interior/mainelevator.js",

		// Vertical tower layers
		"layers/vertical/base.js",
		"layers/vertical/floor1.js",
		"layers/vertical/floor2.js",
		"layers/vertical/floor3.js",


		// Universal layers
		"layers/universal/progress.js",
		"layers/universal/help.js",
		"layers/universal/interstitial.js",


		// North layers
		],

		

	discordName: "",
	discordLink: "",
	initialStartPoints: new Decimal (10), // Used for hard resets and new players
	offlineLimit: 0,  // In hours
}

// Set your version in num and name
let VERSION = {
	num: "0.2.1-SR",
	name: "Generations/Historia",
}

let changelog = `<h1>TreeQuest Changelog:</h1><br><br>

<h3>v0.2.1-SR</h3><br>
Speedrun settings additions:
-Option to enable Speedrun Mode, which controls the following:<br>
-Times for each section are now stored and displayed<br>
-Additional breakpoint at NI layer<br><br>

<h3>v0.2.1 (Historia)<br>
Content additions:<br>
- Prologue section (chapter -1, lol): a brief introduction with 5-6 nodes, and a couple of tasks, set before/during the Chapter 0 story entry<br>
- Flavour text on interior and vertical nodes<br><br>
Technical changes:<br>
- Game clock now counts in real time, outside of interstitials
- Miscellaneous CSS changes<br><br>

<h3>v0.2.0 (Generations)<br>
Content additions:<br>
- Reworked Interior map after Chapter 0 complete<br>
- Second map representing vertical height<br>
- Basics of a generator system controlling power to the vertical rooms<br>
- A "neural imprint" challenge-like system, with two goals<br>
- Total additions (though not all of this is fleshed out, by any means): ~30 layers<br><br>
Technical changes:<br>
- Current layer now highlights in green<br>
- Rework of buyable "busy" processing (hopefully it didn't make things break)<br>
- Interstitial screen system implemented<br><br>

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
	"formattedChallenges",
	"spark",
	"drain"
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

	// Calm Mind effects
	if (player["ini"].calm_mind_alpha_active) gain = gain.mul(0.5);
	return gain
}

// You can add non-layer related variables that should to into "player" and be saved here, along with default values
function addedPlayerData() { 
	return {
		showInterstitial: true,
		interstitialName: "begin_game",
		interstitialTimes: [],
		usingOldSave: false,
	}
}

// Display extra things at the top of the page
var displayThings = [
	function() {
		if (player.points.lte(0)) return "<span style='color: #bf7f7f'>You are out of oxygen - return to the Maintenance room!</span>";
		else if (getPointGen().lt(0)) return "<span style='color: gold'>Hazard zone - oxygen will deplete steadily.</span>";  	
		else return "<span style='color: #77bf5f'>Safe zone - oxygen will not decrease.</span>";
	},
	]

// Determines when the game "ends"
function isEndgame() {

	// Hijacking this function to drop player into an interstitial instead
	if (player["p"].suit_maintenance_active) {
		player.interstitialName = "endgame";
		player.showInterstitial = true;
	}

//	return (player["p"].suit_maintenance_active);
	return false
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
	if (oldVersion.slice(0,3) == '0.1') {
		player.usingOldSave = true;
		if (confirm("This update has added content before the start of your previous playthrough. I *highly* recommend hard resetting - do you wish to do so?")) hardReset();
	}
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



// Setting to determine if current layer should be highlighted
var highlightCurrent = true;

// Function to amend the flow of time based on various conditions
// Alters the "diff" passed in to the main game loop

function timeControl(diff) {

	// Pause time if player is reading an interstitial page
	if (player.showInterstitial) return 0;

	//Pause time if the player is "dead" and hasn't returned "home" yet
	if(player.points.lte(0)) return 0;

	// When acting apply Time Compression effects
	if (player["p"].is_acting) {
		tc_mult = 1;
		if (player["ini"].time_comp_alpha_active) tc_mult *= 2;

		diff = diff * tc_mult;	// To replace with actual effect lmao
	} else {	// When NOT acting, apply Calm Mind effects
		cm_mult = 1;
		if (player["ini"].calm_mind_alpha_active) cm_mult *= 0.5;
//		diff = diff * cm_mult;	// Calm Mind will affect point drain instead
	}

	// Remember to return diff lmao
	return diff;
}

let modInfo = {
	name: "TreeQuest",
	id: "treequest",
	author: "smiley#0443",
	pointsName: "oxygen",
	discordName: "",
	discordLink: "",
	changelogLink: "https://github.com/IEmory/TreeQuest/blob/master/changelog.md",
    offlineLimit: 0,  // In hours
    initialStartPoints: new Decimal (10) // Used for hard resets and new players
}

var activeNotifications = [];
var notificationID = 0;

// Set your version in num and name
let VERSION = {
	num: "0.1.2",
	name: "TELL ME! [PROLOGUE]",
}

// If you add new functions anywhere inside of a layer, and those functions have an effect when called, add them here.
// (The ones here are examples, all official functions are already taken care of)
var doNotCallTheseFunctionsEveryTick = ["setCircuit","sumCircuits","resetCircuits","powerCycle","powerBase","formattedInventory","formattedStory","formattedChallenges"]

function getStartPoints(){
    return new Decimal(modInfo.initialStartPoints)
}

//Part of "power" generation - called by 8 layers so
function powerCycle(points,layer,efficiency,scaling) { //Given layer's effect on the power cycle
switch(player[layer].generatorType) {  //Check buyables on M node to determine what generator is where
	case 1: //Not sure what this will be yet
		potential_gain = points.add(points.log(1.05))
		break
	default:    //This is the standard case, when no generator module is applied
		potential_gain = points.add(10)
		break
	}
	return potential_gain.mul(efficiency).div(potential_gain.log(scaling))
}


// Determines if it should show points/sec
function canGenPoints(){
	return hasUpgrade("m", 11) && player.points.gt(0)
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
	// return true // So I can commit without people playing it
	// return false // So I can test
	return (player.p.chapter == "Chapter 1")
}



// Less important things beyond this point!

// You can change this if you have things that can be messed up by long tick lengths
function maxTickLength() {
	return(3600000) // Default is 1 hour which is just arbitrarily large
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
	showTab("tree")
}

//Function to show notifications
function addNotification(type="none",text="This is a test notification.",timer=3) {
	switch(type) {
		case "item":
			notificationTitle = "Obtained Item!";
			notificationType = "item-notification"
			break;
		case "challenge":
			notificationTitle = "CHALLENGE DO";
			notificationType = "challenge-notification"
			break;
		default:
			notificationTitle = "SOMETHING ELSE";
			notificationType = "default-notification"
			break;
	}
	notificationMessage = text;
	notificationTimer = timer; //Three seconds until vanishes

	activeNotifications.push({"time":notificationTimer,"type":notificationType,"title":notificationTitle,"message":notificationMessage,"id":notificationID})
	notificationID++;

	console.log(activeNotifications);
}


//Function to reduce time on active notification
function adjustNotificationTime(diff) {
	for(notification in activeNotifications) {
		activeNotifications[notification].time -= diff;
		if(activeNotifications[notification]["time"] < 0) {
			activeNotifications.shift();
		}
	}
}

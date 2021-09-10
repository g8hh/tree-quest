/*=================vv=============\\
|| INTERSTITIAL.JS ||             ||
>>=================//             ||
|| This file is NOT a layer file. ||
|| It contains HTML for any black ||
|| screens (e.g. game beginning)  ||
|| displayed in TreeQuest.        ||
||                                ||
|| This is also the source for    ||
|| the "story" entries on the     ||
|| P side layer.                  ||
\\================================*/

interstitialList = {
    
    "begin_game": {
        content: `<br>
        <h1>${modInfo.name}</h1><br><br>
        <h2>${VERSION.num} - ${VERSION.name}</h2><br><br>
        <h3>This mod is closer in parts to an adventure/puzzle game than an incremental. (As it stands, there are no incremental features yet)</h3><br>
        <h3>There's no offline progress, and early parts of the game are time-sensitive.</h3><br>
        <h3>Hopefully the gameplay is intuitive. If not, check the Help (H) layer, or press H on the keyboard, for assistance.</h3><br>
        <h3>Feel free to contact me on Discord (via either of the Modding Tree servers) for assistance, suggestions or bug reports - any input is appreciated!</h3><br><br>
        NOTE: saves from the DEV version are incompatible with this version.`,
        buttons: `<button class="longUpg can" onclick="closeInterstitial()">Begin</button>`,
    },

    "chapter_0": {
        content: `<br><h2>Descent</h2><br><br>
        "Quality maintenance is hard to find around there." That's apparently all the explanation HQ thought you needed, before shipping you off to a planet you'd never even heard of.
        Six days later, your ship arrived nose-first a couple of miles from the site after a close shave with an asteroid belt. It's in no state to fly any time soon, but this is a year-long assignment, so you weren't too concerned.
        You made your way to your residence- and workplace-to-be.<br><br>
        After checking in past the guards, and changing out of your flight suit into your maintenance overalls, the receptionist sent you straight to the service elevator, to check in with the onsite officer in the basement office. You haven't had an introduction yet, no explanation as to where you were or what this company even did.<br><br>
        As the elevator descended, what sounded like a rather concerning explosion shook the building. As it approached the bottom,  an odd smell filled the air and it became harder and harder for you to breathe.
        Pulling your shirt up over your mouth, you darted out of the elevator the moment it reached the bottom. Toxic fumes were billowing into the room, and rubble was everywhere. Anyone who was working down here had presumably managed to flee before the explosion hit.
        You managed to dive into the maintenance office - which, mercifully, still had clean air inside it - and seal the door behind you, before passing out.<br><br>
        When you came to, you surveyed the room. Most of the systems were offline, but a diagnostic panel was still functioning. From that you got a basic sense of the situation: power and life support to the building had failed after some kind of impact or explosion, and only basic systems were online.
        The entirety of the staff had evacuated, leaving you alone in a facility you'd arrived at today...assuming this was even still the same day. To make matters worse, the facility had automatically locked the basement down to contain the issue, and without power lifting the blast doors would be impossible. You were trapped down here.<br><br>
        Waiting seemed pointless, so you took a look through the schematics in the room. It looks as though the corridor surrounding this room houses the life support system - and if you could get that back online, you'd be able to set up some power generation from the components here.
        You managed to piece together a basic respirator, and found a portable air tank you could take with you. It'd only let you stay out for a few moments but it should be enough to start working on repairs. Better than waiting for a rescue that might never come.`,
        buttons: `<button class="longUpg can" onclick="closeInterstitial()">Proceed</button>`
    },        
    "chapter_1": {
        content: `<br><h2>Stability</h2><br><br>
        With a resounding CLUNK echoing around the corridors, the battered life support systems whirred back into life. Over the next few minutes, the miasma faded away, and before long the diagnostic sensors in Maintenance reported that air quality was back to normal.
        Unfortunately, in repairing the life support systems, you'd had to repurpose a few too many critical components of the main generators.
        Whilst systems on the lowest level were still working, most of the building - including the elevator - was still unpowered.<br><br>
        You thoroughly explored the basement, but couldn't locate anything suitable to repair the generators. There were, though, a number of places of interest - disused facilities, that may prove useful if you could get them up and running again.
        Your main priority at this point was to find help, either inside the facility or off-world. Nothing down here would help in that regard, so you'd need to make your way up the tower. You recalled seeing a large dish mounted near the top, likely a long-distance comms array - if you could reach that, you could get a message out to HQ, or anyone...
        `,
        buttons: `<button class="longUpg can" onclick="closeInterstitial()">Proceed</button>`
    },
    "neural_imprinting": {
        content: `<br><h2>Speedrun checkpoint - Neural Imprinting</h2><br><br>
        This is a breakpoint for the sake of convenience, to split up the long final section into two more manageable chunks (and give you another segment time).`,
        buttons: `<button class="longUpg can" onclick="closeInterstitial()">Proceed</button>`
    },
    "endgame": {
        content:`<br>
        <h1>${modInfo.name}</h1><br><br>
        <h2>${VERSION.num} - ${VERSION.name}</h2><br><br>
        <h3>You've reached the end of current content - congratulations!</h3><br>
        The next layers aren't properly implemented so you can't "keep going", but you're welcome to play again.<br><br>`,
        
        buttons: `<button class="longUpg can" onclick="hardReset(true)">Play Again</button> &nbsp &nbsp &nbsp <button class="longUpg can" onclick="exportSave()">Export Save</button>`
    }
}

function closeInterstitial() {
    player.interstitialTimes.push([player.interstitialName,player.timePlayed]);
    player.showInterstitial = false;

    switch(player.interstitialName) {   // Any setup that needs to be done as part of the chapter/interstitial change. Popups etc
        case "chapter_0":
            player["p"].chapter = 0;
            player["p"].tanks = player["p"].tanks.add(1);
            doPopup("item","Oxygen Tank");
            break;
        case "chapter_1":
            player["p"].chapter = 1;
            break;
    }
}
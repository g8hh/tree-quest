/*

 @name    : 锅巴汉化 - Web汉化插件
 @author  : 麦子、JAR、小蓝、好阳光的小锅巴
 @version : V0.6.1 - 2019-07-09
 @website : http://www.g8hh.com

*/

//1.汉化杂项
var cnItems = {
    _OTHER_: [],

    //未分类：
    'HARD RESET': '硬复位',
    'Export to clipboard': '导出到剪贴板',
    'Save': '保存',
    'You have': '你有',
    'Begin': '开始',
    'Changelog': '更新日志',
    'Play Again': '再玩一次',
    'Main Prestige Tree server': '主声望树',
    'Hotkeys': '快捷键',
    'Import': '导入',
    'oxygen': '氧气',
    'Currently': '当前',
    'MAINTENANCE': '维护',
    'Inventory': '库存',
    'You possess the following': '您拥有以下',
    'Introduction': '介绍',
    'You are ready to venture out.': '你准备好外出冒险了。',
    'Story': '故事',
    'Return and Rest': '返回和休息',
    'power': '能量',
    'Obtained Item!': '获得物品！',
    'CORRIDOR': '走廊',
    'Auxiliary Power Cable': '辅助电源线',
    'Fan Controls Locked Out': '风扇控制装置被锁定',
    'Fusebox Key': '保险丝盒钥匙',
    'Repair Circuit': '修复电路',
    'Grab Fusebox Key': '抓住保险丝盒钥匙',
    '[OXYGEN DEPLETING]': '[氧气消耗中]',
    'FUSEBOX': '保险丝盒',
    'Fusebox': '保险丝盒',
    'Overview': '概览',
    'Oxygen': '氧气',
    'Tasks': '任务',
    '[REFILLING OXYGEN]': '[重新充氧]',
    'Clogged Garbage Disposal': '垃圾堵塞处理',
    'Damaged Overhead Vent': '损坏的架空通风管',
    'Grab Loose Wires': '抓住松散的电线',
    'Lock Reprogrammer Station': '锁重编程器站',
    'Remove Fuse from Wall': '从墙上取下保险丝',
    'Fuse': '保险丝',
    'Scan Lock': '扫描锁',
    'What\'s in the vent?': '通风口里有什么?',
    '': '',
    '': '',
    '': '',
    '': '',
    '': '',
    '': '',
    '': '',
    '': '',
    '': '',
    '': '',
    '': '',
    '': '',
    '': '',
    '': '',
    '': '',
    '': '',
    '': '',
    '': '',
    '': '',
    '': '',
    '': '',
    '': '',
    '': '',
    '': '',
    '': '',
    'TreeQuest': '任务树',
    'P: open Personal menu': 'P:打开个人菜单',
    'M: Return to the Maintenance room': 'M:回到维修室',
    'H: open Help menu': 'H:打开帮助菜单',
    'The key to the fusebox in the Maintenance room.': '维护室保险丝盒的钥匙。',
    'A handheld lock scanning device, only usable within the central corridor.': '手持式锁定扫描设备，仅在中央走廊内使用。',
    'You can see something in the vent, but the steel cover is firmly in place...': '你可以看到通风口里有东西，但钢盖是牢固的……',
    ' Whoever was here before you was trying to crack the lock on the filtration circuit box, but it looks like they fled or worse before they had a chance to finish the job.': '在你之前来的人试图打开过滤电路盒的锁，但看起来他们在有机会完成任务之前就逃走了，甚至更糟。',
    ' There\'s an auxiliary power socket near the section to the south, that looks to still be in working order.': '在南边的部分有一个备用电源插座，看起来还能正常工作。',
    ' The source  of the atmospheric issues seems to be here. Toxic air is seeping in through the ventilation system, which is still pumping the fumes in despite the lack of power.': '大气问题的源头似乎就在这里。有毒空气正通过通风系统渗透进来，尽管没有动力，通风系统仍在将浓烟吸入室内。',
    ' The outer wall of the corridor is beginning to cave in, but it seems stable for the time being. The ground level vent and its override controls are still accessible, at a stretch.': '走廊的外墙开始塌陷，但目前看起来还算稳定。地面的通风口和它的超驰控制系统仍然可以进入。',
    ' The filtration system seems to be functional, and garbage control looks intact, though it would need additional power to function. All other systems are offline.': '过滤系统似乎还能正常工作，垃圾控制看起来也完好无损，不过它需要额外的动力才能发挥作用。所有其他系统都处于离线状态。',
    'The garbage disposal is jammed, by what appears to be a metal tank.': '垃圾处理机被一个金属水槽堵住了。',
    ' Many of the maintenance terminals in this section have been damaged - one in particular lies open, its innards exposed.': '这一区域的许多维护终端都已损坏，其中有一个终端是敞开的，其内部暴露在外。',
    'The vents in Corridors 3 and 7 are now open.': '3号和7号走廊的通风口已经打开。',
    'Unpowered Maintenance Terminal': '无动力维护终端',
    'Retrieve Fuse': '检索保险丝',
    'Pick up Reprogrammer': '拾取重编程器',
    'Override Filtration System': '覆盖过滤系统',
    'Open the side vents': '打开侧通风口',
    'Lock Reprogrammer': '锁定重新编程',
    'Filtration System Overridden': '过滤系统被覆盖',
    'Emergency System Circuit Box': '应急系统电路箱',
    'Auxiliary Power Inlet': '辅助电源入口',
    'A blank maintenance terminal, connected to an auxiliary power socket in Corridor 7.': '一个空白的维护终端,连接到一个辅助电源插座在走廊7中。',
    ' One of the overhead bulbs blinks out intermittently, distracting your eye. Otherwise, this section of corridor is quite intact.': '头顶上的一个灯泡会断断续续地闪烁，分散你的注意力。除此之外，这段走廊还是很完整的。',
    ' An electronic supply closet lies on the floor. Presumably someone was working here recently, before the incident.': '地板上有一个电子用品柜。应该有人最近在这里工作，就在事故发生之前。',
    'You are holding the live wires from the wall.': '您正在从墙上握住火线。',
    'The anti-tamper system has kicked in. You will need to wait or cycle power to the corridor to reset it.': '防篡改系统已经启动了。您将需要等待或循环电源到走廊重置它。',
    'The anti-tamper system has been bypassed.': '防破坏系统被绕过了。',
    'Locked Electronics Closet': '上锁的电器柜',
    'Bypass Tamper Security': '绕过防篡改安保',
    'A closet containing spare electrical components. The lock resets whenever the power is cycled.': '装有备用电器元件的壁橱。每当电源循环时，锁就会重置。',
    ' There\'s a massive hole in the ventilation pipe running above the northern corridors. It\'s not large enough to climb into, but you could reach up or feed something through.': '北部走廊上方的通风管道上有个大洞。它不够大，爬不进去，但你可以够到上面，或者塞东西进去。',
    ' The southeast corner of the corridor has suffered massive structural damage. The wall has crumbled away, revealing exposed, sparking wires.': '走廊的东南角已经遭受了大规模的结构破坏。墙塌了，露出了暴露的、冒着火花的电线。',
    ' The northeast corner of the corridor is in quite poor condition. The floor has been torn up in places and your footing is uneven.': '走廊的东北角条件很差。地板有几处被撕裂了，你的脚也不稳。',
    ' The ground level vent in the east wall looks to be in decent condition.': '东墙的地面通风口看起来状况良好。',
    ' The key reprogrammer terminal has fallen against the inner wall. It\'s on its side but still seems to be functioning perfectly.': '关键的重编程终端撞到内壁了。它在一边，但似乎仍然运作得很完美。',
    ' The garbage disposal unit on the eastern wall has seen better days, but should still operate in theory.': '东墙上的垃圾处理装置虽然风光不再，但理论上应该还能运作。',
    ' The eastern side of the corridor has been mostly untouched by the incident. There are superficial issues with the walls but nothing compromising.': '该走廊的东侧几乎未受该事件影响。墙壁有一些表面的问题，但没有任何妥协。',
    ' A circuit board ordinarily obscured by a panel is exposed as well - perhaps you can salvage something from it.': '通常被嵌板遮挡的电路板也会暴露出来——也许你可以从中抢救出一些东西。',
    ' Now you have the key to the fusebox, you can power other sections of the corridor. Hopefully you can find more fuses, and repair the life support system.': '现在你有了保险丝盒的钥匙，你可以给走廊的其他部分供电。希望你能找到更多保险丝，修复生命维持系统。',
    'is a puzzle-adventure game using The Modding Tree as an engine. Whilst there will [eventually] (meaning in later updates) be incremental features, a key gameplay component is (and will still be) exploration.': '是一款使用Modding树作为引擎的益智冒险游戏。虽然最终会出现(游戏邦注:即在之后的更新中)增量功能，但一个关键的游戏玩法组件是(并将仍然是)探索。',
    'Your primary resource in this game is your oxygen level. This number is an abstraction that represents the number of seconds you can spend outside the safe zone (whilst still allowing for you to return to safety afterwards).': '你在游戏中的主要资源是你的氧气水平。这个数字是一个抽象的数字，代表你可以在安全区域之外花费的秒数(同时也允许你在之后回到安全区域)。',
    'Your primary aim when enturing outside of the safe zone is to complete tasks. These tasks are represented in the form of buyables, and will all behave in a similar way. Tasks are colour-coded for easy recognition, as below': '当你冒险离开安全区时，你的主要目标是完成任务。这些任务以可购买的形式表示，并且都将以类似的方式运行。如下图所示，为了便于识别，任务用颜色编码',
    'Your objective will vary, but can always be found in the \'Personal\' node (the P in the side list). This tab contains various help topics, more of which will [eventually] be added as you progress.': '你的目标会有所不同，但总是可以在“个人”节点(侧栏的 P)中找到。此选项卡包含各种帮助主题，随着您的进展，将[最终]添加更多的帮助主题。',
    'You start with one fuse, in the Corridor 1 slot. You can click to remove this fuse, which will then allow you to place it in another corridor. As you find additional fuses, you can power multiple sections at once.': '你从走廊1号槽的一个保险丝开始。你可以点击来移除这个保险丝，这将允许你把它放在另一个走廊。当你发现额外的保险丝时，你可以一次为多个部分供电。',
    'You start the game with one oxygen tank, granting you a total of ten seconds\' venturing time. Finding additional tanks will increase this limit. [Eventually,] you may have the option to improve its efficiency.': '游戏一开始你只有一个氧气罐，总共给你10秒的冒险时间。找到额外的储罐会增加这个限制。[最终]你可以选择提高它的效率。',
    'You can only venture in powered sections. You can change which sections are powered whilst still in \'venture\' mode, but most tasks will reset if their section is powered off, or be uncompletable if a preceding section is. (There are exceptions to this. Whilst not required, they will let you \'sequence break\', so feel free to experiment!': '你只能在动力区里冒险。在“冒险”模式下，你可以改变哪个部分是通电的，但大多数任务会在断电后重置，或者在前一个部分断电后无法完成。(这也有例外。虽然不是必需的，但它们会让你“打破序列”，所以你可以自由尝试!',
    'When you venture out of safety and perform tasks, the oxygen level will decrease. Once it hits zero, you will need to return to the safe zone, where your oxygen will automatically refill.': '当你冒险离开安全地带去执行任务时，体内的氧气含量会下降。一旦它达到零，你就需要回到安全区域，在那里你的氧气会自动补充。',
    'The fusebox allows you to control power to the eight corridor sections around the central maintenance room. Each room is represented by a slot on the grid.': '通过保险丝盒控制中央维护室周围8个走廊段的电源。每个房间都由网格上的一个槽表示。',
    'The \'nodes\' on the main screen represent a map of the area you\'re in, as though viewed from above - each node is a room or a part of an area, and may contain items or tasks to complete.': '主屏幕上的“节点”代表你所处区域的地图，就像从上面看一样——每个节点是一个房间或一个区域的一部分，可能包含需要完成的项目或任务。',
    'Tasks that remain visible and green will have one or more related tasks to complete. In many cases, they will reset if you run out of oxygen or stop venturing out, so you will need to plan your route to ensure you can complete all the required tasks.': '保持可见和绿色的任务将有一个或多个相关的任务要完成。在很多情况下，如果你没有氧气或停止冒险，它们会重置，所以你需要计划你的路线，以确保你可以完成所有需要的任务。',
    'Tasks take your entire focus, so only one can be completed at a time - starting a task will turn the others in the area red. In addition, if you leave the area before a task has been completed, your progress will be lost!': '任务占用了你全部的注意力，所以一次只能完成一项任务——启动一项任务会使区域内的其他任务变成红色。此外，如果您在任务完成之前离开该区域，您的进度将丢失!',
    'Red: this task cannot be completed right now. This usually means you lack a necessary item or a pre-requisite task has not yet been completed. The text will usually give you an indication of what you need to do first.': '红色:此任务目前无法完成。这通常意味着你缺少一个必要的项目，或者一个先决的任务还没有完成。文本通常会提示你首先需要做什么。',
    'Once a task is completely finished with (if the task is stand-alone, or the final related task in the chain has been completed) its icon will disappear completely. Usually you will receive an item or [eventually] the gameplay will change in some way.': '一旦一个任务完全完成(如果该任务是独立的，或者链中的最终相关任务已经完成)，它的图标将完全消失。通常情况下，你会收到一个道具，或者游戏玩法会发生某些改变。',
    'Note: Use of [eventually] in these pages hints at functionality planned for a later update.': '注意：在这些页面中使用[最终]暗示了计划用于以后更新的功能。',
    'Green: this task has been completed. It remains visible, usually with a hint to a subsequent task it enables you to complete.': '绿色:任务已完成。它仍然是可见的，通常会提示您完成后续任务。',
    'Amber: this task is available to be completed. The description will state what the task will do and provide a duration in seconds. Once you begin the task it will fill green to show its progress.': '琥珀色:这个任务可以被完成。描述将说明任务将做什么，并提供以秒为单位的持续时间。一旦你开始这个任务，它就会填充绿色来显示它的进度。',
    'You have no fuses to place in this slot.': '这个槽里没有保险丝。',
    'You can venture out again once your reserves have refilled.': '一旦你的储备又满了，你可以再次冒险出去。',
    'You are out of oxygen - return to the Maintenance room!': '您没有氧气了-返回维护室！',
    ' A single fluorescent bulb flickers overhead, illuminating the northern section of the corridor. Rubble lines the floor - it seems part of the ceiling has collapsed here.': '一个荧光灯在头顶闪烁，照亮了走廊的北部。地板上布满了碎石，看起来天花板的一部分已经塌了。',
    ' A panel on the north wall controls the overhead ventilation fans. Beside it, lower down, is an auxiliary power cable - it should provide enough charge to power one system.': '北墙上的面板控制着上方的通风机。在它旁边，往下，是一条辅助电力电缆-它应该能提供足够的电量给一个系统供电。',
    ' A filing cabinet, once inside the maintenance room, lies on the floor, its contents spilled out.': '档案柜，一进入维修室，就倒在地板上，里面的东西全都洒了出来。',
    'Close the doors, and wait for oxygen to replenish.': '关上门，等待氧气补充。',
    'Your oxygen is steadily depleting. You will be forced to return here once it empties.': '你的氧气正在逐渐消耗。等它空了，你就得回到这里。',
    '1 oxygen tank, granting 10 seconds of exploration time.': '1个氧气瓶，给予10秒的探索时间。',
    'You\'ve reached the end of the "prologue".': '您已经到达“序幕”的结尾。',
    'Venture Out': '外出冒险',
    'Power and repair the life support system in all eight corridors to activate it.': '通电并维修所有八个走廊的生命支持系统，以将其激活。',
    'If you didn\'t already, try completing the game with only two oxygen tanks! You\'ll have to be a little creative to manage it in time.': '如果您还没有，请尝试仅使用两个氧气瓶来完成游戏！ 您必须要有一点创意才能及时进行管理。',
    'Open the door. Oxygen will steadily deplete.': '打开门。 氧气将稳步耗尽。',
    'Congrats on skipping one of the oxygen tanks! Did you do so intentionally?': '恭喜您跳过其中一个氧气瓶！ 您是故意这样做的吗？',
    'Hopefully the gameplay is intuitive. If not, check the Help (H) layer, or press H on the keyboard, for assistance.': '希望游戏玩法是直观的。 如果不是，请检查“帮助”（H）层，或按键盘上的H以获取帮助。',
    'There\'s no offline progress, and early parts of the game are time-sensitive.': '没有离线进度，并且游戏的早期部分对时间敏感。',
    'The next layers aren\'t properly implemented so you can\'t "keep going", but you\'re welcome to play again.': '下一层没有正确实现，因此您不能“继续前进”，但是欢迎您再次玩。',
    'This should be considered a prologue/demo - there\'s a fixed amount of gameplay.': '这应该被认为是一个序言/演示-有一个固定的数量的游戏。',
    'This mod is closer in parts to an adventure/puzzle game than an incremental. (As it stands, there are no incremental features yet': '这个mod在某种程度上更接近冒险/谜题游戏，而不是增量游戏。(目前，还没有增量的特性',
    'Loading... (If this takes too long it means there was a serious error!': '加载中……(如果这花费的时间太长，这意味着有一个严重的错误!',

    //原样
    '': '',
    '': '',

}


//需处理的前缀
var cnPrefix = {
    "(-": "(-",
    "(+": "(+",
    "(": "(",
    "-": "-",
    "+": "+",
    " ": " ",
    ": ": "： ",
    "\n": "",
    "                   ": "",
    "                  ": "",
    "                 ": "",
    "                ": "",
    "               ": "",
    "              ": "",
    "             ": "",
    "            ": "",
    "           ": "",
    "          ": "",
    "         ": "",
    "        ": "",
    "       ": "",
    "      ": "",
    "     ": "",
    "    ": "",
    "   ": "",
    "  ": "",
    " ": "",
    "Theme: ": "主题: ",
    "Offline Time": "离线时间",
    "Show Milestones:": "显示的里程碑:",
    "TreeQuest ": "任务树 ",
    "High-Quality Tree:": "高质量树：",
    "Dev Speed:": "开发速度：",
    "Autosave:": "自动保存：",
    "Completed Challenges:": "完成的挑战：",
    "Reach ": "达到 ",
    "Offline Prod:": "离线产出:",
    "It took you ": "这花费了你 ",
    "The Modding Tree ": "模型树",
    "[LIFE SUPPORT RING:": "[生命维持环:",
    "[OXYGEN FULL]": "[氧气充足]",
    "			Time Played: ": "游戏时长:",
    "			Original idea by papyrus (on discord)": "原始创意来自papyrus（在Discord上）",
    "			Changelog": "更新日志",
    "": "",
    "": "",
    "": "",
    "": "",
    "": "",
    "": "",
    "": "",
    "": "",
    "": "",
    "": "",
}

//需处理的后缀
var cnPostfix = {
    ":": "：",
    "：": "：",
    ": ": "： ",
    "： ": "： ",
    " ": "",
    "/s)": "/s)",
    "/s": "/s",
    ")": ")",
    "%": "%",
    "                   ": "",
    "                  ": "",
    "                 ": "",
    "                ": "",
    "               ": "",
    "              ": "",
    "             ": "",
    "            ": "",
    "           ": "",
    "          ": "",
    "         ": "",
    "        ": "",
    "       ": "",
    "      ": "",
    "     ": "",
    "    ": "",
    "   ": "",
    "  ": "",
    " ": "",
    "\n": "",
    " Fuse Slot": "保险丝槽",
    "TELL ME! [PROLOGUE]": "告诉我![前言]",
    ": Aqua": ": 浅绿色",
    ": Default": ": 默认",
    ": ALWAYS": ": 总是",
    ": AUTOMATION": ": 自动",
    ": INCOMPLETE": ": 部分",
    ": NEVER": ": 从不",
    "HIDDEN": "隐藏",
    "SHOWN": "显示",
    "ON": "开启",
    "OFF": "关闭",
    "/sec": "/秒",
    "": "",
    "": "",
    "": "",
    "": "",
    "": "",
    "": "",
    "Find the fusebox key from the scattered items in the corridor.": "从走廊里散落的物品中找到保险丝盒的钥匙。",
    "Note by Jacorb: If anyone wishes to make a mod of this game, that is perfectly fine with me, just make sure to name it something different (ex: Prestige Tree NG+) and to let me know on": "Jacorb的注意事项：如果有人希望制作这个游戏的mod，那对我来说完全没问题，请确保命名不同（例如：Prestige Tree NG +），并让我知道",
    " to beat the game.": " 去获得游戏胜利。",
}

//需排除的，正则匹配
var cnExcludeWhole = [
    /^x?\d+(\.\d+)?[A-Za-z%]{0,2}(\s.C)?\s*$/, //12.34K,23.4 °C
    /^x?\d+(\.\d+)?(e[+\-]?\d+)?\s*$/, //12.34e+4
    /^\s*$/, //纯空格
    /^\d+(\.\d+)?[A-Za-z]{0,2}.?\(?([+\-]?(\d+(\.\d+)?[A-Za-z]{0,2})?)?$/, //12.34M (+34.34K
    /^(\d+(\.\d+)?[A-Za-z]{0,2}\/s)?.?\(?([+\-]?\d+(\.\d+)?[A-Za-z]{0,2})?\/s\stot$/, //2.74M/s (112.4K/s tot
    /^\d+(\.\d+)?(e[+\-]?\d+)?.?\(?([+\-]?(\d+(\.\d+)?(e[+\-]?\d+)?)?)?$/, //2.177e+6 (+4.01+4
    /^(\d+(\.\d+)?(e[+\-]?\d+)?\/s)?.?\(?([+\-]?(\d+(\.\d+)?(e[+\-]?\d+)?)?)?\/s\stot$/, //2.177e+6/s (+4.01+4/s tot
];
var cnExcludePostfix = [
    /:?\s*x?\d+(\.\d+)?(e[+\-]?\d+)?\s*$/, //12.34e+4
    /:?\s*x?\d+(\.\d+)?[A-Za-z]{0,2}$/, //: 12.34K, x1.5
]

//正则替换，带数字的固定格式句子
//纯数字：(\d+)
//逗号：([\d\.,]+)
//小数点：([\d\.]+)
//原样输出的字段：(.+)
var cnRegReplace = new Map([
    [/^ After checking in past the guards, and changing out of your flight suit into your maintenance overalls, the receptionist sent you straight to the service elevator, to check in with the onsite officer in the basement office.. No introduction, no explanation as to where you were or what this company even did.\n(.+)You thought you noticed a hint of urgency in her voice - maybe climate control in the boardroom was on the fritz.$/, '经过保安的检查后，换掉飞行服换上维修工装，接待员直接把你送到服务电梯，到地下室办公室的现场工作人员那里办理登记手续。没有介绍，也没有解释你去了哪里或者公司做了什么。\n你觉得你在她的声音里发现了一丝急迫——也许董事会会议室的气候控制系统出故障了。'],
    [/^ As the elevator descended, what sounded like a rather concerning explosion shook the building. As it approached the bottom,  an odd smell filled the air and it became harder and harder for you to breathe.\n(.+)Pulling your shirt up over your mouth, you darted out of the elevator the moment it reached the bottom. Toxic fumes were billowing into the room, and rubble was everywhere. Anyone who was working down here had presumably managed to flee before the explosion hit.\n(.+)You managed to dive into the maintenance office - which, mercifully, still had clean air inside it - and seal the door behind you, before passing out.$/, '当电梯下降时，听起来像是一声相当令人担忧的爆炸震动了大楼。当它接近底部时，空气中弥漫着一种奇怪的气味，你呼吸起来越来越困难。\n你把衬衫拉起遮住嘴巴，电梯刚到底部，你就冲出了电梯。有毒的烟雾滚滚地进入房间，到处都是碎石。所有在这里工作的人大概都在爆炸发生前逃离了。\n你设法冲进了维修办公室——幸运的是，里面还有干净的空气——然后把身后的门封上了，然后昏倒了。'],
    [/^ Waiting seemed pointless, so you took a look through the schematics in the room. It looks as though the corridor surrounding this room houses the life support system - and if you could get that back online, you'd be able to set up some power generation from the components here.\n(.+)You managed to piece together a basic respirator, and found a portable air tank you could take with you. It'd only let you stay out for a few moments but it should be enough to start working on repairs. Better than waiting for a rescue that might never come.$/, '等待似乎没有意义，所以你看了一下房间里的图纸。看起来好像这个房间周围的走廊里有生命维持系统——如果你能把它恢复在线，你就可以用这里的组件来发电。\n你拼装了一个基本的呼吸器，还找到了一个可以随身携带的便携式氧气罐。它只能让你在外面呆一会儿，但应该足够开始修理了。总比等待可能永远不会到来的救援要好。'],
    [/^ When you came to, you surveyed the room. Most of the systems were offline, but a diagnostic panel was still functioning. From that you got a basic sense of the situation: power and life support to the building had failed after some kind of impact or explosion, and only basic systems were online.\n(.+)The entirety of the staff had evacuated, leaving you alone in a facility you\'d arrived at today...assuming this was even still the same day. To make matters worse, the facility had automatically locked the basement down to contain the issue, and without power lifting the blast doors would be impossible. You were trapped down here.$/, '当你醒过来的时候，你打量了一下房间。大多数系统都离线了，但一个诊断面板仍在工作。从这里你可以了解到基本的情况:建筑物的电力和生命支持系统在某种冲击或爆炸后发生了故障，只有基本的系统还在运行。\n所有的员工都撤离了，只留下你一个人在你今天到达的地方…假设这还是同一天。更糟糕的是，该设施已经自动锁住了地下室，以控制问题，如果没有动力，防爆门是不可能打开的。你被困在这里了。'],
    [/^ "Quality maintenance is hard to find around there." That's apparently all the explanation HQ thought you needed, before shipping you off to a planet you'd never even heard of.\n(.+)Six days later, your ship arrived nose-first a couple of miles from the site after a close shave with an asteroid belt. It's in no state to fly any time soon, but this is a year-long assignment, so you weren't too concerned.\n(.+)You made your way to your residence- and workplace-to-be.$/, '“质量维护在那里很难找到。”在把你送到一个你闻所未闻的星球之前，总部认为这就是你需要的所有解释。\n六天后，你的飞船在离事发地点几英里的地方与小行星带擦身而过。现在还不能飞，但这是一项长达一年的任务，所以你不用太担心。\n你找到了你将来的住处和工作地点。'],
    [/^ Life support in the majority of the facility has failed. You were the poor sap they sent to check out the fault, and whilst you were down here, it gave out entirely.\n(.+)Most of the facility has locked down to buy time for the occupants to evacuate, so you're unable to leave the area.$/, '大部分设施的生命维持系统都失灵了。你是他们派来检查故障的可怜的笨蛋，你在这里的时候，故障完全消失了。\n大部分设施已经封锁，为居民疏散争取时间，所以你无法离开该地区。'],
    [/^ Unfortunately, the power is also out in most of the surrounding corridor, making it impossible to see, much less use most of the systems. A single light illuminates the north part of the ring.\n(.+)If you can get into the fuse box you may be able to move the light around and explore...and with a little luck, finally repair the life support systems.$/, '不幸的是，周围大部分走廊也停电了，让人无法看到，更不用说使用大部分系统了。一盏灯照亮了环的北部。\n如果你能进入保险丝盒，你可能可以移动光周围和探索…运气好的话，最终修复了生命维持系统。'],
    [/^ Fortunately, you've managed to barricade yourself in the maintenance room, where the surplus oxygen is stored.\n(.+)There's a small oxygen tank in the room. With that, it should be possible to venture outside, if only for a few seconds at a time before returning to fill up again.$/, '幸运的是，你已经把自己关在了维护室里，那里储存着多余的氧气。\n房间里有一个小氧气罐。有了它，我们就可以到外面去冒险了，哪怕只有几秒钟的时间，然后再回去填满水。'],
    [/^Controls for the fan in the vent space above.\n(.+)The controls are locked out due to high air toxicity levels.$/, '控制上方排气空间中的风扇。\n由于严重的空气毒性，控制室被封锁在外。'],
    [/^([\d\.]+) second\)\n(.+)Pick up the end of the auxiliary power cable extending from the wall.$/, '$1秒\)\n将从墙上伸出的辅助电源电缆一端拾起。'],
    [/^([\d\.]+) seconds\)\n(.+)Bypass the anti-tamper system on the southern wall panels.$/, '$1秒\)\n绕过南部墙板上的防篡改系统。'],
    [/^([\d\.]+) seconds\)\n(.+)Open the electromagnetic vents in the corridors east and west of the maintenance room.$/, '$1秒\)\n打开维护室东西两侧走廊的电磁通风口。'],
    [/^([\d\.]+) seconds\)\n(.+)Remove a fuse from a damaged wall panel.$/, '$1秒\)\n从损坏的墙板上拆下保险丝。'],
    [/^([\d\.]+) second\)\n(.+)Pick up the handheld lock reprogrammer terminal.$/, '$1秒\)\n拿起手持锁重编程器终端。'],
    [/^([\d\.]+) seconds\)\n(.+)Pick up the handheld lock reprogrammer terminal.$/, '$1秒\)\n拿起手持锁重编程器终端。'],
    [/^([\d\.]+) seconds\)\n(.+)Scan the lock with the handheld reprogrammer.$/, '$1秒\)\n用手持式重编程器扫描锁。'],
    [/^([\d\.]+) seconds\)\n(.+)Damage to the wall has exposed live wiring. You could \(carefully\) pull it out some distance.$/, '$1秒\)\n墙上的损坏使带电电线露出来了。你可以\(小心地\)把它拉出一段距离。'],
    [/^([\d\.]+) seconds\)\n(.+)Repair the electronic and life support circuits in this corridor.$/, '$1秒\)\n修复这条走廊的电子和生命维持电路。'],
    [/^([\d\.]+) seconds\)\n(.+)Find the fusebox key from the scattered items in the corridor.\n(.+)Time remaining: ([\d\.]+) seconds.$/, '$1秒\)\n从走廊散落的物品中找到保险丝盒的钥匙。\n剩余时间: $4秒。'],
    [/^([\d\.]+) seconds\)\n(.+)Repair the electronic and life support circuits in this corridor.\n(.+)Time remaining: ([\d\.]+) seconds.$/, '$1秒\)\n修复这条走廊的电子和生命维持电路。\n剩余时间: $4秒。'],
    [/^([\d\.]+) second\)\n(.+)Pick up the end of the auxiliary power cable extending from the wall.\n(.+)Time remaining: ([\d\.]+) seconds.$/, '$1秒\)\n将从墙上伸出的辅助电源电缆一端拾起。\n剩余时间: $4秒。'],
    [/^([\d\.]+) second\)\n(.+)Pick up the handheld lock reprogrammer terminal.\n(.+)Time remaining: ([\d\.]+) seconds.$/, '$1秒\)\n拿起手持锁重编程器终端。\n剩余时间: $4秒。'],
    [/^([\d\.]+) second\)\n(.+)Scan the lock with the handheld reprogrammer.\n(.+)Time remaining: ([\d\.]+) seconds.$/, '$1秒\)\n用手持式重编程器扫描锁。\n剩余时间: $4秒。'],
    [/^([\d\.]+) seconds\)\n(.+)Scan the lock with the handheld reprogrammer.\n(.+)Time remaining: ([\d\.]+) seconds.$/, '$1秒\)\n用手持式重编程器扫描锁。\n剩余时间: $4秒。'],
    [/^([\d\.]+) seconds\)\n(.+)Pick up the handheld lock reprogrammer terminal.\n(.+)Time remaining: ([\d\.]+) seconds.$/, '$1秒\)\n拿起手持锁重编程器终端。\n剩余时间: $4秒。'],
    [/^([\d\.]+) seconds\)\n(.+)Remove a fuse from the southern wall panel.\n(.+)Time remaining: ([\d\.]+) seconds.$/, '$1秒\)\n从南墙板上拆下保险丝。\n剩余时间: $4秒。'],
    [/^([\d\.]+) seconds\)\n(.+)Remove a fuse from the southern wall panel.$/, '$1秒\)\n从南墙板上拆下保险丝。'],
    [/^([\d\.]+) seconds\)\n(.+)Remove a fuse from a damaged wall panel.\n(.+)Time remaining: ([\d\.]+) seconds.$/, '$1秒\)\n从损坏的墙板上拆下保险丝。\n剩余时间: $4秒。'],
    [/^([\d\.]+) seconds\)\n(.+)Bypass the anti-tamper system on the southern wall panels.\n(.+)Time remaining: ([\d\.]+) seconds.$/, '$1秒\)\n绕过南部墙板上的防篡改系统。\n剩余时间: $4秒。'],
    [/^([\d\.]+) seconds\)\n(.+)Open the electromagnetic vents in the corridors east and west of the maintenance room.\n(.+)Time remaining: ([\d\.]+) seconds.$/, '$1秒\)\n打开维护室东西两侧走廊的电磁通风口。\n剩余时间: $4秒。'],
    [/^([\d\.]+) seconds\)\n(.+)Disable the automatic filtration system.\n(.+)Life support is broken anyway, so what\'s the harm\?\n(.+)Time remaining: ([\d\.]+) seconds.$/, '$1秒\)\n关闭自动过滤系统。\n反正生命维持系统也坏了，又有什么害处呢?\n剩余时间: $4秒。'],
    [/^([\d\.]+) seconds\)\n(.+)Disable the automatic filtration system.\n(.+)Life support is broken anyway, so what\'s the harm\?$/, '$1秒\)\n关闭自动过滤系统。\n反正生命维持系统也坏了，又有什么害处呢?'],
    [/^([\d\.]+) seconds\)\n(.+)Damage to the wall has exposed live wiring. You could \(carefully\) pull it out some distance.\n(.+)Time remaining: ([\d\.]+) seconds.$/, '$1秒\)\n墙上的损坏使带电电线露出来了。你可以\(小心地\)把它拉出一段距离。\n剩余时间: $4秒。'],
    [/^Place fuses in the slots to provide power to that section of the corridor.\n(.+)Removing a fuse may revert certain changes.$/, '在槽里放上保险丝，为走廊的那部分供电。\n拆卸保险丝可能会恢复某些更改。'],
    [/^You have (.+) fuses available \((.+) total\).$/, '你有$1个可用的保险丝\(共$2个\)。'],
    [/^Corridor circuit repaired. If the corridor loses power, the circuit will break.\n(.+)Circuit components repaired: (.+)\/$/, '走廊电路修好了。如果走廊断电，电路就会断路。\n电路部件维修: $1\/'],
    [/^You are holding the power cable in your hand.\n(.+)The spring-loaded winch will retract it if you drop it.$/, '你手里拿着的是电力电缆。\n弹簧绞车会收回它，如果你丢下它的话。'],
    [/^(\d+) fuse\n(.+)Turns off the lights in corridor (\d+).$/, '$1 保险丝\n关闭$3号走廊的灯。'],
    [/^(\d+) fuse\n(.+)Turns on the lights in Corridor (\d+).$/, '$1 保险丝\n打开$3号走廊的灯。'],
    [/^You have (.+) fuse available \((.+) total\).$/, '你有 $1 个可用的保险丝\(共$2个\)。'],
    [/^A base station for reprogramming electronic locks.\n(.+)The handheld scanner and unlocker appears to be missing.$/, '为电子锁重新编程的基站。\n手持扫描仪和解锁器似乎失踪了。'],
    [/^The circuit box for the emergency systems.\n(.+)Should unlock if the sensor in the vents is shorted out.$/, '应急系统的电路箱。\n如果通风口中的传感器短路，则应解锁。'],
    [/^The filtration system has been overridden.\n(.+)Safety locks on fan controls are disabled.$/, '过滤系统被破坏了。\n风扇控制的安全锁被禁用。'],
    [/^An auxiliary power inlet connected to the maintenance terminal in Corridor 6.\n(.+)Perhaps there's a cable you can use nearby.$/, '辅助电源入口连接到6号走廊维护终端。\n也许附近有电缆你可以使用。'],
    [/^The overhead vent is damaged here.\n(.+)It runs across the north wall, towards Corridor 8.$/, '上面的通风口这里损坏了。\n它穿过北墙，通向8号走廊。'],
    [/^A base station for reprogramming electronic locks.\n(.+)If you scan a lock, you can analyse it here.$/, '为电子锁重新编程的基站。\n如果你扫描一个锁，你可以在这里分析它。'],
    [/^A closet containing spare electrical components. The lock resets whenever the power is cycled.\n(.+)Your reprogrammer has scanned the lock and is ready for analysis.$/, '装有备用电器元件的壁橱。每当电源循环时，锁就会重置。↵您的重新编程人员已经扫描了锁并准备好进行分析。'],
    [/^([\d\.]+) fuses, all ([\d\.]+) of which are in use.$/, '$1个保险丝，$2个都在使用中。'],
    [/^Cost: (.+) power\n(.+)$/, '成本：$1 能量'],
    [/^requires ([\d\.]+) more research points$/, '需要$1个研究点'],
    [/^(\d+) Royal points$/, '$1 皇家点数'],
    [/^Cost: (\d+) RP$/, '成本：$1 皇家点数'],
    [/^Usages: (\d+)\/$/, '用途：$1\/'],
    [/^workers: (\d+)\/$/, '工人：$1\/'],

]);
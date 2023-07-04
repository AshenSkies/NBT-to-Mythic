var input = "";
var NBTField = document.getElementById("NBTField");
var YAMLField = document.getElementById("YAMLField");
var nameField = document.getElementById("name");

const ItalicsRegExp = new RegExp('');
function buttonClick() {
    input = NBTField.value;
    if (!input) return YAMLField.value = "Error! Input is null.";
    try {
        parseData(input);
    } catch (error) {
        YAMLField.value = "Something went wrong. Check your input data?"
    }
  }

function parseData(e) {
    let ItemStack = e;
    let id = ItemStack.match(/(minecraft:)\w+/,'')[0].replace("minecraft:","");
    let displayRaw = ItemStack.match(/Name:'{"extra":\[[A-Za-z{}"=:_,#0-9 \\]*\]/)[0].replace(/Name:'/, '').slice(0,-1);
    displayRaw = displayRaw.match(/{[A-Za-z":_,#0-9 \\]*}/)
    let displayFormatting;
    let displayColor;
    let loreRaw = ItemStack.match(/Lore:\[[A-Za-z{}'":_,.?!;=#0-9 \[\]\\\-]*'\]/)[0].replace(/Lore:\[/, '').slice(0,-1);
    loreRaw = loreRaw.match(/\[[A-Za-z{}":_',.=?!#0-9 \\\-]*\]/g);
    let lore = [];
    let text;
    let segmentColor;
    let segres = [];
    let dispres = [];
    let MythicID = nameField.value;
    if (!nameField.value) MythicID = "resultingItem"
    MythicID = MythicID.replaceAll(" ","_")
    let yaml = MythicID + ":\n" + "  Id: " + id;

    for (var dsegment of displayRaw) {
        displayFormatting = dsegment.match(/"text":[A-Za-z":_,#0-9 \\]+/)[0].replace(/"text":"/, '').slice(0,-1);
        if(/"italic":true,/.test(dsegment)) displayFormatting = "<i>" + displayFormatting
        if(/"bold":true,/.test(dsegment)) displayFormatting = "<b>" + displayFormatting
        if(/"underlined":true,/.test(dsegment)) displayFormatting = "<u>" + displayFormatting
        if(/"strikethrough":true,/.test(dsegment)) displayFormatting = "<st>" + displayFormatting
        if(/"obfuscated":true,/.test(dsegment)) displayFormatting = "<obf>" + displayFormatting
        displayColor = dsegment.match(/"color":"[#a-z_0-9]*"/i)[0].replace(/"color":"/, '').slice(0,-1);
        displayFormatting = `<${displayColor}>` + displayFormatting;
        dispres.push(displayFormatting)
    }
    dispres = "\n  Display: " + dispres.join("")
    yaml = yaml + dispres

    for (var line of loreRaw) {
        for (var segment of line.match(/{[A-Za-z":_,'.?!=;#0-9 \\\-]*}/g)) {
            text = segment.match(/"text":[A-Za-z":_,'.?!=;#0-9 \\\-]+/)[0].replace(/"text":"/, '').slice(0,-1)
            if(/"italic":true,/.test(segment)) text = "<i>" + text
            if(/"bold":true,/.test(segment)) text = "<b>" + text
            if(/"underlined":true,/.test(segment)) text = "<u>" + text
            if(/"strikethrough":true,/.test(segment)) text = "<st>" + text
            if(/"obfuscated":true,/.test(segment)) text = "<obf>" + text
            segmentColor = segment.match(/"color":"[#a-z_0-9]*"/i);
            if(segmentColor) segmentColor = segmentColor[0].replace(/"color":"/, '').slice(0,-1);
            else segmentColor = "red"
            text = `<${segmentColor}>` + text;
            text = `    - '${text}'`
            segres.push(text)
        }
    }
    segres = "\n  Lore:\n" + segres.join("\n")
    yaml = yaml + segres
    YAMLField.value = (yaml)
}
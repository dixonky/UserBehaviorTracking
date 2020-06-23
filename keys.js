var ascii = {
    '188': '44',
    '109': '45',
    '190': '46',
    '191': '47',
    '192': '96',
    '220': '92',
    '222': '39',
    '221': '93',
    '219': '91',
    '173': '45',
    '187': '61', //IE Key codes
    '186': '59', //IE Key codes
    '189': '45'  //IE Key codes
};

var spChars = {
    "96": "~",
    "49": "!",
    "50": "@",
    "51": "#",
    "52": "$",
    "53": "%",
    "54": "^",
    "55": "&",
    "56": "*",
    "57": "(",
    "48": ")",
    "45": "_",
    "61": "+",
    "91": "{",
    "93": "}",
    "92": "|",
    "59": ":",
    "39": "\"",
    "44": "<",
    "46": ">",
    "47": "?"
};

function getKey( shift,key) {
    "use strict";
    if (ascii.hasOwnProperty(key)) {
        key = ascii[key];
    }

    if (!shift && key >= 65 && key <= 90) {
        key = String.fromCharCode(key + 32);
    } else if (shift && spChars.hasOwnProperty(key)) {
        key = spChars[key];
    } else {
        key = String.fromCharCode(key);
    }
    return key;
}
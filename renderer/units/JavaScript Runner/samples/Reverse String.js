let string = "AaĀā❤愛爱애💜";
let reversedString = Array.from (string).reverse ().join ("");
let strings = string + "\n" + reversedString;
$.notify (strings, () => { $.writeln (strings); });

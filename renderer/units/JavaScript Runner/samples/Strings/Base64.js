// Base64
let string = "AaĀā❤愛爱애💜";
$.writeln ("String:", string);
let base64 = Buffer.from (string).toString ('base64');
$.writeln ("Base64:", base64);
let utf8 = Buffer.from (base64, 'base64').toString ('utf8');
$.writeln ("UTF-8:", utf8);

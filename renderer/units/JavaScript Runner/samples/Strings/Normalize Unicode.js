// Normalize Unicode
let string = "애";
$.writeln (string);
$.writeln (string.normalize ('NFC'), string.normalize ('NFD'), string.normalize ('NFKC'), string.normalize ('NFKD'));

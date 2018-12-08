//
// References:
// http://blog.stevenlevithan.com/archives/javascript-roman-numeral-converter
// https://www.selftaughtjs.com/algorithm-sundays-converting-roman-numerals/
// https://stackoverflow.com/questions/9083037/convert-a-number-into-a-roman-numeral-in-javascript
// https://stackoverflow.com/questions/267399/how-do-you-match-only-valid-roman-numerals-with-a-regular-expression
//
let lookup = // Sorted by decimal in descending order
[
    { roman: "M", decimal: 1000 },
    { roman: "CM", decimal: 1000 - 100 },
    { roman: "D", decimal: 500 },
    { roman: "CD", decimal: 500 - 100 },
    { roman: "C", decimal: 100 },
    { roman: "XC", decimal: 100 - 10 },
    { roman: "L", decimal: 50 },
    { roman: "XL", decimal: 50 - 10 },
    { roman: "X", decimal: 10 },
    { roman: "IX", decimal: 10 - 1 },
    { roman: "V", decimal: 5 },
    { roman: "IV", decimal: 5 - 1 },
    { roman: "I", decimal: 1 }
];
//
module.exports.romanToArabic = function (roman)
{
    let arabic = "";
    roman = roman.trim ();
    if (roman && roman.match (/^M{0,3}(CM|CD|D?C{0,3})(XC|XL|L?X{0,3})(IX|IV|V?I{0,3})$/))
    {
        let decimal = 0;
        for (let pair of lookup)
        {
            while (roman.startsWith (pair.roman))
            {
                decimal += pair.decimal;
                roman = roman.slice (pair.roman.length);
            }
        }
        arabic = decimal.toString ();
    }
    return arabic;
};
//
module.exports.arabicToRoman = function (arabic)
{
    let roman = "";
    arabic = arabic.trim ();
    if (arabic.match (/^\d+$/))
    {
        let decimal = parseInt (arabic, 10);
        if ((decimal > 0) && (decimal < 4000))
        {
            for (let pair of lookup)
            {
                while (decimal >= pair.decimal)
                {
                    roman += pair.roman;
                    decimal -= pair.decimal;
                }
            }
        }
    }
    return roman;
};
//

// Spawn (Async)
const { spawn } = require ('child_process');
const owner = 'tonton-pixel';
const repository = 'vade-mecum-shelf';
const url = `https://api.github.com/repos/${owner}/${repository}/releases`;
let curl = spawn ('curl', [ '-s', url ]);
curl.on ('error', (err) => { $.clear (); $.writeln (err); });
let string = "";
curl.stdout.setEncoding ('utf8');
curl.stdout.on ('data', (chunk) => { string += chunk; });
curl.stdout.on
(
    'end',
    () =>
    {
        if (string)
        {
            $.clear ();
            let whitelist = [ "name", "assets", "download_count", "size" ];
            $.write ($.stringify (JSON.parse (string), whitelist, 4));
        }
    }
);
$.writeln ("Please wait...");

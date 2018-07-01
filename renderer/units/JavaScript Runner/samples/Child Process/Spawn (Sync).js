// Spawn (Sync)
const { spawnSync } = require ('child_process');
const owner = 'tonton-pixel';
const repository = 'vade-mecum-shelf';
const url = `https://api.github.com/repos/${owner}/${repository}/releases/latest`;
let curl = spawnSync ('curl', [ '-s', url ], { encoding: 'utf8' });
if (curl.error)
{
    $.write (curl.error);
}
else
{
    let whitelist = [ "name", "assets", "download_count", "size" ];
    $.write ($.stringify (JSON.parse (curl.stdout), whitelist, 4));
}

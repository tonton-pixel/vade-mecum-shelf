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
    let release = JSON.parse (curl.stdout);
    let filteredRelease = { };
    filteredRelease.name = release.name;
    let filteredAssets = [ ];
    for (let asset of release.assets)
    {
        filteredAssets.push
        (
            { name: asset.name, download_count: asset.download_count }
        );
    }
    filteredRelease.assets = filteredAssets;
    $.write ($.stringify (filteredRelease, null, 4));
}

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
            let releases = JSON.parse (string);
            let filteredReleases = [ ];
            for (let release of releases)
            {
                if (!release.prerelease)
                {
                    let filteredRelease = { };
                    filteredRelease.name = release.name;
                    let assets = release.assets;
                    let filteredAssets = [ ];
                    for (let asset of assets)
                    {
                        let filteredAsset = { };
                        filteredAsset.name = asset.name;
                        filteredAsset.download_count = asset.download_count;
                        filteredAssets.push (filteredAsset);
                    }
                    filteredRelease.assets = filteredAssets;
                    filteredReleases.push (filteredRelease);
                }
            }
            $.clear ();
            $.write ($.stringify (filteredReleases, null, 4));
        }
    }
);
$.writeln ("Please wait...");

// Fetch Electron Releases
const owner = 'electron';
const repository = 'electron';
const url = `https://api.github.com/repos/${owner}/${repository}/releases`;
fetch (url)
.then (response => response.json ())
.then
(
    releases =>
    {
        $.clear ();
        releases.filter (release => !release.prerelease).forEach (release => $.writeln (release.name));
    }
)
.catch ($.writeln);
//
$.writeln ("Please wait...");

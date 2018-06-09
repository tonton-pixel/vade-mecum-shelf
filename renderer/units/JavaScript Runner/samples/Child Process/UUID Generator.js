// UUID Generator
const { spawnSync } = require ('child_process');
let uuidgen = spawnSync ('uuidgen', { encoding: 'utf8' });
return uuidgen.error || uuidgen.stderr || uuidgen.stdout.trim ().toLowerCase ();

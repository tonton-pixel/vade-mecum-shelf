//
const unit = document.getElementById ('cidr-calculator-unit');
//
const cidrInput = unit.querySelector ('.cidr-input');
const cidrSample = unit.querySelector ('.cidr-sample');
const ipRangeOutput = unit.querySelector ('.ip-range-output');
//
const ipRangeInput = unit.querySelector ('.ip-range-input');
const ipRangeSample = unit.querySelector ('.ip-range-sample');
const cidrListOutput = unit.querySelector ('.cidr-list-output');
//
const references = unit.querySelector ('.references');
const links = unit.querySelector ('.links');
//
module.exports.start = function (context)
{
    const defaultPrefs =
    {
        cidrInput: "",
        ipRangeInput: "",
        references: false
    };
    let prefs = context.getPrefs (defaultPrefs);
    //
    const cidr = require ('./cidr.js');
    //
    function getIpRange (string)
    {
        let ips = cidr.cidrToIps (string.trim ());
        ipRangeOutput.value = ips ? ips.join (" - ") : "";
    }
    cidrSample.textContent = "192.0.0.1/25";
    getIpRange (cidrInput.value = prefs.cidrInput);
    cidrInput.addEventListener ('input', (event) => { getIpRange (event.currentTarget.value); });
    //
    function getCidrList (string)
    {
        let cidrs = cidr.ipRangeToCidrs (string.trim ());
        cidrListOutput.value = cidrs ? cidrs.join ("\n") : "";
    }
    ipRangeSample.textContent = "192.168.1.1 - 192.168.1.12";
    getCidrList (ipRangeInput.value = prefs.ipRangeInput);
    ipRangeInput.addEventListener ('input', (event) => { getCidrList (event.currentTarget.value) });
    //
    references.open = prefs.references;
    //
    const refLinks = require ('./ref-links.json');
    const linksList = require ('../../lib/links-list.js');
    //
    linksList (links, refLinks);
};
//
module.exports.stop = function (context)
{
    let prefs =
    {
        cidrInput: cidrInput.value,
        ipRangeInput: ipRangeInput.value,
        references: references.open
    };
    context.setPrefs (prefs);
};
//

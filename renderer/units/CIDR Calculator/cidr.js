//
function int32ToBytes (int32)
{
    return [ (int32 >>> 24) & 0xFF, (int32 >>> 16) & 0xFF, (int32 >>> 8) & 0xFF, (int32 >>> 0) & 0xFF ];
}
function bytesToInt32 (bytes)
{
    return (((((bytes[0] * 256) + bytes[1]) * 256) + bytes[2]) * 256) + bytes[3];
}
function buildMask (size)
{
    return size ? -1 << (32 - size) : 0;
}
function applyMask (ip32, mask)
{
    // Unfortunately, cannot simply use:
    // return ip32 & mask;
    // since JavaScript bitwise operations deal with 32-bit *signed* integers...
    let ipBytes = int32ToBytes (ip32);
    let maskBytes = int32ToBytes (mask);
    let maskedBytes = [ ];
    for (let index = 0; index < ipBytes.length; index++)
    {
        maskedBytes.push (ipBytes[index] & maskBytes[index]);
    }
    return bytesToInt32 (maskedBytes);
}
function ip32ToIp (ip32)
{
    let ip = false;
    if ((typeof ip32 === 'number') && isFinite (ip32))
    {
        ip = int32ToBytes (ip32 & 0xFFFFFFFF).join ('.');
    }
    return ip;
}
function ipToIp32 (ip)
{
    let ip32 = false;
    if (typeof ip === 'string')
    {
        let matches = ip.match (/^(\d+)\.(\d+)\.(\d+)\.(\d+)$/);
        if (matches)
        {
            let ipBytes = [ ];
            for (let index = 1; index < matches.length; index++)
            {
                let ipByte = parseInt (matches[index]);
                if ((ipByte >= 0) && (ipByte <= 255))
                {
                    ipBytes.push (ipByte);
                }
            }
            if (ipBytes.length === 4)
            {
                ip32 = bytesToInt32 (ipBytes);
            }
        }
    }
    return ip32;
}
module.exports.cidrToIps = function (cidr)
{
    let ips = false;
    if (typeof cidr === 'string')
    {
        let matches = cidr.match (/^(\d+\.\d+\.\d+\.\d+)\/(\d+)$/);
        if (matches)
        {
            let ip32 = ipToIp32 (matches[1]);
            let prefixSize = parseInt (matches[2]);
            if ((typeof ip32 === 'number') && (prefixSize >= 0) && (prefixSize <= 32))
            {
                let mask = buildMask (prefixSize);
                let start = applyMask (ip32, mask);
                ips = [ ip32ToIp (start), ip32ToIp (start - mask - 1) ];
            }
        }
    }
    return ips;
};
//
function ipRangeToIps (ipRange)
{
    let ips = false;
    if (typeof ipRange === 'string')
    {
        let matches = ipRange.match (/^(\d+\.\d+\.\d+\.\d+)\s*[,;:\-]\s*(\d+\.\d+\.\d+\.\d+)$/);
        if (matches)
        {
            ips = [ matches[1], matches[2] ];
        }
    }
    return ips;
}
function maxBlock (ip32)
{
    let block = 32;
    while (block > 0)
    {
        if ((ip32 >>> (32 - block)) & 0x00000001)
        {
            break;
        }
        else
        {
            block--;
        }
    }
    return block;
}
function ipsToCidrs (firstIp, lastIp)
{
    let cidrs = false;
    if ((typeof firstIp === 'string') && (typeof lastIp === 'string'))
    {
        let firstIp32 = ipToIp32 (firstIp);
        let lastIp32 = ipToIp32 (lastIp);
        if (firstIp32 <= lastIp32)
        {
            cidrs = [ ];
            while (lastIp32 >= firstIp32)
            {
                let maxSize = maxBlock (firstIp32);
                let maxDiff = 32 - Math.floor (Math.log (lastIp32 - firstIp32 + 1) / Math.log (2));
                let size = Math.max (maxSize, maxDiff);
                cidrs.push (ip32ToIp (firstIp32) + "/" + size);
                firstIp32 += Math.pow (2, (32 - size));
            }
        }
    }
    return cidrs;
}
module.exports.ipRangeToCidrs = function (ipRange)
{
    let cidrs = false;
    let ips = ipRangeToIps (ipRange);
    if (ips)
    {
        cidrs = ipsToCidrs (ips[0], ips[1]);
    }
    return cidrs;
};
//

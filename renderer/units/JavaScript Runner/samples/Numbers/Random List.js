// Random List
// Construct a list of n random integers from min to max
// random () returns a uniformly distributed random number in [0, 1[
function randomList (n, min, max)
{
    let list = [ ];
    for (let i = 0; i < n; i++)
    {
        list[i] = Math.floor (Math.random () * (max - min + 1)) + min;
    }
    return list;
}
return randomList (100, 1, 10).join (", ");

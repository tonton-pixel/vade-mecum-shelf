//
const duration = 200;
const easing = function (t) { return t * t * t * ((t * ((t * 6) - 15)) + 10); }; // Smootherstep
//
function scrollTo (element, to)
{
    let from = element.scrollTop;
    if (from !== to)
    {
        let start = window.performance.now ();
        let step = function (timestamp)
        {
            let progress = timestamp - start;
            if (progress > 0)
            {
                let percent = Math.min (progress / duration, 1);
                percent = easing (percent);
                element.scrollTop = from + ((to - from) * percent);
            }
            if (progress < duration)
            {
                  window.requestAnimationFrame (step);
            }
        };
        window.requestAnimationFrame (step);
    }
}
//
module.exports.toTop = function (element)
{
    scrollTo (element, 0);
};
//
module.exports.toBottom = function (element)
{
    scrollTo (element, element.scrollHeight - element.clientHeight);
};
//

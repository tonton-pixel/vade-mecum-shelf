//
const unit = document.getElementById ('digital-clock-unit');
//
const title = unit.querySelector ('.title');
const clock = unit.querySelector ('.clock');
const dateText = unit.querySelector ('.date');
const timeText = unit.querySelector ('.time');
const selectLocale = unit.querySelector ('.select-locale');
const selectEra = unit.querySelector ('.select-era');
const selectYear = unit.querySelector ('.select-year');
const selectMonth = unit.querySelector ('.select-month');
const selectDay = unit.querySelector ('.select-day');
const selectWeekday = unit.querySelector ('.select-weekday');
const selectHour12 = unit.querySelector ('.select-hour12');
const selectHour = unit.querySelector ('.select-hour');
const selectMinute = unit.querySelector ('.select-minute');
const selectSecond = unit.querySelector ('.select-second');
const selectTimeZoneName = unit.querySelector ('.select-timezonename');
//
const references = unit.querySelector ('.references');
const links = unit.querySelector ('.links');
//
module.exports.start = function (context)
{
    const json = require ('../../lib/json2.js');
    //
    const defaultPrefs =
    {
        selectLocale: "",
        selectEra: "undefined",
        selectYear: "numeric",
        selectMonth: "long",
        selectDay: "numeric",
        selectWeekday: "long",
        selectHour12: "false",
        selectHour: "numeric",
        selectMinute: "numeric",
        selectSecond: "numeric",
        selectTimeZoneName: "short",
        references: false
    };
    let prefs = context.getPrefs (defaultPrefs);
    //
    let timeZone = Intl.DateTimeFormat ().resolvedOptions ().timeZone;
    //
    selectLocale.value = prefs.selectLocale;
    if (selectLocale.selectedIndex < 0) // -1: no element is selected
    {
        selectLocale.selectedIndex = 0;
    }
    let currentLocale = selectLocale.value;
    selectLocale.addEventListener ('input', (event) => { currentLocale = event.currentTarget.value; updateClock (new Date ()); });
    //
    function parseOption (optionString)
    {
        let option;
        if (optionString === 'undefined')
        {
            option = undefined;
        }
        else if (optionString === 'false')
        {
            option = false;
        }
        else if (optionString === 'true')
        {
            option = true;
        }
        else
        {
            option = optionString;
        }
        return option;
    }
    // 
    function stringifyOption (option)
    {
        let optionString;
        if (typeof option === 'undefined')
        {
            optionString = 'undefined';
        }
        else if (typeof option === 'boolean')
        {
            optionString = option.toString ();
        }
        else
        {
            optionString = option;
        }
        return optionString;
    }
    // 
    let dateOptions =
    {
        era: parseOption (prefs.selectEra),
        year: parseOption (prefs.selectYear),
        month: parseOption (prefs.selectMonth),
        day: parseOption (prefs.selectDay),
        weekday: parseOption (prefs.selectWeekday)
    };
    //
    selectEra.value = stringifyOption (dateOptions.era);
    selectEra.addEventListener ('input', (event) => { dateOptions.era = parseOption (event.currentTarget.value); updateClock (new Date ()); });
    //
    selectYear.value =  stringifyOption (dateOptions.year);
    selectYear.addEventListener ('input', (event) => { dateOptions.year = parseOption (event.currentTarget.value); updateClock (new Date ()); });
    //
    selectMonth.value = stringifyOption (dateOptions.month);
    selectMonth.addEventListener ('input', (event) => { dateOptions.month = parseOption (event.currentTarget.value); updateClock (new Date ()); });
    //
    selectDay.value = stringifyOption (dateOptions.day);
    selectDay.addEventListener ('input', (event) => { dateOptions.day = parseOption (event.currentTarget.value); updateClock (new Date ()); });
    //
    selectWeekday.value = stringifyOption (dateOptions.weekday);
    selectWeekday.addEventListener ('input', (event) => { dateOptions.weekday = parseOption (event.currentTarget.value); updateClock (new Date ()); });
    //
    let timeOptions =
    {
        hour12: parseOption (prefs.selectHour12),
        hour: parseOption (prefs.selectHour),
        minute: parseOption (prefs.selectMinute),
        second: parseOption (prefs.selectSecond),
        timeZoneName: parseOption (prefs.selectTimeZoneName)
    };
    //
    selectHour12.value = stringifyOption (timeOptions.hour12);
    selectHour12.addEventListener ('input', (event) => { timeOptions.hour12 = parseOption (event.currentTarget.value); updateClock (new Date ()); });
    //
    selectHour.value = stringifyOption (timeOptions.hour);
    selectHour.addEventListener ('input', (event) => { timeOptions.hour = parseOption (event.currentTarget.value); updateClock (new Date ()); });
    //
    selectMinute.value = stringifyOption (timeOptions.minute);
    selectMinute.addEventListener ('input', (event) => { timeOptions.minute = parseOption (event.currentTarget.value); updateClock (new Date ()); });
    //
    selectSecond.value = stringifyOption (timeOptions.second);
    selectSecond.addEventListener ('input', (event) => { timeOptions.second = parseOption (event.currentTarget.value); updateClock (new Date ()); });
    //
    selectTimeZoneName.value = stringifyOption (timeOptions.timeZoneName);;
    selectTimeZoneName.addEventListener ('input', (event) => { timeOptions.timeZoneName = parseOption (event.currentTarget.value); updateClock (new Date ()); });
    //
    // Cloning options is necessary since toLocaleDateString () and toLocaleTimeString () modify their options "behind the scenes" 
    // in two cases:
    // - if the weekday, year, month and day properties are all undefined, then year, month, and day are assumed to be "numeric".
    // - if the hour, minute and second properties are all undefined, then hour, minute, and second are assumed to be "numeric".
    // Note: no actual modification occurs in Firefox or in Safari...
    function cloneOptions (options)
    {
        let clone = { };
        for (let property in options)
        {
            if (options.hasOwnProperty (property) && (typeof options[property] !== 'undefined'))
            {
                clone[property] = options[property];
            }
        }
        return clone;
    }
    //
    function dateString (date)
    {
        return date.toLocaleDateString (currentLocale, cloneOptions (dateOptions));
    }
    //
    function timeString (date)
    {
        return date.toLocaleTimeString (currentLocale, cloneOptions (timeOptions));
    }
    //
    function updateClock (date)
    {
        clock.lang = currentLocale;
        dateText.textContent = dateString (date);
        dateText.title = `new Date ().toLocaleDateString ("${currentLocale}", ${json.stringify (dateOptions)})`;
        timeText.textContent = timeString (date);
        timeText.title = `new Date ().toLocaleTimeString ("${currentLocale}", ${json.stringify (timeOptions)})`;
    }
    //
    title.textContent = timeZone;
    //
    let start = new Date ();
    updateClock (start);
    //
    function periodicFunction ()
    {
        let now = new Date ();
        if (now.getSeconds () !== start.getSeconds ())
        {
            updateClock (now);
            start = now;
        }
    }
    window.setInterval (periodicFunction, 1000 / 25);
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
        selectLocale: selectLocale.value,
        selectEra: selectEra.value,
        selectYear: selectYear.value,
        selectMonth: selectMonth.value,
        selectDay: selectDay.value,
        selectWeekday: selectWeekday.value,
        selectHour12: selectHour12.value,
        selectHour: selectHour.value,
        selectMinute: selectMinute.value,
        selectSecond: selectSecond.value,
        selectTimeZoneName: selectTimeZoneName.value,
        references: references.open
    };
    context.setPrefs (prefs);
};
//

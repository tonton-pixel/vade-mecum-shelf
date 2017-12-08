//
const unitId = 'http-status-codes-unit';
//
const unit = document.getElementById (unitId);
//
const codesContainer = unit.querySelector ('.codes-container');
const selectLocale = unit.querySelector ('.select-locale');
//
module.exports.start = function (context, getPrefs)
{
    const defaultPrefs = { selectLocale: "" };
    let prefs = getPrefs (defaultPrefs);
    //
    const codes = require ('./codes.json');
    //
    let table = document.createElement ('table');
    for (let categoryIndex = 0; categoryIndex < codes.length; categoryIndex++)
    {
        let tr0 = document.createElement ('tr');
        let th = document.createElement ('th');
        th.setAttribute ('colspan', 3);
        let category = codes[categoryIndex]["category"];
        for (let locale in category)
        {
            let span = document.createElement ('span');
            span.className = locale;
            span.lang = locale;
            span.textContent = category[locale];
            th.appendChild (span);
        }
        tr0.appendChild (th);
        table.appendChild (tr0);
        let items = codes[categoryIndex]["items"];
        for (let item of items)
        {
            let tr = document.createElement ('tr');
            let td0 = document.createElement ('td');
            let td1 = document.createElement ('td');
            let td2 = document.createElement ('td');
            td0.className = 'code';
            td0.textContent = item["code"];
            td1.className = 'message';
            td1.textContent = item["message"];
            let alt = item["alt"];
            if (alt)
            {
                td1.title = alt;
            }
            let protocol = item["protocol"];
            td2.className = 'meaning';
            let meaning = item["meaning"];
            for (let locale in meaning)
            {
                let span = document.createElement ('span');
                span.className = locale;
                span.lang = locale;
                span.textContent = ((protocol) ? `[${protocol}] ` : "") + meaning[locale];
                td2.appendChild (span);
            }
            tr.appendChild (td0);
            tr.appendChild (td1);
            tr.appendChild (td2);
            table.appendChild (tr);
        }
    }
    codesContainer.appendChild (table);
    //
    let style = document.createElement ('style');
    document.head.appendChild (style);
    //
    function getLocalesCSS (selectLocale, localeValue)
    {
        let localesCSS = '';
        for (let locale of selectLocale.options)
        {
            localesCSS += `#${unitId} .${locale.value} { display: ${ (locale.value === localeValue) ? 'inline' : 'none' }; } `;
        }
        return localesCSS;
    }
    //
    selectLocale.value = prefs.selectLocale;
    if (selectLocale.selectedIndex < 0) // -1: no element is selected
    {
        selectLocale.selectedIndex = 0;
    }
    let currentLocale = selectLocale.value;
    style.textContent = getLocalesCSS (selectLocale, currentLocale);
    selectLocale.addEventListener ('input', (event) => { style.textContent = getLocalesCSS (selectLocale, event.target.value); });
};
//
module.exports.stop = function (context, setPrefs)
{
    setPrefs ({ selectLocale: selectLocale.value });
};
//

# Release Notes

This project adheres to [Semantic Versioning](https://semver.org/).

## 2.5.3

- Improved display of monospaced fonts on Linux by adding "DejaVu Sans Mono" to the font stack.
- Updated Help menu.
- Updated documentation.
- Updated `Electron` to version `8.2.4`.

## 2.5.2

- Updated `Electron` to version `8.2.3`.

## 2.5.1

- Fixed 1 low severity vulnerability.
- Updated `Electron` to version `8.2.1`.

## 2.5.0

- Updated `Electron` to version `8.2.0`.

## 2.4.5

- Cleaned up some code.
- Fixed 1 moderate severity vulnerability on GitHub.

## 2.4.4

- Updated `Electron` to version `8.1.1`.

## 2.4.3

- Updated `Unicode Release Dates` and `Emoji Release Dates` of the **Technical Definitions** utility.
- Used text cursor for all user-selectable text.
- Improved user text selection.
- Reorganized CSS code architecture.
- Updated `Electron` to version `8.0.2`.

## 2.4.2

- Updated `Unicode Release Dates` and `Emoji Release Dates` of the **Technical Definitions** utility.
- Updated `Electron` to version `8.0.1`.

## 2.4.1

- Updated `KaTeX` to version `0.11.1`.
- Updated `Electron Packager` to version `14.2.1`.

## 2.4.0

- Revamped the zoom level actions (`Actual Size`, `Zoom In`, `Zoom Out`) of the `View` menu.
- Updated `Electron` to version `8.0.0`.

## 2.3.8

- Updated release notes (CHANGES.md).
- Updated `Electron` to version `7.1.11`.

## 2.3.7

- Added release notes (CHANGES.md).
- Updated `Electron` to version `7.1.10`.

## 2.3.6

- Enabled opening of external links in SVG graphs.
- Updated `Electron` to version `7.1.9`.
- Updated `Electron Packager` to version `14.2.0`.

## 2.3.5

- Fixed opening of invalid anchors.
- Updated `Electron` to version `7.1.8`.

## 2.3.4

- Fixed missing closing tag in svg file.
- Fixed app timestamp date.
- Updated copyright years.

## 2.3.3

- Added lists of `Unicode Release Dates` and `Emoji Release Dates` to the **Technical Definitions** utility.
- Updated handling of default smart zoom setting.
- Updated `Electron` to version `7.1.7`.

## 2.3.2

- Fixed removal of menu bar in license window on Linux.
- Updated `Electron` to version `7.1.5`.

## 2.3.1

- Updated `Electron` to version `7.1.4`.

## 2.3.0

- Replaced deprecated HTML Imports with explicit reading of HTML files and dynamic templates.
- Updated `Electron` to version `7.1.3`.

## 2.2.6

- Renamed license HTML file to prevent licensing ambiguity on GitHub.
- Updated `Electron` to version `7.1.2`.
- Updated `Electron Packager` to version `14.1.1`.

## 2.2.5

- Updated `Electron` to version `7.1.1`.

## 2.2.4

- Updated `Electron` to version `7.0.1`.
- Updated `Electron Packager` to version `14.1.0`.

## 2.2.3

- Fixed issues in `<input type="search">` fields by reverting `Electron` to version `6.1.1`.

## 2.2.2

- Replaced deprecated `get` functions with equivalent properties.
- Displayed custom menu bar as early as possible.
- Improved styling of disabled drop-down menus.
- Updated `Electron` to version `7.0.0`.

## 2.2.1

- Updated lists of `Computing Abbreviations` and `Mac OS Release Names` in the **Technical Definitions** utility.
- Used distinct background color for user text selection.
- Updated `Electron` to version `6.0.11`.
- Updated `Electron Packager` to version `14.0.6`.

## 2.2.0

- Updated minimum size of main window to more consistent values for width and height.
- Added System Version to the system information copied to clipboard.
- Fixed incorrect build date in About dialog.
- Added Japanese to the **Chemical Elements** utility.
- Updated screenshot accordingly.
- Updated list of `Computing Abbreviations` in the **Technical Definitions** utility.
- Fixed syntax of `--asar` option of `electron-packager` in `package.json`.
- Updated `KaTeX` to version `0.11.0`.
- Updated `Electron` to version `6.0.7`.
- Updated `Electron Packager` to version `14.0.5`.

## 2.1.0

- Added `KaTeX` CSS style sheet dynamically.
- Fixed issue when launching second instance of app on macOS.
- Added release dates as tooltips to the list of `Mac OS Release Names`.
- Updated the list of `Computing Abbreviations`.
- Updated `Electron` to version `6.0.0`.
- Added missing `--asar` option for `electron-packager`.

## 2.0.1

- Added `XKCD Color Names` to the **Color Names** utility.
- Updated `Mac OS Release Names` in the **Technical Definitions** utility. 
- Added `Unicode` and `ICU` versions to the system information copied to clipboard.
- Fixed window icon in Linux.
- Updated `Electron` to version `5.0.3`.

## 2.0.0

- Moved the following utilities to a new app named [Tutti Quanti Shelf](https://github.com/tonton-pixel/tutti-quanti-shelf):
    - **CIDR Calculator**
    - **CSS Cursors Demo**
    - **Digital Clock**
    - **IETF Language Tags**
    - **JavaScript Parser**
    - **JavaScript Runner**
    - **JSON Formatter**
    - **LaTeX Math Renderer**
    - **Roman Numerals**
    - **System Information**
    - **Text Converter**
- Updated `Electron` to version `5.0.2`.

## 1.13.0

- Added **CSS Cursors Demo** utility.
- Improved pop-up menus: positioning, visual feedback.
- Fixed use of proper current target in event listeners.
- Cleaned up code: used consistent string delimiters.
- Increased font size of trigonometric formulas.
- Updated technical definitions.
- Updated `KaTeX` to version `0.10.2`.
- Updated `Electron` to version `4.2.2`.

## 1.12.2

- Updated `Electron` to version `4.1.5`: added support for the new Japanese Era Reiwa (令和) to JavaScript date/time formatting APIs used by the **Digital Clock** utility.
- Updated reference links.
- Cleaned up code.

## 1.12.1

- Updated lists of ISO country codes, language codes, script codes.
- Updated **JavaScript Parser** utility sample scripts.
- Updated `Electron` to version `4.1.3`.

## 1.12.0

- Added new utility: **JavaScript Parser**, based on `Esprima`.
- Updated `KaTeX` to version `0.10.1`
- Updated `Electron` to version `4.1.1`.

## 1.11.0

- Fixed unwanted menu bar in child window on Linux.
- Updated `Electron` to version `4.0.8`.

## 1.10.3

- Used child window to display app license.

## 1.10.2

- Fixed `Electron Packager` high severity vulnerability warning on install.
- Added new command in Developer menu: `Copy System Info to Clipboard`.
- Removed **Text Scratchpad** utility.
- Added `Fetch Promise` sample script.
- Updated README.md file.
- Cleaned up code.

## 1.10.1

- Improved the **Chinese Zodiac** table legibility.

## 1.10.0

- Added the **Chinese Zodiac** utility.

## 1.9.0

- Added two new utilities: **Chemical Elements** and **Text Converter**.
- Added min and max zoom levels.
- Added zoom factor to window title.
- Added new fields to the **System Information** utility.
- Added new computing abbreviation to the **Technical Definitions** utility.
- Improved JSON format for reference links.
- Updated `Electron` and `KaTeX` links.
- Updated `KaTeX` version.

## 1.8.6

- Updated `Electron` to version `3.0.2`.
- Worked around maximized window bug on start-up on macOS.
- Forced focus to cleared text fields.
- Prevented scroll chaining in text areas.
- Allowed user's text selection explicitely.
- Added new sample of LaTeX formula.
- Added heap statistics to the **System Information** utility.
- Added one new technical definition sample.

## 1.8.5

- Fixed issues of `Electron` framework related to input fields.

## 1.8.4

- Moved the following utilities to a new dedicated app called [Unicopedia Plus](https://github.com/tonton-pixel/unicopedia-plus):
    - **Emoji Data Finder**
    - **Emoji Picture Book**
    - **Unicode Data Finder**
    - **Unicode Inspector**

## 1.8.3

- Switched to external NPM packages for some emoji-related modules.
- Added minor code improvements.

## 1.8.2

- Upgraded `Electron` framework.
- Upgraded `KaTeX` library.
- Improved opening of links in external browser.
- Moved reference links to separate JSON files.
- Constrained vertical resizing of text areas in the **Emoji Data Finder** and the **Unicode Inspector** utilities.
- Fixed missing emoji at some font sizes in the **Emoji Picture Book** utility.
- Added an HTML sample to the **LaTeX Math Renderer** utility.
- Added new computing abbreviations and fixed typos in the **Technical Definitions** utility.

## 1.8.1

- Minor changes:
    - Added a font size slider in the **Emoji Picture Book** utility.
    - Added a subtle texture to the background of the **Jabberwocky** utility.
    - Added category selectors to the **Technical Definitions** and the **Trigonometric Formulas** utilities.
    - Improved the pagination bar of the **Unicode Data Finder** utility.
    - Added binary properties and name correction alias to the Unicode character data, used in the **Unicode Data Finder** and the **Unicode Inspector** utilities.

## 1.8.0

- Added the **Unicode Data Finder** utility: basic data of Unicode characters found by name.
- Added search options to the **Emoji Data Finder** utility: *Whole Word* and *Regular Expression* (ES6). 
- Improved the **Unicode Inspector** utility:
	- Changed the type of *Characters* fields to multiline so that they can accept line breaks and other control characters.
	- Added a *Filter* button next to the *Code Points* input field, to keep only valid code sequences and convert them to standard U+ code point format.
	- Added the *Alias* name field to the list of character properties (used to be a *Name* tooltip).

## 1.7.0

- Added the **Emoji Data Finder** utility: data (short name, keywords, code) of Unicode emoji characters extracted from a string.
- Fixed problem of few missing pictures in the **Emoji Picture Book** utility.
- Updated `Unicode` data to current version `11.0.0`.

## 1.6.0

- Added the **Emoji Picture Book** utility: lists of Unicode emoji characters, by group `(Smileys & People`, `Animals & Nature`, `Food & Drink`, `Travel & Places`, `Activities`, `Objects`, `Symbols`, `Flags`).
- Added new data in the **System Information** utility.
- Added new descriptions in the **Technical Definitions** utility (`Name of a Polynomial by Degree`).
- Assigned escape key to exit full screen.

## 1.5.0

- Added the **Technical Definitions** utility: lists of technical definitions (`Computing Abbreviations`, `Mac OS Release Names`, `Unit Prefixes`).
- Reorganized data of the **System Information** utility.
- Added new table fields to the **Departments of France** and **List of U.S. States** utilities.
- Hierarchized samples of the **JavaScript Runner** utility.
- Improved samples of several utilities: **JSON Formatter**, **LaTeX Math Renderer**, **Unicode Inspector**.
- Made reference links and notes collapsible.

## 1.4.0

- Added the **JavaScript Runner** utility: JavaScript code runner, useful for quick testing/prototyping or data processing.
- Added new options to the **JSON Formatter** utility.
- Added load and save file dialogs to several utilities.
- Improved the handling of window size defaults.

## 1.3.0

- Added two new utilities:
    - **IETF Language Tags**: references for IETF BCP 47 language tags and subtags.
    - **ISO Script Codes**: full list of ISO 15924 script codes, with live search.
- Improved the **Unicode Inspector** utility.
- Added samples pull-down menu and added new options to several utilities.

## 1.2.0

- Added two new utilities:
    - **ISO Language Codes**: full list of ISO 639-1 language codes, with live search.
    - **Text Scratchpad**: scratchpad to store persistent text data.
- Renamed categories.

## 1.1.0

- Added two new utilities:
    - **Jabberwocky**: typographic rendition of Lewis Carroll's nonsense poem "Jabberwocky".
    - **Unicode Inspector**: code point information of Unicode characters.

## 1.0.3

- Improved app description.

## 1.0.2

- Improved documentation and screenshots.

## 1.0.0

- First release.

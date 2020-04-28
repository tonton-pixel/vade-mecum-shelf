# <img src="icons/icon-256.png" width="64px" align="center" alt="Vade Mecum Shelf icon"> VADE MECUM SHELF

**Vade Mecum Shelf** is a collection of vade mecum-like utilities wrapped into one single app, built with [Electron](https://electronjs.org).

This desktop application works on macOS, Linux and Windows operating systems.

Its *look and feel* is partly inspired by the brilliant [Electron API Demos](https://github.com/electron/electron-api-demos) application, but it makes use of a more dynamic modular approach: each utility is made of an independent, self-contained folder including all necessary files.

**Important**: the following developer-oriented utilities have been moved to a new application named [Tutti Quanti Shelf](https://github.com/tonton-pixel/tutti-quanti-shelf): **CIDR Calculator**, **CSS Cursors Demo**, **Digital Clock**, **IETF Language Tags**, **JavaScript Parser**, **JavaScript Runner**, **JSON Formatter**, **LaTeX Math Renderer**, **Roman Numerals**, **System Information**, **Text Converter**.

## Utilities

The following utilities are currently available:

- **Chemical Elements**
- **Chinese Zodiac**
- **Color Names**
- **Departments of France**
- **HTTP Status Codes**
- **ISO Country Codes**
- **ISO Language Codes**
- **ISO Script Codes**
- **Jabberwocky**
- **List of U.S. States**
- **Prefectures of Japan**
- **Technical Definitions**
- **Trigonometric Formulas**

## Chemical Elements

Full list of chemical elements, with live search:

<img src="screenshots/chemical-elements.png" width="1080px" alt="Chemical Elements screenshot">

## Chinese Zodiac

Full list of the twelve Chinese zodiac signs, with live search:

<img src="screenshots/chinese-zodiac.png" width="1080px" alt="Chinese Zodiac screenshot">

## Color Names

Lists of color names, with live search:

* W3C Color Names
* X11 Color Names
* XKCD Color Names
* Mac OS X Crayons

<img src="screenshots/color-names.png" width="1080px" alt="Color Names screenshot">

## Departments of France

Full list of French departments, with live search:

<img src="screenshots/departments-of-france.png" width="1080px" alt="Departments of France screenshot">

## HTTP Status Codes

Full list of HTTP status codes, with definitions in several languages:

* English
* French
* Japanese

<img src="screenshots/http-status-codes.png" width="1080px" alt="HTTP Status Codes screenshot">

## ISO Country Codes

Full list of ISO 3166-1 country codes, with live search:

<img src="screenshots/iso-country-codes.png" width="1080px" alt="ISO Country Codes screenshot">

## ISO Language Codes

Full list of ISO 639-1 language codes, with live search:

<img src="screenshots/iso-language-codes.png" width="1080px" alt="ISO Language Codes screenshot">

## ISO Script Codes

Full list of ISO 15924 script codes, with live search:

<img src="screenshots/iso-script-codes.png" width="1080px" alt="ISO Script Codes screenshot">

## Jabberwocky

Typographic rendition of Lewis Carroll's nonsense poem "Jabberwocky":

<img src="screenshots/jabberwocky.png" width="1080px" alt="Jabberwocky screenshot">

## List of U.S. States

Full list of states and territories of the United States, with live search:

<img src="screenshots/list-of-us-states.png" width="1080px" alt="List of U.S. States screenshot">

## Prefectures of Japan

Full list of prefectures of Japan, with live search:

<img src="screenshots/prefectures-of-japan.png" width="1080px" alt="Prefectures of Japan screenshot">

## Technical Definitions

Lists of technical definitions:

* Computing Abbreviations
* Mac OS Release Names
* Metric Prefixes | Fractions
* Metric Prefixes | Multiples
* IEC Binary Prefixes | Multiples
* Name of a Polynomial by Degree

<img src="screenshots/technical-definitions.png" width="1080px" alt="Technical Definitions screenshot">

## Trigonometric Formulas

Sets of trigonometric formulas, by category:

* Basic Definitions
* Symmetry Identities
* Cofunction Identities
* Pythagorean Identities
* Sum to Product
* Product to Sum
* Squares
* Half Angle
* Sum of Angles
* Double Angle

<img src="screenshots/trigonometric-formulas.png" width="1080px" alt="Trigonometric Formulas screenshot">

## Building

You'll need [Node.js](https://nodejs.org) installed on your computer in order to build this application.

```bash
git clone https://github.com/tonton-pixel/vade-mecum-shelf
cd vade-mecum-shelf
npm install
npm start
```

If you don't wish to clone, you can [download the source code](https://github.com/tonton-pixel/vade-mecum-shelf/archive/master.zip).

Several scripts are also defined in the `package.json` file to build OS-specific bundles of the application, using the simple yet powerful [Electron Packager](https://github.com/electron-userland/electron-packager) Node module.\
For instance, running the following command will create a `Vade Mecum Shelf.app` version for macOS:

```bash
npm run build-darwin
```

## Using

You can [download the latest release](https://github.com/tonton-pixel/vade-mecum-shelf/releases) for macOS.

## License

The MIT License (MIT).

Copyright © 2017-2020 Michel MARIANI.

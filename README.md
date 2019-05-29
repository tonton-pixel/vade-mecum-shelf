# <img src="icons/icon-256.png" width="64px" align="center" alt="Vade Mecum Shelf icon"> VADE MECUM SHELF

**Vade Mecum Shelf** is a collection of utilities wrapped into one single app, built with [Electron](https://electronjs.org).

This app works on Mac OS X, Linux and Windows operating systems.

Its *look and feel* is partly inspired by the brilliant [Electron API Demos](https://github.com/electron/electron-api-demos) app, but it makes use of a more dynamic modular approach: each utility is made of an independent, self-contained folder including all necessary files.

## Utilities

The following utilities are currently available:

- **Chemical Elements**
- **Chinese Zodiac**
- **CIDR Calculator**
- **Color Names**
- **CSS Cursors Demo**
- **Departments of France**
- **Digital Clock**
- **HTTP Status Codes**
- **IETF Language Tags**
- **ISO Country Codes**
- **ISO Language Codes**
- **ISO Script Codes**
- **Jabberwocky**
- **JavaScript Parser**
- **JavaScript Runner**
- **JSON Formatter**
- **LaTeX Math Renderer**
- **List of U.S. States**
- **Prefectures of Japan**
- **Roman Numerals**
- **System Information**
- **Technical Definitions**
- **Text Converter**
- **Trigonometric Formulas**

## Chemical Elements

Full list of chemical elements, with live search:

<img src="screenshots/chemical-elements.png" width="1080px" alt="Chemical Elements screenshot">

## Chinese Zodiac

Full list of the twelve Chinese zodiac signs, with live search:

<img src="screenshots/chinese-zodiac.png" width="1080px" alt="Chinese Zodiac screenshot">

## CIDR Calculator

Simple CIDR calculators:

* CIDR to IP Range
* IP Range to CIDR List

<img src="screenshots/cidr-calculator.png" width="1080px" alt="CIDR Calculator screenshot">

## Color Names

Lists of color names, with live search:

* W3C Color Names
* X11 Color Names
* Mac OS X Crayons

<img src="screenshots/color-names.png" width="1080px" alt="Color Names screenshot">

## CSS Cursors Demo

Display CSS cursors by category:

<img src="screenshots/css-cursors-demo.png" width="1080px" alt="CSS Cursors Demo screenshot">

## Departments of France

Full list of French departments, with live search:

<img src="screenshots/departments-of-france.png" width="1080px" alt="Departments of France screenshot">

## Digital Clock

Customizable clock, using language-sensitive text formatting for date and time:

<img src="screenshots/digital-clock.png" width="1080px" alt="Digital Clock screenshot">

## HTTP Status Codes

Full list of HTTP status codes, with definitions in several languages:

* English
* French
* Japanese

<img src="screenshots/http-status-codes.png" width="1080px" alt="HTTP Status Codes screenshot">

## IETF Language Tags

References for IETF BCP 47 language tags and subtags:

<img src="screenshots/ietf-language-tags.png" width="1080px" alt="IETF Language Tags screenshot">

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

## JavaScript Parser

JavaScript code parser and tokenizer, based on Esprima:

<img src="screenshots/javascript-parser.png" width="1080px" alt="JavaScript Parser screenshot">

## JavaScript Runner

JavaScript code runner, useful for quick testing/prototyping or data processing:

<img src="screenshots/javascript-runner.png" width="1080px" alt="JavaScript Runner screenshot">

## JSON Formatter

JSON data formatter and validator:

<img src="screenshots/json-formatter.png" width="1080px" alt="JSON Formatter screenshot">

## LaTeX Math Renderer

LaTeX math expression renderer, using the KaTeX JavaScript library:

<img src="screenshots/latex-math-renderer.png" width="1080px" alt="LaTeX Math Renderer screenshot">

## List of U.S. States

Full list of states and territories of the United States, with live search:

<img src="screenshots/list-of-us-states.png" width="1080px" alt="List of U.S. States screenshot">

## Prefectures of Japan

Full list of prefectures of Japan, with live search:

<img src="screenshots/prefectures-of-japan.png" width="1080px" alt="Prefectures of Japan screenshot">

## Roman Numerals

Converters between roman and arabic numerals:

* Roman to Arabic Numeral
* Arabic to Roman Numeral

<img src="screenshots/roman-numerals.png" width="1080px" alt="Roman Numerals screenshot">

## System Information

Detailed list of system information, by category:

* Framework
* Main Process
* Renderer Process
* Application
* Navigator
* Operating System
* OS User Info
* Screen
* Window
* Environment

<img src="screenshots/system-information.png" width="1080px" alt="System Information screenshot">

## Technical Definitions

Lists of technical definitions:

* Computing Abbreviations
* Mac OS Release Names
* Metric Prefixes | Fractions
* Metric Prefixes | Multiples
* IEC Binary Prefixes | Multiples
* Name of a Polynomial by Degree

<img src="screenshots/technical-definitions.png" width="1080px" alt="Technical Definitions screenshot">

## Text Converter

Encode and decode text according to several string formats:

* JSON String
* Hex String
* Base64 String

<img src="screenshots/text-converter-text-encoder.png" width="1080px" alt="Text Converter - Text Encoder screenshot">

<img src="screenshots/text-converter-text-decoder.png" width="1080px" alt="Text Converter - Text Decoder screenshot">

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

You'll need [Node.js](https://nodejs.org) installed on your computer in order to build this app.

```bash
git clone https://github.com/tonton-pixel/vade-mecum-shelf
cd vade-mecum-shelf
npm install
npm start
```

If you don't wish to clone, you can [download the source code](https://github.com/tonton-pixel/vade-mecum-shelf/archive/master.zip).

Several scripts are also defined in the `package.json` file to build OS-specific bundles of the app, using the simple yet powerful [Electron Packager](https://github.com/electron-userland/electron-packager) Node module.\
For instance, running the following command will create a `Vade Mecum Shelf.app` version for Mac OS X:

```bash
npm run build-darwin
```

## Using

You can [download the latest release](https://github.com/tonton-pixel/vade-mecum-shelf/releases) for Mac OS X.

## License

The MIT License (MIT).

Copyright © 2017-2019 Michel MARIANI.

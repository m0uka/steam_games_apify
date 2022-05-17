# Steam Game Scraper

<!-- Get data from Steam games scraped from the front page of the Steam marketplace.
Extract game name, description, release date, platforms, features, genres, any current deals and prices, etc..
Download your data as a HTML table, JSON, CSV, Excel, XML. -->

Steam Game Scraper is a simple actor that crawles the Steam's frontpage and extracts data from individual games without any coding. This scraper can be configured and used from a user interface, or it can be called using the Apify's API. The extracted data is stored in a dataset, from where you can extract it to various formats, such as JSON, XML, CSV, Excel, etc..

## Table of contents

- [Usage](#usage)
- [Input config](#input-config)
- [Limitations](#limitations)

## Usage

Starting with the Steam Game Scraper is very easy. All you need to do is to define whether you want to extract games on sale or not.

## Input config

You can configure the inputs in the [Apify Console](https://console.apify.com/) user interface, or programatically with JSON using the [Apify API](https://apify.com/docs/api/v2#/reference/actors/run-collection/run-actor).

## Limitations

Steam Game Scraper should be pretty performant, because it uses the [Cheerio Scraper](https://apify.com/apify/cheerio-scraper), which downloads and proccesses raw HTML pages - Steam doesn't use much JavaScript to change the layout of the page.
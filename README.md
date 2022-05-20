# Steam Game Scraper

<!-- Get data from Steam games scraped from the front page of the Steam marketplace.
Extract game name, description, release date, platforms, features, genres, any current deals and prices, etc..
Download your data as a HTML table, JSON, CSV, Excel, XML. -->

A simple actor that crawles the Steam's frontpage and extracts data from individual games without any coding.
You can get the following data from the scraper:

* Game information
* Price and any active deals
* Genres
* Popular tags
* Supported platforms
* Supported languages
* Recent and all reviews

## Usage

Starting with the Steam Game Scraper is very easy. Currently you have these options available:

* Only on sale - extract games that are only current on sale (good for potential deals)
* Only released - only extract games, that have been already released (are not coming soon)

## Input config

You can configure the inputs in the [Apify Console](https://console.apify.com/) user interface, or programatically with JSON using the [Apify API](https://apify.com/docs/api/v2#/reference/actors/run-collection/run-actor).

## Cost of usage

Steam Game Scraper is pretty lightweight, because it uses [Cheerio Scraper](https://apify.com/apify/cheerio-scraper), which downloads and processes raw HTML pages - Steam doesn't use much JavaScript to change the layout of the page.

In terms of platform usage credits, **one** scrape takes about ~**0.025** compute units.

## Results

The actor stores its result in the default dataset associated with the actor run. It can be then exported to various formats, such as JSON, XML, CSV or Excel.

Every store page in the dataset will contain a seperate object that follows this format (JSON is used below):

```json
{
  "url": "https://store.steampowered.com/app/1703340/The_Stanley_Parable_Ultra_Deluxe/?snr=1_4_4__145",
  "title": "The Stanley Parable: Ultra Deluxe",
  "description": "The Stanley Parable: Ultra Deluxe is an expanded re-imagining of 2013's The Stanley Parable. You will play as Stanley, and you will not play as Stanley. You will make a choice, and you will become powerless. You are not here to win. The Stanley Parable is a game that plays you.",
  "headerImage": "https://cdn.akamai.steamstatic.com/steam/apps/1703340/header.jpg?t=1652303715",
  "releaseDate": "27 Apr, 2022",
  "comingSoon": false,
  "earlyAccess": false,
  "supportedPlatforms": [
    "windows",
    "linux",
    "mac"
  ],
  "features": [
    "Single-player",
    "Steam Achievements",
    "Full controller support"
  ],
  "genres": [
    "Adventure",
    "Casual",
    "Indie"
  ],
  "popularTags": [
    "Multiple Endings",
    "Comedy",
    "Choices Matter",
    "Walking Simulator",
    "First-Person",
    "Singleplayer",
    "Narration",
    "3D",
    "Funny",
    "Exploration",
    "Adventure",
    "Casual",
    "Story Rich",
    "Psychological Horror",
    "Emotional",
    "Mystery",
    "Horror",
    "Atmospheric",
    "Game Development",
    "Dark Humor"
  ],
  "languages": {
    "English": {
      "interface": true,
      "sound": true,
      "subtitles": true
    },
    "French": {
      "interface": true,
      "sound": false,
      "subtitles": true
    },
    "Italian": {
      "interface": true,
      "sound": false,
      "subtitles": true
    },
    "German": {
      "interface": true,
      "sound": false,
      "subtitles": true
    },
    "Russian": {
      "interface": true,
      "sound": false,
      "subtitles": true
    },
    "Spanish - Spain": {
      "interface": true,
      "sound": false,
      "subtitles": true
    }
  },
  "price": "21,99€",
  "sale": false,
  "salePercentage": null,
  "saleUntil": null,
  "recentReviews": "Very Positive",
  "allReviews": "Very Positive",
  "developers": [
    "Crows Crows Crows"
  ],
  "publishers": [
    "Crows Crows Crows"
  ]
}
```
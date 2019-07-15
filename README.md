# CBIS - A Data Integration project about the cannabis

## Purpose 

The purpose of this data integration project is to combine some sources about the cannabis strains in one place.  Roughly speaking there are some trade names for cannabis strains, we refer to Wikipedia for retrieving that list (https://en.wikipedia.org/wiki/List_of_names_for_cannabis_strains), that is split to three main types: Indica strains, Sativa strains and Hybrid strains.
For each strain retrieved from the Wikipedia list, we can provide a full card about it. Some of the information about each strain are: 

- Time of use;
- What is;
- % of Indica and % of Sativa;
- Effects;
- Fragrance;
- Flavours;
- Adverse reactions;
- Medical use;
- Growing info;
- Growing video;
- Video review;
- ...
**Actually, there are more than 500 strains.**
## Video presentation

[![Watch the video](http://ferrara.link/img/cbisdataintegration/videopresentation.jpg)](http://ferrara.link/img/cbisdataintegration/cbispresentation.mp4)

## Sources

At that moment, we use those sources for data retrieval:

- URL: [Wikipedia](https://en.wikipedia.org/wiki/List_of_names_for_cannabis_strains)
TECHNIC: Web Scraping
DATA RETRIEVED: List of all cannabis strains grouped by type.
VOLATILITY: None.
- URL: [I love Growing Marijuana](https://www.ilovegrowingmarijuana.com/)
TECHNIC: Web Scraping.
DATA RETRIEVED:  General Information about the strain.
Effects, Fragrance, Flavours, Adverse Reaction, Medical, Growing, Flowering Time information about the strain and video review.
VOLATILITY: Monthly 
- URL: [Leafly](https://www.leafly.com/)
TECHNIC: Web Scraping.
DATA RETRIEVED:  “What is” of the strain.
Flavours, Places where is popular, info pictures, Similar strain of the strain.
VOLATILITY: Monthly 
- URL: [WikiLeaf](https://www.wikileaf.com/)
TECHNIC: Web Scraping.
DATA RETRIEVED:  Time of Use of the strain, user reviews, small info pictures.
VOLATILITY: Monthly 
- URL: [World Wide Marijuana Seeds](https://www.worldwide-marijuana-seeds.com/)
TECHNIC: Web Scraping.
DATA RETRIEVED: Price of the strain.
VOLATILITY: High 
- URL: [Youtube](https://www.youtube.com/)
TECHNIC: API Wrapper
DATA RETRIEVED: A video that talks about strain growing.
VOLATILITY: High

## Architecture

 ![Project architecture](http://ferrara.link/img/cbisdataintegration/architecture.jpg)

## How to install

1. Download  [MongoDB](https://www.mongodb.com/download-center/community) and install.
2. Download [NodeJS](https://nodejs.org/en/download/) and install.
3. Clone the repository from GitHub.
4. In the folder "config" there is a file called "db.json" is setted with a default configuration for a MongoDB in localhost, if your configuration are different, edit the fields.
5. Open a terminal and go in root project from it (in windows for example with Windows PowerShell), and digit:
```sh
$ npm install
```
6. After the installation, go from terminal in the folder called "init" and digit:
```sh
$ node initDatabase.js
```
Wait around 5 minutes, until you are able to read "Init has been completed!" (**this is a step to accomplish just one time, because it stores all the strains retrieved from wikipedia in the database, after that you don't need to iterate it again**)
7. Go from terminal in the root folder of the project and digit:
 ```sh
$ node app.js
 ```
**Now you are able to see the project in your browser** (by default at the url: http://localhost:8080/cbis/index ).

>OPTIONAL: in the folder "config" there is a file called "api.json", you need to set the field the "auth" with your api from youtube. Is optional because you are able to run the project also without that, but you can not see a embedded youtube video in the singular strain info.
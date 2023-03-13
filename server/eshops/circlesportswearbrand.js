const fetch = require('node-fetch');
const cheerio = require('cheerio');

/**
 * Parse webpage e-shop
 * @param  {String} data - html response
 * @return {Array} products
 */
const parse = data => {
  const $ = cheerio.load(data);

  var items = [];
  items.push(...$('li.grid__item')
    .map((i, element) => {
      const image = "https:" + $(element)
        .find('img')[0].attribs['src']
      var images = Object.values($(element).find('.media-pool img.motion-reduce').map((i, e) => e.attribs['data-src']));
      var link = "https://shop.circlesportswear.com" + $(element)
        .find('h3.h5 .full-unstyled-link')
        .attr('href');
      var name = $(element)
        .find('h3.h5 .full-unstyled-link')
        .text()
        .trim()
        .replace(/\s/g, ' ');
      var price = $(element)
          .find('.money')
          .text()
          .split('€');
      price = parseFloat(price[price.length - 1].replace(',', '.'));
      var colorArray = $(element)
          .find('.color-variant');
      var colorArrayFinal = [];
      var colorArrayFinalUrl = [];
      for(i = 0; i < colorArray.length; i++) {
        colorArrayFinal.push(colorArray[i].attribs['data-color']);
        colorArrayFinalUrl.push(colorArray[i].attribs['data-url']);
      }
      colorArray = colorArrayFinal;
      var imagesFinal = [];
      colorArrayFinal.forEach(item => {
        imagesFinal.push(images.filter(obj => !("" + obj).startsWith("<!DOCTYPE html>") && ("" + obj).includes(item.toLowerCase().replace(" ", "_") + "_1"))[0]);
      });
      if(colorArray.length == 1) {
        name = name + " " + colorArray[0];
        link += colorArrayFinalUrl[0];
      }
      else if(colorArray.length > 1) {
        for(i = 1; i < colorArray.length; i++) {
          var today = new Date().toLocaleString().substr(0, 10).split("/")
          var item = {
            image: "https:" + imagesFinal[i],
            link: link + colorArrayFinalUrl[i],
            name: name + " " + colorArray[i],
            price: price,
            scrapDate: today[1] + "-" + today[0] + "-" + today[2],
            brand: "Circle Sportswear"
          };
          items.push(item);
        }
        name = name + " " + colorArray[0];
        link += colorArrayFinalUrl[0];
      }
          var today = new Date().toLocaleString().substr(0, 10).split("/")
          const scrapDate = today[1] + "-" + today[0] + "-" + today[2];
          const brand = "Circle Sportswear";
          return {image, link, name, price, scrapDate, brand};
    })
    .get());
  return items;
};

/**
 * Scrape all the products for a given url page
 * @param  {[type]}  url
 * @return {Array|null}
 */
module.exports.scrape = async url => {
  try {
    const response = await fetch(url);

    if (response.ok) {
      const body = await response.text();

      return parse(body);
    }

    console.error(response);

    return null;
  } catch (error) {
    console.error(error);
    return null;
  }
};
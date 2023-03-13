const fetch = require('node-fetch');
const cheerio = require('cheerio');

/**
 * Parse webpage e-shop
 * @param  {String} data - html response
 * @return {Array} products
 */
const parse = data => {
  const $ = cheerio.load(data);

  return $('#filterItems .productList')
    .map((i, element) => {
      const image = $(element)
        .find('.productList-image img')[0]
        .attribs['data-src'];
      const link = "https://www.dedicatedbrand.com" + $(element)
        .find('.productList-link')
        .attr('href');
      const name = $(element)
        .find('.productList-title')
        .text()
        .trim()
        .replace(/\s/g, ' ');
      const price = parseFloat(
        $(element)
          .find('.productList-price')
          .text()
      );
      const scrapDate = new Date().toDateString();
      const brand = "Dedicated";
      return {image, link, name, price, scrapDate, brand};
    })
    .get();
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

//get products variable of this page https://www.dedicatedbrand.com/en/men/all-men#page=16
module.exports.getProducts = async () => {
  try {
    const response = await fetch("https://www.dedicatedbrand.com/en/loadfilter");

    if (response.ok) {
      const body = await response.json();
      console.log(body['products']);
      const products = body['products'].filter(
        data => Object.keys(data).length > 0
      );
      return products.map(
        function(data) {
          const image = data['image'][0];
          const link = "https://www.dedicatedbrand.com/en/" + data['canonicalUri'];
          const name = data['name'];
          const price = data['price']['priceAsNumber'];
          var today = new Date().toLocaleString().substr(0, 10).split("/")
          const scrapDate = today[1] + "-" + today[0] + "-" + today[2];
          const brand = "Dedicated";
          return {image, link, name, price, scrapDate, brand};
        }
      );
    }

    console.error(response);

    return null;
  } catch (error) {
    console.error(error);
    return null;
  }
};
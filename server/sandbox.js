/* eslint-disable no-console, no-process-exit */
const dedicatedbrand = require('./eshops/dedicatedbrand');
const montlimartbrand = require('./eshops/montlimartbrand');
const circlesportswearbrand = require('./eshops/circlesportswearbrand');
const fs = require('fs');



async function sandbox (brandName) {
  const eshops = ["https://www.dedicatedbrand.com/en/men/news",
                    "https://www.montlimart.com/99-vetements",
                    "https://shop.circlesportswear.com/collections/collection-homme"];
  const allBrands = ["dedicated", "montlimart", "circle"];
  
  console.log(`🕵️‍♀️ browsing ${brandName} eshop:\n`);
  var products;

  switch (brandName) {
    case 'dedicated':
      products = await dedicatedbrand.scrape(eshops[0]);
      console.log(products);
      console.log('done\n');
      saveToFile(products, brandName);
      break;
    case 'montlimart':
      products = await montlimartbrand.scrape(eshops[1]);
      console.log(products);
      console.log('done\n');
      saveToFile(products, brandName);
      break;
    case 'circle':
      products = await circlesportswearbrand.scrape(eshops[2]);
      console.log(products);
      console.log('done\n');
      saveToFile(products, brandName);
      break;
    case 'all':
      products = [];
      for (let i = 0; i < eshops.length; i++) {
        products.push(await sandbox(allBrands[i]));
  }
  }
}

async function saveToFile(products, brandName) {
  fs.writeFile(`./server/exports/${brandName}.json`, JSON.stringify(products), (err) => {
    if (err) throw err;
    console.log('The file has been saved!\n');
  });
}

sandbox('all');

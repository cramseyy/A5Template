const fs = require("fs");

//Typically the model will access a database of some type, but this is omitted in this example for simplicity
class applicationModel {
  constructor() {
    this.initialize();
  }

  //initialize the bookList with books
  initialize() {
    this.products = JSON.parse(
      fs.readFileSync("./application/data/applicationData.json")
    );

    this.filters = [];

    //Loop through products to create the filters.
    this.products.forEach((item) => {
      item.tags.forEach((tag) => {
        if (!this.filters.includes(tag)) {
          this.filters.push(tag);
        }
      });
    });
  }

  getAllProducts() {
    return this.products;
  }

  getAllFilters() {
    return this.filters;
  }

  getProductById(id) {
    return (this.products.find((product) => product.id == id));
  }

  getProductByFilter(tag) {
    return (this.products.filter((product) => product.tags.includes(tag)))
  }

  getProductBySearch(searchText) {
    return this.products.filter(
      (product) =>
        product.shortDescription.toLowerCase().includes(searchText) ||
        product.longDescription.toLowerCase().includes(searchText)
    );
  }

  getFilterCounts() {
	let counts = {}
	this.products.forEach(product => {
		product.tags.forEach(tag => {
			counts[tag] = (counts[tag] || 0) + 1;
		});
	});
	return counts;
  }
}

module.exports = applicationModel;

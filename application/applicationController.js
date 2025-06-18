var ApplicationModel = require("./applicationModel");
ApplicationModel = new ApplicationModel();

class application {
  static getAllProducts(req, res) {
    let data = ApplicationModel.getAllProducts();
    let filters = ApplicationModel.getAllFilters();
    let filterCounts = ApplicationModel.getFilterCounts();

    if (req.query.filter) {
      let tag = req.query.filter;
      data = ApplicationModel.getProductByFilter(tag);
    }

    if (req.query.search) {
      let searchText = req.query.search.toLowerCase();
      data = ApplicationModel.getProductBySearch(searchText);
    }
    res.send({ products: data, filters: filters , filterCounts: filterCounts });
  }

  static getProductById(req, res) {
    let id = req.params.id;
    let data = ApplicationModel.getProductById(id);
    res.send(data);
  }

  static getCart(req, res) {
    console.log("getting cart");
    res.send({ products: ApplicationModel.getCart() });
  }

  static addToCart(req, res) {
    console.log("adding to cart");
    let productId = req.body.productId;
    res.send({ products: ApplicationModel.addToCart(productId) });
  }

  static removeFromCart(req, res) {
    console.log("removing from cart");
    let id = req.params.id;
    res.send({ products: ApplicationModel.removeFromCart(id) });
  }
}

module.exports = application;

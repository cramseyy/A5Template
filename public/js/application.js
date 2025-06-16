//The Model is used to retrive and manipulate data
class PageModel {
  GetProducts() {
    let data = {};
    //Call REST API using XMLHttpRequest
    var xhttp = new XMLHttpRequest();
    let url = "/application/product";
    xhttp.open("GET", url, false);
    xhttp.send();
    if (xhttp.status == 200) {
      data = JSON.parse(xhttp.responseText);
    }
    return data;
  }

  GetProductsById(id) {
    let data = {};
    var xhttp = new XMLHttpRequest();
    let url = `/application/product/${id}`;
    xhttp.open("GET", url, false);
    xhttp.send();
    if (xhttp.status == 200) {
      data = JSON.parse(xhttp.responseText);
    }
    return data;
  }

  GetProductsByFilter(filter) {
    let data = {};
    var xhttp = new XMLHttpRequest();
    let url = `/application/product?filter=${filter}`;
    xhttp.open("GET", url, false);
    xhttp.send();
    if (xhttp.status == 200) {
      data = JSON.parse(xhttp.responseText);
    }
    // console.log("Data from filter: ", data);
    return data;
  }

  GetProductsBySearch(searchText) {
    let data = {};
    var xhttp = new XMLHttpRequest();
    let url = `/application/product?search=${searchText}`;
    xhttp.open("GET", url, false);
    xhttp.send();
    if (xhttp.status == 200) {
      data = JSON.parse(xhttp.responseText);
    }
    console.log("Data from search: ", data);
    return data;
  }
}

//The View is used to update the page content
class PageView {
  CreateMainPage(data, filter, searchText) {
    //Update the HTML with the main page content
    console.log("Main page data: ", data);

    let template = `
      <div class="layout">
      <div class="header">
        <div class="header-container">
          <div class="logo">
            <img src="/img/logo.png" alt="logo" />
          </div>
          <div class="search-container">
            <form method="get" action="/application/">
              <input id="search-field" type="text" name="search" placeholder="Search here..." />
              <button type="submit" id="submitbtn">Search</button>
            </form>
          </div>
        </div>
      </div>
      <div class="bottom-container">
        <div class="bottom-content">
          <div class="left-section">
            <h1>Filters</h1>
            <div class="remove-filter">
              <div class="remove-btn" onclick="app.handleRemoveFilter()">✖ Remove Filter</div>
            </div>
            <div class="filter-container"></div>
          </div>
          <div class="middle-section">
          <div class="results"></div>
            <div class="middle-content">
              <div class="card-container"></div>
            </div>
          </div>
          <div class="right-section">
            <h1>Cart</h1>
            <div class="cart-container"></div>
          </div>
        </div>
      </div>
    </div>
    `;

    let cardTemplate = `<div class="product" onclick="app.handleProductClick({id})">
        <div class="top">
            <img src="{image}" />
        </div>
            <div class="bottom">
                <h3>{make} {model}</h3>
                <p>
                    {shortDescription}
                </p>
            </div>
        </div>`;

    // generate cards
    let cards = "";
    data.products.forEach((product) => {
      let card = cardTemplate;
      card = card.replace("{id}", product.id);
      card = card.replace("{image}", product.image);
      card = card.replace("{make}", product.make);
      card = card.replace("{model}", product.model);
      card = card.replace("{shortDescription}", product.shortDescription);

      cards += card;
    });

    // generate filter buttons
    let filterHTML = "";
    let filters = data.filters;
    let filterCounts = data.filterCounts;
    filters.forEach((tag) => {
      let count = filterCounts[tag];
      let selected = tag == filter ? "selected-filter" : "";
      filterHTML += `<div class="filter-btn ${selected}">${tag} (${count})</div>`;
    });

    let root = document.querySelector("#root");
    root.innerHTML = template;

    let searchForm = document.querySelector(".search-container form");
    if (searchForm) {
      searchForm.addEventListener("submit", function (e) {
        e.preventDefault();
        let searchText = document.querySelector("#search-field").value.trim();
        if (searchText.length > 0) {
          app.handleSearch(searchText);
        } else {
          app.handleRemoveFilter();
        }
      });
    }

    // results container
    let resultsContainer = document.querySelector(".results");
    let count = data.products.length;
    let text = count === 1 ? "result" : "results";
    let extra = "";

    if (searchText) {
      extra = " for search " + "'" + searchText + "'";
    } else if (filter) {
      extra = " for filter " + "'" + filter + "'";
    }
    text = text + extra;
    resultsContainer.innerHTML = `<h1>${count} ${text} shown</h1>`;

    let cardContainer = document.querySelector(".card-container");
    cardContainer.innerHTML = cards;

    let filterContainer = document.querySelector(".filter-container");
    filterContainer.innerHTML = filterHTML;

    document.querySelectorAll(".filter-btn").forEach((button) => {
      button.addEventListener("click", (e) => {
        let filter = e.target.textContent.split("(")[0].trim();
        // console.log("Filter clicked: ", filter);
        app.handleFilterClick(filter);
      });
    });
  }

  CreateProductPage(data) {
    //Update the HTML with the product page content
    console.log("Product page");

    let template = `<div class="product-layout">
      <div class="product-header">
        <h1>{make} {model}</h1>
      </div>
      <div class="product-left-section">
        <div class="img-container">
          <img src="{image}" alt="{make}"/>
          <div class="price">
            <h3>Price: {price}</h3>
          </div>
        </div>
      </div>
      <div class="product-right-section">
        <div class="product-description">
          <div class="product-description-top">
            <p>
              {longDescription}
            </p>
          </div>
          <div class="product-description-bottom">
            <h3>Tags: {tags}</h3>
          </div>
        </div>
      </div>
      <div class="product-footer">
        <button class="return-home-btn">Return Home</buton>
        <button class="next-product-btn">Next Product</button>
      </div>
    </div>`;

    template = template.replace("{make}", data.make);
    template = template.replace("{model}", data.model);
    template = template.replace("{image}", data.image);
    template = template.replace("{price}", data.price);
    template = template.replace("{longDescription}", data.longDescription);
    template = template.replace("{tags}", data.tags.join(", "));

    let root = document.querySelector("#root");
    root.innerHTML = template;

    let currentProduct = data.id;
    console.log("cur prod: " + currentProduct);

    document
      .querySelector(".return-home-btn")
      .addEventListener("click", (e) => {
        e.preventDefault();
        app.handleRemoveFilter();
      });

    document
      .querySelector(".next-product-btn")
      .addEventListener("click", (e) => {
        e.preventDefault();
        app.handleGetNextProduct(currentProduct);
      });
  }
}

//The Controller handles the flow of control
class PageController {
  constructor(pageModel, pageView) {
    this.pageModel = pageModel;
    this.pageView = pageView;

    this.createMainPage();
  }

  createMainPage() {
    let data = this.pageModel.GetProducts();
    this.pageView.CreateMainPage(data);
  }

  handleProductClick(id) {
    let data = this.pageModel.GetProductsById(id);
    this.pageView.CreateProductPage(data);
  }

  handleFilterClick(filter) {
    let data = this.pageModel.GetProductsByFilter(filter);
    this.pageView.CreateMainPage(data, filter, "");
  }

  handleSearch(searchText) {
    let data = this.pageModel.GetProductsBySearch(searchText);
    this.pageView.CreateMainPage(data, "", searchText);
  }

  handleRemoveFilter() {
    this.createMainPage();
  }

  handleGetNextProduct(id) {
    if (id == this.pageModel.GetProducts().products.length - 1) {
      id = -1;
    }
    let nextProductid = id + 1;
    let nextProduct = this.pageModel.GetProductsById(nextProductid);
    this.pageView.CreateProductPage(nextProduct);
  }
}

const app = new PageController(new PageModel(), new PageView());

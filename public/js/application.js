//The Model is used to retrive and manipulate data
class PageModel {
  GetProducts(callback) {
    let data = {};
    var xhttp = new XMLHttpRequest();
    let url = "/application/product";

    xhttp.onreadystatechange = function () {
      if (this.readyState == 4 && xhttp.status == 200) {
        data = JSON.parse(this.responseText);
        callback(data);
      }
    };

    xhttp.open("GET", url, true);
    xhttp.setRequestHeader("Accept", "application/JSON");
    xhttp.send();
  }

  GetProductsById(id, callback) {
    let data = {};
    var xhttp = new XMLHttpRequest();
    let url = `/application/product/${id}`;

    xhttp.onreadystatechange = function () {
      if (this.readyState == 4 && xhttp.status == 200) {
        data = JSON.parse(this.responseText);
        callback(data);
      }
    };

    xhttp.open("GET", url, true);
    xhttp.setRequestHeader("Accept", "application/JSON");
    xhttp.send();
  }

  GetProductsByFilter(filter, callback) {
    let data = {};
    var xhttp = new XMLHttpRequest();
    let url = `/application/product?filter=${filter}`;

    xhttp.onreadystatechange = function () {
      if (this.readyState == 4 && xhttp.status == 200) {
        data = JSON.parse(this.responseText);
        callback(data);
      }
    };

    xhttp.open("GET", url, true);
    xhttp.setRequestHeader("Accept", "application/JSON");
    xhttp.send();
  }

  GetProductsBySearch(searchText, callback) {
    let data = {};
    var xhttp = new XMLHttpRequest();
    let url = `/application/product?search=${searchText}`;

    xhttp.onreadystatechange = function () {
      if (this.readyState == 4 && xhttp.status == 200) {
        data = JSON.parse(this.responseText);
        callback(data);
      }
    };

    xhttp.open("GET", url, true);
    xhttp.setRequestHeader("Accept", "application/JSON");
    xhttp.send();
  }

  GetCart(callback) {
    console.log("get cart req");
    let data = {};
    var xhttp = new XMLHttpRequest();
    let url = `/application/cart`;

    xhttp.open("GET", url, true);
    xhttp.onreadystatechange = function () {
      if (this.readyState == 4 && xhttp.status == 200) {
        data = JSON.parse(this.responseText);
        callback(data);
      }
    };
    xhttp.setRequestHeader("Accept", "application/JSON");
    xhttp.send();
  }

  AddToCart(id, callback) {
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/application/cart", true);
    xhttp.setRequestHeader("Content-Type", "application/json");
    xhttp.onreadystatechange = function () {
      if (this.readyState == 4 && xhttp.status == 200) {
        callback(JSON.parse(this.responseText));
      }
    };
    xhttp.send(JSON.stringify({ productId: id }));
  }

  // RemoveFromCart(id, callback) {
  //   var xhttp = new XMLHttpRequest();
  //   xhttp.open("DELETE", `/application/cart/${id}`, true);
  //   xhttp.onreadystatechange = function () {
  //     if (this.readyState == 4 && xhttp.status == 200) {
  //       callback(JSON.parse(this.responseText));
  //     }
  //   };
  //   xhttp.send();
  // }
}

//The View is used to update the page content
class PageView {
  CreateMainPage(data, filter, searchText) {
    //Update the HTML with the main page content
    // console.log("Main page data: ", data);

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

    this.RemoveCartTab();

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
        <button class="add-cart-btn">Add to Cart</button>
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

    if (!document.querySelector(".cartTab")) {
      let cartTab = document.createElement("div");
      cartTab.className = "cartTab";
      cartTab.innerHTML = `
        <div class="cart-container-tab"></div>
      `;
      document.body.appendChild(cartTab);

      let cartToggle = document.createElement("button");
      cartToggle.className = "cartTab-toggle";
      cartToggle.textContent = "View Cart";
      document.body.appendChild(cartToggle);

      cartToggle.onclick = function () {
        cartTab.classList.toggle("open");
        if (cartTab.classList.contains("open")) {
          root.classList.add("blur");
        } else {
          root.classList.remove("blur");
        }
      };
    }

    let addCartBtn = document.querySelector(".add-cart-btn");
    if (addCartBtn) {
      addCartBtn.addEventListener("click", () => {
        app.handleAddToCart(data.id);
      });
    }
  }

  RemoveCartTab() {
    let cartTab = document.querySelector(".cartTab");
    let cartToggle = document.querySelector(".cartTab-toggle");
    if (cartTab) cartTab.remove();
    if (cartToggle) cartToggle.remove();
  }

  RenderCart(cartData) {
    console.log("Cart data: ", cartData);
    let container =
      document.querySelector(".cart-container") ||
      document.querySelector(".cart-container-tab");
    if (!container) {
      return;
    }
    let products = cartData.products || [];
    if (products.length === 0) {
      container.innerHTML = "<p>Your cart is empty.</p>";
      return;
    }
    let total = 0;
    let html = "<ul style='list-style:none;padding:0;'>";
    products.forEach((item) => {
      total += item.price;
      html += `<li>
      ${item.make} ${item.model} - $${item.price}
      <button class="remove-cart-btn" data-id="${item.id}">Remove</button>
    </li>`;
    });
    html += `</ul><div style="margin-top:10px;font-weight:bold;">Total: $${total}</div>`;
    container.innerHTML = html;

    // Add remove button handlers
    container.querySelectorAll(".remove-cart-btn").forEach((btn) => {
      btn.onclick = () => app.handleRemoveFromCart(btn.getAttribute("data-id"));
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
    this.pageView.RemoveCartTab();
    this.pageModel.GetProducts((data) => {
      this.pageView.CreateMainPage(data);
      this.loadCart();
    });
  }

  handleProductClick(id) {
    this.pageModel.GetProductsById(id, (data) => {
      this.pageView.CreateProductPage(data);
      this.loadCart();
    });
  }

  handleFilterClick(filter) {
    this.pageModel.GetProductsByFilter(filter, (data) => {
      this.pageView.CreateMainPage(data, filter, "");
      this.loadCart();
    });
  }

  handleSearch(searchText) {
    this.pageModel.GetProductsBySearch(searchText, (data) => {
      this.pageView.CreateMainPage(data, "", searchText);
      this.loadCart();
    });
  }

  handleRemoveFilter() {
    this.createMainPage();
  }

  handleGetNextProduct(id) {
    this.pageModel.GetProducts((productsData) => {
      let products = productsData.products;
      let nextId = (id + 1) % products.length;
      this.pageModel.GetProductsById(nextId, (nextProduct) => {
        this.pageView.CreateProductPage(nextProduct);
        this.loadCart();
      });
    });
  }

  loadCart() {
    console.log("loading cart");
    this.pageModel.GetCart((cartData) => {
      this.pageView.RenderCart(cartData);
    });
  }

  handleAddToCart(id) {
    this.pageModel.AddToCart(id, () => {
    this.loadCart();
    });
  }

  handleRemoveFromCart(id) {
    this.pageModel.RemoveFromCart(id, () => {
    this.loadCart();
    });
  }
}

const app = new PageController(new PageModel(), new PageView());

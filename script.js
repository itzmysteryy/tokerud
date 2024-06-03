document.addEventListener("DOMContentLoaded", () => {
  const cartIcon = document.querySelector("#cart-icon");
  const cart = document.querySelector(".cart");
  const closeCart = document.querySelector("#cart-close");

  cartIcon.onclick = () => cart.classList.add("cart-active");
  closeCart.onclick = () => cart.classList.remove("cart-active");

  if (document.readyState == "loading") {
    document.addEventListener("DOMContentLoaded", ready);
  } else {
    ready();
  }

  function ready() {
    const removeCartButtons = document.getElementsByClassName("cart-remove");
    const quantityInputs = document.getElementsByClassName("cart-quantity");
    const addCartButtons = document.getElementsByClassName("add-cart");

    for (const button of removeCartButtons) {
      button.addEventListener("click", removeCartItem);
    }

    for (const input of quantityInputs) {
      input.addEventListener("change", quantityChanged);
    }

    for (const button of addCartButtons) {
      button.addEventListener("click", addCartClicked);
    }

    document.querySelector(".btn-buy").addEventListener("click", buyButtonClicked);
  }

  function buyButtonClicked() {
    const userName = document.getElementById("user-name").value;
    const userFeide = document.getElementById("user-feide").value;
    if (!userName || !userFeide) {
      alert("Please enter your name and Feide (user ID).");
      return;
    }

    const cartContent = document.querySelector(".cart-content");
    const cartBoxes = cartContent.getElementsByClassName("cart-box");

    let orderData = {
      name: userName,
      feide: userFeide,
      litago: 0,
      smoothies: 0,
      juice: 0,
      yt: 0,
      godmorgen: 0,
      bygglunsj: 0,
      sandwich: 0,
      mellombar: 0,
      total: document.querySelector(".total-price").innerText.replace("kr", "")
    };

    for (const cartBox of cartBoxes) {
      const title = cartBox.querySelector(".cart-food-title").innerText.toLowerCase().replace(' ', '');
      const quantity = cartBox.querySelector(".cart-quantity").value;
      orderData[title] = quantity; // Include quantity for each item
    }

    sendOrderData(orderData);
    alert("Your order has been placed!");

    while (cartContent.hasChildNodes()) {
      cartContent.removeChild(cartContent.firstChild);
    }
    updateTotal();
  }

  function sendOrderData(orderData) {
    fetch("https://sheetdb.io/api/v1/lzj6xcq5sgzus", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(orderData)
    })
    .then(response => response.json())
    .then(data => {
      console.log("Success:", data);
    })
    .catch((error) => {
      console.error("Error:", error);
    });
  }

  function removeCartItem(event) {
    const buttonClicked = event.target;
    buttonClicked.parentElement.remove();
    updateTotal();
  }

  function quantityChanged(event) {
    const input = event.target;
    if (isNaN(input.value) || input.value <= 0) {
      input.value = 1;
    }
    updateTotal();
  }

  function addCartClicked(event) {
    const button = event.target;
    const shopProducts = button.parentElement;
    const title = shopProducts.querySelector(".food-title").innerText;
    const price = shopProducts.querySelector(".food-price").innerText;
    const productImg = shopProducts.querySelector(".food-img").src;

    addProductToCart(title, price, productImg);
    updateTotal();
    blinkCart();
  }

  function addProductToCart(title, price, productImg) {
    const cartShopBox = document.createElement("div");
    cartShopBox.classList.add("cart-box");
    const cartItems = document.querySelector(".cart-content");
    const cartItemNames = cartItems.getElementsByClassName("cart-food-title");

    for (const cartItemName of cartItemNames) {
      if (cartItemName.innerText === title) {
        alert("You have already added this item to the cart");
        return;
      }
    }

    const cartBoxContent = `
      <img src="${productImg}" alt="" class="cart-img">
      <div class="detail-box">
        <div class="cart-food-title">${title}</div>
        <div class="cart-price">${price}</div>
        <input type="number" value="1" class="cart-quantity">
      </div>
      <ion-icon name="trash" class="cart-remove"></ion-icon>`;

    cartShopBox.innerHTML = cartBoxContent;
    cartItems.append(cartShopBox);
    cartShopBox.querySelector(".cart-remove").addEventListener("click", removeCartItem);
    cartShopBox.querySelector(".cart-quantity").addEventListener("change", quantityChanged);
  }

  function updateTotal() {
    const cartContent = document.querySelector(".cart-content");
    const cartBoxes = cartContent.getElementsByClassName("cart-box");
    let total = 0;

    for (const cartBox of cartBoxes) {
      const priceElement = cartBox.querySelector(".cart-price");
      const quantityElement = cartBox.querySelector(".cart-quantity");
      const price = parseFloat(priceElement.innerText.replace("kr", ""));
      const quantity = quantityElement.value;
      total += price * quantity;
    }

    document.querySelector(".total-price").innerText = total + "kr";
  }

  function blinkCart() {
    const cartIcon = document.querySelector("#cart-icon");
    let blinkCount = 0;
    const blinkInterval = setInterval(() => {
      cartIcon.style.color = blinkCount % 2 === 0 ? "#2ed573" : "#fff";
      blinkCount++;
      if (blinkCount >= 6) {
        clearInterval(blinkInterval);
        cartIcon.style.color = "#fff";
      }
    }, 500);
  }
});
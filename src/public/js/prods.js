const addEvents = () => {
    const addToCartButtons = document.querySelectorAll(".addToCart");
    addToCartButtons.forEach((button) => {
        button.addEventListener("click", addToCart);
    });
    const logoutButton = document.querySelector(".logout")
    logoutButton.addEventListener("click", logout)
    const cartBtn = document.querySelector(".cartBtn")
    cartBtn.addEventListener("click", goToCart)
};
let cartID = "";
const giveCart = async () => {
    cartID = localStorage.getItem("cartId");
    if (!cartID) {
        const response = await fetch("/sessions/getusercart", {
            method: "GET",
        })
        const result = await response.json()
        cartID = result.cart;
        localStorage.setItem("cartId", cartID);
    }
};


const addToCart = async (e) => {
    const productID = e.target.dataset.id;
    const response = await fetch(`/api/carts/${cartID}/product/${productID}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
    });
    const result = await response.json();
};

const logout = async() => {
    localStorage.clear()
    window.location.replace("/sessions/logout")
}
const goToCart = () => {
    window.location.replace(`/api/carts/${cartID}`)
}

window.addEventListener("load", () => {
    addEvents();
    giveCart();
});

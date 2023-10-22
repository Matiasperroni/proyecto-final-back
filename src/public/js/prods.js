const addEvents = () => {
    const addToCartButtons = document.querySelectorAll(".addToCart");
    addToCartButtons.forEach((button) => {
        button.addEventListener("click", addToCart);
    });
    const logoutButton = document.querySelector(".logout")
    logoutButton.addEventListener("click", logout)
};
let cartID = "";
const giveCart = async () => {
    cartID = localStorage.getItem("cartId");
    console.log("soy el guardado del ls", cartID);
    if (!cartID) {
        const response = await fetch("/sessions/getusercart", {
            method: "GET",
        })
        const result = await response.json()
        cartID = result.cart;
        localStorage.setItem("cartId", cartID);
    }
};
// window.addEventListener("load", giveCart)

const addToCart = async (e) => {
    const productID = e.target.dataset.id;
    console.log("soy cartid", cartID, "y el prod es: ", productID);
    const response = await fetch(`/api/carts/${cartID}/product/${productID}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        // body: "quantity: quantity" ,
    });
    const result = await response.json();
};

const logout = async() => {
    localStorage.clear()
    window.location.replace("/sessions/logout")
}

window.addEventListener("load", () => {
    addEvents();
    giveCart();
});

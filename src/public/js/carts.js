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
const addEvents = () => {
    const deleteBtns = document.querySelectorAll(".deleteFromCart");
    deleteBtns.forEach((button) => {
        button.addEventListener("click", deleteFromCart);
    });
    const goBackFunc = () => {
        window.location.replace("/api/products")
    }
    const goBack = document.querySelector(".goBack")
    goBack.addEventListener("click", goBackFunc)

    const purchaseBtn = document.querySelector(".purchase")
    purchaseBtn.addEventListener("click", purchase)

    const emptyCartBtn = document.querySelector(".emptyCart")
    emptyCartBtn.addEventListener("click", emptyCart)
};

const deleteFromCart = async (e) => {
    const productID = e.target.dataset.id;
    const response = await fetch(`/api/carts/${cartID}/products/${productID}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
        },
    });
    const result = await response.json();
    window.location.reload()
}

const purchase = async() => {
    window.location.replace(`/api/carts/${cartID}/purchase`)
}

const emptyCart = async() => {
    const response = await fetch(`/api/carts/${cartID}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
        },
    });
    const result = await response.json();
    window.location.reload()
}

window.addEventListener("load", () => {
    addEvents();
    giveCart()
});




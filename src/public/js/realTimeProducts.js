const socket = io();
const productList = document.getElementById("productsList")
// socket.on("message", (data)=>{console.log(data)})
socket.on("sendProducts", (products) => {
    console.log(products);
    productList.innerHTML = "";
    products.forEach(product => {
        const pCreated = document.createElement("p")
        pCreated.textContent = `
        Id: ${product._id}
        Title: ${product.title}
        Description: ${product.description}
        Category: ${product.category}
        Stock: ${product.stock}`;
        productList.appendChild(pCreated)
    });
});

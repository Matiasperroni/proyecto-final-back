export default class ProductDTO {
    constructor(product){
        this.title = product.title
        this.description = product.description
        this.price = product.price
        this.status = product.status
        this.stock = product.stock
        this.category = product.category
        this.code = product.code
        this.owner = product.owner
    }
}
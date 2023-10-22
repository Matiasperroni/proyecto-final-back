export default class ProductRepository {
    constructor(dao) {
        this.dao = dao;
    }
    getProducts = async() => {
        const products = await this.dao.getProducts()
        return products
    }
    addProduct = async (product)  => {
        const productAdded = await this.dao.addProduct(product) 
        return productAdded;
    }
    getProductById = async(pID) => {
        const product = await this.dao.getProductById(pID)
        return product
    }
    updateProduct = async (pid, prod) => {
        const updatedProduct = await this.dao.updateProduct(pid, prod)
        return updatedProduct
    }
    deleteProduct = async(pid) => {
        const deletedProduct = await this.dao.deleteProduct(pid)
        return deletedProduct
    }
}
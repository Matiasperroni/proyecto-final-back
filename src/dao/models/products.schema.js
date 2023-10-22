import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2"

export const collectionProduct = "products";

const productSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        index: true,
    },
    description: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    status: {
        type: Boolean,
        required: false,
    },
    stock: {
        type: Number,
        required: true,
    },
    category: {
        type: String,
        required: true,
    },
    thumbnails: {
        type: Array,
        required: false,
    },
    code: {
        type: String,
        required: true,
    },
    owner: {
        type: String,
        default: "Admin"
    }
});
productSchema.plugin(mongoosePaginate)
const productsModel = mongoose.model(collectionProduct, productSchema);
export default productsModel;

import path from "path"
import __dirname from '../utils.js';
import multer from "multer";

const uploader = (folderName) => {
    return multer({
        storage: multer.diskStorage({
            destination: function (req, file, cb) {
                cb(
                    null,
                    path.join(`${__dirname}/public/uploads/${folderName}`)
                );
            },
            filename: function (req, file, cb) {
                console.log("🚀 ~ file: upload-img.js:12 ~ file", file);
                cb(null, `${Date.now()}-${file.originalname}`);
            },
        }),
        onError: function (err, next) {
            console.log("🚀 ~ file: upload-img.js:17 ~ err ERROR AQUI", err);
            next();
        },
    });
};

export default uploader;

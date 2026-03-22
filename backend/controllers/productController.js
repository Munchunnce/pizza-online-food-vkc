import { Product } from "../models/index.js";
import multer from "multer";
import path from 'path';
import CustomErrorHandle from "../services/CustomErrorHandler.js";
import fs from 'fs';
import productSchema from "../validator/productValidator.js";

import { v2 as cloudinary } from 'cloudinary';
import { Readable } from 'stream';
import { CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET } from "../config/index.js";

// Configure Cloudinary
cloudinary.config({
    cloud_name: CLOUDINARY_CLOUD_NAME,
    api_key: CLOUDINARY_API_KEY,
    api_secret: CLOUDINARY_API_SECRET
});

const storage = multer.memoryStorage();

const uploadToCloudinary = (buffer) => {
    return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
            { folder: 'pizza/products' },
            (error, result) => {
                if (error) return reject(error);
                resolve(result);
            }
        );
        Readable.from(buffer).pipe(stream);
    });
};

const handlerMultipartData = multer({storage, limits: { fileSize: 1000000 * 5 } }).single('image');

const deleteCloudinaryImage = async (imageUrl) => {
    try {
        if (!imageUrl || !imageUrl.includes('cloudinary')) return;
        const splitUrl = imageUrl.split('/upload/');
        if(splitUrl.length > 1) {
            const pathAfterUpload = splitUrl[1];
            const parts = pathAfterUpload.split('/');
            parts.shift(); // remove version tag
            const publicIdWithExt = parts.join('/');
            const publicId = publicIdWithExt.substring(0, publicIdWithExt.lastIndexOf('.'));
            await cloudinary.uploader.destroy(publicId);
        }
    } catch(err) {
        console.error("Cloudinary delete error:", err);
    }
};


const productController = {
    async store(req, res, next) {
        // Multipart from data
        handlerMultipartData(req, res, async (err) => {
            if(err){
                return next(CustomErrorHandle.serverError(err.message));
            }
            // validate
            const { error } = productSchema.validate(req.body);
                            
            if(error){
                return next(error);
            }

            let filePath = '';
            if (req.file) {
                try {
                    const result = await uploadToCloudinary(req.file.buffer);
                    filePath = result.secure_url;
                } catch (uploadErr) {
                    return next(CustomErrorHandle.serverError('Image upload failed'));
                }
            } else {
                return next(CustomErrorHandle.serverError('Image is required'));
            }

            const { name, price, size } = req.body;
            let document;
            try {
                document = await Product.create({
                    name,
                    price,
                    size,
                    image: filePath
                })
            } catch (err) {
                return next(err);
            }
            res.status(201).json(document);
        })
    },

    async update(req, res, next) {
        // Multipart from data
        handlerMultipartData(req, res, async (err) => {
            if(err){
                return next(CustomErrorHandle.serverError(err.message));
            }

            // validate
            const { error } = productSchema.validate(req.body);
                            
            if(error){
                return next(error);
            }

            let filePath;
            if(req.file){
                try {
                    const result = await uploadToCloudinary(req.file.buffer);
                    filePath = result.secure_url;
                } catch (uploadErr) {
                    return next(CustomErrorHandle.serverError('Image upload failed'));
                }
            }

            const { name, price, size } = req.body;
            let document;
            try {
                document = await Product.findByIdAndUpdate({_id: req.params.id},{
                    name,
                    price,
                    size,
                    ...(req.file && { image: filePath })
                }, { new: true })
            } catch (err) {
                return next(err);
            }
            res.status(201).json(document);
        })
    },

    async destroy(req, res, next) {
        const document = await Product.findByIdAndDelete({ _id: req.params.id });
        if(!document){
            return next(new Error('Nothing to delete!'));
        }
        //image
        const imagePath = document._doc.image;
        if (imagePath && imagePath.includes('cloudinary')) {
            await deleteCloudinaryImage(imagePath);
        } else if (imagePath) {
            fs.unlink(`${appRoot}/${imagePath}`, (err) => {
                if(err) console.error(err);
            });
        }
        res.json(document);
    },

    // get All products
    async index(req, res, next) {
        let document;
        // pagination mongoose-pagination
        try {
            document = await Product.find().select('-updatedAt -__v').sort({_id: -1});
        } catch (err) {
            return next(CustomErrorHandle.serverError());
        }
        res.json(document);
    },

    // get single product
    async show(req, res, next) {
        let document;
        try {
            document = await Product.findOne({_id: req.params.id }).select('-updatedAt -__v');
        } catch (err) {
            return next(CustomErrorHandle.serverError());
        }
        res.json(document);
    }
};



export default productController;

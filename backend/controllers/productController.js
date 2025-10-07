import { Product } from "../models/index.js";
import multer from "multer";
import path from "path";
import CustomErrorHandle from "../services/CustomErrorHandler.js";
import fs from "fs";
import productSchema from "../validator/productValidator.js";
import dotenv from "dotenv";

dotenv.config();

// ✅ Multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"), // uploads folder
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${Math.floor(Math.random() * 1e9)}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  },
});

const handlerMultipartData = multer({
  storage,
  limits: { fileSize: 15 * 1024 * 1024 }, // 5MB
}).single("image");

// ✅ Base URL
const BASE_URL = process.env.BASE_URL || "http://localhost:5000";

const productController = {
  // ✅ Create product
  async store(req, res, next) {
    handlerMultipartData(req, res, async (err) => {
      if (err) return next(CustomErrorHandle.serverError(err.message));

      const { error } = productSchema.validate(req.body);
      if (error) return next(error);

      const { name, price, size } = req.body;
      const filePath = req.file ? `uploads/${req.file.filename}` : null;

      try {
        const document = await Product.create({ name, price, size, image: filePath });
        res.status(201).json({
          ...document._doc,
          image: filePath ? `${BASE_URL}/${filePath}` : null,
        });
      } catch (err) {
        return next(err);
      }
    });
  },

  // ✅ Update product
  async update(req, res, next) {
    handlerMultipartData(req, res, async (err) => {
      if (err) return next(CustomErrorHandle.serverError(err.message));

      const { error } = productSchema.validate(req.body);
      if (error) return next(error);

      const { name, price, size } = req.body;
      const filePath = req.file ? `uploads/${req.file.filename}` : null;

      try {
        const document = await Product.findByIdAndUpdate(
          req.params.id,
          {
            name,
            price,
            size,
            ...(filePath && { image: filePath }),
          },
          { new: true }
        );

        res.status(200).json({
          ...document._doc,
          image: document.image ? `${BASE_URL}/${document.image}` : null,
        });
      } catch (err) {
        return next(err);
      }
    });
  },

  // ✅ Delete product
  async destroy(req, res, next) {
    try {
      const document = await Product.findByIdAndDelete(req.params.id);
      if (!document) return next(new Error("Nothing to delete!"));

      // Delete image file
      if (document.image) {
        fs.unlink(`${appRoot}/${document.image}`, (err) => {
          if (err) console.error("Image delete error:", err.message);
        });
      }

      res.json(document);
    } catch (err) {
      return next(CustomErrorHandle.serverError());
    }
  },

  // ✅ Get all products
  async index(req, res, next) {
    try {
      const documents = await Product.find().select("-updatedAt -__v").sort({ _id: -1 });

      const withFullUrls = documents.map((item) => ({
        ...item._doc,
        image: item.image ? `${BASE_URL}/${item.image.replace(/\\/g, '/')}` : null,
      }));

      res.json(withFullUrls);
    } catch (err) {
      console.error("Product fetch error:", err.message);
      return next(CustomErrorHandle.serverError());
    }
  },

  // ✅ Get single product
  async show(req, res, next) {
    try {
      const document = await Product.findById(req.params.id).select("-updatedAt -__v");
      if (!document) return next(CustomErrorHandle.notFound());

      res.json({
        ...document._doc,
        image: document.image ? `${BASE_URL}/${document.image.replace(/\\/g, '/')}` : null,
      });
    } catch (err) {
      return next(CustomErrorHandle.serverError());
    }
  },
};

export default productController;

import { Product } from "../models/index.js";
import multer from "multer";
import path from "path";
import CustomErrorHandle from "../services/CustomErrorHandler.js";
import fs from "fs";
import productSchema from "../validator/productValidator.js";
import dotenv from "dotenv";

dotenv.config();
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${Math.random() * 1e9}${path.extname(
      file.originalname
    )}`;
    cb(null, uniqueName);
  },
});

const handlerMultipartData = multer({
  storage,
  limits: { fileSize: 1000000 * 5 },
}).single("image");

// ✅ Base URL (works both locally and on Vercel)
const BASE_URL = process.env.BASE_URL || "http://localhost:5000";

const productController = {
  async store(req, res, next) {
    // Multipart from data
    handlerMultipartData(req, res, async (err) => {
      if (err) {
        return next(CustomErrorHandle.serverError(err.message));
      }
      const filePath = req.file.path.replace(/\\/g, "/");
      // validate
      const { error } = productSchema.validate(req.body);

      if (error) {
        //Delete the uploaded file
        fs.unlink(`${appRoot}/${filePath}`, (err) => {
          if (err) {
            return next(CustomErrorHandle.serverError(err.message));
          }
        });
        return next(error);
      }

      const { name, price, size } = req.body;
      let document;
      try {
        document = await Product.create({
          name,
          price,
          size,
          image: filePath,
        });
        // ✅ Return full URL for frontend
        res.status(201).json({
          ...document._doc,
          image: `${BASE_URL}/${document.image.replace(/\\/g, '/')}`,
        });
      } catch (err) {
        return next(err);
      }
      // res.status(201).json(document);
    });
  },

  async update(req, res, next) {
    // Multipart from data
    handlerMultipartData(req, res, async (err) => {
      if (err) {
        return next(CustomErrorHandle.serverError(err.message));
      }

      let filePath;
      if (req.file) {
        filePath = req.file.path.replace(/\\/g, "/");
      }
      // validate
      const { error } = productSchema.validate(req.body);

      if (error) {
        //Delete the uploaded file
        if (req.file) {
          fs.unlink(`${appRoot}/${filePath}`, (err) => {
            if (err) {
              return next(CustomErrorHandle.serverError(err.message));
            }
          });
        }
        return next(error);
      }

      const { name, price, size } = req.body;
      let document;
      try {
        document = await Product.findByIdAndUpdate(
          { _id: req.params.id },
          {
            name,
            price,
            size,
            ...(req.file && { image: filePath }),
          },
          { new: true }
        );

        res.status(201).json({
          ...document._doc,
          image: `${BASE_URL}/${document.image}`,
        });
      } catch (err) {
        return next(err);
      }
      // res.status(201).json(document);
    });
  },

  async destroy(req, res, next) {
    const document = await Product.findByIdAndDelete({ _id: req.params.id });
    if (!document) {
      return next(new Error("Nothing to delete!"));
    }
    //image
    const imagePath = document._doc.image;
    fs.unlink(`${appRoot}/${imagePath}`, (err) => {
      if (err) {
        return next(CustomErrorHandle.serverError());
      }
    });
    res.json(document);
  },

  // get All products
  async index(req, res, next) {
    try {
      const documents = await Product.find()
        .select("-updatedAt -__v")
        .sort({ _id: -1 });

      // ✅ Add full URL before sending
      const withFullUrls = documents.map((item) => ({
        ...item._doc,
        image: `${BASE_URL}/${p._doc.image.replace(/\\/g, '/')}`,
      }));

      res.json(withFullUrls);
    } catch (err) {
      console.error("Product fetch error:", err.message);
      return next(CustomErrorHandle.serverError());
    }
  },

  // async index(req, res, next) {
  //     let document;
  //     // pagination mongoose-pagination
  //     try {
  //         document = await Product.find().select('-updatedAt -__v').sort({_id: -1});
  //         // ✅ Add full URL before sending
  //         const withFullUrls = products.map((item) => ({
  //             ...item._doc,
  //             image: `${BASE_URL}/${item.image}`,
  //         }));
  //         res.json(withFullUrls);
  //     } catch (err) {
  //         return next(CustomErrorHandle.serverError());
  //     }
  //     // res.json(document);
  // },

  // get single product
  async show(req, res, next) {
    try {
      const document = await Product.findById(req.params.id).select(
        "-updatedAt -__v"
      );
      if (!document) return next(CustomErrorHandle.notFound());

      res.json({
        ...document._doc,
        image: `${BASE_URL}/${document.image}`,
      });
    } catch (err) {
      return next(CustomErrorHandle.serverError());
    }
  },
  // async show(req, res, next) {
  //     let document;
  //     try {
  //         document = await Product.findOne({_id: req.params.id }).select('-updatedAt -__v');
  //     } catch (err) {
  //         return next(CustomErrorHandle.serverError());
  //     }
  //     res.json(document);
  // }
};

export default productController;

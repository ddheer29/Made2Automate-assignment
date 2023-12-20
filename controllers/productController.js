var slugify = require('slugify')
const Products = require('../model/productModel');
const fs = require('fs');

exports.createProductController = async (req, res) => {
    try {
        const { name, slug, productid, manufacturername, description, quantity, category } = req.fields;
        const { photo } = req.files;
        switch (true) {
            case !name:
                return res.status(500).send({ message: 'Name is required' });
            case !productid:
                return res.status(500).send({ message: 'ProductID is required' });
            case !manufacturername:
                return res.status(500).send({ message: 'Manufacturer name is required' });
            case !description:
                return res.status(500).send({ message: 'Description is required' });
            case !quantity:
                return res.status(500).send({ message: 'Quantity is required' });
            case !category:
                return res.status(500).send({ message: 'Category is required' });
            case photo && photo.size > 1000:
                return res.status(500).send({ message: 'Photo is required and should be less than 1MB' });
        }
        const products = new Products({ ...req.fields, slug: slugify(name) });
        if (photo) {
            products.photo.data = fs.readFileSync(photo.path);
            products.photo.contentType = photo.type;
        }
        await products.save();
        res.status(201).send({
            success: true,
            message: "Product Created Successfully",
            products,
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            error,
            message: 'Error in creating product'
        })
    }
}

exports.getProductController = async (req, res) => {
    try {
        const products = await Products.find({}).select("-photo").limit(12).sort({ createdAt: -1 });
        res.status(200).send({
            success: true,
            total: products.length,
            message: 'All products',
            products,
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: 'Error in getting product',
            error
        })
    }
}

exports.getSingleProductController = async (req, res) => {
    try {
        const products = await Products.findOne({ slug: req.params.slug }).select("-photo");
        res.status(200).send({
            success: true,
            total: products.length,
            message: 'Product fetched successfully',
            products,
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: 'Error in getting product',
            error
        })
    }
}

exports.productPhotoController = async (req, res) => {
    try {
        const product = await Products.findById(req.params.pid).select('photo');
        if (product.photo.data) {
            res.set('Content-type', product.photo.contentType);
            return res.status(200).send(product.photo.data)
        }
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: 'Error in getting product photo',
            error
        })
    }
}

exports.deleteProductController = async (req, res) => {
    try {
        await Products.findByIdAndDelete(req.params.pid).select("-photo");
        res.status(200).send({
            success: true,
            message: 'Product deleted successfully',
        })

    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: 'Error in deleting product',
            error
        })
    }
}

exports.updateProductController = async (req, res) => {
    try {
        const { name, slug, productid, manufacturername, description, quantity } = req.fields;
        const { photo } = req.files;
        switch (true) {
            case !name:
                return res.status(500).send({ message: 'Name is required' });
            case !productid:
                return res.status(500).send({ message: 'ProductID is required' });
            case !manufacturername:
                return res.status(500).send({ message: 'Manufacturer name is required' });
            case !description:
                return res.status(500).send({ message: 'Description is required' });
            case !quantity:
                return res.status(500).send({ message: 'Quantity is required' });
            case photo && photo.size > 1000000:
                return res.status(500).send({ message: 'Photo is required and should be less than 1MB' });
        }
        const products = await Products.findByIdAndUpdate(req.params.pid,
            { ...req.fields, slug: slugify(name) },
            { new: true }
        );
        if (photo) {
            products.photo.data = fs.readFileSync(photo.path);
            products.photo.contentType = photo.type;
        }
        await products.save();
        res.status(201).send({
            success: true,
            message: "Product updated Successfully",
            products,
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            error,
            message: 'Error in updating product'
        })
    }
}


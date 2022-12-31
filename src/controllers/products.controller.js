const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

exports.getAllProducts = async (req, res) => {
  try {
    const allProducts = await prisma.products.findMany();
    return res.status(200).json({
      success: true,
      message: "List of products",
      results: allProducts,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

exports.getProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await prisma.products.findUnique({
      where: {
        id: parseInt(id),
      },
    });
    if (!product) {
      return res.status(404).json({
        success: false,
        message: `Product with id ${id} not found`,
      });
    }
    return res.status(200).json({
      success: true,
      message: `Product with id ${id} found`,
      results: product,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

exports.createProduct = async (req, res) => {
  try {
    const {
      name,
      price,
      description,
      stock,
      deliveryStart,
      deliveryEnd,
      picture,
    } = req.body;
    const product = await prisma.products.create({
      data: {
        name,
        price: parseInt(price),
        description,
        stock: parseInt(stock),
        deliveryStart: new Date(deliveryStart),
        deliveryEnd: new Date(deliveryEnd),
        picture,
      },
    });
    return res.status(201).json({
      success: true,
      message: "Products created successfully",
      results: product,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

exports.updateProduct = async (req, res) => {
  const { id } = req.params;
  const {
    name,
    price,
    description,
    stock,
    deliveryStart,
    deliveryEnd,
    picture,
  } = req.body;
  try {
    const product = await prisma.products.update({
      where: {
        id: parseInt(id),
      },
      data: {
        name,
        price: parseInt(price),
        description,
        stock: parseInt(stock),
        deliveryStart: new Date(deliveryStart),
        deliveryEnd: new Date(deliveryEnd),
        picture,
      },
    });
    return res.status(200).json({
      success: true,
      message: `Product with id ${id} updated successfully`,
      results: product,
    });
  } catch (error) {
    console.log(error);
    if (error.code === "P2025") {
      return res.status(404).json({
        success: false,
        message: `Product with id ${id} not found`,
      });
    }
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

exports.deleteProduct = async (req, res) => {
  const { id } = req.params;
  try {
    const product = await prisma.products.delete({
      where: {
        id: parseInt(id),
      },
    });
    return res.status(200).json({
      success: true,
      message: `Product with id ${id} deleted successfully`,
      results: product,
    });
  } catch (error) {
    if (error.code === "P2025") {
      return res.status(404).json({
        success: false,
        message: `Product with id ${id} not found`,
      });
    }
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
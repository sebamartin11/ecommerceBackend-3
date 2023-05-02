const { MongoDbConnection } = require("../../../db/mongoDB/mongo.manager");
const { ProductsModel } = require("../../schemas/products.schema");

class ProductsMongoDao {
  constructor() {
    MongoDbConnection.getInstance();
  }

  async getProducts({ limit, page, query, sort }) {
    try {
      const filter = query ? { category: query } : {};

      const options = {
        sort: sort ? { price: sort } : {},
        limit: limit || 10,
        page: page || 1,
        lean: true,
      };

      const allProducts = await ProductsModel.paginate(filter, options);
      return allProducts;
    } catch (error) {
      throw new Error(`Couldn't read file ${error}`);
    }
  }

  async addProduct(
    title,
    description,
    code,
    price,
    thumbnail,
    stock,
    category,
    status
  ) {
    try {
      const obj = {
        title,
        description,
        code,
        price,
        thumbnail,
        stock,
        category,
        status,
      };
      const newProduct = await ProductsModel.create(obj);
      return newProduct;
    } catch (error) {
      throw new Error(`Error saving: ${error}`);
    }
  }

  async getProductById(pid) {
    try {
      const productById = await ProductsModel.findById(pid);
      return productById;
    } catch (error) {
      throw new Error(`Product with id: ${pid} was not found: ${error}`);
    }
  }

  async updateProduct(pid, newProductProperties) {
    try {
      const productUpdated = await ProductsModel.findByIdAndUpdate(
        pid,
        newProductProperties
      );
      return productUpdated;
    } catch (error) {
      throw new Error(`Error updating ${error}`);
    }
  }

  async deleteProduct(pid) {
    try {
      const response = await ProductsModel.findByIdAndDelete(pid);
      return `Product with id: ${response.id} was deleted successfully`;
    } catch (error) {
      throw new Error(`Error deleting: ${error}`);
    }
  }
}

module.exports = ProductsMongoDao;

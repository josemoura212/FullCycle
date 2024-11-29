import { Sequelize } from "sequelize-typescript";
import ProductModel from "../../infrastructure/product/repository/sequelize/product.model";
import ProductRepository from "../../infrastructure/product/repository/sequelize/product.repository";
import CreateProductUseCase from "./create/create.product.usecase";
import FindProductUseCase from "./find/find.produtct.usecase";
import UpdateProductUseCase from "./update/update.product.dto";
import ListProductUseCase from "./list/list.product.usecase";

describe("Test product use case", () => {
  let sequelize: Sequelize;

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: "sqlite",
      storage: ":memory:",
      logging: false,
      sync: { force: true },
    });
    await sequelize.addModels([ProductModel]);

    await sequelize.sync();
  });

  afterEach(async () => {
    await sequelize.close();
  });

  it("should create a product", async () => {
    // Arrange
    const productRepository = new ProductRepository();
    const createUsecase = new CreateProductUseCase(productRepository);
    const inputCreate = {
      name: "Product 1",
      price: 100,
    };

    const product = await createUsecase.execute(inputCreate);

    const findUsecase = new FindProductUseCase(productRepository);
    const inputFind = {
      id: product.id,
    };

    const outputFind = {
      id: product.id,
      name: product.name,
      price: product.price,
    };

    // Act
    const result = await findUsecase.execute(inputFind);

    // Assert
    expect(result).toEqual(outputFind);
  });

  it("should thrown an error when name is missing", async () => {
    // Arrange
    const productRepository = new ProductRepository();
    const createUsecase = new CreateProductUseCase(productRepository);
    const inputCreate = {
      name: "",
      price: 100,
    };

    // Act
    const result = createUsecase.execute(inputCreate);

    // Assert
    await expect(result).rejects.toThrowError("Name is required");
  });

  it("should update a product", async () => {
    // Arrange
    const productRepository = new ProductRepository();
    const createUsecase = new CreateProductUseCase(productRepository);
    const inputCreate = {
      name: "Product 1",
      price: 100,
    };

    const product = await createUsecase.execute(inputCreate);

    const updateUsecase = new UpdateProductUseCase(productRepository);
    const inputUpdate = {
      id: product.id,
      name: "Product Updated",
      price: 200,
    };

    const outputUpdate = {
      id: product.id,
      name: "Product Updated",
      price: 200,
    };

    // Act
    const result = await updateUsecase.execute(inputUpdate);

    // Assert
    expect(result).toEqual(outputUpdate);
  });

  it("should find a product", async () => {
    // Arrange
    const productRepository = new ProductRepository();
    const createUsecase = new CreateProductUseCase(productRepository);
    const inputCreate = {
      name: "Product 1",
      price: 100,
    };

    const product = await createUsecase.execute(inputCreate);

    const findUsecase = new FindProductUseCase(productRepository);
    const inputFind = {
      id: product.id,
    };

    const outputFind = {
      id: product.id,
      name: product.name,
      price: product.price,
    };

    // Act
    const result = await findUsecase.execute(inputFind);

    // Assert
    expect(result).toEqual(outputFind);
  });

  it("should find all products", async () => {
    // Arrange
    const productRepository = new ProductRepository();
    const createUsecase = new CreateProductUseCase(productRepository);
    const inputCreate1 = {
      name: "Product 1",
      price: 100,
    };
    const inputCreate2 = {
      name: "Product 2",
      price: 200,
    };

    const product1 = await createUsecase.execute(inputCreate1);
    const product2 = await createUsecase.execute(inputCreate2);

    const listUsecase = new ListProductUseCase(productRepository);
    const inputList = {};

    const outputList = {
      products: [
        {
          id: product1.id,
          name: product1.name,
          price: product1.price,
        },
        {
          id: product2.id,
          name: product2.name,
          price: product2.price,
        },
      ],
    };

    // Act

    const result = await listUsecase.execute(inputList);

    // Assert
    expect(result).toEqual(outputList);
  });
});

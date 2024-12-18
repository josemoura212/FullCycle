import express, { Request, Response } from "express";
import ProductRepository from "../../../modules/product-adm/repository/product.repository";
import AddProductUseCase from "../../../modules/product-adm/usecase/add-product/add-product.usecase";
import CheckStockUseCase from "../../../modules/product-adm/usecase/check-stock/check-stock.usecase";

export const productRoute = express.Router();

productRoute.post("/", async (req: Request, res: Response) => {
  const usecase = new AddProductUseCase(new ProductRepository());
  try {
    const productDto = {
      id: req.body.id,
      name: req.body.name,
      description: req.body.description,
      purchasePrice: req.body.purchasePrice,
      stock: req.body.stock
    };
    const output = await usecase.execute(productDto);
    res.send(output);
  } catch (err) {
    res.status(500).send(err);
  }
});

productRoute.get("/:productId", async (req: Request, res: Response) => {
  const usecase = new CheckStockUseCase(new ProductRepository());
  const output = await usecase.execute({productId:  req.params.productId});

  res.format({
    json: async () => res.send(output),
  });
});

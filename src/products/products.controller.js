const productsService = require("./products.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary")

async function productExists(req, res, next) {
  const product = await productsService.read(req.params.productId);
  if(product){
    res.locals.product=product;
    next();
  }
  next(
    { status: 404, message: `Product cannot be found.` }
  )
}

function read(req, res) {
 const {product:data}=res.locals;
//  const id = data.product_id
//  const result = await productsService.read(id)
 res.json({data})
}

async function list(req, res, next) {
  const products = await productsService.list()
  res.json({products})
}
async function listOutOfStockCount(req,res,next){
  res.json({data:await productsService.listOutOfStockCount()})
}
async function listPriceSummary(req,res,next){
  res.json({data:await productsService.listPriceSummary()})
}
async function listTotalWeightByProduct(req, res) {
  res.json({ data: await productsService.listTotalWeightByProduct() });
}
module.exports = {
  read: [asyncErrorBoundary(productExists),read],
  list: asyncErrorBoundary(list),
  listOutOfStockCount:asyncErrorBoundary(listOutOfStockCount),
  listPriceSummary:asyncErrorBoundary(listPriceSummary),
  listTotalWeightByProduct:asyncErrorBoundary(listTotalWeightByProduct),
};

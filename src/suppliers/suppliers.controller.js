const supplierService = require("./suppliers.service.js")
const hasProperties = require("../errors/hasProperties");
const asyncErrorBoundary=require("../errors/asyncErrorBoundary.js")


const VALID_PROPERTIES = [
  "supplier_name",
  "supplier_address_line_1",
  "supplier_address_line_2",
  "supplier_city",
  "supplier_state",
  "supplier_zip",
  "supplier_phone",
  "supplier_email",
  "supplier_notes",
  "supplier_type_of_goods",
];

async function supplierExists(req, res, next) {
  const supplier = await supplierService.read(req.params.supplierId)
  if(supplier){
    res.locals.supplier=supplier;
    next();
  }
  next({
    status: 404, message: `Supplier cannot be found.` 
  })
}

const hasRequiredProperties = hasProperties("supplier_name", "supplier_email");

function hasOnlyValidProperties(req, res, next) {
  const { data = {} } = req.body;

  const invalidFields = Object.keys(data).filter(
    (field) => !VALID_PROPERTIES.includes(field)
  );

  if (invalidFields.length) {
    return next({
      status: 400,
      message: `Invalid field(s): ${invalidFields.join(", ")}`,
    });
  }
  next();
}

async function create(req, res, next) {
  const data = await supplierService.create(req.body.data)
  res.status(201).json({data});
}

async function update(req, res, next) {
  const updatedSupplier = {
    ...req.body.data,
    supplier_id: res.locals.supplier.supplier_id,
  };
  const data = await supplierService.update(updatedSupplier)
  res.json({ data })
}

async function destroy(req, res, next) {
  const deletedSuppliers = await supplierService.delete(res.locals.supplier.supplier_id)
  res.sendStatus(204);
}
function read(req, res) {
  const {product:data}=res.locals;
  res.json({data})
 }
 
module.exports = {
  read:[asyncErrorBoundary(supplierExists),read],
  create:[hasOnlyValidProperties,hasRequiredProperties,asyncErrorBoundary(create)],
  update:[asyncErrorBoundary(supplierExists),hasOnlyValidProperties,hasRequiredProperties,asyncErrorBoundary(update)],
  delete: [asyncErrorBoundary(supplierExists),asyncErrorBoundary(destroy)],
};

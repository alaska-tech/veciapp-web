// Lista de campos permitidos para ACTUALIZAR entidades existentes
const VENDOR_EDITABLE_FIELDS = [
  "name",
  "RUT",
  "email",
  "phone",
  "legalRepresentative",
  "bankAccount",
];
const BRANCH_EDITABLE_FIELDS = [
  "name",
  "address",
  "phone",
  "operatingHours",
  "description",
  "managerName",
  "managerPhone",
];
const PRODUCT_EDITABLE_FIELDS = [
  "name",
  "description",
  "shortDescription",
  "price",
  "discount",
  "currency",
  "mainImage",
  "images",
  "tags",
  "presentation",
  "ingredients",
  "allergens",
  "serviceScheduling",
  "categoryId",
];
const CUSTOMER_EDITABLE_FIELDS = [
  "fullName",
  "cellphone",
  "identification",
  "address",
  "gender",
  "birtdate",
  "avatar",
];

// Lista de campos permitidos para CREAR una nueva tienda
const BRANCH_CREATION_FIELDS = [
  "name",
  "address",
  "description",
  "phone",
  "latitude",
  "longitude",
  "operatingHours",
  "managerName",
  "managerPhone",
  "businessType",
  "logo",
  "images",
  "isPickupAvailable",
  "isDeliveryAvailable",
  "availablePaymentMethods",
];

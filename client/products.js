Template.products.helpers({
  products: function () {
    return Products.find({});
  }
});

// Template.product.helpers({
//   editDocument: function () {

//   }
// });

// Template.editDocument.rendered = function () {

//   this.data = Products.findOne({_id: this.data}).editDoc()

//     // debugger;
// }
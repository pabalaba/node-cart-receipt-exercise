import {carts, products, promoCode, users} from "./dataset.mjs";
import * as core from "./core-cart.mjs";

/*console.log('Promo', promoCode);
console.log('Products', products);
console.log('Users', users);
console.log('Cart', carts);*/

for (let cartRow of carts) {
    let user = core.getUser(cartRow.user);
    let cart = core.getProductsArray(cartRow.products);
    console.log(core.getReceipt(user,cart),'\n\n\n');
}
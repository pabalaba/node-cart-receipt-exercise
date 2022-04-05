import {carts, products, promoCode, users} from "./dataset.mjs";
import * as core from "./core-cart.mjs";

/*console.log('Promo', promoCode);
console.log('Products', products);
console.log('Users', users);
console.log('Cart', carts);*/

console.log('Discount', core.discountedPrice(100, 0.2));
console.log('> ',core.printShopName())
console.log('>',core.formatProductName(products[0]));


for (let cartRow of carts) {

    // genera ricevuta
}
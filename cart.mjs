import {carts, products, promoCode, users} from "./dataset.mjs";
import * as core from "./core-cart.mjs";

/*console.log('Promo', promoCode);
console.log('Products', products);
console.log('Users', users);
console.log('Cart', carts);*/

for (let cartRow of carts) {
    let user = core.getUser(cartRow.user);
    let totale = core.getTotale(cartRow.products)
    let sconto = core.getSconto(totale,core.getUserDiscount(user.promo))
    let resultString = '';
    resultString += core.createSeparator('+','-') + '\n';
    resultString += core.printShopName() + '\n';
    resultString += core.getDateAsString() + '\n';
    resultString += core.createSeparator('*','-') + '\n';
    resultString += core.getProductList(core.getProductsArray(cartRow.products));
}
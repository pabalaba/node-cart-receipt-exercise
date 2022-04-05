import {carts, products, promoCode, users} from "./dataset.mjs";

import * as fs from "fs";
import * as os from "os";

const discountedPrice = (price, rate = 0.10) => (price * (1 - rate)).toFixed(2);

const printShopName = () =>{
    const machine = os.userInfo();
    const machineName = machine.username;
    const pid = process.pid
    return `${machineName.toUpperCase()} - Cart ${pid}`;
}

const getUserDiscount = (promo) =>{
    if(promo === undefined)
        return 0.00;
    promoCode.forEach(element => {
        if(element.name === promo){
            let percentage = Number.parseFloat(element.percentage)
            return percentage; 
        }
    });
    return 0.00;
}

const getUser = (uuid) => users.find(user => user.uuid === uuid);

const formatProductName = (product) => {
    const stringDimension = 54;
    let spaceEan = 3;
    let spaceName = 15;
    let spacePrice = 26;
    let stringResult = '';
    for(let i = 0;i < stringDimension;){
        if(stringResult.length === spaceEan)
            stringResult += `[${product.ean}]`;
        else if(stringResult.length === spaceName)
            stringResult += `${stringFormat(product.name)}`
        else if(stringResult.length === spacePrice)
            stringResult += `${product.price}`
        else 
            stringResult += ' ';
        i = stringResult.length;
    }
    return stringResult;
}

const stringFormat = (string) => string.toLowerCase().substring(0,1).toUpperCase()+string.toLowerCase().substring(1,string.length)

export {
    discountedPrice,
    printShopName, 
    getUserDiscount,
    getUser,
    formatProductName
};
import {carts, products, promoCode, users} from "./dataset.mjs";

import * as fs from "fs";
import * as os from "os";
import { sep } from "path";
const stringDimension = 64;

const discountedPrice = (price, rate = 0.10) => (price * (1 - rate)).toFixed(2);

const printShopName = () =>{
    const machine = os.userInfo();
    const machineName = machine.username;
    const pid = process.pid
    return `   ${machineName.toUpperCase()} - Cart ${pid}`;
}

const getUserDiscount = (promo) =>{
    if(promo === undefined)
        return 0.00;
    let result = promoCode.find(element =>{
        return element.name === promo
    })
    if(result?.percentage !== undefined)
        return result?.percentage
    return 0.00;
}

const getUser = (uuid) => users.find(user => user.uuid === uuid);

const getProduct = (codice) => products.find(prod => prod.ean === codice)

const getProductsArray = (prods) => {
    let array = []
    for(let pr in prods){
        array.push(getProduct(pr));
    }
    return array;
}

const getProductList = (prods) => {
    let stringResult = '';
    for(let i = 0;i < prods.length;i++){
        if(i!==0)
            stringResult+='\n'
        stringResult += formatProductName(prod)
    }
    return stringResult
}

const formatProductName = (product) => {
    
    let spaceEan = 3;
    let spaceName = 15;
    let spacePrice = 36;
    let stringResult = '';
    for(let i = 0;i < stringDimension;){
        if(stringResult.length === spaceEan)
            stringResult += `[${product.ean}]`;
        else if(stringResult.length === spaceName){
            let multiName = product.name.split(' ');
            for (let piece of multiName)
                stringResult += `${stringFormat(piece)} `;
        }
        else if(stringResult.length === spacePrice){
            stringResult += `${product?.price}`
        }    
        else 
            stringResult += ' ';
        i = stringResult.length;
    }
    return stringResult;
}

const stringFormat = (string) => string.toLowerCase().substring(0,1).toUpperCase()+string.toLowerCase().substring(1,string.length)

const getTotale = (productsUser) => {
    let totale = 0;
    productsUser.forEach(element =>{
        totale += products.find(prod => element === prod.ean).price
    })
    return totale;
}

const getTotaleString = (totale) => {
    let spaceTotaleStr = 3;
    let spaceTotale = 36;
    let stringResult = ''
    for(let i = 0;i < stringDimension;){
        if(stringResult.length === spaceTotaleStr)
            stringResult += `Totale:`;
        else if(stringResult.length === spaceTotale){
            stringResult += `${totale}`
        }    
        else 
            stringResult += ' ';
        i = stringResult.length;
    } 
    return stringResult
}

const getSconto = (totale,sconto) => totale*(1-sconto);

const getDateAsString = () => {
    let days = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat']
    let months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
    var today = new Date();
    return `   ${days[today.getDay()]} ${months[today.getMonth()]} ${today.getDate()} ${today.getFullYear()}`
}

const getPromoAsString = (promo) => {
    if(promo === undefined)
        return '';
    let result = promoCode.find(element =>{
        return element.name === promo
    })
    if(result?.name !== undefined)
        return result?.name
    return '';
}

const createSeparator = (separator,symbol) => {
    let stringResult = '';
    for(let i = 0;i < stringDimension;){
        if(i === 0 || i === stringDimension-separator.length)
            stringResult += separator
        else
            stringResult += symbol
        i = stringResult.length;
    }
    return stringResult
}

const createScontoString = (sconto) => {
    let stringResult = '';
    let spaceScontoStr = 3;
    let spaceSconto = 36;
    for(let i = 0;i < stringDimension;){
        if(stringResult.length === spaceScontoStr)
            stringResult += `Sconto:`;
        else if(stringResult.length === spaceSconto){
            stringResult += `${sconto}`
        }    
        else 
            stringResult += ' ';
        i = stringResult.length;
    }
    return stringResult
}

const createTotaleScontatoString = (sconto,totale) => {
    let stringResult = '';
    let spaceTotScontoStr = 3;
    let spaceTotSconto = 36;
    for(let i = 0;i < stringDimension;){
        if(stringResult.length === spaceTotScontoStr)
            stringResult += `Totale Scontato:`;
        else if(stringResult.length === spaceTotSconto){
            stringResult += `${totale - sconto}`
        }    
        else 
            stringResult += ' ';
        i = stringResult.length;
    }
    return stringResult
}

const createCodicePromoString = (promo) => {
    let spaceCodicePromo = 3;
    let spaceCodicePromoCod = 36;
    for(let i = 0;i < stringDimension;){
        if(stringResult.length === spaceCodicePromo)
            stringResult += `CODICE PROMO:`;  
        else if(stringResult.length === spaceCodicePromoCod)
            stringResult += promo
        else 
            stringResult += ' ';
        i = stringResult.length;
    }
    return stringResult 
}

const createSaldoResiduo = (user,totale) => {
    let spaceSaldoResiduo = 3;
    for(let i = 0;i < stringDimension;){
        if(stringResult.length === spaceSaldoResiduo)
            stringResult += `${user.firstName} ${user.firstName} ha un credito residuo di ${user.wallet-totale}`;  
        else 
            stringResult += ' ';
        i = stringResult.length;
    }
    return stringResult
}

export {
    discountedPrice,
    printShopName, 
    getUserDiscount,
    getUser,
    getProductList,
    getTotale,
    getTotaleString,
    getDateAsString,
    getPromoAsString,
    getSconto,
    createSeparator,
    createScontoString,
    createTotaleScontatoString,
    createSaldoResiduo,
    createCodicePromoString,
    getProductsArray
};
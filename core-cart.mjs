import {carts, products, promoCode, users} from "./dataset.mjs";

import * as fs from "fs";
import * as os from "os";
const stringDimension = 64;

const stringFormat = (string) => string.toLowerCase().substring(0,1).toUpperCase()+string.toLowerCase().substring(1,string.length)

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

const getProductsArray = (prodotti) => {
    let array = []
    for(let item of prodotti){
        array.push(getProduct(item));
    }
    return array;
}

const getTotale = (productsUser) => {
    let totale = 0;
    productsUser.forEach(element =>{
        totale += element.price
    })
    return totale;
}

const getSconto = (totale,sconto) => totale*(sconto);

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

const getTotaleScontato = (totale,sconto) => totale-sconto;

/** Metodi per la creazione delle stringhe utili nella ricevuta **/

const createStringProductList = (prodotti) => {
    let stringResult = '';
    for(let item of prodotti){
        if(item !== prodotti[0])
            stringResult += '\n';
        stringResult += formatProductName(item);
    }
    return stringResult
}

const createStringTotale = (totale) => {
    let spaceTotaleStr = 3;
    let spaceTotale = 36;
    let stringResult = ''
    for(let i = 0;i < stringDimension;){
        if(stringResult.length === spaceTotaleStr)
            stringResult += `Totale:`;
        else if(stringResult.length === spaceTotale){
            stringResult += `${(totale).toFixed(2)}`
        }    
        else 
            stringResult += ' ';
        i = stringResult.length;
    } 
    return stringResult
}

const createStringSeparator = (separator,symbol) => {
    let stringResult = '';
    for(let i = 0;i < stringDimension;){
        if(i === 0 || i === stringDimension-separator.length)
            stringResult += separator
        else if(i === 0+separator.length || i === stringDimension-separator.length-1)
            stringResult += ' '
        else
            stringResult += symbol
        i = stringResult.length;
    }
    return stringResult
}

const createStringQuantitaSconto = (sconto) => {
    let stringResult = '';
    let spaceScontoStr = 3;
    let spaceSconto = 36;
    for(let i = 0;i < stringDimension;){
        if(stringResult.length === spaceScontoStr)
            stringResult += `Sconto:`;
        else if(stringResult.length === spaceSconto){
            stringResult += `${(sconto).toFixed(2)}`
        }    
        else 
            stringResult += ' ';
        i = stringResult.length;
    }
    return stringResult
}

const createStringTotaleScontato = (sconto,totale) => {
    let stringResult = '';
    let spaceTotScontoStr = 3;
    let spaceTotSconto = 36;
    for(let i = 0;i < stringDimension;){
        if(stringResult.length === spaceTotScontoStr)
            stringResult += `Totale Scontato:`;
        else if(stringResult.length === spaceTotSconto){
            stringResult += `${(totale - sconto).toFixed(2)}`
        }    
        else 
            stringResult += ' ';
        i = stringResult.length;
    }
    return stringResult
}

const createStringCodicePromo = (promo) => {
    let spaceCodicePromo = 3;
    let spaceCodicePromoCod = 36;
    let stringResult = ''
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

const createStringSaldoResiduo = (user,totale) => {
    let spaceSaldoResiduo = 3;
    let stringResult = ''
    for(let i = 0;i < stringDimension;){
        if(stringResult.length === spaceSaldoResiduo)
            stringResult += `${user.firstName} ${user.lastName} ha un credito residuo di ${(user.wallet-totale).toFixed(2)}`;  
        else 
            stringResult += ' ';
        i = stringResult.length;
    }
    return stringResult
}

const getReceipt = (user,cart) => {
    let stringReturn = '';
    let totale = getTotale(cart);
    let sconto = getUserDiscount(user.promo);
    let quantitaSconto = 0;

    if(totale>user.wallet){
        stringReturn += createStringSeparator('*','-') + '\n';
        stringReturn += '  Saldo Insufficiente  ' + '\n';
        stringReturn += createStringSeparator('*','-');
        return stringReturn
    }
        

    stringReturn += createStringSeparator('+','-') + '\n';
    stringReturn += printShopName() + '\n';
    stringReturn += '   ' + new Date().toDateString() + '\n';
    stringReturn += createStringSeparator('*','-') + '\n';
    stringReturn += createStringProductList(cart) + '\n';
    stringReturn += createStringSeparator('*','-') + '\n';
    stringReturn += createStringTotale(totale) + '\n';
    stringReturn += createStringSeparator('+','-') + '\n';
    if(sconto === 0){
        stringReturn += '\n';
    }else{
        quantitaSconto = getSconto(totale,sconto);
        stringReturn += createStringQuantitaSconto(quantitaSconto) + '\n';
        stringReturn += createStringTotaleScontato(quantitaSconto,totale) + '\n\n';
        stringReturn += createStringCodicePromo(user.promo) + '\n';
    }
    stringReturn += createStringSeparator('**','-') + '\n';
    stringReturn += sconto===0?createStringSaldoResiduo(user,totale)+'\n':createStringSaldoResiduo(user,getTotaleScontato(totale,quantitaSconto))+'\n';
    stringReturn += createStringSeparator('**','-');
    return stringReturn;
}

export {
    getUser,
    getProductsArray,
    getReceipt
};
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
    for(let index = 0;index < stringDimension;){
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
        index = stringResult.length;
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

const getProduct = (codice) => products.find(prodotto => prodotto.ean === codice)

const getProductsArray = (prodotti) => {
    let array = []
    for(let item of prodotti){
        array.push(getProduct(item));
    }
    return array;
}

const getTotale = (productsUser) =>  productsUser.reduce((previous,prodotto) => previous+prodotto.price,0);

const getSconto = (totale,sconto) => totale*(sconto);

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
    let startTotaleString = 3;
    let startTotaleValue = 36;
    let stringResult = ''
    for(let index = 0;index < stringDimension;){
        if(stringResult.length === startTotaleString)
            stringResult += `Totale:`;
        else if(stringResult.length === startTotaleValue){
            stringResult += `${(totale).toFixed(2)}`
        }    
        else 
            stringResult += ' ';
        index = stringResult.length;
    } 
    return stringResult
}

const createStringSeparator = (separator,symbol) => {
    let stringResult = '';
    for(let index = 0;index < stringDimension;){
        if(index === 0 || index === stringDimension-separator.length)
            stringResult += separator
        else if(index === 0+separator.length || index === stringDimension-separator.length-1)
            stringResult += ' '
        else
            stringResult += symbol
        index = stringResult.length;
    }
    return stringResult
}

const createStringQuantitaSconto = (sconto) => {
    let stringResult = '';
    let spazioScontoString = 3;
    let spazioScontoValue = 36;
    for(let index = 0;index < stringDimension;){
        if(stringResult.length === spazioScontoString)
            stringResult += `Sconto:`;
        else if(stringResult.length === spazioScontoValue){
            stringResult += `${(sconto).toFixed(2)}`
        }    
        else 
            stringResult += ' ';
        index = stringResult.length;
    }
    return stringResult
}

const createStringTotaleScontato = (sconto,totale) => {
    let stringResult = '';
    let spazioTotaleScontatoString = 3;
    let spazioTotaleScontatoValue = 36;
    for(let index = 0;index < stringDimension;){
        if(stringResult.length === spazioTotaleScontatoString)
            stringResult += `Totale Scontato:`;
        else if(stringResult.length === spazioTotaleScontatoValue){
            stringResult += `${(totale - sconto).toFixed(2)}`
        }    
        else 
            stringResult += ' ';
        index = stringResult.length;
    }
    return stringResult
}

const createStringCodicePromo = (promo) => {
    let spazioCodicePromoString = 3;
    let spazioCodicePromoValue = 36;
    let stringResult = ''
    for(let index = 0;index < stringDimension;){
        if(stringResult.length === spazioCodicePromoString)
            stringResult += `CODICE PROMO:`;  
        else if(stringResult.length === spazioCodicePromoValue)
            stringResult += promo
        else 
            stringResult += ' ';
        index = stringResult.length;
    }
    return stringResult 
}

const createStringSaldoResiduo = (user,totale) => {
    let spazioSaldoResiduoString = 3;
    let stringResult = ''
    for(let index = 0;index < stringDimension;){
        if(stringResult.length === spazioSaldoResiduoString)
            stringResult += `${user.firstName} ${user.lastName} ha un credito residuo di ${(user.wallet-totale).toFixed(2)}`;  
        else 
            stringResult += ' ';
        index = stringResult.length;
    }
    return stringResult
}

const getReceipt = (user,cart) => {
    let stringReturn = '';
    let totale = getTotale(cart);
    let sconto = getUserDiscount(user.promo);
    let quantitaSconto = getSconto(totale,sconto);

    if(totale-quantitaSconto>user.wallet){
        stringReturn += createStringSeparator('*','-') + '\n';
        stringReturn += `   ${user.firstName} ${user.lastName} ha un saldo insufficiente  ` + '\n';
        stringReturn += createStringSeparator('*','-');
        return stringReturn;
    }
    if(totale==0){
        stringReturn += createStringSeparator('*','-') + '\n';
        stringReturn += `   ${user.firstName} ${user.lastName} non ha acquistato prodotti  ` + '\n';
        stringReturn += createStringSeparator('*','-');
        return stringReturn;
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
        stringReturn += createStringQuantitaSconto(quantitaSconto) + '\n';
        stringReturn += createStringTotaleScontato(quantitaSconto,totale) + '\n\n';
        stringReturn += createStringCodicePromo(user.promo) + '\n';
    }
    stringReturn += createStringSeparator('**','-') + '\n';
    stringReturn += sconto===0?createStringSaldoResiduo(user,totale)+'\n':createStringSaldoResiduo(user,getTotaleScontato(totale,quantitaSconto))+'\n';
    stringReturn += createStringSeparator('**','-');

    let string = process.cwd()+`/receipts/`+user.uuid.toString()+`_receipt_`+new Date().toDateString()+`.txt`;
    fs.writeFile(string, stringReturn, (err) => { if (err) throw err; });
    return stringReturn;
}

export {
    getUser,
    getProductsArray,
    getReceipt
};
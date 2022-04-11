## Esercitazione di laboratorio - Programmazione - NodeJS [2021-2023]

Dato un elenco di `users`, `carts`, `products` e `promo` creare uno script `cart.mjs` che permetta di generare una ricevuta in formato txt.

Ad esempio il `cart` dello `user` `d0393a66-4e43-493e-b587-49d7ae95af0c` genera la seguente `receipt`:
```
    + -------------------------------------------------- +
    NOMEMACCHINA Cart - 43874
    Mon Apr 04 2022
    * -------------------------------------------------- *
       [120193]    Alpi 		    22.10
       [812302]    Firenze 		    9.99
       [912301]    Roma 		    9.99
       [912303]    Pisa 		    9.99
    * -------------------------------------------------- *
       Totale: 			  52.07
    + -------------------------------------------------- +
    
    ** -------------------------------------------------- **
       Winston Wolf ha un credito residuo di 15.25
    ** -------------------------------------------------- **

```

il `cart` dello `user` `aa21fb3b-efb5-46f1-90ef-0cb1bb08fb3b` genera la seguente `receipt`:
```
    + -------------------------------------------------- +
    NOMEMACCHINA Cart - 43874
    Mon Apr 04 2022
    * -------------------------------------------------- *
       [812302]    Firenze 		    9.99
       [912301]    Roma 		    9.99
       [912304]    Torino 		    9.99
       [912303]    Pisa 		    9.99
    * -------------------------------------------------- *
       Totale: 			           39.96
    + -------------------------------------------------- +
       Sconto: 			            9.99
       Totale Scontato: 		   29.97
       
       CODICE PROMO:               SPRING
    + -------------------------------------------------- +
    
    ** -------------------------------------------------- **
       Marsellus Wallace ha un credito residuo di 6.03
    ** -------------------------------------------------- **
```

Le specifiche principali devono essere le seguenti:
 - l'intestazione della ricevuta deve essere `NOMEUTENTEPC Cart - PID` e a capo la data corrente 
 - tutti i prodotti acquistati devono essere esplicitati nella ricevuta nel formato `[EAN]   Nome prodotto  prezzo prodotto`
 - deve essere riportato il totale e se presente l'importo scontato e il totale scontato 
 - se lo user ha uno sconto o promo deve essere stampato il codice sconto utilizzato
 - a chiusura della ricevuta deve esser indicato il credito residuo
 - le ricevute devono esser in formato txt, vanno generate dentro la cartella `receipts` e devono avere il nome `$UserUUID_receipt_$DATAORAGENERAZIONE.txt`  
 

## Formato dati

### Elenco `user`
```javascript
const users = [
    {
        uuid: 'd0393a66-4e43-493e-b587-49d7ae95af0c',
        firstName: 'Winston',
        lastName: 'Wolf',
        wallet: 62.11,
        isTeacher: true,
    }
];
```

### Elenco `products`
```javascript
const products = [
    {
        name: 'Emilia Romagna',
        ean: 162345,
        price: 12.10,
        type: 'book',
    }
];
```

### Elenco `promo`
```javascript
const promoCode = [
    {
        name: 'PROMO-10',
        percentage: 0.10
    }
];
```

### Elenco `carts`
```javascript
const carts = [
    {
        user: 'd0393a66-4e43-493e-b587-49d7ae95af0c', 
        products: [120193, 812302, 912301, 912303,]
    }
];
```

## Note operative:
 - tutti i metodi devono, ove possibile, essere arrow function come l'esempio `discountedPrice(price, rate)`
 - tutti i metodi/funzioni devono, ove possibile, essere scritte in `core-cart.mjs`
 - i delimitatori di riga non devono essere statici ma generati
 - attenzione ai nomi del prodotti, alle somme, ai wallet e alle promo
 - mi aspetto di non vedere cicli infiniti ma metodi già noti presenti nella doc ufficiale [MDM Web Docs](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)
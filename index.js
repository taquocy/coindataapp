const http = require('http')
const https = require('https');

const express = require('express')
const app = express()
app.listen(3000, () => {
    console.log("App listening on port 3000")
})

app.get("/listcoins", (request, response) => {

    https.get('https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest?limit=5000&CMC_PRO_API_KEY=c22fd1b6-eefb-4043-8640-aa16e3e92424', res => {

        let data = [];
        res.on('data', chunk => {
            data.push(chunk);
          });
        
        res.on('end', () => {
        console.log('Response ended: ');
        const coinDatas = JSON.parse(Buffer.concat(data).toString());
        console.log(coinDatas)
    
        // for(coinData of coinDatas.data) {
        //     console.log(`Got user with id: ${coinData.name}, name: ${coinData.symbol}`);
        // }

        response.json({
            message : 'OK',  
            result: coinDatas.data
          })

        });

      

    }).on('error', err => {
        console.log('Error: ', err.message);
    });


    
})



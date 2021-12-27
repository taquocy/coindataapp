const express = require('express');
const http = require('http')
const https = require('https');
var cors = require('cors')
const app = express();
const FCM = require('fcm-node')
var serverKey = require('./flutter-android-firebase-demo-firebase-adminsdk-vjc8k-5fe0b81055.json') //put the generated private key path here    
var fcm = new FCM(serverKey)

const bodyParser = require('body-parser')
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))


app.use(cors())

app.get('/', (request, response) => {    
    response.send('Hello, Server!');
});


app.post('/sendnotification', (req, res) => {
    console.log('Send notification:')    
    
    var message = { //this may vary according to the message type (single recipient, multicast, topic, et cetera)
        to: req.body.token, 
        // collapse_key: 'green',
        
        notification: {
            title: req.body.title, 
            body: req.body.content 
        },
        
        data: {  //you can send only notification or only data(or include both)
            my_key: 'my value',
            my_another_key: 'my another value'
        }
    }
    console.log(message)
    try{
        fcm.send(message, function(err, response){
            if (err) {
                console.log("Something has gone wrong!")
            } else {
                console.log("Successfully sent with response: ", response)
                console.log(response.results[0])
    
            }
        })
    }catch(error){
        console.log('ERROR:')
        console.log(error)
    }
    

    res.send('Message send successfully !!!');
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
                message: 'OK',
                result: coinDatas.data
            })

        });
    }).on('error', err => {
        console.log('Error: ', err.message);
    });
})

// Start the server
const server = app.listen(process.env.PORT || 5000, (error) => {
    if (error) return console.log(`Error: ${error}`);

    console.log(`Server listening on port ${server.address().port}`);
});



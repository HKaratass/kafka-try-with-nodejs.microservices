//pay-service.js
const express = require('express');
const app = express();
const { Kafka } = require('kafkajs');
const PORT = 3001;

app.use(express.json({ limit: "30mb" }));
app.use(express.urlencoded({ limit: "30mb", extended: true }));

const kafka = new Kafka({
    clientId: 'pay-service',
    // brokers: ['localhost:9092']
    // brokers: ['kafka:9092']
    brokers: ['broker-1:19092', 'broker-2:19092', 'broker-3:19092']
});
const producer = kafka.producer();


/**
 * order: [
 *  {
 *      product_id: 1,
 *      amount: 3
 *  },
 * ]
 */
let trace = 0;
app.post('/payment/sell', async (req, res) => {
    const { adress, order, ["fake-credential"]: credential } = req.body;
    const products = [];
    trace++;

    //kafka produce inventory push
    for (let k of order) {
        products.push(k.product_id);
        await producer.send({
            topic: 'inventory-topic',
            messages: [{ value: JSON.stringify({ product: k, function: "sell", trace }) }],
        });
    }

    //kafka produce shipping push
    await producer.send({
        topic: 'shipping-topic',
        messages: [{ value: JSON.stringify({ adress, products, trace }) }],
    });


    //id from jwt
    // const id = 7;
    // console.log(credential.jwt.id);
    const id = credential.jwt.id;
    await producer.send({
        topic: 'sms-topic',
        messages: [{ value: JSON.stringify({ id, trace }) }],
    });
    await producer.send({
        topic: 'email-topic',
        messages: [{ value: JSON.stringify({ id, trace }) }],
    });

    console.log(`SATIŞ İŞLEMİ TAMAM - ${trace}`);
    res.send(`SATIŞ İŞLEMİ TAMAM - ${trace}`);
});

app.post('/payment/buy', async (req, res) => {
    const { order } = req.body;
    trace++;

    //kafka produce inventory push
    for (let k of order) {
        await producer.send({
            topic: 'inventory-topic',
            messages: [{ value: JSON.stringify({ product: k, function: "buy", trace }) }],
        });
    }

    console.log(`ALIŞ İŞLEMİ TAMAM - ${trace}`);
    res.send(`ALIŞ İŞLEMİ TAMAM - ${trace}`);
});





app.listen(PORT, async () => {
    await producer.connect()
        .then(console.log("KAFKA CONNECTION SUCCESSFULL"))
        .catch(err => console.log("ERROR: ", err));
    console.log(`SERVER LISTEN PORT:${PORT}`);
});


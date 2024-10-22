const express = require('express');
const app = express();
const { Kafka } = require('kafkajs');
const PORT = 3002;

app.use(express.json({ limit: "30mb" }));
app.use(express.urlencoded({ limit: "30mb", extended: true }));
function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

const kafka = new Kafka({
    clientId: 'inventory-service',
    // brokers: ['localhost:9092']
    // brokers: ['kafka:9092']
    brokers: ['broker-1:19092', 'broker-2:19092', 'broker-3:19092']
});
const consumer = kafka.consumer({ groupId: 'inventory-group' });

const startConsumer = async () => {
    await consumer.connect();
    await consumer.subscribe({ topic: 'inventory-topic', fromBeginning: true });

    await consumer.run({
        eachMessage: async ({ topic, partition, message }) => {
            const event = JSON.parse(message.value.toString());
            // console.log("MESAJ ALINDI");
            // await delay(2000);
            console.log(`--- TRACE - ${event.trace} ---`);
            if (event.function === "sell") {
                sell(event.product.product_id, event.product.amount);
            } else if (event.function === "buy") {
                buy(event.product.product_id, event.product.amount);
            }
        },
    });
};


const sell = async(id, amount) => {
    await delay(2000);
    console.log(`${id} id'li ürün ${amount} adet satıldı.`);
    // return `${id} id'li ürün ${amount} adet satıldı.`;
}
const buy = (id, amount) => {
    console.log(`${id} id'li ürün ${amount} adet alındı.`);
    // return `${id} id'li ürün ${amount} adet alındı.`;
}
// app.put('/product/sell/:id', (req, res) => {
//     const id = req.params.id;
//     const { amount } = req.body;

//     const ret = sell(id, amount);
//     res.send(ret);
// });

// app.put('/product/buy/:id', (req, res) => {
//     const id = req.params.id;
//     const { amount } = req.body;

//     const ret = buy(id, amount);
//     res.send(ret);
// });


app.get('/product/:id', (req, res) => {
    const id = req.params.id;
    console.log(`${id} li ürün bilgileri: lorem ipsum.`);
    res.send(`${id} li ürün bilgileri: lorem ipsum.`);
});

app.post('/product', (req, res) => {
    const { name } = req.body;
    console.log(`${name} ürünü oluşturuldu.`);
    res.send(`${name} ürünü oluşturuldu.`);
});

app.put('/product/:id', (req, res) => {
    const id = req.params.id;
    console.log(`${id} id'li ürün güncellendi.`);
    res.send(`${id} id'li ürün güncellendi.`);
});

app.delete('/product/:id', (req, res) => {
    const id = req.params.id;
    console.log(`${id} id'li ürün kaldırıldı.`);
    res.send(`${id} id'li ürün kaldırıldı.`);
});

app.listen(PORT, async () => {
    await startConsumer()
        .then(console.log("KAFKA CONNECTION SUCCESSFULL"))
        .catch(err => console.log("ERROR: ", err));
    console.log(`SERVER LISTEN PORT:${PORT}`);
});


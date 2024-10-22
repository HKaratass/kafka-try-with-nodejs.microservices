//shipping-service.js
const express = require('express');
const app = express();
const { Kafka } = require('kafkajs');
const PORT = 3003;

app.use(express.json({ limit: "30mb" }));
app.use(express.urlencoded({ limit: "30mb", extended: true }));


const kafka = new Kafka({
    clientId: 'shipping-service',
    // brokers: ['localhost:9092']
    // brokers: ['kafka:9092']
    brokers: ['broker-1:19092', 'broker-2:19092', 'broker-3:19092']
});
const consumer = kafka.consumer({ groupId: 'shipping-group' });

const startConsumer = async () => {
    await consumer.connect();
    await consumer.subscribe({ topic: 'shipping-topic', fromBeginning: true });

    await consumer.run({
        eachMessage: async ({ topic, partition, message }) => {
            const event = JSON.parse(message.value.toString());
            console.log(`--- TRACE - ${event.trace} ---`);
            newShipping(event.adress, event.products);
        },
    });
};

const newShipping = (address, products) => {
    console.log(`${products} id'li ürünler ${address}'e kargo oluşturuldu.`);
    // return `${products} id'li ürünler ${address}'e kargo oluşturuldu.`;
}
// app.post('/shipping', (req, res) => {
//     const { address, products } = req.body;
//     const ret = newShipping(address,products);
//     res.send(ret);
// });





app.get('/shipping/:id', (req, res) => {
    const id = req.params.id;
    console.log(`${id} li kargo bilgileri: lorem ipsum.`);
    res.send(`${id} li kargo bilgileri: lorem ipsum.`);
});

app.put('/shipping/:id', (req, res) => {
    const id = req.params.id;
    const { check } = req.body;
    if (check) {
        console.log(`${id} li kargo teslim edildi.`);
        res.send(`${id} li kargo teslim edildi.`);
    } else {
        console.log(`${id} li kargo güncellendi.`);
        res.send(`${id} li kargo güncellendi.`);
    }
});

app.delete('/shipping/:id', (req, res) => {
    const id = req.params.id;
    console.log(`${id} li kargo iptal edildi.`);
    res.send(`${id} li kargo iptal edildi.`);
});

app.listen(PORT, async () => {
    await startConsumer()
        .then(console.log("KAFKA CONNECTION SUCCESSFULL"))
        .catch(err => console.log("ERROR: ", err));
    console.log(`SERVER LISTEN PORT:${PORT}`);
});
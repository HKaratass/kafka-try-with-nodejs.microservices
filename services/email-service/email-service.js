//inventory-service.js
const { Kafka } = require('kafkajs');
function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

const kafka = new Kafka({
    clientId: 'email-service',
    // brokers: ['localhost:9092']
    // brokers: ['kafka:9092']
    brokers: ['broker-1:19092', 'broker-2:19092', 'broker-3:19092']
});
const consumer = kafka.consumer({ groupId: 'email-group' });

const startConsumer = async () => {
    await consumer.connect();
    await consumer.subscribe({ topic: 'email-topic', fromBeginning: true });

    await consumer.run({
        eachMessage: async ({ topic, partition, message }) => {
            const event = JSON.parse(message.value.toString());
            console.log(`--- TRACE - ${event.trace} ---`);
            send_email(event.id);
        },
    });
};


const send_email = async (id) => {
    await delay(2000);
    //get phone email from db where id
    const email = "test@test.com"
    //mail service
    console.log(`${id}'li kullanıcının ${email} adresine mail atıldı.`);
}

startConsumer()
    .then(console.log("KAFKA CONNECTION SUCCESSFULL"))
    .catch(err => console.log("ERROR: ", err));
//inventory-service.js
const { Kafka } = require('kafkajs');
function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

const kafka = new Kafka({
    clientId: 'sms-service',
    // brokers: ['localhost:9092']
    // brokers: ['kafka:9092']
    brokers: ['broker-1:19092', 'broker-2:19092', 'broker-3:19092']
});
const consumer = kafka.consumer({ groupId: 'sms-group' });

const startConsumer = async () => {
    await consumer.connect();
    await consumer.subscribe({ topic: 'sms-topic', fromBeginning: true });

    await consumer.run({
        eachMessage: async ({ topic, partition, message }) => {
            const event = JSON.parse(message.value.toString());
            console.log(`--- TRACE - ${event.trace} ---`);
            send_SMS(event.id);
        },
    });
};


const send_SMS = async (id) => {
    await delay(2000);
    //get phone number from db where id
    const phoneNumber = "05001112233"
    //sms API service
    console.log(`${id}'li kullanıcının ${phoneNumber} numarasına  SMS atıldı.`);
}

startConsumer()
    .then(console.log("KAFKA CONNECTION SUCCESSFULL"))
    .catch(err => console.log("ERROR: ", err));
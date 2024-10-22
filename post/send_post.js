const args = process.argv.slice(2);
const axios = require("axios");

const example_data = require('./exp.json');
// console.log(example_data);

const { adress, ...example_data_without_adress } = example_data;
// console.log(example_data_without_adress);

async function sell() {
    const data = await axios.post("http://localhost:3001/payment/sell", example_data)
    console.log(data.data);
}

async function buy() {
    const data = await axios.post("http://localhost:3001/payment/buy", example_data_without_adress)
    console.log(data.data);
}

async function main() {
    if (args.includes('--buy')) {
        buy();
    } else if (args.includes('--sell')) {
        sell();
    } else {
        console.log('ADD "--buy" OR "--sell"');
    }
}
main();
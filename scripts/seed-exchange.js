// esqueleto de un script para truffle exec

const Token = artifacts.require("Token");
const Exchange = artifacts.require("Exchange");

// Utils
const { ETHER_ADDRESS, ether, tokens, wait } = require('../src/helpers');

module.exports = async function(callback) {

    try {
        // Fetch accounts from wallet - (unlocked accounts)
        const accounts = await web3.eth.getAccounts();

        // Fetch the deployed token
        const token = await Token.deployed();
        console.log("token fetched", token.address)

        // Fetch the deployed Exchange
        const exchange = await Exchange.deployed();
        console.log("Exchange Fetched", exchange.address)

        // Give tokens to account 1
        const sender = accounts[0];
        const receiver = accounts[1];
        let amount = web3.utils.toWei("10000", "Ether"); // 10.000 tokens

        await token.transfer(receiver, amount, { from: sender });
        console.log(`Transfered ${amount} tokens from ${sender} to ${receiver}`);

        // Set up exchange users
        const user1 = accounts[0];
        const user2 = accounts[1];

        // user1 deposits Ether
        amount = 1
        await exchange.depositEther({ from: user1, value: ether(amount)});
        console.log(`Deposited ${amount} Ether from ${user1}`);

        // user2 approves Tokens
        amount = 10000
        await token.approve(exchange.address, tokens(amount), { from: user2 });
        console.log(`Approved ${amount} tokens from ${user2}`)

        // user2 deposits Tokens
        await exchange.depositToken(token.address, tokens(amount), { from: user2 });
        console.log(`Deposited ${amount} tokens from ${user2}`)

        // -----------------------
        // Seed a cancel Order

        // user1 makes order to get tokens
        let result, orderId;
        result = await exchange.makeOrder(token.address, tokens(100), ETHER_ADDRESS, ether(0.1), { from: user1 });
        console.log(`Made order from ${user1}`)

        // user1 cancels the order
        orderId = result.logs[0].args.id
        result = await exchange.cancelOrder(orderId, { from: user1 });
        console.log(`Cancelled order from ${user1}`)

        // User1 makes order
        result = await exchange.makeOrder(token.address, tokens(100), ETHER_ADDRESS, ether(0.1), { from: user1 });
        console.log(`Made order from ${user1}`)

        // User2 fills order
        orderId = result.logs[0].args.id
        await exchange.fillOrder(orderId, { from: user2 });
        console.log(`Filled order from ${user1}`)

        // Wait 1 second..
        await wait(1);

        // User1 makes another order
        result = await exchange.makeOrder(token.address, tokens(50), ETHER_ADDRESS, ether(0.01), { from: user1 });
        console.log(`Made order from ${user1}`)

        // User2 fills another order
        orderId = result.logs[0].args.id
        await exchange.fillOrder(orderId, { from: user2 });
        console.log(`Filled order from ${user1}`)

        // Wait 1 second..
        await wait(1);

        // User1 makes final order
        result = await exchange.makeOrder(token.address, tokens(200), ETHER_ADDRESS, ether(0.15), { from: user1 });
        console.log(`Made order from ${user1}`)

        // User2 fills final order
        orderId = result.logs[0].args.id
        await exchange.fillOrder(orderId, { from: user2 });
        console.log(`Filled order from ${user1}`)

        // -----------------------
        // Seed Open Orders

        // User1 makes 10 orders
        for (let i = 0; i <= 10; i++) {
            await exchange.makeOrder(token.address, tokens(10*i), ETHER_ADDRESS, ether(0.01), { from: user1 });
            console.log(`Made order from ${user1}`)
            // wait 1 second
            await wait(1);
        }
        
        // User2 makes 10 orders
        for (let i = 0; i <= 10; i++) {
            await exchange.makeOrder(ETHER_ADDRESS, ether(0.01), token.address, tokens(10*i), { from: user1 });
            console.log(`Made order from ${user1}`)
            // wait 1 second
            await wait(1);
        }

        
    } catch(error) {
        console.log("error", error.message)
    }
    callback();
}
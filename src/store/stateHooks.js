import { loadWeb3, web3AccountLoaded, tokenLoaded, dexLoaded, cldOrdersLoaded, filledOrdersLoaded, allOrdersLoaded } from './reducers';
import Web3 from 'web3';
import Token from '../abis/Token.json';
import Exchange from '../abis/Exchange.json'

// --------- Web3
export const loadProvider = (dispatch) => {
    const web3 = new Web3(window.ethereum);
    dispatch(loadWeb3(web3))
    return web3;
}
// --------- Account
export const loadAccount = async(web3, dispatch) => {
    const accounts = await web3.eth.getAccounts();
    const account = accounts[0];
    dispatch(web3AccountLoaded(account))
    return account
}
// --------- Token
export const loadToken = async(web3, dispatch) => {
    const abi = Token.abi;
    try {
        const networkId = await web3.eth.net.getId()
        const tokenAddress = Token.networks[networkId].address;
        const tokenContract = new web3.eth.Contract(abi, tokenAddress);

        dispatch(tokenLoaded({ address: tokenAddress, contract: tokenContract }))
        return tokenContract;
    } catch (error) {
        console.log("Contract not deployed to the current network, please select another network in Metamask.")
        return null;
    }
}
// --------- Exchange
export const loadExchange = async(web3, dispatch) => {
    const abi = Exchange.abi;
    try {
        const networkId = await web3.eth.net.getId();
        const exchangeAddress = Exchange.networks[networkId].address;
        const exchangeContract = new web3.eth.Contract(abi, exchangeAddress);

        dispatch(dexLoaded({ address: exchangeAddress, contract: exchangeContract }));
        return exchangeContract;
    } catch (error) {
        console.log("Contract not deployed to the current network, please select another network in Metamask.")
        return null;
    }
}
// --------- Trades
export const loadAllOrders = async(exchange, dispatch) => {
    // fetch Cancel events
    const cancelStream = await exchange.getPastEvents('Cancel', { fromBlock: 0, toBlock: 'latest' });
    // Format order
    const cancelledOrders = cancelStream.map(event => event.returnValues)
    dispatch(cldOrdersLoaded(cancelledOrders))

    // fetch Trade events
    const tradeStream = await exchange.getPastEvents('Trade', { fromBlock: 0, toBlock: 'latest' });
    const filledOrders = tradeStream.map(event => event.returnValues)
    dispatch(filledOrdersLoaded(filledOrders))

    // fetch every Order event
    const orderStream = await exchange.getPastEvents('Order', { fromBlock: 0, toBlock: 'latest' });
    const allOrders = orderStream.map(event => event.returnValues)
    dispatch(allOrdersLoaded(allOrders))

    return cancelledOrders;
}

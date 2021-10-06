import { loadWeb3, web3AccountLoaded, tokenLoaded, dexLoaded, cldOrdersLoaded, filledOrdersLoaded, allOrdersLoaded, orderCancelling, orderCancelled, orderFilling, orderFilled, etherBalanceLoaded, tokenBalanceLoaded, exchangeEtherBalanceLoaded, exchangeTokenBalanceLoaded, balancesLoaded, balancesLoading } from './reducers';
import Web3 from 'web3';
import Token from '../abis/Token.json';
import Exchange from '../abis/Exchange.json'
import { ETHER_ADDRESS } from '../helpers';
import { accountsChanged } from '../utils'

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
    //   ethereum.on('chainChanged', (chainId) => {
    //     // Handle the new chain.
    //     // Correctly handling chain changes can be complicated.
    //     // We recommend reloading the page unless you have good reason not to.
    //     window.location.reload();
    //   });
}
// --------- Account balances
export const loadBalances = async(dispatch, web3, exchange, token, account) => {
    // Ether balance in Wallet
    const etherBalance = await web3.eth.getBalance(account);
    dispatch(etherBalanceLoaded(etherBalance))
    // Token balance in Wallet
    const tokenBalance = await token.methods.balanceOf(account).call()
    dispatch(tokenBalanceLoaded(tokenBalance))

    // Ether balance in Exchange
    const exchangeEtherBalance = await exchange.methods.balanceOf(ETHER_ADDRESS, account).call()
    dispatch(exchangeEtherBalanceLoaded(exchangeEtherBalance))
    // Token balance in Exchange
    const exchangeTokenBalance = await exchange.methods.balanceOf(token.options.address, account).call()
    dispatch(exchangeTokenBalanceLoaded(exchangeTokenBalance))

    // Trigger all balances loaded
    dispatch(balancesLoaded())
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

// --------- Smart C events from main functions
export const subscribeToEvents = async(exchange, dispatch) => {
    exchange.events.Cancel({}, (error, event) => {
        dispatch(orderCancelled(event.returnValues))
    })
    exchange.events.Trade({}, (error, event) => {
        dispatch(orderFilled(event.returnValues))
    })
}

// --------- Cancel Orders
export const cancelOrder = async(exchange, dispatch, order, account) => {
    exchange.methods.cancelOrder(order.id).send({ from: account })
        .on('transactionHash', (hash) => {
            dispatch(orderCancelling())
        })
        .on('error', (error) => {
            console.log(error)
            window.alert('There was an error cancelling the order')
        })
}

// --------- Fill Orders
export const fillOrder = async(exchange, dispatch, order, account) => {
    exchange.methods.fillOrder(order.id).send({ from: account })
        .on('transactionHash', (hash) => {
            dispatch(orderFilling())
        })
        .on('error', (error) => {
            console.log(error)
            window.alert('There was an error filling the order')
        })
}
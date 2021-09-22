import { get } from 'lodash'; 
import { createSelector } from 'reselect';
import moment from 'moment';
import { ETHER_ADDRESS, ether, tokens, wait, formatEth, formatToken, RED, GREEN } from '../helpers';

const account = state => get(state, 'web3State.account'); // using lodash instead of state.web3.account
export const accountSelector = createSelector(account, a => a);

const tokenLoaded = state => get(state, 'tokenData.loaded', false);  
export const tokenSelector = createSelector(tokenLoaded, tkn => tkn);

const dexLoaded = state => get(state, 'dexData.loaded', false);   
export const dexSelector = createSelector(dexLoaded, dex => dex);

export const contractsLoaderSelector = createSelector(
    tokenLoaded,
    dexLoaded,
    (tkn, dex) => (tkn && dex)
)

const exchange = state => get(state, 'dexData.contract');
export const exchangeSelector = createSelector(exchange, ex => ex)

const filledOrdersLoaded = state => get(state, 'dexData.filledOrders.loaded', false);   
export const filledOrdersLoadedSelector = createSelector(filledOrdersLoaded, loaded => loaded);

const filledOrders = state => get(state, 'dexData.filledOrders.data', [])
export const filledOrdersSelector = createSelector(
    filledOrders,
    (orders) => {
        orders = [ ...orders ]; // por si es una sola orden
        // sort orders by date ascending for price comparison
        orders = orders.sort((a,b) => a.timestamp - b.timestamp)
        // Decorate the orders
        orders = decorateFilledOrders(orders)
        // sort orders by date descending
        orders = orders.sort((a,b) => b.timestamp - a.timestamp)
        return orders
    } 
);

const allOrders = state => get(state, 'dexData.allOrders.data')
export const allOrdersSelector = createSelector(allOrders, all => all);


const decorateFilledOrders = (orders) => {
    // Track previous order to compare history
    let previousOrder = orders[0];
    return (
        orders.map(order => {
            order = decorateOrder(order);
            order = decorateFilledOrder(order, previousOrder);
            previousOrder = order // Update previous order once it's decorated
            return order
        })
    )
}
const decorateOrder = (order) => {
    let etherAmount, tokenAmount;
    if (order.tokenGive === ETHER_ADDRESS) {
        etherAmount = order.amountGive
        tokenAmount = order.amountGet
    } else {
        etherAmount = order.amountGet
        tokenAmount = order.amountGive
    }

    // Calculate token price to 5 decimal places
    const precision = 100000
    let tokenPrice = (etherAmount / tokenAmount)
    tokenPrice = Math.round(tokenPrice * precision) / precision;

    return ({
        ...order,
        etherAmount: formatEth(etherAmount),
        tokenAmount: formatToken(tokenAmount),
        tokenPrice,
        formattedTimestamp: moment.unix(order.timestamp).format('h:mm:ss a M/D')
    })
}
const decorateFilledOrder = (order, previousOrder) => {

    return({
        ...order,
        tokenPriceClass: tokenPriceClass(order.tokenPrice, order.id, previousOrder)
    })
}
const tokenPriceClass = (tokenPrice, orderId, previousOrder) => {
    // Show greenPrice if only one order exists
    if (previousOrder.id === orderId) {
        return GREEN
    }
    // Show green price if order price is higher than previous order. Red if it's lower
    if (previousOrder.tokenPrice <= tokenPrice) {
        return GREEN // bootstrap 'success' class
    } else {
        return RED // 'danger'
    }
}
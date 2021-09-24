import { get, reject, groupBy } from 'lodash'; 
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

// ---------- ALL ORDERS
const allOrdersLoaded = state => get(state, 'dexData.allOrders.loaded', false)
export const allOrdersLoadedSelector = createSelector(allOrdersLoaded, allO => allO)

const allOrders = state => get(state, 'dexData.allOrders.data')
export const allOrdersSelector = createSelector(allOrders, all => all);

// ---------- CANCELLED ORDERS
const cancelledOrdersLoaded = state => get(state, 'dexData.cancelledOrders.loaded', false);   
export const cancelledOrdersLoadedSelector = createSelector(cancelledOrdersLoaded, loaded => loaded);

const cancelledOrders = state => get(state, 'dexData.cancelledOrders.data', [])
export const cancelledOrdersSelector = createSelector(cancelledOrders, cldOrders => cldOrders)

// ---------- FILLED ORDERS
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

const openOrders = state => {
    const all = allOrders(state);
    const cancelled = cancelledOrders(state);
    const filled = filledOrders(state)

    const openOrders = reject(all, (order) => { // Reject orders if they're filled or cancelled (with lodash "reject")
        const orderFilled = filled.some(o => o.id === order.id)
        const orderCancelled = cancelled.some(oc => oc.id === order.id)
        return (orderFilled || orderCancelled) 
    })
    return openOrders;
}
// ---------- ORDER BOOK 
export const orderBookLoaded = state => cancelledOrdersLoaded(state) && filledOrdersLoaded(state) && allOrdersLoaded(state)
export const orderBookSelector = createSelector(
    openOrders, // Substract cancelled & filled from all Orders
    (orders) => {
        // Decorate orders
        orders = decorateOrderBookOrders(orders);
        // lodash 'groupBy' orderType.
        orders = groupBy(orders, 'orderType');
        // Fetch buy orders
        const buyOrders = get(orders, 'buy', [])
        // Sort buy orders by token price
        orders = {
            ...orders,
            buyOrders: buyOrders.sort((a,b) => b.tokenPrice - a.tokenPrice)
        }
        // Fetch sell orders
        const sellOrders = get(orders, 'sell', [])
        // Sort sell orders by token price
        orders = {
            ...orders,
            sellOrders: sellOrders.sort((a,b) => b.tokenPrice - a.tokenPrice)
        }
        return orders;
    }
)

const decorateOrderBookOrders = (orders) => {
    return (
        orders.map(order => {
            order = decorateOrder(order)
            // & Decorate order Book
            order = decorateOrderBookOrder(order)
            return order;
        })
    )
}
const decorateOrderBookOrder = (order) => {
    const orderType = order.tokenGive === ETHER_ADDRESS ? 'buy' : 'sell';
    return ({
        ...order,
        orderType,
        orderTypeClass: (orderType === 'buy' ? GREEN : RED),
        orderFillClass: orderType === 'buy' ? 'sell' : 'buy'
    })
}
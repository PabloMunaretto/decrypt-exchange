import React, { useEffect, useCallback } from 'react'
import { useDispatch, connect } from 'react-redux';
import { exchangeSelector } from '../store/storeSelectors';
import { loadAllOrders, subscribeToEvents } from '../store/stateHooks';
import Balance from './balances/Balance'
import Trades from './Trades';
import OrderBook from './OrderBook';
import MyTransactions from './MyTransactions'
import PriceChart from './PriceChart'
import NewOrder from './newOrder/NewOrder'

function Content({ exchange }) {
  const dispatch = useDispatch()

  const loadBlockchainData = useCallback(async() => {
      await loadAllOrders(exchange, dispatch);
      await subscribeToEvents(exchange, dispatch)
  }, [exchange, dispatch])
    
  useEffect(() => {
    loadBlockchainData()
  }, [loadBlockchainData])
  
    return (
      <div className="content">
        <div className="vertical-split">
          <Balance />
          <NewOrder />
        </div>
        <OrderBook />
        <div className="vertical-split">
          <PriceChart />
          <MyTransactions />
        </div>
        <Trades />
      </div>
    )
}
const hydrateRedux = (state) => { // hydrate App with redux state
  return ({
    exchange: exchangeSelector(state)
  })
};

export default connect(hydrateRedux)(Content);

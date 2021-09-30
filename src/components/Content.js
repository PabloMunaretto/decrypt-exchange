import React, { useEffect, useCallback } from 'react'
import { useDispatch, connect } from 'react-redux';
import { exchangeSelector } from '../store/storeSelectors';
import { loadAllOrders, subscribeToEvents } from '../store/stateHooks';
import Trades from './Trades';
import OrderBook from './OrderBook';
import MyTransactions from './MyTransactions'
import PriceChart from './PriceChart'

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
          <div className="card bg-dark text-white">
            <div className="card-header">
              Card Title
            </div>
            <div className="card-body">
              <p className="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
              <a href="/#" className="card-link">Card link</a>
            </div>
          </div>
          <div className="card bg-dark text-white">
            <div className="card-header">
              Card Title
            </div>
            <div className="card-body">
              <p className="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
              <a href="/#" className="card-link">Card link</a>
            </div>
          </div>
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

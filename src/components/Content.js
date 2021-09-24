import React, { useEffect } from 'react'
import { useDispatch, connect } from 'react-redux';
import { exchangeSelector } from '../store/storeSelectors';
import { loadAllOrders } from '../store/stateHooks';
import Trades from './Trades';
import OrderBook from './OrderBook';

function Content({ exchange }) {
  const dispatch = useDispatch()

  useEffect(() => {
    loadBlockchainData()
  }, [])


  const loadBlockchainData = async() => {
    const allOrders = await loadAllOrders(exchange, dispatch);

  }
  
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

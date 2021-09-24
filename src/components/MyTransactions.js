import React from "react";
import { connect } from "react-redux";
import { Tabs, Tab } from "react-bootstrap";
import Spinner from './Spinner'

import { 
    myFilledOrdersLoadedSelector, 
    myFilledOrdersSelector, 
    myOpenOrdersLoadedSelector, 
    myOpenOrdersSelector
} from '../store/storeSelectors';

const showFilledOrders = (filledOrders) => {
    return (
        <tbody>
            { filledOrders.map(order => {
                const { formattedTimestamp, orderTypeClass, orderSign, tokenAmount, tokenPrice } = order
                return (
                    <tr key={order.id}>
                        <td className="text-muted">{formattedTimestamp}</td>
                        <td className={`text-${orderTypeClass}`}>{orderSign}{tokenAmount}</td>
                        <td className={`text-${orderTypeClass}`}>{tokenPrice}</td>
                    </tr>
                )
            })
            }
        </tbody>
    )
}
const showOpenOrders = (openOrders) => {
    return (
        <tbody>
            { openOrders.map(order => {
                const { orderTypeClass, tokenAmount, tokenPrice } = order
                return (
                    <tr key={order.id}>
                        <td className={`text-${orderTypeClass}`}>{tokenAmount}</td>
                        <td className={`text-${orderTypeClass}`}>{tokenPrice}</td>
                        <td className="text-muted">x</td>
                    </tr>
                )
            })
            }
        </tbody>
    )
}

function MyTransactions({ myFilledOrders, showMyFilledOrders, myOpenOrders, showMyOpenOrders }) {

  return (
    <div className="card bg-dark text-white">
      <div className="card-header">My Transactions</div>
      <div className="card-body">
        <Tabs defaultActiveKey="trades" className="bg-dark text-white">
          <Tab eventKey="trades" title="Trades" className="bg-dark">
            <table className="table table-dark table-sm small">
              <thead>
                <tr>
                  <th>Time</th>
                  <th>PBS</th>
                  <th>PBS/ETH</th>
                </tr>
              </thead>
              { myFilledOrders ? showFilledOrders(showMyFilledOrders) : <Spinner type='table' /> }
            </table>
          </Tab>
          <Tab eventKey="orders" title="Orders">
            <table className="table table-dark table-sm small">
              <thead>
                <tr>
                  <th>Amount</th>
                  <th>PBS/ETH</th>
                  <th>Cancel</th>
                </tr>
              </thead>
              { myOpenOrders ? showOpenOrders(showMyOpenOrders) : <Spinner type='table' /> }
            </table>
          </Tab>
        </Tabs>
      </div>
    </div>
  );
}
const hydrateRedux = (state) => {
    return ({
        myFilledOrders: myFilledOrdersLoadedSelector(state), 
        showMyFilledOrders: myFilledOrdersSelector(state), 
        myOpenOrders: myOpenOrdersLoadedSelector(state), 
        showMyOpenOrders: myOpenOrdersSelector(state)
    })
}

export default connect(hydrateRedux)(MyTransactions);

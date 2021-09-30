import React from "react";
import { connect, useDispatch } from "react-redux";
import { Tabs, Tab } from "react-bootstrap";
import Spinner from './Spinner'

import { 
    myFilledOrdersLoadedSelector, 
    myFilledOrdersSelector, 
    myOpenOrdersLoadedSelector, 
    myOpenOrdersSelector,
    exchangeSelector,
    accountSelector,
    orderCancellingSelector
} from '../store/storeSelectors';
import { cancelOrder } from '../store/stateHooks'

const showFilledOrders = ({ myFilledOrders }) => {
  
    return (
        <tbody>
            { myFilledOrders.map(order => {
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
const showOpenOrders = ({ exchange, myOpenOrders, account }, dispatch) => {

  return (
        <tbody>
            { myOpenOrders.map(order => {
                const { orderTypeClass, tokenAmount, tokenPrice } = order
                return (
                    <tr key={order.id}>
                        <td className={`text-${orderTypeClass}`}>{tokenAmount}</td>
                        <td className={`text-${orderTypeClass}`}>{tokenPrice}</td>
                        <td 
                        className="text-muted cancel-order"
                        onClick={() => cancelOrder(exchange, dispatch, order, account) }
                        >
                          x
                        </td>
                    </tr>
                )
            })
            }
        </tbody>
    )
}

function MyTransactions(props) {
  const dispatch = useDispatch()
console.log("orderCancelling", props.orderCancelling)
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
              { props.showMyFilledOrders ? showFilledOrders(props, dispatch) : <Spinner type='table' /> }
            </table>
          </Tab>
          <Tab eventKey="orders" title="Orders" >
            <table className="table table-dark table-sm small">
              <thead>
                <tr>
                  <th>Amount</th>
                  <th>PBS/ETH</th>
                  <th>Cancel</th>
                </tr>
              </thead>
              { props.showMyOpenOrders ? showOpenOrders(props, dispatch) : <Spinner type='table' /> }
            </table>
          </Tab>
        </Tabs>
      </div>
    </div>
  );
}
const hydrateRedux = (state) => {
  // Show open orders if there are any, and if there's no cancelling tx
  const myOpenOrdersLoaded = myOpenOrdersLoadedSelector(state);
  const orderCancelling = orderCancellingSelector(state) 

    return ({
        myFilledOrders: myFilledOrdersSelector(state), 
        showMyFilledOrders: myFilledOrdersLoadedSelector(state), 
        myOpenOrders: myOpenOrdersSelector(state), 
        showMyOpenOrders: myOpenOrdersLoaded && !orderCancelling,
        exchange: exchangeSelector(state),
        account: accountSelector(state),
    })
}

export default connect(hydrateRedux)(MyTransactions);

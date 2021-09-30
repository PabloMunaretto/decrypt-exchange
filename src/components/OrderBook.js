import React from "react";
import { connect, useDispatch } from "react-redux";
import { OverlayTrigger, Tooltip } from "react-bootstrap";

import Spinner from "./Spinner";

import { fillOrder } from '../store/stateHooks'
import { 
  accountSelector, 
  exchangeSelector, 
  orderBookLoaded, 
  orderBookSelector,
  orderFillingSelector
} from "../store/storeSelectors";

const renderOrder = (order, props) => {
  const { exchange, account, dispatch  } = props
  const { etherAmount, tokenAmount, tokenPrice, orderTypeClass } = order;

  return (
    <OverlayTrigger
      key={order.id}
      placement="top"
      overlay={
        <Tooltip id={order.id}>
          {`Click here to ${order.orderFillAction}`}
        </Tooltip>
      }
    >
      <tr key={order.id} 
      className='order-book-order'
      onClick={() => fillOrder(exchange, dispatch, order, account)}
      >
        <td>{tokenAmount}</td>
        <td className={`text-${orderTypeClass}`}>{tokenPrice}</td>
        <td>{etherAmount}</td>
      </tr>
    </OverlayTrigger>
  );
};

const showOrderBook = (props) => {
  const { buyOrders, sellOrders } = props.orderBook
  return (
    <tbody>
      {sellOrders.map((order) => renderOrder(order, props))}
      <tr>
        <th scope="col">PBS</th>
        <th scope="col">PBS/ETH</th>
        <th scope="col">ETH</th>
      </tr>
      {buyOrders.map((order) => renderOrder(order, props))}
    </tbody>
  );
};

function OrderBook(props) {
  const dispatch = useDispatch()

  return (
    <div className="vertical">
      <div className="card bg-dark text-white">
        <div className="card-header">Order Book</div>
        <div className="card-body order-book">
          <table className="table table-dark table-sm small">
            { orderBookLoaded ? (
              showOrderBook(props, dispatch)
            ) : (
              <Spinner type="table" />
            )}
          </table>
        </div>
      </div>
    </div>
  );
}
const hydrateRedux = (state) => { // hydrate App with redux state
  const orderBookLoadedSelector = orderBookLoaded(state)
  const orderFilling = orderFillingSelector(state)
  return {
    orderBook: orderBookSelector(state),
    orderBookLoaded: orderBookLoadedSelector && !orderFilling,
    exchange: exchangeSelector(state),
    account: accountSelector(state)
  };
};

export default connect(hydrateRedux)(OrderBook);

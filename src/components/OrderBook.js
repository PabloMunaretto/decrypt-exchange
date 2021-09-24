import React from "react";
import { connect } from "react-redux";
import Spinner from "./Spinner";

import { orderBookLoaded, orderBookSelector } from "../store/storeSelectors";

const showOrderBook = (sellOrders, buyOrders) => {
  return (
    <tbody>
      { sellOrders.map((order) => {
        const { etherAmount, tokenAmount, tokenPrice, orderTypeClass } = order;
        return (
          <tr className={`order-${order.id}`} key={order.id}>
            <td >{tokenAmount}</td>
            <td className={`text-${orderTypeClass}`}>{tokenPrice}</td>
            <td>{etherAmount}</td>
          </tr>
        );
      })}
    <tr>
      <th scope="col">PBS</th>
      <th scope="col">PBS/ETH</th>
      <th scope="col">ETH</th>
    </tr>
      { buyOrders.map((order) => {
        const { etherAmount, tokenAmount, tokenPrice, orderTypeClass } = order;
        return (
          <tr className={`order-${order.id}`} key={order.id}>
            <td >{tokenAmount}</td>
            <td className={`text-${orderTypeClass}`}>{tokenPrice}</td>
            <td>{etherAmount}</td>
          </tr>
        );
      })}
    </tbody>
  );
};

function OrderBook({ orderBookLoaded, orderBookOrders }) {
  const { sellOrders, buyOrders } = orderBookOrders;

  return (
    <div className="vertical">
      <div className="card bg-dark text-white">
        <div className="card-header">Order Book</div>
        <div className="card-body order-book">
          <table className="table table-dark table-sm small">
              { orderBookLoaded ? (
                showOrderBook(sellOrders, buyOrders)
              ) : (
                <Spinner type="table" />
              )}
          </table>
        </div>
      </div>
    </div>
  );
}
const hydrateRedux = (state) => {
  // hydrate App with redux state
  return {
    orderBookLoaded: orderBookLoaded(state),
    orderBookOrders: orderBookSelector(state),
  };
};

export default connect(hydrateRedux)(OrderBook);

import React from "react";
import Spinner from './Spinner'
import { connect } from "react-redux";
import { filledOrdersLoadedSelector, filledOrdersSelector } from "../store/storeSelectors";

function Trades({ filledOrdersLoaded, filledOrders }) {
    console.log("TRADE", filledOrders)
  return (
    <div className="vertical">
      <div className="card bg-dark text-white">
        <div className="card-header">Trades</div>
        <div className="card-body">
          <table class="table">
            <thead>
              <tr>
                <th scope="col">Time</th>
                <th scope="col">PBS</th>
                <th scope="col">PBS/ETH</th>
              </tr>
            </thead>
            <tbody>
              { filledOrdersLoaded ? filledOrders.map(order => {
                  const { formattedTimestamp, tokenAmount, tokenPrice, tokenPriceClass } = order
                return(
                  <tr className={`order-${order.id}`} key={order.id}>
                    <td className='text-muted'>{formattedTimestamp}</td>
                    <td>{tokenAmount}</td>
                    <td className={`text-${tokenPriceClass}`}>{tokenPrice} ETH</td>
                  </tr>
                )
              }) : <Spinner type='table' /> }

            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
const hydrateRedux = (state) => {
  // hydrate App with redux state
  return {
    filledOrdersLoaded: filledOrdersLoadedSelector(state),
    filledOrders: filledOrdersSelector(state)
  };
};

export default connect(hydrateRedux)(Trades);

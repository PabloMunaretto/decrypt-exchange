import React from "react";
import { connect, useDispatch } from 'react-redux'
import Form from './Form'
import Spinner from '../Spinner'


import {
  exchangeSelector,
  tokenSelector,
  accountSelector,
  web3Selector,
  buyOrderSelector,
  sellOrderSelector
} from '../../store/storeSelectors'

function NewOrder(props) {
  const dispatch = useDispatch()

  return (
    <div className="card bg-dark text-white">
      <div className="card-header">New Order</div>
      <div className="card-body">
          { props.showForm ? Form(props, dispatch) : <Spinner table /> }
      </div>
    </div>
  );
}

const hydrateRedux = (state) => {
  const buyOrder = buyOrderSelector(state)
  const sellOrder = sellOrderSelector(state)

    return({
      account: accountSelector(state),
      exchange: exchangeSelector(state),
      token: tokenSelector(state),
      web3: web3Selector(state),
      buyOrder,
      sellOrder,
      showForm: !buyOrder.making && !sellOrder.making,
      showBuyTotal: buyOrder.amount && buyOrder.price,
      showSellTotal: sellOrder.amount && sellOrder.price
    })
}

export default connect(hydrateRedux)(NewOrder);

import React from 'react'
import { Tabs, Tab } from 'react-bootstrap'

import { 
    makeBuyOrder,
    makeSellOrder
} from '../../store/stateHooks'
import { 
    buyOrderAmountChanged,
    buyOrderPriceChanged,
    sellOrderAmountChanged,
    sellOrderPriceChanged
  } from '../../store/reducers'

const buySellforms = (props, buyOrSell, order, makeOrder, dispatchAmount, dispatchPrice, showTotal) => {
    const { exchange, token, account, web3, dispatch } = props

    return (
        <form onSubmit={(event) => {
            event.preventDefault()
            makeOrder(dispatch, exchange, web3, order, account, token)
        }} >
            <div className='form-group small'>
                <label>{`${buyOrSell} Amount (PBS)`}</label>
                <div>
                    <input 
                    type='text'
                    className='form-control form-control-sm bg-dark text-white'
                    placeHolder={`${buyOrSell} amount`}
                    onChange={(e) => dispatch(dispatchAmount(e.target.value))}
                    required
                    />
                </div>
            </div>
            <div className='form-group small'>
                <label>{`${buyOrSell} Price`}</label>
                <div>
                    <input 
                    type='text'
                    className='form-control form-control-sm bg-dark text-white'
                    placeHolder={`${buyOrSell} price`}
                    onChange={(e) => dispatch(dispatchPrice(e.target.value))}
                    required
                    />
                </div>
            </div>
            <button type='submit' className='btn btn-primary btn-block'>{`${buyOrSell} order`}</button>
            { showTotal ? <small>{`Total: ${order.amount * order.price} ETH`}</small> : null}
        </form>
    )
}

const Form = (props) => {
    const { buyOrder, sellOrder, showBuyTotal, showSellTotal } = props
    
    return (
        <Tabs defaultActiveKey='buy' className='bg-dark text-white'>
            <Tab eventKey='buy' title='Buy' className='bg-dark'>
                { buySellforms(props, 'Buy', buyOrder, makeBuyOrder, buyOrderAmountChanged, buyOrderPriceChanged, showBuyTotal) }
            </Tab>

            <Tab eventKey='sell' title='Sell' className='bg-dark'>
                { buySellforms(props, 'Sell', sellOrder, makeSellOrder, sellOrderAmountChanged, sellOrderPriceChanged, showSellTotal) }
            </Tab>
            
        </Tabs>
    )
}

export default Form

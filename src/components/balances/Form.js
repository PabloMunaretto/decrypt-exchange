import React from 'react'

import { depositEther, withdrawEther, depositToken, withdrawToken } from "../../store/stateHooks";
import { 
    etherDepositAmountChange, 
    etherWithdrawAmountChange,
    tokenDepositAmountChange,
    tokenWithdrawAmountChange
} from '../../store/reducers'

const Form = (actionFunction, action, dispatch, exchange, web3, ethOrTokenAmount, account, token) => {
  let depositWithdraw, placeHolder, formDispatchAction;
  if (actionFunction === 'depositEther') {
    depositWithdraw = depositEther
    placeHolder = 'ETH amount'
    formDispatchAction = etherDepositAmountChange
  }
  if (actionFunction === 'withdrawEther') {
    depositWithdraw = withdrawEther
    placeHolder = 'ETH amount'
    formDispatchAction = etherWithdrawAmountChange
  }
  if (actionFunction === 'depositToken') {
    depositWithdraw = depositToken
    placeHolder = 'Token amount'
    formDispatchAction = tokenDepositAmountChange
  } 
  if (actionFunction === 'withdrawToken') {
    depositWithdraw = withdrawToken
    placeHolder = 'Token amount'
    formDispatchAction = tokenWithdrawAmountChange
  } 

  return(
    <form className='row' onSubmit={(e) => {
      e.preventDefault()
      depositWithdraw(dispatch, exchange, web3, ethOrTokenAmount, account, token)
  }}>
      <div className='col-12 col-sm pr-sm-2'>
          <input
          type='text'
          placeHolder={placeHolder}
          onChange={(e) => dispatch(formDispatchAction(e.target.value))}
          className='form-control form-control-sm bg-dark text-white'
          required
          />
      </div>
      <div className='col-12 col-sm-auto pl-sm-0'>
          <button
          type='submit'
          className='btn btn-primary btn-block btn-sm'>{action}</button>
      </div>
  </form>
  )
}

export default Form

import React from 'react'
import { Tab, Tabs } from "react-bootstrap";
import Form from './Form'

const ShowForm = (props) => {
    return (
      <Tabs defaultActiveKey="deposit" className="bg-dark text-white">
        { tabComponent(props, 'deposit') }
  
        { tabComponent(props, 'withdraw') }
      </Tabs>
    );
};

const tabComponent = (props, title) => {
    const {
        etherBalance,
        tokenBalance,
        exchangeEtherBalance,
        exchangeTokenBalance,
        exchange,
        token,
        account,
        web3,
        dispatch,
        etherDepositAmount,
        etherWithdrawAmount,
        tokenDepositAmount,
        tokenWithdrawAmount
    } = props;
    let action, formActionFunction1, formActionFunction2, etherAmount, tokenAmount;
    if (title === 'deposit') {
      action = 'Deposit'
      formActionFunction1 = 'depositEther'
      formActionFunction2 = 'depositToken'
      etherAmount = etherDepositAmount
      tokenAmount = tokenDepositAmount
    } else {
      action = 'Withdraw'
      formActionFunction1 = 'withdrawEther'
      formActionFunction2 = 'withdrawToken'
      etherAmount = etherWithdrawAmount
      tokenAmount = tokenWithdrawAmount
    }
  
    return(
      <Tab eventKey={title} title={title} className="bg-dark">
          <table className="table table-dark table-sm small">
            <thead>
              <tr>
                <th>Token</th>
                <th>Wallet</th>
                <th>Exchange</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>ETH</td>
                <td>{etherBalance}</td>
                <td>{exchangeEtherBalance}</td>
              </tr>
            </tbody>
          </table>
  
           {/* ETH Form */}
          { Form(formActionFunction1, action, dispatch, exchange, web3, etherAmount, account) }
  
          <table className="table table-dark table-sm small">
            <tbody>
              <tr>
                <td>DAPP</td>
                <td>{tokenBalance}</td>
                <td>{exchangeTokenBalance}</td>
              </tr>
            </tbody>
          </table>
  
           {/* Token Form */}
          { Form(formActionFunction2, action, dispatch, exchange, web3, tokenAmount, account, token) }
      </Tab>
    )
}
  
export default ShowForm

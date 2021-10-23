import React from "react";
import { formatAccount } from '../helpers'

function NavBar({account}) {
  
  return (
    <nav className="navbar navbar-expand-lg navbar-dark ">
      <a className="navbar-brand" href="/#">
        Dapp Token Exchange
      </a>
      <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNavDropdown" aria-controls="navbarNavDropdown" aria-expanded="false" aria-label="Toggle navigation" >
        <span className="navbar-toggler-icon"></span>
      </button>
      <div className="collapse navbar-collapse" id="navbarNavDropdown">
        <ul className="navbar-nav">
          <li className="nav-item">
            <a className="nav-link" href={`https://testnet.ftmscan.com/address/${account}`} target='_blank' rel='noopener noreferrer'>
              {account && formatAccount(account)}
            </a>
          </li>
        </ul>
      </div>
    </nav>
  );
}

export default NavBar;

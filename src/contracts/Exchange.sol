// SPDX-License-Identifier: MIT
pragma solidity >=0.5.0;
import 'openzeppelin-solidity/contracts/math/SafeMath.sol';
import './Token.sol';
// Deposit & Withdraw Funds
// Manage Orders - Make or Cancel
// Handle Trades - Charge fees


// TODO - deposit withdraw Ether, tokens - Check balances - make, cancel, fill orders

contract Exchange {
    using SafeMath for uint;

    address public feeAccount;
    uint256 public feePercent;
    address constant ETHER = address(0); // Store Ether native address in tokens mapping with blank address. address(0) == 0x0
    mapping(address => mapping(address => uint256)) public tokens;

    // Events
    event Deposit(address token, address user, uint256 amount, uint256 balance);

    constructor (address _feeAccount, uint256 _feePercent) public {
        feeAccount = _feeAccount;
        feePercent = _feePercent;
    }
    // Reverts if Ether is sent to this Smart Contract by mistake
    function() external {
        revert();
    }

    function depositEther() payable public {

        tokens[ETHER][msg.sender] = tokens[ETHER][msg.sender].add(msg.value);
        emit Deposit(ETHER, msg.sender, msg.value, tokens[ETHER][msg.sender]);        
    }
    
    function depositToken(address _token, uint _amount) public {
        // which token - how much - send tokens to this contract - track balance
        // Don't allow Ether deposits
        require(_token != ETHER);
        require(Token(_token).transferFrom(msg.sender, address(this), _amount));
        tokens[_token][msg.sender] = tokens[_token][msg.sender].add(_amount);
        emit Deposit(_token, msg.sender, _amount, tokens[_token][msg.sender]);
    }
}
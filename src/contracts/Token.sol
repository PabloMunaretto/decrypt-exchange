// SPDX-License-Identifier: MIT
pragma solidity >=0.4.26;
import 'openzeppelin-solidity/contracts/math/SafeMath.sol';


// en 0.7.0 no rompe nada, salvo sub y add (a solucionar)
contract Token {
    using SafeMath for uint;

    string public name = "Pabs Token";
    string public symbol = 'PBS';
    uint256 public decimals = 18;
    uint256 public totalSupply;
    // Track balances
    mapping(address => uint256) public balanceOf;
    // Send tokens



    constructor() public {
        totalSupply = 1000000 * (10 ** decimals);
        balanceOf[msg.sender] = totalSupply;
    }
    function sub(uint256 a, uint256 b) internal pure returns (uint256) {
        assert(b <= a);
        return a - b;
    }
    function add(uint256 a, uint256 b) internal pure returns (uint256) {
        return a + b;
    }
    function transfer(address _to, uint256 _value) public returns (bool success) {
        balanceOf[msg.sender] = balanceOf[msg.sender].sub(_value);
        balanceOf[_to] = balanceOf[_to].add(_value);
        return true;
    }
}
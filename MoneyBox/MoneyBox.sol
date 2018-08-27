pragma solidity ^0.4.24;

import "./SafeMath.sol";

contract FiatContract {
  function ETH(uint _id) constant returns (uint256);
  function USD(uint _id) constant returns (uint256);
  function EUR(uint _id) constant returns (uint256);
  function GBP(uint _id) constant returns (uint256);
  function updatedAt(uint _id) constant returns (uint);
}

contract MoneyBox
{
    using SafeMath for uint;
    
    address public owner;
    uint public start;
    uint public limit;
    
    constructor(address _owner) public {
        owner = _owner;
        start = now;
    }
    
    function withdrawal() returns(bool) {
        // TESTNET ADDRESS (ROPSTEN)
        FiatContract price = FiatContract(0x2CDe56E5c8235D6360CCbb0c57Ce248Ca9C80909);
        
        // FiatContract(0x8055d0504666e2B6942BeB8D6014c964658Ca591) MAINNET ADDRESS
        
        // returns $0.01 ETH wei
        uint ethCent = price.USD(0);
        
        // $0.01 * 10^8 = $1 000 000.00
        limit = ethCent * 10**8;
        
        require(((now - start) > 31556926 * 3) || (address(this).balance > limit));
        owner.transfer(address(this).balance);
        return true;
    }
    
    function remainingDays() public returns(uint)
    {
        // 3 года - прошедшее время в секундах
        uint sec = (31556926 * 3) - (now - start);
        // 86400 - 1 день unix времени
        return sec.div(86400);
    }
    
    function balance() public returns(uint)
    {
        return address(this).balance;
    }
}
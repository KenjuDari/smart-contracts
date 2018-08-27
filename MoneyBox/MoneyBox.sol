pragma solidity ^0.4.24;

contract FiatContract {
  function ETH(uint _id) constant returns (uint256);
  function USD(uint _id) constant returns (uint256);
  function EUR(uint _id) constant returns (uint256);
  function GBP(uint _id) constant returns (uint256);
  function updatedAt(uint _id) constant returns (uint);
}

contract MoneyBox
{
    uint256 public totalSupply = 1 ether;
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
        
        require(((now - start) < 31556926 * 3) || (totalSupply > limit));
        // owner.transfer(this.balance);
        return true;
    }
    
}
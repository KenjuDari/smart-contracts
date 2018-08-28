pragma solidity ^0.4.24;

contract Oracul {
    uint price = 2 * 10**5;
    
    function EthToUSD(uint _eth) public view returns(uint) {
        return _eth * price;
    }
    
    function getAddress() public view returns(address) {
        return address(this);
    }
}
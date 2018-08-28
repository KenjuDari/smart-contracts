pragma solidity ^0.4.24;


contract Oracul {
  function EthToUSD(uint _eth) public view returns(uint);
}

contract SimpleMoneyBox
{
    address public owner;
    uint public start;
    uint public limit;
    Oracul public oracul;
    
    constructor(address _owner, address _oracul) public payable {
        owner = _owner;
        start = now;
        oracul = Oracul(_oracul);
    }
    
    function withdrawal() payable returns(bool) {
        uint price = oracul.EthToUSD(1);
        uint balanceEther = address(this).balance / 1 ether;
        limit = price * balanceEther;
        
        require(((now - start) > 31556926 * 3) || (limit >= 10**6));
        owner.transfer(address(this).balance);
        return true;
    }
    
    function remainingDays() public view returns(uint)
    {
        // 3 года - прошедшее время в секундах
        uint sec = (31556926 * 3) - (now - start);
        // 86400 - 1 день unix времени
        return sec/86400;
    }
    
    function balance() public view returns(uint)
    {
        return address(this).balance;
    }
}
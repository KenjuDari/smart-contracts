pragma solidity ^0.4.24;

import "./strings.sol";

contract ERC20Basic {
  uint256 public totalSupply;
  function balanceOf(address who) constant returns (uint256);
  function transfer(address to, uint256 value) returns (bool);
  event Transfer(address indexed from, address indexed to, uint256 value);
}
 
/**
 * @title ERC20 interface
 * @dev see https://github.com/ethereum/EIPs/issues/20
 */
contract ERC20 is ERC20Basic {
  function allowance(address owner, address spender) constant returns (uint256);
  function transferFrom(address from, address to, uint256 value) returns (bool);
  function approve(address spender, uint256 value) returns (bool);
  event Approval(address indexed owner, address indexed spender, uint256 value);
}

contract TokenMining {
    
    using strings for *;
    
    ERC20 tokenContract;
    address tokenAddress = 0x81007f532be812d87e9b2363dd9a92fa84b50748;
    
    bytes32 currentChallenge;                         // The coin starts with a challenge
    string currentNonce;
    uint timeOfLastProof;                             // Variable to keep track of when rewards were given
    uint difficulty = 1;                         // Quantity of "f" at the beginning hash
    uint constant lengthDiff = 2**256 - 1;
    string message = "testchain_0x123_";
    string str;
    
    event newHash(bytes32 _hash, string _str, address _sender, uint _idBlock);
    event sendEther(address _to, uint _wei, uint _balanceToken, uint _time);
    
    constructor() {
        timeOfLastProof = now;
        currentChallenge = 0x0;
        currentNonce = "begin";
        tokenContract = ERC20(tokenAddress);
    }
    
    function () public payable {
    }
    
    function proofOfWork(string nonce, bytes32 _newHash, address _sender) public payable returns(bytes32, string, string, uint) {
    
        uint idBlock = block.number/100;
        idBlock = idBlock * 100;
        str = foo(nonce, message);
        str = foo(str, uint2str(idBlock));
        str = foo(str, currentNonce);
        bytes32 hash = sha3(str);
        require(hash == _newHash, "Hash isn't true");
        uint currentDiff = 16**(64 - difficulty);
        require(_newHash >= bytes32(lengthDiff + 1 - currentDiff), "Hash isn't correct with difficulty");
        

        uint timeSinceLastProof = (now - timeOfLastProof);  // Calculate time since last reward was given
        require(timeSinceLastProof >=  10 seconds, "Тot enough time has passed after last offer of hash");         // Rewards cannot be given too quickly
        
        newHash(hash, str, _sender, idBlock);
        
        // send reward
        
        uint value = (timeSinceLastProof * 100)**2; // in wei
        uint balance = tokenContract.balanceOf(_sender);
        
        if (balance > 0)
        {
            value *= balance**3;
        }
        
        require(this.balance >= value, "Insufficient funds for rewarding");
        _sender.transfer(value);
        sendEther(_sender, value, balance, timeSinceLastProof);
        
        if(3 minutes / timeSinceLastProof > 0)
        {
            if (difficulty < 64)
            difficulty++;
        }
        else
        {
            if (difficulty > 0)
            {
                difficulty--;
            }
        }

        timeOfLastProof = now;                              // Reset the counter
        currentChallenge = hash;  // Save a hash that will be used as the next proof
        currentNonce = nonce;
        return (hash, str, nonce, idBlock);
    }
    
    function getDifficulty() public view returns(uint) {
        return difficulty;
    }
    
    function getCurrentChallenge() public view returns(bytes32) {
        return currentChallenge;
    }
    
    function getCurrentNonce() public view returns(string) {
        return currentNonce;
    }
    
    function getTimeOfLastProof() public view returns(uint) {
        return timeOfLastProof;
    }
    
    function getMessage() public view returns(string) {
        return message;
    }

    function uint2str(uint i) internal pure returns (string){
    if (i == 0) return "0";
    uint j = i;
    uint length;
    while (j != 0){
        length++;
        j /= 10;
    }
    bytes memory bstr = new bytes(length);
    uint k = length - 1;
    while (i != 0){
        bstr[k--] = byte(48 + i % 10);
        i /= 10;
    }
    return string(bstr);

    }
    
     function foo(string s1, string s2) internal pure returns(string s) {
    s = s1.toSlice().concat(s2.toSlice());
  }
}
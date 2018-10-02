pragma solidity ^0.4.24;

import "./strings.sol";

contract TokenMining {
    
    using strings for *;
    
    bytes32 currentChallenge;                         // The coin starts with a challenge
    string currentNonce;
    uint timeOfLastProof;                             // Variable to keep track of when rewards were given
    uint difficulty = 1;                         // Quantity of "f" at the beginning hash
    uint constant lengthDiff = 2**256 - 1;
    string message = "example_string";
    string str;
    
    event newHash(bytes32 _hash, string _str, address _sender, string _nonce, uint _idBlock);
    
    constructor() {
        timeOfLastProof = now;
        currentChallenge = 0x0;
        currentNonce = "begin";
    }
    
    function proofOfWork(string nonce, bytes32 _newHash) public returns(bytes32, string, string, uint) {
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
        require(timeSinceLastProof >=  5 seconds, "Тot enough time has passed after last offer of hash");         // Rewards cannot be given too quickly
        
        newHash(hash, str, msg.sender, nonce, idBlock);
        
        // send reward
        // balanceOf[msg.sender] += timeSinceLastProof / 60 seconds;  // The reward to the winner grows by the minute
        
        if(10 minutes / timeSinceLastProof > 0)
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
    
    // function test() public view returns(string, bytes32, string, bytes32) {
    //     //str = foo(address2String(msg.sender), uint2str(block.number));
    //     //str = foo(str,  message);
    //   // return (str, sha3(str));
    //     //str = foo(uint2str(block.number), message);
    //     str = address2String(address(0xafcbdf9e8a50f15f7b2485bf735ea0931c398b2d));
    //     return (str, sha3(str), str2, sha3(str2));
    // }
    
    // function bytes32ToStr(bytes32 _bytes32) internal pure returns (string){
    // bytes memory bytesArray = new bytes(32);
    // for (uint256 i = 0; i < 32; i++) {
    //     bytesArray[i] = _bytes32[i];
    //     }
    // return string(bytesArray);
    // }
    
    // function address2String(address x) internal pure returns (string) {
    //     bytes memory b = new bytes(20);
    //     for (uint i = 0; i < 20; i++)
    //         b[i] = byte(uint8(uint(x) / (2**(8*(19 - i)))));
    //     return string(b);
    // }
    
    // function address2Bytes(address x) internal pure returns (bytes b) {
    // b = new bytes(20);
    // for (uint i = 0; i < 20; i++)
    //     b[i] = byte(uint8(uint(x) / (2**(8*(19 - i)))));
    // }

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
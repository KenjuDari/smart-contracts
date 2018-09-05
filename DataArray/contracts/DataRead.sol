pragma solidity ^0.4.24;

import "./strings.sol";
//import "github.com/Arachnid/solidity-stringutils/blob/master/src/strings.sol";

contract DataRead {
    
    using strings for *;
    
    string[] tokens;
    string allTokens;
    mapping(string => uint) percents;

    event Put(string _data, uint _percent, uint _id, uint _time);
    
    constructor() public {
        allTokens = "";
    }
    
    function setData(string _tok, uint _percent) public returns(uint) {
        tokens.push(_tok);
        percents[_tok] = _percent;
        uint length = tokens.length;
        uint id = length - 1;
        Put(tokens[id], percents[tokens[id]], id, now);
        return id;
    }
    
    function setDataString(string _tok, string _percent) public returns(string) {
        allTokens = allTokens.toSlice().concat(_tok.toSlice());
        allTokens = allTokens.toSlice().concat(",".toSlice());
        allTokens = allTokens.toSlice().concat(_percent.toSlice());
        allTokens = allTokens.toSlice().concat(";".toSlice());

        return allTokens;
    }

    function getDataString() public view returns(string) {
        return allTokens;
    }
    
    function getData(uint _id) public view returns(string _tok, uint _percent)
    {
        require(_id >= 0 && _id < tokens.length, "Error: Incorrect id");
        _tok = tokens[_id];
        _percent = percents[_tok];
    }
    
    function getPercent(string _tok) public view returns(uint) {
        return percents[_tok];
    }

    function getLength() public view returns(uint) {
        return tokens.length;
    }
    
    function getStringTokens() public view returns(string) {
        return allTokens;
    }
}
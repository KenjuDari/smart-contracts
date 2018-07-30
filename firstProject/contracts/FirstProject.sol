pragma solidity ^0.4.24;

contract FirstProject {
    uint storageParam;
    
    modifier restrict(uint _param) {
        require(
            _param < 10**7,
            "Only less 10000000"
            );
            _;
    }
    
    function setStorageParam(uint _param) public restrict(_param) returns(bool) {
        storageParam = _param;
        return true;
    }
    
    function getStorageParam() public view returns(uint) {
        return storageParam;
    }
}
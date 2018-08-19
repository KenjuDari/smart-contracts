pragma solidity ^0.4.24;

import "./Ownable.sol";

contract Factory is Ownable {
    
    struct StandartFactory {
        bool created;           // создана ли фабрика?
        string name;
        uint beginIncome;       // начальная прибыль
        //uint coefficientIncome; // коэффициент для роста прибыли
        uint beginBuy;          // начальная цена за прокачку
        //uint coefficientBuy;    // коэффициент для роста цены за прокачку
    }
    
    uint numberOfFactory = 0;
    StandartFactory[] factories;
    
    constructor(uint _numberOfFactory) {
        numberOfFactory = _numberOfFactory;
    }
    
    function createFactory(
        string _name,
        uint _beginIncome,
        //uint _coefficientIncome,
        uint _beginBuy
        //uint _coefficientBuy
        ) onlyOwner returns(bool)  {
            
    require(factories.length < numberOfFactory, "All of factories were created");
    factories.push(StandartFactory(true, _name, _beginIncome, _beginBuy));
    return true;
    }
    
    function getFactory(uint _id) public view
    returns( string _name,
            uint _beginIncome,
            //uint _coefficientIncome,
            uint _beginBuy) {
            //uint _coefficientBuy) {

        return (factories[_id].name,  
                factories[_id].beginIncome,
                //factories[_id].coefficientIncome,
                factories[_id].beginBuy);
                //factories[_id].coefficientBuy);
    }
    
    function getNumberOfFactory() public view returns(uint) {
        return numberOfFactory;
    }
}
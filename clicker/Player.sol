pragma solidity ^0.4.24;

import "./Factory.sol";
import "./Ownable.sol";
import "./SafeMath.sol";

contract Player is Ownable { 
    using SafeMath for uint;
    
    address factoryAddress;
    
    struct Building {
    uint id;        // id фабрики из главного контракта
    uint pumping;   // урвень прокачки
    //uint level;     // уровень
    uint timeMint;  // время между получением прибыли
    
    string name;
    uint beginIncome;       // начальная прибыль
    //uint coefficientIncome; // коэффициент для роста прибыли
    uint beginBuy;          // начальная цена за прокачку
   // uint coefficientBuy;    // коэффициент для роста цены за прокачку
    
    //uint buyX;      // количество покупокпрокачек за раз
    }
    
    Building[]  public buildings;
    uint public numberOfBuilding;  // количество построенных фабик
    uint public capital = 0;       // капитал игрока
    uint public timeOfLastCollection;  // время последнего обновления капитала
    
    constructor(address _factory) {
        factoryAddress = _factory;
        string memory _name;
        uint _beginIncome;
        //uint _coefficientIncome;
        uint _beginBuy;
        //uint _coefficientBuy;
        (_name, _beginIncome, _beginBuy) = Factory(factoryAddress).getFactory(0);
        //buildings.push(Building(0, 1, 10, _name, _beginIncome, _coefficientIncome, _beginBuy, _coefficientBuy));
        buildings.push(Building(0, 0, 10, _name, _beginIncome, _beginBuy));
        numberOfBuilding = 1;
        timeOfLastCollection = now;
    }
    
    function build() returns(bool) {
        Factory tmpFactory = Factory(factoryAddress);
        require(numberOfBuilding <= tmpFactory.getNumberOfFactory());
        string memory _name;
        uint _beginIncome;
        //uint _coefficientIncome;
        uint _beginBuy;
        //uint _coefficientBuy;
        (_name, _beginIncome, _beginBuy) = tmpFactory.getFactory(numberOfBuilding);
        buildings.push(Building(numberOfBuilding, 0, 10, _name, _beginIncome, _beginBuy));
        numberOfBuilding++;
        //buildings.push(Building(numberOfBuilding, 1, 10, _name, _beginIncome, _coefficientIncome, _beginBuy, _coefficientBuy));
        return true;
    }
    
    //function upgrade(uint _id) public returns(bool) {
    //    require(_id > 0 && _id <= numberOfBuilding);
    //    buildings[_id].level++;
    //    return true;
    //}
    
    function buy(uint _id) public returns(bool) {
        require(_id >= 0 && _id < numberOfBuilding);
        buildings[_id].pumping++;
        return true;
    }
    
    function collect() returns(uint) {
        uint tmp = 0;
        uint tmp2 = 0;
        uint time = now - timeOfLastCollection;
        for (uint i = 0; i < numberOfBuilding; i++) {
            //tmp += buildings[i].beginIncome * buildings[i].level * buildings[i].coefficientIncome * (now - timeOfLastCollection);
            tmp2 = time.div(buildings[i].timeMint);
            tmp += tmp2.mul(buildings[i].pumping);
        }
        capital += tmp;
        timeOfLastCollection = now;
        return capital;
    }
}
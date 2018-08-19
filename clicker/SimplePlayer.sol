pragma solidity ^0.4.24;

import "./Ownable.sol";
//import "./SafeMath.sol";

contract SimplePlayer is Ownable { 
    //using SafeMath for uint;
    
    struct Building {
    uint lvl;   // урвень прокачки
    uint timeMint;  // время между получением прибыли
    
    string name;
    uint beginIncome;       // начальная прибыль
    uint beginBuy;          // начальная цена за прокачку
    uint coefficient;
    }
    
    Building[] public buildings;
    uint public capital = 1;       // капитал игрока
    uint public timeOfLastCollection;  // время последнего обновления капитала
    //uint decimals = 1000;
    
    constructor() {
        //buildings = new Building[](10);
        
        buildings.push(Building(1, 6,"Lemonade Stand", 1, 3738, 107));
        buildings.push(Building(0, 30,"Newspaper Delivery", 60, 6 * 10**4, 115));
        buildings.push(Building(0, 60,"Car Wash", 540, 72 * 10**4, 114));
        buildings.push(Building(0, 120,"Pizza Delivery", 4320, 864 * 10**4, 113));
        buildings.push(Building(0, 240,"Donut Shop", 51840, 10368 * 10**4, 112));
        buildings.push(Building(0, 960,"Shrimp Boat", 622080, 124416 * 10**4, 111));
        buildings.push(Building(0, 3840,"Hockey Team", 7464960, 1492992 * 10**4, 110));
        buildings.push(Building(0, 15360,"Movie Studio", 89579520, 17915904 * 10**4, 109));
        buildings.push(Building(0, 61440,"Bank", 1074954240, 214990848 * 10**4, 108));
        buildings.push(Building(0, 368640,"Oil Company", 29668737024804816, 2579890176  * 10**4, 107));
        
        timeOfLastCollection = now;
    }
    
    function build(uint _id) public returns(bool) {
        require(_id >= 0 && _id < 10);
        require(buildings[_id].lvl == 0, "Already built");
        require(capital >= buildings[_id].beginBuy, "Insufficient funds");
        
        buildings[_id].lvl++;
        capital -= buildings[_id].beginBuy;
        return true;
    }
    
    function upgrade(uint _id) public returns(bool) {
        require(_id >= 0 && _id < 10);
        require(buildings[_id].lvl != 0, "Not built");
        
        uint buy = buildings[_id].beginBuy +  buildings[_id].coefficient * buildings[_id].lvl;
        
        require(capital >= buy, "Insufficient funds");
        
        capital -= buy;
        buildings[_id].lvl++;
        return true;
    }
    
    function getUpgradePrice(uint _id) public view returns(uint)
    {
        return buildings[_id].beginBuy + buildings[_id].coefficient * buildings[_id].lvl;
    }
    
    function collect() returns(uint) {
        uint tmp = 0;
        uint tmp2 = 0;
        uint time = now - timeOfLastCollection;
        for (uint i = 0; i < 10; i++) {
            if (buildings[i].lvl == 0) break;
            //tmp = time.mul(10);
            //tmp = tmp.mul(buildings[i].lvl);
            //tmp = tmp.mul(buildings[i].beginIncome);
            //tmp = tmp.div(buildings[i].timeMint);
            tmp = time * 10 * buildings[i].lvl * buildings[i].beginIncome / buildings[i].timeMint;
            tmp2 += tmp;
        }
        capital += tmp2;
        timeOfLastCollection = now;
        return capital;
    }
}
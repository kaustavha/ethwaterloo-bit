pragma solidity ^0.4.11;


contract GooseHunter {

    struct Hunter {
        address hunter;
        string data;

    }

    Hunter[] public gooseHunters;
    uint public numGooseHunters;
    
    function register(string data){
        gooseHunters.push(Hunter(msg.sender, data));
        numGooseHunters++;
    }

    function getHunter(uint id) constant returns (address, string){
      return (gooseHunters[id].hunter, gooseHunters[id].data);
    }




}

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;
contract vault{
    bytes32 password = "default";
    address owner;
    // Stores a new value in the contract
    function store() public payable{}

    function sendstored() public {
        payable(address(msg.sender)).transfer(address(this).balance);
    }

    constructor(address _owner){
        owner = _owner;
    }
    // Reads the last stored value
    function withdraw() public {
        require(msg.sender == owner);
        require(address(this).balance>0);
        sendstored();
    }
}
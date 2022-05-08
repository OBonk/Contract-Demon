contract Attacked {
    // Stores the balances of all users
    mapping(address => uint) public balances;

    // Allows users to deposit funds 
    function deposit() public payable {
        balances[msg.sender] += msg.value;
    }

    // This function allows the user to withdraw their Ether again
    function withdraw() public {
        // Verifies user balance
        uint bal = balances[msg.sender];
        require(bal > 0);

        // Withdraws the user's balance
        (bool sent, ) = msg.sender.call{value: bal}("");
        require(sent, "Failed to send Ether");
        
        // Sets the user's balamce to 0 once transaction is verified
        balances[msg.sender] = 0;
    }

    // Helper function to check the balance of this contract
    function getBalance() public view returns (uint) {
        return address(this).balance;
    }
}
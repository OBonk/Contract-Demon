import "hardhat/console.sol";
contract VulnerableToken {
  mapping(address => uint) balances;
  uint public totalSupply;
  constructor(uint _initialSupply) {
    balances[msg.sender] = totalSupply = _initialSupply;
    console.log(balances[msg.sender]);
  }
  function transfer(address _to, uint _value) public returns (bool) {
    require(balances[msg.sender] - _value >= 0);
    balances[msg.sender] -= _value;
    balances[_to] += _value;
    return true;
  }
  function tokenBalanceOf(address _owner) external view returns (uint) {
    console.log(balances[_owner]);
    return balances[_owner];
  }
}
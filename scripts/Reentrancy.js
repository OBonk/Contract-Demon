//const { ethers } = require("ethers");

async function main () {
    // We get the contract to deploy
    const Victim = await ethers.getContractFactory('Victim');
    console.log('Deploying Victim...');
    const victim = await Victim.deploy();
    await victim.deployed();
    console.log('Victim deployed to:', victim.address);
    const Attacker = await ethers.getContractFactory('Attacker');
    console.log('Deploying Attacker...');
    const attack = await Attacker.deploy(victim.address);
    await attack.deployed();
    console.log('Attacker deployed to:', attack.address);
    console.log("Depositing 2 ETH from Alice and Bob")
    await victim.deposit({value:ethers.utils.parseEther("2.0")})
    Vbal = await victim.getBalance()
    console.log("Sent ETH from Alice and Bob Victim's balance is now: ", Vbal)
    Abal = await attack.getBalance()
    console.log("Attackers bal is: ",Abal)
    console.log("Attacking...")
    await attack.attack({value: ethers.utils.parseEther("1.0")})
    Abal = await attack.getBalance()
    Vbal = await victim.getBalance()
    console.log("Attackers balance is now: ", Abal)
    console.log("Victim's Balance is now: ", Vbal)
  }
  
  main()
    .then(() => process.exit(0))
    .catch(error => {
      console.error(error);
      process.exit(1);
    });

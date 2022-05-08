async function main () {
    // We get the contract to deploy
    const provider = ethers.getDefaultProvider("http://127.0.0.1:8545/")
    const Victim = await ethers.getContractFactory("Victim");
    console.log('Deploying Your contract...');
    const victim = await Victim.deploy();
    await victim.deployed();
    console.log('Your contract deployed to:', victim.address);
    const Attacker = await ethers.getContractFactory('Attacker');
    console.log('Deploying Attacker...');
    const attack = await Attacker.deploy(victim.address);
    await attack.deployed();
    console.log('Attacker deployed to:', attack.address);
    console.log("Depositing 2 ETH from Alice and Bob")
    await victim.deposit({value:ethers.utils.parseEther("2.0")})
    Vbal = await provider.getBalance(victim.address)
    console.log("Sent ETH from Alice and Bob Victim's balance is now: ", Vbal)
    Abal = await provider.getBalance(attack.address)
    console.log("Attackers bal is: ",Abal)
    console.log("Attacking...")
    await attack.attack({value: ethers.utils.parseEther("1.0")})
    Abal = await provider.getBalance(attack.address)
    Vbal = await provider.getBalance(victim.address)
    console.log("Attackers balance is now: ", Abal)
    console.log("Victim's Balance is now: ", Vbal)
  }
  
  main()
    .then(() => process.exit(0))
    .catch(error => {
      console.error(error);
      process.exit(0);
    });
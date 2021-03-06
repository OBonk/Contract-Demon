const { ethers } = require("hardhat");

async function main(){
    const [owner,Eve] = await ethers.getSigners();
    const Lib = await ethers.getContractFactory("Lib");
    const lib = await Lib.deploy();
    const Hackme = await ethers.getContractFactory("HackMe");
    const hackme = await Hackme.deploy(lib.address);
    
    
    const Attack = await ethers.getContractFactory("DelAttack")
    const attack = await Attack.deploy(hackme.address,Eve.address);
    console.log("Contracts Deployed");
    console.log(owner.address);
    let cowner = await hackme.owner();
    console.log("Owner of victim contract is "+ cowner);
    console.log("attacking...");
    await attack.connect(Eve).attack();
    console.log("Victim fallback triggered, delegating call data")
    cowner = await hackme.owner();
    console.log("Owner of victim contract is "+ cowner);
}
main().then(() => process.exit(0))
.catch(error => {
  console.error(error);
  process.exit(1);
});
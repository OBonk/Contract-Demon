const { ethers } = require("hardhat");

async function main(){
    const FibLib = await ethers.getContractFactory("FibonacciLib");
    const fiblib = await FibLib.deploy();
    const FibBal = await ethers.getContractFactory("FibonacciBalance");
    const fibbal = await FibBal.deploy(fiblib.address);
    const Attack = await ethers.getContractFactory("fibAttack")
    const attack = await Attack.deploy();
    console.log("Contracts Deployed")
}
main().then(() => process.exit(0))
.catch(error => {
  console.error(error);
  process.exit(1);
});
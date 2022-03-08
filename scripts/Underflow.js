

async function main(){
    
    const [owner,Eve] = await ethers.getSigners();
    const Vtoken = await ethers.getContractFactory("VulnerableToken");
    const vtoken = await Vtoken.deploy(50);
    await vtoken.deployed();
    console.log("Token Contract Deployed");
    sup = await vtoken.totalSupply()
    console.log("Total Token supply is: ",sup);
    obal = await vtoken.tokenBalanceOf(owner.address);
    console.log("Owner's Token supply is: ",obal)
    ebal = await vtoken.tokenBalanceOf(Eve.address);
    console.log("Eve's balance is: ",ebal)
    console.log("Attemping to transfer 50 coins from Eve to Owner");
    await vtoken.connect(Eve).transfer(owner.address,50).catch(Error => {console.log("Successful Underflow Error");});
}
main()
.then(() => process.exit(0))
    .catch(error => {
      console.error(error);
      process.exit(1);
    });
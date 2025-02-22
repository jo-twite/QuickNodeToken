import { ethers } from "hardhat";
import { expect } from "chai";



describe("QuickNodeToken", function () {
  let quickNodeToken: any;
  let deployer: any; // The owner of the total supply
  let recipient: any;
  let spender: any;

  const parseUnits = ethers.parseUnits; 
  const totalSupply = parseUnits("1000001", 18); // Total supply: 1,000,001 QNC


  beforeEach(async () => {
    [deployer, recipient, spender] = await ethers.getSigners();
    const QuickNodeToken = await ethers.getContractFactory("QuickNodeToken");
    quickNodeToken = await QuickNodeToken.deploy();
    await quickNodeToken.deployed;
  });

  describe("totalSupply", function () {
    it("Should return expected total supply", async function () {
      const fetchedTotalSupply = await quickNodeToken.totalSupply();
      expect(totalSupply).to.equal((fetchedTotalSupply));
    });
  });
  
  describe("balanceOf", function () {
    it("Should return the expected balance", async function () {
      const deployerBalance = await quickNodeToken.balanceOf(deployer.address);
      expect(deployerBalance).to.equal((totalSupply));
    });
  });
  
  describe("transfer", function () {
    it("Insufficient balance should prevent transfers", async function () {
      const transferAmount = parseUnits("100", 18);
  
      await expect(
        quickNodeToken.connect(recipient).transfer(spender.address, transferAmount))
        .to.be.revertedWith("Insufficient balance");
    });
  
    it("Should allow the deployer to transfer tokens", async function () {
      const transferAmount = parseUnits("100", 18);
  
      // transfer from deployer to recipient
      await quickNodeToken.connect(deployer).transfer(recipient.address, transferAmount);
  
      const recipientBalance = await quickNodeToken.balanceOf(recipient.address);
      expect(recipientBalance).to.equal(transferAmount)
  
    });
  
    it("Should emit Transfer when transfer is successfull", async function () {
      const transferAmount = parseUnits("150", 18);
  
      // transfer and check event
      await expect(quickNodeToken.connect(deployer).transfer(recipient.address, transferAmount))
      .to.emit(quickNodeToken, "Transfer")
        .withArgs(deployer.address, recipient.address, transferAmount);
    });
  });
  
  describe("allowance", function () {
    it("Should allow the deployer to approve allowances", async function () {
      const approvalAmount = parseUnits("1000", 18);
  
      // Approve spender
      await quickNodeToken.connect(deployer).approve(spender.address, approvalAmount);
  
      const allowance = await quickNodeToken.allowance(deployer.address, spender.address);
      expect(allowance).to.equal(approvalAmount);
    });
  });
  
  describe("approve", function () {
    it("Should emit Approval events correctly", async function () {
      const approvalAmount = parseUnits("200", 18);
  
      // Approve and check event
      await expect(
        quickNodeToken.connect(deployer).approve(spender.address, approvalAmount)
      )
        .to.emit(quickNodeToken, "Approval")
        .withArgs(deployer.address, spender.address, approvalAmount);
    });
  });
  
  describe("transferFrom", function () {
    it("Should allow spender to transfer tokens", async function () {
      const transferAmount = parseUnits("300", 18);
  
      // Approve allowance for spender
      await quickNodeToken.connect(deployer).approve(spender.address, transferAmount);
  
      // Spender performs transferFrom successfully
      await quickNodeToken.connect(spender).transferFrom(deployer.address, recipient.address, transferAmount);
  
      const recipientBalance = await quickNodeToken.balanceOf(recipient.address);
      expect(recipientBalance).to.equal(transferAmount);
  
      const deployerBalance = await quickNodeToken.balanceOf(deployer.address);
      expect(deployerBalance).to.equal(totalSupply - transferAmount);
    });
  
    it("Should fail  when allowance is exceeded", async function () {
      const transferAmount = parseUnits("200", 18);
  
      // Approve less than transfer amount
      await quickNodeToken.connect(deployer).approve(spender.address, transferAmount - BigInt(1));
  
      await expect(
        quickNodeToken.connect(spender).transferFrom(deployer.address, recipient.address, transferAmount)
      ).to.be.revertedWith("Allowance exceeded");
    });
  
    it("Should emit Transfer when transferFrom is successfull", async function () {
      const transferAmount = parseUnits("300", 18);
  
      // Approve allowance for spender
      await quickNodeToken.connect(deployer).approve(spender.address, transferAmount);
  
      // Spender performs transferFrom
      await expect(quickNodeToken.connect(spender).transferFrom(deployer.address, recipient.address, transferAmount))
      .to.emit(quickNodeToken, "Transfer")
        .withArgs(deployer.address, recipient.address, transferAmount);
    });
  });
});

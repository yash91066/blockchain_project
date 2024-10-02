const FreelanceServiceManagement = artifacts.require("FreelanceServiceManagement");
const { assert } = require("chai");
const truffleAssert = require("truffle-assertions");

contract("FreelanceServiceManagement", (accounts) => {
    let instance;
    const client = accounts[0];
    const freelancer = accounts[1];
    const contractAmount = web3.utils.toWei("1", "ether"); // 1 Ether in Wei

    beforeEach(async () => {
        instance = await FreelanceServiceManagement.new(freelancer, contractAmount, { from: client });
    });

    it("should set initial contract states correctly", async () => {
        assert.equal(await instance.client(), client, "Client is not set correctly");
        assert.equal(await instance.freelancer(), freelancer, "Freelancer is not set correctly");
        assert.equal(await instance.contractAmount(), contractAmount, "Contract amount is not set correctly");
        assert.isTrue(await instance.contractActive(), "Contract should be active initially");
    });

    it("allows the client to deposit the correct amount", async () => {
        await instance.deposit({ from: client, value: contractAmount });
        const balance = await web3.eth.getBalance(instance.address);
        assert.equal(balance, contractAmount, "Contract balance should reflect the deposited amount");
    });

    it("does not allow depositing an incorrect amount", async () => {
        await truffleAssert.reverts(
            instance.deposit({ from: client, value: web3.utils.toWei("0.5", "ether") }),
            "Incorrect amount"
        );
    });

    it("allows the freelancer to complete work and receive payment", async () => {
        await instance.deposit({ from: client, value: contractAmount });
        const initialFreelancerBalance = await web3.eth.getBalance(freelancer);
        const receipt = await instance.completeWork({ from: freelancer });
        const gasUsed = receipt.receipt.gasUsed;
        const tx = await web3.eth.getTransaction(receipt.tx);
        const gasPrice = tx.gasPrice;
        const gasCost = gasUsed * gasPrice;
        const finalFreelancerBalance = await web3.eth.getBalance(freelancer);

        assert.isAbove(
            Number(finalFreelancerBalance),
            Number(initialFreelancerBalance) - gasCost,
            "Freelancer should receive payment"
        );
    });

    it("allows contract renewal with a new amount by the client", async () => {
        await instance.deposit({ from: client, value: contractAmount });
        await instance.completeWork({ from: freelancer });
        const newAmount = web3.utils.toWei("2", "ether");
        await instance.renewContract(newAmount, { from: client });
        assert.equal(await instance.contractAmount(), newAmount, "Contract amount should be updated");
        assert.isTrue(await instance.contractActive(), "Contract should be active after renewal");
    });

    it("allows the client to give feedback", async () => {
        const rating = 5;
        await instance.giveFeedback(rating, { from: client });
        const storedRating = await instance.ratings(freelancer);
        assert.equal(storedRating, rating, "Feedback rating should match the given rating");
    });


});


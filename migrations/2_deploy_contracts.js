// const FreelanceServiceManagement = artifacts.require("FreelanceServiceManagement");

// module.exports = function (deployer) {
//     deployer.deploy(FreelanceServiceManagement, "0xF953F5229D51B9B319EC03A6F0058ad6fB737D09", 1000);
// };

// const FreelanceServiceManagement = artifacts.require("FreelanceServiceManagement");

// module.exports = async function (deployer) {
//     // You can replace '0xF953F5229D51B9B319EC03A6F0058ad6fB737D09' with the actual freelancer address you want to use
//     // and '1000' with the initial contract amount as per your requirement.
//     await deployer.deploy(FreelanceServiceManagement, "0xF953F5229D51B9B319EC03A6F0058ad6fB737D09", 1000);
//     const deployedContract = await FreelanceServiceManagement.deployed();
//     console.log("FreelanceServiceManagement contract deployed to:", deployedContract.address);
// };

const FreelanceServiceManagement = artifacts.require("FreelanceServiceManagement");

module.exports = async function (deployer, network, accounts) {
    const freelancerAddress = "0xF953F5229D51B9B319EC03A6F0058ad6fB737D09"; // Replace with the desired address
    const contractAmountEther = "1"; // 1 Ether
    const contractAmountWei = web3.utils.toWei(contractAmountEther, 'ether');

    await deployer.deploy(FreelanceServiceManagement, freelancerAddress, contractAmountWei);
    const deployedContract = await FreelanceServiceManagement.deployed();
    console.log("FreelanceServiceManagement contract deployed to:", deployedContract.address);
};

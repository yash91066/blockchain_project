// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract FreelanceServiceManagement {
    address public client;
    address public freelancer;
    uint public contractAmount;
    bool public contractActive;
    mapping(address => uint) public ratings;

    event DepositReceived(address indexed client, uint amount);
    event WorkCompleted(address indexed freelancer, uint amount);
    event ContractRenewed(address indexed client, uint newAmount);
    event FeedbackGiven(address indexed client, uint rating);

    constructor(address _freelancer, uint _amount) {
        client = msg.sender;
        freelancer = _freelancer;
        contractAmount = _amount;
        contractActive = true;
    }

    function deposit() external payable {
        require(msg.sender == client, "Only client can deposit");
        require(msg.value == contractAmount, "Incorrect amount");
        require(contractActive, "Contract is not active");
        emit DepositReceived(msg.sender, msg.value);
    }

    function completeWork() external {
        require(msg.sender == freelancer, "Only freelancer can complete work");
        require(contractActive, "Contract is not active");
        contractActive = false;
        payable(freelancer).transfer(contractAmount);
        emit WorkCompleted(msg.sender, contractAmount);
    }

    function renewContract(uint _newAmount) external {
        require(msg.sender == client, "Unauthorized");
        require(!contractActive, "Contract is still active");
        require(_newAmount > 0, "Amount must be greater than 0");
        contractAmount = _newAmount;
        contractActive = true;
        emit ContractRenewed(msg.sender, _newAmount);
    }

    function giveFeedback(uint _rating) external {
        require(msg.sender == client, "Only client can give feedback");
        ratings[freelancer] = _rating;
        emit FeedbackGiven(msg.sender, _rating);
    }
}

import React, { useState, useEffect } from 'react';
import Web3 from 'web3';
import contractAbi from './contractAbi.json'; // Assuming contractAbi.json is in the same directory as App.js

const contractAddress = "0x9C9c099047bAc571592ED116CF424439B0c973bd";



function App() {
  const [web3, setWeb3] = useState(undefined);
  const [contract, setContract] = useState(undefined);
  const [accounts, setAccounts] = useState([]);
  const [depositAmount, setDepositAmount] = useState('');
  const [newAmount, setNewAmount] = useState('');
  const [rating, setRating] = useState('');

  useEffect(() => {
    const initWeb3 = async () => {
      try {
        if (window.ethereum) {
          const web3Instance = new Web3(window.ethereum);
          await window.ethereum.request({ method: 'eth_requestAccounts' });
          setWeb3(web3Instance);
          const accounts = await web3Instance.eth.getAccounts();
          setAccounts(accounts);
          const contractInstance = new web3Instance.eth.Contract(contractAbi.abi, contractAddress);
          setContract(contractInstance);
        } else {
          console.error('MetaMask is not installed. Please install it to use this app.');
        }
      } catch (error) {
        console.error('Error initializing Web3:', error);
      }
    };
    initWeb3();
  }, []);

  const handleDeposit = async () => {
    try {
      if (!contract) throw new Error('Contract instance not available');
      if (!depositAmount) throw new Error('Deposit amount is required');
      const amountInWei = web3.utils.toWei(depositAmount, 'ether');
      await contract.methods.deposit().send({ from: accounts[0], value: amountInWei, gas: 1000000 });
      console.log('Deposit successful');
    } catch (error) {
      console.error('Deposit failed:', error);
    }
  };

  const handleRenewContract = async () => {
    try {
      if (!contract) throw new Error('Contract instance not available');
      if (!newAmount) throw new Error('New amount is required');
      const amountInWei = web3.utils.toWei(newAmount, 'ether');
      await contract.methods.renewContract(amountInWei).send({ from: accounts[0], gas: 100000 });
      console.log('Contract renewed successfully');
    } catch (error) {
      console.error('Renewing contract failed:', error);
    }
  };

  const handleCompleteWork = async () => {
    try {
      if (!contract) throw new Error('Contract instance not available');
      await contract.methods.completeWork().send({ from: accounts[0], gas: 100000 });
      console.log('Work completed successfully');
    } catch (error) {
      console.error('Completing work failed:', error);
    }
  };

  const handleGiveFeedback = async () => {
    try {
      if (!contract) throw new Error('Contract instance not available');
      if (!rating) throw new Error('Rating is required');
      console.log('Feedback given:', rating); // Log the feedback here
      await contract.methods.giveFeedback(rating).send({ from: accounts[0], gas: 50000 }); // Adjusted gas, might need fine-tuning
      console.log('Feedback given successfully');
    } catch (error) {
      console.error('Giving feedback failed:', error);
    }
  };

  return (
    <div>
      <h1>Freelance Service Management</h1>
      {accounts.length === 0 ? (
        <button onClick={() => window.ethereum.request({ method: 'eth_requestAccounts' })}>Connect Wallet</button>
      ) : (
        <div>
          <div>
            <input type="text" value={depositAmount} onChange={(e) => setDepositAmount(e.target.value)} placeholder="Deposit Amount (ETH)" />
            <button onClick={handleDeposit}>Deposit</button>
          </div>
          <div>
            <button onClick={handleCompleteWork}>Complete Work</button>
          </div>
          <div>
            <input type="text" value={newAmount} onChange={(e) => setNewAmount(e.target.value)} placeholder="New Contract Amount (ETH)" />
            <button onClick={handleRenewContract}>Renew Contract</button>
          </div>
          <div>
            <input type="number" value={rating} onChange={(e) => setRating(e.target.value)} placeholder="Rating (1-5)" />
            <button onClick={handleGiveFeedback}>Give Feedback</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;

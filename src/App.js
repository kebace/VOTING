import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';

function PollSystemApp() {
    const [walletAddress, setWalletAddress] = useState('');
    const [contract, setContract] = useState(null);

    const [pollData, setPollData] = useState({
        pollId: '',
        question: '',
        optionA: '',
        optionB: ''
    });

    const [voteData, setVoteData] = useState({
        pollId: '',
        selectedOption: ''
    });

    const [pollDetails, setPollDetails] = useState(null);
    const [allPollIds, setAllPollIds] = useState([]);
    const [selectedPollForDetails, setSelectedPollForDetails] = useState('');

    const connectWallet = async () => {
        if (window.ethereum) {
            try {
                const accounts = await window.ethereum.request({
                    method: 'eth_requestAccounts'
                });
                setWalletAddress(accounts[0]);

                const provider = new ethers.BrowserProvider(window.ethereum);
                const signer = await provider.getSigner();

                const contractAddress = '0x4a9C121080f6D9250Fc0143f41B595fD172E31bf';
                const contractABI = [
                    {
                        "inputs": [],
                        "stateMutability": "nonpayable",
                        "type": "constructor"
                    },
                    {
                        "inputs": [
                            {
                                "internalType": "address",
                                "name": "voter",
                                "type": "address"
                            }
                        ],
                        "name": "authorizeSingleVoter",
                        "outputs": [],
                        "stateMutability": "nonpayable",
                        "type": "function"
                    },
                    {
                        "inputs": [
                            {
                                "internalType": "address[]",
                                "name": "voters",
                                "type": "address[]"
                            }
                        ],
                        "name": "authorizeVoters",
                        "outputs": [],
                        "stateMutability": "nonpayable",
                        "type": "function"
                    },
                    {
                        "inputs": [
                            {
                                "internalType": "address",
                                "name": "",
                                "type": "address"
                            }
                        ],
                        "name": "authorizedVoters",
                        "outputs": [
                            {
                                "internalType": "bool",
                                "name": "",
                                "type": "bool"
                            }
                        ],
                        "stateMutability": "view",
                        "type": "function"
                    },
                    {
                        "inputs": [
                            {
                                "internalType": "string",
                                "name": "pollId",
                                "type": "string"
                            },
                            {
                                "internalType": "string",
                                "name": "selectedOption",
                                "type": "string"
                            }
                        ],
                        "name": "castVote",
                        "outputs": [],
                        "stateMutability": "nonpayable",
                        "type": "function"
                    },
                    {
                        "inputs": [
                            {
                                "internalType": "string",
                                "name": "pollId",
                                "type": "string"
                            },
                            {
                                "internalType": "string",
                                "name": "question",
                                "type": "string"
                            },
                            {
                                "internalType": "string",
                                "name": "optionA",
                                "type": "string"
                            },
                            {
                                "internalType": "string",
                                "name": "optionB",
                                "type": "string"
                            }
                        ],
                        "name": "createPoll",
                        "outputs": [],
                        "stateMutability": "nonpayable",
                        "type": "function"
                    },
                    {
                        "inputs": [
                            {
                                "internalType": "string",
                                "name": "pollId",
                                "type": "string"
                            }
                        ],
                        "name": "getPollDetails",
                        "outputs": [
                            {
                                "internalType": "string",
                                "name": "question",
                                "type": "string"
                            },
                            {
                                "internalType": "string",
                                "name": "optionA",
                                "type": "string"
                            },
                            {
                                "internalType": "string",
                                "name": "optionB",
                                "type": "string"
                            },
                            {
                                "internalType": "uint256",
                                "name": "votesA",
                                "type": "uint256"
                            },
                            {
                                "internalType": "uint256",
                                "name": "votesB",
                                "type": "uint256"
                            }
                        ],
                        "stateMutability": "view",
                        "type": "function"
                    },
                    {
                        "inputs": [],
                        "name": "owner",
                        "outputs": [
                            {
                                "internalType": "address",
                                "name": "",
                                "type": "address"
                            }
                        ],
                        "stateMutability": "view",
                        "type": "function"
                    }
                ]; // Your contract ABI

                const pollContract = new ethers.Contract(
                    contractAddress,
                    contractABI,
                    signer
                );

                setContract(pollContract);

                // Fetch all poll IDs after connecting
                const ids = await pollContract.getAllPollIds();
                setAllPollIds(ids);
            } catch (error) {
                console.error(error);
            }
        } else {
            alert('Install MetaMask');
        }
    };

    const createPoll = async () => {
        try {
            const tx = await contract.createPoll(
                pollData.pollId,
                pollData.question,
                pollData.optionA,
                pollData.optionB
            );
            await tx.wait();
            alert('Poll created successfully!');

            // Refresh poll IDs
            const ids = await contract.getAllPollIds();
            setAllPollIds(ids);
        } catch (error) {
            console.error('Error creating poll:', error);
        }
    };

    const castVote = async () => {
        try {
            const tx = await contract.castVote(
                voteData.pollId,
                voteData.selectedOption
            );
            await tx.wait();
            alert('Vote cast successfully!');
        } catch (error) {
            console.error('Error casting vote:', error);
        }
    };

    const fetchPollDetails = async (pollId) => {
        try {
            const details = await contract.getPollDetails(pollId);
            setPollDetails({
                question: details[0],
                optionA: details[1],
                optionB: details[2],
                votesA: details[3].toString(),
                votesB: details[4].toString()
            });
        } catch (error) {
            console.error('Error fetching poll details:', error);
        }
    };

    return (
        <div style={{
            fontFamily: 'Geist Mono, sans-serif',
            maxWidth: '800px',
            margin: '0 auto',
            padding: '20px',
            backgroundColor: '#121212', // Dark background
            borderRadius: '8px',
            boxShadow: '0 4px 6px rgba(255,255,255,0.1)',
            color: '#ffffff' // Light text
        }}>
            <h1 style={{
                textAlign: 'center',
                color: '#bbbbbb',
                marginBottom: '20px'
            }}>
                Ethereum Poll System
            </h1>

            {!walletAddress ? (
                <button
                    onClick={connectWallet}
                    style={{
                        width: '100%',
                        padding: '10px',
                        fontFamily: 'Geist Mono, sans-serif',
                        backgroundColor: '#2E7D32', // Dark green
                        color: 'white',
                        border: 'none',
                        borderRadius: '5px',
                        cursor: 'pointer'
                    }}
                >
                    Connect Wallet
                </button>
            ) : (
                <div>
                    <p style={{
                        marginBottom: '10px',
                        color: '#bbbbbb'
                    }}>
                        Connected: {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
                    </p>

                    {/* Create Poll Section */}
                    <div style={{
                        backgroundColor: '#1E1E1E', // Slightly lighter than black
                        padding: '15px',
                        borderRadius: '8px',
                        marginBottom: '15px',
                        border: '1px solid #333'
                    }}>
                        <h2 style={{color: '#bbbbbb'}}>Create Poll</h2>
                        <input
                            placeholder="Poll ID"
                            value={pollData.pollId}
                            onChange={(e) => setPollData({...pollData, pollId: e.target.value})}
                            style={{
                                width: '100%',
                                padding: '8px',
                                marginBottom: '10px',
                                backgroundColor: '#2C2C2C',
                                color: 'white',
                                border: '1px solid #444',
                                borderRadius: '4px'
                            }}
                        />
                        <input
                            placeholder="Question"
                            value={pollData.question}
                            onChange={(e) => setPollData({...pollData, question: e.target.value})}
                            style={{
                                width: '100%',
                                padding: '8px',
                                marginBottom: '10px',
                                backgroundColor: '#2C2C2C',
                                color: 'white',
                                border: '1px solid #444',
                                borderRadius: '4px'
                            }}
                        />
                        <input
                            placeholder="Option A"
                            value={pollData.optionA}
                            onChange={(e) => setPollData({...pollData, optionA: e.target.value})}
                            style={{
                                width: '100%',
                                padding: '8px',
                                marginBottom: '10px',
                                backgroundColor: '#2C2C2C',
                                color: 'white',
                                border: '1px solid #444',
                                borderRadius: '4px'
                            }}
                        />
                        <input
                            placeholder="Option B"
                            value={pollData.optionB}
                            onChange={(e) => setPollData({...pollData, optionB: e.target.value})}
                            style={{
                                width: '100%',
                                padding: '8px',
                                marginBottom: '10px',
                                backgroundColor: '#2C2C2C',
                                color: 'white',
                                border: '1px solid #444',
                                borderRadius: '4px'
                            }}
                        />
                        <button
                            onClick={createPoll}
                            style={{
                                width: '100%',
                                padding: '10px',
                                fontFamily: 'Geist Mono, sans-serif',
                                backgroundColor: '#1565C0', // Deep blue
                                color: 'white',
                                border: 'none',
                                borderRadius: '5px',
                                cursor: 'pointer'
                            }}
                        >
                            Create Poll
                        </button>
                    </div>

                    {/* Poll List Section */}
                    <div style={{
                        backgroundColor: '#1E1E1E',
                        padding: '15px',
                        borderRadius: '8px',
                        marginBottom: '15px',
                        border: '1px solid #333'
                    }}>
                        <h2 style={{color: '#bbbbbb'}}>Existing Polls</h2>
                        {allPollIds.length === 0 ? (
                            <p style={{color: '#888'}}>No polls created yet</p>
                        ) : (
                            <div style={{
                                maxHeight: '200px',
                                overflowY: 'auto',
                                border: '1px solid #444',
                                borderRadius: '4px',
                                padding: '10px'
                            }}>
                                {allPollIds.map((pollId, index) => (
                                    <div
                                        key={index}
                                        style={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                            padding: '8px',
                                            borderBottom: '1px solid #333',
                                            color: '#bbbbbb'
                                        }}
                                    >
                                        <span>{pollId}</span>
                                        <button
                                            onClick={() => {
                                                setSelectedPollForDetails(pollId);
                                                fetchPollDetails(pollId);
                                            }}
                                            style={{
                                                backgroundColor: '#FF9800',
                                                fontFamily: 'Geist Mono, sans-serif',
                                                color: 'black',
                                                border: 'none',
                                                borderRadius: '4px',
                                                padding: '5px 10px',
                                                cursor: 'pointer'
                                            }}
                                        >
                                            View Details
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Vote Section */}
                    <div style={{
                        backgroundColor: '#1E1E1E',
                        padding: '15px',
                        borderRadius: '8px',
                        marginBottom: '15px',
                        border: '1px solid #333'
                    }}>
                        <h2 style={{color: '#bbbbbb'}}>Cast Vote</h2>
                        <input
                            placeholder="Poll ID"
                            value={voteData.pollId}
                            onChange={(e) => setVoteData({...voteData, pollId: e.target.value})}
                            style={{
                                width: '100%',
                                padding: '8px',
                                marginBottom: '10px',
                                backgroundColor: '#2C2C2C',
                                color: 'white',
                                border: '1px solid #444',
                                borderRadius: '4px'
                            }}
                        />
                        <input
                            placeholder="Selected Option"
                            value={voteData.selectedOption}
                            onChange={(e) => setVoteData({...voteData, selectedOption: e.target.value})}
                            style={{
                                width: '100%',
                                padding: '8px',
                                marginBottom: '10px',
                                backgroundColor: '#2C2C2C',
                                color: 'white',
                                border: '1px solid #444',
                                borderRadius: '4px'
                            }}
                        />
                        <button
                            onClick={castVote}
                            style={{
                                width: '100%',
                                padding: '10px',
                                fontFamily: 'Geist Mono, sans-serif',
                                backgroundColor: '#2E7D32', // Dark green
                                color: 'white',
                                border: 'none',
                                borderRadius: '5px',
                                cursor: 'pointer'
                            }}
                        >
                            Vote
                        </button>
                    </div>

                    {/* Poll Details Section */}
                    {pollDetails && (
                        <div style={{
                            backgroundColor: '#1E1E1E',
                            padding: '15px',
                            borderRadius: '8px',
                            border: '1px solid #333'
                        }}>
                            <h2 style={{color: '#bbbbbb'}}>Poll Results for {selectedPollForDetails}</h2>
                            <p style={{color: '#bbbbbb'}}><strong>Question:</strong> {pollDetails.question}</p>
                            <div style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                marginTop: '10px',
                                color: '#bbbbbb'
                            }}>
                                <span>{pollDetails.optionA}: {pollDetails.votesA} votes</span>
                                <span>{pollDetails.optionB}: {pollDetails.votesB} votes</span>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

export default PollSystemApp;
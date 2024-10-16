"use client";

import React, { useState } from 'react';
import { useAccount, useConnect, useContractRead, useDisconnect, useConfig } from 'wagmi';
import { parseEther } from 'viem';
import { writeContract } from '@wagmi/core';

// Asegúrate de reemplazar esta dirección con la dirección real de tu contrato desplegado
const CONTRACT_ADDRESS = '0xf03D1c6FcdD47EcE6FFf6832c2Cb2e6871452f58' as `0x${string}`;

const VitalikPlace = () => {
  const { address, isConnected } = useAccount();
  const { connect } = useConnect();
  const { disconnect } = useDisconnect();
  const config = useConfig();

  const [nftAddress, setNftAddress] = useState<`0x${string}`>('0xf03D1c6FcdD47EcE6FFf6832c2Cb2e6871452f58');
  const [tokenId, setTokenId] = useState<bigint>(BigInt(0));
  const [price, setPrice] = useState('');

  const { data: nftPrice, refetch: refetchPrice } = useContractRead({
    address: CONTRACT_ADDRESS,
    abi: [{"inputs":[{"internalType":"address","name":"nftAddress","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"getPrice","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"}],
    functionName: 'getPrice',
    args: [nftAddress, tokenId],
  });

  const handleConnect = async () => {
    if (config.connectors[0]) {
      await connect({ connector: config.connectors[0] });
    }
  };

  const handleDisconnect = () => {
    disconnect();
  };

  const handleListNFT = async () => {
    if (!nftAddress || tokenId === undefined || !price) return;
    try {
      await writeContract(config, {
        address: CONTRACT_ADDRESS,
        abi: [{"inputs":[{"internalType":"address","name":"nftAddress","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"},{"internalType":"uint256","name":"price","type":"uint256"}],"name":"listNFT","outputs":[],"stateMutability":"nonpayable","type":"function"}],
        functionName: 'listNFT',
        args: [nftAddress, tokenId, parseEther(price)],
      });
    } catch (error) {
      console.error('Error listing NFT:', error);
    }
  };

  const handleBuyNFT = async () => {
    if (!nftAddress || tokenId === undefined || !nftPrice) return;
    try {
      await writeContract(config, {
        address: CONTRACT_ADDRESS,
        abi: [{"inputs":[{"internalType":"address","name":"nftAddress","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"buyNFT","outputs":[],"stateMutability":"payable","type":"function"}],
        functionName: 'buyNFT',
        args: [nftAddress, tokenId],
        value: nftPrice,
      });
    } catch (error) {
      console.error('Error buying NFT:', error);
    }
  };

  const handleGetPrice = async () => {
    await refetchPrice();
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-xl">
      <h1 className="text-2xl font-bold mb-6">Vitalik Place</h1>
      
      {!isConnected ? (
        <button onClick={handleConnect} className="bg-blue-500 text-white px-4 py-2 rounded">
          Connect Wallet
        </button>
      ) : (
        <div>
          <p className="mb-4">Connected: {address}</p>
          <button onClick={handleDisconnect} className="bg-red-500 text-white px-4 py-2 rounded mb-4">
            Disconnect
          </button>
          
          <div className="mb-4">
            <input
              type="text"
              placeholder="NFT Address"
              value={nftAddress}
              onChange={(e) => setNftAddress(e.target.value as `0x${string}`)}
              className="w-full p-2 border rounded"
            />
          </div>
          <div className="mb-4">
            <input
              type="number"
              placeholder="Token ID"
              value={tokenId.toString()}
              onChange={(e) => setTokenId(BigInt(e.target.value))}
              className="w-full p-2 border rounded"
            />
          </div>
          <div className="mb-4">
            <input
              type="number"
              placeholder="Price (in ETH)"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="w-full p-2 border rounded"
            />
          </div>
          
          <button onClick={handleListNFT} className="bg-green-500 text-white px-4 py-2 rounded mr-2">
            List NFT
          </button>
          <button onClick={handleBuyNFT} className="bg-purple-500 text-white px-4 py-2 rounded mr-2">
            Buy NFT
          </button>
          <button onClick={handleGetPrice} className="bg-yellow-500 text-white px-4 py-2 rounded">
            Get Price
          </button>
          
          {nftPrice && (
            <p className="mt-4">Current Price: {nftPrice.toString()} wei</p>
          )}
        </div>
      )}
    </div>
  );
};

export default VitalikPlace;
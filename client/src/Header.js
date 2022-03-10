import React, { useState } from 'react';
import './styles/Header.css';
import { ethers } from 'ethers';

function Header() {
    const [address, setAddress] = useState('');
    const connectWallet = async() => {
        if (!window.ethereum) console.log("No wallet found.")
        await window.ethereum.send("eth_requestAccounts");
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const addr = await signer.getAddress();
        setAddress(addr.substring(0, 6) + '...' + addr.substring(addr.length - 4));
    }
    return (
        <div className="header-wrapper">
            <h1>BigEye NFT</h1>
            { address ? <p class="address">Connected: {address}</p> : <button class="address" onClick={connectWallet}>Connect Wallet</button> }
        </div>
    )
}

export default Header;
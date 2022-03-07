import { providers } from 'ethers';
import './styles/Header.css';
import { ethers } from 'ethers';

function Header() {
    const connectWallet = async() => {
        if (!window.ethereum) console.log("No wallet found.")
        await window.ethereum.send("eth_requestAccounts");
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        console.log(signer.getAddress());
    }
    return (
        <div className="header-wrapper">
            <h1>BigEye NFT</h1>
            <button onClick={connectWallet}>connect</button>
        </div>
    )
}

export default Header;
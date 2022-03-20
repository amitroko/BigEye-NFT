// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract BigEye is ERC721URIStorage {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;
    mapping(address => bool) minters;
    uint256 mintLimit;
    address owner; // so I can mint as many as I want :)

    // limit minting to one per address
    modifier hasNotMinted {
        require(minters[msg.sender] == false || msg.sender == owner);
        _;
    }

    modifier underLimit {
        require(_tokenIds.current() < mintLimit);
        _;
    }

    constructor(uint256 _mintLimit) ERC721("BigEye", "BEYE") {
        mintLimit = _mintLimit;
    }

    function newItem(address _address, string memory tokenURI) hasNotMinted underLimit public returns (uint256) {
        _tokenIds.increment();
        uint256 newItemId = _tokenIds.current();
        _mint(_address, newItemId);
        _setTokenURI(newItemId, tokenURI);
        return newItemId;
    }
}
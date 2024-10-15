// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

import "forge-std/Test.sol";
import "lib/openzeppelin-contracts/contracts/token/ERC721/ERC721.sol";
import "src/vitalikPlace.sol";

contract MockNFT is ERC721 {
    constructor() ERC721("MockNFT", "MNFT") {}

    function mint(address to, uint256 tokenId) external {
        _mint(to, tokenId);
    }
}

contract VitalikPlaceTest is Test {
    vitalikPlace public marketplace;
    MockNFT public nft;

    address public seller = address(0x1);
    address public buyer = address(0x2);
    address public stranger = address(0x3);

    function setUp() public {
        marketplace = new vitalikPlace();
        nft = new MockNFT();
        nft.mint(seller, 1);

        vm.deal(seller, 10 ether);
        vm.deal(buyer, 10 ether);
        vm.deal(stranger, 10 ether);
    }

    function testCannotListNFTIfNotOwner() public {
        vm.startPrank(stranger);

        vm.expectRevert("You must own the NFT to list it");
        marketplace.listNFT(address(nft), 1, 1 ether);

        vm.stopPrank();
    }

    function testCannotBuyWithInsufficientFunds() public {
        vm.startPrank(seller);
        nft.approve(address(marketplace), 1);
        marketplace.listNFT(address(nft), 1, 2 ether); // Price is set to 2 ether
        vm.stopPrank();

        vm.startPrank(buyer);
        vm.expectRevert("Not enough Ether to cover the asking price");
        marketplace.buyNFT{value: 1 ether}(address(nft), 1); // Only sending 1 ether

        vm.stopPrank();
    }

    function testCannotUpdatePriceIfNotSeller() public {
        vm.startPrank(seller);
        nft.approve(address(marketplace), 1);
        marketplace.listNFT(address(nft), 1, 1 ether);
        vm.stopPrank();

        vm.startPrank(stranger);
        vm.expectRevert("You must be the seller to update the price");
        marketplace.updatePrice(address(nft), 1, 2 ether); // Trying to update the price as a stranger

        vm.stopPrank();
    }
}

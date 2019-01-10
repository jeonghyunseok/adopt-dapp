pragma solidity ^0.4.23;

contract AdoptPet {
    struct Buyer {
        address buyerAddress;
        bytes32 name;
        bytes32 email;
    }

    mapping (uint => Buyer) public buyerInfo;
    address public owner;
    address[12] public buyers;

    event LogBuyAdoptPet(
        address _buyer,
        uint _id
    );

    constructor() public {
        owner = msg.sender;
    }

    function buyAdoptPet(uint _id, bytes32 _name, bytes32 _email) public payable {
        require(_id >= 0 && _id <= 12);
        buyers[_id] = msg.sender;
        buyerInfo[_id] = Buyer(msg.sender, _name, _email);

        owner.transfer(msg.value);
        emit LogBuyAdoptPet(msg.sender, _id);
    }

    function getBuyerInfo(uint _id) public view returns (address, bytes32, bytes32) {
        Buyer memory buyer = buyerInfo[_id];
        return (buyer.buyerAddress, buyer.name, buyer.email);
    }

    function getAllBuyers() public view returns (address[12]) {
        return buyers;
    }
}

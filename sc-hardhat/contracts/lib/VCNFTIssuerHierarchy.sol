// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

// inheritance
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";

// libs
import "@openzeppelin/contracts/utils/structs/EnumerableSet.sol";

abstract contract VCNFTIssuerHierarchy is Initializable, OwnableUpgradeable {
    using EnumerableSet for EnumerableSet.AddressSet;

    uint256 internal constant _ISSUER_STATUS_NULL = 0;
    uint256 internal constant _ISSUER_STATUS_ACTIVE = 1;
    uint256 internal constant _ISSUER_STATUS_DISABLED = 2;
    uint256 internal constant _ISSUER_STATUS_PARENT_DISABLED = 3;

    struct IssuerNode {
        address wallet;
        uint256 status;
        address parent;
        address[] children;
    }

    mapping(address => IssuerNode) internal _issuers;
    EnumerableSet.AddressSet _issuerSet;
    mapping(uint256 => address) public tokenIssuer;

    event AddChildIssuer(address indexed parent, address indexed child);
    event SetIssuerStatus(address indexed sender, address indexed issuer, uint256 status);
    
    //
    // constructor
    //

    function __VCNFTIssuerHierarchy_init(address initialIssuer_) internal initializer {
        _issuers[address(0)] = IssuerNode({
            wallet: address(0),
            status: _ISSUER_STATUS_ACTIVE,
            parent: address(0),
            children: new address[](0)
        });

        _addChildIssuer(address(0), initialIssuer_);
    }

    //
    // external write methods
    //

    function setIssuerStatus(address issuer_, uint256 status_) external {
        require(msg.sender == _issuers[issuer_].parent || msg.sender == owner(), "VCNFTIssuerHierarchy: only for parent or owner");
        require(status_ == _ISSUER_STATUS_ACTIVE || status_ == _ISSUER_STATUS_DISABLED, "VCNFTIssuerHierarchy: invalid status");

        _issuers[issuer_].status = status_;

        emit SetIssuerStatus({
            sender: msg.sender,
            issuer: issuer_,
            status: status_ 
        });
    }

    function addChildIssuer(address child_) external {
        _addChildIssuer(msg.sender, child_);
    }

    function _addChildIssuer(address parent_, address child_) internal {
        require(_issuers[parent_].status == _ISSUER_STATUS_ACTIVE, "VCNFTIssuerHierarchy: only for active issuers");
        require(_issuers[child_].status == _ISSUER_STATUS_NULL, "VCNFTIssuerHierarchy: child issuer already exists");
        assert(_issuers[child_].parent == address(0));
        assert(_issuers[child_].children.length == 0);

        _issuers[child_] = IssuerNode({
            wallet: child_,
            status: _ISSUER_STATUS_ACTIVE,
            parent: parent_,
            children: new address[](0)
        });
        _issuerSet.add(child_);

        _issuers[parent_].children.push(child_);

        emit AddChildIssuer({
            parent: parent_,
            child: child_
        });
    }

    function getActualIssuerNode(address issuer_) public view returns (IssuerNode memory) {
        return _issuers[issuer_];
    }

    function calculateIssuerStatus(address issuer_) public view returns (uint256) {
        address currentIssuer = issuer_;
        uint256 calculatedStatus = _issuers[currentIssuer].status;

        if (calculatedStatus != _ISSUER_STATUS_ACTIVE) {
            return calculatedStatus;
        }

        // TODO refactor this
        currentIssuer = _issuers[currentIssuer].parent;
        while (currentIssuer != address(0)) {
            IssuerNode storage node = _issuers[currentIssuer];
            
            if (node.status == _ISSUER_STATUS_DISABLED) {
                return _ISSUER_STATUS_PARENT_DISABLED;
            }
            
            currentIssuer = node.parent;
        }

        return calculatedStatus;
    }

    function checkAccess(address issuer_) public view returns (bool) {
        address currentIssuer = issuer_;

        while (currentIssuer != address(0)) {
            IssuerNode storage node = _issuers[currentIssuer];
            
            if (node.status != _ISSUER_STATUS_ACTIVE) {
                return false;
            }
            
            currentIssuer = node.parent;
        }

        return true;
    }


    function isActiveIssuer(address account_) public view returns (bool) {
        return calculateIssuerStatus(account_) == _ISSUER_STATUS_ACTIVE;
    }

    function fetchIssuers(uint256 cursor_, uint256 howMany_) external view returns (IssuerNode[] memory values, uint256 newCursor) {

        (address[] memory addresses, uint256 newPaginationCursor) = _fetchWithPagination(_issuerSet, cursor_, howMany_);

        values = new IssuerNode[](addresses.length);
        for (uint256 i = 0; i < addresses.length; i++) {
            values[i] = _issuers[addresses[i]];
        }
        return (values, newPaginationCursor);
    }

    function _fetchWithPagination(
        EnumerableSet.AddressSet storage set,
        uint256 cursor,
        uint256 howMany
    ) internal view returns (address[] memory values, uint256 newCursor) {
        uint256 length = howMany;

        // TODO: if cursor currently at the end of the set, return empty array
        if (length > set.length() - cursor) {
            length = set.length() - cursor;
        }

        values = new address[](length);
        for (uint256 i = 0; i < length; i++) {
            values[i] = set.at(cursor + i);
        }

        return (values, cursor + length);
    }

    uint256[49] private __gap;

}
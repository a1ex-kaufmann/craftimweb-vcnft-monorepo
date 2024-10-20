// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.20;

// solhint-disable no-empty-blocks, func-name-mixedcase

// inheritance
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/utils/ReentrancyGuardUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC721/ERC721Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC721/extensions/ERC721EnumerableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC721/extensions/ERC721URIStorageUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/cryptography/EIP712Upgradeable.sol";
import "./lib/VCNFTIssuerHierarchy.sol";
import "./lib/VCNFTAccountFactory.sol";
import "./lib/VCNFTMerkleTreeVerifier.sol";

// libs
import "@openzeppelin/contracts/utils/Address.sol";
import "@openzeppelin/contracts/utils/cryptography/SignatureChecker.sol";

contract VCNFTCore is
    Initializable,
    ReentrancyGuardUpgradeable,
    OwnableUpgradeable,
    ERC721Upgradeable,
    ERC721EnumerableUpgradeable,
    ERC721URIStorageUpgradeable,
    EIP712Upgradeable,
    VCNFTIssuerHierarchy,
    VCNFTAccountFactory,
    VCNFTMerkleTreeVerifier
{
    using Address for address payable;

    // solhint-disable-next-line var-name-mixedcase
    bytes32 public constant MINT_TYPEHASH =
        keccak256(
            "Mint(address issuer,address target,bytes32 merkleRoot,uint256 nonce)"
        );

    mapping(uint256 => bool) public nonces;
    mapping(uint256 => bool) public isRevoked;
    mapping(uint256 => bytes32) public tokenMerkleRoot;

    // NOTE: true value disables NFT movement
    bool public sbtMode;

    event Mint(
        address indexed sender,
        address issuer,
        address target,
        bytes32 merkleRoot,
        uint256 nonce,
        bytes signature,
        uint256 tokenId
    );
    event SetSBTmode(address indexed sender, bool value);
    event RevokeToken(address indexed sender, uint256 tokenId);

    //
    // proxy constructor
    //

    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() {
        _disableInitializers();
    }

    function initialize(
        string memory name_,
        string memory symbol_,
        address initialOwner_,
        address simpleAccountImplementation_,
        bool sbtMode_
    ) external initializer {
        __VCNFTCore_init(name_, symbol_, initialOwner_, simpleAccountImplementation_, sbtMode_);
    }

    function __VCNFTCore_init(
        string memory name_,
        string memory symbol_,
        address initialOwner_,
        address simpleAccountImplementation_,
        bool sbtMode_
    ) internal onlyInitializing {
        __ERC721_init_unchained(name_, symbol_);
        __ERC721Enumerable_init_unchained();
        __ERC721URIStorage_init_unchained();
        __EIP712_init_unchained(name_, "1");
        __Ownable_init_unchained(initialOwner_);

        VCNFTIssuerHierarchy.__VCNFTIssuerHierarchy_init(initialOwner_);
        VCNFTAccountFactory.__VCNFTAccountFactory_init(simpleAccountImplementation_);
        VCNFTMerkleTreeVerifier.__VCNFTMerkleTreeVerifier_init();

        sbtMode = sbtMode_;
    }

    //
    // external methods
    //

    function mint(
        address issuer_,
        address target_,
        bytes32 merkleRoot_,
        uint256 nonce_,
        bytes memory signature_
    ) external payable virtual {
        require(!nonces[nonce_], "VCNFTCore: nonce already used");
        require(!isRevoked[nonce_], "VCNFTCore: token revoked");

        bytes32 structHash = keccak256(
            abi.encode(
                MINT_TYPEHASH,
                issuer_,
                target_,
                merkleRoot_,
                nonce_
            )
        );

        bytes32 digest = _hashTypedDataV4(structHash);

        // only for hackaton demo
        // require(
        //     SignatureChecker.isValidSignatureNow(issuer_, digest, signature_),
        //     "VCNFTCore: invalid signature"
        // );

        nonces[nonce_] = true;

        uint256 tokenId = _deploySimpleAccount(keccak256(abi.encodePacked(msg.sender, block.timestamp)));
        tokenIssuer[tokenId] = issuer_;

        _mint(target_, tokenId);
        _setTokenURI(tokenId, "ipfs://Qmc4rUw5WRwpMJdP2u5dazD5Cs53QqeStcpJB6KNVGQbB2");
        tokenMerkleRoot[tokenId] = merkleRoot_;

        emit Mint({
            sender: _msgSender(),
            issuer: issuer_,
            target: target_,
            merkleRoot: merkleRoot_,
            nonce: nonce_,
            signature: signature_,
            tokenId: tokenId
        });
    }

    function tokenIsValid(uint256 tokenId_) external view virtual returns (bool) {
        // only for demo
        // return _exists(tokenId_) && !isRevoked[tokenId_] && calculateIssuerStatus(tokenIssuer[tokenId_]) == 1;
        return true;
    }

    function revokeToken(uint256 tokenId_) external virtual {
        isRevoked[tokenId_] = true;

        emit RevokeToken({sender: _msgSender(), tokenId: tokenId_});
    }

    function setSBTmode(bool value) external virtual onlyOwner {
        sbtMode = value;

        emit SetSBTmode({sender: _msgSender(), value: value});
    }

    function exists(uint256 tokenId_) external view virtual returns (bool) {
        return _exists(tokenId_);
    }

    //
    // public methods
    //

    function tokenURI(
        uint256 tokenId_
    )
        public
        view
        virtual
        override(ERC721Upgradeable, ERC721URIStorageUpgradeable)
        returns (string memory)
    {
        return super.tokenURI(tokenId_);
    }

    function supportsInterface(
        bytes4 interfaceId
    ) public view override(ERC721Upgradeable, ERC721URIStorageUpgradeable, ERC721EnumerableUpgradeable) returns (bool) {
        return super.supportsInterface(interfaceId);
    }

    //
    // internal methods
    //

    function _update(address to, uint256 tokenId, address auth) internal override(ERC721EnumerableUpgradeable, ERC721Upgradeable) returns (address) {
        super._update(to, tokenId, auth);
    }

    function _increaseBalance(address account, uint128 value) internal override(ERC721EnumerableUpgradeable, ERC721Upgradeable) {
        super._increaseBalance(account, value);
    }

    function _exists(uint256 tokenId_) internal view returns(bool) {
        return ownerOf(tokenId_) == address(0);
    }

    uint256[50] private __gap;
}

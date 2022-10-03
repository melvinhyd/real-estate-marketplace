pragma solidity >=0.4.21 <0.6.0;

// TODO define a contract call to the zokrates generated solidity contract <Verifier> or <renamedVerifier>
import "./ERC721Mintable.sol";
import "./verifier.sol";

// TODO define another contract named SolnSquareVerifier that inherits from your ERC721Mintable class
contract SolnSquareVerifier is MyERC721Token {

    Verifier verifier;

    // TODO define a solutions struct that can hold an index & an address
    struct solution {
        uint256 id;
        address account;
    }


    // TODO define a mapping to store unique solutions submitted
    mapping(bytes32 => solution) private solutions;


    // TODO Create an event to emit when a solution is added
    event SolutionAdded(uint256 id, address account);

    constructor(address contractAddrs) public {
        verifier = Verifier(contractAddrs);
    }


    // TODO Create a function to add the solutions to the array and emit the event
    function addSolution(address account, uint256 id, uint[2] memory a, uint[2][2] memory b, uint[2] memory c, uint[2] memory input) public {
        bytes32 solHash = _generateSolutionsHash(a,b,c, input);
        _addedSolution(account, id, solHash);
    }


    // TODO Create a function to mint new NFT only after the solution has been verified
    //  - make sure the solution is unique (has not been used before)
    //  - make sure you handle metadata as well as tokenSuplly
    function mintNewNFT(address account, uint256 id, uint[2] memory a, uint[2][2] memory b, uint[2] memory c, uint[2] memory input) public returns(bool) {
        require(verifier.verifyTx(a,b,c, input), "zokrates proof could not be verified");
        bytes32 solutionHash = _generateSolutionsHash(a,b,c, input);
        require(solutions[solutionHash].account == address(0), "Solution is already in use.");
        _addedSolution(account, id, solutionHash);
        return mint(account, id, "verifurl");
    }

    function _generateSolutionsHash(uint[2] memory a, uint[2][2] memory b, uint[2] memory c, uint[2] memory input) private pure returns(bytes32) {
        return keccak256(abi.encodePacked(a, b, c, input));
    }

    function _addedSolution(address account, uint256 id, bytes32 solutionHash) private {
        solutions[solutionHash] = solution({id: id, account: account});
        emit SolutionAdded(id, account);
    }


}


  



























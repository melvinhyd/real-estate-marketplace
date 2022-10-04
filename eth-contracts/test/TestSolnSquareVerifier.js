var SolnSquareVerifier = artifacts.require('./SolnSquareVerifier.sol');
var Verifier = artifacts.require('Verifier');
const zokratesProof = require("../../zokrates/code/square/proof.json");
const truffleAssert = require('truffle-assertions');

contract("TestSolnSquareVerifier", accounts => {
    const account_one = accounts[0];
    const account_two = accounts[1];
    const tokenId = 1;

    describe('test solnsquareverifier', function () {
        beforeEach(async function() {
            let verifierContract = await Verifier.new({from: account_one});
            this.contract = await SolnSquareVerifier.new(verifierContract.address, {from: account_one});
        })

        // Test if a new solution can be added for contract - SolnSquareVerifier
        it("new solution can be added for contract", async function() {

            let result = await this.contract.addSolution(account_two, tokenId, ...Object.values(zokratesProof.proof), zokratesProof.inputs, {from: account_two});
            
            truffleAssert.eventEmitted(result, "SolutionAdded", (event) => {
                return event.id == tokenId && event.account == account_two
            });
        })

        // Test if an ERC721 token can be minted for contract - SolnSquareVerifier
        it("ERC721 can be minted for contract", async function() {
            let result = false;
            try {
                result = await this.contract.mintNewNFT.call(account_two, tokenId, ...Object.values(zokratesProof.proof), zokratesProof.inputs, {from: account_one});
            } catch(e) {
                console.log(e);
                result = false;
            }
            assert.equal(result, true);
        })
    });
})



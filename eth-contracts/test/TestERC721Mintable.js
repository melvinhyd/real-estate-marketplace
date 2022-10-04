var ERC721MintableComplete = artifacts.require('MyERC721Token');

contract('TestERC721Mintable', accounts => {

    const account_one = accounts[0];
    const account_two = accounts[1];
    const account_three = accounts[2];

    describe('match erc721 spec', function () {
        beforeEach(async function () { 
            this.contract = await ERC721MintableComplete.new({from: account_one});
            let token1 = 1;
            let token2 = 2;

            // TODO: mint multiple tokens
            await this.contract.mint(account_two, token1, 'uri1', {from: account_one});
            await this.contract.mint(account_three, token2, 'uri2', {from: account_one});
        })

        it('should return total supply', async function () { 
            let totalSupply = await this.contract.totalSupply();
            assert.equal(totalSupply, 2);
        })

        it('should get token balance', async function () { 
            let bal = await this.contract.balanceOf(account_two);
            assert.equal(bal, 1);
        })

        // token uri should be complete i.e: https://s3-us-west-2.amazonaws.com/udacity-blockchain/capstone/1
        it('should return token uri', async function () { 
            let tokenId = 1;
            let tokenURI = await this.contract.tokenURI(tokenId);
            assert.equal(tokenURI, ("https://s3-us-west-2.amazonaws.com/udacity-blockchain/capstone/" + tokenId));
        })

        it('should transfer token from one owner to another', async function () { 
            let tokenId = 1;
            let mainOwner = await this.contract.ownerOf(tokenId);

            await this.contract.transferFrom(mainOwner, account_three, tokenId, {from: mainOwner});

            let newOwner = await this.contract.ownerOf(tokenId);
            assert.equal(newOwner, account_three, "Incorrect new owner.");
        })
    });

    describe('have ownership properties', function () {
        beforeEach(async function () { 
            this.contract = await ERC721MintableComplete.new({from: account_one});
        })

        it('should fail when minting when address is not contract owner', async function () { 
            let reason;
            try {
                await this.contract.mint(account_three, 11, "baseTokenURI", {from: account_two});
            } catch(exception) {
                reason = exception.data.stack;
            }
            assert.include(reason, "Caller is not the contract owner");
        })

        it('should return contract owner', async function () { 
            let owner = await this.contract.owner();
            console.log(owner);
            assert.equal(owner, account_one);
        })

    });
})
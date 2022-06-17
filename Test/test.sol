// SPDX-License-Identifier: GPL-3.0
        
pragma solidity >=0.8.10;

// This import is automatically injected by Remix
import "remix_tests.sol"; 

// This import is required to use custom transaction context
// Although it may fail compilation in 'Solidity Compiler' plugin
// But it will work fine in 'Solidity Unit Testing' plugin
import "remix_accounts.sol";
import "../contracts/ERC20ADROP.sol";

// File name has to end with '_test.sol', this file can contain more than one testSuite contracts
contract testSuite {

    ERC20ADROP foo;
    /// 'beforeAll' runs before all other tests
    /// More special functions are: 'beforeEach', 'beforeAll', 'afterEach' & 'afterAll'
    function beforeAll() public {
        // <instantiate contract>
         foo = new ERC20ADROP();
        
    }

     function checkIfAccountProcessed() public {
        foo.addAddressForAirDrop(TestsAccounts.getAccount(1),10);
        foo.claimToken(TestsAccounts.getAccount(1),10);
        Assert.equal(foo.getProcessedAirdrop(TestsAccounts.getAccount(1)), true, "Token processed");
    }

    function checkUserisWhitelisted() public {
        try foo.claimToken(TestsAccounts.getAccount(2),100){
            Assert.ok(true,"OK");
        }
        catch Error( string memory reason){
            Assert.equal(reason, "This address is not eligible for the airdrop", "User Ineligibe");
        }
        
    }

    function checkIfClaimGreaterThanAllocated() public {
        foo.addAddressForAirDrop(TestsAccounts.getAccount(2),10);
        try foo.claimToken(TestsAccounts.getAccount(2),100){
            Assert.ok(true,"OK");
        }
        catch Error( string memory reason){
            Assert.equal(reason, "Insufficient Token Allocation", "Insufficient Token Allocation");
        }
        
    }

}
    
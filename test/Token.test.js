import { tokens, EVM_revert } from '../src/helpers';
const Token = artifacts.require('./Token')

require('chai')
    .use(require('chai-as-promised'))
    .should()

contract('Token', ([deployer, receiver]) => { // or 'accounts'
    let token
    const name = 'Pabs Token'
    const symbol = 'PBS'
    const decimals = '18'
    const totalSupply = tokens(1000000) // one million

    beforeEach(async () => {
        token = await Token.new()
    })

    describe('deployment', () => {

        it('tracks the name', async() => {
            // Token name should be 'Pabs'
            const result = await token.name()
            result.should.equal(name)
        })

        it('tracks the symbol', async() => {
            const result = await token.symbol()
            result.should.equal(symbol)
        })
        
        it('tracks the decimals', async() => {
            const result = await token.decimals()
            result.toString().should.equal(decimals)
        })

        it('tracks the total supply', async() => {
            const result = await token.totalSupply()
            result.toString().should.equal(totalSupply)
        })

        it('asigns the total supply to the deployer', async() => {
            const result = await token.balanceOf(deployer)
            result.toString().should.equal(totalSupply)
        })
    })

    describe('sending tokens', () => {
        let amount, result;

        describe('success', () => {
            beforeEach(async () => {
                amount = tokens(100)
                result = await token.transfer(receiver, amount, { from: deployer })
            })
    
            it('transfers token balances', async() => {
                let balanceOf;
                // After
                balanceOf = await token.balanceOf(deployer)
                balanceOf.toString().should.equal(tokens(999900))
                balanceOf = await token.balanceOf(receiver)
                balanceOf.toString().should.equal(amount)
            })
            it('emit transfer event', async() => {
                const log = result.logs[0];
                log.event.should.eq('Transfer')
                const event = log.args;
                event.from.toString().should.eq(deployer, 'from is correct')
                event.to.toString().should.eq(receiver, 'to is correct')
                event.value.toString().should.eq(amount, 'amount is correct')
            })
        })
        describe('failure', () => {
            it('rejects insufficient balances', async() => {
                let invalidAmount;
                invalidAmount = tokens(100000000) // greater than total Supply
                await token.transfer(receiver, invalidAmount, { from: deployer }).should.be.rejectedWith(EVM_revert);
                invalidAmount = tokens(10) // greater than total Supply
                await token.transfer(deployer, invalidAmount, { from: receiver }).should.be.rejectedWith(EVM_revert);
            })

            it('rejects invalid recipients', async() => {
                await token.transfer(0x0, amount, { from: deployer }).should.be.rejected;
            })
        })
    })
})
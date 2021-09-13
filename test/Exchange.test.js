import { tokens, ether, EVM_revert, ETHER_ADDRESS } from "../src/helpers";
const Exchange = artifacts.require("./Exchange");
const Token = artifacts.require("./Token");

require("chai").use(require("chai-as-promised")).should();

contract("Exchange", ([deployer, feeAccount, user1]) => {
  // or 'accounts'
  let token, exchange;
  let feePercent = "10";
  let amount = tokens(10);

  beforeEach(async () => {
    // Deploy token - give user1 tokens to play with - create exchange contract
    token = await Token.new();
    token.transfer(user1, tokens(100), { from: deployer });
    exchange = await Exchange.new(feeAccount, feePercent);
  });

  describe("deployment", () => {
    it("tracks the fee account", async () => {
      const result = await exchange.feeAccount();
      result.should.equal(feeAccount);
    });

    it("tracks the fee amount", async () => {
      const result = await exchange.feePercent();
      result.toString().should.equal(feePercent);
    });
  });

  describe('fallback', () => {
      it('reverts when Ether is sent', async() => {
          await exchange.sendTransaction({ value: 1, from: user1 }).should.be.rejectedWith(EVM_revert);
      })
  })

  describe("depositing Ether", () => {
    let result, amount;

    beforeEach(async () => {
        amount = ether(1)
        result = await exchange.depositEther({ from: user1, value: amount });
    });

    it("tracks the Ether deposit", async () => {
        const balance = await exchange.tokens(ETHER_ADDRESS, user1);
        balance.toString().should.equal(amount);
    });

    it("emit deposit event", async () => {
        const log = result.logs[0];
        log.event.should.eq("Deposit");
        const event = log.args;
        event.token
          .toString()
          .should.eq(ETHER_ADDRESS, "Ether address is correct");
        event.user.toString().should.eq(user1, "user address is correct");
        event.amount.toString().should.eq(amount, "deposit amount is correct");
        event.balance.toString().should.eq(amount, "user balance is correct");
    });
  });

  describe("depositing tokens", () => {
    let result;
    describe("success", () => {
      beforeEach(async () => {
        await token.approve(exchange.address, amount, { from: user1 });
        result = await exchange.depositToken(token.address, amount, {
          from: user1,
        });
      });

      it("tracks the token deposit", async () => {
        let balance;
        balance = await token.balanceOf(exchange.address);
        balance.toString().should.equal(amount);
        balance = await exchange.tokens(token.address, user1);
        balance.toString().should.equal(amount);
      });

      it("emit deposit event", async () => {
        const log = result.logs[0];
        log.event.should.eq("Deposit");
        const event = log.args;
        event.token
          .toString()
          .should.eq(token.address, "token address is correct");
        event.user.toString().should.eq(user1, "user address is correct");
        event.amount.toString().should.eq(amount, "deposit amount is correct");
        event.balance.toString().should.eq(amount, "user balance is correct");
      });
    });

    describe("failure", () => {
      it("rejects Ether deposits", async () => {
        await exchange
          .depositToken(ETHER_ADDRESS, amount, { from: user1 })
          .should.be.rejectedWith(EVM_revert);
      });

      it("fails when no tokens are approved", async () => {
        // Don't approve any tokens before depositing
        await exchange
          .depositToken(token.address, amount, { from: user1 })
          .should.be.rejectedWith(EVM_revert);
      });
    });
  });
});

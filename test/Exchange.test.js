import { tokens, ether, EVM_revert, ETHER_ADDRESS } from "../src/helpers";
const Exchange = artifacts.require("./Exchange");
const Token = artifacts.require("./Token");

require("chai").use(require("chai-as-promised")).should();

contract("Exchange", ([deployer, feeAccount, user1, user2]) => {
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

  describe('deployment', () => {
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

  describe('depositing Ether', () => {
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

  describe('withdraw Ether', () => {
    let result, amount;

    beforeEach(async () => {
        amount = ether(1)
        result = await exchange.depositEther({ from: user1, value: amount });
    });

    describe('success', () => {
      beforeEach(async () => {
        // Withdraw Ether
        result = await exchange.withdrawEther(amount, { from: user1 });
      });

      it('withdraws Ether funds', async() => {
        const balance = await exchange.tokens(ETHER_ADDRESS, user1);
        balance.toString().should.eq('0');
      })

      it('emits a withdraw event', async() => {
        const log = result.logs[0];
        log.event.should.eq("Withdraw");
        const event = log.args;
        event.token
        .toString()
        .should.eq(ETHER_ADDRESS, "Ether address is correct");
        event.user.toString().should.eq(user1, "user address is correct");
        event.amount.toString().should.eq(amount, "withdraw ether amount is correct");
        event.balance.toString().should.eq('0', "user balance is correct");
      })
    })

    describe('failure', () => {
      it('rejects withdraws for insufficient balances', async() => {
        await exchange.withdrawEther(ether(100), { from: user1 }).should.be.rejectedWith(EVM_revert);
      })
    })
  });

  describe('depositing tokens', () => {
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

  describe('withdraw Tokens', () => {
    let result, amount;

    describe('success', () => {
      beforeEach(async () => {
        // Deposit tokens first
        amount = tokens(10)
        await token.approve(exchange.address, amount, { from: user1 });
        result = await exchange.depositToken(token.address, amount, { from: user1 });
        // Withdraw Tokens
        result = await exchange.withdrawToken(token.address, amount, { from: user1 });
      });

      it('withdraws Token funds', async() => {
        const balance = await exchange.tokens(token.address, user1);
        balance.toString().should.eq('0');
      })

      it('emits a "withdraw" event', async() => {
        const log = result.logs[0];
        log.event.should.eq("Withdraw");
        const event = log.args;
        event.token
        .toString()
        .should.eq(token.address, "Token address is correct");
        event.user.toString().should.eq(user1, "user address is correct");
        event.amount.toString().should.eq(amount, "withdraw Token amount is correct");
        event.balance.toString().should.eq('0', "user balance is correct");
      })
    })

    describe('failure', () => {
      beforeEach(async () => {
        // Deposit tokens first
        amount = ether(1)
        result = await exchange.depositEther({ from: user1, value: amount });
      });
      it('rejects Ether withdraws', async() => {
        await exchange.withdrawToken(ETHER_ADDRESS, amount, { from: user1 }).should.be.rejectedWith(EVM_revert);
      })
    })

    describe('checking balances', () => {
      let amount = ether(1);
      beforeEach(async() => {
        exchange.depositEther({ from: user1, value: amount });
      })
      it('returns user balance', async() => {
        const result = await exchange.balanceOf(ETHER_ADDRESS, user1);
        result.toString().should.eq(amount);
      })
    })
  });

  describe('making orders', () => {
    let result;

    beforeEach(async() => {
      result = await exchange.makeOrder(token.address, tokens(1), ETHER_ADDRESS, ether(1), { from: user1 });
    })

    it('tracks the newly created order', async() => {
      const orderCount = await exchange.orderCount();
      orderCount.toString().should.eq('1');
      const order = await exchange.orders('1');
      order.id.toString().should.eq('1', 'id is correct')
      order.user.should.eq(user1, 'user is correct')
      order.tokenGet.should.eq(token.address, 'token to get is correct')
      order.amountGet.toString().should.eq(tokens(1), 'amount to get is correct')
      order.tokenGive.should.eq(ETHER_ADDRESS, 'Ether to give is correct')
      order.amountGive.toString().should.eq(ether(1), 'amount to give is correct')
      order.timestamp.toString().length.should.be.at.least(1, 'timestamp is present')
    })

    it('emits a "Order" event', async() => {
      const log = result.logs[0];
      log.event.should.eq("Order");
      const event = log.args;
      event.id
      .toString()
      .should.eq('1', "id  is correct");
      event.user.should.eq(user1, 'user is correct')
      event.tokenGet.should.eq(token.address, 'token to get is correct')
      event.amountGet.toString().should.eq(tokens(1), 'amount to get is correct')
      event.tokenGive.should.eq(ETHER_ADDRESS, 'Ether to give is correct')
      event.amountGive.toString().should.eq(ether(1), 'amount to give is correct')
      event.timestamp.toString().length.should.be.at.least(1, 'timestamp is present')
    })
  })

  describe('order actions', () => {
    beforeEach(async() => {
      // user 1 deposits 1 ether
      await exchange.depositEther({ from: user1, value: ether(1) });
      // user 1 make an order to buy tokens with ether
      await exchange.makeOrder(token.address, tokens(1), ETHER_ADDRESS, ether(1), { from: user1 });
    })

    describe('cancelling orders', () => {
      let result;

      describe('success', () => {
        beforeEach(async() => {
          result = await exchange.cancelOrder('1', { from: user1 })
        })

        it('updates cancelled orders', async() => {
          const orderCancelled = await exchange.orderCancelled('1');
          orderCancelled.should.eq(true);
        })

        it('emits a "Cancel" event', async() => {
          const log = result.logs[0];
          log.event.should.eq("Cancel");
          const event = log.args;
          event.id
          .toString()
          .should.eq('1', "id  is correct");
          event.user.should.eq(user1, 'user is correct')
          event.tokenGet.should.eq(token.address, 'token to get is correct')
          event.amountGet.toString().should.eq(tokens(1), 'amount to get is correct')
          event.tokenGive.should.eq(ETHER_ADDRESS, 'Ether to give is correct')
          event.amountGive.toString().should.eq(ether(1), 'amount to give is correct')
          event.timestamp.toString().length.should.be.at.least(1, 'timestamp is present')
        })
      })

      describe('failure', () => {

        it('rejects invalid order ids', async() => {
          const invalidOrderId = 9999;
          await exchange.cancelOrder(invalidOrderId, { from: user1 }).should.be.rejectedWith(EVM_revert);
        })

        it('rejects unauthorized cancelations', async() => {
          // Try to cancel another user's order.
          await exchange.cancelOrder('1', { from: user2 }).should.be.rejectedWith(EVM_revert);
        })
      })
    })

  })
});

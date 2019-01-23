//import 'babel-polyfill';
const StarNotary = artifacts.require('./starNotary.sol')

let instance;
let accounts;

contract('StarNotary', async (accs) => {
    accounts = accs;
    instance = await StarNotary.deployed();
  });

  it('can Create a Star', async() => {
    let tokenId = 1;
    await instance.createStar('Awesome Star!', tokenId, {from: accounts[0]})

    assert.equal(await instance.tokenIdToStarInfo.call(tokenId), 'Awesome Star!')
  });



  it('lets user1 put up their star for sale', async() => {
    let user1 = accounts[1]
    let starId = 2;
    let starPrice = web3.toWei(.01, "ether")
    await instance.createStar('awesome star', starId, {from: user1})
    await instance.putStarUpForSale(starId, starPrice, {from: user1})
    assert.equal(await instance.starsForSale.call(starId), starPrice)
  });

  it('lets user1 get the funds after the sale', async() => {
    let user1 = accounts[1]
    let user2 = accounts[2]
    let starId = 3
    let starPrice = web3.toWei(.01, "ether")
    await instance.createStar('awesome star', starId, {from: user1})
    await instance.putStarUpForSale(starId, starPrice, {from: user1})
    let balanceOfUser1BeforeTransaction = web3.eth.getBalance(user1)
    await instance.buyStar(starId, {from: user2, value: starPrice})
    let balanceOfUser1AfterTransaction = web3.eth.getBalance(user1)
    assert.equal(balanceOfUser1BeforeTransaction.add(starPrice).toNumber(), balanceOfUser1AfterTransaction.toNumber());
  });

  it('lets user2 buy a star, if it is put up for sale', async() => {
    let user1 = accounts[1]
    let user2 = accounts[2]
    let starId = 4
    let starPrice = web3.toWei(.01, "ether")
    await instance.createStar('awesome star', starId, {from: user1})
    await instance.putStarUpForSale(starId, starPrice, {from: user1})
    let balanceOfUser1BeforeTransaction = web3.eth.getBalance(user2)
    await instance.buyStar(starId, {from: user2, value: starPrice});
    assert.equal(await instance.ownerOf.call(starId), user2);
  });

  it('lets user2 buy a star and decreases its balance in ether', async() => {
    let user1 = accounts[1]
    let user2 = accounts[2]
    let starId = 5
    let starPrice = web3.toWei(.01, "ether")
    await instance.createStar('awesome star', starId, {from: user1})
    await instance.putStarUpForSale(starId, starPrice, {from: user1})
    let balanceOfUser1BeforeTransaction = web3.eth.getBalance(user2)
    const balanceOfUser2BeforeTransaction = web3.eth.getBalance(user2)
    await instance.buyStar(starId, {from: user2, value: starPrice, gasPrice:0})
    const balanceAfterUser2BuysStar = web3.eth.getBalance(user2)
    assert.equal(balanceOfUser2BeforeTransaction.sub(balanceAfterUser2BuysStar), starPrice);
  });

  // Write Tests for:
    it('can Lookup a Star', async() => {
        let tokenId = 6;
        await instance.createStar('Awesome Star!', tokenId, {from: accounts[0]});
        const result = await instance.lookUptokenIdToStarInfo.call(tokenId);
        assert.equal(result, 'Awesome Star!')
    });
// 1) The token name and token symbol are added properly.

    it('The token name and token symbol are added properly', async() => {
        const name = await instance.name();
        const symbol = await instance.symbol();
        assert.equal(name, 'StarsMarket')
        assert.equal(symbol, 'STM')
    });
// 2) 2 users can exchange their stars.
  it('2 users can exchange their stars', async() => {
      let user1 = accounts[1]
      let user2 = accounts[2]
      let starId1 = 7
      let starId2 = 8

      await instance.createStar('user1 star', starId1, {from: user1});
      await instance.approve(user2, starId1, {from: user1});

      await instance.createStar('user2 star', starId2, {from: user2});
      await instance.approve(user1, starId2, {from: user2});

      await instance.exchangeStars(starId1, starId2, {from: user1});
      assert.equal(await instance.ownerOf.call(starId1), user2);
      assert.equal(await instance.ownerOf.call(starId2), user1);
  });
// 3) Stars Tokens can be transferred from one address to another.
  it('Stars Tokens can be transferred from one address to another', async() => {
      let fromAccount = accounts[1]
      let toAccount = accounts[2]
      let starId = 9

      await instance.createStar('My best star', starId, {from: fromAccount});

      await instance.transfer(toAccount, starId, {from: fromAccount});
      assert.equal(await instance.ownerOf.call(starId), toAccount);
  });
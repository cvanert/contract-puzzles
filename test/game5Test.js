const { loadFixture } = require('@nomicfoundation/hardhat-network-helpers');
const { assert } = require('chai');

describe('Game5', function () {
  async function deployContractAndSetVariables() {
    const Game = await ethers.getContractFactory('Game5');
    const game = await Game.deploy();

    // Create wallet with address less than threshold
    const threshold = 0x00FfFFfFFFfFFFFFfFfFfffFFFfffFfFffFfFFFf;
    let address = threshold;
    let wallet;
    while (address >= threshold) {
      wallet = await ethers.Wallet.createRandom();
      address = wallet.address;
    }

    // Connect wallet to provider
    wallet = wallet.connect(ethers.provider);

    // Add ether to wallet so it can send transactions (gas)
    const signer = await ethers.provider.getSigner();
    await signer.sendTransaction({
      to: wallet.address,
      value: ethers.utils.parseEther("1"),
    });


    return { game, wallet };
  }
  it('should be a winner', async function () {
    const { game, wallet } = await loadFixture(deployContractAndSetVariables);

    // good luck

    await game.connect(wallet).win();

    // leave this assertion as-is
    assert(await game.isWon(), 'You did not win the game');
  });
});
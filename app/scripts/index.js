// Import the page's CSS. Webpack will know what to do with it.
import '../styles/app.css'

// Import libraries we need.
import { default as Web3 } from 'web3'
import { default as contract } from 'truffle-contract'

// Import our contract artifacts and turn them into usable abstractions.
import StarNotaryArtifact from '../../build/contracts/StarNotary.json'

// StarNotary is our usable abstraction, which we'll use through the code below.
const StarNotary = contract(StarNotaryArtifact)

// The following code is simple to show off interacting with your contracts.
// As your needs grow you will likely need to change its form and structure.
// For application bootstrapping, check out window.addEventListener below.
let accounts
let account

const createStar = async () => {
  const instance = await StarNotary.deployed();
  const name = document.getElementById("starName").value;
  const id = document.getElementById("starId").value;
  await instance.createStar(name, id, {from: account});
  App.setStatus("A new Star has been added for: " + account + ".", 'starAdded');
}

// Add a function lookUp to Lookup a star by ID using tokenIdToStarInfo()
const lookUp = async () => {
    const instance = await StarNotary.deployed();
    const id = document.getElementById("lStarId").value;
    const result = await instance.lookUptokenIdToStarInfo.call(id);
    App.setStatus("Star Name is " + result + ".", 'starFound');
}
//

const App = {
  start: function () {
    const self = this

    // Bootstrap the MetaCoin abstraction for Use.
    StarNotary.setProvider(web3.currentProvider)

    // Get the initial account balance so it can be displayed.
    web3.eth.getAccounts(function (err, accs) {
      if (err != null) {
        alert('There was an error fetching your accounts.')
        return
      }

      if (accs.length === 0) {
        alert("Couldn't get any accounts! Make sure your Ethereum client is configured correctly.")
        return
      }

      accounts = accs
      account = accounts[0]

    })
  },

  setStatus: function (message, id) {
    const status = document.getElementById(id)
    status.innerHTML = message
  },
  createStar: function () {
    createStar();
  },
    lookUp: function () {
        lookUp();
  },

}

window.App = App

window.addEventListener('load', function () {
  // Checking if Web3 has been injected by the browser (Mist/MetaMask)
  if (typeof web3 !== 'undefined') {

    // Use Mist/MetaMask's provider
    window.web3 = new Web3(web3.currentProvider)
  } else {

    // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
    window.web3 = new Web3(new Web3.providers.HttpProvider('http://127.0.0.1:9545'))
  }

  App.start()
})

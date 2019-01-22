var HDWalletProvider = require('truffle-hdwallet-provider');
var mnemonic = 'sustain thing foam reduce ghost powder still vehicle address harvest unit lazy';
module.exports = {
    networks: {
        development: {
            host: '127.0.0.1',
            port: 9545,
            network_id: "*"
        },
        rinkeby: {
            provider: function() {
                return new HDWalletProvider(mnemonic, "https://rinkeby.infura.io/v3/0dbe40b864be44bab617c523af4f42ff");
            },
            network_id: 4,
            gas: 4500000,
            gasPrice: 10000000000,
        }
    }
};
var HDWalletProvider = require('truffle-hdwallet-provider');
import 'secrets';
var myMnemonic = mnemonic;
var infuraUrl = infura;

module.exports = {
    networks: {
        development: {
            host: '127.0.0.1',
            port: 9545,
            network_id: "*"
        },
        rinkeby: {
            provider: function() {
                return new HDWalletProvider(myMnemonic, infuraUrl);
            },
            network_id: 4,
            gas: 4500000,
            gasPrice: 10000000000,
        }
    }
};
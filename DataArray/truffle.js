// Allows us to use ES6 in our migrations and tests.
require('babel-register')

module.exports = {
  networks: {
    development: {
      //host: 'https://ropsten.infura.io/67bbb39f00834dcdb1fe0153201547b9', 
      //network_id: 3 // Match any network id

       host: '127.0.0.1',
       port: 7545,
       network_id: '*' // Match any network id
    }
  }
}

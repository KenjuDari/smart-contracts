
import '../styles/app.css'
import { default as Web3 } from 'web3'
import { default as contract } from 'truffle-contract'
import { keccak256 } from 'js-sha3'


import Storage_artifacts from '../../build/contracts/TokenMining.json'

var Storage = contract(Storage_artifacts)

var accounts
var account
var address
var hash = ""
var message = ""
var difficulty
var idBlock
var currentNonce
var nonce

const App = {
  start: function () {
    const self = this
    
    Storage.setProvider(web3.currentProvider)
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
    address = "0xa98c686af06a006a9639355ea02f4e28403e3e7a"
    Storage.at(address);

  var myContractInstance = Storage.at(address);
  var myEvent = myContractInstance.newHash();
  myEvent.watch(function(error, result){
  if (!error)
  {
    console.log("newHash");
    console.log(result);
  }
  });
  },


  findHash: function() {
    var appropriate = false
    var hashTmp
    console.log("idBlock")
    console.log(idBlock)
    console.log(idBlock.toString())
    var str = message + idBlock.toString() + currentNonce;
    
		while (!appropriate){
      nonce = App.makeRandomId()
      hashTmp=keccak256(nonce + str);
      appropriate = true
      for (var i = 0; i < difficulty; i++)
      {
        if (hashTmp.charAt(i) != "f") {
          appropriate = false
        }
      }
    }
      return hashTmp;
  },

  
  makeRandomId: function() {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (var i = 0; i < 30; i++)
    text += possible.charAt(Math.floor(Math.random() * possible.length));
    return text;
  },


  proccess: function() {
    var tmp;
    Storage.at(address).then(function(instance){
    tmp=instance;
    var sendHash = "0x" + hash

    return tmp.proofOfWork(nonce, sendHash, {from: account})
    }).then(function (access) {
        console.log("access");
        console.log(access);
    }).catch(function(e) {
      console.log(e);
    });
  }
}
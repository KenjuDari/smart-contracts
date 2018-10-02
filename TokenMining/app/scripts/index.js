// Import the page's CSS. Webpack will know what to do with it.
import '../styles/app.css'

// Import libraries we need.
import { default as Web3 } from 'web3'
import { default as contract } from 'truffle-contract'
import { keccak256 } from 'js-sha3'

// Import our contract artifacts and turn them into usable abstractions.
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
var timerId 
var proccessing = false
var events = ""

const App = {
  start: function () {
    const self = this

    // Bootstrap the MetaCoin abstraction for Use.
    
    Storage.setProvider(web3.currentProvider)

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

    address = "0xa98c686af06a006a9639355ea02f4e28403e3e7a"
    Storage.at(address);

  var myContractInstance = Storage.at(address);
  var myEvent = myContractInstance.newHash();
  myEvent.watch(function(error, result){
  if (!error)
  {
    events += result.args._hash + "\t" + result.args._str + "\t" + result.args._sender + "\t" + result.args._nonce + "\t" + Number(result.args._idBlock) + "\n" + "\n";
    $("#events").html(events);
  }
  });
  },

  findHash: function() {

    var appropriate = false
    var hashTmp
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

  getParam: function() {
    var tmp;

    $("#param").html(account);

    web3.eth.getBlockNumber(function (err, accs) {
      if (err != null) {
        console.log(err);
        return
      }
      accs = Number(accs)
      $("#param2").html(accs);
      $("#param3").html(Math.floor(accs / 100) * 100);
      idBlock = Math.floor(accs / 100) * 100
    })


    Storage.at(address).then(function(instance){
      tmp=instance;

      return tmp.getDifficulty({from: account})
      }).then(function (str) {
      str = Number(str)
      $("#param4").html(str);
      difficulty = str
      }).catch(function(e) {
      console.log(e);
      });

    Storage.at(address).then(function(instance){
      tmp=instance;

      return tmp.getCurrentNonce({from: account})
      }).then(function (str) {
        $("#param5").html(str);
        currentNonce = str
      }).catch(function(e) {
        console.log(e);
      });

    Storage.at(address).then(function(instance){
      tmp=instance;
  
      return tmp.getMessage({from: account})
      }).then(function (str) {
        $("#param6").html(str);
        message = str
      }).catch(function(e) {
        console.log(e);
      });
  },

  makeRandomId: function() {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (var i = 0; i < 30; i++)
    text += possible.charAt(Math.floor(Math.random() * possible.length));
    return text;
  },

  mining: function() {
    if (!proccessing) {
      timerId = setInterval(App.proccess, 10000)
      proccessing = true
    }
    else {
      clearInterval(timerId)
      proccessing = false
    }

  },


  proccess: function() {

    hash = App.findHash()  		
    var tmp;

    App.mining()
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

    App.mining()


  }
}

window.App = App

window.addEventListener('load', function () {
  // Checking if Web3 has been injected by the browser (Mist/MetaMask)
  if (typeof web3 !== 'undefined') {
    console.warn(
      'Using web3 detected from external source.' +
      ' If you find that your accounts don\'t appear or you have 0 MetaCoin,' +
      ' ensure you\'ve configured that source properly.' +
      ' If using MetaMask, see the following link.' +
      ' Feel free to delete this warning. :)' +
      ' http://truffleframework.com/tutorials/truffle-and-metamask'
    )
    // Use Mist/MetaMask's provider
    window.web3 = new Web3(web3.currentProvider)
  } else {
    console.warn(
      'No web3 detected. Falling back to http://127.0.0.1:7545.' +
      ' You should remove this fallback when you deploy live, as it\'s inherently insecure.' +
      ' Consider switching to Metamask for development.' +
      ' More info here: http://truffleframework.com/tutorials/truffle-and-metamask'
    )
    // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
    window.web3 = new Web3(new Web3.providers.HttpProvider('http://127.0.0.1:7545'))
  }

  App.start()
})



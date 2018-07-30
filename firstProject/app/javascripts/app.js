// Import the page's CSS. Webpack will know what to do with it.
import "../stylesheets/app.css";

// Import libraries we need.
import { default as Web3} from 'web3';
import { default as contract } from 'truffle-contract'

// Import our contract artifacts and turn them into usable abstractions.
import FirstProject_artifacts from '../../build/contracts/FirstProject.json'

var FirstProject = contract(FirstProject_artifacts);

// The following code is simple to show off interacting with your contracts.
// As your needs grow you will likely need to change its form and structure.
// For application bootstrapping, check out window.addEventListener below.
var accounts;
var account;
var address;

window.App = {
  start: function() {
    var self = this;

    // Bootstrap the FirstProject abstraction for Use.
    FirstProject.setProvider(web3.currentProvider);

    // Get the initial account balance so it can be displayed.
    web3.eth.getAccounts(function(err, accs) {
      if (err != null) {
        alert("There was an error fetching your accounts.");
        return;
      }

      if (accs.length == 0) {
        alert("Couldn't get any accounts! Make sure your Ethereum client is configured correctly.");
        return;
      }

      accounts = accs;
      account = accounts[0];
    });

    var inst;
        
            FirstProject.deployed().then(function (inst) {
            address=inst.address;
            console.log("address");
            console.log(address);
          });
  },

  setParam: function(){
    var setStorage=$("#param").val();
    setStorage=Number(setStorage);
  
    var tmp;


    FirstProject.at(address).then(function(instance){
    tmp=instance;

    return tmp.setStorageParam(setStorage,{from: account})
    }).then(function (success) {
        console.log("success: ");
        var succ = Boolean(success);
        console.log(succ);
    }).catch(function(e) {
      console.log(e);
    });
  },

  getParam: function() {
    var tmp;
  FirstProject.at(address).then(function(instance){
      tmp=instance;
  
    return tmp.getStorageParam({from: account})
     }).then(function (tx) {
          var getP = Number(tx);
          console.log(getP);
          $("#getParam").html(getP);
    }).catch(function(e) {
        console.log(e);
      }); 
  }
};

window.addEventListener('load', function() {
  // Checking if Web3 has been injected by the browser (Mist/MetaMask)
  if (typeof web3 !== 'undefined') {
    window.web3 = new Web3(web3.currentProvider);
  } else {
    window.web3 = new Web3(new Web3.providers.HttpProvider("http://127.0.0.1:7545"));
  }

  App.start();
});

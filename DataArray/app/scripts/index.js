// Import the page's CSS. Webpack will know what to do with it.
import '../styles/app.css'

// Import libraries we need.
import { default as Web3 } from 'web3'
import { default as contract } from 'truffle-contract'

// Import our contract artifacts and turn them into usable abstractions.
import Storage_artifacts from '../../build/contracts/DataRead.json'

var Storage = contract(Storage_artifacts)

var accounts
var account
var address
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
    var inst
        
  //   Storage.deployed().then(function (inst) {
  //   address=inst.address
  //   console.log("address")
  //   console.log(address)
  // })

  //address = "0xbc269fb7b8d8ce9f4e836442ab38f4498474e849"
  //address = '0xEB051058FbF6CBD620aDcfeD463163bA63d699C2'

  address = "0x3f5fd3eed4d6fce834bbdfb6add226ea8074bc94";
  Storage.at(address);

var myContractInstance = Storage.at(address);
var myEvent = myContractInstance.Put();
myEvent.watch(function(error, result){
  if (!error)
  {
    console.log("put");
    console.log(result);
    events += result.args._data + "\t" + Number(result.args._percent) + "\t" + Number(result.args._id) + "\t" + Number(result.args._time) + "\n";
    $("#array").html(events);
  }
  });

  },

  setParam: function(){
    var setStorage=$("#param").val();
    var setStorage2=$("#param2").val();
    var percent=Number(setStorage2);
  
    var tmp;


    Storage.at(address).then(function(instance){
    tmp=instance;

    return tmp.setData(setStorage, percent, {from: account})
    }).then(function (idSet) {
        console.log("id: ");
        idSet = Number(idSet);
        console.log(idSet);
    }).catch(function(e) {
      console.log(e);
    });

    Storage.at(address).then(function(instance){
      tmp=instance;
  
      return tmp.setDataString(setStorage, setStorage2, {from: account})
      });
  },

  getStr: function(){
    var tmp;


    Storage.at(address).then(function(instance){
      tmp=instance;
  
      return tmp.getDataString({from: account})
      }).then(function (str) {
        console.log(str);
        $("#stringArray").html(str);
      }).catch(function(e) {
        console.log(e);
      });
  },


  getParamSingle: function() {
    var tmp;
    var index=$("#single").val();
    index=Number(index);

    Storage.at(address).then(function(instance){
      tmp=instance;
  
    return tmp.getData(index, {from: account})
     }).then(function (tx) {
          $("#getParamStr").html(tx);
    }).catch(function(e) {
        console.log(e);
      }); 
  },

  getAmount: function() {
    var tmp;

    Storage.at(address).then(function(instance){
      tmp=instance;
  
    return tmp.getLength()
     }).then(function (tx) {
       tx = Number(tx);
          console.log(tx);
          $("#getLength").html(tx);
    }).catch(function(e) {
        console.log(e);
      }); 
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



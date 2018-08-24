// Import the page's CSS. Webpack will know what to do with it.
import '../styles/app.css'

// Import libraries we need.
import { default as Web3 } from 'web3'
import { default as contract } from 'truffle-contract'

// Import our contract artifacts and turn them into usable abstractions.
import Storage_artifacts from '../../build/contracts/Storage.json'

var Storage = contract(Storage_artifacts)

var accounts
var account
var address

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

  address = "0x16da2403B847Aa4EFf92ad6996a999495E045152"
  Storage.at(address)
  },

  setParam: function(){
    var setStorage=$("#param").val();
    setStorage=Number(setStorage);
  
    var tmp;


    Storage.at(address).then(function(instance){
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
    Storage.at(address).then(function(instance){
      tmp=instance;
  
    return tmp.getStorageParam({from: account})
     }).then(function (tx) {
          var getP = Number(tx);
          console.log(getP);
          $("#getParam").html(getP);
    }).catch(function(e) {
        console.log(e);
      }); 
  },
  writeData: function() {
    console.log('Something!');
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


// // Import the page's CSS. Webpack will know what to do with it.
// import '../styles/app.css'

// // Import libraries we need.
// import { default as web3 } from 'web3'
// import { default as contract } from 'truffle-contract'

// // Import our contract artifacts and turn them into usable abstractions.
// import Storage_artifacts from '../../build/contracts/Storage.json'


// //import Storage_artifacts from './Storage.json'

// var Storage = contract(Storage_artifacts)


// //var Storage

// var accounts
// var account
// var address
// var contractABI


// const App = {
//   start: function () {
//     // const self = this
//     // var w = new Web3();
//     // w.setProvider(web3.currentProvider)

//     // console.log("web3.currentProvider ")
//     // console.log(web3.eth.currentProvider)

//     // console.log("w ")
//     // console.log(w)
    
//     Storage.setProvider(web3.currentProvider)

//     web3.eth.getAccounts(function (err, accs) {
//       if (err != null) {
//         alert('There was an error fetching your accounts.')
//         return
//       }

//       if (accs.length === 0) {
//         alert("Couldn't get any accounts! Make sure your Ethereum client is configured correctly.")
//         return
//       }

//       accounts = accs
//       account = accounts[0]
//     })

//     // Bootstrap the MetaCoin abstraction for Use.
//     //Storage.setProvider(new Web3.providers.HttpProvider('https://ropsten.infura.io/67bbb39f00834dcdb1fe0153201547b9'))

//     // Get the initial account balance so it can be displayed.
//     //this.getAcc()

//     console.log("account ")
//     console.log(account)

//     // var inst
        
//   //   Storage.deployed().then(function (inst) {
//   //   address=inst.address
//   //   console.log("address")
//   //   console.log(address)
//   // })

//   //address = {
//     //"3" : '0x16da2403B847Aa4EFf92ad6996a999495E045152'
//   //}

//   //address = '0xEB051058FbF6CBD620aDcfeD463163bA63d699C2'
//   address = '0x16da2403B847Aa4EFf92ad6996a999495E045152'

//   //Storage.at(address);
//   // contractABI = [
//   //   {
//   //     "constant": false,
//   //     "inputs": [
//   //       {
//   //         "name": "_param",
//   //         "type": "uint256"
//   //       }
//   //     ],
//   //     "name": "setStorageParam",
//   //     "outputs": [
//   //       {
//   //         "name": "",
//   //         "type": "bool"
//   //       }
//   //     ],
//   //     "payable": false,
//   //     "stateMutability": "nonpayable",
//   //     "type": "function"
//   //   },
//   //   {
//   //     "constant": true,
//   //     "inputs": [],
//   //     "name": "getStorageParam",
//   //     "outputs": [
//   //       {
//   //         "name": "",
//   //         "type": "uint256"
//   //       }
//   //     ],
//   //     "payable": false,
//   //     "stateMutability": "view",
//   //     "type": "function"
//   //   }
//   // ]
  
//   // Storage = w.eth.contract(contractABI).at(address);
  
//   // console.log("Storage ")
//   // console.log(Storage)
  
//   // Storage = w.eth.contract(contractABI)
//   // Storage.at(address)
//   },

//   // getAcc: function(){
//   //   web3.eth.getAccounts(function (err, accs) {
//   //     if (err != null) {
//   //       console.log('There was an error fetching your accounts.')
//   //       alert('There was an error fetching your accounts.')
//   //       return
//   //     }

//   //     if (accs.length === 0) {
//   //       alert("Couldn't get any accounts! Make sure your Ethereum client is configured correctly.")
//   //       console.log("Couldn't get any accounts! Make sure your Ethereum client is configured correctly.")
//   //       return
//   //     }

//   //     console.log("accs ")
//   //     console.log(accs)

//   //     accounts = accs
//   //     account = accounts[0]
//   //   })

//   // },

//   setParam: function(){

//     var setStorage=$("#param").val();
//     setStorage=Number(setStorage);
  
//      var tmp;


//     Storage.at(address).then(function(instance){
//     tmp=instance;

//     return tmp.setStorageParam(setStorage,{from: account})
//     }).then(function (success) {
//         console.log("success: ");
//         var succ = Boolean(success);
//         console.log(succ);
//     }).catch(function(e) {
//       console.log(e);
//     });

//     // Storage.setStorageParam(setStorage, function(error, data) {
//     //   console.log("success: ");
//     //     var succ = Boolean(success);
//     //     console.log(succ);

//     //   console.log("error: ");
//     //   console.log(error);
//     // });


//     // Storage.setStorageParam(setStorage, {from: account}).then(function (success) {
//     //     console.log("success: ");
//     //     var succ = Boolean(success);
//     //     console.log(succ);
//     // }).catch(function(e) {
//     //   console.log(e);
//     // });
//   },

//   getParam: function() {
//     var tmp;
//     Storage.at(address).then(function(instance){
//       tmp=instance;
  
//     return tmp.getStorageParam({from: account})
//      }).then(function (tx) {
//           var getP = Number(tx);
//           console.log(getP);
//           $("#getParam").html(getP);
//     }).catch(function(e) {
//         console.log(e);
//       }); 
//   }
// }




// window.App = App

// window.addEventListener('load', function () {
//   // Checking if Web3 has been injected by the browser (Mist/MetaMask)
//   if (typeof web3 !== 'undefined') {
//     console.warn(
//       'Using web3 detected from external source.' +
//       ' If you find that your accounts don\'t appear or you have 0 MetaCoin,' +
//       ' ensure you\'ve configured that source properly.' +
//       ' If using MetaMask, see the following link.' +
//       ' Feel free to delete this warning. :)' +
//       ' http://truffleframework.com/tutorials/truffle-and-metamask'
//     )
//     // Use Mist/MetaMask's provider
//     window.web3 = new Web3(web3.currentProvider)
//     //window.web3 = new Web3(new Web3.providers.HttpProvider('https://ropsten.infura.io/67bbb39f00834dcdb1fe0153201547b9'))
//   } else {
//     console.log("web3 undefined")
//     console.warn(
//       'No web3 detected. Falling back to http://127.0.0.1:7545.' +
//       ' You should remove this fallback when you deploy live, as it\'s inherently insecure.' +
//       ' Consider switching to Metamask for development.' +
//       ' More info here: http://truffleframework.com/tutorials/truffle-and-metamask'
//     )
//     // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
    
//     //window.web3 = new Web3(new Web3.providers.HttpProvider('https://ropsten.infura.io/67bbb39f00834dcdb1fe0153201547b9'))

//   }
//   console.log(window.web3)

//   App.start()
// })



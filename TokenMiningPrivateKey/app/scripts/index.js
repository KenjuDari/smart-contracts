// Import the page's CSS. Webpack will know what to do with it.
import '../styles/app.css'

// Import libraries we need.
import { default as Web3 } from 'web3'
import { keccak256 } from 'js-sha3'

var contractMining

var provider
var account
var address = ""
//var address = "0xd89b9dd60a69f84e646389f61b7556d5dc218355"
var lastTransactionHash
var hash = ""
var message = ""
var difficulty
var idBlock
var currentNonce
var nonce
var timerId 
var proccess = false
var proccessing = false
var events = ""

//var privateKey = "0x42AD5AB5F613AF803AD04CC29282257DEBD8E363A1FA75D56EB1A02AA2357DA6"
var privateKey



const App = {
  start: function () {
  const self = this

  contractMining = new web3.eth.Contract(ABI, address)

  console.log("contractMining.events.newHash()")
  console.log(contractMining.events.newHash)
  contractMining.events.newHash()
  .on("data", function(event) {
    let events = event.returnValues;
    console.log("event");
    console.log(event);
    console.log(events);
  }).on("error", console.error);

  },

  getAddress: function() {
    privateKey = $("#privateKey").val();
    account = web3.eth.accounts.privateKeyToAccount(privateKey).address
    console.log("Current account " + account)
    $("#address").html(account);
  },

  getEvents: function() {
    contractMining.getPastEvents("newHash", { fromBlock: Number($("#findBlock").val()), toBlock: "latest" })
    .then(function(result) {
      console.log("getPastEvents: " + result.length);
      console.log(result);

      events = ""
      for (var i = 0; i < result.length; i++)
      {
        console.log(result[i]);
        console.log(result[i].returnValues);
      events += i + "<br>hash: " + result[i].returnValues._hash + "<br> str: " + result[i].returnValues._str + "<br> sender: " + result[i].returnValues._sender + "<br> salt: " + result[i].returnValues._nonce + "<br> idBlock: " + Number(result[i].returnValues._idBlock) + "<br><br>";
      }
      
      $("#events").html(events);
    });
  },

  findHash: function() {
    contractMining.methods.getDifficulty().call({from: account}, function(err, result){
      if (err != null) {
        console.log("error:")
        console.log(err)
        return
      }
      result = Number(result)
      difficulty = result
  })

    var appropriate = false
    var hashTmp
    var str = message + idBlock.toString() + currentNonce;
    console.log("difficulty " + difficulty)
    
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
    if (account == null)
    {
      console.log("address not authorized")
      return
    }

    $("#param").html(account);

    web3.eth.getBlockNumber(function (err, accs) {
      if (err != null) {
        console.log("error");
        console.log(err);
        return
      }
      accs = Number(accs)
      $("#param2").html(accs);
      $("#param3").html(Math.floor(accs / 100) * 100);
      idBlock = Math.floor(accs / 100) * 100
    })



    contractMining.methods.getDifficulty().call({from: account}, function(err, result){
      if (err != null) {
        console.log("error:")
        console.log(err)
        return
      }
      result = Number(result)
      $("#param4").html(result);
      difficulty = result
  })

  contractMining.methods.getCurrentNonce().call({from: account}, function(err, result){
    if (err != null) {
      console.log("error:")
      console.log(err)
      return
    }
    $("#param5").html(result);
    currentNonce = result
  })

  contractMining.methods.getMessage().call({from: account}, function(err, result){
    if (err != null) {
      console.log("error:")
      console.log(err)
      return
    }
    $("#param6").html(result);
    message = result
  })
  },

  makeRandomId: function() {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (var i = 0; i < 30; i++)
    text += possible.charAt(Math.floor(Math.random() * possible.length));
    return text;
  },

  mining: function() {

    if (account == null)
    {
      console.log("address not authorized")
      return
    }

    if (!proccessing) {
      timerId = setInterval(App.proccess, 5000)
      proccessing = true
    }
    else {
      clearInterval(timerId)
      proccessing = false
    }

  },


  proccess: function() {
    if (proccess)
    {
      return
    }

    proccess = true

    if (account == null)
    {
      console.log("address not authorized")
      return
    }
    hash = "0x" + App.findHash()  		

    console.log("proccessing")
    console.log(nonce)
    console.log(hash)

    var query = contractMining.methods.proofOfWork(nonce, hash);
    var encodedABI = query.encodeABI();
    var tx = {
      from: account,
      to: address,
      gas: 1000000,
      gasPrice: 5000000000,
      data: encodedABI,
    };
    console.log("tx proofOfWork")
    console.log(tx)

    web3.eth.accounts.signTransaction(tx, privateKey).then(signed => {
      const tran = web3.eth
        .sendSignedTransaction(signed.rawTransaction)
        .on('confirmation', (confirmationNumber, receipt) => {
          console.log('=> confirmation: ' + confirmationNumber);
        })
        .on('transactionHash', hash => {
          console.log('=> hash ' + hash);
          lastTransactionHash = hash
        })
        .on('receipt', receipt => {
          console.log('=> reciept');
          console.log(receipt);
        })
        .on('error', console.error);
    });
    proccess = false
    return lastTransactionHash
  }
}

window.App = App

window.addEventListener('load', function () {

  provider = new Web3.providers.HttpProvider('https://ropsten.infura.io/v3/070553663a3b425f93c5ad2b9590ca95')

  console.log("web3")

  console.log(provider)
  window.web3 = new Web3()
  window.web3.setProvider(provider)
  window.web3.providers.HttpProvider.prototype.sendAsync = Web3.providers.HttpProvider.prototype.send;

  console.log(window.web3)

  App.start()
})


const ABI = [
	{
		"constant": false,
		"inputs": [
			{
				"name": "nonce",
				"type": "string"
			},
			{
				"name": "_newHash",
				"type": "bytes32"
			}
		],
		"name": "proofOfWork",
		"outputs": [
			{
				"name": "",
				"type": "bytes32"
			},
			{
				"name": "",
				"type": "string"
			},
			{
				"name": "",
				"type": "string"
			},
			{
				"name": "",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "getCurrentChallenge",
		"outputs": [
			{
				"name": "",
				"type": "bytes32"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "getTimeOfLastProof",
		"outputs": [
			{
				"name": "",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "getCurrentNonce",
		"outputs": [
			{
				"name": "",
				"type": "string"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "getDifficulty",
		"outputs": [
			{
				"name": "",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "getMessage",
		"outputs": [
			{
				"name": "",
				"type": "string"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"name": "_hash",
				"type": "bytes32"
			},
			{
				"indexed": false,
				"name": "_str",
				"type": "string"
			},
			{
				"indexed": false,
				"name": "_sender",
				"type": "address"
			},
			{
				"indexed": false,
				"name": "_nonce",
				"type": "string"
			},
			{
				"indexed": false,
				"name": "_idBlock",
				"type": "uint256"
			}
		],
		"name": "newHash",
		"type": "event"
	}
]
import { Component, OnInit, ViewChild } from '@angular/core';
import { AccountService } from 'src/app/services/account.service';
import { StorageService } from 'src/app/services/storage.service';
import Web3 from 'web3';

// Connect Wallet
import WalletConnect from "@walletconnect/client";
import QRCodeModal from "@walletconnect/qrcode-modal";

// Set web3 and connector
let web3 = new Web3(window['ethereum']);
let connector = new WalletConnect({
  bridge: "https://bridge.walletconnect.org"
});

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.css']
})
export class IndexComponent implements OnInit {
  ethereum: any;
  account: any = {};
  connector: any;
  /**
   * 
   * @param accountService 
   * @param storageService 
   */
  constructor(
    private accountService: AccountService, 
    private storageService: StorageService,
  ) { }

  
  ngOnInit(): void {
    this.account = this.storageService.getItem('account') === null ? { address: "", network: "", chainId: "", provider: "" } : JSON.parse(this.storageService.getItem('account'));
    this.setAccount(this.account.address, this.account.chainId, this.account.provider);
  }

  connectWallet = async () => {
    // Create a connector
    this.connector = new WalletConnect({
      bridge: "https://bridge.walletconnect.org", // Required
      qrcodeModal: QRCodeModal,
    });
    // Check if connection is already established
    if (!this.connector.connected) {
      // create new session
      this.connector.createSession();
    }
    this.wallectConnectListener();
  }

  public wallectConnectListener() {
    // Subscribe to connection events
    this.connector.on("connect", (error, payload) => {
      if (error) {
        throw error;
      }
      // Get provided accounts and chainId
      const { accounts, chainId } = payload.params[0];
      this.setAccount(accounts[0], chainId, 'trustwallet');
    });

    this.connector.on("session_update", (error, payload) => {
      if (error) {
        throw error;
      }
      // Get updated accounts and chainId
      const { accounts, chainId } = payload.params[0];
      this.setAccount(accounts[0], chainId, 'trustwallet');
    });

    this.connector.on("disconnect", (error, payload) => {
      if (error) {
        throw error;
      }

      // Delete connector
      this.setAccount("", "", "");
    });
  }

  // Meta mask connection
  connectMetamask = async () => {
    this.ethereum = window['ethereum'];
    if (typeof this.ethereum !== 'undefined') {
    }
    const accounts = await this.ethereum.request({ method: 'eth_requestAccounts' });
    this.setAccount(accounts[0], this.ethereum.chainId, 'metamask');
    this.metamastListener();
  }

  // Listener
  public metamastListener() {
    this.ethereum.on('accountsChanged', (accounts) => {
      this.setAccount(accounts[0], this.ethereum.chainId, 'metamask');
      console.log("accounts[0]",accounts[0]);
    });
    this.ethereum.on('chainChanged', (chainId) => {
      this.setAccount(this.account.address, chainId, 'metamask');
    });
    this.storageService.setItem("walletconnect","");
  }
 
  /**
   * Store account details
   * @param address 
   * @param chainId 
   * @param provider 
   */
  public async setAccount(address, chainId, provider) {
    let account;
    if (address != "") {
      account = { address: address, chainId: chainId, network: await this.setNetwork(chainId), provider: provider }
    } else {
      account = { address: "", network: "", chainId: "", provider: "" };
    }
    if (address == undefined) {
      account = { address: "", network: "", chainId: "", provider: "" };
    }
    this.accountService.setAccount(account);
    this.account = Object.assign({}, account);
    this.storageService.setItem('account', JSON.stringify(this.account));
  }

 /**
  * Network Details
  * @param chainId 
  * @returns 
  */
  public setNetwork(chainId) {
    let network;
    switch (chainId) {
      case '0x1':
      case 1:
        network = "Mainnet";
        break;
      case '0x3':
      case 3:
        network = "Ropsten";
        break;
      case '0x4':
      case 4:
        network = "Rinkeby";
        break;
      case '0x38':
      case 56:
        network = 'BSC Mainnet';
        break;
      case '0x61':
      case 97:
        network = 'BSC Testnet';
        break;
      default:
        network = 'Unknown';
        break;
    }
    return network;
  }

  timeOut(){
    setTimeout(()=>{
    }, 5000);
  
  }
// Disconnect The Wallet
  disconnect(){
    this.storageService.setItem('walletconnect', "");
    this.setAccount("", "", "");
  }

}

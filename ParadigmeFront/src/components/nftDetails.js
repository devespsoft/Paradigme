import React, { Component } from 'react';
import axios from 'axios';
import Header from '../directives/header'
import Footer from '../directives/footer'
import config from '../config/config'
import ContentShimmer from 'react-content-shimmer'
import { CodeShimmer } from 'react-content-shimmer'
import moment from 'moment'
import { Link } from 'react-router-dom';
import { TwitterShareButton, TwitterIcon, FacebookShareButton, FacebookIcon, EmailIcon, EmailShareButton, WhatsappIcon, WhatsappShareButton } from 'react-share';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import Cookies from 'js-cookie';
import toast, { Toaster } from 'react-hot-toast';
import { Player } from 'video-react';
import { confirmAlert } from 'react-confirm-alert'; // Import
import { Dialog, Classes } from "@blueprintjs/core";
import '@blueprintjs/core/lib/css/blueprint.css';
import BarLoader from 'react-bar-loader'
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css
import Countdown, { zeroPad } from 'react-countdown';
import Web3 from 'web3';
import ReactTooltip from 'react-tooltip';
import ReactAudioPlayer from 'react-audio-player';
import {OBJModel} from 'react-3d-viewer'

export default class liveauction extends Component {

  constructor(props) {
    super(props)
    this.state = {
      ethtousd: '',
      usdtoeth: '',
      cryptoPayBtnDesable: 0,
      ethtousd: '',
      usdtoeth: '',
      paymentSelectError: '',
      nftPurchaseBtn: 0,
      selectCurrency: 0,
      Collapsible: [],
      nftDetails: {},
      isActive: 1,
      isSocial: 0,
      loadingData: '',
      modalopen: '',
      modalopen1: '',
      bid_price: '',
      Biderror: '',
      maxBid: '',
      timerStart: false,
      startTimerStart: false,
      isResponse: false,
      isDialogOpen: false,
      ConnectWalletAddress: '',
      spinLoader: 0,
      getMarketActivityList: [],
      physicalNftShow: false,
      aboutData: ''
    }
    this.loginData = (!Cookies.get('loginSuccessParadigme')) ? [] : JSON.parse(Cookies.get('loginSuccessParadigme'));
    this.token = (!Cookies.get('token')) ? [] : JSON.parse(Cookies.get('token'));
    this.onChange = this.onChange.bind(this)
    this.handleChange1 = this.handleChange1.bind(this)
  }

  async getDetail(itemLike) {

    // this.setState({
    //   isResponse: true
    // })

    await axios({
      method: 'post',
      url: `${config.apiUrl}itemDetail`,
      data: {
        "user_id": this.loginData.id ? this.loginData.id : "0",
        "item_id": this.props.match.params.id,
        "itemLike": itemLike
      }
    }).then((res) => {
      if (res.data.success === true) {

        let time = res.data.response.expiry_date;
        time = new Date(time);
        time = time.getTime();
        let cc = new Date();
        cc = cc.getTime();
        var diff = Math.round(parseInt(time) / 1000) - (parseInt(cc) / 1000);

        if (diff <= (24 * 3600)) {
          this.setState({
            timerStart: true
          })
        }

        let startTime = res.data.response.start_date;
        startTime = new Date(startTime);
        startTime = startTime.getTime();
        let curDate = new Date();
        curDate = curDate.getTime();
        var diff1 = Math.round(parseInt(startTime) / 1000) - (parseInt(curDate) / 1000);

        if (diff1 <= (24 * 3600)) {
          this.setState({
            startTimerStart: true
          })
        }

        this.setState({
          nftDetails: res.data.response,
          maxBid: res.data.response?.bidexist > 0 ? parseFloat((res.data.response?.max_bid * res.data.settingData?.bid_increase_percentage / 100) + parseFloat(res.data.response?.max_bid)).toFixed(6) : parseFloat(res.data.response?.max_bid).toFixed(6),
          bidIncreasePercentage: res.data.settingData?.bid_increase_percentage,
          isResponse: false
        })
      }

    }).catch((error) => {

    })
  }

  //=====================================  change event ===============================

  async getEthPriceAPI() {
    await axios({
      method: 'get',
      url: `https://api.binance.com/api/v3/ticker/price?symbol=MATICUSDT`,
    }).then(response => {
      this.setState({
        ethtousd: response.data.price,
        usdtoeth: 1 / response.data.price
      })
    })
  }

  async getEthPriceAPI() {
    await axios({
      method: 'get',
      url: `https://api.binance.com/api/v3/ticker/price?symbol=MATICUSDT`,
    }).then(response => {
      this.setState({
        ethtousd: response.data.price,
        usdtoeth: 1 / response.data.price
      })
    })
  }

  onChange = e => {
    this.setState({
      [e.target.name]: e.target.value
    })
  }

  selectCur(type) {
    this.setState({
      selectCurrency: type,
      paymentSelectError: ''
    })
  }

  componentDidMount() {
    this.getDetail(0)
    this.getEthPriceAPI();
    this.getEthPriceAPI();
    this.getMarketplaceActivityAPI();
    this.getAboutDetailAPI()
    setTimeout(() => {
      if (window.ethereum) {
        const { ethereum } = window;
        this.setState({
          ConnectWalletAddress: ethereum.selectedAddress
        })
      }
    }, 1000);

  }

  getEthlivePrice = async () => {
    await axios({
      method: 'get',
      url: `https://api.binance.com/api/v3/ticker/price?symbol=MATICUSDT`,
    }).then(response => {
      this.setState({ ETHlivePrice: parseFloat(response.data.price).toFixed(2) })
    })

  }

  isActiveTab(id) {
    if (id === 1) {
      this.setState({
        isActive: 1
      })
    }
    else if (id === 2) {
      this.setState({
        isActive: 2
      })
    }
    else if (id === 3) {
      this.setState({
        isActive: 3
      })
    }
  }

  modalShow(id) {
    if (id === 1) {

      this.setState({
        isSocial: 1
      })
    }
    else if (id === 0) {

      this.setState({
        isSocial: 0
      })
    }
  }

  async checkExpiryAPI() {
    await axios({
      method: 'post',
      url: `${config.apiUrl}checkExpiry`,
      data: { "item_id": this.props.match.params.id }
    })
      .then(result => {
        if (result.data.success === true) {
          window.location.href = 'marketplace'
        }
        else if (result.data.success === false) {

        }
      }).catch(err => {


      });
  }

  async getMarketplaceActivityAPI() {
    await axios({
      method: 'post',
      url: `${config.apiUrl}getMarketActivity`,
      data: { "item_id": this.props.match.params.id }
    }).then(result => {
      if (result.data.success === true) {
        this.setState({
          getMarketActivityList: result.data.response
        })
      }
      else if (result.data.success === false) {

      }
    }).catch(err => {


    });
  }

  //========================================================  check for bid  ==============================================

  async bidItem(id) {
    if (!this.loginData?.id) {
      toast.error('Please connect wallet!!');
    }
    else if (id === 2) {
      this.setState({
        modalopen: 1
      })
    }
  }

  async nftPurchaseModel(id) {
    if (this.loginData.length === 0) {
      window.location.href = `${config.baseUrl}login`
    }
    else if (id === 1) {
      this.setState({
        modalopen1: 1
      })
    }
  }

  closebutton() {
    this.setState({
      modalopen: '',
      modalopen1: ''
    })
  }

  //=======================================  purchase/Bid the item  =======================================

  async purchaseItem() {

    if (!this.loginData?.id) {
      toast.error('Please connect wallet!!');
    }
    else if (this.state.nftDetails.nft_type_select == 1) {
      this.setState({
        physicalNftShow: true
      })

      // return
    }
    else {
      let tokenId = this.state.nftDetails.token_id;
      let tokenPrice = this.state.nftDetails.price;
      let coin = 'MATIC';
      if (window.ethereum) {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        let web3 = new Web3(window.ethereum);
        let currentNetwork = web3.currentProvider.chainId;

        if (currentNetwork !== config.chainId) {
          toast.error('Please select testnet MATIC network!');
          this.setState({
            spinLoader: '0',
            isDialogOpen: false
          })
          return false;
        }
        try {
          tokenPrice = parseInt((parseFloat(tokenPrice)) * 10 ** 18);
          let from_address = accounts[0];
          var getBalace = await web3.eth.getBalance(from_address) / (10 ** 18);
          var currentBal = parseFloat(getBalace).toFixed(6)
          if (currentBal < this.state.nftDetails.price) {
            toast.error(`Insufficient fund for transfer`);
            this.setState({
              spinLoader: '0',
              isDialogOpen: false
            })
            return false;
          }

          this.setState({
            spinLoader: 1,
            isDialogOpen: true
          })
          await this.trnasferNFT(tokenId, coin, tokenPrice);
        } catch (error) {
          toast.error('Something went wrong please try again2.');
          this.setState({
            spinLoader: 0,
            isDialogOpen: false
          })
          return false;
        }
      } else {
        toast.error('Please Connect to MetaMask.');
        this.setState({
          spinLoader: '0',
          isDialogOpen: false
        })
        return false;
      }
    }
  }



  async NftPurchasePhysical() {
    if (!this.loginData?.id) {
      toast.error('Please connect wallet!!');
    }
    else {
      let tokenId = this.state.nftDetails.token_id;
      let tokenPrice = this.state.nftDetails.price;
      let coin = 'MATIC';
      if (window.ethereum) {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        let web3 = new Web3(window.ethereum);
        let currentNetwork = web3.currentProvider.chainId;

        if (currentNetwork !== config.chainId) {
          toast.error('Please select testnet MATIC network!');
          this.setState({
            spinLoader: '0',
            isDialogOpen: false
          })
          return false;
        }
        try {
          tokenPrice = parseInt((parseFloat(tokenPrice)) * 10 ** 18);
          let from_address = accounts[0];
          var getBalace = await web3.eth.getBalance(from_address) / (10 ** 18);
          var currentBal = parseFloat(getBalace).toFixed(6)
          if (currentBal < this.state.nftDetails.price) {
            toast.error(`Insufficient fund for transfer`);
            this.setState({
              spinLoader: '0',
              isDialogOpen: false
            })
            return false;
          }

          this.setState({
            spinLoader: 1,
            isDialogOpen: true
          })
          await this.trnasferNFT(tokenId, coin, tokenPrice);
        } catch (error) {
          toast.error('Something went wrong please try again2.');
          this.setState({
            spinLoader: 0,
            isDialogOpen: false
          })
          return false;
        }
      } else {
        toast.error('Please Connect to MetaMask.');
        this.setState({
          spinLoader: '0',
          isDialogOpen: false
        })
        return false;
      }
    }
  }

  async trnasferNFT(tokenId, coin, tokenPrice) {
    if (window.ethereum) {
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      let web3 = new Web3(window.ethereum);
      var chainId = web3.currentProvider.chainId;
      try {

        let contractAddress = `${config.marketplaceContract}`
        let from_address = accounts[0];

        const contract = await new web3.eth.Contract(config.abiMarketplace, contractAddress);
        let tx_builder = '';
        let cryptoAmount = tokenPrice;
        let itemPrice = 0;

        itemPrice = tokenPrice / 10 ** 18;
        tx_builder = await contract.methods.buy(tokenId.toString());

        let encoded_tx = tx_builder.encodeABI();
        let gasPrice = await web3.eth.getGasPrice();

        let gasLimit = await web3.eth.estimateGas({
          gasPrice: web3.utils.toHex(gasPrice),
          to: contractAddress,
          from: from_address,
          chainId: chainId,
          value: web3.utils.toHex(cryptoAmount),
          data: encoded_tx
        });

        const txData = await web3.eth.sendTransaction({
          gasPrice: web3.utils.toHex(gasPrice),
          gas: web3.utils.toHex(gasLimit),
          to: contractAddress,
          from: from_address,
          chainId: chainId,
          value: web3.utils.toHex(cryptoAmount),
          data: encoded_tx
        });

        if (txData.transactionHash) {
          var paymentArr = {
            txHash: txData.transactionHash,
            itemPrice: itemPrice,
            from_address: contractAddress,
            to_address: from_address,
            paymentType: coin,
          }
          this.buyItemAPI(paymentArr)
        } else {
          toast.error('Something went wrong please try again3.');
          this.setState({
            spinLoader: '0',
            isDialogOpen: false
          })
          return false;
        }

      } catch (err) {
        if (err.message.toString().split('insufficient funds')[1]) {
          toast.error('Transaction reverted : ' + err.message)
        } else {
          if (err.toString().split('execution reverted:')[1]) {
            toast.error('Transaction reverted : ' + (err.toString().split('execution reverted:')[1]).toString().split('{')[0])
          } else {
            toast.error(err.message);
          }
        }
        this.setState({
          spinLoader: '0',
          isDialogOpen: false
        })
        return false;
      }

    } else {
      toast.error('Please Connect to MetaMask.');
      this.setState({
        spinLoader: '0',
        isDialogOpen: false
      })
      return false;
    }
  }

  async buyItemAPI(paymentArr) {
    await axios({
      method: 'post',
      url: `${config.apiUrl}nftPurchase`,
      data: {
        "item_id": this.state.nftDetails?.item_id,
        "sell_type": this.state.nftDetails?.sell_type,
        "user_id": this.loginData?.id,
        "owner_id": this.state.nftDetails?.owner_id,
        "user_name": this.loginData?.first_name + ' ' + this.loginData?.last_name,
        "price": paymentArr.itemPrice,
        "cryptoPrice": this.state.nftDetails.price,
        "buyerAddress": paymentArr.from_address,
        "to_address": paymentArr.to_address,
        "tokenId": this.state.nftDetails?.token_id,
        "trx_amount": paymentArr.trx_amount,
        "trx_currency": this.state.paymentType,
        "trx_hash": paymentArr.txHash,
        "itemName": this.state.nftDetails?.name,
        "itemimage": this.state.nftDetails?.image,
        "owner_address": this.state.nftDetails?.owner_address,
        "trx_type": "Crypto",
        'mobile_number': this.state.aboutData?.mobile_number,
        'pin_code': this.state.aboutData?.pin_code,
        'shipping_address': this.state.aboutData?.shipping_address,
        'locality': this.state.aboutData?.locality,
        'city': this.state.aboutData?.city,
        'state': this.state.aboutData?.state,
        'landmark': this.state.aboutData?.landmark
      }
    }).then(async response => {
      if (response.data.success === true) {
        toast.success(response.data.msg);
        setTimeout(() => {
          window.location.href = `${config.baseUrl}marketplace`
        }, 2000);
      } else {
        toast.error(`Something went wrong! Please try again.`);
      }
      this.setState({
        nftPurchaseBtn: 0
      })
    }).catch(err => {
      toast.error(`Something went wrong! Please try again.`);
      this.setState({
        nftPurchaseBtn: 0
      })
    });
  }

  getTimeOfStartDate(dateTime) {
    var date = new Date(dateTime); // some mock date
    var milliseconds = date.getTime();
    return milliseconds;
  }

  CountdownTimer({ days, hours, minutes, seconds, completed }) {
    if (completed) {
      // Render a completed state
      return "Starting";
    } else {
      // Render a countdowns
      var dayPrint = (days > 0) ? days + 'd' : '';
      return <span>{dayPrint} {zeroPad(hours)}h {zeroPad(minutes)}m {zeroPad(seconds)}s</span>;
    }
  };

  async likeCount(item_id) {
    if (this.loginData && this.loginData.id) {
      await axios({
        method: 'post',
        url: `${config.apiUrl}likeitem`,
        data: {
          "user_id": this.loginData.id,
          "item_id": item_id
        }
      }).then((res) => {
        if (res.data.success === true) {
          this.getDetail(1);
        }

      }).catch((error) => {

      })
    } else {
      toast.error('Please connect metamask!!');
    }
  }

  async bidPlaced() {
    if (!this.loginData?.id) {
      toast.error('Please connect wallet!!');
    } else {
      let tokenId = this.state.nftDetails.token_id;
      let tokenPrice = parseFloat(this.state.bid_price).toFixed(6);

      if ((parseFloat(this.state.maxBid).toFixed(6)) > tokenPrice) {
        toast.error('Bid amount should be higher than max bid amount!!');
        return false;
      }

      if (window.ethereum) {

        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        let web3 = new Web3(window.ethereum);
        let currentNetwork = web3.currentProvider.chainId;

        if (currentNetwork !== config.chainId) {
          toast.error('Please select testnet MATIC smartchain!');
          this.setState({
            spinLoader: '0',
            isDialogOpen: false
          })
          return false;
        }

        try {
          this.setState({
            spinLoader: '0',
            modalopen: '',
            isDialogOpen: true
          })

          tokenPrice = parseInt((parseFloat(tokenPrice)) * 10 ** 18);
          await this.placeBidNow(tokenId, tokenPrice);
        } catch (error) {
          toast.error('Something went wrong please try again2.');
          this.setState({
            spinLoader: '0',
            isDialogOpen: false
          })
          return false;
        }
      } else {
        toast.error('Please Connect to MetaMask.');
        this.setState({
          spinLoader: '0',
          isDialogOpen: false
        })
        return false;
      }
    }
  }


  async placeBidNow(tokenId, tokenPrice) {
    if (window.ethereum) {
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      let web3 = new Web3(window.ethereum);
      var chainId = config.chainId;
      try {

        let contractAddress = `${config.marketplaceContract}`
        let from_address = accounts[0];

        const contract = await new web3.eth.Contract(config.abiMarketplace, contractAddress);
        let tx_builder = '';
        tx_builder = await contract.methods.placeBid(tokenId.toString());

        let encoded_tx = tx_builder.encodeABI();
        let gasPrice = await web3.eth.getGasPrice();

        let gasLimit = await web3.eth.estimateGas({
          gasPrice: web3.utils.toHex(gasPrice),
          to: contractAddress,
          from: from_address,
          chainId: chainId,
          value: web3.utils.toHex(tokenPrice),
          data: encoded_tx
        });

        const txData = await web3.eth.sendTransaction({
          gasPrice: web3.utils.toHex(gasPrice),
          gas: web3.utils.toHex(gasLimit),
          to: contractAddress,
          from: from_address,
          chainId: chainId,
          value: web3.utils.toHex(tokenPrice),
          data: encoded_tx
        });

        if (txData.transactionHash) {
          var paymentArr = {
            bidAmount: parseFloat(this.state.bid_price).toFixed(6),
            txHash: txData.transactionHash,
          }
          this.bidPlaceAPI(paymentArr)
        } else {
          toast.error('Something went wrong please try again3.');
          this.setState({
            spinLoader: '0',
            isDialogOpen: false
          })
          return false;
        }

      } catch (err) {
        if (err.message.toString().split('insufficient funds')[1]) {
          toast.error('Transaction reverted : ' + err.message)
        } else {
          if (err.toString().split('execution reverted:')[1]) {
            toast.error('Transaction reverted : ' + (err.toString().split('execution reverted:')[1]).toString().split('{')[0])
          } else {
            toast.error(err.message);
          }
        }
        this.setState({
          spinLoader: '0',
          isDialogOpen: false
        })
        return false;
      }
    } else {
      toast.error('Please Connect to MetaMask.');
      this.setState({
        spinLoader: '0',
        isDialogOpen: false
      })
      return false;
    }
  }

  async bidPlaceAPI(paymentArr) {
    await axios({
      method: 'post',
      url: `${config.apiUrl}insertBid`,
      data: {
        "bid_price": paymentArr.bidAmount,
        "user_id": this.loginData?.id,
        "item_id": this.state.nftDetails?.item_id,
        "owner_id": this.state.nftDetails?.owner_id,
        "txhash": paymentArr.txHash,
        'mobile_number': this.state.aboutData?.mobile_number,
        'pin_code': this.state.aboutData?.pin_code,
        'shipping_address': this.state.aboutData?.shipping_address,
        'locality': this.state.aboutData?.locality,
        'city': this.state.aboutData?.city,
        'state': this.state.aboutData?.state,
        'landmark': this.state.aboutData?.landmark
      }
    }).then(async response => {
      if (response.data.success === true) {
        toast.success(response.data.msg);
        setTimeout(() => {
          window.location.href = `${config.baseUrl}marketplace`
        }, 2000);
      } else {
        toast.error(`Something went wrong! Please try again6.`);
      }
      this.setState({
        spinLoader: '0',
        isDialogOpen: false
      })
      this.setState({
        nftPurchaseBtn: 0
      })
    }).catch(err => {
      toast.error(`Something went wrong! Please try again7.`);
      this.setState({
        spinLoader: '0',
        isDialogOpen: false
      })
      this.setState({
        nftPurchaseBtn: 0
      })
    });
  }


  async closeModel() {
    this.setState({
      physicalNftShow: false
    })
  }


  async getAboutDetailAPI() {
    await axios({
      method: 'post',
      url: `${config.apiUrl}getAboutDetail`,
      data: { "id": this.loginData.id }
    }).then(response => {
      if (response.data.success === true) {
        this.setState({
          aboutData: response.data.response
        })
      }
    })
  }

  handleChange1 = event => {
    event.preventDefault()
    let value = event.target.value;
    this.setState(prevState => ({
      aboutData: { ...prevState.aboutData, [event.target.name]: value }
    }))
  }

  render() {

    return (

      <>
        <div id="wrapper">
          <Header />

          <Dialog
            title="Please Wait..."
            style={{
              color: '#000',
              textAlign: "center"
            }}
            isOpen={this.state.isDialogOpen}
            isCloseButtonShown={false}
          >
            <div className="text-center pl-3 pr-3">
              < br />
              {this.state.nftDetails.sell_type == 1 ?
                <h4 style={{ color: '#000', fontSize: '16px' }}>
                  Buying process in progress, once process completed NFT will be show on portfolio page.
                </h4>
                :
                <h4 style={{ color: '#000', fontSize: '16px' }}>
                  Bidding process in progress, once process completed bid will be show on bids page.
                </h4>
              }

              <p style={{ color: '#000' }}>
                Please do not refresh page or close tab.
              </p>
              <div>
                <div class="spinner-border"></div>
              </div>
            </div>
          </Dialog>

          <div className="modal fade" id="walletModel" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="walletModelLabel" aria-hidden="true">
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title" id="walletModelLabel">Wallet Connect</h5>
                </div>
                <div className="modal-body">
                  <button className="btn color-3 Connect_wallet_btn" id="metamask_btn" onClick={e => this.connectMetasmask()}><img height="50px" src="https://cdn.iconscout.com/icon/free/png-256/metamask-2728406-2261817.png" className="wallet_icons" /><span style={{ marginLeft: '15px' }}>Metamask</span></button>

                  <button className="btn color-3 Connect_wallet_btn " id="metamask_btn" onClick={e => this.connectWallet()} ><img height="50px" src="https://www.nuget.org/profiles/WalletConnect/avatar?imageSize=512" className="wallet_icons" /><span style={{ marginLeft: '15px' }}>Wallet Connect</span></button>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                </div>
              </div>
            </div>
          </div>

          <div className="no-bottom no-top " id="content">
            <div id="top" />
            <section aria-label="section" className="mt70 nftdetailpage sm-mt-0">
              <div className="container">
                <div className="row">
                  <div className="col-lg-6 col-md-12 text-center">

                    <div className='audio-details' style={{ backgroundImage: this.state.nftDetails?.file_type == 'audio' ? " url(./images/audio.jpeg)" : '' }}>
                      {this.state.isResponse == true ?
                        <div className='col-sm-12 mb-3'>
                          <ContentShimmer style={{ marginTop: "1rem", background: 'rgb(241 241 241)' }} rounded={"20px"} size={{ height: 550, width: 500 }} />
                        </div>
                        :


                        this.state.nftDetails?.file_type == 'image' ?
                          <div className="">
                            <img className="img-fluid img-rounded mb30 nftdetailimage" src={`${config.imageUrl}` + this.state.nftDetails?.image} width="70px" />
                          </div>
                          :

                          this.state.nftDetails?.file_type == 'video' ?
                            <video className="img-fluid img-rounded mb30 nftdetailimage" muted autoPlay width="70px" height="70px" controls>
                              <source src={`${config.imageUrl}${this.state.nftDetails?.image}`} type="video/mp4" />
                            </video> :
                            this.state.nftDetails?.file_type == 'audio' ?
                              <ReactAudioPlayer
                                className='audio-play'
                                src={`${config.imageUrl}${this.state.nftDetails?.image}`}

                                controls
                              /> :
                              

                              this.state.nftDetails?.file_type == 'OBJ' ?
                              <OBJModel src={`${config.imageUrl}${this.state.nftDetails?.image}`} texPath=""/>

                                 :
                              ""
                      }
                    </div>

                  </div>
                  <div className="col-lg-6 col-md-12">

                    {this.state.isResponse == true ?
                      <div className='col-sm-12 mb-3'>
                        <CodeShimmer style={{ marginTop: "1rem", background: 'rgb(241 241 241)' }} rounded={"20px"} size={{ height: 550, width: 500 }} />
                      </div>
                      :
                      <div className="item_info">

                        <h2 className=''>{this.state.nftDetails?.name ? this.state.nftDetails?.name : ''}</h2>
                        <div className="item_info_counts">
                          <div className="item_info_type"><i className="fa fa-image" />{this.state.nftDetails?.collection_name ? this.state.nftDetails?.collection_name : ''}</div>
                          <div className="item_info_views"><i className="fa fa-eye" />{this.state.nftDetails?.view_count ? this.state.nftDetails?.view_count : '0'} Views</div>

                          <div className="item_info_like"><i style={this.state.nftDetails?.is_liked === 0 ? { color: '#ddd', cursor: 'pointer' } : { color: '#EC7498', cursor: 'pointer' }} onClick={e => this.likeCount(this.state.nftDetails?.item_id)} className="fa fa-heart" />{this.state.nftDetails?.like_count ? this.state.nftDetails?.like_count : '0'} Likes</div>
                          <div><b>{this.state.nftDetails?.nft_type_select == '1' ?
                            'Physical NFT'
                            : 'Digital NFT'}</b></div>
                        </div>
                        <p>{this.state.nftDetails?.description ? this.state.nftDetails?.description : ''}</p>
                        <div className="row mt-4">
                          <div className="col-lg-4 col-md-4  mt-xs-3">
                            <h6>Collection</h6>
                            <Link to={`${config.baseUrl}collections/` + this.state.nftDetails?.collection_id} >
                              <div className="item_author">
                                <div className="author_list_pp">
                                  <img className="lazy" src={this.state.nftDetails?.collection_pic ? this.state.nftDetails?.collection_pic : 'images/default-user-icon.jpg'} alt />

                                </div>
                                <div className="author_list_info">
                                  {this.state.nftDetails?.collection_name ? this.state.nftDetails?.collection_name : ''}
                                </div>
                              </div>
                            </Link>
                          </div>

                          <div className="col-lg-4 col-md-4 ">
                            <h6>Creator</h6>

                            <Link to={`${config.baseUrl}UserProfile/` + this.state.nftDetails?.created_by} >
                              <div className="item_author">
                                <div className="author_list_pp">
                                  <img className="lazy" src={!this.state.nftDetails?.creator_profile_pic || this.state.nftDetails?.creator_profile_pic == null || this.state.nftDetails?.creator_profile_pic == 'null' || this.state.nftDetails?.creator_profile_pic == undefined ? 'images/default-user-icon.jpg' : config.imageUrl1 + this.state.nftDetails?.creator_profile_pic} alt />

                                </div>
                                <div className="author_list_info">
                                  {this.state.nftDetails?.creator ? this.state.nftDetails?.creator : ''}
                                </div>
                              </div>
                            </Link>
                          </div>

                          <div className="col-lg-4 col-md-4 mt-xs-3">
                            <h6>Owner</h6>
                            <Link to={`${config.baseUrl}UserProfile/` + this.state.nftDetails?.owner_id} >
                              <div className="item_author">
                                <div className="author_list_pp">
                                  <img className="lazy" src={!this.state.nftDetails?.owner_profile_pic || this.state.nftDetails?.owner_profile_pic == null || this.state.nftDetails?.owner_profile_pic == 'null' || this.state.nftDetails?.owner_profile_pic == undefined ? 'images/default-user-icon.jpg' : config.imageUrl1 + this.state.nftDetails?.owner_profile_pic} alt />

                                </div>
                                <div className="author_list_info">
                                  {this.state.nftDetails?.owner ? this.state.nftDetails?.owner : ''}
                                </div>
                              </div>
                            </Link>
                          </div>

                        </div>
                        <div className="spacer-40" />
                        <div className="de_tab tab_simple">

                          <br />

                          {this.state.nftDetails.sell_type === 1 || this.state.nftDetails.expiry_date === null ? '' :
                            <div className="item_info_like">

                              {new Date(this.state.nftDetails.start_date) > new Date() ?
                                <>
                                  <div className='mb-2'>
                                    <i className="fa fa-clock-o" aria-hidden="true" />&nbsp;
                                    Sale start in <br />
                                  </div>
                                  {(this.state.nftDetails.start_date && this.state.startTimerStart) ?
                                    <span style={{ fontSize: '20px' }}>
                                      <Countdown
                                        date={this.getTimeOfStartDate(this.state.nftDetails.start_date)}
                                        renderer={this.CountdownTimer}

                                      />
                                    </span>
                                    :
                                    <>
                                      {/* <span className="days">{moment(this.state.nftDetails.start_date).diff(moment(), 'days')} day </span> */}
                                      <span style={{ fontSize: '20px' }}>
                                        <Countdown
                                          date={this.getTimeOfStartDate(this.state.nftDetails.start_date)}
                                          renderer={this.CountdownTimer}
                                        />
                                      </span>

                                    </>
                                  }
                                  &nbsp;
                                  ({moment(this.state.nftDetails.start_date).format('LLL')})
                                </>
                                :
                                new Date(this.state.nftDetails.expiry_date) > new Date() ?
                                  <>
                                    <div className='mb-2'>
                                      <i className="fa fa-clock-o" aria-hidden="true" />&nbsp;
                                      Sale ends in &nbsp;
                                    </div>
                                    {(this.state.nftDetails.expiry_date && this.state.timerStart) ?
                                      <span style={{ fontSize: '20px' }}>
                                        <Countdown
                                          date={this.getTimeOfStartDate(this.state.nftDetails.expiry_date)}
                                          renderer={this.CountdownTimer}
                                        /> </span> :
                                      <>
                                        {/* <span className="days">{moment(this.state.nftDetails.expiry_date).diff(moment(), 'days')} day </span> */}
                                        <span style={{ fontSize: '20px' }}>
                                          <Countdown
                                            date={this.getTimeOfStartDate(this.state.nftDetails.expiry_date)}
                                            renderer={this.CountdownTimer}
                                          />   </span>
                                      </>
                                    }
                                    &nbsp;
                                    ({moment(this.state.nftDetails.expiry_date).format('LLL')})
                                  </>
                                  :
                                  "Sale ends"
                              }


                            </div>
                          }

                          <div className="spacer-10" />
                          <h6>Price</h6>
                          <div className="nft-item-price">
                            <img src="images/plygon.png" alt />
                            <span>{this.state.nftDetails?.price ? this.state.nftDetails?.price : '0.00'}</span>(${parseFloat(this.state.ethtousd * this.state.nftDetails?.price).toFixed(2)})</div>

                          {this.loginData.id == this.state.nftDetails.owner_id ?
                            <>
                              <i style={{ fontSize: '25px' }} class="fa fa-exclamation-circle" data-tip={`You are the owner of this NFT`} aria-hidden="true"></i>
                              <ReactTooltip /> &nbsp;
                            </> : ''
                          }

                          {this.loginData.id ?
                            this.state.nftDetails.is_sold === 1 ?
                              <p style={{ color: 'red' }}>Sold Out</p> :
                              this.state.nftDetails.sell_type === 1 ?
                                <button className="btn btn-main btn-lg mb-3" style={{ height: '37px', cursor: this.state.nftDetails.is_sold === 1 || this.loginData.id == this.state.nftDetails.owner_id ? 'not-allowed' : '', background: this.state.nftDetails.is_sold === 1 || this.loginData.id == this.state.nftDetails.owner_id ? 'gray' : '', }} disabled={this.state.nftDetails.is_sold === 1 || this.loginData.id == this.state.nftDetails.owner_id || this.state.spinLoader == 1 || this.state.nftDetails?.is_on_sale == 0 ? true : false} onClick={this.purchaseItem.bind(this, this.state.nftDetails.sell_type)} >
                                  <img src="images/wallet.png" className="wallet_icon" /> {this.state.spinLoader == 1 ? 'Processing...' : 'Buy'}</button>
                                :
                                <button className="btn btn-main btn-lg mb-3" style={{ height: '37px', background: this.loginData.id == this.state.nftDetails.owner_id ? 'gray' : '', }} disabled={new Date(this.state.nftDetails.start_date) > new Date() || new Date(this.state.nftDetails.expiry_date) < new Date() || this.state.nftDetails.is_sold === 1 || this.loginData.id == this.state.nftDetails.owner_id || this.state.nftDetails?.is_on_sale == 0 ? true : false} onClick={this.bidItem.bind(this, this.state.nftDetails.sell_type)}>
                                  <img src="images/wallet.png" className="wallet_icon" />Place Bid</button>
                            :

                            <a href="javascript:void(0)" data-bs-toggle="modal" data-bs-target="#walletModel">
                              <button className="btn btn-main btn-lg mb-3"> Connect </button>
                            </a>
                          }
                          &nbsp;&nbsp;
                          <a href={`${config.blockchinUrl + this.state.nftDetails?.token_hash}`} target="_blank">
                            <button className="btn btn-main btn-lg mb-3">Blockchain View</button>
                          </a>

                        </div>
                      </div>
                    }
                  </div>
                </div>
              </div>

              <div className='container mt-5'>
                <div className='col-sm-12'>
                  <div className='table-responsive'>
                    <table className='table table-striped mobile-none' width="100%">
                      <thead>
                        <tr>
                          <th>#</th>
                          <th>Event</th>
                          <th>Price</th>
                          <th>From</th>
                          <th>Address</th>
                          <th>Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        {this.state.getMarketActivityList.length > 0 ?
                          this.state.getMarketActivityList.map((item, i) => {
                            return (
                              <tr>
                                <td>{i + 1}</td>
                                <td>
                                  {item.transaction_type}
                                </td>
                                <td>
                                  {item.transaction_type_id != 2 ?
                                    `${item.amount + ' MATIC'}` : ""
                                  }
                                </td>
                                <td>
                                  <Link to={`${config.baseUrl}UserProfile/` + item.user_id}>
                                    {item.full_name}
                                  </Link>
                                </td>
                                <td>
                                  <a target="_blank" href={config.blockchinUrladdress + item.address}>
                                    <p title={item.address}>{item.address == null ? '' : item.address.toString().substring(0, 8) + '...' + item.address.toString().substr(item.address.length - 8)}</p>
                                  </a>
                                </td>
                                <td>
                                  {item.transaction_date}
                                </td>
                              </tr>
                            )
                          })
                          :
                          <span className='text-center bg-grey'><img style={{ width: '100%' }} src='images/nodata-found.png' /></span>
                        }

                      </tbody>
                    </table>

                  </div>
                </div>
              </div>

            </section>
          </div>
          <Footer />
        </div>

        {/* //=======================================  Bid modal ========================================== */}

        <div id="myModal" className={this.state.modalopen === '' ? "modal fade cart-modal" : "modal fade cart-modal show"} role="dialog" style={{ background: '0% 0% / cover rgba(6, 6, 6, 0.32)', display: this.state.modalopen === '' ? 'none' : 'block' }}
          data-backdrop="false">
          <div className="modal-dialog modal-dialog-centered" style={{ margin: 'auto', marginTop: '15px' }}>
            <div className="modal-content">
              <div className="" style={{ borderBottom: "1px solid transparent" }}>
                <button type="button" onClick={this.closebutton.bind(this)} className="close btnClose" data-dismiss="modal">&times;</button>
              </div>
              <div className="modal-body" style={{ padding: '0px' }}>
                <div className="row">
                  <div className="col-sm-12">
                    <div className="row p-4">
                      <div className="">
                        <h4 className="strong payment-method-options">Offer Method</h4>
                      </div>
                      <div className="tab-wrapper style-1">

                        <div className="tabs-content clearfix">

                          <div class="tab-info active" style={{ display: 'block' }}>
                            <div className="col-12 mt-3">
                              <strong>Your offer must be greater than: {this.state.maxBid} MATIC </strong>
                            </div>
                            <div className="col-12 mt-3">
                              <div className="input-group">
                                <div className="input-group-prepend" style={{ backgroundColor: "#fff" }}>
                                  <span className="input-group-text"> MATIC </span>
                                </div>
                                <input type="text" className="form-control currency  ccbid-price"
                                  placeholder="Offer amount" onKeyPress={(event) => {
                                    if (!/^\d*[.]?\d{0,1}$/.test(event.key)) {
                                      event.preventDefault();
                                    }
                                  }} id="bidAmountCC" name="bid_price" value={this.state.bid_price} onChange={this.onChange} required="" />
                              </div>

                              {this.state.Biderror === 1 ?
                                <p style={{ color: 'red' }}>Bid price should be greater than {this.state.nftDetails?.max_bid}</p> : ''
                              }

                            </div>

                            {this.state.nftDetails?.nft_type_select == 1 ?
                              <div className="be-large-post">
                                {/* <h2 class="mt-5 mb-5">Create Collection</h2> */}
                                <div className="spacer-single" />

                                <div className="socail_news row">
                                  <div className='col-md-6'>
                                    <h5>Mobile Number</h5>
                                    <input type="number" placeholder='Enter mobile number' name="mobile_number" onChange={this.handleChange1} value={this.state.aboutData?.mobile_number} className="form-control mb-4" />
                                  </div>

                                  <div className='col-md-6'>
                                    <h5>Pin Code</h5>
                                    <input type="text" placeholder='Enter Pin Code' name="pin_code" onChange={this.handleChange1} value={this.state.aboutData?.pin_code} className="form-control mb-4" />
                                  </div>
                                </div>


                                <div className="socail_news row">


                                  <div className='col-md-12'>
                                    <h5>Address</h5>
                                    <textarea placeholder='Enter shipping address' name="shipping_address" onChange={this.handleChange1} value={this.state.aboutData?.shipping_address} className="form-control mb-4" rows="4" cols="50">

                                    </textarea>
                                  </div>
                                </div>


                                <div className="socail_news row">

                                  <div className='col-md-6'>
                                    <h5>Locality</h5>
                                    <input type="text" placeholder='Enter Locality' name="locality" onChange={this.handleChange1} value={this.state.aboutData?.locality} className="form-control mb-4" />
                                  </div>

                                  <div className='col-md-6'>
                                    <h5>City</h5>
                                    <input type="text" placeholder='Enter city' name="city" onChange={this.handleChange1} value={this.state.aboutData?.city} className="form-control mb-4" />
                                  </div>


                                </div>

                                <div className="socail_news row">
                                  <div className='col-md-6'>
                                    <h5>State</h5>
                                    <input type="text" placeholder='Enter state' name="state" onChange={this.handleChange1} value={this.state.aboutData?.state} className="form-control mb-4" />
                                  </div>
                                  <div className='col-md-6'>
                                    <h5>LandMark</h5>
                                    <input type="text" placeholder='Enter landmark' name="landmark" onChange={this.handleChange1} value={this.state.aboutData?.landmark} className="form-control mb-4" />
                                  </div>
                                </div>
                              </div> : ''
                            }

                            <div className="mt-4">
                              <div className="col-12 nopadding">
                                <span style={{ color: 'red', fontFamily: 'cursive', textAlign: 'center' }}>{this.state.ErrorMessage}</span>

                                <div className="my-3 text-center">
                                  {(this.state.cryptoPayBtnDesable) ?
                                    <button className="btn-main btn-lg mb-3" title="Place Bid"
                                      mptrackaction="nux:giveapproval" disabled>Processing...</button>
                                    :
                                    <button className="btn-main btn-lg mb-3" title="Place Bid"
                                      mptrackaction="nux:giveapproval" disabled={!this.state.bid_price}
                                      onClick={this.bidPlaced.bind(this)}>Place Bid</button>
                                  }

                                </div>
                              </div>
                            </div>
                          </div>

                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>



        <div className={this.state.physicalNftShow == true ? 'modal fade in show' : 'modal fade'} style={{ display: this.state.physicalNftShow == true ? 'block' : 'none' }} id="createCollection" tabindex="-1" aria-labelledby="createCollectionLabel" aria-hidden="true">
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="createCollectionLabel">Shipping Address</h5>
                <button type="submit" className="btn-close" onClick={this.closeModel.bind(this)}></button>
              </div>
              <div className="modal-body">
                <div className="row">
                  <div className="col-sm-12 col-xs-12">
                    <div className="tab-content create-collection" id="v-pills-tabContent">
                      <div className="be-large-post">
                        {/* <h2 class="mt-5 mb-5">Create Collection</h2> */}
                        <div className="spacer-single" />

                        <div className="socail_news row">
                          <div className='col-md-6'>
                            <h5>Mobile Number</h5>
                            <input type="number" placeholder='Enter mobile number' name="mobile_number" onChange={this.handleChange1} value={this.state.aboutData?.mobile_number} className="form-control mb-4" />
                          </div>

                          <div className='col-md-6'>
                            <h5>Pin Code</h5>
                            <input type="text" placeholder='Enter Pin Code' name="pin_code" onChange={this.handleChange1} value={this.state.aboutData?.pin_code} className="form-control mb-4" />
                          </div>
                        </div>


                        <div className="socail_news row">


                          <div className='col-md-12'>
                            <h5>Address</h5>
                            <textarea placeholder='Enter shipping address' name="shipping_address" onChange={this.handleChange1} value={this.state.aboutData?.shipping_address} className="form-control mb-4" rows="4" cols="50">

                            </textarea>
                          </div>
                        </div>


                        <div className="socail_news row">

                          <div className='col-md-6'>
                            <h5>Locality</h5>
                            <input type="text" placeholder='Enter Locality' name="locality" onChange={this.handleChange1} value={this.state.aboutData?.locality} className="form-control mb-4" />
                          </div>

                          <div className='col-md-6'>
                            <h5>City</h5>
                            <input type="text" placeholder='Enter city' name="city" onChange={this.handleChange1} value={this.state.aboutData?.city} className="form-control mb-4" />
                          </div>


                        </div>

                        <div className="socail_news row">
                          <div className='col-md-6'>
                            <h5>State</h5>
                            <input type="text" placeholder='Enter state' name="state" onChange={this.handleChange1} value={this.state.aboutData?.state} className="form-control mb-4" />
                          </div>
                          <div className='col-md-6'>
                            <h5>LandMark</h5>
                            <input type="text" placeholder='Enter landmark' name="landmark" onChange={this.handleChange1} value={this.state.aboutData?.landmark} className="form-control mb-4" />
                          </div>



                        </div>


                        <div className="socail_news mt-4">
                          <button id="submit" className="btn-main" type="submit" onClick={this.NftPurchasePhysical.bind(this)}  >Buy</button>
                        </div>
                      </div>

                    </div>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={this.closeModel.bind(this)}>Close</button>
              </div>
            </div>
          </div>
        </div>


        {/* <div className={this.state.isSocial === 0 ? "modal fade" : "modal fade show"} id="productShareSheet" style={{ display: this.state.isSocial === 0 ? 'none' : 'block' }} tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true" data-backdrop="false">
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="exampleModalLabel">Share this Creation</h5>
                <button type="button" className="close" data-dismiss="modal" style={{
                  fontSize: '26px'
                }} aria-label="Close" onClick={this.modalShow.bind(this, 0)} >
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="modal-body">
                <div className="col-sm-12">
                  <div className="row text-center">
                    <div className="col-sm-2">
                    </div>
                    <div className="col-sm-8">
                      <div className="row">
                        <div className="d-inline-block col-sm-4 col-xs-4 text-center mb-3">
                          <FacebookShareButton
                            url={`${config.imageUrl}${this.state.nftDetails?.image}`}
                            quote={this.state.nftDetails?.name + '-' + "\n" + this.state.nftDetails?.description}

                            className="Demo__some-network__share-button">
                            <FacebookIcon target="_blank"
                              size={32}
                              round />
                          </FacebookShareButton>
                          <br />
                          <span className="mt-1 d-block">Facebook</span>
                        </div>
                        <div className="d-inline-block col-sm-4 col-xs-4 text-center mb-3 pb-1">
                          <TwitterShareButton
                            url={window.location.href}
                            title={this.state.nftDetails?.name + '-' + "\n" + this.state.nftDetails?.description}
                            className="Demo__some-network__share-button">
                            <TwitterIcon
                              size={32}
                              round />
                          </TwitterShareButton>
                          <br />
                          <span className="mt-1 d-block">Twitter</span>
                        </div>
                        <div className="d-inline-block col-sm-4 col-xs-4 text-center mb-3 pb-4">
                          <EmailShareButton
                            url={window.location.href}

                            subject={"Check out this Rare Digital Art Work from Infinity 8" + "\n" + this.state.nftDetails?.name + '-' + "\n" + this.state.nftDetails?.description}
                            body={"hey there, pls share my link" + <a href={window.location.href}></a>}
                            className="Demo__some-network__share-button">
                            <EmailIcon
                              size={32}
                              round />
                          </EmailShareButton>
                          <br />
                          <span className="mt-1 d-block">Email</span>
                        </div>
                      </div>
                    </div>
                    <div className="col-sm-2"></div>
                  </div>
                </div>
                <div className="row text-center">
                  <div className="col-sm-3"></div>
                  <div className="d-inline-block col-sm-3 col-xs-6 text-center mb-3 pb-1">
                    <WhatsappShareButton
                      url={window.location.href}
                      title={this.state.nftDetails?.name + '-' + "\n" + "Check out this Rare Digital Art Work from Infinity 8" + "\n" + this.state.nftDetails?.description + "\n"}
                      className="Demo__some-network__share-button">
                      <WhatsappIcon
                        size={32}
                        round />
                    </WhatsappShareButton>
                    <br />
                    <span className="mt-1 d-block">WhatsApp</span>
                  </div>
                  <div className="d-inline-block col-sm-3 col-xs-6 text-center mb-3 pb-1" style={{ margin: '-24px', marginLeft: '2px' }}>
                    <br />
                    <CopyToClipboard text={window.location.href}
                      onCopy={() => this.setState({ copied: true })}>
                      <img src="images/copy-link.png" style={{ cursor: 'pointer' }} className="link-copy" />
                    </CopyToClipboard>
                    {this.state.copied ? <span className="mt-1 d-block">Copied!</span> : <span className="mt-1 d-block">Copy link</span>}
                  </div>
                  <div className="col-sm-3"></div>
                </div>
              </div>
            </div>
          </div>
        </div> */}
      </>
    )
  }
}
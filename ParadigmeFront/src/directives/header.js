import React, { Component } from 'react';
import config from '../config/config'
import { BrowserView, MobileView } from 'react-device-detect';
import Cookies from 'js-cookie'
import { Link } from 'react-router-dom'
import Onboard from 'bnc-onboard'
import axios from 'axios';
import Web3 from 'web3';
// import { ToastContainer, toast } from 'react-toastify';
import WalletConnect from "@walletconnect/client";
import toast, { Toaster } from 'react-hot-toast';
import QRCodeModal from "@walletconnect/qrcode-modal";
import $ from 'jquery';
let web3;

const onboard = Onboard({
  dappId: "a830de3a-cbe0-4fc2-9242-5c9c406f6fb2",
  networkId: 0x3,
  subscriptions: {
    wallet: wallet => {
      web3 = new Web3(wallet.provider)
    }
  },

  walletSelect: {
    wallets: [
      {
        walletName: 'metamask'
      }
    ]
  }
});


async function openMetamask() {
  $('#walletModel').hide();
  await onboard.walletSelect();
}

export default class header extends Component {

  constructor(props) {
    super(props)
    this.state = {
      profileData: '',
      profilepic: '',
      userAddress: '',
      lastSeg: '',
      searchData: '',
      lastParam: '',
      searchDataList: [],
      selectedTab: '1',
      ConnectWalletAddress: ''
    }
    this.loginData = (!Cookies.get('loginSuccessParadigme')) ? [] : JSON.parse(Cookies.get('loginSuccessParadigme'))
    this.onChange = this.onChange.bind(this)
    this.connectMetasmask = this.connectMetasmask.bind(this)
    this.setTabAPI = this.setTabAPI.bind(this)
  }

  componentDidMount() {
    window.scrollTo({ top: 0 });
    var url = window.location.href;
    var result = url.split('/');
    var Param = result[result.length - 2];
    var lastParam = result[result.length - 1];
    this.setState({
      'lastSeg': Param,
      'lastParam': lastParam
    })
    this.getUserData()
    // this.connectMetasmask()

    if (Cookies.get('loginSuccessParadigme')) {
      if (window.ethereum) {
        window.ethereum.on('accountsChanged', function (accounts) {
          Cookies.remove('loginSuccessParadigme')
          setTimeout(() => {
            window.location.href = `${config.baseUrl}`
          });
        })
      }
    }

    setTimeout(() => {
      if (window.ethereum) {
        const { ethereum } = window;
        this.setState({
          ConnectWalletAddress: ethereum.selectedAddress
        })
      }
    }, 1000);
  }

  async connectMetasmaskDapp() {
    await onboard.walletSelect();
  }

  async connectMetasmask() {
    if (window.ethereum) {
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      console.log('accounts[0]', accounts[0]);
      this.loginAPI(accounts[0])
    }
    else {
      // toast.error(`Please use dApp browser to connect wallet!`);
      openMetamask()
    }
  }

  connectWallet = () => {
    console.log('QRCodeModal', QRCodeModal);
    const connector = new WalletConnect({
      bridge: "https://bridge.walletconnect.org",
      qrcodeModal: QRCodeModal,
    });

    if (!connector.connected) {
      connector.createSession();
    }
    connector.on("connect", (error, payload) => {
      if (error) {
        throw error;
      }
      const { accounts, chainId } = payload.params[0];
      this.loginAPI(accounts[0])
    });
  }

  async loginAPI(address) {
    console.log('address', address);
    await axios({
      method: 'post',
      url: `${config.apiUrl}login`,
      data: { "address": address }
    }).then(response => {
      if (response.data.success === true) {
        toast.success('Wallet Connected!!.');
        Cookies.set('loginSuccessParadigme', JSON.stringify(response.data.data));
        Cookies.set('token', JSON.stringify(response.data.Token));
        setTimeout(() => {
          // window.location.href = `${config.baseUrl}accountSetting`
          window.location.reload();
        }, 2000);
      }
    })
  }

  onChange = e => {
    this.setState({
      [e.target.name]: e.target.value
    })

    if (e.target.name === 'searchData') {
      this.allSearchAPI(e.target.value)
    }
  }

  async getUserData() {

    let userdata = this.loginData;
    this.setState({
      profilepic: userdata.profile_pic
    })
  }

  async getUserData() {
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


  logout() {

    var cookies = document.cookie;
    for (var i = 0; i < cookies.split(";").length; ++i) {
      var myCookie = cookies[i];
      var pos = myCookie.indexOf("=");
      var name = pos > -1 ? myCookie.substr(0, pos) : myCookie;
      document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
    }

    localStorage.clear();

    Cookies.remove('loginSuccessParadigme');
    Cookies.remove('token');
    window.localStorage.clear();
    setTimeout(() => {
      window.location.href = `${config.baseUrl}`
    });
  }


  //======================================= all search API c ========================================

  async allSearchAPI(id) {
    // e.preventDefault()
    await axios({
      method: 'post',
      url: `${config.apiUrl}allSearch`,
      headers: { "Authorization": this.loginData?.message },
      data: { "search": id }
    }).then(response => {
      if (response.data.success === true) {
        var obj1 = (response.data.response.findIndex(o => o.type === 'talent'));
        var obj = (response.data.response.findIndex(o => o.type === 'nft'));

        this.setState({
          talentIndex: obj1,
          nftIndex: obj,
          searchDataList: response.data.response
        })

      }
      else if (response.data.success === false) {
      }
    }).catch(err => {
      this.setState({
        searchDataList: []
      })


    })
  }

  loading(id) {
    setTimeout(() => {
      window.location.href = `${config.baseUrl}UserProfile/${id}`
      window.location.reload(true)
    }, 500);
  }

  loadingGroup(id) {
    setTimeout(() => {
      window.location.href = `${config.baseUrl}nftDetails/${id}`
      window.location.reload(true)
    }, 500);
  }

  async setTabAPI(type) {
    localStorage.setItem('type', type)

    // e.preventDefault()
    // console.log("lll",e.target.id,this.props);

    // this.props.headerData(e.target.id)
  }

  loadingpage() {
    setTimeout(() => {
      window.location.reload()
    }, 500);
  }

  render() {
    return (
      <>
        <Toaster />
        {/* <header className="transparent" style={{ borderBottom: '1px solid rgb(241 241 241)', background: window.location.href.substring(window.location.href.lastIndexOf('/') + 1) === 'marketplace' || this.state.lastParam == 'nftDetails' || this.state.lastParam == 'UserProfile' || this.state.lastParam == 'collections' || this.state.lastParam == 'createnft' || this.state.lastParam == 'accountSetting' || this.state.lastParam == 'createcollection' || this.state.lastSeg == 'UserProfile'  ? '#fff' : 'transparent' }}> */}

        <header className="transparent" style={{ background: this.state.lastParam != 'paradigme' ? 'transparent' : 'transparent' }}>

          <div className="container">
            <div className="row">
              <div className="col-md-12">
                <div className="de-flex ">
                  <div className="de-flex-col">
                    <div className="de-flex-col">
                      <div id="logo">
                        <a href={`${config.baseUrl}`}>
                          <img alt="" className="logo" src="images/logo.png" width="200px" />
                          <img alt="" className="logo-2" src="images/logo.png" />
                        </a>
                      </div>
                    </div>

                  </div>
                  {Cookies.get('loginSuccessParadigme') ?
                    <div className="de-flex-col header-col-mid">
                      <ul id="mainmenu" className='mt-0' >
                        <li>
                          <div className="de-flex-col">
                            <form className="input-search" onSubmit={(e => e.preventDefault())}>
                              <input id="quick_search" autoComplete="off" className="xs-hide" value={this.state.searchData} name="searchData" onChange={this.onChange} placeholder="Search here..." type="text" />
                              <ul className="search_ul" style={{ display: this.state.searchDataList.length === 0 ? 'none' : 'block', overflowX: 'hidden' }}>
                                {this.state.searchDataList.map((item, i) => {

                                  return (
                                    (item.type == 'talent') ?
                                      <>
                                        {(this.state.talentIndex == i) ?
                                          <li className="mobile-font" style={{ cursor: 'pointer', textAlign: 'left', width: '100%', color: '#000', height: 'auto', paddingTop: '20px', borderBottom: '1px solid #ddd', marginBottom: '15px' }} >People</li>
                                          : ''}

                                        {/* <p style={{color:'#000'}}>People</p> */}
                                        <li style={{ cursor: 'pointer', textAlign: 'left', width: '100%', color: '#000', height: '48px' }} title={item.full_name} >
                                          <Link to={`${config.baseUrl}UserProfile/${item.id}`} onClick={this.loading.bind(this, item.id)}>
                                            <img src={item.profile_pic === null || item.profile_pic === '' || item.profile_pic === undefined || item.profile_pic === 'null' || item.profile_pic === 'undefined'
                                              ? 'images/default-user-icon.jpg'
                                              :
                                              `${config.imageUrl1}${item.profile_pic}`} style={{ height: '35px', width: '35px', borderRadius: '50%' }} alt="" />
                                            <span data-id={item.id} style={{ marginLeft: "10px", top: "-7px", color: "rgba(0, 0, 0, 0.87)" }}>{item.full_name}</span>
                                            <br />
                                            <span data-id={item.id} style={{ marginLeft: "42px", top: "-21px", color: "rgba(0, 0, 0, 0.54)" }}>@{item.user_name}</span>


                                          </Link>
                                        </li></>
                                      :
                                      item.type == 'nft' ?
                                        <>
                                          {(this.state.nftIndex == i) ?
                                            <li className="mobile-font" style={{ cursor: 'pointer', textAlign: 'left', width: '100%', color: '#000', height: 'auto', paddingTop: '20px', borderBottom: '1px solid #ddd', marginBottom: '15px' }} >NFT</li>
                                            : ''}
                                          <li style={{ cursor: 'pointer', textAlign: 'left', width: '100%', color: '#000', height: '48px' }} title={item.full_name} >
                                            <Link to={`${config.baseUrl}nftDetails/${item.id}`} onClick={this.loadingGroup.bind(this, item.id)}>
                                              {!item.profile_pic || item.profile_pic == '' || item.profile_pic == undefined || item.profile_pic == 'undefined' || item.profile_pic == null || item.profile_pic == 'null' ?
                                                <img effect="blur" style={{ height: '35px', width: '35px', borderRadius: '50%' }} src={`images/no-image.jpg`} alt="omg" />
                                                :
                                                item.file_type === 'image' ?
                                                  <img effect="blur" style={{ height: '35px', width: '35px', borderRadius: '50%' }} src={`${config.imageUrl}${item.profile_pic}`} alt="omg" /> :
                                                  item.file_type === 'video' ?
                                                    <img src="images/youtube-logo2.jpg" style={{ height: '35px', width: '35px', borderRadius: '50%' }} />
                                                    :
                                                    <img effect="blur" style={{ height: '35px', width: '35px', borderRadius: '50%' }} src={`images/no-image.jpg`} alt="omg" />
                                              }
                                              <span data-id={item.id} style={{ marginLeft: "10px", top: "-7px", color: "rgba(0, 0, 0, 0.87)" }}>{item.full_name}</span>
                                              <br />

                                            </Link>
                                          </li>
                                        </> : ""
                                  )
                                })}
                              </ul>
                            </form>
                          </div>
                        </li>
                        <li>
                          <a href={`${config.baseUrl}marketplace`}>Marketplace<span /></a>
                        </li>
                        <li>
                          <a href={`${config.baseUrl}adminNfts`}>Admin Nft's<span /></a>
                        </li>
                        <li>
                          {this.loginData.length === 0 ?
                            ""
                            :
                            <a href={`${config.baseUrl}createnft`}> Create NFT <span /></a>
                          }
                        </li>


                        <li>
                          <a target="_blank" href={`${config.blockchinUrl}${this.loginData?.address}`} className="btn btn-main btn-lg">
                            {this.loginData?.address.toString().substring(0, 5) + '...' + this.loginData?.address.toString().substr(this.loginData?.address.length - 5)}</a>
                        </li>
                        <li className="dropdown-profile">
                          <Link to="#" className='login-user'>
                            {!this.state.aboutData?.profile_pic || this.state.aboutData?.profile_pic === '' || this.state.aboutData?.profile_pic === null || this.state.aboutData?.profile_pic === 'null' ?
                              <img src="images/default-user-icon.jpg" className="" alt="" width="50px" /> : <img className="image-auth login-user" style={{ height: '40px', width: '40px', objectFit: 'cover' }} src={`${config.imageUrl1}${this.state.aboutData?.profile_pic}`} alt="" />}
                            &nbsp;Profile</Link>
                          <ul>
                            <li><a onClick={this.loadingpage.bind(this)} href={`${config.baseUrl}UserProfile/` + this.loginData?.id}>My profile</a></li>
                            <li><a onClick={this.setTabAPI.bind(this, 1)} href={`${config.baseUrl}accountsetting`}>Portfolio</a></li>
                            <li><a onClick={this.setTabAPI.bind(this, 2)} href={`${config.baseUrl}accountsetting`}>Bids</a></li>
                            <li><a onClick={this.setTabAPI.bind(this, 3)} href={`${config.baseUrl}accountsetting`}>Transaction History</a></li>
                            <li><a onClick={this.setTabAPI.bind(this, 5)} href={`${config.baseUrl}accountsetting`}>Account Setting</a></li>
                            <li><a onClick={this.setTabAPI.bind(this, 6)} href={`${config.baseUrl}accountsetting`}>Collections</a></li>

                            <li><Link to={`${config.baseUrl}`} onClick={this.logout.bind(this)}>Logout</Link></li>

                          </ul>
                        </li>

                      </ul>
                      <div className="menu_side_area">
                        <span id="menu-btn" style={{}} />
                      </div>
                    </div>
                    :
                    <div className="de-flex-col header-col-mid">
                      <ul id="mainmenu" className='mt-0'>
                        <li>
                          <div className="de-flex-col">
                            <form className="input-search" onSubmit={(e => e.preventDefault())}>
                              <input id="quick_search" autoComplete="off" className="xs-hide" value={this.state.searchData} name="searchData" onChange={this.onChange} placeholder="Search here..." type="text" />
                              <ul className="search_ul" style={{ display: this.state.searchDataList.length === 0 ? 'none' : 'block', overflowX: 'hidden' }}>
                                {this.state.searchDataList.map((item, i) => {

                                  return (
                                    (item.type == 'talent') ?
                                      <>
                                        {(this.state.talentIndex == i) ?
                                          <li className="mobile-font" style={{ cursor: 'pointer', textAlign: 'left', width: '100%', color: '#000', height: 'auto', paddingTop: '20px', borderBottom: '1px solid #ddd', marginBottom: '15px' }} >People</li>
                                          : ''}

                                        <li style={{ cursor: 'pointer', textAlign: 'left', width: '100%', color: '#000', height: '48px' }} title={item.full_name} >
                                          <Link to={`${config.baseUrl}UserProfile/${item.id}`} onClick={this.loading.bind(this, item.id)}>
                                            <img src={item.profile_pic === null || item.profile_pic === '' || item.profile_pic === undefined || item.profile_pic === 'null' || item.profile_pic === 'undefined'
                                              ? 'images/default-user-icon.jpg'
                                              :
                                              `${config.imageUrl1}${item.profile_pic}`} style={{ height: '35px', width: '35px', borderRadius: '50%' }} alt="" />
                                            <span data-id={item.id} style={{ marginLeft: "10px", top: "-7px", color: "rgba(0, 0, 0, 0.87)" }}>{item.full_name}</span>
                                            <br />
                                            <span data-id={item.id} style={{ marginLeft: "42px", top: "-21px", color: "rgba(0, 0, 0, 0.54)" }}>@{item.user_name}</span>


                                          </Link>
                                        </li></>
                                      :
                                      item.type == 'nft' ?
                                        <>
                                          {(this.state.nftIndex == i) ?
                                            <li className="mobile-font" style={{ cursor: 'pointer', textAlign: 'left', width: '100%', color: '#000', height: 'auto', paddingTop: '20px', borderBottom: '1px solid #ddd', marginBottom: '15px' }} >NFT</li>
                                            : ''}
                                          <li style={{ cursor: 'pointer', textAlign: 'left', width: '100%', color: '#000', height: '48px' }} title={item.full_name} >
                                            <Link to={`${config.baseUrl}nftDetails/${item.id}`} onClick={this.loadingGroup.bind(this, item.id)}>
                                              {!item.profile_pic || item.profile_pic == '' || item.profile_pic == undefined || item.profile_pic == 'undefined' || item.profile_pic == null || item.profile_pic == 'null' ?
                                                <img effect="blur" style={{ height: '35px', width: '35px', borderRadius: '50%' }} src={`images/no-image.jpg`} alt="omg" />
                                                :
                                                item.file_type === 'image' ?
                                                  <img effect="blur" style={{ height: '35px', width: '35px', borderRadius: '50%' }} src={`${config.imageUrl}${item.profile_pic}`} alt="omg" /> :
                                                  item.file_type === 'video' ?
                                                    <img src="images/youtube-logo2.jpg" style={{ height: '35px', width: '35px', borderRadius: '50%' }} />
                                                    :
                                                    <img effect="blur" style={{ height: '35px', width: '35px', borderRadius: '50%' }} src={`images/no-image.jpg`} alt="omg" />
                                              }
                                              <span data-id={item.id} style={{ marginLeft: "10px", top: "-7px", color: "rgba(0, 0, 0, 0.87)" }}>{item.full_name}</span>
                                              <br />

                                            </Link>
                                          </li>
                                        </> : ""
                                  )
                                })}
                              </ul>
                            </form>
                          </div>
                        </li>
                        <li>
                          <a onClick={this.loadingpage.bind(this)} href={`${config.baseUrl}marketplace`}>Marketplace<span /></a>
                        </li>
                        <li>
                          <a href={`${config.baseUrl}adminNfts`}>Admin Nft's<span /></a>
                        </li>
                        <li>
                          {this.loginData.length === 0 ?
                            ""
                            :
                            <a href={`${config.baseUrl}createnft`}> Create NFT </a>
                          }
                        </li>




                        <li>
                          <a href="javascript:void(0)" className="btn btn-main btn-lg" data-bs-toggle="modal" data-bs-target="#walletModel">
                            Connect Wallet
                          </a>
                          {/* <a href="javascript:void(0)" className="btn btn-main btn-lg" >
                            Connect Wallet
                          </a> */}

                        </li>
                      </ul>
                      <div className="menu_side_area">
                        <span id="menu-btn" style={{}} />
                      </div>
                    </div>}
                </div>
              </div>
            </div>
          </div>
        </header>

        <div className="modal fade" id="walletModel" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="walletModelLabel" aria-hidden="true">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="walletModelLabel">Wallet Connect</h5>
              </div>
              <div className="modal-body">
                {/* <MobileView>
                  <button className="btn color-3 Connect_wallet_btn" id="metamask_btn" onClick={e => this.connectMetasmaskDapp()}><img height="50px" src="https://cdn.iconscout.com/icon/free/png-256/metamask-2728406-2261817.png" className="wallet_icons" /><span style={{ marginLeft: '15px' }}>Metamask</span></button>
                </MobileView>

                <BrowserView>
                  <button className="btn color-3 Connect_wallet_btn" id="metamask_btn" onClick={e => this.connectMetasmask()}><img height="50px" src="https://cdn.iconscout.com/icon/free/png-256/metamask-2728406-2261817.png" className="wallet_icons" /><span style={{ marginLeft: '15px' }}>Metamask</span></button>
                </BrowserView> */}

                <button className="btn color-3 Connect_wallet_btn" id="metamask_btn" onClick={e => this.connectMetasmask()}><img height="50px" src="https://cdn.iconscout.com/icon/free/png-256/metamask-2728406-2261817.png" className="wallet_icons" /><span style={{ marginLeft: '15px' }}>Metamask</span></button>

                <button className="btn color-3 Connect_wallet_btn " id="metamask_btn" onClick={e => this.connectWallet()} ><img height="50px" src="https://www.nuget.org/profiles/WalletConnect/avatar?imageSize=512" className="wallet_icons" /><span style={{ marginLeft: '15px' }}>Wallet Connect</span></button>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
              </div>
            </div>
          </div>
        </div>

      </>
    )
  }
}
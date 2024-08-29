import React, { Component } from 'react';
import axios from 'axios';
import Header from '../directives/header'
import Footer from '../directives/footer'
import config from '../config/config'
import Carousel from "react-multi-carousel";
import Cookies from 'js-cookie';
import moment from 'moment'
import { Link } from 'react-router-dom'
import toast, { Toaster } from 'react-hot-toast';
import "react-multi-carousel/lib/styles.css";
import Countdown, { zeroPad } from 'react-countdown';
import { Player } from 'video-react';
import { Swiper, SwiperSlide } from "swiper/react";
import WalletConnect from "@walletconnect/client";
import QRCodeModal from "@walletconnect/qrcode-modal";
import ReactAudioPlayer from 'react-audio-player';
import {OBJModel} from 'react-3d-viewer'

// Import Swiper styles
import 'swiper/swiper-bundle.min.css'
import 'swiper/swiper.min.css'
import SwiperCore, {
    Pagination, Navigation
} from 'swiper';


import $ from 'jquery';

import Onboard from 'bnc-onboard'
import Web3 from 'web3';
let web3;

SwiperCore.use([Pagination, Navigation]);

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

// const particlesInit = async (main) => {
//     console.log(main);
//     await loadFull(main);
//   };

//   const particlesLoaded = (container) => {
//     console.log(container);
//   };

async function openMetamask() {
    $('#walletModel').hide();
    await onboard.walletSelect();
}

export default class home extends Component {

    constructor(props) {
        super(props)
        this.state = {
            ConnectWalletAddress: '',
            bannerNfts: [],
            trendingAuctionNfts: [],
            trendingNfts: [],
            allNfts: [],
            getItemAllNfts: '',
            tredingNfts: [],
            recentNfts: [],
            collections: [],
            getTopArtist: [],
            getBannerNFTData: '',
            getBannerNFTData1: '',
            responsive: {
                superLargeDesktop: {
                    // the naming can be any, depends on you.
                    breakpoint: { max: 4000, min: 3000 },
                    items: 6
                },
                desktop: {
                    breakpoint: { max: 3000, min: 1024 },
                    items: 6
                },
                tablet: {
                    breakpoint: { max: 1024, min: 464 },
                    items: 2
                },
                mobile: {
                    breakpoint: { max: 464, min: 0 },
                    items: 1
                }
            }
        };

        this.loginData = (!Cookies.get('loginSuccessParadigme')) ? [] : JSON.parse(Cookies.get('loginSuccessParadigme'))
    }

    componentDidMount() {
        this.trendingAuctionNftsAPI()
        this.trendingNftsAPI()
        this.allNftsAPIAPI()
        this.collectionListAPI()
        this.totalNfts()
        this.bannerNftsAPI()
        this.getBannerNFTAPI()
        this.getartistAPI()
    }


    async bannerNftsAPI() {
        await axios({
            method: 'get',
            url: `${config.apiUrl}getBannerNFT`,
        }).then((res) => {
            if (res.data.success === true) {
                this.setState({
                    getBannerNFTData: res.data.response[0],
                    getBannerNFTData1: res.data.response[1]
                })
            }
        }).catch((error) => {

        })
    }

    async trendingAuctionNftsAPI() {
        await axios({
            method: 'post',
            url: `${config.apiUrl}trendingNfts`,
            data: { 'type': 2 }
        }).then((res) => {
            if (res.data.success === true) {
                this.setState({
                    trendingAuctionNfts: res.data.response
                })
            }
        }).catch((error) => {

        })
    }

    async totalNfts() {
        await axios({
            method: 'get',
            url: `${config.apiUrl}getItemAll`,
            data: {}
        }).then((res) => {
            if (res.data.success === true) {
                this.setState({
                    getItemAllNfts: res.data.response
                })
            }
        }).catch((error) => {

        })
    }

    async getBannerNFTAPI() {
        await axios({
            method: 'get',
            url: `${config.apiUrl}getBannerNFT`
        }).then((res) => {
            if (res.data.success === true) {
                this.setState({
                    bannerNfts: res.data.response
                })
            }
        }).catch((error) => {

        })
    }

    async getartistAPI() {
        await axios({
            method: 'get',
            url: `${config.apiUrl}getTopArtist`
        }).then((res) => {
            if (res.data.success === true) {
                this.setState({
                    getTopArtist: res.data.response
                })
            }
        }).catch((error) => {

        })
    }

    async trendingNftsAPI() {
        await axios({
            method: 'post',
            url: `${config.apiUrl}trendingNfts`,
            data: { 'type': 1 }
        }).then((res) => {
            if (res.data.success === true) {
                this.setState({
                    trendingNfts: res.data.response
                })
            }
        }).catch((error) => {

        })
    }

    async allNftsAPIAPI() {
        await axios({
            method: 'post',
            url: `${config.apiUrl}trendingNfts`,
            data: {}
        }).then((res) => {
            if (res.data.success === true) {
                this.setState({
                    allNfts: res.data.response
                })
            }
        }).catch((error) => {

        })
    }

    async collectionListAPI() {
        await axios({
            method: 'post',
            url: `${config.apiUrl}getHomeCollections`,
            data: {
                "limit": "0"
            }
        }).then((res) => {
            if (res.data.success === true) {
                this.setState({
                    collections: res.data.response
                })
            }

        }).catch((error) => {

        })
    }

    loadingData() {
        setTimeout(() => {
            window.location.reload()
        }, 500);
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

    alreadyConnectWallet() {
        toast.success('Already connected!!');
    }

    notLogin() {
        toast.error('Please connect wallet!!');
    }

    render() {



        return (
            <>
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

                <div id="wrapper">
                    <Header />
                    <Toaster />
                    <div className="no-bottom no-top" id="content">
                        <div id="top"></div>

                        <section id="section-hero" aria-label="section" className="pt20 pb20 section-hero" >
                            <div className='video-container'>
                                <video width="100%" height="" autoPlay muted loop className='banner_video' >
                                    <source src="images/vecteezy_traveling.mp4" type="video/mp4" />
                                </video>
                                <div class="overlay"></div>
                            </div>

                            <div class="hero-bg-left absolute -bottom-52 left-0 -z-10">


                            </div>

                            <div className="v-center">
                                <div className="container">
                                    <div className="row align-items-center">
                                        <div className='col-lg-2 col-md-12 col-sm-12 col-xs-12'>

                                        </div>
                                        <div className="col-lg-8 col-md-12 col-sm-12 col-xs-12 mb-4 text-center">
                                            <div className="spacer-single" />
                                            <div className="spacer-10" />
                                            <h1 className="wow fadeInUp" data-wow-delay=".75s">Discover rare <span className="id-color-2">artworks</span> by world class artists</h1>
                                            <p className="wow fadeInUp lead" data-wow-delay="1s">
                                                Unit of data stored on a digital ledger, called a blockchain, that certifies a digital asset to be unique and therefore not interchangeable</p>
                                            <div className="spacer-10" />
                                            <Link to={`${config.baseUrl}marketplace`} className="btn-main wow fadeInUp lead" data-wow-delay="1.25s">Marketplace</Link>
                                            <div class="row">
                                                <div class="spacer-single"></div>
                                                <div class="row">
                                                    <div className='col-lg-2 col-md-2 col-sm-2 col-12 wow fadeInRight mb30'>

                                                    </div>
                                                    <div className='col-lg-8 col-md-8 col-sm-8 col-12 wow fadeInRight mb30'>
                                                        <div className='row'>
                                                            <div class="col-lg-4 col-md-4 col-sm-4 col-4 wow fadeInRight mb30" data-wow-delay="1.1s">
                                                                <div class="de_count">
                                                                    <h3><span>{this.state.getItemAllNfts.nft_count}</span></h3>
                                                                    <h5 class="id-color">Collectibles</h5>
                                                                </div>
                                                            </div>

                                                            <div class="col-lg-4 col-md-4 col-sm-4 col-4 wow fadeInRight mb30" data-wow-delay="1.4s">
                                                                <div class="de_count">
                                                                    <h3><span>{this.state.getItemAllNfts.auction_count ? this.state.getItemAllNfts.auction_count : 0}</span></h3>
                                                                    <h5 class="id-color">Auctions</h5>
                                                                </div>
                                                            </div>

                                                            <div class="col-lg-4 col-md-4 col-sm-4 col-4 wow fadeInRight mb30" data-wow-delay="1.7s">
                                                                <div class="de_count">
                                                                    <h3><span>{this.state.getItemAllNfts.creator_count}</span></h3>
                                                                    <h5 class="id-color">NFT Artist</h5>
                                                                </div>
                                                            </div>

                                                        </div>
                                                    </div>
                                                    <div className='col-lg-2 col-md-2 col-sm-2 col-12 wow fadeInRight mb30'>

                                                    </div>

                                                </div>

                                            </div>
                                            <div className="mb-sm-30" />
                                        </div>
                                        <div className='col-lg-2 col-md-12 col-sm-12 col-xs-12'>

                                        </div>

                                    </div>
                                </div>
                            </div>
                            <div className="banner-shape">
                                <div className="shape-circle1">
                                    <img src="images/circle1.png" alt="Images" />
                                </div>
                                <div className="shape-circle2">
                                    <img src="images/circle2.png" alt="Images" />
                                </div>
                            </div>

                        </section>



                        <section id="section-nfts" className="trending-nft">

                            <div className="container">
                                <div className="row">
                                    <div className="col-lg-6">
                                        <div className="text-left">

                                            <h2 className=" mbl-heading">Trending <span className='green'>auctions</span> 🔥</h2>
                                            <div className="small-border bg-color-2"></div>
                                        </div>
                                    </div>
                                    <div className="col-lg-6">
                                        <div className="text-right pt-2">
                                            <Link to={`${config.baseUrl}marketplace`}><h4 className='green'>View All</h4></Link>
                                        </div>
                                    </div>
                                </div>
                                <div className="row wow fadeIn">
                                    <div className="col-sm-12">
                                        <div className="hot-auction bg-grey">
                                            <div className='row'>

                                                {this.state.allNfts.length == 0 ?
                                                    <span className='text-center '><img src='images/nodata-found.png' /></span>
                                                    :
                                                    this.state.allNfts.map(item => (
                                                        <div className='col-lg-4 col-md-6 mb-4'>
                                                            <div className='auction-list'>
                                                                <div className='profilebox'>
                                                                    {!item.owner_profile_pic || item.owner_profile_pic == "" || item.owner_profile_pic == 'undefined' || item.owner_profile_pic == 'null' ?
                                                                        <img src="images/default-user-icon.jpg" alt />
                                                                        :
                                                                        <img src={`${config.imageUrl1 + item.owner_profile_pic}`} />
                                                                    }
                                                                    <Link to={`${config.baseUrl}UserProfile/` + item.owner_id} >
                                                                        <h5>{item.owner_name}</h5>
                                                                    </Link>
                                                                </div>

                                                                <div class="auction-img" style={{ backgroundImage: item.file_type == 'audio' ? "url(./images/audio.jpeg)" : '', backgroundPosition: item.file_type == 'audio' ? "center" : '', position: item.file_type == 'audio' ? "relative" : '' }}>

                                                                    <Link to={`${config.baseUrl}nftDetails/` + item.id}>

                                                                        {item.file_type == 'image' ?
                                                                            <div className="">
                                                                                <img src={`${config.imageUrl}` + item.image} width="70px" />
                                                                            </div>
                                                                            :


                                                                            item.file_type == 'video' ?
                                                                                <video muted autoPlay width="70px" height="70px" controls>
                                                                                    <source src={`${config.imageUrl}${item.image}`} type="video/mp4" />
                                                                                </video>

                                                                                :
                                                                                item.file_type == 'audio' ?
                                                                                    <ReactAudioPlayer
                                                                                        className='audio-play'
                                                                                        src={`${config.imageUrl}${item.image}`}

                                                                                        controls
                                                                                    /> :  item?.file_type == 'OBJ' ?
                                                                                    <OBJModel src={`${config.imageUrl}${item?.image}`} texPath=""/>: ""


                                                                        }
                                                                    </Link>

                                                                </div>
                                                                <div className='profileboxdetail'>
                                                                    <Link to={`${config.baseUrl}collections/` + item.user_collection_id}>
                                                                        {!item.collection_image || item.collection_image == "" || item.collection_image == 'undefined' || item.collection_image == 'null' ?
                                                                            <img src="images/no-image.jpg" alt />
                                                                            :
                                                                            <img src={`${config.imageUrl1 + item.collection_image}`} />
                                                                        }
                                                                        {item.collection_name}
                                                                    </Link> <br />

                                                                    <Link to={`${config.baseUrl}nftDetails/` + item.id}>
                                                                        <h2 className='mbl-heading'>{item.name}</h2>
                                                                    </Link>
                                                                    <p style={{ float: 'right' }}>{item.nft_type_select == 1 ? 'Physical' : 'Digital'}</p>

                                                                </div>
                                                                <div className='nft-dark-box bg-dark'>
                                                                    <table width='100%'>
                                                                        <thead>
                                                                            <tr>
                                                                                <th><p>Price</p></th>
                                                                                <th className='text-right'><p>

                                                                                    {item.is_on_sale === 0 ? '' :
                                                                                        item.sell_type === 1 || item.expiry_date === null ? '' :
                                                                                            new Date(item.start_date) > new Date() ?
                                                                                                <>
                                                                                                    Sale start in
                                                                                                </>
                                                                                                :
                                                                                                new Date(item.expiry_date) > new Date() ?
                                                                                                    <>
                                                                                                        Sale ends in
                                                                                                    </>
                                                                                                    :
                                                                                                    "Sale ends"
                                                                                    }
                                                                                </p></th>
                                                                            </tr>
                                                                        </thead>
                                                                        <tbody>
                                                                            <tr>
                                                                                <td><p> {item.price} MATIC </p></td>
                                                                                <td className='text-right'>

                                                                                    {item.is_on_sale === 0 ? '' :
                                                                                        item.sell_type === 1 || item.expiry_date === null ? '' :
                                                                                            <div className="item_info_like"><i className="fa fa-clock-o" aria-hidden="true" />
                                                                                                {new Date(item.start_date) > new Date() ?
                                                                                                    <>
                                                                                                        {(item.start_date && item) ?
                                                                                                            <Countdown
                                                                                                                date={this.getTimeOfStartDate(item.start_date)}
                                                                                                                renderer={this.CountdownTimer}
                                                                                                            /> :
                                                                                                            <>
                                                                                                                <span className="days">{moment(item.start_date).diff(moment(), 'days')} day </span>
                                                                                                            </>
                                                                                                        }
                                                                                                    </>
                                                                                                    :
                                                                                                    new Date(item.expiry_date) > new Date() ?
                                                                                                        <>
                                                                                                            {(item.expiry_date && item) ?
                                                                                                                <Countdown
                                                                                                                    date={this.getTimeOfStartDate(item.expiry_date)}
                                                                                                                    renderer={this.CountdownTimer}
                                                                                                                /> :
                                                                                                                <>
                                                                                                                    <span className="days">{moment(item.expiry_date).diff(moment(), 'days')} day </span>
                                                                                                                </>
                                                                                                            }

                                                                                                        </>
                                                                                                        :
                                                                                                        "Sale ends"
                                                                                                }
                                                                                            </div>}
                                                                                </td>
                                                                            </tr>
                                                                        </tbody>
                                                                    </table>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))}

                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>

                        <section id="section-collections" className="trending-collection  recent-nft " data-bgimage="url(images/section-shape-3.png) bottom">
                            <div className="container">
                                <div className="row">
                                    <div className="col-lg-12">

                                        <div className="row mt-3 mb-5" style={{ backgroundSize: 'cover' }}
                                        ><div className="col-xl-9 col-lg-9 col-md-9 col-sm-12" style={{ backgroundSize: 'cover' }}>
                                                <div className="text-left">
                                                    <h2 className=" mbl-heading">Trending <span className='green'>collections</span> 🍱</h2>
                                                    <div className="small-border bg-color-2"></div>

                                                </div>
                                            </div>
                                            <div className="col-xl-3 col-lg-3 col-md-3 col-sm-12" style={{ backgroundSize: 'cover' }}>
                                                <div className="form-inline">
                                                    <div className="form-group col-sm-6"></div>
                                                    <div className="form-group col-sm-6 text-center">
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-sm-12">
                                        <div className='row'>
                                            {this.state.collections.length == 0 ?
                                                <span className='text-center '><img src='images/nodata-found.png' /></span>
                                                :
                                                this.state.collections.map(item => (
                                                    <div className='col-lg-4 col-md-6 mb-5'>
                                                        <div className="auction-list box-hover-effect">
                                                            <div className="auction-img">
                                                                <Link to={`${config.baseUrl}collections/` + item.id}>
                                                                    {!item.banner || item.banner == "" || item.banner == null || item.banner == 'null' || item.banner == 'undefined' ?
                                                                        <img src="images/default-user-icon.jpg" alt />
                                                                        :
                                                                        <img src={`${config.imageUrl1 + item.banner}`} alt />
                                                                    }
                                                                </Link>
                                                            </div>
                                                            <div className='chakra-stack css-1wdu7zf'>
                                                                <div className="d-flex">
                                                                    <div className="seaflightImage">

                                                                        {!item.profile_pic || item.profile_pic == "" || item.profile_pic == 'undefined' || item.profile_pic == 'null' ?
                                                                            <div style={{ backgroundImage: `images/default-user-icon.jpg` }} aria-label="Sea Flights" role="image" className="sea-img" />
                                                                            :
                                                                            <div style={{ backgroundImage: `url(${config.imageUrl1 + item.profile_pic})` }} aria-label="Sea Flights" role="image" className="sea-img" />
                                                                        }
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className='bottom'>

                                                                <div class="chakra-stack css-1npz8pa">
                                                                    <h3 class="chakra-text css-1yfa4pt mb-2">
                                                                        <Link to="#">{item.name ? item.name : ''}</Link></h3>
                                                                    <svg viewBox="0 0 24 24" focusable="false" class="chakra-icon chakra-icon css-100vr6x">
                                                                        <path d="" fill="currentColor"></path>
                                                                    </svg>
                                                                    <div class="css-17xejub"></div>
                                                                </div>
                                                                <div class="chakra-stack css-198f9j2">
                                                                    <Link class="chakra-link chakra-linkbox__overlay css-1me1ekj" to={`${config.baseUrl}UserProfile/` + item.userid}>
                                                                        <div className="nftprofile">
                                                                            <div className="nftprodetail">
                                                                                <div className="proimage">
                                                                                    {!item.user_profile || item.user_profile == "" || item.user_profile == null || item.user_profile == 'null' ?
                                                                                        <img src="images/default-user-icon.jpg" alt />
                                                                                        :
                                                                                        <img src={`${config.imageUrl1 + item.user_profile}`} alt />
                                                                                    }
                                                                                </div>
                                                                            </div>
                                                                            <div className="proheadname">{item.creater_name}</div>
                                                                        </div>
                                                                    </Link>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                        </div>
                                    </div>

                                </div>
                            </div>
                        </section>

                        <section id="section-nfts">
                            <div className="container">
                                <div className="row">
                                    <div className="col-xl-9 col-lg-9 col-md-9 col-sm-12 ">
                                        <div className="text-left">
                                            <h2 class=" mbl-heading">Trending <span className='green'>NFT</span>🐋</h2>
                                            <div className="small-border bg-color-2"></div>
                                        </div>
                                    </div>

                                    <div className="col-xl-3 col-lg-3 col-md-3 col-sm-12" style={{ backgroundSize: 'cover' }}>
                                        <div className="row">
                                            <div className="col-sm-6 text-center"></div>
                                            <div className="col-sm-6 text-right">
                                                <Link to={`${config.baseUrl}marketplace`}><h4 className='green'>View all</h4></Link>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="row wow fadeIn">
                                    <div className="col-sm-12">
                                        <div className="hot-auction">
                                            <div className='row'>
                                                {this.state.trendingNfts.length == 0 ?
                                                    <span className='text-center '><img src='images/nodata-found.png' /></span>
                                                    :
                                                    this.state.trendingNfts.map(item => (
                                                        <div className='col-lg-4 col-md-6 mb-4'>
                                                            <div className='auction-list'>
                                                                <div className='profilebox'>

                                                                    {!item.owner_profile_pic || item.owner_profile_pic == "" || item.owner_profile_pic == null || item.owner_profile_pic == 'null' ?
                                                                        <img src="images/default-user-icon.jpg" alt />
                                                                        :
                                                                        <img src={`${config.imageUrl1 + item.owner_profile_pic}`} />
                                                                    }

                                                                    <Link to={`${config.baseUrl}UserProfile/` + item.owner_id}>
                                                                        <h5>{item.owner_name}</h5>
                                                                    </Link>
                                                                </div>
                                                                <div class="auction-img" style={{ backgroundImage: item.file_type == 'audio' ? "url(./images/audio.jpeg)" : '', backgroundPosition: item.file_type == 'audio' ? "center" : '', position: item.file_type == 'audio' ? "relative" : '' }}>

                                                                    <Link to={`${config.baseUrl}nftDetails/` + item.id}>

                                                                        {item.file_type == 'image' ?
                                                                            <div className="">
                                                                                <img src={`${config.imageUrl}` + item.image} width="70px" />
                                                                            </div>
                                                                            :


                                                                            item.file_type == 'video' ?
                                                                                <video muted autoPlay width="70px" height="70px" controls>
                                                                                    <source src={`${config.imageUrl}${item.image}`} type="video/mp4" />
                                                                                </video>

                                                                                :
                                                                                item.file_type == 'audio' ?
                                                                                    <ReactAudioPlayer
                                                                                        className='audio-play'
                                                                                        src={`${config.imageUrl}${item.image}`}

                                                                                        controls
                                                                                    /> :  item?.file_type == 'OBJ' ?
                                                                                    <OBJModel src={`${config.imageUrl}${item?.image}`} texPath=""/>: ""


                                                                        }
                                                                    </Link>

                                                                </div>
                                                                <div className='profileboxdetail'>
                                                                    <Link to={`${config.baseUrl}collections/` + item.user_collection_id}>
                                                                        {!item.collection_image || item.collection_image == "" || item.collection_image == null || item.collection_image == 'null' ?
                                                                            <img src="images/no-image.jpg" alt />
                                                                            :
                                                                            <img src={`${config.imageUrl1 + item.collection_image}`} />
                                                                        }
                                                                        {item.collection_name}
                                                                    </Link> <br />

                                                                    <Link to={`${config.baseUrl}nftDetails/` + item.id}>
                                                                        <h2 className='mbl-heading'>{item.name}</h2>
                                                                    </Link>
                                                                    <p style={{ float: 'right' }}>{item.nft_type_select == 1 ? 'Physical' : 'Digital'}</p>

                                                                </div>
                                                                <div className='nft-dark-box bg-dark'>
                                                                    <table width='100%'>
                                                                        <thead>
                                                                            <tr>
                                                                                <th><p>Price</p></th>
                                                                                <th className='text-right'><p>
                                                                                    Owner
                                                                                </p></th>
                                                                            </tr>
                                                                        </thead>
                                                                        <tbody>
                                                                            <tr>
                                                                                <td><p>{item.price} MATIC </p></td>
                                                                                <td className='text-right'>
                                                                                    <p>{item.owner_name}</p>
                                                                                </td>
                                                                            </tr>
                                                                        </tbody>
                                                                    </table>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </section>

                        <section id='marketplace' className="marketplace" data-bgcolor="">
                            <div className="container">
                                <div className="row">
                                    <div className="col-xl-9 col-lg-9 col-md-9 col-sm-12 ">
                                        <div className="text-left">
                                            <h2 class=" mbl-heading">Marketplace</h2>
                                            <div className="small-border bg-color-2"></div>
                                        </div>
                                    </div>

                                    <div className="col-xl-3 col-lg-3 col-md-3 col-sm-12" style={{ backgroundSize: 'cover' }}>
                                        <div className="row">
                                            <div className=" col-sm-6 text-left"></div>
                                            <div className=" col-sm-6 text-right">
                                                <Link to={`${config.baseUrl}marketplace`}><h4 className='green'>View all</h4></Link>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="row wow fadeIn">

                                    <div className="col-md-12">
                                        <div className='row'>

                                            {this.state.allNfts.length == 0 ?
                                                <span className='text-center '><img src='images/nodata-found.png' /></span>
                                                :
                                                this.state.allNfts.map(item => (
                                                    <div className='col-lg-4 col-md-6 mb-4'>
                                                        <div className='auction-list'>
                                                            <div className='profilebox'>

                                                                {!item.owner_profile_pic || item.owner_profile_pic == "" || item.owner_profile_pic == null || item.owner_profile_pic == 'null' ?
                                                                    <img className="lazy img-fluid" src="images/default-user-icon.jpg" alt />
                                                                    :
                                                                    <img className="lazy img-fluid" src={`${config.imageUrl1 + item.owner_profile_pic}`} alt />
                                                                }

                                                                <Link to={`${config.baseUrl}UserProfile/` + item.owner_id} >
                                                                    <h5>{item.owner_name}</h5>
                                                                </Link>
                                                            </div>
                                                            <div class="auction-img">
                                                                <Link to={`${config.baseUrl}nftDetails/` + item.id} >
                                                                    {item.file_type == 'image' ?
                                                                        <div className="">
                                                                            <img src={`${config.imageUrl}` + item.image} width="70px" />
                                                                        </div>
                                                                        :
                                                                        <video muted autoPlay width="70px" height="70px" controls>
                                                                            <source src={`${config.imageUrl}${item.image}`} type="video/mp4" />
                                                                        </video>
                                                                    }
                                                                </Link>
                                                            </div>
                                                            <div className='profileboxdetail'>
                                                                <Link to={`${config.baseUrl}collections/` + item.user_collection_id} >

                                                                    {!item.collection_image || item.collection_image == null || item.collection_image == 'null' || item.collection_image == undefined ?
                                                                        <img src='images/default-user-icon.jpg' alt="Images" />
                                                                        :
                                                                        <img src={`${config.imageUrl1 + item.collection_image}`} />
                                                                    }
                                                                    {item.collection_name}
                                                                </Link> <br />
                                                                <h2 className='mbl-heading'>{item.name}</h2>

                                                            </div>

                                                            {item.sell_type == 2 ?
                                                                <div className='nft-dark-box bg-dark'>
                                                                    <table width='100%'>
                                                                        <thead>
                                                                            <tr>
                                                                                <th><p>Price</p></th>
                                                                                <th className='text-right'><p>

                                                                                    {item.is_on_sale === 0 ? '' :
                                                                                        item.sell_type === 1 || item.expiry_date === null ? '' :
                                                                                            new Date(item.start_date) > new Date() ?
                                                                                                <>
                                                                                                    Sale start in
                                                                                                </>
                                                                                                :
                                                                                                new Date(item.expiry_date) > new Date() ?
                                                                                                    <>
                                                                                                        Sale ends in
                                                                                                    </>
                                                                                                    :
                                                                                                    "Sale ends"
                                                                                    }
                                                                                </p></th>
                                                                            </tr>
                                                                        </thead>
                                                                        <tbody>
                                                                            <tr>
                                                                                <td><p>{item.price} MATIC </p></td>
                                                                                <td className='text-right'>

                                                                                    {item.is_on_sale === 0 ? '' :
                                                                                        item.sell_type === 1 || item.expiry_date === null ? '' :
                                                                                            <div className="item_info_like"><i className="fa fa-clock-o" aria-hidden="true" />
                                                                                                {new Date(item.start_date) > new Date() ?
                                                                                                    <>
                                                                                                        {(item.start_date && item) ?
                                                                                                            <Countdown
                                                                                                                date={this.getTimeOfStartDate(item.start_date)}
                                                                                                                renderer={this.CountdownTimer}
                                                                                                            /> :
                                                                                                            <>
                                                                                                                <span className="days">{moment(item.start_date).diff(moment(), 'days')} day </span>
                                                                                                            </>
                                                                                                        }
                                                                                                    </>
                                                                                                    :
                                                                                                    new Date(item.expiry_date) > new Date() ?
                                                                                                        <>
                                                                                                            {(item.expiry_date && item) ?
                                                                                                                <Countdown
                                                                                                                    date={this.getTimeOfStartDate(item.expiry_date)}
                                                                                                                    renderer={this.CountdownTimer}
                                                                                                                /> :
                                                                                                                <>
                                                                                                                    <span className="days">{moment(item.expiry_date).diff(moment(), 'days')} day </span>
                                                                                                                </>
                                                                                                            }

                                                                                                        </>
                                                                                                        :
                                                                                                        "Sale ends"
                                                                                                }
                                                                                            </div>}
                                                                                </td>
                                                                            </tr>
                                                                        </tbody>
                                                                    </table>
                                                                </div>

                                                                :
                                                                <div className='nft-dark-box bg-dark'>
                                                                    <table width='100%'>
                                                                        <thead>
                                                                            <tr>
                                                                                <th><p>Price</p></th>
                                                                                <th className='text-right'><p>
                                                                                    Owner
                                                                                </p></th>
                                                                            </tr>
                                                                        </thead>
                                                                        <tbody>
                                                                            <tr>
                                                                                <td><p>{item.price} MATIC </p></td>
                                                                                <td className='text-right'>
                                                                                    <p>{item.owner_name}</p>
                                                                                </td>
                                                                            </tr>
                                                                        </tbody>
                                                                    </table>
                                                                </div>

                                                            }

                                                        </div>
                                                    </div>
                                                ))}

                                        </div>
                                    </div>
                                </div>

                            </div>

                        </section>


                        <section id="section-steps" data-bgcolor="" className="">
                            <div className="container">
                                <div className="row">
                                    <div className="col-lg-12">
                                        <div className="text-left">
                                            <h2 class=" mbl-heading">How to get <span className='green'>started:</span></h2>
                                            <div className="small-border bg-color-2"></div>
                                        </div>
                                    </div>

                                    <div className="col-lg-4 col-md-6 mb-sm-30" data-bs-toggle={Cookies.get('loginSuccessnftsGarden') ? '' : 'modal'} data-bs-target={Cookies.get('loginSuccessnftsGarden') ? '' : '#walletModel'} onClick={Cookies.get('loginSuccessnftsGarden') ? this.alreadyConnectWallet.bind(this) : ''} style={{ cursor: 'pointer' }} >
                                        <div className="feature-box f-boxed style-3">
                                            <i className="wow fadeInUp bg-color-1 i-boxed icon_wallet"></i>
                                            <div className="text">
                                                <h4 className="wow fadeInUp" onClick={this.alreadyConnectWallet.bind(this)} style={{ cursor: 'pointer' }} >Set up your wallet</h4>
                                                <p className="wow fadeInUp" data-wow-delay=".25s">Once you’ve set up your wallet of choice, connect it to paradigme by clicking the connect button in the top right corner.</p>
                                            </div>
                                            <i className="wm icon_wallet"></i>
                                        </div>
                                    </div>

                                    <div onClick={Cookies.get('loginSuccessnftsGarden') ? '' : this.notLogin.bind(this)} className="col-lg-4 col-md-6 mb-sm-30">
                                        <div className="feature-box f-boxed style-3">
                                            <i className="wow fadeInUp bg-color-1 i-boxed icon_tags_alt"></i>
                                            <div className="text">
                                                <h4 style={{ cursor: 'pointer' }} className="wow fadeInUp">Create your collection</h4>
                                                <p className="wow fadeInUp" data-wow-delay=".25s">Click Collections and set up your collection. Add social links, a description, profile & banner images.</p>
                                            </div>
                                            <i className="wm icon_tags_alt"></i>
                                        </div>
                                    </div>


                                    <div onClick={Cookies.get('loginSuccessnftsGarden') ? '' : this.notLogin.bind(this)} className="col-lg-4 col-md-6 mb-sm-30">
                                        <div className="feature-box f-boxed style-3">
                                            <i className="wow fadeInUp bg-color-1 i-boxed icon_cloud-upload_alt"></i>
                                            <div className="text">
                                                <h4 className="wow fadeInUp">Add your NFT's</h4>
                                                <p className="wow fadeInUp" data-wow-delay=".25s">Upload your work (image or gif), add a title and description, and customize your NFTs with properties, stats, and unlockable content.</p>
                                            </div>
                                            <i className="wm icon_cloud-upload_alt"></i>
                                        </div>
                                    </div>

                                </div>
                            </div>
                        </section>

                    </div>



                    <Footer />
                </div>
            </>

        )
    }






}



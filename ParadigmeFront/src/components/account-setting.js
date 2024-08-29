import React, { Component } from 'react';
import axios from 'axios';
import Header from '../directives/header'
import Footer from '../directives/footer'
import config from '../config/config'
import Cookies from 'js-cookie';
import { Link } from 'react-router-dom';
import Countdown, { zeroPad } from 'react-countdown';
import { Dialog, Classes } from "@blueprintjs/core";
import BarLoader from 'react-bar-loader'
import { Player } from 'video-react';
// import DatePicker from 'react-date-picker';
import Web3 from 'web3';
// import toast, { Toaster } from 'react-hot-toast';
import ReactDatatable from '@ashvin27/react-datatable'
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css
import 'react-toastify/dist/ReactToastify.css';
import $ from 'jquery';
import Modal from 'react-modal';
import toast, { Toaster } from 'react-hot-toast';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import moment from 'moment';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import ContentShimmer from 'react-content-shimmer'
import ReactTooltip from 'react-tooltip';
import ReactAudioPlayer from 'react-audio-player';
import { EmailIcon, EmailShareButton } from 'react-share';
import {OBJModel} from 'react-3d-viewer'

const headers = {
  'Content-Type': 'application/json'
};

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
  },
};

const MAX_LENGTH = 4;
export default class accountsetting extends Component {

  constructor(props) {
    super(props)
    this.state = {
      full_name: '',
      isSocial: 0,
      copied: false,
      profileData: '',
      image_file: null,
      image_preview: '',
      banner_preview: '',
      image_file1: null,
      image_preview1: '',
      email: '',
      currentPassword: '',
      password: '',
      password2: '',
      openDotId: '0',
      twoAuthenticationData: '',
      enableTwoFactor: '',
      talentStatusAPIData: '',
      facebook: "",
      insta: "",
      twitter: "",
      pinterest: "",
      website: "",
      youtube: "",
      discord: "",
      aboutData: "",
      getWalletData: [],
      deposit_amount: '',
      adaToUsd: '',
      withdrawAmount: '',
      withdrawRecepientAddress: '',
      spinLoader: '0',
      collectionData: [],
      openDotDrop: 0,
      myNftData: [],
      nftData: [],
      nftType: '1',
      saleHistory: [],
      FavouritesHistory: [],
      getUserPurchaseData: [],
      getUserSaleData: [],
      getUsertransactions: [],
      getBidPlacedHistoryData: [],
      getBidReceivedNftHistoryData: [],
      getNftBidDetailsData: [],
      modalIsOpen: false,
      selectedTab: '1',
      isPutonSale: 0,
      isTransferNft: 0,
      currentDate: '',
      endDate: '',
      transferNftItemId: '',
      transferNftAddress: '',
      getRoyaltiesData: [],
      getId: '',
      isDialogOpen: false,
      isOwnResponse: true,
      isCreatedResponse: true,
      isFavResponse: true,
      isCancelOrder: 0,
      blockchainUpdationType: 1, // 1 for put on sale, 2 for cancel order, 3 for bid accept
      getUserSaleListing: [],
      physicalNftShow: false,
      physicalData: '',
      bid_increase_percentage: "",
      admin_commission: '',
      admin_address: ""
    }
    this.loginData = (!Cookies.get('loginSuccessParadigme')) ? [] : JSON.parse(Cookies.get('loginSuccessParadigme'));
    this.token = (!Cookies.get('token')) ? [] : JSON.parse(Cookies.get('token'));
    this.onChange = this.handleChange1.bind(this);
    this.updateProfileDetails = this.updateProfileDetails.bind(this)
    this.onChange = this.handleChange.bind(this);
    this.onChange = this.handleTwoWay.bind(this)
    this.twoAuthenticationVerifyAPI = this.twoAuthenticationVerifyAPI.bind(this)

    // ================================== Deposit / Withdraw Histtory Start ========================================
    this.columns = [
      {
        key: "sn",
        text: "#",
        cell: (row, index) => index + 1
      },
      {
        key: "transaction_type",
        text: "Transaction Type",
        cell: (item) => {
          return (
            item.transaction_type
          );
        }
      },
      {
        key: "amount",
        text: "Amount",
        cell: (item) => {
          return (
            <span>
              MATIC {item.amount}
            </span>
          );
        }
      },
      {
        key: "transaction_date",
        text: "Transaction Date",
        cell: (item) => {
          return (
            item.transaction_date
          );
        }
      },
      {
        key: "status",
        text: "Status",
        cell: (item) => {
          return (
            item.status
          );
        }
      },
      {
        key: "hash",
        text: "Blockchain View",
        cell: (item) => {
          return (
            <span>
              {item.hash ?
                <a href={`${config.blockchinUrl + item.hash}`} target="_blank">
                  <span title={item.hash}>{item?.hash.toString().substring(0, 4) + '...' + item?.hash.toString().substr(item?.hash.length - 6)}
                    &nbsp; <i style={{ color: '#4ca1f4!important' }} className="fa fa-external-link"></i>
                  </span>
                </a>
                : ""
              }
            </span>
          );
        }
      },

    ];

    this.config = {
      page_size: 10,
      length_menu: [10, 20, 50],
      show_filter: true,
      show_pagination: true,
      pagination: 'advance',
      button: {
        excel: false,
        print: false

      }
    }

    //  >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>   User purchase history >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

    this.columnsForPurchase = [
      {
        key: "sn",
        text: "#",
        cell: (row, index) => index + 1
      },
      {
        key: "image",
        text: "Image",
        cell: (item) => {
          return (
            <Link to={`${config.baseUrl}nftDetails/` + item.item_id}>
              {item.file_type == 'image' ?
                <div className="image-circle">
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

                      src={`${config.imageUrl}${item.image}`}
                      width="35px" height="35px" controls

                    /> : item.file_type == 'OBJ' ?
                    <OBJModel src={`${config.imageUrl}${item?.image}`} texPath=""/> :""
              }
            </Link>
          );
        }
      },
      {
        key: "item_name",
        text: "Title",
        sortable: true,
        cell: (item) => {
          return (
            <Link to={`${config.baseUrl}nftDetails/` + item.item_id}>
              {item.item_name}
            </Link>
          )
        }
      },
      {
        key: "collection",
        text: "Collection",
        cell: (item) => {
          return (
            item.collection_name
          );
        }
      },

      {
        key: "price",
        text: "Amount",
        cell: (item) => {
          return (
            item.price + ` MATIC`
          );
        }
      },

      {
        key: "nft_datetime",
        text: "Created Date",
        cell: (item) => {
          return (
            item.nft_datetime
          );
        }
      },
      {
        key: "Nft Type",
        text: "Nft Type",
        cell: (item) => {
          return (
            item.nft_type_select == '1' ?
              'Physical'
              : 'Digital'
          );
        }

      },
      {
        key: "order_status",
        text: "Order Status",
        cell: (item) => {
          return (
            <span>
              {item.nft_type_select == '1' ?


                item.order_status == 1 ? <p style={{ color: 'yellow' }}>In progress</p> :
                  item.order_status == 2 ? <p style={{ color: '#a35502' }}>Shipped</p> : item.order_status == 3 ? <p style={{ color: 'green' }} onclick={this.deliveredNft.bind(this, item)}>Received</p> : '' : 'NA'
              }
            </span>
          )
        }
      },
      {
        key: "action",
        text: "Action",
        cell: (item) => {
          return (
            <>
              {item.nft_type_select == '1' && item.order_status != 3 ?
                <button className="btn-main2" onClick={this.deliveredNft.bind(this, item)}>Delivered</button> : ''} &nbsp;

              {item.transfer_hash ?

                <a href={item.transfer_hash} target="_blank">
                  <button className="btn-main2">Blockchain view</button>
                </a>
                : ""}
            </>
          );
        }
      },


    ];

    this.configForPurchase = {
      page_size: 10,
      length_menu: [10, 20, 50],
      show_filter: true,
      show_pagination: true,
      pagination: 'advance',
      button: {
        excel: false,
        print: false

      }
    }

    //  >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>   User Sale history >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

    this.columnsForSale = [
      {
        key: "sn",
        text: "#",
        cell: (row, index) => index + 1
      },
      {
        key: "image",
        text: "Image",
        cell: (item) => {
          return (
            <Link to={`${config.baseUrl}nftDetails/` + item.item_id}>
              {item.file_type == 'image' ?
                <div className="image-circle">
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

                      src={`${config.imageUrl}${item.image}`}
                      width="35px" height="35px" controls

                    /> :item.file_type == 'OBJ' ?
                    <OBJModel src={`${config.imageUrl}${item?.image}`} texPath=""/> : ""
              }
            </Link>
          );
        }
      },

      {
        key: "item_name",
        text: "Title",
        sortable: true,
        cell: (item) => {
          return (
            <Link to={`${config.baseUrl}nftDetails/` + item.item_id}>
              {item.item_name}
            </Link>
          )
        }
      },

      {
        key: "collection",
        text: "Collection",
        cell: (item) => {
          return (
            item.collection_name
          );
        }
      },

      {
        key: "price",
        text: "Amount",
        cell: (item) => {
          return (
            item.price + ` MATIC`
          );
        }
      },

      {
        key: "nft_datetime",
        text: "Created Date",
        cell: (item) => {
          return (
            item.nft_datetime
          );
        }
      },
      {
        key: "Nft Type",
        text: "Nft Type",
        cell: (item) => {
          return (
            item.nft_type_select == '1' ?
              'Physical'
              : 'Digital'
          );
        }

      },
      {
        key: "order_status",
        text: "Order Status",
        cell: (item) => {
          return (

            <span>
              {item.nft_type_select == '1' ?


                item.order_status == 1 ? <p style={{ color: 'yellow' }}>In progress</p> :
                  item.order_status == 2 ? <p style={{ color: '#a35502' }}>Shipped</p> : item.order_status == 3 ? <p style={{ color: 'green' }}>Delivered</p> : '' : 'NA'
              }
            </span>

          )
        }
      },

      {
        key: "action",
        text: "Action",
        cell: (item) => {
          return (
            <>
              {item.nft_type_select == '1' ?
                <>
                  <EmailShareButton
                    url={''}
                    title="Share via Email"
                    subject={"Address"}
                    body={
                      `Item is : ${item.item_name}
                                    Shipped Adress is : Mobile number: ${item.mobile_number}, Pin code: ${item.pin_code}, Shipping Address : ${item.shipping_address}, Locality : ${item.locality}, City : ${item.city}, State : ${item.state}, Landmark : ${item.landmark} `

                    }
                    className="Demo__some-network__share-button">
                    <EmailIcon
                      title="Share via Email"
                      size={32}
                      round />
                  </EmailShareButton>
                  <button className='btn-main2' onClick={this.purchaseItem.bind(this, item)}>Shipped Address</button> </> : 'NA'
              }&nbsp;
              {item.transfer_hash ?
                <a href={item.transfer_hash} target="_blank">
                  <button className="btn-main2">Blockchain view</button>
                </a>
                : ""}
            </>
          );
        }
      },


    ];

    this.configForSale = {
      page_size: 10,
      length_menu: [10, 20, 50],
      show_filter: true,
      show_pagination: true,
      pagination: 'advance',
      button: {
        excel: false,
        print: false

      }
    }

    //  >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>   User Sale listing >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

    this.columnsForAllTransactions = [
      {
        key: "sn",
        text: "#",
        cell: (row, index) => index + 1
      },
      {
        key: "image",
        text: "Image",
        cell: (item) => {
          return (
            <Link to={`${config.baseUrl}nftDetails/` + item.item_id}>
              {item.file_type == 'image' ?
                <div className="image-circle">
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

                      src={`${config.imageUrl}${item.image}`}
                      width="35px" height="35px" controls

                    /> :item.file_type == 'OBJ' ?
                    <OBJModel src={`${config.imageUrl}${item?.image}`} texPath=""/> : ""

              }
            </Link>
          );
        }
      },

      {
        key: "item_name",
        text: "Title",
        sortable: true,
        cell: (item) => {
          return (
            <Link to={`${config.baseUrl}nftDetails/` + item.item_id}>
              {item.item_name}
            </Link>
          )
        }
      },

      {
        key: "trxType",
        text: "Type",
        sortable: true
      },

      {
        key: "collection",
        text: "Collection",
        cell: (item) => {
          return (
            item.collection_name
          );
        }
      },

      {
        key: "price",
        text: "Amount",
        cell: (item) => {
          return (
            item.price + ` MATIC`
          );
        }
      },

      {
        key: "nft_datetime",
        text: "Created Date",
        cell: (item) => {
          return (
            item.nft_datetime
          );
        }
      }


    ];

    this.configForAllTransactions = {
      page_size: 10,
      length_menu: [10, 20, 50],
      show_filter: true,
      show_pagination: true,
      pagination: 'advance',
      button: {
        excel: false,
        print: false

      }
    }

    this.columnsForSaleListing = [
      {
        key: "sn",
        text: "#",
        cell: (row, index) => index + 1
      },
      {
        key: "image",
        text: "Image",
        cell: (item) => {
          return (
            <Link to={`${config.baseUrl}nftDetails/` + item.item_id}>
              {item.file_type == 'image' ?
                <div className="image-circle">
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

                      src={`${config.imageUrl}${item.image}`}
                      width="35px" height="35px" controls

                    /> : item.file_type == 'OBJ' ?
                    <OBJModel src={`${config.imageUrl}${item?.image}`} texPath=""/> :""
              }
            </Link>
          );
        }
      },

      {
        key: "item_name",
        text: "Title",
        sortable: true,
        cell: (item) => {
          return (
            <Link to={`${config.baseUrl}nftDetails/` + item.item_id}>
              {item.item_name}
            </Link>
          )
        }
      },

      {
        key: "collection",
        text: "Collection",
        cell: (item) => {
          return (
            item.collection_name
          );
        }
      },

      {
        key: "price",
        text: "Amount",
        cell: (item) => {
          return (
            item.price + ` MATIC`
          );
        }
      },

      {
        key: "nft_datetime",
        text: "Created Date",
        cell: (item) => {
          return (
            item.nft_datetime
          );
        }
      },

    ];

    this.configForSaleListing = {
      page_size: 10,
      length_menu: [10, 20, 50],
      show_filter: true,
      show_pagination: true,
      pagination: 'advance',
      button: {
        excel: false,
        print: false

      }
    }

    //  >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>   User Bid Placed history >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>


    this.columnsForUserBid = [
      {
        key: "sn",
        text: "#",
        cell: (row, index) => index + 1
      },
      {
        key: "image",
        text: "Image",
        cell: (item) => {
          return (
            <Link to={`${config.baseUrl}nftDetails/` + item.item_id}>
              {item.file_type == 'image' ?
                <div className="image-circle">
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

                      src={`${config.imageUrl}${item.image}`}
                      width="35px" height="35px" controls

                    /> : item.file_type == 'OBJ' ?
                    <OBJModel src={`${config.imageUrl}${item?.image}`} texPath=""/> :""
              }
            </Link>
          );
        }
      },

      {
        key: "item_name",
        text: "Title",
        sortable: true,
        cell: (item) => {
          return (
            <Link to={`${config.baseUrl}nftDetails/` + item.item_id}>
              {item.item_name}
            </Link>
          )
        }
      },

      {
        key: "owner_name",
        text: "Owner Name",
        cell: (item) => {
          return (
            item.owner_name
          );
        }
      },

      {
        key: "item_price",
        text: "Reserve Price",
        cell: (item) => {
          return (
            item.item_price + ` MATIC`
          );
        }
      },

      {
        key: "max_bid",
        text: "Hightest Bid",
        cell: (item) => {
          return (
            item.max_bid + ` MATIC`
          );
        }
      },

      {
        key: "bid_price",
        text: "Your Bid",
        cell: (item) => {
          return (
            item.bid_price + ` MATIC`
          );
        }
      },

      {
        key: "status",
        text: "Status",
        cell: (item) => {
          return (
            item.status
          );
        }
      },

      // {
      //   key: "action",
      //   text: "Action",
      //   cell: (item) => {
      //     return (
      //       item.status_id == '0' ?
      //         <button onClick={this.cancelBidAPI.bind(this, item)} className="btn-main2">Cancel Bid</button>
      //         : ""
      //     );
      //   }
      // },


    ];

    this.configForUserBid = {
      page_size: 10,
      length_menu: [10, 20, 50],
      show_filter: true,
      show_pagination: true,
      pagination: 'advance',
      button: {
        excel: false,
        print: false

      }
    }

    //  >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>   User Bid Received history >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

    this.columnsForNftBidReceived = [
      {
        key: "sn",
        text: "#",
        cell: (row, index) => index + 1
      },
      {
        key: "image",
        text: "Image",
        cell: (item) => {
          return (
            <Link to={`${config.baseUrl}nftDetails/` + item.item_id}>
              {item.file_type == 'image' ?
                <div className="image-circle">
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

                      src={`${config.imageUrl}${item.image}`}
                      width="35px" height="35px" controls

                    /> : item.file_type == 'OBJ' ?
                    <OBJModel src={`${config.imageUrl}${item?.image}`} texPath=""/> :""
              }
            </Link>
          );
        }
      },

      {
        key: "item_name",
        text: "Title",
        sortable: true,
        cell: (item) => {
          return (
            <Link to={`${config.baseUrl}nftDetails/` + item.item_id}>
              {item.item_name}
            </Link>
          )
        }
      },

      {
        key: "collection_name",
        text: "Collection",
        cell: (item) => {
          return (
            item.collection_name
          );
        }
      },

      {
        key: "item_price",
        text: "Reserve Price",
        cell: (item) => {
          return (
            'MATIC ' + item.price
          );
        }
      },

      {
        key: "max_bid",
        text: "Hightest Bid",
        cell: (item) => {
          return (
            'MATIC ' + item.max_bid
          );
        }
      },

      {
        key: "action",
        text: "Action",
        cell: (item) => {
          return (
            <button onClick={this.viewNftBidDetails.bind(this, item.item_id)} className='sale-list btn btn-primary btn-sm' data-toggle="modal" data-target="#productShareSheet">View Bids</button>
          );
        }
      },
    ];

    this.configForNftBidReceived = {
      page_size: 10,
      length_menu: [10, 20, 50],
      show_filter: true,
      show_pagination: true,
      pagination: 'advance',
      button: {
        excel: false,
        print: false
      }
    }

    //  >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>   User Sale List history >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

    this.salecolumns = [
      {
        key: "index",
        text: "S.No.",
        sortable: true,
        cell: (item, i) => {
          return (
            <>{i + 1}</>
          )
        }
      },
      {
        key: "image",
        text: "Image",
        cell: (item) => {
          return (
            <Link to={`${config.baseUrl}nftDetails/` + item.item_id}>
              {item.file_type == 'image' ?
                <div className="image-circle">
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

                      src={`${config.imageUrl}${item.image}`}
                      width="35px" height="35px" controls

                    /> :item.file_type == 'OBJ' ?
                    <OBJModel src={`${config.imageUrl}${item?.image}`} texPath=""/> : ""
              }
            </Link>
          );
        }
      },
      {
        key: "name",
        text: "Title",
        sortable: true,
        cell: (item) => {
          return (
            <Link to={`${config.baseUrl}nftDetails/` + item.item_id}>
              {item.name.length < 20 ? item.name : item.name.substring(0, 20) + '....'}
            </Link>
          )
        }
      },
      {
        key: "collection_name",
        text: "Collection",
        sortable: true
      },

      {
        key: "sell_type",
        text: "Sale Type",
        sortable: true,
        cell: (item) => {
          return (
            <>{item.sell_type == '1' ? 'Price' : item.sell_type == '2' ? "Auction" : 'Not On Sale'} </>
          )
        }
      },

      {
        key: "price",
        text: "Price",
        sortable: true,
        cell: (item) => {
          return (
            <> MATIC {item.price}</>
          )
        }
      },
      {
        key: "expiry_date",
        text: "End Date",
        sortable: true,
        cell: (item) => {
          return (
            <>{item.expiry_date == '0000-00-00 00:00:00' || item.expiry_date === null ? "" : moment(item.expiry_date).format('LLL')}</>
          )
        }
      },
      {
        key: "Action",
        text: "Action",
        cell: (item) => {
          return (
            <div>
              {item.sell_type == 2 ?
                <button onClick={this.viewNftBidDetails.bind(this, item.item_id)} data-toggle="modal" data-target="#productShareSheet" className='sale-list btn btn-primary btn-sm'>View Bids</button> : ""
              }
            </div>
          )
        }
      },
    ];

    this.configs = {
      page_size: 10,
      length_menu: [10, 20, 50],
      show_filter: true,
      show_pagination: true,
      pagination: 'advance',
      button: {
        excel: false,
        print: false
      }
    }

    // >>>>>>>>>>>>>>>>>>>>>>>>>>>>>  Royalties >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

    this.columnsRoyalties = [
      {
        key: "index",
        text: "S.No.",
        sortable: true,
        cell: (item, i) => {
          return (
            <>{i + 1}</>
          )
        }
      },
      {
        key: "image",
        text: "Image",
        cell: (item) => {
          return (
            <Link to={`${config.baseUrl}nftDetails/` + item.item_id}>
              {item.file_type == 'image' ?
                <div className="image-circle">
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

                      src={`${config.imageUrl}${item.image}`}
                      width="35px" height="35px" controls

                    /> : item.file_type == 'OBJ' ?
                    <OBJModel src={`${config.imageUrl}${item?.image}`} texPath=""/> :""
              }
            </Link>
          );
        }
      },
      {
        key: "name",
        text: "Title",
        sortable: true,
        cell: (item) => {
          return (
            <Link to={`${config.baseUrl}nftDetails/` + item.item_id}>
              {item.item_name}
            </Link>
          )
        }
      },

      {
        key: "price",
        text: "Price",
        sortable: true,
        cell: (item) => {
          return (
            <>MATIC {item.amount}</>
          )
        }
      },
      {
        key: "price",
        text: "Price",
        sortable: true,
        cell: (item) => {
          return (
            <>{item.royalty_percent}</>
          )
        }
      },
      {
        key: "transaction_date",
        text: "Transaction Date",
        cell: (item) => {
          return (
            <div>
              {item.transaction_date}
            </div>
          )
        }
      },
    ];

    this.configRoyalties = {
      page_size: 10,
      length_menu: [10, 20, 50],
      show_filter: true,
      show_pagination: true,
      pagination: 'advance',
      button: {
        excel: false,
        print: false
      }
    }

  }

  handleClickOutside = event => {
    var openDotId = this.state.openDotId
    if (openDotId > '0') {
      $("#collections" + this.state.openDotId).css({ "display": "none" });
      $("#nft" + this.state.openDotId).css({ "display": "none" });
      $("#createnft" + this.state.openDotId).css({ "display": "none" });
      $("#salenft" + this.state.openDotId).css({ "display": "none" });
    }
  }

  componentDidMount() {

    var startDate = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');
    var array = startDate.split(' ');
    if (array[0]) {
      this.setState({
        currentDate: array[0],
        endDate: array[0]
      })
    }

    // this.setState({
    //   currentDate: new Date(),
    //   endDate: new Date()
    // })

    document.addEventListener('click', this.handleClickOutside, true);
    if (!this.loginData?.id) {
      window.location.href = `${config.baseUrl}`
    }

    if (Cookies.get('selectedTab')) {
      this.setState({
        selectedTab: Cookies.get('selectedTab')
      })
      Cookies.remove('selectedTab')
    }


    this.twoAuthenticationAPI()
    this.getUserData()
    this.getAboutDetailAPI()
    this.getFeesAPI()
    setTimeout(() => {
      this.getRoyaltiesAPI()
      this.getCollectionDataAPI()
      this.getMyNftAPI()
      this.getUserPurchaseAPI()
      this.getSaleHistoryAPI()
      this.getUserTransactionsAPI()
      this.getSaleListingAPI()
      this.getBidPlacedHistoryAPI()
      this.getNftBidReceivedHistoryAPI()
    }, 1000);
    let type = localStorage.getItem('type')
    if (type) {
      this.setState({
        selectedTab: type
      })
    }
    else {
      this.setState({
        selectedTab: 1
      })
    }

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

  // ==============================   Account Settings API's Start   ===========================================

  async getUserData() {
    let userdata = this.loginData;
    this.setState({
      full_name: userdata.full_name
    })
  }

  handleChange = e => {

    if (e.target.name == 'start_date') {
      this.setState({
        endDate: e.target.value
      })
    }

    if (e.target.name == 'price') {
      this.setState(prevState => ({
        nftData: { ...prevState.nftData, ['price']: e.target.value }
      }))
    }

    // if (e.target.name == 'start_date') {
    //   this.setState(prevState => ({
    //     nftData: { ...prevState.nftData, ['start_date1']: e.target.value }
    //   }))
    // }

    // if (e.target.name == 'expiry_date') {
    //   this.setState(prevState => ({
    //     nftData: { ...prevState.nftData, ['expiry_date1']: e.target.value }
    //   }))
    // }

    if (e.target.name == 'minimum_bid_amount') {
      this.setState(prevState => ({
        nftData: { ...prevState.nftData, ['price']: e.target.value }
      }))
    }

    this.setState({
      [e.target.name]: e.target.value
    })
  }

  handleChange1 = event => {
    event.preventDefault()
    let value = event.target.value;
    this.setState(prevState => ({
      aboutData: { ...prevState.aboutData, [event.target.name]: value }
    }))
  }

  profilePicChange = (e) => {
    let image_as_base64 = URL.createObjectURL(e.target.files[0])
    let image_as_files = e.target.files[0];
    this.setState({
      image_preview: image_as_base64,
      image_file: image_as_files,
    })
  }

  bannerPicChange = (e) => {
    let image_as_base64 = URL.createObjectURL(e.target.files[0])
    let image_as_files = e.target.files[0];
    this.setState({
      banner_preview: image_as_base64,
      banner_pic: image_as_files,
    })
  }

  async twoAuthenticationAPI() {
    await axios({
      method: 'post',
      url: `${config.apiUrl}getQR`,
      data: { "user_id": this.loginData?.id }
    }).then(response => {
      console.log('abc', response.data);
      if (response.data.success === true) {
        this.setState({
          twoAuthenticationData: response.data.response
        })
      }
    })
  }

  async twoAuthenticationVerifyAPI() {
    await axios({
      method: 'post',
      url: `${config.apiUrl}twoAuthenticationVerify `,
      data: { "user_id": this.loginData?.id, 'SecretKey': this.state.twoAuthenticationData.SecretKey, 'enableTwoFactor': this.state.twoAuthenticationData.enableTwoFactor }
    }).then(response => {
      if (response.data.success === true) {
        if (this.state.twoAuthenticationData.enableTwoFactor == 1) {
          var msg = "2FA Authentication has been disabled successfully!"
        } else {
          var msg = "2FA Authentication has been enabled successfully!"
        }
        this.twoAuthenticationAPI()
        toast.success(msg);
      }
    }).catch(err => {
      toast.error('Token mismatch! Please try again.')
    })
  }


  handleTwoWay = event => {
    event.preventDefault()
    if (event.target.checked === true && event.target.type === 'checkbox') {
      event.target.value = '1'
    }
    else if (event.target.checked === false && event.target.type === 'checkbox') {
      event.target.value = '0'
    }
    let value = event.target.value;
    this.setState(prevState => ({
      twoAuthenticationData: { ...prevState.twoAuthenticationData, [event.target.name]: value }
    }))

  }

  formatInput = (e) => {
    let checkIfNum;
    if (e.key !== undefined) {
      checkIfNum = e.key === "e" || e.key === "." || e.key === "+" || e.key === "-";
    }
    else if (e.keyCode !== undefined) {
      checkIfNum = e.keyCode === 69 || e.keyCode === 190 || e.keyCode === 187 || e.keyCode === 189;
    }
    return checkIfNum && e.preventDefault();
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

  updateProfileDetails(e) {
    e.preventDefault();
    let formData = new FormData();
    formData.append('full_name', this.state.aboutData?.full_name);
    formData.append('email', this.state.aboutData?.email);
    formData.append('description', this.state.aboutData?.description);
    formData.append('profile_pic', this.state.image_file);
    formData.append('banner', this.state.banner_pic);
    formData.append('old_profile_pic', this.state.aboutData?.profile_pic);
    formData.append('old_banner', this.state.aboutData?.banner);
    formData.append('facebook', this.state.aboutData?.facebook);
    formData.append('twitter', this.state.aboutData?.twitter);
    formData.append('insta', this.state.aboutData?.insta);
    formData.append('telegram', this.state.aboutData?.telegram);
    formData.append('discord', this.state.aboutData?.discord);
    formData.append('user_id', this.state.aboutData?.id);
    formData.append('mobile_number', this.state.aboutData?.mobile_number);
    formData.append('pin_code', this.state.aboutData?.pin_code);
    formData.append('shipping_address', this.state.aboutData?.shipping_address);
    formData.append('locality', this.state.aboutData?.locality);
    formData.append('city', this.state.aboutData?.city);
    formData.append('state', this.state.aboutData?.state);
    formData.append('landmark', this.state.aboutData?.landmark);


    axios.post(`${config.apiUrl}updateAboutDetail`, formData)
      .then(result => {
        if (result.data.success === true) {
          toast.success(result.data?.msg);
        } else {
          toast.error(result.data?.msg);
        }
      }).catch(err => {
        toast.error(err.response.data?.msg,

        );
      })
  }

  // ==============================   Account Settings API's End   ================================================

  // ==============================   Collections API's Start =================================================

  async getCollectionDataAPI() {
    const token = this.token
    await axios({
      method: 'post',
      url: `${config.apiUrl}getUserCollection`,
      headers: { authorization: token },
      data: { "user_id": this.loginData?.id, 'address': this.loginData?.address }
      // data: { "user_id": 262, 'address': this.loginData?.address }
    }).then(response => {
      console.log('abc', response.data);
      if (response.data.success === true) {
        this.setState({
          collectionData: response.data.response
        })
      }
    })
  }

  async deleteCollection(collection_id) {
    $("#collections" + collection_id).css({ "display": "none" });
    const token = this.token
    confirmAlert({
      title: 'Confirm to submit',
      message: 'Are you sure you want to delete this collection?',
      buttons: [
        {
          label: 'Yes',
          onClick: () =>
            axios({
              method: 'post',
              url: `${config.apiUrl}deleteUserCollection`,
              headers: { authorization: token },
              data: { "user_id": this.loginData?.id, 'address': this.loginData?.address, 'collection_id': collection_id }
            }).then(response => {
              if (response.data.success === true) {
                toast.success(response.data.msg, {
                  style: {
                    border: '1px solid #713200',
                    padding: '20px',
                    color: 'white',
                  },
                  iconTheme: {
                    primary: 'purple',
                    secondary: '#FFFAEE',
                  },
                });
                this.getCollectionDataAPI()
              } else {
                toast.error(response.data.msg,

                );
              }
            }).catch(err => {
              toast.error(err.response.data?.msg,

              );
            })
        },
        {
          label: 'No',
        }
      ]
    });
  }

  // ==============================   Collections API's End =================================================


  //  ========================================== Portfolio API's Start==========================================

  async getMyNftAPI(nftType = null) {
    if (!nftType) {
      var nftType = 1
    } else {
      var nftType = nftType
    }

    this.setState({
      'saleHistory': [],
      'myNftData': [],
      'nftType': nftType,
      'FavouritesHistory': []
    })

    const token = this.token
    await axios({
      method: 'post',
      url: `${config.apiUrl}portfolio`,
      headers: { authorization: token },
      data: { "user_id": this.loginData?.id, "login_user_id": this.loginData?.id, 'address': this.loginData?.address, 'type': nftType }
      // data: { "user_id": 262, "login_user_id": 262, 'address': this.loginData?.address, 'type': nftType }
    }).then(response => {
      console.log('abc', response.data);
      if (response.data.success === true) {
        console.log('>>', response.data.response);
        this.setState({
          myNftData: response.data.response,
          saleHistory: response.data.response,
          FavouritesHistory: response.data.response
        });

        if (nftType == 1) {
          this.setState({
            isOwnResponse: false
          });
        } else if (nftType == 2) {
          this.setState({
            isCreatedResponse: false
          });
        } else if (nftType == 4) {
          this.setState({
            isFavResponse: false
          });
        }

      } else {
        this.setState({
          myNftData: [],
          isOwnResponse: false,
          isCreatedResponse: false,
          isFavResponse: false
        })
      }
    }).catch((error) => {
      this.setState({
        'saleHistory': [],
        myNftData: [],
        'nftType': nftType,
        'FavouritesHistory': []
      })
    })
  }

  async likeCount(item) {
    if (this.loginData && this.loginData.id) {
      await axios({
        method: 'post',
        url: `${config.apiUrl}likeitem`,
        data: {
          "user_id": this.loginData.id,
          "item_id": item.item_id
        }
      }).then((res) => {
        if (res.data.success === true) {
          this.getMyNftAPI(this.state.nftType)
        }

      }).catch((error) => {

      })
    } else {
      toast.error('Please Login First')
    }
  }

  async putOnSaleModelAPI(item, type) {
    if (item.is_physical_approved === 0 && item.nft_type_select === 1) {
      toast.error('To put on sale Physical NFT, Firstly Admin has to Approved this NFT!! Please contact to Admin for further details')
      return;
    }
    this.setState({
      updateType: type,
      isPutonSale: this.state.isCancelOrder == 1 ? 0 : 1,
    })
    $("#nft" + item.item_id).css({ "display": "none" });
    await axios({
      method: 'post',
      url: `${config.apiUrl}itemDetail`,
      data: { 'item_id': item.item_id, 'user_id': this.loginData.id }
    }).then(response => {
      if (response.data.success === true) {
        this.setState({
          nftData: response.data.response
        })
      }
    })
  }

  async cancelOrder(item) {
    this.setState({
      isCancelOrder: 1
    })
    confirmAlert({
      title: 'Confirm to submit',
      message: 'Are you sure want to cancel this order?.',
      buttons: [
        {
          label: 'Yes',
          onClick: () =>
            this.approveNFT(item)
        },
        {
          label: 'No',
        }
      ]
    });
  }


  async updateNFT(itemDetails) {

    if (window.ethereum) {
      this.setState({
        spinLoader: '1',
        isDialogOpen: true
      })

      var web3 = '';
      web3 = new Web3(window.ethereum);
      const accounts = await web3.eth.getAccounts();
      let currentNetwork = await web3.currentProvider.chainId;
      web3.eth.defaultAccount = accounts[0];

      var chainId = chainId;
      if (currentNetwork !== chainId) {
        toast.error('Please select testnet MATIC smartchain!!');
        this.setState({
          spinLoader: '0',
          isDialogOpen: false
        })
        return false;
      }

      try {
        let mintFee = 0;
        let SalePrice;
        let start_date = 0;
        let expiry_date = 0;
        let tokenId = itemDetails.token_id;

        if (itemDetails.sell_type == 1) {
          SalePrice = parseInt(parseFloat(this.state.nftData?.price) * (10 ** 18)).toString()
          this.setState({
            start_date: 0,
            expiry_date: 0
          })
        }

        else if (itemDetails.sell_type == 2) {
          SalePrice = parseInt(parseFloat(this.state.nftData?.price) * (10 ** 18)).toString();
          start_date = Math.round(new Date(this.state.nftData?.start_date1).getTime() / 1000);
          expiry_date = Math.round(new Date(this.state.nftData?.expiry_date1).getTime() / 1000);
        }

        console.log(">>>>>>>>", itemDetails.sell_type, this.state.nftData?.price, this.state.nftData?.start_date1, this.state.nftData?.expiry_date1);

        let contractAddress = `${config.marketplaceContract}`
        let from_address = accounts[0];
        const contract = await new web3.eth.Contract(config.abiMarketplace, contractAddress);

        await contract.methods.updateDetails(tokenId.toString(), SalePrice.toString(), itemDetails.sell_type.toString(), start_date.toString(), expiry_date.toString()).call();

        let tx_builder = await contract.methods.updateDetails(tokenId.toString(), SalePrice.toString(), itemDetails.sell_type.toString(), start_date.toString(), expiry_date.toString());

        let encoded_tx = tx_builder.encodeABI();
        let gasPrice = await web3.eth.getGasPrice();
        gasPrice = parseInt(gasPrice) + parseInt(10000000000);

        let gasLimit = await web3.eth.estimateGas({
          gasPrice: web3.utils.toHex(gasPrice),
          to: contractAddress,
          from: from_address,
          value: web3.utils.toHex(mintFee),
          chainId: chainId,
          data: encoded_tx
        });

        const txData = await web3.eth.sendTransaction({
          gasPrice: web3.utils.toHex(gasPrice),
          gas: web3.utils.toHex(gasLimit),
          to: contractAddress,
          from: from_address,
          value: web3.utils.toHex(mintFee),
          chainId: chainId,
          data: encoded_tx
        });
        console.log(txData.transactionHash);
        if (txData.transactionHash) {
          return true
          // let mintRes = {
          //   'ImageFileHash': ImageFileHash,
          //   'MetadataFileHash': metaHash,
          //   'hash': txData.transactionHash,
          //   'tokenId': tokenId,
          //   'from_address': from_address,
          //   'minting_fee': parseInt(mintFee) / 10 ** 18
          // }
          // this.createNftAPI(mintRes);
        } else {
          toast.error('Something went wrong please try again.');
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
          spinLoader: 0,
          isDialogOpen: false
        })
        return false;
      }
    } else {
      toast.error('Please Connect to MetaMask.');
      this.setState({
        spinLoader: 0,
        isDialogOpen: false
      })
      return false;
    }

  }

  async approveNFT(itemDetails) {
    console.log('itemDetails', itemDetails);
    this.setState({
      spinLoader: '1',
      isPutonSale: 0,
      isDialogOpen: true
    })

    if (window.ethereum) {

      var web3 = '';
      web3 = new Web3(window.ethereum);
      const accounts = await web3.eth.getAccounts();
      let currentNetwork = await web3.currentProvider.chainId;
      web3.eth.defaultAccount = accounts[0];
      var chainId = config.chainId;
      if (currentNetwork !== chainId) {
        toast.error('Please select Ploygon Testnet smartchain!!');
        this.setState({
          spinLoader: '0',
          isPutonSale: 1,
          isDialogOpen: false
        })
        return false;
      }

      try {
        let mintFee = parseInt(this.state.admin_commission * (10 ** 18));
        let SalePrice;
        let start_date = 0;
        let expiry_date = 0;
        let tokenId = itemDetails.token_id;

        if (itemDetails.sell_type == 1) {
          SalePrice = parseInt(parseFloat(itemDetails.price) * (10 ** 18)).toString()
          this.setState({
            start_date: 0,
            expiry_date: 0
          })
        }

        else if (itemDetails.sell_type == 2) {
          SalePrice = parseInt(parseFloat(itemDetails.price) * (10 ** 18)).toString();
          start_date = Math.round(new Date(itemDetails.start_date).getTime() / 1000);
          expiry_date = Math.round(new Date(itemDetails.expiry_date).getTime() / 1000);
        }

        let contractAddress = `${config.marketplaceContract}`
        let from_address = accounts[0];
        const contract = await new web3.eth.Contract(config.abiMarketplace, contractAddress);
        console.log(this.state.isCancelOrder)
        if (this.state.isCancelOrder == 1) {
          this.setState({
            blockchainUpdationType: 2
          });
          console.log('tokenId', tokenId)
          await contract.methods.cancelOrder(tokenId.toString()).call();
          var tx_builder = await contract.methods.cancelOrder(tokenId.toString());
        } else {
          this.setState({
            blockchainUpdationType: 1
          });
          if (itemDetails.is_minted == 1) {
            console.log(tokenId.toString(), SalePrice.toString(), itemDetails.sell_type.toString(), start_date.toString(), expiry_date.toString())
            await contract.methods.updateDetails(tokenId.toString(), SalePrice.toString(), itemDetails.sell_type.toString(), start_date.toString(), expiry_date.toString()).call();

            var tx_builder = await contract.methods.updateDetails(tokenId.toString(), SalePrice.toString(), itemDetails.sell_type.toString(), start_date.toString(), expiry_date.toString());
          } else {
            let royaltiesAddress = JSON.parse(itemDetails.royaltiesAddress);
            let royaltiesAddressArray = [];
            if (royaltiesAddress.length > 0) {
              for (let i = 0; i < royaltiesAddress.length; i++) {
                royaltiesAddressArray[i] = royaltiesAddress[i].royaltiesAddress;
              }
            }
            console.log(tokenId.toString(), SalePrice.toString(), (itemDetails.royalty_percent * 100).toString(), itemDetails.sell_type.toString(), start_date.toString(), expiry_date.toString(), royaltiesAddressArray);

            await contract.methods._mint(tokenId.toString(), SalePrice.toString(), (itemDetails.royalty_percent * 100).toString(), itemDetails.sell_type.toString(), start_date.toString(), expiry_date.toString(), royaltiesAddressArray).call();

            var tx_builder = await contract.methods._mint(tokenId.toString(), SalePrice.toString(), (itemDetails.royalty_percent * 100).toString(), itemDetails.sell_type.toString(), start_date.toString(), expiry_date.toString(), royaltiesAddressArray);
          }
        }

        let encoded_tx = tx_builder.encodeABI();
        let gasPrice = await web3.eth.getGasPrice();
        gasPrice = parseInt(gasPrice) + parseInt(10000000000);

        let gasLimit = await web3.eth.estimateGas({
          gasPrice: web3.utils.toHex(gasPrice),
          to: contractAddress,
          from: from_address,
          value: web3.utils.toHex(mintFee),
          chainId: chainId,
          data: encoded_tx
        });

        // const txData = await web3.currentProvider.request({
        //     method: 'eth_sendTransaction',
        //     params: [{
        //         gasPrice: web3.utils.toHex(gasPrice),
        //         gas: web3.utils.toHex(gasLimit),
        //         to: contractAddress,
        //         from: from_address,
        //         value: web3.utils.toHex(mintFee),
        //         chainId: chainId,
        //         data: encoded_tx
        //     }],
        // });

        const txData = await web3.eth.sendTransaction({
          gasPrice: web3.utils.toHex(gasPrice),
          gas: web3.utils.toHex(gasLimit),
          to: contractAddress,
          from: from_address,
          value: web3.utils.toHex(mintFee),
          chainId: chainId,
          data: encoded_tx
        });

        if (txData.transactionHash) {

          const token = this.token
          await axios({
            method: 'post',
            url: this.state.isCancelOrder ? `${config.apiUrl}cancelOrder` : `${config.apiUrl}putOnSale`,
            headers: { authorization: token },
            data: {
              "user_id": this.loginData.id,
              "address": this.loginData?.address,
              "item_id": itemDetails.item_id,
              "token_hash": txData.transactionHash,
              "is_minted": itemDetails.is_minted
            }
          }).then((res) => {
            if (res.data.success === true) {

              this.setState({
                isDialogOpen: false,
                spinLoader: 0
              })

              this.modalShow(0)
              this.getMyNftAPI(itemDetails.nftType)
              toast.success(res.data.msg, {});
            } else {
              toast.error(res.data.msg, {});
            }
          }).catch((error) => {
            toast.error(error.response?.data?.msg, {});
          })
        } else {
          toast.error('Something went wrong please try again.');
          this.setState({
            spinLoader: '0',
            isPutonSale: this.state.this.state.isCancelOrder == 1 ? 0 : 1,
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
          isPutonSale: this.state.isCancelOrder == 1 ? 0 : 1,
          isDialogOpen: false
        })
        return false;
      }
    } else {
      toast.error('Please Connect to MetaMask.');
      this.setState({
        spinLoader: '0',
        isPutonSale: this.state.isCancelOrder == 1 ? 0 : 1,
        isDialogOpen: false
      })
      return false;
    }
  }

  async putOnSaleAPI(item) {
    console.log('putOnSaleAPI', item);
    this.setState({
      spinLoader: '1',
      isPutonSale: 0,
      isDialogOpen: true
    })

    let approveNFTRes = await this.approveNFT(item);
    if (approveNFTRes) {
      const token = this.token
      await axios({
        method: 'post',
        url: `${config.apiUrl}putOnSale`,
        headers: { authorization: token },
        data: {
          "user_id": this.loginData.id,
          "address": this.loginData?.address,
          "item_id": item.item_id
        }
      }).then((res) => {
        if (res.data.success === true) {

          this.setState({
            isDialogOpen: false
          })

          this.modalShow(0)
          this.getMyNftAPI(this.state.nftType)
          toast.success(res.data.msg, {});
        } else {
          toast.error(res.data.msg, {});
        }
      }).catch((error) => {
        toast.error(error.response?.data?.msg, {});
      })
    } else {
      this.setState({
        spinLoader: '0',
        isPutonSale: 1,
        isDialogOpen: false
      })
    }

  }

  async removeOnSaleAPI(item) {
    $("#nft" + item.item_id).css({ "display": "none" });
    $("#createnft" + item.item_id).css({ "display": "none" });
    $("#salenft" + item.item_id).css({ "display": "none" });
    const token = this.token
    await axios({
      method: 'post',
      url: `${config.apiUrl}removeOnSale`,
      headers: { authorization: token },
      data: {
        "user_id": this.loginData.id,
        "address": this.loginData?.address,
        "item_id": item.item_id
      }
    }).then((res) => {

      if (res.data.success === true) {
        this.getMyNftAPI(this.state.nftType)
        toast.success(res.data.msg, {});
      } else {
        toast.error(res.data.msg, {});
      }

    }).catch((error) => {
      toast.error(error.response.data.msg, {});
    })
  }

  async deleteNFTAPI(item) {
    $("#nft" + item.item_id).css({ "display": "none" });
    const token = this.token
    await axios({
      method: 'post',
      url: `${config.apiUrl}deleteNFT`,
      headers: { authorization: token },
      data: {
        "user_id": this.loginData.id,
        "address": this.loginData?.address,
        "item_id": item.item_id
      }
    }).then((res) => {
      if (res.data.success === true) {
        this.getMyNftAPI(this.state.nftType)
        toast.success(res.data.msg, {});
      } else {
        toast.error(res.data.msg, {});
      }

    }).catch((error) => {
      toast.error("Something went wrong Please try again.", {});
    })
  }


  //  ========================================== Portfolio API's End ======================================


  //  ========================================== Transactions API's Start ======================================

  async getUserPurchaseAPI() {
    const token = this.token
    await axios({
      method: 'post',
      url: `${config.apiUrl}getUserPurchase`,
      headers: { authorization: token },
      data: { "user_id": this.loginData?.id, "address": this.loginData?.address }
      // data: { "user_id": 262, "address": this.loginData?.address }
    }).then(response => {
      if (response.data.success === true) {
        this.setState({
          getUserPurchaseData: response.data.response
        })
      }
    })
  }

  async getSaleHistoryAPI() {
    const token = this.token
    await axios({
      method: 'post',
      url: `${config.apiUrl}getUserSale`,
      headers: { authorization: token },
      data: { "user_id": this.loginData?.id, "address": this.loginData?.address }
      // data: { "user_id": 262, "address": this.loginData?.address }
    }).then(response => {
      if (response.data.success === true) {
        this.setState({
          getUserSaleData: response.data.response
        })
      }
    })
  }

  async getUserTransactionsAPI() {
    const token = this.token
    await axios({
      method: 'post',
      url: `${config.apiUrl}getUserTransactions`,
      headers: { authorization: token },
      data: { "user_id": this.loginData?.id, "address": this.loginData?.address }
      // data: { "user_id": 62, "address": this.loginData?.address }
    }).then(response => {
      if (response.data.success === true) {
        this.setState({
          getUsertransactions: response.data.response
        })
      }
    })
  }

  async getSaleListingAPI() {
    const token = this.token
    await axios({
      method: 'post',
      url: `${config.apiUrl}getUserSaleListing`,
      headers: { authorization: token },
      data: { "user_id": this.loginData?.id, "address": this.loginData?.address }
      // data: { "user_id": 262, "address": this.loginData?.address }
    }).then(response => {
      if (response.data.success === true) {
        this.setState({
          getUserSaleListing: response.data.response
        })
      }
    })
  }

  //  ========================================== Transactions API's End ======================================


  //  ========================================== Bid API's End ======================================

  async getBidPlacedHistoryAPI() {
    const token = this.token
    await axios({
      method: 'post',
      url: `${config.apiUrl}getUserBids`,
      headers: { authorization: token },
      data: { "user_id": this.loginData?.id, "address": this.loginData?.address }
      // data: { "user_id": 262, "address": this.loginData?.address }
    }).then(response => {
      if (response.data.success === true) {
        this.setState({
          getBidPlacedHistoryData: response.data.response
        })
      }
    })
  }

  async getNftBidReceivedHistoryAPI() {
    const token = this.token
    await axios({
      method: 'post',
      url: `${config.apiUrl}myBidItem`,
      headers: { authorization: token },
      data: { "user_id": this.loginData?.id, "address": this.loginData?.address }
      // data: { "user_id": 262, "address": this.loginData?.address }
    }).then(response => {
      if (response.data.success === true) {
        this.setState({
          getBidReceivedNftHistoryData: response.data.response
        })
      }
    }).catch(err => {
      this.setState({
        getBidReceivedNftHistoryData: []
      })
    })
  }

  async viewNftBidDetails(id) {

    this.setState({
      isSocial: 1
    })
    // this.setState({
    //   modalIsOpen: true
    // });
    const token = this.token
    await axios({
      method: 'post',
      url: `${config.apiUrl}getBidDetail`,
      headers: { authorization: token },
      data: { "user_id": this.loginData?.id, "address": this.loginData?.address, 'item_id': id }
    }).then(response => {
      if (response.data.success === true) {
        this.setState({
          getNftBidDetailsData: response.data.response
        })
      }
    })

  }

  //  ========================================== Bid API's End ======================================

  // >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>   Cancel Bid API   >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

  async cancelBidAPI(item) {
    const token = this.token

    confirmAlert({
      title: 'Confirm to submit',
      message: 'Are you sure you want to cancel?',
      buttons: [
        {
          label: 'Yes',
          onClick: () =>
            axios({
              method: 'post',
              url: `${config.apiUrl}cancelBid`,
              headers: { authorization: token },
              data: { "user_id": this.loginData?.id, "address": this.loginData?.address, 'bid_id': item.bid_id }
            }).then(response => {
              if (response.data.success === true) {
                toast.success(response.data?.msg, {});
                this.getBidPlacedHistoryAPI()
              } else {
                toast.error(response.data.msg, {});
              }
            }).catch((error) => {
              toast.error("Something went wrong Please try again.", {});
            })
        },
        {
          label: 'No',
        }
      ]
    });
  }

  openDot(openDotDrop, id) {

    this.setState({
      'openDotId': id
    })

    if (openDotDrop === 0) {
      $("#collections" + id).css({ "display": "block" });
      $("#nft" + id).css({ "display": "block" });
      $("#createnft" + id).css({ "display": "block" });
      $("#salenft" + id).css({ "display": "block" });

      this.setState({
        'openDotDrop': 1,
      })
    }
    else if (openDotDrop === 1) {
      $("#collections" + id).css({ "display": "none" });
      $("#nft" + id).css({ "display": "none" });
      $("#createnft" + id).css({ "display": "none" });
      $("#salenft" + id).css({ "display": "none" });
      this.setState({
        'openDotDrop': 0
      })
    }
  }

  // async BidAcceptAPI(itemData) {
  //   this.setState({
  //     isSocial: 0
  //   })
  //   const token = this.token
  //   confirmAlert({
  //     title: 'Confirm to submit',
  //     message: 'Are you sure you want to accept this bid?',
  //     buttons: [
  //       {
  //         label: 'Yes',
  //         onClick: () =>
  //           axios({
  //             method: 'post',
  //             url: `${config.apiUrl}/bidAccept`,
  //             headers: { authorization: token },
  //             data: { "user_id": itemData.user_id, "address": this.loginData?.address, 'item_id': itemData.item_id, "bid_id": itemData.bid_id }
  //           })
  //             .then(async response => {
  //               if (response.data.success === true) {
  //                 setTimeout(() => {
  //                   this.getNftBidReceivedHistoryAPI()
  //                 }, 1000);
  //                 toast.success(response.data?.msg, {});
  //               }
  //               else if (response.data.success === false) {
  //                 toast.error(response.data?.msg, {});
  //               }
  //             })
  //             .catch(err => {
  //               toast.error(err.response.data?.msg, {});
  //             })
  //       },
  //       {
  //         label: 'No',
  //       }
  //     ]
  //   });
  // }

  async BidAcceptAPI(itemData) {
    console.log(itemData);

    this.setState({
      blockchainUpdationType: 3
    })

    let tokenId = itemData.token_id;
    if (window.ethereum) {
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      let web3 = new Web3(window.ethereum);

      var chainId = config.chainId;

      try {
        this.setState({
          processBtn: 1,
          isDialogOpen: true
        })
        let contractAddress = `${config.marketplaceContract}`
        let from_address = accounts[0];

        const contract = await new web3.eth.Contract(config.abiMarketplace, contractAddress);
        let tx_builder = await contract.methods.acceptBid(tokenId.toString());

        console.log('tx_builder', tx_builder);

        let encoded_tx = tx_builder.encodeABI();
        let gasPrice = await web3.eth.getGasPrice();
        console.log('gasPrice', gasPrice);
        let gasLimit = await web3.eth.estimateGas({
          gasPrice: web3.utils.toHex(gasPrice),
          to: contractAddress,
          from: from_address,
          chainId: chainId,
          data: encoded_tx
        });
        console.log('gasLimit', gasLimit);
        const txData = await web3.eth.sendTransaction({
          gasPrice: web3.utils.toHex(gasPrice),
          gas: web3.utils.toHex(gasLimit),
          to: contractAddress,
          from: from_address,
          chainId: chainId,
          data: encoded_tx
        });


        if (txData.transactionHash) {
          const token = this.token
          axios({
            method: 'post',
            url: `${config.apiUrl}bidAccept`,
            headers: { authorization: token },
            data: { "user_id": itemData.user_id, "address": from_address, 'item_id': itemData.item_id, "bid_id": itemData.bid_id, "hash": txData.transactionHash }
          })
            .then(async response => {
              if (response.data.success === true) {
                setTimeout(() => {
                  window.location.reload();
                }, 1000);
                toast.success(response.data?.msg, {});
                this.setState({
                  processBtn: 0,
                  isDialogOpen: false
                })
              }
              else if (response.data.success === false) {
                this.setState({
                  processBtn: 0,
                  isDialogOpen: false
                })
                toast.error(response.data?.msg, {});
              }
            })
            .catch(err => {
              this.setState({
                processBtn: 0,
                isDialogOpen: false
              })
              toast.error(err.response.data?.msg, {});
            })
          // window.location.reload();
        } else {
          toast.error('Something went wrong please try again3.');
          this.setState({
            processBtn: 0,
            isDialogOpen: false
          })
          return false;
        }

      } catch (err) {
        console.log(err);
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
          processBtn: 0,
          isDialogOpen: false
        })
        return false;
      }

    } else {
      toast.error('Please Connect to MetaMask.');
      this.setState({
        processBtn: 0,
        isDialogOpen: false
      })
      return false;
    }
  }

  //  >>>>>>>>>>>>>>  Get getRoyalties Start  >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

  async getRoyaltiesAPI() {
    const token = this.token
    await axios({
      method: 'post',
      url: `${config.apiUrl}getRoyaltyTransaction`,
      headers: { authorization: token },
      data: { "user_id": this.loginData?.id }
      // data: { "user_id": 270 }
    }).then(response => {
      if (response.data.success === true) {
        this.setState({
          getRoyaltiesData: response.data.response
        })
      }
    })
  }

  modalShow(id) {
    if (id === 1) {
      this.setState({
        isSocial: 1,
        isPutonSale: 1,
        isTransferNft: 1
      })
    }
    else if (id === 0) {
      this.setState({
        isSocial: 0,
        isPutonSale: 0,
        isTransferNft: 0
      })
    }
  }

  formatDate(str) {
    var date = new Date(str),
      mnth = ("0" + (date.getMonth() + 1)).slice(-2),
      day = ("0" + date.getDate()).slice(-2);
    return [date.getFullYear(), mnth, day].join("-");
  }

  handleChangeStartDate = e => {
    let startDate = this.formatDate(e);
    this.setState(prevState => ({
      nftData: { ...prevState.nftData, ['start_date1']: startDate },
      endDate: startDate
    }));
  }

  handleChangeEndDate = e => {
    let endDate = this.formatDate(e);
    this.setState(prevState => ({
      nftData: { ...prevState.nftData, ['expiry_date1']: endDate },
      endDate: endDate
    }))

  }

  sellType(type) {
    this.setState({
      'sell_type': type
    })

    this.setState(prevState => ({
      nftData: { ...prevState.nftData, ['sell_type']: type }
    }))
  }

  // async headerClickdata(data){
  //   this.setState({
  //     selectedTab: data
  //   })
  // }



  async deliveredNft(item) {

    confirmAlert({
      title: 'Confirm to submit',
      message: 'Are you sure that you recieved your physical Nft...',
      buttons: [
        {
          label: 'Yes',
          onClick: () =>
            axios({
              method: 'post',
              url: `${config.apiUrl}updateTransaction`,
              data: { "id": item.item_id, order_status: 3 }
            }).then(response => {
              if (response.data.success === true) {
                toast.success(response.data.msg, {
                  style: {
                    border: '1px solid #713200',
                    padding: '20px',
                    color: '#000',
                  },
                  iconTheme: {
                    primary: 'purple',
                    secondary: '#FFFAEE',
                  },
                });
                this.getUserPurchaseAPI()
              } else {
                toast.error(response.data.msg,

                );
              }
            }).catch(err => {
              toast.error(err.response.data?.msg,

              );
            })
        },
        {
          label: 'No',
        }
      ]
    });
  }

  async purchaseItem(item) {
    console.log(item);
    this.setState({
      physicalNftShow: true,
      physicalData: item
    })
  }

  async closeModel() {
    this.setState({
      physicalNftShow: false
    })
  }


  async NftShippedPhysical(item) {
    var data = {
      id: item.item_id,
      order_status: 2

    }
    await axios({
      method: 'post',
      url: `${config.apiUrl}/updateTransaction`, data,

    })
      .then(result => {
        if (result.data.success === true) {

          toast.success(result.data.msg);
          setTimeout(() => {
            window.location.reload()
          }, 2000)
        }

        else if (result.data.success === false) {
          toast.error(result.data.msg);

        }

      }).catch(err => {
        console.log(err);

      });
  }

  //=========================================  Fees ====================================

  getFeesAPI = async e => {
    await axios.get(`${config.apiUrl}getFees`, {})
      .then(result => {
        if (result.data.success === true) {
          this.setState({
            bid_increase_percentage: result.data.response[0].bid_increase_percentage,
            admin_commission: result.data.response[0].admin_commission

          })
        }
      })
  }



  render() {
    return (

      <>
        <Header />

        <div className="no-bottom no-top" id="content">
          <div id="top" />
          <Toaster />

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
              {this.state.blockchainUpdationType == 1 ?
                <h4 style={{ color: '#000', fontSize: '16px' }}>
                  Put on sale in progress, once process completed NFT will be display on marketplace page.
                </h4>
                :
                this.state.blockchainUpdationType == 2 ?
                  <h4 style={{ color: '#000', fontSize: '16px' }}>
                    Canceling your listing will unpublish this sale from paradigme and requires a transaction.
                  </h4>
                  :
                  <h4 style={{ color: '#000', fontSize: '16px' }}>
                    Bid accepting in progress, Please wait for a while.
                  </h4>
              }

              <p style={{ color: '#091f3f' }}>
                Please do not refresh page or close tab.
              </p>
              <div>
                <div class="spinner-border"></div>
              </div>
            </div>
          </Dialog>

          <section id="subheader" className="text-light" style={{ backgroundImage: `url("images/inner-banner11.jpg")`, backgroundSize: 'cover' }}>
            <div className="center-y relative text-center">
              <div className="container">
                <div className="row">
                  <div className="col-md-12 text-center">
                    <h1>
                      {this.state.selectedTab == 1 ?
                        "Portfolio" : this.state.selectedTab == 2 ?
                          "Bids" : this.state.selectedTab == 3 ?
                            "Transaction History" : this.state.selectedTab == 5 ?
                              "Account Setting" : this.state.selectedTab == 6 ?
                                "Collections" : this.state.selectedTab == 7 ?
                                  "Royalties" : 'My Profile'
                      }
                    </h1>
                  </div>
                  <div className="clearfix" />
                </div>
              </div>
            </div>
          </section>
          <section aria-label="section">
            <div className="container">
              <div className=" wow fadeIn">
                <div className="row">

                  <div className="col-sm-12 col-xs-12">
                    <div className="tab-content create-collection" id="v-pills-tabContent">
                      <div className={this.state.selectedTab == '1' ? "tab-pane fade show active" : "tab-pane fade"} id="protfolio_tabs" role="tabpanel" aria-labelledby="portfolio">
                        <div className="row">
                          <div className="">
                            <div className="d_profile de-flex">
                              <div className="de-flex-col col-md-12">
                                <div className="profile_avatar profile_setting">
                                  {!this.state.aboutData?.profile_pic || this.state.aboutData?.profile_pic === '' || this.state.aboutData?.profile_pic === null || this.state.aboutData?.profile_pic === 'null' || this.state.aboutData?.profile_pic === undefined || this.state.aboutData?.profile_pic === 'undefined' ?
                                    <img style={{
                                      marginBottom: '30px',
                                      marginLeft: '-20px',
                                      display: 'inline-block',
                                      marginTop: '-100px'
                                    }} src="images/default-user-icon.jpg" alt="" />
                                    :
                                    <img style={{
                                      marginBottom: '30px',
                                      marginLeft: '-20px',
                                      display: 'inline-block',
                                      marginTop: '-100px'
                                    }} src={`${config.imageUrl1}` + this.state.aboutData?.profile_pic} alt="" />
                                  }

                                  <br />
                                  <div className="profile_name">
                                    <h4>
                                      {this.state.aboutData?.full_name}
                                      <span className="profile_username">{this.state.aboutData?.user_name}</span>

                                      <span id="wallet" className="profile_wallet">{this.loginData?.address.toString().substring(0, 4) + '...' + this.loginData?.address.toString().substr(this.loginData?.address.length - 4)}</span>

                                      <CopyToClipboard text={this.loginData?.address}
                                        onCopy={() => this.setState({ copied: true })}>
                                        <button id="btn_copy" title="Copy Text" style={{ top: "-3px" }}>
                                          <span class="fa fa-clone" style={{ fontSize: "15px" }}></span>
                                        </button>
                                      </CopyToClipboard>
                                    </h4>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="">
                            <div className="de_tab tab_simple">
                              <ul className="de_nav text-center" >
                                <li onClick={this.getMyNftAPI.bind(this, 1)} className={this.state.nftType == '1' ? 'active' : ''}><span>Owned</span></li>
                                <li onClick={this.getMyNftAPI.bind(this, 2)} className={this.state.nftType == '2' ? 'active' : ''}><span>Created</span></li>
                                <li onClick={this.getMyNftAPI.bind(this, 3)} className={this.state.nftType == '3' ? 'active' : ''} ><span>Sale Listing</span></li>
                                <li onClick={this.getMyNftAPI.bind(this, 4)} className={this.state.nftType == '4' ? 'active' : ''}><span>Favorites</span></li>
                              </ul>
                              <div className="de_tab_content">
                                <div className="tab-1" style={{ display: this.state.nftType === 1 ? 'block' : 'none' }}>
                                  <div className="row">

                                    {this.state.isOwnResponse == true ?
                                      <>
                                        <div className='col-sm-4'>
                                          <ContentShimmer rows="1" style={{ marginTop: "1rem", background: '#e6e6e4', width: '100%' }} rounded={"20px"} size={{ height: 400 }} />
                                        </div>

                                        <div className='col-sm-4'>
                                          <ContentShimmer rows="1" style={{ marginTop: "1rem", background: '#e6e6e4', width: '100%' }} rounded={"20px"} size={{ height: 400 }} />
                                        </div>

                                        <div className='col-sm-4'>
                                          <ContentShimmer rows="1" style={{ marginTop: "1rem", background: '#e6e6e4', width: '100%' }} rounded={"20px"} size={{ height: 400 }} />
                                        </div>
                                      </>
                                      :
                                      this.state.myNftData.length == 0 ?
                                        <span className='text-center bg-grey'><img src='images/nodata-found.png' /></span>
                                        :
                                        this.state.myNftData.map(item => (
                                          <div className='col-lg-4 col-md-6 mb-5'>
                                            <div className='auction-list'>


                                              <div className='row align-items-center'>
                                                <div className='col-sm-6 col-5'>
                                                  <div className='profilebox'>
                                                    {!item.owner_profile_pic || item.owner_profile_pic == null || item.owner_profile_pic == undefined || item.owner_profile_pic == 'null' || item.owner_profile_pic == 'undefined' ?
                                                      <img src="images/default-user-icon.jpg" alt="" />
                                                      :
                                                      <img src={`${config.imageUrl1 + item.owner_profile_pic}`} />
                                                    }
                                                    <Link to={`${config.baseUrl}UserProfile/` + item.owner_id} >
                                                      <h5>{item.owner_name}</h5>
                                                    </Link>
                                                  </div>

                                                </div>
                                                <div className='col-sm-6 col-7 text-right'>
                                                  <div>
                                                    <ReactTooltip />
                                                    {this.loginData?.id == item.owner_id ?
                                                      item.is_on_sale == 1 ?
                                                        item.maxBid > 0 && item.maxBid != null && item.maxBid != 'null' ?
                                                          <a data-tip={`You can't cancel listing because bid placed on it.`} disabled style={{ cursor: 'not-allowed' }} className='btn-primary btn-sm text-white putonsale' href="javascript:void(0)"> Cancel Listing </a>
                                                          :
                                                          <a onClick={this.cancelOrder.bind(this, item)} className=' btn-primary btn-sm text-white putonsale' href="javascript:void(0)" style={{ margin: '7px' }}> Cancel Listing </a>

                                                        :
                                                        <>
                                                          <a onClick={this.putOnSaleModelAPI.bind(this, item, 1)} className=' btn-primary btn-sm text-white putonsale' data-toggle="modal" data-target="#putOnSale" href="javascript:void(0)"> Put on sale </a>&nbsp;&nbsp;

                                                          <Link to={`${config.baseUrl}editNft/` + item.item_id} className=' btn-primary btn-sm text-white putonsale' data-toggle="modal" data-target="#putOnSale" style={{ margin: '7px' }}> <i className='fa fa-edit'></i> </Link>

                                                        </>
                                                      : ""}
                                                  </div>
                                                </div>
                                              </div>
                                              <div class="auction-img" style={{ backgroundImage: item.file_type == 'audio' ? "url(./images/audio.jpeg)" : '', backgroundPosition: item.file_type == 'audio' ? "center" : '', position: item.file_type == 'audio' ? "relative" : '' }}>

                                                <Link to={`${config.baseUrl}nftDetails/` + item.item_id}>

                                                  {item.file_type == 'image' ?
                                                    <div className="">
                                                      <img src={`${config.imageUrl}` + item.image} width="70px" />
                                                    </div>
                                                    :


                                                    item.file_type == 'video' ?
                                                      <video muted autoPlay style={{ height: '192px', width: '292px' }} controls>
                                                        <source src={`${config.imageUrl}${item.image}`} type="video/mp4" />
                                                      </video>

                                                      :
                                                      item.file_type == 'audio' ?
                                                        <ReactAudioPlayer
                                                          className='audio-play'
                                                          src={`${config.imageUrl}${item.image}`}

                                                          controls
                                                        /> :

                                                        item.file_type == 'OBJ' ?
                                                        <OBJModel src={`${config.imageUrl}${item?.image}`} texPath=""/> :

                                                          ""


                                                  }
                                                </Link>

                                              </div>

                                              <div className='profileboxdetail'>
                                                <Link to={`${config.baseUrl}collections/` + item.user_collection_id}>
                                                  {!item.collection_image || item.collection_image == null || item.collection_image == undefined ?
                                                    <img src={`images/no-image.jpg`} />
                                                    :
                                                    <img src={`${config.imageUrl1 + item.collection_image}`} />
                                                  }
                                                  {item.collection_name}
                                                </Link> <br />
                                                <Link to={`${config.baseUrl}nftDetails/` + item.item_id}>
                                                  <h2>{item.name.length < 20 ? item.name : item.name.substring(0, 20) + '....'}</h2>
                                                </Link>
                                                <p style={{ float: 'right' }}>{item.nft_type_select == 1 ? 'Physical' : 'Digital'}</p>
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

                                <div className="tab-2" style={{ display: this.state.nftType === 2 ? 'block' : 'none' }}>
                                  <div className="row">
                                    {this.state.isCreatedResponse == true ?
                                      <>
                                        <div className='col-sm-4'>
                                          <ContentShimmer rows="1" style={{ marginTop: "1rem", background: '#e6e6e4', width: '100%' }} rounded={"20px"} size={{ height: 400 }} />
                                        </div>

                                        <div className='col-sm-4'>
                                          <ContentShimmer rows="1" style={{ marginTop: "1rem", background: '#e6e6e4', width: '100%' }} rounded={"20px"} size={{ height: 400 }} />
                                        </div>

                                        <div className='col-sm-4'>
                                          <ContentShimmer rows="1" style={{ marginTop: "1rem", background: '#e6e6e4', width: '100%' }} rounded={"20px"} size={{ height: 400 }} />
                                        </div>
                                      </>
                                      :
                                      this.state.myNftData.length == 0 ?
                                        <span className='text-center bg-grey'><img src='images/nodata-found.png' /></span>
                                        :
                                        this.state.myNftData.map(item => (
                                          <div className='col-lg-4 col-md-6 mb-5'>
                                            <div className='auction-list'>

                                              <div className='row align-items-center'>
                                                <div className='col-sm-6 col-5'>
                                                  <div className='profilebox'>
                                                    {!item.owner_profile_pic || item.owner_profile_pic == null || item.owner_profile_pic == undefined || item.owner_profile_pic == 'null' || item.owner_profile_pic == 'undefined' ?
                                                      <img src="images/default-user-icon.jpg" alt="" />
                                                      :
                                                      <img src={`${config.imageUrl1 + item.owner_profile_pic}`} />
                                                    }
                                                    <Link to={`${config.baseUrl}UserProfile/` + item.owner_id} >
                                                      <h5>{item.owner_name}</h5>
                                                    </Link>
                                                  </div>

                                                </div>
                                                <div className='col-sm-6 col-7 text-right'>
                                                  <div>

                                                    {this.loginData?.id == item.owner_id ?
                                                      item.is_on_sale == 1 ?
                                                        <a onClick={this.cancelOrder.bind(this, item)} className=' btn-primary btn-sm text-white putonsale' data-toggle="modal" data-target="#putOnSale" href="javascript:void(0)"> Cancel Listing </a>
                                                        :
                                                        <>
                                                          <a onClick={this.putOnSaleModelAPI.bind(this, item, 1)} className=' btn-primary btn-sm text-white putonsale' data-toggle="modal" data-target="#putOnSale" href="javascript:void(0)"> Put on sale </a> &nbsp;

                                                          <Link to={`${config.baseUrl}editNft/` + item.item_id} className=' btn-primary btn-sm text-white putonsale' data-toggle="modal" data-target="#putOnSale"> <i className='fa fa-edit'></i> </Link>

                                                        </>
                                                      : ""}
                                                  </div>
                                                </div>
                                              </div>

                                              <div class="auction-img" style={{ backgroundImage: item.file_type == 'audio' ? "url(./images/audio.jpeg)" : '', backgroundPosition: item.file_type == 'audio' ? "center" : '', position: item.file_type == 'audio' ? "relative" : '' }}>
                                                <Link to={`${config.baseUrl}nftDetails/` + item.item_id}>

                                                  {item.file_type == 'image' ?
                                                    <div className="">
                                                      <img src={`${config.imageUrl}` + item.image} width="70px" />
                                                    </div>
                                                    :


                                                    item.file_type == 'video' ?
                                                      <video muted autoPlay style={{ height: '192px', width: '292px' }} controls>
                                                        <source src={`${config.imageUrl}${item.image}`} type="video/mp4" />
                                                      </video>

                                                      :
                                                      item.file_type == 'audio' ?
                                                        <ReactAudioPlayer
                                                          className='audio-play'
                                                          src={`${config.imageUrl}${item.image}`}

                                                          controls
                                                        /> :item.file_type == 'OBJ' ?
                                                        <OBJModel src={`${config.imageUrl}${item?.image}`} texPath=""/> : ""


                                                  }
                                                </Link>
                                              </div>
                                              <div className='profileboxdetail'>
                                                <Link to={`${config.baseUrl}collections/` + item.user_collection_id}>
                                                  {!item.collection_image || item.collection_image == null || item.collection_image == undefined ?
                                                    <img src={`images/no-image.jpg`} />
                                                    :
                                                    <img src={`${config.imageUrl1 + item.collection_image}`} />
                                                  }
                                                  {item.collection_name}
                                                </Link> <br />
                                                <Link to={`${config.baseUrl}nftDetails/` + item.item_id}>
                                                  <h2>{item.name.length < 20 ? item.name : item.name.substring(0, 20) + '....'}</h2>
                                                </Link>
                                                <p style={{ float: 'right' }}>{item.nft_type_select == 1 ? 'Physical' : 'Digital'}</p>
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

                                <div className="tab-3 mobile-table-none" style={{ display: this.state.nftType === 3 ? 'block' : 'none' }}>
                                  <div className="row">
                                    {/* <ReactDatatable
                                      config={this.configs}
                                      records={this.state.saleHistory}
                                      columns={this.salecolumns}
                                    /> */}

                                    <ReactDatatable
                                      config={this.configForSaleListing}
                                      records={this.state.getUserSaleListing}
                                      columns={this.columnsForSaleListing}
                                    />

                                    <div className='mobile_table desktop-none mobile-block'>
                                      <div className='row'>
                                        {this.state.getUserSaleListing.length == 0 ?
                                          <span className='text-center bg-grey'><img style={{ width: '100%' }} src='images/nodata-found.png' /></span>
                                          :
                                          this.state.getUserSaleListing.map(item => (
                                            <div className='col-sm-4 mb-0'>
                                              <div>
                                                <table width="100%">

                                                  <tr className='table_head'>
                                                    <th>Title:</th>
                                                    <th>{item.item_name}</th>
                                                  </tr>

                                                  <tr>
                                                    <th>Image:</th>
                                                    <td>
                                                      <Link to={`${config.baseUrl}nftDetails/` + item.item_id}>
                                                        {item.file_type == 'image' ?
                                                          <div className="image-circle">
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

                                                                src={`${config.imageUrl}${item.image}`}
                                                                width="35px" height="35px" controls

                                                              /> :item.file_type == 'OBJ' ?
                                                              <OBJModel src={`${config.imageUrl}${item?.image}`} texPath=""/> : ""
                                                        }
                                                      </Link>
                                                    </td>
                                                  </tr>

                                                  <tr>
                                                    <th>Collection:</th>
                                                    <td><span>{item.collection_name}</span></td>
                                                  </tr>
                                                  <tr>
                                                    <th>Amount:</th>
                                                    <td>{item.price + ' MATIC'}</td>
                                                  </tr>
                                                  <tr>
                                                    <th>Created Date:</th>
                                                    <td>{item.nft_datetime}</td>
                                                  </tr>
                                                </table>
                                              </div>
                                            </div>
                                          ))}
                                      </div>
                                    </div>
                                  </div>
                                </div>

                                {this.state.nftType == '4' ?
                                  <div className="tab-4">
                                    <div className="row">

                                      {this.state.isFavResponse == true ?
                                        <>
                                          <div className='col-sm-4'>
                                            <ContentShimmer rows="1" style={{ marginTop: "1rem", background: '#e6e6e4', width: '100%' }} rounded={"20px"} size={{ height: 400 }} />
                                          </div>

                                          <div className='col-sm-4'>
                                            <ContentShimmer rows="1" style={{ marginTop: "1rem", background: '#e6e6e4', width: '100%' }} rounded={"20px"} size={{ height: 400 }} />
                                          </div>

                                          <div className='col-sm-4'>
                                            <ContentShimmer rows="1" style={{ marginTop: "1rem", background: '#e6e6e4', width: '100%' }} rounded={"20px"} size={{ height: 400 }} />
                                          </div>
                                        </>
                                        :
                                        this.state.FavouritesHistory.length == 0 ?
                                          <span className='text-center bg-grey'><img src='images/nodata-found.png' /></span>
                                          :
                                          this.state.FavouritesHistory.map(item => (
                                            <div className='col-sm-4 mb-4'>
                                              <div className='auction-list'>
                                                <div className='profilebox'>
                                                  {!item.owner_profile_pic || item.owner_profile_pic == null || item.owner_profile_pic == undefined || item.owner_profile_pic == 'null' || item.owner_profile_pic == 'undefined' ?
                                                    <img src="images/default-user-icon.jpg" alt="" />
                                                    :
                                                    <img src={`${config.imageUrl1 + item.owner_profile_pic}`} />
                                                  }
                                                  <Link to={`${config.baseUrl}UserProfile/` + item.owner_id} >
                                                    <h5>{item.owner_name}</h5>
                                                  </Link>
                                                </div>
                                                <div class="auction-img" style={{ backgroundImage: item.file_type == 'audio' ? "url(./images/audio.jpeg)" : '', backgroundPosition: item.file_type == 'audio' ? "center" : '', position: item.file_type == 'audio' ? "relative" : '' }}>
                                                  <Link to={`${config.baseUrl}nftDetails/` + item.item_id}>

                                                    {item.file_type == 'image' ?
                                                      <div className="">
                                                        <img src={`${config.imageUrl}` + item.image} width="70px" />
                                                      </div>
                                                      :


                                                      item.file_type == 'video' ?
                                                        <video muted autoPlay style={{ height: '192px', width: '292px' }} controls>
                                                          <source src={`${config.imageUrl}${item.image}`} type="video/mp4" />
                                                        </video>

                                                        :
                                                        item.file_type == 'audio' ?
                                                          <ReactAudioPlayer
                                                            className='audio-play'
                                                            src={`${config.imageUrl}${item.image}`}

                                                            controls
                                                          /> :item.file_type == 'OBJ' ?
                                                          <OBJModel src={`${config.imageUrl}${item?.image}`} texPath=""/> : ""


                                                    }
                                                  </Link>
                                                </div>
                                                <div className='profileboxdetail'>
                                                  <Link to={`${config.baseUrl}collections/` + item.user_collection_id}>

                                                    {!item.collection_image || item.collection_image == null || item.collection_image == undefined ?
                                                      <img src={`images/no-image.jpg`} />
                                                      :
                                                      <img src={`${config.imageUrl1 + item.collection_image}`} />
                                                    }
                                                    {item.collection_name}
                                                  </Link> <br />
                                                  <Link to={`${config.baseUrl}nftDetails/` + item.item_id}>
                                                    <h2>{item.name.length < 20 ? item.name : item.name.substring(0, 20) + '....'}</h2>
                                                  </Link>
                                                  <p style={{ float: 'right' }}>{item.nft_type_select == 1 ? 'Physical' : 'Digital'}</p>
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
                                  </div> : ""}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className={this.state.selectedTab == '5' ? "tab-pane fade show active" : "tab-pane fade"} id="v-pills-home" role="tabpanel" aria-labelledby="v-pills-home-tab">
                        <div className='row'>
                          <div className='col-md-2'>

                          </div>
                          <div className='col-md-8'>
                            <div className="info-block style-1">
                              <div className="be-large-post-align ">
                                <h3 className="info-block-label">Profile</h3>
                              </div>
                            </div>
                            <div className="be-large-post">
                              <div className="row">
                                <div className="col-sm-4">
                                  <h4>Profile</h4>
                                  <div className="w-32 h-32 mb-1  rounded-lg overflow-hidden relative bg-gray-100">
                                    {this.state.image_preview === '' ?
                                      this.state.aboutData?.profile_pic === null || this.state.aboutData?.profile_pic === 'null' ?
                                        <img style={{ height: '150px', width: '150px' }} className="object-cover w-full h-32" src="images/default-user-icon.jpg" alt="" />
                                        :
                                        <img style={{ height: '150px', width: '150px' }} className="object-cover w-full h-32" src={`${config.imageUrl1}${this.state.aboutData?.profile_pic}`} alt="" /> :
                                      <img style={{ height: '150px', width: '150px' }} id="image" className="object-cover w-full h-32" src={this.state.image_preview} />
                                    }
                                    <span className='plusBtn'><i className='fa fa-plus'></i></span>
                                    <div className="absolute top-0 left-0 right-0 bottom-0 w-full block cursor-pointer flex items-center justify-center" onclick="document.getElementById('fileInput').click()">
                                      {this.state.aboutData?.profile_pic === '' ?
                                        <button type="button" style={{ backgroundColor: '#ffffff6e' }} className="hover:bg-gray-100 text-gray-700 font-semibold py-2 px-4 text-sm border border-gray-300 rounded-lg shadow-sm">
                                          <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-camera" width={24} height={24} viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                            <rect x={0} y={0} width={24} height={24} stroke="none" />
                                            <path d="M5 7h1a2 2 0 0 0 2 -2a1 1 0 0 1 1 -1h6a1 1 0 0 1 1 1a2 2 0 0 0 2 2h1a2 2 0 0 1 2 2v9a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2v-9a2 2 0 0 1 2 -2" />
                                            <circle cx={12} cy={13} r={3} />
                                          </svg>
                                        </button>
                                        : ""}
                                    </div>
                                    <input name="profile_pic" onChange={this.profilePicChange.bind(this)} id="fileInput" accept="image/*" className="hidden" type="file" />
                                  </div>
                                </div>
                                <div className="col-sm-8 upload-cover">
                                  <h4>Banner  </h4>
                                  <div className="w-32 h-32 mb-1  rounded-lg overflow-hidden relative bg-gray-100">

                                    {this.state.banner_preview === '' ?
                                      this.state.aboutData?.profile_pic === null || this.state.aboutData?.profile_pic === 'null' ?
                                        <img style={{ height: '150px', width: '100%' }} className="object-cover w-full h-32" src="images/dummy-banner.png" alt="" /> :
                                        <img style={{ height: '150px', width: '100%' }} className="object-cover w-full h-32" src={`${config.imageUrl1}${this.state.aboutData?.banner}`} alt="" /> :
                                      <img style={{ height: '150px', width: '100%' }} id="image" className="object-cover w-full h-32" src={this.state.banner_preview} />
                                    }
                                    <span className='plusBtn'><i className='fa fa-plus'></i></span>
                                    <div className="absolute top-0 left-0 right-0 bottom-0 w-full block cursor-pointer flex items-center justify-center" type="file" >
                                      {this.state.aboutData?.banner_pic === '' ?
                                        <button type="button" style={{ backgroundColor: '#ffffff6e' }} className="hover:bg-gray-100 text-gray-700 font-semibold py-2 px-4 text-sm border border-gray-300 rounded-lg shadow-sm">
                                          <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-camera" width={24} height={24} viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                            <rect x={0} y={0} width={24} height={24} stroke="none" />
                                            <path d="M5 7h1a2 2 0 0 0 2 -2a1 1 0 0 1 1 -1h6a1 1 0 0 1 1 1a2 2 0 0 0 2 2h1a2 2 0 0 1 2 2v9a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2v-9a2 2 0 0 1 2 -2" />
                                            <circle cx={12} cy={13} r={3} />
                                          </svg>
                                        </button>
                                        : ""}
                                      <input id="fileInput" onChange={this.bannerPicChange.bind(this)} className="hidden" type="file" name="banner_pic" accept=".png,.jpg,.jpeg" />
                                    </div>

                                  </div>
                                </div>
                              </div>
                              {/* <h2 class="mt-5 mb-5">Create Collection</h2> */}
                              <div className="spacer-single" />
                              <div className="socail_news">
                                <h5>Name</h5>
                                <input type="text" placeholder='Enter name' name="full_name" onChange={this.handleChange1} value={this.state.aboutData?.full_name} className="form-control mb-4" />
                              </div>

                              <div className="socail_news">
                                <h5>Email</h5>
                                <input type="email" placeholder='Enter email' name="email" onChange={this.handleChange1} value={this.state.aboutData?.email} className="form-control mb-4" />
                              </div>

                              <div className="socail_news">
                                <h5>Description</h5>
                                <textarea placeholder='Enter Description' name="description" onChange={this.handleChange1} value={this.state.aboutData?.description} className="form-control mb-4"></textarea>
                              </div>

                              <div className="social-icons mt-1" style={{ backgroundSize: 'cover' }}>
                                <h5>Link social media</h5>
                                <div className="be-large-post-align">
                                  <div className="social-input form-group focus-2">
                                    <div className="s_icon">
                                      <a className="social-btn color-1" href="#"><i className="fa fa-facebook" /></a>
                                    </div>
                                    <div className="s_input">
                                      <input placeholder='https://www.facebook.com' className="form-control" type="text" name="facebook" onChange={this.handleChange1} value={this.state.aboutData.facebook} />
                                    </div>
                                  </div>
                                  <div className="social-input form-group focus-2">
                                    <div className="s_icon">
                                      <a className="social-btn color-2" href="#"><i className="fa fa-twitter" /></a>
                                    </div>
                                    <div className="s_input">
                                      <input className="form-control" placeholder='https://www.twitter.com' type="text" name="twitter" onChange={this.handleChange1} value={this.state.aboutData.twitter} />
                                    </div>
                                  </div>
                                  <div className="social-input form-group focus-2">
                                    <div className="s_icon">
                                      <a className="social-btn color-3" href="#"><i className="fa fa-telegram " /></a>
                                    </div>
                                    <div className="s_input">
                                      <input className="form-control" placeholder='https://www.telegram.com' type="text" name="telegram" onChange={this.handleChange1} value={this.state.aboutData.telegram} />
                                    </div>
                                  </div>
                                  <div className="social-input form-group focus-2">
                                    <div className="s_icon">
                                      <a className="social-btn color-5" href="#"><i className="fa fa-instagram" /></a>
                                    </div>
                                    <div className="s_input">
                                      <input className="form-control" placeholder='https://www.instagram.com' type="text" name="insta" onChange={this.handleChange1} value={this.state.aboutData.insta} />
                                    </div>
                                  </div>
                                  <div className="social-input form-group focus-2">
                                    <div className="s_icon">
                                      <a className="social-btn color-5" href="#">
                                        <div className="discord-img"><img src="images/discord.png" /></div>
                                      </a>
                                    </div>
                                    <div className="s_input">
                                      <input className="form-control" placeholder='https://www.discord.com' type="text" name="discord" onChange={this.handleChange1} value={this.state.aboutData.discord} />
                                    </div>
                                  </div>
                                </div>

                              </div>
                              <div className="socail_news mt-4">
                                <button id="submit" className="btn-main" type="submit" onClick={this.updateProfileDetails}  >Update</button>
                              </div>
                            </div>
                          </div>
                          <div className='col-md-2'>

                          </div>
                          <div className='row'>
                            <div className='col-md-2'>

                            </div>
                            <div className='col-md-8'>
                              <div className="info-block style-1">
                                <div className="be-large-post-align ">
                                  <h3 className="info-block-label">Add a Address</h3>
                                </div>
                              </div>
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
                                  <button id="submit" className="btn-main" type="submit" onClick={this.updateProfileDetails}  >Update</button>
                                </div>
                              </div>
                            </div>
                            <div className='col-md-2'>

                            </div>
                          </div>
                        </div>


                        {/* <div className="security-authentication mt-4">
                          <div className="info-block style-1">
                            <div className="be-large-post-align ">
                              <h3 className="info-block-label">Security and Authentication</h3>
                            </div>
                          </div>
                          <div className="be-large-post">
                            <div className="row">
                              <div className="col-sm-6">
                                <div className="socail_news">
                                  <h5>Two-Factor Authentication with Email</h5>
                                  <p>Two-Factor Authentication (2FA) is an extra layer of security to ensure that only you have the ability to log in.</p>
                                  <input type="number" value={this.state.twoAuthenticationData.SecretKey} onChange={this.handleTwoWay}
                                    name="SecretKey" className="" onKeyDown={this.formatInput} />
                                  <br />
                                </div>
                              </div>
                              <div className="col-sm-6 text-center">
                                <img src={this.state.twoAuthenticationData.QR_code} className="img-responsive" />
                              </div>
                              <p>{this.state.twoAuthenticationData?.enableTwoFactor == 1 ?
                                "Status: Enable" : "Status: Disable"
                              }</p>
                              <div className="col-sm-12">
                                <div className="socail_news mt-0" style={{ backgroundSize: 'cover' }}>
                                  <button disabled={!this.state.twoAuthenticationData.SecretKey} type="submit" onClick={this.twoAuthenticationVerifyAPI} className="btn-main ">Submit</button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div> */}
                      </div>

                      <div className={this.state.selectedTab == '3' ? "tab-pane fade show active" : "tab-pane fade"} id="transitions-historys" role="tabpanel" aria-labelledby="transitions-history-tabs">
                        <ul className="nav nav-pills mb-3" id="pills-tab" role="tablist">
                          <li className="nav-item" role="presentation">
                            <button className="nav-link active" id="pills-home-tabs" data-bs-toggle="pill" data-bs-target="#pills-homes" type="button" role="tab" aria-controls="pills-home" aria-selected="true">Purchase History</button>
                          </li>
                          <li className="nav-item" role="presentation">
                            <button className="nav-link" id="pills-profile-tab" data-bs-toggle="pill" data-bs-target="#pills-profile" type="button" role="tab" aria-controls="pills-profile" aria-selected="false">Sale History</button>
                          </li>
                          <li className="nav-item" role="presentation">
                            <button className="nav-link" id="pills-trx-tab" data-bs-toggle="pill" data-bs-target="#trx-profile" type="button" role="tab" aria-controls="trx-profile" aria-selected="false">All Transaction History</button>
                          </li>
                        </ul>
                        <div className="tab-content" id="pills-tabContent">
                          <div className="tab-pane fade show active mobile-table-none" id="pills-homes" role="tabpanel" aria-labelledby="pills-home-tabs">

                            <ReactDatatable

                              config={this.configForPurchase}
                              records={this.state.getUserPurchaseData}
                              columns={this.columnsForPurchase}
                            />

                            <div className='mobile_table desktop-none mobile-block'>
                              <div className='row'>
                                {this.state.getUserPurchaseData.length > 0 ?
                                  this.state.getUserPurchaseData.map(item => (
                                    <div className='col-sm-4 mb-0'>
                                      <div>
                                        <table width="100%">

                                          <tr className='table_head'>
                                            <th>Title:</th>
                                            <th>{item.item_name}</th>
                                          </tr>

                                          <tr>
                                            <th>Image:</th>
                                            <td>
                                              <Link to={`${config.baseUrl}nftDetails/` + item.item_id}>
                                                {item.file_type == 'image' ?
                                                  <div className="image-circle">
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

                                                        src={`${config.imageUrl}${item.image}`}
                                                        width="35px" height="35px" controls

                                                      /> : item.file_type == 'OBJ' ?
                                                      <OBJModel src={`${config.imageUrl}${item?.image}`} texPath=""/> :""
                                                }
                                              </Link>
                                            </td>
                                          </tr>

                                          <tr>
                                            <th>Collection:</th>
                                            <td><span>{item.collection_name}</span></td>
                                          </tr>
                                          <tr>
                                            <th>Item Price:</th>
                                            <td> {item.price} MATIC</td>
                                          </tr>
                                          <tr>
                                            <th>Created Date:</th>
                                            <td> {item.nft_datetime}</td>
                                          </tr>
                                          <tr>
                                            <th>Action:</th>
                                            <td>
                                              {item.transfer_hash ?
                                                <a href={item.transfer_hash} target="_blank">
                                                  <button className="btn-main2">Blockchain view</button>
                                                </a>
                                                : ""}
                                            </td>
                                          </tr>
                                        </table>
                                      </div>
                                    </div>
                                  )) :
                                  <span className='text-center bg-grey'><img style={{ width: '100%' }} src='images/nodata-found.png' /></span>
                                }
                              </div>


                            </div>
                          </div>

                          <div className="tab-pane fade mobile-table-none" id="pills-profile" role="tabpanel" aria-labelledby="pills-profile-tab">
                            <ReactDatatable
                              config={this.configForSale}
                              records={this.state.getUserSaleData}
                              columns={this.columnsForSale}
                            />
                            <div className='mobile_table desktop-none mobile-block'>
                              <div className='row'>
                                {this.state.getUserSaleData.length > 0 ?
                                  this.state.getUserSaleData.map(item => (
                                    <div className='col-sm-4 mb-0'>
                                      <div>
                                        <table width="100%">

                                          <tr className='table_head'>
                                            <th>Title:</th>
                                            <th>{item.item_name}</th>
                                          </tr>

                                          <tr>
                                            <th>Image:</th>
                                            <td>
                                              <Link to={`${config.baseUrl}nftDetails/` + item.item_id}>
                                                {item.file_type == 'image' ?
                                                  <div className="image-circle">
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

                                                        src={`${config.imageUrl}${item.image}`}
                                                        width="35px" height="35px" controls

                                                      /> : item.file_type == 'OBJ' ?
                                                      <OBJModel src={`${config.imageUrl}${item?.image}`} texPath=""/> :""
                                                }
                                              </Link>
                                            </td>
                                          </tr>

                                          <tr>
                                            <th>Collection:</th>
                                            <td><span>{item.collection_name}</span></td>
                                          </tr>
                                          <tr>
                                            <th>Item Price:</th>
                                            <td> {item.price} MATIC</td>
                                          </tr>
                                          <tr>
                                            <th>Created Date:</th>
                                            <td> {item.nft_datetime}</td>
                                          </tr>
                                          <tr>
                                            <th>Action:</th>
                                            <td>
                                              {item.transfer_hash ?
                                                <a href={item.transfer_hash} target="_blank">
                                                  <button className="btn-main2">Blockchain view</button>
                                                </a>
                                                : ""}
                                            </td>
                                          </tr>
                                        </table>
                                      </div>
                                    </div>
                                  )) :
                                  <span className='text-center bg-grey'><img style={{ width: '100%' }} src='images/nodata-found.png' /></span>
                                }
                              </div>

                            </div>
                          </div>

                          <div className="tab-pane fade mobile-table-none" id="trx-profile" role="tabpanel" aria-labelledby="pills-trx-tab">
                            <ReactDatatable
                              config={this.configForAllTransactions}
                              records={this.state.getUsertransactions}
                              columns={this.columnsForAllTransactions}
                            />
                            <div className='mobile_table desktop-none mobile-block'>
                              <div className='row'>
                                {this.state.getUsertransactions.length > 0 ?
                                  this.state.getUsertransactions.map(item => (
                                    <div className='col-sm-4 mb-0'>
                                      <div>
                                        <table width="100%">

                                          <tr className='table_head'>
                                            <th>Title:</th>
                                            <th>{item.item_name}</th>
                                          </tr>

                                          <tr>
                                            <th>Image:</th>
                                            <td>
                                              <Link to={`${config.baseUrl}nftDetails/` + item.item_id}>
                                                {item.file_type == 'image' ?
                                                  <div className="image-circle">
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

                                                        src={`${config.imageUrl}${item.image}`}
                                                        width="35px" height="35px" controls

                                                      /> : item.file_type == 'OBJ' ?
                                                      <OBJModel src={`${config.imageUrl}${item?.image}`} texPath=""/> :""
                                                }
                                              </Link>
                                            </td>
                                          </tr>

                                          <tr>
                                            <th>Collection:</th>
                                            <td><span>{item.collection_name}</span></td>
                                          </tr>
                                          <tr>
                                            <th>Item Price:</th>
                                            <td> {item.price} MATIC</td>
                                          </tr>
                                          <tr>
                                            <th>Created Date:</th>
                                            <td> {item.nft_datetime}</td>
                                          </tr>
                                          <tr>
                                            <th>Action:</th>
                                            <td>
                                              {item.transfer_hash ?
                                                <a href={item.transfer_hash} target="_blank">
                                                  <button className="btn-main2">Blockchain view</button>
                                                </a>
                                                : ""}
                                            </td>
                                          </tr>
                                        </table>
                                      </div>
                                    </div>
                                  )) :
                                  <span className='text-center bg-grey'><img style={{ width: '100%' }} src='images/nodata-found.png' /></span>
                                }
                              </div>

                            </div>
                          </div>

                        </div>
                      </div>
                      <div className={this.state.selectedTab == '2' ? "tab-pane fade show active" : "tab-pane fade"} id="purchased-bids" role="tabpanel" aria-labelledby="purchased-bids-tab">
                        <ul className="nav nav-pills mb-3" id="pills-tab" role="tablist">
                          <li className="nav-item" role="presentation">
                            <button className="nav-link active" id="your-purchased-tab" data-bs-toggle="pill" data-bs-target="#your-purchased" type="button" role="tab" aria-controls="pills-home" aria-selected="true">Bid Placed</button>
                          </li>
                          <li className="nav-item" role="presentation">
                            <button className="nav-link" id="your-bids-tab" data-bs-toggle="pill" data-bs-target="#your-bids" type="button" role="tab" aria-controls="your-bids" aria-selected="false">Bid Received</button>
                          </li>
                        </ul>
                        <div className="tab-content" id="pills-tabContent">
                          <div className="tab-pane fade show active mobile-table-none" id="your-purchased" role="tabpanel" aria-labelledby="your-purchased-tab">

                            <ReactDatatable
                              config={this.configForUserBid}
                              records={this.state.getBidPlacedHistoryData}
                              columns={this.columnsForUserBid}
                            />

                            <div className='mobile_table desktop-none mobile-block'>

                              <div className='row'>
                                {this.state.getBidPlacedHistoryData.length > 0 ?
                                  this.state.getBidPlacedHistoryData.map(item => (
                                    <div className='col-sm-4 mb-0'>
                                      <div>
                                        <table width="100%">

                                          <tr className='table_head'>
                                            <th>Title:</th>
                                            <th>{item.item_name}</th>
                                          </tr>

                                          <tr>
                                            <th>Image:</th>
                                            <td>
                                              <Link to={`${config.baseUrl}nftDetails/` + item.item_id}>
                                                {item.file_type == 'image' ?
                                                  <div className="image-circle">
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

                                                        src={`${config.imageUrl}${item.image}`}
                                                        width="35px" height="35px" controls

                                                      /> : item.file_type == 'OBJ' ?
                                                      <OBJModel src={`${config.imageUrl}${item?.image}`} texPath=""/> :""
                                                }
                                              </Link>
                                            </td>
                                          </tr>

                                          <tr>
                                            <th>Owner Name:</th>
                                            <td><span>{item.owner_name}</span></td>
                                          </tr>
                                          <tr>
                                            <th>Reserve Price:</th>
                                            <td> {item.item_price} MATIC</td>
                                          </tr>
                                          <tr>
                                            <th>Hightest Bid:</th>
                                            <td> {item.max_bid} MATIC</td>
                                          </tr>
                                          <tr>
                                            <th>Your Bid:</th>
                                            <td> {item.bid_price} MATIC</td>
                                          </tr>
                                          <tr>
                                            <th>Status:</th>
                                            <td>{item.status}</td>
                                          </tr>
                                        </table>
                                      </div>
                                    </div>
                                  ))
                                  :
                                  <span className='text-center bg-grey'><img style={{ width: '100%' }} src='images/nodata-found.png' /></span>
                                }
                              </div>


                            </div>

                          </div>
                          <div className="tab-pane fade mobile-table-none" id="your-bids" role="tabpanel" aria-labelledby="your-bids-tab">
                            <ReactDatatable
                              config={this.configForNftBidReceived}
                              records={this.state.getBidReceivedNftHistoryData}
                              columns={this.columnsForNftBidReceived}
                            />
                            <div className='mobile_table desktop-none mobile-block'>
                              <div className='row'>
                                {this.state.getBidReceivedNftHistoryData.length > 0 ?
                                  this.state.getBidReceivedNftHistoryData.map(item => (
                                    <div className='col-sm-4 mb-0'>
                                      <div>
                                        <table width="100%">

                                          <tr className='table_head'>
                                            <th>Title:</th>
                                            <th>{item.item_name}</th>
                                          </tr>

                                          <tr>
                                            <th>Image:</th>
                                            <td>
                                              <Link to={`${config.baseUrl}nftDetails/` + item.item_id}>
                                                {item.file_type == 'image' ?
                                                  <div className="image-circle">
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

                                                        src={`${config.imageUrl}${item.image}`}
                                                        width="35px" height="35px" controls

                                                      /> : item.file_type == 'OBJ' ?
                                                      <OBJModel src={`${config.imageUrl}${item?.image}`} texPath=""/> :""
                                                }
                                              </Link>
                                            </td>
                                          </tr>

                                          <tr>
                                            <th>Collection:</th>
                                            <td><span>{item.collection_name}</span></td>
                                          </tr>
                                          <tr>
                                            <th>Item Price:</th>
                                            <td> {item.price} MATIC</td>
                                          </tr>
                                          <tr>
                                            <th>Hightest Bid:</th>
                                            <td> {item.max_bid} MATIC</td>
                                          </tr>
                                          <tr>
                                            <th>Action:</th>
                                            <td>
                                              <button onClick={this.viewNftBidDetails.bind(this, item.item_id)} className='sale-list btn btn-primary btn-sm' data-toggle="modal" data-target="#productShareSheet">View Bids</button>
                                            </td>
                                          </tr>
                                        </table>
                                      </div>
                                    </div>
                                  )) :
                                  <span className='text-center bg-grey'><img style={{ width: '100%' }} src='images/nodata-found.png' /></span>
                                }
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>


                      <div className={this.state.selectedTab == '6' ? "tab-pane fade show active" : "tab-pane fade"} id="Collections" role="tabpanel" aria-labelledby="Collections-tab">
                        <div className="">
                          <div className="">
                            <h1 className="info-block-label d-inline" style={{ color: '#000', fontSize: '25px' }}>Collections</h1>
                            <a href={`${config.baseUrl}createcollection`}>
                              <h3 className="info-block-label pull-right">
                                <button class="btn-main">Add Collection <i class="fa fa-plus" aria-hidden="true"></i></button>
                              </h3>
                            </a>
                          </div>
                        </div>
                        <div className="change-password mt-4 trending-collection">
                          <div className="be-large-post">
                            <div className="row">

                              {this.state.collectionData.length > 0 ?
                                this.state.collectionData.map(item => (
                                  <div className='col-sm-4 mb-5 position-relative'>

                                    <Link to={`${config.baseUrl}editCollection/` + item.collection_id} className=' btn-primary btn-sm text-white pull-right mb-1'> <i className='fa fa-edit'></i> </Link>

                                    <div className="auction-list ">
                                      <div className="auction-img">
                                        <Link to={`${config.baseUrl}collections/` + item.collection_id}>
                                          {!item.banner || item.banner == "" || item.banner == null || item.banner == 'null' || item.banner == undefined || item.banner == 'undefined' ?
                                            <img src="images/no-image.jpg" alt />
                                            :
                                            <img src={`${config.imageUrl1 + item.banner}`} alt />
                                          }
                                        </Link>
                                      </div>
                                      <div className='chakra-stack css-1wdu7zf'>
                                        <div className="d-flex">
                                          <div className="seaflightImage">
                                            <div style={{ backgroundImage: `url(${config.imageUrl1 + item.profile_pic})` }} aria-label="Sea Flights" role="image" className="sea-img" />
                                          </div>
                                        </div>
                                      </div>
                                      <div className='bottom'>

                                        <div class="chakra-stack css-1npz8pa">
                                          <h3 class="chakra-text css-1yfa4pt mb-2">
                                            <Link to={`${config.baseUrl}collections/` + item.collection_id}>{item.name ? item.name : ''}</Link></h3>
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
                                              <div className="proheadname">&nbsp;&nbsp;{item.creater_name}</div>
                                            </div>
                                          </Link>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                ))
                                :
                                <span className='text-center bg-grey'><img src='images/nodata-found.png' /></span>
                              }

                            </div>
                          </div>
                        </div>
                      </div>


                      <div className={this.state.selectedTab == '7' ? "tab-pane fade show active" : "tab-pane fade"} id="Royalties" role="tabpanel" aria-labelledby="Royalties-tab">
                        <div className="info-block style-1 royalties_head">
                          <div className="be-large-post-align ">
                            <h3 className="info-block-label  d-inline">Royalties</h3>
                          </div>
                        </div>
                        <div className="be-large-post">
                          <ReactDatatable
                            config={this.configRoyalties}
                            records={this.state.getRoyaltiesData}
                            columns={this.columnsRoyalties}
                          />
                        </div>
                      </div>

                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>

        <div className={this.state.isSocial === 0 ? "modal fade" : "modal fade show"} id="productShareSheet" style={{ display: this.state.isSocial === 0 ? 'none' : 'block' }} tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true" data-backdrop="false">
          <div className="modal-dialog modal-lg" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="exampleModalLabel">Bids Details</h5>
                <button type="button" className="close bidsclose" data-dismiss="modal" style={{
                  fontSize: '26px'
                }} aria-label="Close " onClick={this.modalShow.bind(this, 0)} >
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="modal-body">
                <div class="table-responsive">
                  <table class="table table-striped mb-0">
                    <thead>
                      <tr>

                        <th>Image</th>
                        <th>Username</th>
                        <th>Title</th>
                        <th>Bid Price</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {this.state.getNftBidDetailsData.length === 0 ?
                        <tr >
                          <td colspan="6" className="text-center"><p>No data found!!</p></td></tr> :
                        this.state.getNftBidDetailsData.map(item => (
                          <tr>
                            <td>
                              {!item.profile_pic || item.profile_pic == '' || item.profile_pic == null || item.profile_pic == undefined || item.profile_pic == 'undefined' || item.profile_pic == 'null' ?
                                <img width="50px" height="50px" src={`images/default-user-icon.jpg`}></img>
                                :
                                <img width="50px" height="50px" src={`${config.imageUrl1}` + item.profile_pic}></img>
                              }
                            </td>
                            <td>{item.full_name}</td>
                            <td>{item.item_name}</td>
                            <td>{item.bid_price} MATIC</td>
                            <td>
                              <button type='submit' id={'acceptId' + item.bid_id} onClick={this.BidAcceptAPI.bind(this, item)} className="btn btn-primary acceptId">Accept</button>
                            </td>
                          </tr>
                        ))}
                    </tbody>

                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className={this.state.isPutonSale === 0 ? "modal fade" : "modal fade show"} id="putOnSale" style={{ display: this.state.isPutonSale === 0 ? 'none' : 'block' }} tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true" data-backdrop="false">
          <div className="modal-dialog" role="document">

            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="exampleModalLabel"> Put On Sale </h5>
                <a type="button" className="close" data-dismiss="modal" style={{
                  fontSize: '26px'
                }} aria-label="Close" onClick={this.modalShow.bind(this, 0)} >
                  <span aria-hidden="true">&times;</span>
                </a>
              </div>

              <div className="modal-body">
                <div className="de_tab tab_methods">
                  <div className="de_tab_content">
                    <span style={{ color: 'red' }}>List price and listing schedule can not be edited once the item is listed. You will need to cancel your listing and relist the item with the updated price and dates. </span><br /><br />
                    {this.state.nftData?.sell_type === 1 ?
                      <>
                        <h5>NFT Type : Price</h5>
                        <h5>Price</h5>
                        <input type="text" disabled value={this.state.nftData?.price} name="price" id="item_price_bid" className="form-control" placeholder="Enter Price" />
                      </>
                      :
                      this.state.nftData?.sell_type === 2 ?
                        <>
                          <h5>NFT Type : Auction</h5>
                          <h5>Minimum bid</h5>
                          <input type="text" name="minimum_bid_amount" disabled value={this.state.nftData?.price} id="item_price_bid" className="form-control" placeholder="Enter Minimum Bid" />
                          <div className="spacer-10" />
                          <div className="row">
                            <div className="col-md-6">
                              <h5>Starting date</h5>
                              <DatePicker className="form-control" name="start_date" disabled value={this.state.nftData?.start_date1 ? this.state.nftData?.start_date1 : ''} />
                            </div>
                            <div className="col-md-6">
                              <h5>Expiration date</h5>
                              <DatePicker className="form-control" name="expiry_date" minDate={this.state.endDate} disabled value={this.state.nftData?.expiry_date1 ? this.state.nftData?.expiry_date1 : ''} />

                            </div>
                            <div className="spacer-single" />
                          </div>
                        </>
                        :

                        ""
                    }
                  </div>
                </div>
                <div className="spacer-10" />
                {this.state.spinLoader == '0' ?
                  <input type="submit" onClick={this.approveNFT.bind(this, this.state.nftData)} value="Approve" id="submit" className="btn-main" defaultValue="Create Item" />
                  :
                  <button disabled className="btn-main" id="deposit-page" >Processing &nbsp; <i className="fa fa-spinner fa-spin validat"></i></button>
                }
                <div className="spacer-single" />
              </div>
            </div>

          </div>
        </div>


        <div className={this.state.physicalNftShow == true ? 'modal fade in show' : 'modal fade'} style={{ display: this.state.physicalNftShow == true ? 'block' : 'none' }} id="createCollection" tabindex="-1" aria-labelledby="createCollectionLabel" aria-hidden="true">
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="createCollectionLabel">Shipping Address</h5>
                {/* <button type="submit" className="btn-close" onClick={this.closeModel.bind(this)}></button> */}
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
                            <input type="number" placeholder='Enter mobile number' name="mobile_number" disabled value={this.state.physicalData?.mobile_number ? this.state.physicalData?.mobile_number : ''} className="form-control mb-4" />
                          </div>

                          <div className='col-md-6'>
                            <h5>Pin Code</h5>
                            <input type="text" placeholder='Enter Pin Code' name="pin_code" disabled value={this.state.physicalData?.pin_code ? this.state.physicalData?.pin_code : ''} className="form-control mb-4" />
                          </div>
                        </div>


                        <div className="socail_news row">


                          <div className='col-md-12'>
                            <h5>Address</h5>
                            <textarea placeholder='Enter shipping address' name="shipping_address" disabled value={this.state.physicalData?.shipping_address ? this.state.physicalData?.shipping_address : ''} className="form-control mb-4" rows="4" cols="50">

                            </textarea>
                          </div>
                        </div>


                        <div className="socail_news row">

                          <div className='col-md-6'>
                            <h5>Locality</h5>
                            <input type="text" placeholder='Enter Locality' name="locality" disabled value={this.state.physicalData?.locality ? this.state.physicalData?.locality : ''} className="form-control mb-4" />
                          </div>

                          <div className='col-md-6'>
                            <h5>City</h5>
                            <input type="text" placeholder='Enter city' name="city" disabled value={this.state.physicalData?.city ? this.state.physicalData?.city : ''} className="form-control mb-4" />
                          </div>


                        </div>

                        <div className="socail_news row">
                          <div className='col-md-6'>
                            <h5>State</h5>
                            <input type="text" placeholder='Enter state' name="state" disabled value={this.state.physicalData?.state ? this.state.physicalData?.state : ''} className="form-control mb-4" />
                          </div>
                          <div className='col-md-6'>
                            <h5>LandMark</h5>
                            <input type="text" placeholder='Enter landmark' name="landmark" disabled value={this.state.physicalData?.landmark ? this.state.physicalData?.landmark : ''} className="form-control mb-4" />
                          </div>



                        </div>

                        <br />
                        <div className="socail_news mt-4">
                          {this.state.physicalData.order_status == 1 ?
                            <button id="submit" className="btn btn-primary" type="submit" onClick={this.NftShippedPhysical.bind(this, this.state.physicalData)}  >Confirm to Shipped</button> : ''
                          }

                        </div>
                      </div>

                    </div>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" style={{ background: 'red', color: '#fff' }} onClick={this.closeModel.bind(this)}>Close</button>
              </div>
            </div>
          </div>
        </div>


        <Footer />
      </>
    )
  }
}
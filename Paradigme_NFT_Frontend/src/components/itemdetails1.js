import React, { Component, Fragment } from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import Header from '../directives/header'
import { Helmet } from 'react-helmet'
import Footer from '../directives/footer'
import config from '../config/config'
import { Link } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';
import Cookies from 'js-cookie'
import $ from 'jquery';
// import StripeCheckout from 'react-stripe-checkout'
import ReactDatatable from '@ashvin27/react-datatable'
import { TwitterShareButton, TwitterIcon, FacebookShareButton, FacebookIcon, EmailIcon, EmailShareButton, WhatsappIcon, WhatsappShareButton } from 'react-share';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import { CheckoutForm } from '../components/CheckoutForm';
import Countdown, { zeroPad } from 'react-countdown';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { Player } from 'video-react';
import ReactAudioPlayer from 'react-audio-player';
import Web3 from 'web3';
import Lightbox from "react-awesome-lightbox";
import LightboxSlider from 'react-image-lightbox';
import 'react-image-lightbox/style.css';
import Swal from 'sweetalert2'

// You need to import the CSS only once
import "react-awesome-lightbox/build/style.css";
import ModalImage from "react-modal-image";
import Loader from "react-loader-spinner";

import { PayPalButton } from "react-paypal-button-v2";


const headers = {
   'Content-Type': 'application/json'
};
const TITLE = 'Infinity8-Itemdetail'


//==========Test key  ==============
const PUBLIC_KEY = "pk_test_51IpRmeSD2c5qKNYTXSuDr5yfTYmYNh3KdjAjHsf6sNDbKiyxEDFENB2JGxP7YEhHDTa9UxID7LvBkMXg3UvYobZu00WOufMwVp";
//===============Live key ===========================
//  const PUBLIC_KEY = "pk_live_51ItVD8AjetNAyHoh3F3TtF6wf6KrutR0U2QIrRLbDdN797ifY6EScVyuhvJM01VsWSEKSZnRrTWqHKWOByJXbeI200JS6af4tO";
const stripeTestPromise = loadStripe(PUBLIC_KEY);

export default class itemdetails extends Component {

   constructor(props) {
      super(props)
      this.loginData = (!Cookies.get('loginSuccess')) ? [] : JSON.parse(Cookies.get('loginSuccess'))
      const { match: { params } } = this.props;
      this.id = params.id
      this.state = {
         ConnectWalletAddress: this.loginData?.data?.user_address,
         getListItem: '',
         getRelatedItem: [],
         etherClickActive: 0,
         bid_price: '',
         getBidDetailData: [],
         socialIconData: '',
         likeCount: '',
         ErrorMessage: '',
         cryptoPayBtnDesable: false,
         copied: false,
         getUsdBalance: '',
         getWebImageData: [],
         getImage1: '',
         seeIm1: '',
         paypalError: '',

         photoIndex: 0,
         isOpen: false,
         mainSliderImages: [],
         loaderImage: 0,
         nodata: ''
      }
      this.itemDetailsAPI = this.itemDetailsAPI.bind(this);
      
      this.onChange = this.onChange.bind(this);
      this.submitBid = this.submitBid.bind(this);
      this.approvalAPI = this.approvalAPI.bind(this);
      this.PayPalFunction = this.PayPalFunction.bind(this);
      this.afterPaypalSuccess = this.afterPaypalSuccess.bind(this);

      this.columns = [
         {
            key: "user_name",
            text: "Owner",
            cell: (item) => {
               return (
                  <Fragment>
                     <Link className="weak mr-2 d-inlne-block" to={`${config.baseUrl}featurescreator/${item.user_id}`}
                        target="_blank">
                        <img src={item.profile_pic === null || item.profile_pic === '' || item.profile_pic === undefined
                           ? 'images/noimage.png'
                           :
                           `${config.imageUrl1}${item.profile_pic}`} className="profile_picture x-small"
                           style={{ height: '36px', width: '36px' }} alt="" />
                     </Link>
                     <div className="ml-1 mt-2 d-inline-block" style={{ maxWidth: '150px', overflowX: 'hidden', textOverflow: 'ellipsis', marginBottom: '-7px' }}>
                        <Link to={`${config.baseUrl}featurescreator/${item.user_id}`} target="_blank" className="heavy strong" mptrackaction="product:activity:collector_name">
                           {item.full_name}
                        </Link>
                     </div>
                  </Fragment>
               );
            }
         },
         {
            key: "activity",
            text: "Activity",
            cell: (item) => {
               return (
                  <div>

                     {item.transaction_type} ${item.amount}
                  </div>
               );
            }
         },
         {
            key: "edition_text",
            text: "Edition",

         },
         {
            key: "transaction_date",
            text: "Date",
            sortable: true,
            cell: (item) => {
               return (
                  <div>
                     {item.transaction_date}
                  </div>
               );
            }

         },
      ]

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
   componentDidMount() {
      this.itemDetailsAPI()
      window.scrollTo({ top: 0, behavior: 'smooth' });
      this.getItemLikeCountsAPI()
      this.getWebImageAPI()

      // setTimeout(() => {
      //    if(window.ethereum){
      //       const { ethereum } = window;
      //       this.setState({
      //          ConnectWalletAddress:ethereum.selectedAddress
      //       })         
      //    }   
      // }, 1000);
      // if(this.loginData?.data?.id != this.state.getListItem?.user_id ){
      //    this.itemViewsAPI()
      // }
   }




   async connectMetasmask() {
      if (window.ethereum) {
         await window.ethereum.send('eth_requestAccounts');
         window.web3 = new Web3(window.ethereum);
         const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
         this.setState({
            ConnectWalletAddress: accounts
         })
      }
      else {
         toast.error(`Please install MetaMask to use this dApp!`, {
            position: toast.POSITION.TOP_CENTER
         });
      }
   }



   //====================================  CAtegory API =============================

   async getWebImageAPI() {
      await axios({
         method: 'get',
         url: `${config.apiUrl}getWebImage`,
         headers: { "Authorization": this.loginData?.message },
      }).then(response => {
         if (response.data.success === true) {
            this.setState({
               getWebImageData: response.data?.response[0]
            })
         }
      })
   }

   //=====================================  change event ===============================

   onChange = e => {
      this.setState({
         [e.target.name]: e.target.value
      })
   }

   //===================================   give approval    =============================

   async approvalAPI() {
      this.setState({
         cryptoPayBtnDesable: true,
      })
      if (this.loginData.length === 0) {
         window.location.href = `${config.baseUrl}login`
      }
      else {

         if (parseFloat(this.state.bid_price) < parseFloat(this.state.getListItem?.max_bid)) {
            this.setState({
               cryptoPayBtnDesable: false,
               ErrorMessage: 'Bid price should be greater than ' + this.state.getListItem?.max_bid
            })
         }
         else {
            Cookies.set('purchase_item_id', this.id)

            Cookies.set('paymentFor', this.state.getListItem?.sell_type_name);
            let bid_price;
            if (this.state.getListItem?.sell_type_name === 'Price') {
               bid_price = (parseFloat(this.state.getListItem?.price) + parseFloat(this.state.getUsdBalance?.txn_fee_usd))
            }
            else {
               bid_price = this.state.bid_price
            }
            await axios({
               method: 'post',
               url: `${config.apiUrl}onlinetrx_start`,
               headers: { "Authorization": this.loginData?.Token },
               data: { "email": this.loginData.data.user_email, "user_address": this.state.ConnectWalletAddress, "sell_type": this.state.getListItem?.sell_type_name, "item_edition_id": this.id, 'item_id': this.state.getListItem?.item_id, 'user_id': this.loginData.data.id, 'amount': bid_price }
            })
               .then(result => {
                  if (result.data.success === true) {

                     window.location.href = `https://merchant.net-cents.com/widget/payment/currencies?data=${result.data.token}`
                  }
                  else if (result.data.success === false) {
                  }
               }).catch(err => {
               });
         }
      }
   }

   //=======================================  Like details  =====================

   async itemViewsAPI() {
      await axios({
         method: 'post',
         url: `${config.apiUrl}itemView`,
         data: { "item_edition_id": this.id, "user_id": this.loginData.data.id }
      })
         .then(result => {
            if (result.data.success === true) {

            }
            else if (result.data.success === false) {
            }
         }).catch(err => {
         });
   }


   //=======================================  Like details  =====================

   async getItemLikeCountsAPI() {
      await axios({
         method: 'post',
         url: `${config.apiUrl}getItemLikeCount`,
         data: { "item_edition_id": this.id, "user_id": this.loginData?.data?.id }
      })
         .then(result => {
            if (result.data.success === true) {
               this.setState({
                  likeCount: result.data.response
               })

            }
            else if (result.data.success === false) {
            }
         }).catch(err => {
         });
   }

   //=======================================  Submit Bid  =====================

   async submitBid() {
      if (this.loginData.length === 0) {
         window.location.href = `${config.baseUrl}login`
      }
      else {

         if ((this.state.bid_price) < (this.state.getListItem?.max_bid)) {
            toast.error('Bid price should be greater than ' + this.state.getListItem?.max_bid, {
               position: toast.POSITION.TOP_CENTER,
            })
         }
         else {
            let bid_price;
            if (this.state.getListItem?.sell_type_name === 'Price') {
               bid_price = this.state.getListItem?.price
            }
            else {
               bid_price = this.state.bid_price
            }
            await axios({
               method: 'post',
               url: `${config.apiUrl}insertBid`,
               headers: { "Authorization": this.loginData?.Token },
               data: { "email": this.loginData.data.user_email, "item_edition_id": this.id, 'bid_price': bid_price, 'user_id': this.loginData.data.id }
            })
               .then(result => {
                  if (result.data.success === true) {
                     toast.success(result.data.msg, {
                        position: toast.POSITION.TOP_CENTER,
                     })
                     window.location.reload()
                  }
                  else if (result.data.success === false) {
                  }
               }).catch(err => {
               });
         }
      }
   }

   //=======================================  Item details  =====================

   async itemDetailsAPI() {
      this.setState({
         loaderImage:0
      })
   await axios({
      method: 'post',
      url: `${config.apiUrl}itemdetail`,
      data: { "item_edition_id": this.id,'user_id':this.loginData?.data?.id }
   })
      .then(result => {
             if (result.data.success === true) {
            let image_array = (!result.data.response.image_array)?[]:JSON.parse(result.data.response.image_array);
            // let resData = result.data;
               
            
            this.setState({
               getUsdBalance:result.data,
               getListItem: result.data.response,
               getRelatedItem: result.data.data,
               getImage1:image_array,
               loaderImage:1,
               nodata:1
            })
            let mainArr = [];
            image_array.map(item=>(
               (item.file_type == 'image')?
               mainArr.push(`${config.imageUrl}${item.image}`)
               :''
               ))
               // alert('3')
               this.setState({
               mainSliderImages:mainArr
            })
            // console.log(this.state.mainSliderImages)
            if(this.loginData.data.id !== this.state.getListItem?.user_id)
         {
            this.itemViewsAPI()
         }
         this.getBidDetailAPI()
   
         }
         else if (result.data.success === false) {
            this.setState({
               loaderImage:1
            })
         }
      }).catch(err => {
         this.setState({
            loaderImage:1,
            nodata:''
         })
      });
   }
   //=======================================  Like/dislike  =====================

   async likeAPI() {
      if (this.loginData.length === 0) {
         window.location.href = `${config.baseUrl}login`
      }
      await axios({
         method: 'post',
         url: `${config.apiUrl}likeItem`,
         data: { "item_edition_id": this.id, user_id: this.loginData.data.id }
      })
         .then(result => {
            if (result.data.success === true) {
               this.getItemLikeCountsAPI()
            }
            else if (result.data.success === false) {
            }
         }).catch(err => {
         });
   }

   //=======================================  Bid details  =====================

   async getBidDetailAPI() {


      await axios({
         method: 'post',
         url: `${config.apiUrl}getMarketActivity`,
         data: { "item_id": this.state.getListItem.item_id }
      })
         .then(result => {
            if (result.data.success === true) {
               this.setState({
                  getBidDetailData: result.data.response,

               })
            }
            else if (result.data.success === false) {
            }
         }).catch(err => {
         });
   }


   //======================================  Card and ether popup dynamic through state =================

   etherClick(id) {
      if (id === 'cc') {
         this.setState({
            etherClickActive: 0,
            bid_price: ''
         })
      }
      else if (id === 'Ether') {
         this.setState({
            etherClickActive: 1,
            bid_price: ''
         })
      }
   }

   //=================================  Scroll to recent activity  ============================

   scollREcent() {
      document.getElementById('market_activity').scrollIntoView({ behavior: 'smooth', block: 'end' });
   }


   socialIcon(id) {
      if (id === '1') {
         this.setState({
            socialIconData: '1'
         })
      }
      else if (id === '0') {
         this.setState({
            socialIconData: ''
         })
      }
   }


   loginScreen() {
      window.location.href = `${config.baseUrl}login`
   }

   formatInput = (e) => {
      // Prevent characters that are not numbers ("e", ".", "+" & "-") 
      let checkIfNum;
      if (e.key !== undefined) {
         // Check if it's a "e", ".", "+" or "-"
         checkIfNum = e.key === "e" || e.key === "." || e.key === "+" || e.key === "-";
      }
      else if (e.keyCode !== undefined) {
         // Check if it's a "e" (69), "." (190), "+" (187) or "-" (189)
         checkIfNum = e.keyCode === 69 || e.keyCode === 190 || e.keyCode === 187 || e.keyCode === 189;
      }
      return checkIfNum && e.preventDefault();
   }

   loading() {
      setTimeout(() => {
         window.location.reload()
      });
   }
   multiImageOnModal() {
      this.setState({
         isOpen: true
      })
   }
   async afterPaypalSuccess() {
      var trxamount = this.state.getListItem?.sell_type_name === 'Price' ? (parseFloat(this.state.getListItem?.price) + parseFloat(this.state.getUsdBalance?.txn_fee_usd)) : this.state.bid_price;
      const response = await axios({
         method: 'post',
         url: `${config.apiUrl}paypalPurchase`,
         headers: { "Authorization": this.loginData?.Token },
         data: {
            email: this.loginData.data?.user_email,
            amount: trxamount,
            id: "Testpaypal",
            user_id: this.loginData?.data?.id,
            sell_type: this.state.getListItem?.sell_type_name,
            item_edition_id: this.id,
            item_id: this.state.getListItem?.item_id,
            user_address: this.state.ConnectWalletAddress,
         }
      })
      var willSearch = await Swal.fire({
         title: 'Payment successful!',
         text: 'Congratulations, you are successfully completed the payment.',
         icon: 'success',
         width: 500,
         confirmButtonColor: '#3085d6',
         allowOutsideClick: false,
         // showCancelButton: true,
         confirmButtonText: 'View items',
         // cancelButtonText: 'No, keep it'
      });
      Cookies.set('paymentFor', this.state.getListItem?.sell_type_name);
      Cookies.set('purchase_item_id', response.data?.transaction_id)
      window.location.href = `${config.baseUrl}purchasedetail`
   }
   async PayPalFunction() {
      var trxamount = "0.1";
      // var trxamount = this.state.getListItem?.sell_type_name === 'Price' ? (parseFloat(this.state.getListItem?.price) + parseFloat(this.state.getUsdBalance?.txn_fee_usd)): this.state.bid_price;
      if (this.state.getListItem?.sell_type_name === 'Auction') {
         if ((trxamount) < (this.state.getListItem?.max_bid)) {
            this.setState({
               paypalError: `Bid price should be greater than ${this.state.getListItem?.max_bid}`
            });
            return false;
         } else {
            this.setState({
               paypalError: ``
            });
         }
      }
      return (
         <>
            <PayPalButton
               amount={trxamount}
               currency="USD"
               // shippingPreference="NO_SHIPPING" // default is "GET_FROM_FILE"
               onSuccess={(details, data) => {
                  //  alert("Transaction completed by " + details.payer.name.given_name);
                  console.log("successDetails", details);
                  this.afterPaypalSuccess();
                  // OPTIONAL: Call your server to save the transaction
               }}
               onCancel={(details, data) => {
                  console.log("cancelDetails", details);
               }}
               onError={(details, data) => {
                  console.log("errorDetails", details);
               }}
               options={{
                  clientId: "AVCF0UOSH6zgP9LPDigY8ot6A9U2y-m-qr0A4s3d2tbCCPJHVURN30sie3mLSytsVX9845qowRL9golY" //client live key
                  //  clientId:"sb" //for test
               }}
            />
         </>
      );
   }

   render() {
      // console.log('getImage1',this.state.getImage1)
      return (

         <>
            <Helmet>
               <title>{TITLE}</title>
            </Helmet>
            <Header />

            {this.state.loaderImage === 0 ?
               <div className="row _post-container_" style={{ height: '200px' }}>
                  <div className="caroselHeight loaderBars">
                     <Loader type="Bars" color="#00BFFF" height={40} width={40} />
                  </div>
               </div> :

               <>

                  <div id="content-block">
                     <br /><br />

                     {this.state.isOpen && (
                        <LightboxSlider
                           mainSrc={this.state.mainSliderImages[this.state.photoIndex]}
                           nextSrc={this.state.mainSliderImages[(this.state.photoIndex + 1) % this.state.mainSliderImages.length]}
                           prevSrc={this.state.mainSliderImages[(this.state.photoIndex + this.state.mainSliderImages.length - 1) % this.state.mainSliderImages.length]}
                           onCloseRequest={() => this.setState({ isOpen: false })}
                           onMovePrevRequest={() =>
                              this.setState({
                                 photoIndex: (this.state.photoIndex + this.state.mainSliderImages.length - 1) % this.state.mainSliderImages.length,
                              })
                           }
                           onMoveNextRequest={() =>
                              this.setState({
                                 photoIndex: (this.state.photoIndex + 1) % this.state.mainSliderImages.length,
                              })
                           }
                        />
                     )}

                     {/* <button type="button"  >opne</button> */}
                     
                     <div className="container-fluid custom-container pl-0 pr-0"  style={{marginTop:this.state.getImage1.length == 0 ? '100px':'',marginBottom:this.state.getImage1.length == 0?'100px':''}}>
                        
                         {this.state.getImage1.length == 0 ?
                         <p className="text-center" style={{color:'#fff'}}>No Data</p>   :
      <> 
                        <div className="container-fluid custom-container upcomming-drops" id="upcomming-drops">
                           <div className="container pl-5 pr-5 ">
                              <div className="row">
                                 <div className="col-md-7 pad-spc-detail">
                                    {/* {alert(this.state.getImage1.length)} */}

                                    {this.state.getImage1.length === 1 ?
                                       // <Link to={`${config.baseUrl}ipfs/${this.state.getListItem?.image_original}`} target="_blank">
                                       <>
                                          {/* <div className="soldOut">
                              <img src="images/sold.png"/>
                           </div> */}
                                          <ModalImage
                                             small={`${config.imageUrl}${this.state.getListItem?.image}`}
                                             large={`${config.imageUrl}${this.state.getListItem?.image}`}
                                             className="img-responsive pr-5 pad-right itemShowData"
                                          />
                                          {/* <img src={`${config.imageUrl}${this.state.getListItem?.image}`} className="img-responsive pr-5 pad-right itemShowData"/>  */}
                                       </>
                                       // </Link>
                                       :
                                       this.state.getImage1.length > 1 ?
                                          <div className="head-bg">
                                             <div id="myCarousel" className="carousel slide realstateslider" data-ride="carousel">
                                                {/* <!-- Indicators --> */}
                                                <ol className="carousel-indicators">

                                                   {this.state.getImage1[0]?.image === undefined || this.state.getImage1[0]?.image === null || this.state.getImage1[0]?.image === '' ? '' :
                                                      <li data-target="#myCarousel" data-slide-to="0" className="active"></li>
                                                   }
                                                   {this.state.getImage1[1]?.image === undefined || this.state.getImage1[1]?.image === null || this.state.getImage1[1]?.image === '' ? '' :
                                                      <li data-target="#myCarousel" data-slide-to="1"></li>
                                                   }
                                                   {this.state.getImage1[2]?.image === undefined || this.state.getImage1[2]?.image === null || this.state.getImage1[2]?.image === '' ? '' :
                                                      <li data-target="#myCarousel" data-slide-to="2"></li>
                                                   }
                                                   {this.state.getImage1[3]?.image === undefined || this.state.getImage1[3]?.image === null || this.state.getImage1[3]?.image === '' ? '' :
                                                      <li data-target="#myCarousel" data-slide-to="3"></li>
                                                   }
                                                   {this.state.getImage1[4]?.image === undefined || this.state.getImage1[4]?.image === null || this.state.getImage1[4]?.image === '' ? '' :
                                                      <li data-target="#myCarousel" data-slide-to="4"></li>
                                                   }

                                                   {this.state.getImage1[5]?.image === undefined || this.state.getImage1[5]?.image === null || this.state.getImage1[5]?.image === '' ? '' :
                                                      <li data-target="#myCarousel" data-slide-to="5"></li>
                                                   }

                                                   {this.state.getImage1[6]?.image === undefined || this.state.getImage1[6]?.image === null || this.state.getImage1[6]?.image === '' ? '' :
                                                      <li data-target="#myCarousel" data-slide-to="6"></li>
                                                   }

                                                   {this.state.getImage1[7]?.image === undefined || this.state.getImage1[7]?.image === null || this.state.getImage1[7]?.image === '' ? '' :
                                                      <li data-target="#myCarousel" data-slide-to="7"></li>
                                                   }

                                                   {this.state.getImage1[8]?.image === undefined || this.state.getImage1[8]?.image === null || this.state.getImage1[8]?.image === '' ? '' :
                                                      <li data-target="#myCarousel" data-slide-to="8"></li>
                                                   }

                                                   {this.state.getImage1[9]?.image === undefined || this.state.getImage1[9]?.image === null || this.state.getImage1[9]?.image === '' ? '' :
                                                      <li data-target="#myCarousel" data-slide-to="9"></li>
                                                   }



                                                </ol>


                                                {/* <!-- Wrapper for slides --> */}
                                                <div className="carousel-inner">

                                                   <div className="item active" style={{ cursor: 'pointer' }} onClick={this.multiImageOnModal.bind(this)}>
                                                      {this.state.getImage1[0]?.image === undefined || this.state.getImage1[0]?.image === '' || this.state.getImage1[0]?.image === null ? '' :
                                                         this.state.getImage1[0]?.file_type === 'image' ?
                                                            // <Link  to={`${config.baseUrl}ipfs/${this.state.getImage1[0]?.image}`} target="_blank">
                                                            <img effect="blur" src={`${config.imageUrl}${this.state.getImage1[0]?.image}`} alt="Los Angeles" style={{ width: "100%", height: '450px' }} />
                                                            //  </Link> 
                                                            :
                                                            this.state.getImage1[0]?.file_type === 'video' ?
                                                               <Link to={`${config.baseUrl}ipfs/${this.state.getImage1[0]?.image}`} target="_blank">

                                                                  <Player className="preview_image_data" src={`${config.imageUrl}${this.state.getImage1[0]?.image}`} style={{ width: "100%", height: '450px' }} />
                                                               </Link> :

                                                               this.state.getImage1[0]?.file_type === 'audio' ?
                                                                  <Link to={`${config.baseUrl}ipfs/${this.state.getImage1[0]?.image}`} target="_blank">
                                                                     <ReactAudioPlayer
                                                                        src={`${config.imageUrl}${this.state.getImage1[0]?.image}`} style={{ width: '100%' }}

                                                                        controls
                                                                     />
                                                                  </Link> : ''

                                                      }
                                                   </div>

                                                   {this.state.getImage1[1]?.image === undefined || this.state.getImage1[1]?.image === '' || this.state.getImage1[1]?.image === null ? '' :
                                                      <div className="item" style={{ cursor: 'pointer' }} onClick={this.multiImageOnModal.bind(this)}>
                                                         {/* <img effect="blur"  src="images/imgpsh_fullsize_anim.jpg" alt="Los Angeles" style={{width:"100%",height: '450px'}}/> */}

                                                         {/* <Link  to={`${config.baseUrl}ipfs/${this.state.getImage1[1]?.image}`} target="_blank"> */}

                                                         <img effect="blur" src={`${config.imageUrl}${this.state.getImage1[1]?.image}`} alt="Los Angeles" style={{ width: "100%", height: '450px' }} />

                                                         {/* </Link> */}
                                                      </div>

                                                   }

                                                   {this.state.getImage1[2]?.image === undefined || this.state.getImage1[2]?.image === '' || this.state.getImage1[2]?.image === null ? '' :
                                                      <div className="item" style={{ cursor: 'pointer' }} onClick={this.multiImageOnModal.bind(this)}>
                                                         {/* <img effect="blur"  src="images/imgpsh_fullsize_anim.jpg" alt="Los Angeles" style={{width:"100%",height: '450px'}}/> */}
                                                         {/* <Link  to={`${config.baseUrl}ipfs/${this.state.getImage1[2]?.image}`} target="_blank"> */}

                                                         <img effect="blur" src={`${config.imageUrl}${this.state.getImage1[2]?.image}`} alt="Los Angeles" style={{ width: "100%", height: '450px' }} />
                                                         {/* </Link> */}
                                                      </div>

                                                   }

                                                   {this.state.getImage1[3]?.image === undefined || this.state.getImage1[3]?.image === '' || this.state.getImage1[3]?.image === null ? '' :
                                                      <div className="item" style={{ cursor: 'pointer' }} onClick={this.multiImageOnModal.bind(this)}>
                                                         {/* <img effect="blur"  src="images/imgpsh_fullsize_anim.jpg" alt="Los Angeles" style={{width:"100%",height: '450px'}}/> */}
                                                         {/* <Link  to={`${config.baseUrl}ipfs/${this.state.getImage1[3]?.image}`} target="_blank"> */}

                                                         <img effect="blur" src={`${config.imageUrl}${this.state.getImage1[3]?.image}`} alt="Los Angeles" style={{ width: "100%", height: '450px' }} />
                                                         {/* </Link> */}
                                                      </div>

                                                   }

                                                   {this.state.getImage1[4]?.image === undefined || this.state.getImage1[4]?.image === '' || this.state.getImage1[4]?.image === null ? '' :
                                                      <div className="item" style={{ cursor: 'pointer' }} onClick={this.multiImageOnModal.bind(this)}>
                                                         {/* <Link  to={`${config.baseUrl}ipfs/${this.state.getImage1[4]?.image}`} target="_blank"> */}

                                                         <img effect="blur" src={`${config.imageUrl}${this.state.getImage1[4]?.image}`} alt="Los Angeles" style={{ width: "100%", height: '450px' }} />
                                                         {/* </Link> */}
                                                      </div>

                                                   }


                                                   {this.state.getImage1[5]?.image === undefined || this.state.getImage1[5]?.image === '' || this.state.getImage1[5]?.image === null ? '' :
                                                      <div className="item" style={{ cursor: 'pointer' }} onClick={this.multiImageOnModal.bind(this)}>
                                                         {/* <Link  to={`${config.baseUrl}ipfs/${this.state.getImage1[5]?.image}`} target="_blank"> */}

                                                         <img effect="blur" src={`${config.imageUrl}${this.state.getImage1[5]?.image}`} alt="Los Angeles" style={{ width: "100%", height: '450px' }} />
                                                         {/* </Link> */}
                                                      </div>

                                                   }

                                                   {this.state.getImage1[6]?.image === undefined || this.state.getImage1[6]?.image === '' || this.state.getImage1[6]?.image === null ? '' :
                                                      <div className="item" style={{ cursor: 'pointer' }} onClick={this.multiImageOnModal.bind(this)}>
                                                         {/* <Link  to={`${config.baseUrl}ipfs/${this.state.getImage1[6]?.image}`} target="_blank"> */}

                                                         <img effect="blur" src={`${config.imageUrl}${this.state.getImage1[6]?.image}`} alt="Los Angeles" style={{ width: "100%", height: '450px' }} />
                                                         {/* </Link> */}
                                                      </div>

                                                   }

                                                   {this.state.getImage1[7]?.image === undefined || this.state.getImage1[7]?.image === '' || this.state.getImage1[7]?.image === null ? '' :
                                                      <div className="item" style={{ cursor: 'pointer' }} onClick={this.multiImageOnModal.bind(this)}>
                                                         {/* <Link  to={`${config.baseUrl}ipfs/${this.state.getImage1[7]?.image}`} target="_blank"> */}

                                                         <img effect="blur" src={`${config.imageUrl}${this.state.getImage1[7]?.image}`} alt="Los Angeles" style={{ width: "100%", height: '450px' }} />
                                                         {/* </Link> */}
                                                      </div>

                                                   }

                                                   {this.state.getImage1[8]?.image === undefined || this.state.getImage1[8]?.image === '' || this.state.getImage1[8]?.image === null ? '' :
                                                      <div className="item" style={{ cursor: 'pointer' }} onClick={this.multiImageOnModal.bind(this)}>
                                                         {/* <Link  to={`${config.baseUrl}ipfs/${this.state.getImage1[8]?.image}`} target="_blank"> */}

                                                         <img effect="blur" src={`${config.imageUrl}${this.state.getImage1[8]?.image}`} alt="Los Angeles" style={{ width: "100%", height: '450px' }} />
                                                         {/* </Link> */}
                                                      </div>

                                                   }

                                                   {this.state.getImage1[9]?.image === undefined || this.state.getImage1[9]?.image === '' || this.state.getImage1[9]?.image === null ? '' :
                                                      <div className="item" style={{ cursor: 'pointer' }} onClick={this.multiImageOnModal.bind(this)}>
                                                         {/* <Link  to={`${config.baseUrl}ipfs/${this.state.getImage1[9]?.image}`} target="_blank"> */}

                                                         <img effect="blur" src={`${config.imageUrl}${this.state.getImage1[9]?.image}`} alt="Los Angeles" style={{ width: "100%", height: '450px' }} />
                                                         {/* </Link> */}
                                                      </div>

                                                   }





                                                </div>

                                                {/* <!-- Left and right controls --> */}
                                                <a className="left carousel-control" href="#myCarousel" data-slide="prev">
                                                   <span className="fa fa-chevron-left"></span>
                                                   <span className="sr-only">Previous</span>
                                                </a>
                                                <a className="right carousel-control" href="#myCarousel" data-slide="next">
                                                   <span className="fa fa-chevron-right"></span>
                                                   <span className="sr-only">Next</span>
                                                </a>
                                             </div>

                                          </div>
                                          : ''
                                    }




                                    {/* {this.state.getListItem?.file_type === 'audio' ? 
                                             <img src="https://ipfs.io/ipfs/QmcwrJKCnvNuxKP22TpYptN3hM76jmwL6kt4BbieBgCCba" style={{width:'100%',height:'341px',objectFit: 'fill'}} alt="omg"/>:''
                                       }
                                       
                                                {this.state.getListItem?.file_type === 'image'  ? 
                                               <img src={`${config.imageUrl}${this.state.getListItem?.image}`} style={{width:'100%',height:'341px',objectFit: 'fill'}} className="img-responsive pr-5 pad-right"/>:
                                                this.state.getListItem?.file_type === 'video' ? 
                                                <Player className="preview_image_data" src={`${config.imageUrl}${this.state.getListItem?.image}`} style={{width:'100%',height:'341px',objectFit: 'fill'}}/> :
                                                this.state.getListItem?.file_type === 'audio' ? 
                                                <ReactAudioPlayer
                                                   src={`${config.imageUrl}${this.state.getListItem?.image}`} style={{width:'100%'}}
                                                    
                                                   controls
                                                   /> :''
                                             } */}


                                 </div>
                                 <div className="col-md-5 pad-left">
                                    <div className="row">
                                       <div className="col-12">
                                          <h3 id="digital_media_title">{this.state.getListItem?.name}</h3>
                                       </div>
                                    </div>
                                    <div className="row purchase-wrapper">
                                       <div className="col-12 mt-md-2 mt-3 mb-3">
                                          {this.loginData.length === 0 ?
                                             <button type="submit" className="offer-button text-white btn color-1 size-2 col-sm-12" onClick={this.loginScreen.bind(this)}
                                             >
                                                {this.state.getListItem?.sell_type_name === 'Price' ?
                                                   "Purchase" : "Place Bid"
                                                }

                                             </button>

                                             :
                                             //  (this.state.ConnectWalletAddress)?
                                             <>
                                                {/* <a  style={{ textTransform: 'inherit',border:'2px solid #3358c8',borderRadius:'15px',background:'unset' }} className="offer-button text-white btn color-1 size-2 col-sm-12" target="_blank"  href={`https://etherscan.io/address/${this.state.ConnectWalletAddress}`}>{this.state.ConnectWalletAddress.toString().substring(0,8)+'...'+this.state.ConnectWalletAddress.toString().substr(this.state.ConnectWalletAddress.length-8)}</a> */}
                                                <button type="submit"
                                                   disabled={this.state.getListItem?.nft_type === 'Upcoming' || this.state.getListItem?.is_sold == 1 || this.state.getListItem?.user_id == this.loginData?.data?.id} className="offer-button text-white btn color-1 size-2 col-sm-12" data-toggle="modal" data-target="#myModal" >
                                                   {this.state.getListItem?.sell_type_name === 'Auction' ? "Place Bid" : "Purchase"}
                                                </button>
                                             </>
                                             // :
                                             //    <a onClick={this.connectMetasmask.bind(this)} className="offer-button text-white btn color-1 size-2 col-sm-12"  href="javascript:void(0)" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                             //       {this.state.getListItem?.sell_type_name === 'Auction' ? 
                                             //    "Place Bid":"Purchase"
                                             // }</a>


                                          }



                                          {/* <button type="submit" 
                              disabled={this.state.getListItem?.nft_type === 'Upcoming' || this.state.getListItem?.is_sold === 1 || this.state.getListItem?.user_id == this.loginData?.data?.id} className="offer-button text-white btn color-1 size-2 col-sm-12" data-toggle="modal" data-target="#myModal" >
                              {this.state.getListItem?.sell_type_name === 'Price' ? 
                           "Purchase":"Place Bid"
                        }
                                 
                                 </button> */}

                                       </div>
                                       <br />
                                       <a href="javascript:void(0)" className="mt-5" onClick={this.scollREcent.bind(this)}>
                                          {this.state.getListItem?.sell_type_name === 'Price' ?
                                             "View market activity" : "View Recent Offer"
                                          }


                                       </a>
                                    </div>
                                    <div className="row mt-4">
                                       <div className="col-12">
                                          <h5 className=" strong mb-3 text-white">Details:</h5>
                                       </div>
                                       <div className="col-12 mt-3">
                                          <ul className="details text-white">
                                             {this.state.getListItem?.description}
                                          </ul>

                                       </div>
                                    </div>
                                    <div className="row stats my-md-4 my-3" style={{ height: "24px" }}>
                                       <div className="col-sm-12">
                                          <div className="info-block" style={{ backgroundColor: 'transparent', padding: "4px 15px" }}>
                                             <span onClick={this.likeAPI.bind(this)}>

                                                <i className="fa fa-heart" style={{ color: this.state.likeCount?.is_liked === 0 ? '' : 'blue' }}></i> {this.state.likeCount?.count}</span>
                                             <span><i className="fa fa-eye"></i> {this.state.getListItem?.view_count}</span>
                                             <span data-toggle="modal" data-target="#productShareSheet"><i className="fa fa-share-alt"></i> Share</span>
                                             {/* <span><i className="fa fa-share-alt"></i> Share</span> */}
                                          </div>

                                       </div>
                                    </div>
                                    <div className="col-12 mt-3">
                                       <div className="row mt-1 " style={{ backgroundColor: '#161616', marginLeft: '0', marginBottom: '50px', position: 'relative' }}>
                                          <div className="col-lg-11 col-10 px-4 py-3">

                                             <div className="row">
                                                <div className="col-sm-12">
                                                   <span className="h6" style={{ color: '#fff' }}>Creator:</span>
                                                   <span className="ml-1 h7">

                                                      <strong>
                                                         <Link to={`${config.baseUrl}featurescreator/${this.state.getListItem?.user_id}`} target="_blank" className="collab-storename secondary_text">{this.state.getListItem?.creator}</Link>

                                                      </strong>
                                                   </span>
                                                </div>

                                                <div className="col-sm-12" style={{ paddingTop: "1em" }}>
                                                   <span className="h6" style={{ color: '#fff' }}>Owner:</span>
                                                   <span className="ml-1 h7">

                                                      <strong>
                                                         <Link to={`${config.baseUrl}featurescreator/${this.state.getListItem?.user_id}`} target="_blank" className="collab-storename secondary_text">{this.state.getListItem?.owner}</Link>

                                                      </strong>
                                                   </span>
                                                </div>

                                                <div className="col-sm-12" style={{ paddingTop: "1em" }}>
                                                   <span className="h6" style={{ color: '#fff' }}>Price:</span>
                                                   <span className="ml-1 h7">
                                                      <span id="authenticity_url" href="#" className="secondary_text">
                                                         <strong id="edition_count">${this.state.getListItem?.price}</strong>
                                                      </span>
                                                   </span>
                                                </div>

                                                <div className="col-sm-12" style={{ paddingTop: "1em" }}>
                                                   <span className="h6" style={{ color: '#fff' }}>Edition:</span>
                                                   <span className="ml-1 h7">
                                                      <span id="authenticity_url" href="#" className="secondary_text">
                                                         <strong id="edition_count">{this.state.getListItem?.edition_text}</strong>
                                                      </span>
                                                   </span>
                                                </div>

                                                <div className="col-sm-12" style={{ paddingTop: "1em" }}>
                                                   <span className="h6" style={{ color: '#fff' }}>Expire:</span>
                                                   <span className="ml-1 h7">
                                                      <span id="authenticity_url" href="#" className="secondary_text">
                                                         <strong id="edition_count">
                                                            {/* {alert(this.state.getListItem?.expiry_date1)} */}
                                                            {this.state.getListItem?.expiry_date1 !== undefined ?
                                                               <div className="timer3">
                                                                  <Countdown
                                                                     date={this.getTimeOfStartDate(this.state.getListItem?.expiry_date1)}
                                                                     renderer={this.CountdownTimer}
                                                                  />
                                                               </div> : ''
                                                            }

                                                            {/* {this.state.getListItem?.expiry_date1} */}
                                                         </strong>
                                                      </span>
                                                   </span>
                                                </div>



                                                <div className="col-sm-12 col-xs-12" style={{ paddingTop: "1em" }}>
                                                   {this.state.getListItem?.token_hash === null || this.state.getListItem?.token_hash === undefined || this.state.getListItem?.token_hash === '' ? ''
                                                      :
                                                      <a href={this.state.getListItem?.token_hash} target="_blank" className="primary">
                                                         <span className="float-left">Blockchain View</span> <div className="icon right-arrow float-left" style={{ margin: "6px 7px" }}></div>
                                                      </a>
                                                   }

                                                </div>

                                                <div className="col-sm-12 col-xs-12" style={{ paddingTop: "3px" }}>
                                                   {this.state.getListItem?.image_original === null || this.state.getListItem?.image_original === undefined || this.state.getListItem?.image_original === '' ? ''
                                                      :
                                                      <a href={`${config.imageUrl}${this.state.getListItem?.image_original}`} target="_blank" className="primary">
                                                         <span className="float-left">View on IPFS</span> <div className="icon right-arrow float-left" style={{ margin: "6px 7px" }}></div>
                                                      </a>
                                                   }

                                                </div>

                                                <div className="col-sm-12 col-xs-12" style={{ paddingTop: "3px" }}>
                                                   {this.state.getListItem?.metadata === null || this.state.getListItem?.metadata === undefined || this.state.getListItem?.metadata === '' ? ''
                                                      :
                                                      <a href={`${config.imageUrl}${this.state.getListItem?.metadata}`} target="_blank" className="primary">
                                                         <span className="float-left">View IPFS Metadata</span> <div className="icon right-arrow float-left" style={{ margin: "6px 7px" }}></div>
                                                      </a>
                                                   }

                                                </div>

                                             </div>
                                          </div>
                                          {/* <div className="col-2 col-lg-1">
                                      <a href="#" className="learn-more-tooltip" data-toggle="tooltip" data-placement="top" title="" data-original-title="This is a signed and limited edition digital creation by David McLeod.">
                                          
                                              <img className="poa_icon" height="50" width="50" src="https://makersplace.com/static/img/products/authenticity.png"/>
                                          
                                      </a>
                                  </div> */}
                                          <img style={{ width: '44px', height: '47px', position: 'absolute', filter: 'invert(1)', right: '0', bottom: '-47px' }} src="https://makersplace.com/static/img/products/ribbon-corner.png" />

                                       </div>

                                    </div>


                                 </div>
                              </div>
                           </div>
                        </div>





                        <br />
                        <br />
                        <div className="container-fluid custom-container ">
                           <div className="container hot-bid table-cart-detail market_recent_activity" id="market_activity">
                              <div className="row">
                                 <div className="col-md-12">
                                    <h3>Market Activity</h3>
                                 </div>
                                 <div className="col-md-6 text-right">
                                 </div>
                                 <div className="col-md-12 text-white mt-5">
                                    <div className="itemTable">

                                       <ReactDatatable
                                          config={this.config}
                                          records={this.state.getBidDetailData}
                                          columns={this.columns} />


                                    </div>
                                 </div>
                              </div>
                           </div>
                        </div>
                        <br />
                        <div className="container-fluid custom-container ">
                           <div className="container hot-bid">
                              <div className="row">
                                 <div className="col-md-12">
                                    <h3>Related Products</h3>
                                    <hr />
                                 </div>
                                 <div className="col-md-6 text-right">
                                 </div>
                                 <div className="col-md-12">
                                    <br />
                                    <div className="row _post-container_">
                                       {this.state.getRelatedItem.map(item => (

                                          <div className="category-2 mix col-md-4">
                                             <div className="be-post">
                                                <Link target="_blank" to={item.file_type === 'video' ? '#/' : `${config.baseUrl}itemdetails/${item.item_edition_id}`} className="be-img-block">
                                                   {item.file_type === 'audio' ?
                                                      <img effect="blur" src="https://ipfs.io/ipfs/QmcwrJKCnvNuxKP22TpYptN3hM76jmwL6kt4BbieBgCCba" alt="omg" /> : ''
                                                   }

                                                   {item.file_type === 'image' ?
                                                      <img effect="blur" src={`${config.imageUrl}${item.image}`} alt="omg" /> :
                                                      item.file_type === 'video' ?
                                                         <Player className="preview_image_data" src={`${config.imageUrl}${item.image}`} /> :
                                                         item.file_type === 'audio' ?
                                                            <ReactAudioPlayer
                                                               src={`${config.imageUrl}${item.image}`}

                                                               controls
                                                            /> : ''
                                                   }

                                                   {item.is_sold === 1 || item.expiry_date === '0000-00-00 00:00:00' || item.expiry_date === '0000-00-00' ?
                                                      '' :
                                                      <div className="timer2">

                                                         <Countdown
                                                            date={this.getTimeOfStartDate(item.expiry_date)}
                                                            renderer={this.CountdownTimer}
                                                         />
                                                      </div>}
                                                </Link>

                                                <Link target="_blank" to={`${config.baseUrl}itemdetails/${item.item_edition_id}`} target="_blank" className="be-post-title">{item.name}</Link>
                                                <Link target="_blank" to={`${config.baseUrl}itemdetails/${item.item_edition_id}`} className="be-post-title price price-data">${item.price}</Link>

                                                <span>
                                                </span>
                                                <div className="author-post">
                                                </div>
                                             </div>
                                          </div>
                                       ))}
                                    </div>
                                 </div>
                              </div>
                           </div>
                        </div>


                        </>
      
      
      
      }




                     </div>
                     <br />
                  </div>
                  <Footer />

                  <div id="myModal" className="modal fade cart-modal" role="dialog" style={{ background: 'rgb(6, 6, 6)' }}
                     data-backdrop="false">
                     <div className="modal-dialog modal-lg">
                        <div className="modal-content">
                           <div className="modal-header" style={{ borderBottom: "1px solid transparent" }}>
                              <button type="button" className="close" data-dismiss="modal">&times;</button>
                           </div>
                           <div className="modal-body">
                              <div className="row">
                                 <div className="col-md-6  " style={{ borderRight: "1px solid #E0E0E0" }}>
                                    <div className="row p-3">
                                       <div className="col-sm-12 mb-2 pl-0">
                                          <h4 className="strong">{this.state.getListItem?.name}</h4>
                                       </div>
                                       <div className="col-md-6 mb-2 pl-0">
                                          <span className="h8 weak">
                                             <span className="collab-storename">{this.state.getListItem?.owner}</span>
                                          </span>
                                       </div>
                                       <div className="col-md-6 text-right mb-2">
                                          <span className="h weak">Edition: {this.state.getListItem?.edition_text}</span>
                                       </div>
                                       <div className="col-12">
                                          <div className="text-center mt-3">
                                             {this.state.getListItem?.file_type === 'audio' ?
                                                <img src="https://ipfs.io/ipfs/QmcwrJKCnvNuxKP22TpYptN3hM76jmwL6kt4BbieBgCCba" style={{ width: '100%', height: '341px', objectFit: 'fill' }} alt="omg" /> : ''
                                             }

                                             {this.state.getListItem?.file_type === 'image' ?
                                                <img src={`${config.imageUrl}${this.state.getListItem?.image}`} style={{ width: '100%', height: '341px', objectFit: 'fill' }} className="img-responsive pr-5 pad-right" /> :
                                                this.state.getListItem?.file_type === 'video' ?
                                                   <Player className="preview_image_data" src={`${config.imageUrl}${this.state.getListItem?.image}`} style={{ width: '100%', height: '341px', objectFit: 'fill' }} /> :
                                                   this.state.getListItem?.file_type === 'audio' ?
                                                      <ReactAudioPlayer
                                                         src={`${config.imageUrl}${this.state.getListItem?.image}`} style={{ width: '100%' }}

                                                         controls
                                                      /> : ''
                                             }
                                             {/* <img src={`${config.imageUrl}${this.state.getListItem?.image}`} style={{width: "100%"}}/> */}
                                          </div>
                                       </div>
                                    </div>
                                 </div>
                                 <div className="col-sm-6">
                                    <div className="row p-4">
                                       <div className="heading-wrapper d-md-block mb-4">
                                          <h4 className="strong payment-method-options">Offer Method</h4>
                                       </div>
                                       <div className="tab-wrapper style-1">
                                          <div className="tab-nav-wrapper">
                                             <div className="nav-tab  clearfix">
                                                <div className={this.state.etherClickActive == 0 ? "nav-tab-item active" : "nav-tab-item"} onClick={this.etherClick.bind(this, 'cc')}>
                                                   <span>Credit Card</span>
                                                </div>
                                                <div className={this.state.etherClickActive == 1 ? "nav-tab-item active" : "nav-tab-item"} onClick={this.etherClick.bind(this, 'Ether')}>
                                                   <span className="text-black">Crypto</span>
                                                </div>
                                             </div>
                                          </div>
                                          <div className="tabs-content clearfix">
                                             <div className={this.state.etherClickActive == 0 ? "tab-info" : "tab-info active"} style={{ display: this.state.etherClickActive == 0 ? 'block' : 'none' }}>
                                                <div className="row">
                                                   <div className="col-ml-12 col-xs-12 col-sm-12">
                                                      <div className="col-12 mt-3">
                                                         {this.state.getListItem?.sell_type_name === 'Price' ?
                                                            <strong>Price : {this.state.getUsdBalance?.price_eth} ETH ~ ${this.state.getListItem?.price} <br />
                                                               Gas fee : {this.state.getUsdBalance?.txn_fee_eth} ETH ~ ${this.state.getUsdBalance?.txn_fee_usd} <br />
                                                               Total payable : {parseFloat(parseFloat(this.state.getUsdBalance?.price_eth) + parseFloat(this.state.getUsdBalance?.txn_fee_eth)).toFixed(6)} ETH ~ ${parseFloat(parseFloat(this.state.getListItem?.price) + parseFloat(this.state.getUsdBalance?.txn_fee_usd)).toFixed(2)}</strong> :
                                                            <strong>Your offer must be at least: ${this.state.getListItem?.max_bid}</strong>
                                                         }
                                                      </div>
                                                      <div className="col-12 mt-3">
                                                         <div className="input-group">
                                                            {this.state.getListItem?.sell_type_name === 'Price'
                                                               ?
                                                               ""
                                                               :
                                                               <>
                                                                  <div className="input-group-prepend" style={{ backgroundColor: "#fff" }}>
                                                                     <span className="input-group-text">$</span>
                                                                  </div>

                                                                  <input type="text" onKeyPress={(event) => {
                                                                     if (!/^[0-9\b]+$/.test(event.key)) {
                                                                        event.preventDefault();
                                                                     }
                                                                  }} step="any" className="form-control currency  ccbid-price"
                                                                     placeholder="Offer amount" id="bidAmountCC" name="bid_price" value={this.state.bid_price} onChange={this.onChange} required="" onKeyDown={this.formatInput} />
                                                               </>
                                                            }

                                                         </div>
                                                      </div>
                                                      <div className="col-12 mt-3">
                                                         <div className="input-group">
                                                            <input type="text" step="any" className="form-control " placeholder="Name" name="bid_amount" required="" />
                                                         </div>
                                                      </div>

                                                      {/* <Elements stripe={stripeTestPromise}>
                                    <CheckoutForm user_address={this.state.ConnectWalletAddress} amount={this.state.getListItem?.sell_type_name === 'Price' ? (parseFloat(this.state.getListItem?.price) + parseFloat(this.state.getUsdBalance?.txn_fee_usd)): this.state.bid_price}
                                    itemData={[this.id,this.loginData?.data?.id,this.state.getListItem?.sell_type_name,this.state.getListItem?.max_bid,this.state.getListItem?.item_id,this.loginData?.Token,this.loginData.data?.user_email]}
                                    />
                                    </Elements> */}

                                                      <span style={{ color: 'red', fontFamily: 'cursive', textAlign: 'center' }}>{this.state.paypalError}</span>
                                                      {this.PayPalFunction.bind(this)}
                                                   </div>
                                                </div>
                                             </div>
                                             <div class={this.state.etherClickActive == 1 ? "tab-info" : "tab-info active"} style={{ display: this.state.etherClickActive == 1 ? 'block' : 'none' }}>
                                                <div className="col-12 mt-3">
                                                   {this.state.getListItem?.sell_type_name === 'Price' ?
                                                      <strong>Price : {this.state.getUsdBalance?.price_eth} ETH ~ ${this.state.getListItem?.price} <br />
                                                         Gas fee : {this.state.getUsdBalance?.txn_fee_eth} ETH ~ ${this.state.getUsdBalance?.txn_fee_usd} <br />
                                                         Total payable : {parseFloat(parseFloat(this.state.getUsdBalance?.price_eth) + parseFloat(this.state.getUsdBalance?.txn_fee_eth)).toFixed(6)} ETH ~ ${parseFloat(parseFloat(this.state.getListItem?.price) + parseFloat(this.state.getUsdBalance?.txn_fee_usd)).toFixed(2)}</strong> :
                                                      <strong>Your offer must be at least: ${this.state.getListItem?.max_bid}</strong>}
                                                </div>
                                                <div className="col-12 mt-3">
                                                   <div className="input-group">
                                                      {this.state.getListItem?.sell_type_name === 'Price' ?
                                                         '' :
                                                         <>
                                                            <div className="input-group-prepend" style={{ backgroundColor: "#fff" }}>
                                                               <span className="input-group-text">$</span>
                                                            </div>
                                                            <input type="number" step="any" className="form-control currency  ccbid-price"
                                                               placeholder="Offer amount" onKeyPress={(event) => {
                                                                  if (!/^[0-9\b]+$/.test(event.key)) {
                                                                     event.preventDefault();
                                                                  }
                                                               }} id="bidAmountCC" name="bid_price" value={this.state.bid_price} onChange={this.onChange} required="" onKeyDown={this.formatInput} />
                                                         </>
                                                      }
                                                   </div>
                                                </div>
                                                <div className="col-12 nopadding">
                                                   <div className="mt-2">
                                                      You need to deposit selected Cryptocurrency to complete your purchase.</div>
                                                </div>
                                                <div className="mt-4">
                                                   <div className="col-12 nopadding">
                                                      <span style={{ color: 'red', fontFamily: 'cursive', textAlign: 'center' }}>{this.state.ErrorMessage}</span>

                                                      <div className="my-3 text-center">
                                                         {(this.state.cryptoPayBtnDesable) ?
                                                            <button className="btn btn-primary size-1 " title="Place Bid"
                                                               mptrackaction="nux:giveapproval" disabled>Processing...</button>
                                                            :
                                                            this.state.getListItem?.sell_type_name === 'Price' ?
                                                               <button className="btn btn-primary size-1 " title="Place Bid"
                                                                  mptrackaction="nux:giveapproval"
                                                                  onClick={this.approvalAPI}>Pay</button> :
                                                               <button className="btn btn-primary size-1 " title="Place Bid"
                                                                  mptrackaction="nux:giveapproval" disabled={!this.state.bid_price}
                                                                  onClick={this.approvalAPI}>Place Bid</button>
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


                  <div className="modal fade" id="productShareSheet" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true" data-backdrop="false">
                     <div className="modal-dialog" role="document">
                        <div className="modal-content">
                           <div className="modal-header">
                              <h5 className="modal-title" id="exampleModalLabel">Share this Creation</h5>
                              <button type="button" className="close" data-dismiss="modal" style={{
                                 marginTop: '-23px',
                                 fontSize: '26px'
                              }} aria-label="Close">
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
                                                url={window.location.href}
                                                // url={`${config.imageUrl}${this.state.getListItem?.image}`}
                                                quote={this.state.getListItem?.name + '-' + "\n" + this.state.getListItem?.description}

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
                                                //  url={`${config.imageUrl}${this.state.getListItem?.image}`}
                                                title={this.state.getListItem?.name + '-' + "\n" + this.state.getListItem?.description}
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

                                                subject={"Check out this Rare Digital Art Work from Infinity 8" + "\n" + this.state.getListItem?.name + '-' + "\n" + this.state.getListItem?.description}
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
                                       title={this.state.getListItem?.name + '-' + "\n" + "Check out this Rare Digital Art Work from Infinity 8" + "\n" + this.state.getListItem?.description + "\n"}
                                       className="Demo__some-network__share-button">
                                       <WhatsappIcon
                                          size={32}
                                          round />
                                    </WhatsappShareButton>
                                    <br />
                                    <span className="mt-1 d-block">WhatsApp</span>
                                 </div>
                                 <div className="d-inline-block col-sm-3 col-xs-6 text-center mb-3 pb-1" style={{ margin: '-13px' }}>

                                    <br />
                                    <CopyToClipboard text={window.location.href}
                                       onCopy={() => this.setState({ copied: true })}>
                                       <img src="images/copy-link.png" style={{ cursor: 'pointer' }} className="link-copy" />
                                       {/* <span>Copy to clipboard with span</span> */}
                                    </CopyToClipboard>
                                    {this.state.copied ? <span className="mt-1 d-block">Copied!</span> : <span className="mt-1 d-block">Copy link</span>}

                                    {/* <span className="mt-1 d-block">Copy link</span> */}
                                 </div>
                                 <div className="col-sm-3"></div>


                              </div>


                           </div>

                        </div>
                     </div>
                  </div>


               </>




            }



         </>


      )
   }
}
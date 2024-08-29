import React, { Component } from 'react';
import axios from 'axios';
import Header from '../directives/header'
import Footer from '../directives/footer'
import config from '../config/config'
import { Link } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';
import Cookies from 'js-cookie'
import { Player } from 'video-react';
import ReactAudioPlayer from 'react-audio-player';
import 'react-lazy-load-image-component/src/effects/blur.css';
import Countdown, { zeroPad } from 'react-countdown';
import Loader from "react-loader-spinner";

const headers = {
   'Content-Type': 'application/json'
};

export default class createyourownnftslist extends Component {

   constructor(props) {
      super(props)
      this.loginData = (!Cookies.get('loginSuccess')) ? [] : JSON.parse(Cookies.get('loginSuccess'))
      this.state = {
         getitemData: [],
         getTelentUserData: [],
         getitemDataArt: [],
         getitemDataMusic: [],
         getitemDataSport: [],
         getitemDataMusic1: false,
         getitemDataSport1: false
      }
   }

   componentDidMount() {
      this.getitemAPI()
      this.getTelentUserAPI()
      this.getitemAPIArt()
      this.getitemAPIMusic()
      this.getitemAPISport()


   }

   //=======================================  New Talent  =====================

   async getTelentUserAPI() {
      await axios({
         method: 'post',
         url: `${config.apiUrl}getUserTelent`,
         data: { limit: '4', is_feature: '0' }
      })
         .then(result => {
            if (result.data.success === true) {
               this.setState({
                  getTelentUserData: result.data.response
               })
            }
            else if (result.data.success === false) {
            }
         }).catch(err => {
         });
   }
   //=======================================  getitem  =====================

   async getitemAPI() {
      await axios({
         method: 'post',
         url: `${config.apiUrl}listitem`,
         data: { "limit": "6", "category_id": "-1" }
      })
         .then(result => {
            if (result.data.success === true) {
               this.setState({
                  getitemData: result.data.response,
               })
            }
            else if (result.data.success === false) {
            }
         }).catch(err => {
         });
   }


   //=======================================  getitemart  =====================

   async getitemAPIArt() {
      await axios({
         method: 'post',
         url: `${config.apiUrl}listitem`,
         data: { "limit": "6", "category_id": "1" }
      })
         .then(result => {
            if (result.data.success === true) {
               this.setState({
                  getitemDataArt: result.data.response,
               })
            }
            else if (result.data.success === false) {
            }
         }).catch(err => {
         });
   }

   //=======================================  getitemmusic  =====================

   async getitemAPIMusic() {
      await axios({
         method: 'post',
         url: `${config.apiUrl}listitem`,
         data: { "limit": "6", "category_id": "2" }
      })
         .then(result => {
            if (result.data.success === true) {
               this.setState({
                  getitemDataMusic: result.data.response,
               })
            }
            else if (result.data.success === false) {
            }
         }).catch(err => {
            this.setState({
               getitemDataMusic1: true,
               getitemDataMusic: [1]
            })
         });
   }

   //=======================================  getitemsport  =====================

   async getitemAPISport() {
      await axios({
         method: 'post',
         url: `${config.apiUrl}listitem`,
         data: { "limit": "6", "category_id": "3" }
      })
         .then(result => {
            if (result.data.success === true) {
               this.setState({
                  getitemDataSport: result.data.response,
               })
            }
            else if (result.data.success === false) {
            }
         }).catch(err => {
            this.setState({
               getitemDataSport1: true,
               getitemDataSport: [1]
            })
         });
   }

   //  is_approved :0 => Pending
   //  is_approved :1 => Approval
   //  is_approved :2 => Reject
   //  is_approved :3 => not applied
   async talentStatusAPI() {
      await axios({
         method: 'post',
         url: `${config.apiUrl}getTelentStatus`,
         data: { 'user_id': this.loginData.data.id }
      })
         .then(result => {
            if (result.data.success === true) {
               if (result.data.response[0].telent_status === 2 || result.data.response[0].telent_status === 3 || result.data.response[0].telent_status === 0) {
                  window.location.href = `${config.baseUrl}createyourownnfts`
               }
               else if (result.data.response[0].telent_status === 1) {
                  window.location.href = `${config.baseUrl}featurescreator/${this.loginData.data.id}`
               }
               // else if(result.data.response[0].telent_status === 0){
               //   toast.error('Your Account is in process to get verify from admin side, Please wait to "Create NFT".', {
               //      position: toast.POSITION.TOP_CENTER
               //    });
               // }
            }
            else if (result.data.success === false) {
            }
         }).catch(err => {
         });
   }

   loginCheck() {
      if (this.loginData.length === 0) {
         window.location.href = `${config.baseUrl}login`
      }
      else {
         this.talentStatusAPI()

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



   loading() {
      setTimeout(() => {
         window.location.reload()
      }, 500);
   }

   render() {
      return (

         <>
            <Header />
            <div id="content-block">
               <br /><br />

               <div className="container-fluid custom-container">
                  <ToastContainer />
                  <div className="container-fluid custom-container upcomming-drops pr-0 pl-0" id="upcomming-drops">
                     <div className="container">
                        <div className="row">
                           <div className="col-xs-12 col-md-12">
                              <div className="row">
                                 <div className="col-sm-9">

                                 </div>
                                 <div className="col-sm-3">
                                    <div className="be-vidget back-block mb-4 btn-right">
                                       <a className="btn full btn-primary size-1 hover-2" onClick={this.loginCheck.bind(this)} >Create Your Own NFTs</a>
                                    </div>
                                 </div>

                              </div>
                           </div>

                           <br /><br /><br />

                           <div className="container-fluid custom-container">
                              <div className="container">
                                 <div className="row">
                                    <div className="col-md-6">
                                       <h3><strong>Creators</strong></h3>
                                    </div>
                                    <div className="col-md-6 text-right">
                                       <div><Link to={`${config.baseUrl}userallcreator`} style={{ color: "#fff" }}>
                                          View all &nbsp;<i style={{ fontSize: "17px" }} className="fa fa-angle-right"></i></Link></div>
                                    </div>
                                    <div className="col-md-12">
                                       <br />
                                       <div className="row ">
                                          {this.state.getTelentUserData.map(item => (
                                             <Link to={`${config.baseUrl}featurescreator/${item.user_id}`} target="_blank">
                                                <div className="col-md-3">
                                                   <div className="main-left-sidebar no-margin mb-5">
                                                      <div className="user-data full-width">
                                                         <div className="user-profile">
                                                            {/* // http://www.vigneshwartours.com/wp-content/uploads/2016/08/himachal-Pradesh-banner.jpg */}
                                                            {/* {item.banner === '' || item.banner === null || item.banner === undefined ?} */}
                                                            <div className="username-dt" style={{
                                                               backgroundImage: item.banner === '' || item.banner === null || item.banner === undefined
                                                                  ?
                                                                  "url('http://www.vigneshwartours.com/wp-content/uploads/2016/08/himachal-Pradesh-banner.jpg')" :
                                                                  `url(${config.imageUrl1}${item.banner})`
                                                            }}>
                                                               <div className="usr-pic">
                                                                  <img effect="blur" src={item.profile_pic === null || item.profile_pic === '' || item.profile_pic === undefined
                                                                     ? 'images/noimage.png'
                                                                     :
                                                                     `${config.imageUrl1}${item.profile_pic}`} style={{ width: '100px', height: '98px' }} alt="" />
                                                               </div>
                                                            </div>
                                                            {/* <!--username-dt end--> */}
                                                            <div className="user-specs">
                                                               <h4>{item.first_name} {item.last_name}</h4>
                                                               {/* <Link to={`${config.baseUrl}featurescreator/${item.user_id}`}>@{item.user_name}</Link> */}
                                                            </div>
                                                         </div>
                                                         {/* <!--user-profile end--> */}
                                                      </div>
                                                      {/* <!--user-data end--> */}
                                                   </div>
                                                </div>
                                             </Link>
                                          ))}
                                       </div>
                                    </div>
                                 </div>
                              </div>
                           </div>

                           {/* //=================Upcoming        */}


                           <div className="container-fluid custom-container">
                              <div className="">
                                 <div className="col-md-6">
                                    <h3><strong>Upcoming Drops</strong></h3>
                                 </div>
                                 <div className="col-md-6 text-right">
                                    <div><Link to={`${config.baseUrl}userupcomingdrops`} onClick={this.loading.bind(this)} style={{ color: "#fff" }}>View all &nbsp;<i style={{ fontSize: "17px" }} className="fa fa-angle-right"></i></Link></div>
                                 </div>
                                 <div className="col-md-12">
                                    <br />
                                    {this.state.getitemData.length === 0 ?
                                       <h4 className="text-center upcomigClass" style={{ color: '#fff' }}>There isn't any assest available.</h4> :

                                       <div className="row _post-container_">

                                          {this.state.getitemData.map(item => (
                                             <div className="category-1 mix col-md-4">
                                                <div className="be-post">
                                                   {item.is_sold === 0 ?
                                                      '' :
                                                      <div className="soldOut">
                                                         <img src="images/sold.png" />
                                                      </div>
                                                   }
                                                   <Link to={`${config.baseUrl}itemdetails/${item.item_edition_id}`} className="be-img-block">
                                                      <img effect="blur" src={`${config.imageUrl}${item.image}`} alt="omg" />
                                                   </Link>
                                                   <div className="timer">
                                                      <Countdown
                                                         date={this.getTimeOfStartDate(item.start_date)}
                                                         renderer={this.CountdownTimer}
                                                      />
                                                   </div>
                                                   <Link to={`${config.baseUrl}itemdetails/${item.item_edition_id}`} className="be-post-title">
                                                      {item.name}</Link>
                                                   {/* <Link to={`${config.baseUrl}itemdetails/${item.item_edition_id}`} class="be-post-title price price-data">$ {item.price}</Link> */}

                                                   <span>

                                                   </span>
                                                   <div className="author-post">


                                                   </div>

                                                </div>
                                             </div>

                                          ))}

                                       </div>
                                    }
                                 </div>
                              </div>
                           </div>


                           {/* Art */}
                           <div className="container-fluid custom-container">
                              <div className="">
                                 <div className="col-md-6">
                                    <h3><strong>Art</strong></h3>
                                 </div>
                                 <div className="col-md-6 text-right">
                                    <div><Link to={`${config.baseUrl}userartviewall`} onClick={this.loading.bind(this)} style={{ color: "#fff" }}>View all &nbsp;<i style={{ fontSize: "17px" }} className="fa fa-angle-right"></i></Link></div>
                                 </div>
                                 <div className="col-md-12">
                                    <br />

                                    {this.state.getitemDataArt.length === 0 ?
                                       <h4 className="text-center upcomigClass" style={{ color: '#fff' }}>There isn't any assest available.</h4> :

                                       <div className="row _post-container_">

                                          {this.state.getitemDataArt.map(item => (
                                             <div className="category-1 mix col-md-4">
                                                <div className="be-post">
                                                   {item.is_sold === 0 ?
                                                      '' :
                                                      <div className="soldOut">
                                                         <img src="images/sold.png" />
                                                      </div>
                                                   }
                                                   <Link to={item.file_type === 'video' ? '#/' : `${config.baseUrl}itemdetails/${item.item_edition_id}`} className="be-img-block">
                                                      {item.file_type === 'audio' ?
                                                         <img effect="blur" src="https://ipfs.io/ipfs/QmcwrJKCnvNuxKP22TpYptN3hM76jmwL6kt4BbieBgCCba" alt="omg" /> : ''
                                                      }

                                                      {item.file_type === 'image' ?
                                                         <img effect="blur" src={`${config.imageUrl}${item.image}`} alt="omg" /> :
                                                         item.file_type === 'video' ?
                                                            <Player className="preview_image_data" src={`${config.imageUrl}${item.image}`} /> :
                                                            <ReactAudioPlayer
                                                               src={`${config.imageUrl}${item.image}`}

                                                               controls
                                                            />
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

                                                   <Link onClick={this.loading.bind(this)} to={`${config.baseUrl}itemdetails/${item.item_edition_id}`} className="be-post-title">{item.name}</Link>
                                                   <Link onClick={this.loading.bind(this)} to={`${config.baseUrl}itemdetails/${item.item_edition_id}`} class="be-post-title price price-data">${item.price}</Link>

                                                   <span>
                                                   </span>
                                                   <div className="author-post">
                                                   </div>
                                                </div>
                                             </div>

                                          ))}

                                       </div>
                                    }
                                 </div>
                              </div>
                           </div>
                           {/* Music */}


                           <div className="container-fluid custom-container">
                              <div className="col-md-6">
                                 <h3><strong>Music</strong></h3>
                              </div>
                              <div className="col-md-6 text-right">
                                 <div><Link to={`${config.baseUrl}usermusicviewall`} onClick={this.loading.bind(this)} style={{ color: "#fff" }}>View all &nbsp;<i style={{ fontSize: "17px" }} className="fa fa-angle-right"></i></Link></div>
                              </div>
                              <div className="col-md-12">
                                 {console.log(this.state.getitemDataMusic1)}
                                 <br />
                                 {this.state.getitemDataMusic.length === 0 ?
                                    <div className="row _post-container_" style={{ height: '200px' }}>
                                       <div className="caroselHeight loaderBars">
                                          <Loader type="Bars" color="#00BFFF" height={40} width={40} />
                                       </div>
                                    </div>
                                    :
                                    this.state.getitemDataMusic1 === true ? <h4 className="text-center upcomigClass">There isn't any assets available.</h4>
                                       :

                                       <div className="row _post-container_">

                                          {this.state.getitemDataMusic.map(item => (
                                             <div className="category-1 mix col-md-4">
                                                <div className="be-post">
                                                   {item.is_sold === 0 ?
                                                      '' :
                                                      <div className="soldOut">
                                                         <img src="images/sold.png" />
                                                      </div>
                                                   }
                                                   <Link to={item.file_type === 'video' ? '#/' : `${config.baseUrl}itemdetails/${item.item_edition_id}`} className="be-img-block">
                                                      {item.file_type === 'audio' ?
                                                         <img effect="blur" src="https://ipfs.io/ipfs/QmcwrJKCnvNuxKP22TpYptN3hM76jmwL6kt4BbieBgCCba" alt="omg" /> : ''
                                                      }

                                                      {item.file_type === 'image' ?
                                                         <img effect="blur" src={`${config.imageUrl}${item.image}`} alt="omg" /> :
                                                         item.file_type === 'video' ?
                                                            <Player className="preview_image_data" src={`${config.imageUrl}${item.image}`} /> :
                                                            <ReactAudioPlayer
                                                               src={`${config.imageUrl}${item.image}`}

                                                               controls
                                                            />
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

                                                   <Link onClick={this.loading.bind(this)} to={`${config.baseUrl}itemdetails/${item.item_edition_id}`} className="be-post-title">{item.name}</Link>
                                                   <Link onClick={this.loading.bind(this)} to={`${config.baseUrl}itemdetails/${item.item_edition_id}`} class="be-post-title price price-data">${item.price}</Link>

                                                   <span>
                                                   </span>
                                                   <div className="author-post">
                                                   </div>
                                                </div>
                                             </div>

                                          ))}

                                       </div>


                                 }


                              </div>
                           </div>


                           {/* Sport */}

                           <div className="container-fluid custom-container">
                              <div className="col-md-6">
                                 <h3><strong>Sport</strong></h3>
                              </div>
                              <div className="col-md-6 text-right">
                                 <div><Link to={`${config.baseUrl}usersportviewall`} onClick={this.loading.bind(this)} style={{ color: "#fff" }}>View all &nbsp;<i style={{ fontSize: "17px" }} className="fa fa-angle-right"></i></Link></div>
                              </div>
                              <div className="col-md-12">

                                 <br />
                                 {this.state.getitemDataSport.length === 0 ?
                                    <div className="row _post-container_" style={{ height: '200px' }}>
                                       <div className="caroselHeight loaderBars">
                                          <Loader type="Bars" color="#00BFFF" height={40} width={40} />
                                       </div>
                                    </div> :
                                    this.state.getitemDataSport1 === true ? <h4 className="text-center upcomigClass">There isn't any assets available.</h4>
                                       :

                                       <div className="row _post-container_">

                                          {this.state.getitemDataSport.map(item => (
                                             <div className="category-1 mix col-md-4">
                                                <div className="be-post">
                                                   {item.is_sold === 0 ?
                                                      '' :
                                                      <div className="soldOut">
                                                         <img src="images/sold.png" />
                                                      </div>
                                                   }
                                                   <Link to={item.file_type === 'video' ? '#/' : `${config.baseUrl}itemdetails/${item.item_edition_id}`} className="be-img-block">
                                                      {item.file_type === 'audio' ?
                                                         <img effect="blur" src="https://ipfs.io/ipfs/QmcwrJKCnvNuxKP22TpYptN3hM76jmwL6kt4BbieBgCCba" alt="omg" /> : ''
                                                      }

                                                      {item.file_type === 'image' ?
                                                         <img effect="blur" src={`${config.imageUrl}${item.image}`} alt="omg" /> :
                                                         item.file_type === 'video' ?
                                                            <Player className="preview_image_data" src={`${config.imageUrl}${item.image}`} /> :
                                                            <ReactAudioPlayer
                                                               src={`${config.imageUrl}${item.image}`}

                                                               controls
                                                            />
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

                                                   <Link onClick={this.loading.bind(this)} to={`${config.baseUrl}itemdetails/${item.item_edition_id}`} className="be-post-title">{item.name}</Link>
                                                   <Link onClick={this.loading.bind(this)} to={`${config.baseUrl}itemdetails/${item.item_edition_id}`} class="be-post-title price price-data">${item.price}</Link>

                                                   <span>
                                                   </span>
                                                   <div className="author-post">
                                                   </div>
                                                </div>
                                             </div>

                                          ))}

                                       </div>
                                 }
                              </div>
                           </div>
                        </div>
                     </div>
                  </div>
                  <br />
               </div>
            </div>
            <Footer />
         </>
      )
   }
}
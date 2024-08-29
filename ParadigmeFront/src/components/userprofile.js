import React, { Component } from 'react';
import axios from 'axios';
import Header from '../directives/header'
import Footer from '../directives/footer'
import config from '../config/config'
import moment from 'moment'
import Cookies from 'js-cookie';
import Countdown, { zeroPad } from 'react-countdown';
import { ToastContainer, toast } from 'react-toastify';
import ContentShimmer from 'react-content-shimmer'
import { Link } from 'react-router-dom';
import { Player } from 'video-react';
import ReactAudioPlayer from 'react-audio-player';
import {OBJModel} from 'react-3d-viewer'

export default class userprofile extends Component {
  constructor(props) {
    super(props)
    const { match: { params } } = this.props;
    this.id = params.id
    this.state = {
      userData: {},
      getWalletData: {},
      myNftData: [],
      collectionData: [],
      isActive: 1,
      isResponseForOwn: true,
      isResponseForCreated: true,
      isResponseForCollection: true,
    };
    this.loginData = (!Cookies.get('loginSuccessParadigme')) ? [] : JSON.parse(Cookies.get('loginSuccessParadigme'))
    this.token = (!Cookies.get('token')) ? [] : JSON.parse(Cookies.get('token'));

  }

  componentDidMount() {
    this.getUserDataAPI()
    this.getWalletDataAPI()
    this.getMyNftAPI()
  }

  async getUserDataAPI() {
    await axios({
      method: 'post',
      url: `${config.apiUrl}getUserDetails`,
      data: { "id": this.id }
    }).then(response => {
      if (response.data.success === true) {
        this.setState({
          userData: response.data.response
        })
      }
    })
  }

  async getWalletDataAPI() {
    const token = this.token
    await axios({
      method: 'post',
      url: `${config.apiUrl}getWalletDetail`,
      headers: { authorization: token },
      data: { "user_id": this.id, 'email': this.loginData?.user_email }
    }).then(response => {
      if (response.data.success === true) {
        this.setState({
          getWalletData: response.data
        })
      }
    })
  }

  //  ========================================== Portfolio API's Start==========================================

  async getMyNftAPI(nftType = null) {
    if (!nftType) {
      var nftType = 1
      this.setState({
        isActive: 1
      })
    } else {
      var nftType = nftType
      this.setState({
        isActive: nftType
      })
    }

    this.setState({
      'saleHistory': [],
      'nftType': nftType,
      'FavouritesHistory': []
    })

    const token = this.token
    await axios({
      method: 'post',
      url: `${config.apiUrl}portfolio`,
      headers: { authorization: token },
      data: { "user_id": this.id, 'email': this.loginData?.user_email, 'type': nftType, 'login_user_id': this.loginData.id }
    }).then(response => {
      if (response.data.success === true) {
        this.setState({
          myNftData: response.data.response,
          saleHistory: response.data.response,
          FavouritesHistory: response.data.response
        });
      } else {
        this.setState({
          'saleHistory': [],
          myNftData: [],
          'nftType': nftType,
          'FavouritesHistory': []
        })
      }

      if (nftType == 1) {
        this.setState({
          isResponseForOwn: false
        });
      } else {
        this.setState({
          isResponseForCreated: false
        });
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


  // ==============================   Collections API's Start =================================================

  async getCollectionDataAPI() {

    this.setState({
      isResponseForCollection: false
    });

    const token = this.token
    this.setState({
      isActive: 3
    })
    await axios({
      method: 'post',
      url: `${config.apiUrl}getUserCollection`,
      headers: { authorization: token },
      data: { "user_id": this.id, 'email': this.loginData?.user_email }
      // data: { "user_id": 262, 'email': this.loginData?.user_email }
    }).then(response => {

      if (response.data.success === true) {
        this.setState({
          collectionData: response.data.response
        })
      }

    })
  }


  userShow(id) {

    setTimeout(() => {
      window.location.href = `${config.baseUrl}UserProfile/` + id.owner_id
    });
  }



  render() {
    return (

      <>
        <Header />
        <ToastContainer />

        <div className="no-bottom no-top" id="content">
          <div id="top" />

          {/* section begin */}
          <section id="profile_banner" aria-label="section" className="text-light"
            style={{
              backgroundImage: !this.state.userData.banner || this.state.userData.banner === '' || this.state.userData.banner === null || this.state.userData.banner === 'null' || this.state.userData.banner === undefined
                ?
                `url(images/inner-banner11.jpg)` :
                `url(${config.imageUrl1}${this.state.userData.banner})`
            }}>
          </section>
          {/* section close */}
          <section aria-label="section" className="d_coll no-top userprofile-page">
            <div className="container">
              <div className="row">
                <div className="col-md-12">
                  <div className="d_profile" style={{ marginBottom: '0px' }}>
                    <div className="profile_avatar">
                      <div className="d_profile_img">
                        {!this.state.userData?.profile_pic || this.state.userData?.profile_pic === '' || this.state.userData?.profile_pic === null || this.state.userData?.profile_pic == 'null' ?
                          <img src="images/default-user-icon.jpg" className="" alt="" width="50px" /> :
                          <img src={this.state.userData.profile_pic ?
                            config.imageUrl1 + this.state.userData.profile_pic :
                            ""} alt="" />
                        }
                      </div>
                      <div className="profile_name">
                        <h4>
                          {this.state.userData && this.state.userData.full_name ? this.state.userData.full_name : ''}
                          <div className="clearfix" />
                          {this.state.userData?.address ?
                            <>
                              <span id="wallet" className="profile_wallet">{this.state.userData?.address.toString().substring(0, 4) + '...' + this.state.userData?.address.toString().substr(this.state.userData?.address.length - 4)}</span>
                              <button id="btn_copy" title="Copy Text"><span className='fa fa-clone' style={{ fontSize: "15px" }}></span></button> </>
                            :
                            ""
                          }

                          <div className="social-icons mt-0" style={{ backgroundSize: 'cover' }}>
                            {/* <h5 /> */}

                            <a href={this.state.userData.facebook ? this.state.userData.facebook : 'javascript:void(0)'} target={this.state.userData.facebook ? '_blank' : ''} >
                              <i className='fa fa-facebook'></i>
                            </a>

                            <a href={this.state.userData.twitter ? this.state.userData.twitter : 'javascript:void(0)'} target={this.state.userData.twitter ? '_blank' : ''} >
                              <i className='fa fa-twitter'></i>
                            </a>

                            <a href={this.state.userData.telegram ? this.state.userData.telegram : 'javascript:void(0)'} target={this.state.userData.telegram ? '_blank' : ''} >
                              <i className='fa fa-telegram'></i>
                            </a>

                            <a href={this.state.userData.insta ? this.state.userData.insta : 'javascript:void(0)'} target={this.state.userData.insta ? '_blank' : ''} >
                              <i className='fa fa-instagram'></i>
                            </a>

                            <a href={this.state.userData.discord ? this.state.userData.discord : 'javascript:void(0)'} target={this.state.userData.discord ? '_blank' : ''} >
                              <img src="images/discord.png" className="social-icons-collection" />
                            </a>

                          </div>
                        </h4>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-md-12">
                  <div className="de_tab tab_simple">
                    <div className="items_filter" style={{ backgroundSize: 'cover' }}>
                      <ul className="de_nav">
                        <li className={this.state.isActive === 1 ? "active" : ''} onClick={this.getMyNftAPI.bind(this, 1)}><span>Owned</span></li>
                        <li className={this.state.isActive === 2 ? "active" : ''} onClick={this.getMyNftAPI.bind(this, 2)}><span>Created</span></li>
                        <li className={this.state.isActive === 3 ? "active" : ''} onClick={this.getCollectionDataAPI.bind(this, 3)}><span>Collection</span></li>

                      </ul>
                      <div className="de_tab_content">
                        <div className="tab-1" style={{ display: this.state.isActive === 1 ? 'block' : 'none' }}>
                          <div className="row">

                            {this.state.isResponseForOwn == true ?
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
                              this.state.myNftData.length > 0 ?
                                this.state.myNftData.map(item => (
                                  <div className='col-lg-4 col-md-6 mb-5'>
                                    <div className='auction-list'>
                                      <div className='profilebox'>
                                        {!item.owner_profile_pic || item.owner_profile_pic == 'null' || item.owner_profile_pic == 'undefined' ?
                                          <img src="images/default-user-icon.jpg" className="" alt="" width="50px" />
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
                                              <video muted autoPlay width="70px" height="70px" controls>
                                                <source src={`${config.imageUrl}${item.image}`} type="video/mp4" />
                                              </video>

                                              :
                                              item.file_type == 'audio' ?
                                                <ReactAudioPlayer
                                                  className='audio-play'
                                                  src={`${config.imageUrl}${item.image}`}

                                                  controls
                                                /> :
                              

                                                item?.file_type == 'OBJ' ?
                                                <OBJModel src={`${config.imageUrl}${item?.image}`} texPath=""/>
                  
                                                   :
                                                ""


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
                                ))
                                :
                                <span className='text-center bg-grey'><img src='images/nodata-found.png' /></span>
                            }
                          </div>
                        </div>
                        <div className="tab-2" style={{ display: this.state.isActive === 2 ? 'block' : 'none' }}>
                          <div className="row">
                            {this.state.isResponseForCreated == true ?
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
                              this.state.myNftData.length > 0 ?
                                this.state.myNftData.map(item => (
                                  <div className='col-lg-4 col-md-6'>
                                    <div className='auction-list'>
                                      <div className='profilebox'>
                                        {!item.owner_profile_pic || item.owner_profile_pic == 'null' || item.owner_profile_pic == 'undefined' ?
                                          <img src="images/default-user-icon.jpg" className="" alt="" width="50px" />
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
                                              <video muted autoPlay width="70px" height="70px" controls>
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
                                                <OBJModel src={`${config.imageUrl}${item.image}`} texPath=""/>
                  
                                                   :
                                                ""


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
                                ))
                                : <span className='text-center bg-grey'><img src='images/nodata-found.png' /></span>
                            }
                          </div>
                        </div>
                        <div className="tab-3 trending-collection" style={{ display: this.state.isActive === 3 ? 'block' : 'none' }}>
                          <div className="row">

                            {this.state.isResponseForCollection == true ?
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
                              this.state.collectionData.length > 0 ?
                                this.state.collectionData.map(item => (
                                  <div className='col-lg-4 col-md-6 mb-5'>
                                    <div className="auction-list box-hover-effect">
                                      <div className="auction-img">
                                        <Link to={`${config.baseUrl}collections/` + item.collection_id}>
                                          {!item.banner || item.banner == "" || item.banner == null || item.banner == 'null' ?
                                            <img src="images/default-user-icon.jpg" alt />
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
                                              <div className="proheadname">{item.creater_name}</div>
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
                  </div>
                </div>
              </div>
            </div></section>
        </div>


        <Footer />
      </>
    )
  }
}
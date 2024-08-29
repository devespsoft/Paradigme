import React, { Component } from 'react';
import axios from 'axios';
import Header from '../directives/header'
import Footer from '../directives/footer'
import config from '../config/config'
import Cookies from 'js-cookie';
import moment from 'moment'
import Countdown, { zeroPad } from 'react-countdown';
import { ToastContainer, toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import ContentShimmer from 'react-content-shimmer'
import { Player } from 'video-react';
import ReactAudioPlayer from 'react-audio-player';
import {OBJModel} from 'react-3d-viewer'

export default class collection extends Component {
  constructor(props) {
    super(props)
    const { match: { params } } = this.props;
    this.id = params.id
    this.state = {
      collectionDetail: {},
      getWalletData: {},
      myNftData: [],
      collectionData: [],
      isActive: 1,
      isResponse: true
    };
    this.loginData = (!Cookies.get('loginSuccessParadigme')) ? [] : JSON.parse(Cookies.get('loginSuccessParadigme'))
    this.token = (!Cookies.get('token')) ? [] : JSON.parse(Cookies.get('token'));

  }

  // ==============================   Collections API's Start =================================================

  async getMyNftAPI(id) {
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
    await axios({
      method: 'post',
      url: `${config.apiUrl}getCollectionById`,
      data: { "collection_id": this.id, "login_user_id": this.loginData.id }
    }).then(response => {

      if (response.data.success === true) {
        this.setState({
          isResponse: false,
          collectionDetail: response.data.collectionData,
          myNftData: response.data.itemDetail
        })
      }
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






  componentDidMount() {

    this.getMyNftAPI()
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
              backgroundImage: this.state.collectionDetail.banner === '' || this.state.collectionDetail.banner === null || this.state.collectionDetail.banner === undefined || this.state.collectionDetail.banner === 'null' || this.state.collectionDetail.banner === 'undefined'
                ?
                "url('images/background/bg-3.jpg')" :
                `url(${config.imageUrl1}${this.state.collectionDetail.banner})`
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
                        <img src={this.state.collectionDetail.collection_profile_pic === '' || this.state.collectionDetail.collection_profile_pic === '/nxft/backend/uploads/' ? "images/author/author-1.jpg" : `${config.imageUrl1 + this.state.collectionDetail.collection_profile_pic}`}
                          alt="" />
                      </div>
                      <div className="profile_name">
                        <h4>
                          {this.state.collectionDetail && this.state.collectionDetail.collection_name ? this.state.collectionDetail.collection_name : ''}
                          <div className="clearfix" />

                          <div className="social-icons mt-0" style={{ backgroundSize: 'cover' }}>
                            <a href={this.state.collectionDetail?.facebook ? this.state.collectionDetail?.facebook : 'javascript:void(0)'} target={this.state.collectionDetail?.facebook ? '_blank' : ''} >
                              <i className='fa fa-facebook'></i>
                            </a>

                            <a href={this.state.collectionDetail?.twitter ? this.state.collectionDetail?.twitter : 'javascript:void(0)'} target={this.state.collectionDetail?.twitter ? '_blank' : ''} >
                              <i className='fa fa-twitter'></i>
                            </a>

                            <a href={this.state.collectionDetail?.telegram ? this.state.collectionDetail?.telegram : 'javascript:void(0)'} target={this.state.collectionDetail?.telegram ? '_blank' : ''} >
                              <i className='fa fa-telegram'></i>
                            </a>

                            <a href={this.state.collectionDetail?.insta ? this.state.collectionDetail?.insta : 'javascript:void(0)'} target={this.state.collectionDetail?.insta ? '_blank' : ''} >
                              <i className='fa fa-instagram'></i>
                            </a>

                            <a href={this.state.collectionDetail?.discord ? this.state.collectionDetail?.discord : 'javascript:void(0)'} target={this.state.collectionDetail?.discord ? '_blank' : ''} >
                              <img src="images/discord.png" className="social-icons-collection" />
                            </a>

                          </div>

                        </h4>

                        <div className="row">
                          <div className="col-md-3"> </div>
                          <div className="col-md-6">
                            {this.state.collectionDetail?.description ? this.state.collectionDetail?.description : ''}
                          </div>
                          <div className="col-md-3"> </div>
                        </div>

                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-md-12">
                  <div className="de_tab tab_simple">
                    <div className="items_filter" style={{ backgroundSize: 'cover' }}>
                      {/* <ul className="de_nav">
                        <li className={this.state.isActive === 1 ? "active" : ''} onClick={this.getMyNftAPI.bind(this, 1)}><span>Collection Details</span></li>
                      </ul> */}
                      <div className="de_tab_content">
                        <div className="tab-1" style={{ display: this.state.isActive === 1 ? 'block' : 'none' }}>
                          <div className="row">
                            {/* nft item begin */}

                            {this.state.isResponse == true ?
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
                                        {!item.owner_profile_pic || item.owner_profile_pic === null || item.owner_profile_pic === undefined || item.owner_profile_pic == 'null' ?
                                          <img src="images/default-user-icon.jpg" />
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
                                                /> :  item?.file_type == 'OBJ' ?
                                                <OBJModel src={`${config.imageUrl}${item?.image}`} texPath=""/>: ""


                                          }
                                        </Link>

                                      </div>
                                      <div className='profileboxdetail'>
                                        <Link to={`${config.baseUrl}collections/` + item.user_collection_id}>
                                          <img src={`${config.imageUrl1 + item.collection_profile_pic}`} />
                                          {item.collection_name}
                                        </Link> <br />
                                        <Link to={`${config.baseUrl}nftDetails/` + item.item_id}>
                                          <h2>{item.name}</h2>
                                        </Link>
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
                                                <td><p>{item.price} ETH </p></td>
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
                                                <td><p>{item.price} ETH </p></td>
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
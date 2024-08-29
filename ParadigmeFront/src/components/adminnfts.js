import React, { Component } from 'react';
import axios from 'axios';
import Header from '../directives/header'
import Footer from '../directives/footer'
import config from '../config/config'
import Cookies from 'js-cookie';
import Countdown, { zeroPad } from 'react-countdown';
import ContentShimmer from 'react-content-shimmer'
import moment from 'moment'
import { ToastContainer, toast } from 'react-toastify';
import { Player } from 'video-react';
import { Link } from 'react-router-dom';
import Select from 'react-select';
import ReactAudioPlayer from 'react-audio-player';
import Accordion from 'react-bootstrap/Accordion';
import {OBJModel} from 'react-3d-viewer'


const options = [
  { value: '0', label: 'Status' },
  { value: '1', label: 'Buy Now' },
  { value: '2', label: 'Auction' },
];
const options1 = [
  { value: 'All', label: 'Price' },
  { value: 'Lowtohigh', label: 'Price: Low to High' },
  { value: 'Hightolow', label: 'Price: High to Low' },
  { value: 'newest', label: 'Newest' },
  { value: 'oldest', label: 'Oldest' },
];

const customStyles = {
  option: (provided, state) => ({
    ...provided,
    borderBottom: '1px solid #ccc',
    color: state.isSelected ? '#000' : '#000',
  })
}

export default class adminNfts extends Component {

  constructor(props) {
    super(props)
    this.state = {
      marketPlaces: [],
      
      noData: 0,
      isResponse: true,
      collectionId: '0',
      categoryId: '0',
      searchData: '',
      sale_type: '0',
      sortBy: ''
    };
    this.loginData = (!Cookies.get('loginSuccessParadigme')) ? [] : JSON.parse(Cookies.get('loginSuccessParadigme'))
    

  }


  async allMarketPlaces() {
    await axios({
      method: 'post',
      url: `${config.apiUrl}marketplace`,
      data: {
        "user_id": "0",
        "login_user_id": this.loginData && this.loginData.id ? this.loginData.id : '0',
        "user_collection_id": this.state.collectionId,
        "category_id": this.state.categoryId,
        "searchData": this.state.searchData,
        "sale_type": this.state.sale_type,
        "sortBy": this.state.sortBy,
        "is_trending": "0",
        "recent": "0",
        "limit": "0"
      }
    }).then((res) => {
      if (res.data.success === true) {
        this.setState({
          
          marketPlaces: res.data.response.filter(item => item.owner_id == 1),
          isResponse: false,
          noData: 0
        })
      } else {
        this.setState({
          noData: 1,
          isResponse: false,
        })
      }

    }).catch((error) => {
      this.setState({
        noData: 1,
        isResponse: false,
      })
    })

  }



 

 

  componentDidMount() {
    this.allMarketPlaces()
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



  render() {
    return (

      <>
        <div id="wrapper">
          <Header />
          <ToastContainer />
          <div className="no-bottom" id="content">
            <div id="top" />
            {/* section begin */}
            <section aria-label="section" className="marketplace">
              <div className="container">
                
                <div className='container-fluid'>
                  <div className='row'>
                  

                    <div className='col-md-12'>
                      <div className="row wow fadeIn">
                        <div className="col-md-12">
                          <div className='row'>
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

                              !this.state.marketPlaces || this.state.noData == 1 ?
                                <>
                                  <span className='text-center bg-grey'><img src='images/nodata-found.png' /></span>
                                </>
                                :
                                this.state.marketPlaces.map(item => (
                                  <div className='col-lg-4 col-md-6 mb-5'>
                                    <div className='auction-list'>
                                      <div className='profilebox'>
                                        {!item.owner_profile_pic || item.owner_profile_pic === null || item.owner_profile_pic == 'null' || item.owner_profile_pic === undefined ?
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
                                                <OBJModel src={`${config.imageUrl}${item?.image}`} texPath=""/>
                  
                                                   :""


                                          }
                                        </Link>

                                      </div>
                                      <div className='profileboxdetail'>
                                        <Link to={`${config.baseUrl}collections/` + item.user_collection_id}>
                                          <img src={`${config.imageUrl1 + item.collection_image}`} />
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
                                                <td><p>{parseFloat(item.price).toFixed(6)} MATIC </p></td>
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

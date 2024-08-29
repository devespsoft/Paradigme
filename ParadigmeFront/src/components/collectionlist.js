import React, { Component } from 'react';
import axios from 'axios';
import Header from '../directives/header'
import Footer from '../directives/footer'
import config from '../config/config'
import Cookies from 'js-cookie';
import Countdown, { zeroPad } from 'react-countdown';
import moment from 'moment'
import { ToastContainer, toast } from 'react-toastify';
import ContentShimmer from 'react-content-shimmer'
import { Player } from 'video-react';
import { Link } from 'react-router-dom';
export default class collectionlist extends Component {

  constructor(props) {
    super(props)
    this.state = {
      collections: [],
      getItemAllNfts: [],
      nft_count: '',
      isResponse: true
    };
    this.loginData = (!Cookies.get('loginSuccessParadigme')) ? [] : JSON.parse(Cookies.get('loginSuccessParadigme'))
  }

  async collectionList() {
    await axios({
      method: 'get',
      url: `${config.apiUrl}getCollection`,
    }).then((res) => {
      if (res.data.success === true) {
        this.setState({
          collections: res.data.response,
          isResponse: false
        })
      }
    }).catch((error) => {
      this.setState({
        isResponse: false
      })
    })
  }

  componentDidMount() {
    this.collectionList()
    this.totalNfts()
  }

  async totalNfts() {
    await axios({
      method: 'get',
      url: `${config.apiUrl}getDashboardCount`,
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
                <div className='de_count text-left'>
                  <ul>
                    <a href={`${config.baseUrl}marketplace`}>
                      <li><h4 >NFTs&nbsp;{this.state.getItemAllNfts.nfts}</h4></li>
                    </a>

                    <a href={`${config.baseUrl}collectionList`}>
                      <li className='active'><h4 >Collections&nbsp;{this.state.getItemAllNfts.totalCollection}</h4></li>
                    </a>

                    <a href={`${config.baseUrl}profileList`}>
                      <li><h4 >Profiles&nbsp; {this.state.getItemAllNfts.totalUsers}</h4></li>
                    </a>
                  </ul>
                </div>

                <div className="row wow fadeIn">
                  <div className="col-md-12">
                    <div className='row trending-collection'>
                    {this.state.isResponse == true ?
                        <>
                          <div className='col-sm-4'>
                            <ContentShimmer rows="1" style={{ marginTop: "1rem", background: '#e6e6e4', width:'100%' }} rounded={"20px"} size={{ height: 400 }} />
                          </div>

                          <div className='col-sm-4'>
                            <ContentShimmer rows="1" style={{ marginTop: "1rem", background: '#e6e6e4', width:'100%' }} rounded={"20px"} size={{ height: 400 }} />
                          </div>

                          <div className='col-sm-4'>
                            <ContentShimmer rows="1" style={{ marginTop: "1rem", background: '#e6e6e4', width:'100%' }} rounded={"20px"} size={{ height: 400 }} />
                          </div>
                        </>
                        :                      
                      
                      this.state.collections.length > 0 ?
                        this.state.collections.map(item => (
                          <div className='col-lg-4 col-md-6 mb-5'>
                            <div className="auction-list box-hover-effect">
                              <div className="auction-img">
                                <Link to={`${config.baseUrl}collections/` + item.collection_id}>
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
                                    <Link to={`${config.baseUrl}collections/` + item.collection_id}>
                                      {!item.profile_pic || item.profile_pic == "" || item.profile_pic == 'undefined' || item.profile_pic == 'null' ?
                                        <div style={{ backgroundImage: `images/default-user-icon.jpg` }} aria-label="Sea Flights" role="image" className="sea-img" />
                                        :
                                        <div style={{ backgroundImage: `url(${config.imageUrl1 + item.profile_pic})` }} aria-label="Sea Flights" role="image" className="sea-img" />
                                      }
                                    </Link>
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
                                      </div>&nbsp;&nbsp;
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
            </section>
          </div>
          <Footer />
        </div>
      </>
    )
  }
}
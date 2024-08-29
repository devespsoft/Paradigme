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
export default class profilelist extends Component {

    constructor(props) {
        super(props)
        this.state = {
            getprofilesList: [],
            getItemAllNfts: [],
            nft_count: '',
            isResponse: true,
            sortBy : 0,
            type : 0
        };
        this.loginData = (!Cookies.get('loginSuccessParadigme')) ? [] : JSON.parse(Cookies.get('loginSuccessParadigme'))
    }

    componentDidMount() {
        this.getprofileAPI()
        this.totalNfts()
    }

    async getprofileAPI(sortBy = 0,type = 0 ) {

        this.setState({
            sortBy : sortBy,
            type : type
        })

        await axios({
            method: 'post',
            url: `${config.apiUrl}getUsersProfileForMarketplace`,
            data : { sortBy : sortBy, type : type }
        }).then((res) => {
            if (res.data.success === true) {
                this.setState({
                    getprofilesList: res.data.response,
                    isResponse: false
                })
            }
        }).catch((error) => {

        })
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

    selectTypeHandler = (value) => {
        // this.getprofileAPI(this.state.sortBy, value);
        this.getprofileAPI(0, value);
    }

    selectSortByHandler = (value) => {
        // this.getprofileAPI(value, this.state.type);
        this.getprofileAPI(value, 0);
    }

    resetFilters = (value) => {
        this.getprofileAPI(0,0);
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
                                            <li ><h4 >Collections&nbsp;{this.state.getItemAllNfts.totalCollection}</h4></li>
                                        </a>

                                        <a href={`${config.baseUrl}profileList`}>
                                            <li className='active'><h4 >Profiles&nbsp; {this.state.getItemAllNfts.totalUsers}</h4></li>
                                        </a>
                                    </ul>
                                </div>

                                <div className="row mb-3" style={{ backgroundSize: 'cover' }}>

                                    <div className="col-xl-2 col-lg-2 col-md-4 col-sm-12 col-12 mt-2 mb-3" style={{ backgroundSize: 'cover' }}>
                                        <div id="buy_category" className="dropdown2" style={{ backgroundSize: 'cover' }}>
                                            <label className='input-label'>Sort By</label>
                                            <select onChange={e => this.selectSortByHandler(e.target.value)} className="form-control">
                                                <option value='0'>Total Volume</option>
                                                <option value='1'>Newest to Oldest</option>
                                                <option value='2'>Oldest to Newest</option>
                                                <option value='3'>Most Minted</option>
                                                <option value='4'>Most Sold</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div className="col-xl-2 col-lg-2 col-md-4 col-sm-12 col-12 mt-2 mb-3" style={{ backgroundSize: 'cover' }}>
                                        <div id="buy_category" className="dropdown2" style={{ backgroundSize: 'cover' }}>
                                            <label className='input-label'>Type</label>
                                            <select onChange={e => this.selectTypeHandler(e.target.value)} className="form-control">
                                                <option value='0'>Select Type</option>
                                                <option value='1'>Creator</option>
                                                <option value='2'>Collector</option>
                                                <option value='3'>Other</option>
                                            </select>
                                        </div>
                                    </div>                                    

                                    <div className="col-xl-2 col-lg-2 col-md-2 col-sm-12 col-12 mt-2 mb-3" style={{ backgroundSize: 'cover' }}>
                                        <label className='input-label'>&nbsp;</label>
                                        <button onClick={this.resetFilters.bind(this)} id="reset_button" className="btn btn-primary btn-sm">Reset</button>
                                    </div>

                                </div>

                                <div className="row wow fadeIn">
                                    <div className="col-sm-12 top-artists" style={{ "background-size": "cover" }}>
                                        <div className="row" style={{ "background-size": "cover" }}>


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
                                                this.state.getprofilesList.length > 0 ?

                                                    this.state.getprofilesList.map(item => (
                                                        <div className='col-lg-4 col-md-6 mb-4'>
                                                            <Link to={`${config.baseUrl}userProfile/` + item.id}>
                                                                <div className="nft_coll">
                                                                    <div className="nft_wrap">
                                                                        {!item.banner || item.banner == "" || item.banner == null || item.banner == 'null' ?
                                                                            <img className="lazy img-fluid" src="images/default-user-icon.jpg" alt />
                                                                            :
                                                                            <img className="lazy img-fluid" src={`${config.imageUrl1 + item.banner}`} alt />
                                                                        }
                                                                    </div>

                                                                    <div className="nft_coll_pp">
                                                                        {!item.profile_pic || item.profile_pic == "" || item.profile_pic == null || item.profile_pic == 'null' ?
                                                                            <img className="lazy img-fluid" src="images/default-user-icon.jpg" alt />
                                                                            :
                                                                            <img className="lazy img-fluid" src={`${config.imageUrl1 + item.profile_pic}`} alt />
                                                                        }
                                                                    </div>
                                                                    <div className="nft_coll_info">
                                                                        <h3 className='gradient-text mb-0 green'>@{item.full_name ? item.full_name : 'unnamed'}</h3>
                                                                    </div>
                                                                </div>
                                                            </Link>
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
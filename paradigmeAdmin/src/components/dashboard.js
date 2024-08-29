import React, { Component } from 'react';
import Header from '../directives/header'
import Leftsidebar from '../directives/leftsidebar'
import Footer from '../directives/footer'
import axios from 'axios'
import config from '../config/config'
import Cookies from 'js-cookie';

export default class dashboard extends Component {

    constructor(props) {
        super(props)
        this.loginData = (!Cookies.get('loginSuccessParadigmeAdmin')) ? [] : JSON.parse(Cookies.get('loginSuccessParadigmeAdmin'));
        this.state = {
            dashboard_list: [],
            MatictoUsdPrice : ''
        }
    }

    componentDidMount() {
        if (!Cookies.get('loginSuccessParadigmeAdmin')) {
            window.location.href = `${config.baseUrl}`
            return false;
        }
        this.getETHToUsd()
        this.dashboardList();
    }

    async getETHToUsd() {
        await axios({
            method: 'get',
            url: `https://api.binance.com/api/v3/ticker/price?symbol=MATICUSDT`,
        }).then(response => {
            this.setState({
                MatictoUsdPrice: response.data.price
            })
        })
    }    

    async dashboardList() {
        await
            axios({
                method: 'get',
                url: `${config.apiUrl}dashboarditem`,
                data: {}
            })
                .then(result => {
                    if (result.data.success === true) {
                        this.setState({
                            dashboard_list: result.data.response
                        })
                    }
                    else if (result.data.success === false) {
                    }
                })

                .catch(err => {
                })
    }
    render() {
        return (
            <>
                <div className="wrapper theme-6-active pimary-color-green">
                    <Header />
                    <Leftsidebar />
                    <div className="fixed-sidebar-right">
                        <ul className="right-sidebar">
                            <li>
                                <div className="tab-struct custom-tab-1">
                                    <ul role="tablist" className="nav nav-tabs" id="right_sidebar_tab">
                                        <li className="active" role="presentation"><a aria-expanded="true" data-toggle="tab" role="tab" id="chat_tab_btn" href="#chat_tab">chat</a></li>
                                        <li role="presentation" className=""><a data-toggle="tab" id="messages_tab_btn" role="tab" href="#messages_tab" aria-expanded="false">messages</a></li>
                                        <li role="presentation" className=""><a data-toggle="tab" id="todo_tab_btn" role="tab" href="#todo_tab" aria-expanded="false">todo</a></li>
                                    </ul>
                                    <div className="tab-content" id="right_sidebar_content">
                                        <div id="chat_tab" className="tab-pane fade active in" role="tabpanel">
                                            <div className="chat-cmplt-wrap">
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </li>
                        </ul>
                    </div>
                    <div className="right-sidebar-backdrop"></div>
                    <div className="page-wrapper">
                        <div className="container-fluid pt-25">
                            <div className="row">
                                <div className="col-lg-3 box-counter col-md-6 col-sm-6 col-xs-12">
                                    <div className="panel panel-default card-view pa-0">
                                        <div className="panel-wrapper collapse in">
                                            <div className="panel-body pa-0">
                                                <div className="sm-data-box">
                                                    <div className="container-fluid" >
                                                        <div className="row">
                                                            <div className="col-xs-12 text-center pl-0 pr-0 data-wrap-left">
                                                                <span className="weight-500 uppercase-font block font-100  counter">{this.state.dashboard_list.total_nft ? this.state.dashboard_list.total_nft : 0}</span>
                                                                <span className="weight-500 uppercase-font block font-13 ">Total NFT's </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="col-lg-3 box-counter col-md-6 col-sm-6 col-xs-12">
                                    <div className="panel panel-default card-view pa-0">
                                        <div className="panel-wrapper collapse in">
                                            <div className="panel-body pa-0">
                                                <div className="sm-data-box">
                                                    <div className="container-fluid" >
                                                        <div className="row">
                                                            <div className="col-xs-12 text-center pl-0 pr-0 data-wrap-left">
                                                                <span className="weight-500 uppercase-font block font-75 counter ">{this.state.dashboard_list.auction_nft ? this.state.dashboard_list.auction_nft : 0}</span>
                                                                <span className="weight-500 uppercase-font block font-13 ">Total Price NFT's</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="col-lg-3 box-counter col-md-6 col-sm-6 col-xs-12">
                                    <div className="panel panel-default card-view pa-0">
                                        <div className="panel-wrapper collapse in">
                                            <div className="panel-body pa-0">
                                                <div className="sm-data-box">
                                                    <div className="container-fluid" >
                                                        <div className="row">
                                                            <div className="col-xs-12 text-center pl-0 pr-0 data-wrap-left">
                                                                <span className="weight-500 uppercase-font block font-75 counter ">{this.state.dashboard_list.price_nft ? this.state.dashboard_list.price_nft : 0}</span>
                                                                <span className="weight-500 uppercase-font block font-13 ">Total Auction NFT's</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="col-lg-3 box-counter col-md-6 col-sm-6 col-xs-12">
                                    <div className="panel panel-default card-view pa-0">
                                        <div className="panel-wrapper collapse in">
                                            <div className="panel-body pa-0">
                                                <div className="sm-data-box">
                                                    <div className="container-fluid" >
                                                        <div className="row">
                                                            <div className="col-xs-12 text-center pl-0 pr-0 data-wrap-left">
                                                                <span className="weight-500 uppercase-font block font-75 counter ">{this.state.dashboard_list.collection_count ? this.state.dashboard_list.collection_count : 0}</span>
                                                                <span className="weight-500 uppercase-font block font-13 ">Total Collections</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="col-lg-3 box-counter col-md-6 col-sm-6 col-xs-12">
                                    <div className="panel panel-default card-view pa-0">
                                        <div className="panel-wrapper collapse in">
                                            <div className="panel-body pa-0">
                                                <div className="sm-data-box">
                                                    <div className="container-fluid" >
                                                        <div className="row">
                                                            <div className="col-xs-12 text-center pl-0 pr-0 data-wrap-left">
                                                                <span className="weight-500 uppercase-font block font-75 counter ">{this.state.dashboard_list.category_count ? this.state.dashboard_list.category_count : 0}</span>
                                                                <span className="weight-500 uppercase-font block font-13 ">Total Category</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="col-lg-3 box-counter col-md-6 col-sm-6 col-xs-12">
                                    <div className="panel panel-default card-view pa-0">
                                        <div className="panel-wrapper collapse in">
                                            <div className="panel-body pa-0">
                                                <div className="sm-data-box">
                                                    <div className="container-fluid" >
                                                        <div className="row">
                                                            <div className="col-xs-12 text-center pl-0 pr-0 data-wrap-left">
                                                                <span className="weight-500 uppercase-font block font-75 counter ">{this.state.dashboard_list.totalSoldNFT ? this.state.dashboard_list.totalSoldNFT : '0'}</span>
                                                                <span className="weight-500 uppercase-font block font-13 ">Total Item Sold</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>


                                <div className="col-lg-3 box-counter col-md-6 col-sm-6 col-xs-12">
                                    <div className="panel panel-default card-view pa-0">
                                        <div className="panel-wrapper collapse in">
                                            <div className="panel-body pa-0">
                                                <div className="sm-data-box">
                                                    <div className="container-fluid" >
                                                        <div className="row">
                                                            <div className="col-xs-12 text-center pl-0 pr-0 data-wrap-left">
                                                                <span className="weight-500 uppercase-font block font-75 counter ">{this.state.dashboard_list.totalBidsOfItems ? this.state.dashboard_list.totalBidsOfItems : '0.000000'} MATIC</span>
                                                                <span className="weight-500 uppercase-font block font-13 ">Total Bids of Item</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="col-lg-3 box-counter col-md-6 col-sm-6 col-xs-12">
                                    <div className="panel panel-default card-view pa-0">
                                        <div className="panel-wrapper collapse in">
                                            <div className="panel-body pa-0">
                                                <div className="sm-data-box">
                                                    <div className="container-fluid" >
                                                        <div className="row">
                                                            <div className="col-xs-12 text-center pl-0 pr-0 data-wrap-left">
                                                                <span className="weight-500 uppercase-font block font-75 counter ">{this.state.dashboard_list.totalRevenuew ? this.state.dashboard_list.totalRevenuew : '0.000000'}</span>
                                                                <span className="weight-500 uppercase-font block font-13 ">Total Revenue(In MATIC)</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="col-lg-3 box-counter col-md-6 col-sm-6 col-xs-12">
                                    <div className="panel panel-default card-view pa-0">
                                        <div className="panel-wrapper collapse in">
                                            <div className="panel-body pa-0">
                                                <div className="sm-data-box">
                                                    <div className="container-fluid" >
                                                        <div className="row">
                                                            <div className="col-xs-12 text-center pl-0 pr-0 data-wrap-left">
                                                                <span className="weight-500 uppercase-font block font-75 counter ">{this.state.dashboard_list.totalRevenuew ? parseFloat(this.state.dashboard_list.totalRevenuew * this.state.MatictoUsdPrice).toFixed(2) : '0.00'}</span>
                                                                <span className="weight-500 uppercase-font block font-13 ">Total Revenue(IN USD)</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>                                

                                <div className="col-lg-3 box-counter col-md-6 col-sm-6 col-xs-12">
                                    <div className="panel panel-default card-view pa-0">
                                        <div className="panel-wrapper collapse in">
                                            <div className="panel-body pa-0">
                                                <div className="sm-data-box">
                                                    <div className="container-fluid" >
                                                        <div className="row">
                                                            <div className="col-xs-12 text-center pl-0 pr-0 data-wrap-left">
                                                                <span className="weight-500 uppercase-font block font-75 counter ">{this.state.dashboard_list.totalRoyalties ? this.state.dashboard_list.totalRoyalties : '0.000000'} MATIC</span>
                                                                <span className="weight-500 uppercase-font block font-13 ">Total Royalties Paid</span>
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
                        <Footer />
                    </div>
                </div>
            </>
        )
    }
}
import React, { Component } from 'react';
import config from '../config/config'
export default class Leftsidebar extends Component {

    constructor(props) {
        super(props)

    }

    componentDidMount() {


    }


    render() {

        return (
            <div className="fixed-sidebar-left mobileLeftShow">
                <ul className="nav navbar-nav side-nav nicescroll-bar">
                    <li className="navigation-header">
                        <span>Main</span>

                        <i className="zmdi zmdi-more"></i>
                    </li>

                    <li>
                        <a href={`${config.baseUrl}dashboard`}><div className="pull-left"><i className="zmdi zmdi-view-dashboard mr-20"></i><span className="right-nav-text">Dashboard</span></div><div className="pull-right"><i ></i></div><div className="clearfix"></div></a>

                    </li>
                    
                    <li>
                        <a href={`${config.baseUrl}users`}><div className="pull-left"><i className="zmdi zmdi-account mr-20"></i><span className="right-nav-text">Users</span></div><div className="pull-right"><i ></i></div><div className="clearfix"></div></a>

                    </li>

                    <li>
                        <a href={`${config.baseUrl}usercollection`}><div className="pull-left"><i className="zmdi zmdi-accounts mr-20"></i><span className="right-nav-text">User Collections</span></div><div className="pull-right"><i ></i></div><div className="clearfix"></div></a>

                    </li>
                    <li>
                        <a href={`${config.baseUrl}myCollection`}><div className="pull-left"><i className="zmdi zmdi-accounts mr-20"></i><span className="right-nav-text">Admin Collections</span></div><div className="pull-right"><i ></i></div><div className="clearfix"></div></a>

                    </li>
                    <li>
                        <a href={`${config.baseUrl}product`}><div className="pull-left"><i className="zmdi  zmdi-toys mr-20"></i><span className="right-nav-text">User NFTs</span></div><div className="pull-right"><i ></i></div><div className="clearfix"></div></a>

                    </li>
                    <li>
                        <a href={`${config.baseUrl}adminnft`}><div className="pull-left"><i className="zmdi zmdi-toys mr-20"></i><span className="right-nav-text">Admin NFTs</span></div><div className="pull-right"><i ></i></div><div className="clearfix"></div></a>

                    </li>

                    {/* <li>
                        <a href={`${config.baseUrl}bulkNFT`}><div className="pull-left"><i class="zmdi zmdi-widgets mr-20"></i><span className="right-nav-text">Bulk NFTs</span></div><div className="pull-right"><i ></i></div><div className="clearfix"></div></a>

                    </li> */}
                    <li>
                        <a href={`${config.baseUrl}categoryList`}><div className="pull-left"><i className="zmdi zmdi-collection-image mr-20"></i><span className="right-nav-text">Category</span></div><div className="pull-right"><i ></i></div><div className="clearfix"></div></a>

                    </li>

                    {/* <li>
                        <a href={`${config.baseUrl}gamescategory`}><div className="pull-left"><i class="zmdi zmdi-gamepad mr-20"></i><span className="right-nav-text">Games Category</span></div><div className="pull-right"><i ></i></div><div className="clearfix"></div></a>

                    </li> */}


                    <li>
                        <a href={`${config.baseUrl}transaction`}><div className="pull-left"><i class="zmdi zmdi-refresh-sync mr-20"></i><span className="right-nav-text">Transaction</span></div><div className="pull-right"><i ></i></div><div className="clearfix"></div></a>

                    </li>

                    <li>
                        <a href={`${config.baseUrl}adminorder`}><div className="pull-left"><i class="zmdi zmdi-refresh-sync mr-20"></i><span className="right-nav-text">orders</span></div><div className="pull-right"><i ></i></div><div className="clearfix"></div></a>

                    </li>
{/* 
                     <li>
                        <a href={`${config.baseUrl}wallet`}><div className="pull-left"><i className="zmdi zmdi-balance-wallet mr-20"></i><span className="right-nav-text">Wallet Setting</span></div><div className="pull-right"><i ></i></div><div className="clearfix"></div></a>

                    </li> */}
                    <li>
                        <a href={`${config.baseUrl}feessetting`}><div className="pull-left"><i class="zmdi zmdi-money-box mr-20"></i><span className="right-nav-text">Fees Setting</span></div><div className="pull-right"><i></i></div><div className="clearfix"></div></a>

                    </li>
                   {/* <li>
                        <a href={`${config.baseUrl}transactionfees`}><div className="pull-left"><i class="zmdi zmdi-arrows mr-20"></i><span className="right-nav-text">Transaction Fees</span></div><div className="pull-right"><i></i></div><div className="clearfix"></div></a>

                    </li> */}

                    <li>
                        <a href={`${config.baseUrl}support`}><div className="pull-left"><i class="zmdi zmdi-pin-help mr-20"></i><span className="right-nav-text">Support</span></div><div className="pull-right"><i ></i></div><div className="clearfix"></div></a>

                    </li>
                    <li>
                        <a href={`${config.baseUrl}contact`}><div className="pull-left"><i className="zmdi  zmdi-accounts-list mr-20"></i><span className="right-nav-text">Contact Us</span></div><div className="pull-right"><i ></i></div><div className="clearfix"></div></a>

                    </li>
                    <li>
                        <a href="javascript:void(0);" disabled data-toggle="collapse" data-target="#app_dr" class="collapsed" aria-expanded="false"><span className=""> <i class="zmdi zmdi-layers mr-20"></i> Website Content <i class="zmdi zmdi-chevron-down zmdi-hc-fw mr-20" style={{ float: "right", marginTop: "3px" }}></i></span></a>



                        <ul id="app_dr" class="collapse collapse-level-1" aria-expanded="false">

                            <li className="">
                                <a href={`${config.baseUrl}privacyAndPolicy`} class="dropdown-item waves-light waves-effect">

                                    <span className="pcoded-micon"><i class="zmdi zmdi-format-list-bulleted mr-20"></i></span>
                                    <span className="pcoded-mtext">  Privacy Policy</span>
                                    <span className="pcoded-mcaret"></span>
                                </a>

                            </li>

                            <li className="">
                                <a href={`${config.baseUrl}termsAndCondition`} class="dropdown-item waves-light waves-effect">
                                    <span className="pcoded-micon"><i class="zmdi zmdi-format-indent-increase mr-20"></i></span>
                                    <span className="pcoded-mtext">  Terms & condition</span>
                                    <span className="pcoded-mcaret"></span>
                                </a>
                            </li>

                            {/* <li className="">
                                <a href={`${config.baseUrl}about`} class="dropdown-item waves-light waves-effect">
                                    <span className="pcoded-micon"><i class="zmdi zmdi-spinner mr-20"></i></span>
                                    <span className="pcoded-mtext"> About</span>
                                    <span className="pcoded-mcaret"></span>
                                </a>
                            </li> */}
                        </ul>

                    </li>
                    {/* <li>
                    <a href={`${config.baseUrl}royalty`}><div className="pull-left"><i className="zmdi zmdi-balance-wallet mr-20"></i><span className="right-nav-text">Royalty Setting</span></div><div className="pull-right"><i ></i></div><div className="clearfix"></div></a>

					</li> */}
                </ul>
            </div>
        )

    }
}
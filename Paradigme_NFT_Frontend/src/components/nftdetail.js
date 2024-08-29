import React, { Component } from 'react';
import Header from '../directives/header'
import Footer from '../directives/footer'
import Modal from 'react-awesome-modal';

export default class nftdetail extends Component {
    constructor(props) {
        super(props)
       
        this.state = {
           visible : false
          
  
        }
       
        
  
     }
     


    componentDidMount() {

    }
    openModal() {
        this.setState({
            visible : true
        });
     }
     
     closeModal() {
        this.setState({
            visible : false
        });
     }

    render() {
        return (

            <>
                <Header />

                <div id="content-block" className='mt-0'>

                    <div className="breadcrumb-wrap bg-f br-3">
                        <div className="overlay bg-black op-7" />
                        <div className="container">
                            <div className="breadcrumb-title">
                                <h2>NFT Details</h2>
                                {/* <ul className="breadcrumb-menu list-style">
                                    <li>
                                        <a href="index.html">Home </a>
                                    </li>
                                    <li>NFT Details</li>
                                </ul> */}
                            </div>
                        </div>
                    </div>
                    <section className="recent-nfts ptb-60 ">
                        <div className="container-fluid custom-container">
                            <div className="Toastify" />

                            <div className="container">
                                <div className="row">
                                    <div className='col-md-6'>
                                        <img src='images/single-auction-item.jpg' width="100%" />

                                    </div>
                                    <div className='col-md-6'>
                                        <div className="item_info">
                                            <h2 className="">Hamlet Contemplates</h2>
                                            <div className="item_info_counts">
                                                <div className="item_info_type">
                                                    <i className="fa fa-image" />
                                                    HC
                                                </div>
                                                <div className="item_info_views">
                                                    <i className="fa fa-eye" />
                                                    13
                                                </div>
                                                <div className="item_info_like">
                                                    <i
                                                        className="fa fa-heart"
                                                        style={{ color: "rgb(221, 221, 221)", cursor: "pointer" }}
                                                    />
                                                    0
                                                </div>
                                            </div>
                                            <p>a</p>
                                            <div className="row mt-4">
                                                <div className="col-lg-4 col-md-4">
                                                    <h6>Creator</h6>
                                                    <a href="javascript:void(0);">
                                                        <div className="item_author">
                                                            <div className="author_list_pp">
                                                                <img
                                                                    className="lazy"
                                                                    src="images/author-8.jpg"
                                                                />
                                                            </div>
                                                            <div className="author_list_info">Madruguinha</div>
                                                        </div>
                                                    </a>
                                                </div>
                                                <div className="col-lg-4 col-md-4 mt-xs-3">
                                                    <h6>Owner</h6>
                                                    <a href="javascript:void(0);">
                                                        <div className="item_author">
                                                            <div className="author_list_pp">
                                                                <img
                                                                    className="lazy"
                                                                    src="images/author-7.jpg"
                                                                />
                                                            </div>
                                                            <div className="author_list_info">Madruguinha</div>
                                                        </div>
                                                    </a>
                                                </div>
                                                <div className="col-lg-4 col-md-4 mt-xs-3">
                                                    <h6>Collection</h6>
                                                    <a href="javascript:void(0);">
                                                        <div className="item_author">
                                                            <div className="author_list_pp">
                                                                <img
                                                                    className="lazy"
                                                                    src="images/author-6.jpg"
                                                                />
                                                            </div>
                                                            <div className="author_list_info">JB</div>
                                                        </div>
                                                    </a>
                                                </div>
                                            </div>
                                            <div className="spacer-40" />
                                            <div className="de_tab tab_simple">
                                                <br />
                                                <div className="spacer-10" />
                                                <h6 className='mb-0 mt-5'>Price</h6>
                                                <div className="nft-item-price">
                                                    <img src="images/bnb-icon.png" />
                                                    <span>0.5</span>($990.75)
                                                </div>
                                                <a
                                                    href="javascript:void(0);"
                                                    data-bs-toggle="modal"
                                                    data-bs-target="#walletModel"
                                                    onClick={() => this.openModal()}
                                                >
                                                    <button className="btn btn-main btn-lg mb-3" >Buy now</button>
                                                </a>
                                                &nbsp;&nbsp;
                                                <a
                                                    href="javascript:void(0);"

                                                >
                                                    <button className="btn btn-main btn-lg mb-3">Blockchain View</button>
                                                </a>
                                            </div>
                                        </div>


                                    </div>
                                </div>
                            </div>

                        </div>
                    </section>
                    <section className='listdetail mb-5'>
                        <div className='container'>
                            <div className='row'>
                            <div className='col-md-12'>
                                <div class="table-responsive">
                                    <table class="table " width="100%">
                                        <thead>
                                            <tr>
                                                <th>#</th>
                                                <th>Event</th>
                                                <th>Price</th>
                                                <th>From</th>
                                                <th>Address</th>
                                                <th>Date</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td>1</td>
                                                <td>List</td>
                                                <td>0.01 BNB</td>
                                                <td><a href="javascript:void(0);">Madruguinha</a></td>
                                                <td>
                                                    <a  href="javascript:void(0);">
                                                        <p title="0x5f7a20e84d48e8e8da2d10e80782fdd90eec2275">0x5f7a20...0eec2275</p>
                                                    </a>
                                                </td>
                                                <td>13-05-2022 11:10:32</td>
                                            </tr>
                                            <tr>
                                                <td>2</td>
                                                <td>Minted</td>
                                                <td></td>
                                                <td><a href="javascript:void(0);">Madruguinha</a></td>
                                                <td>
                                                    <a  href="javascript:void(0);">
                                                        <p title="0x5f7a20e84d48e8e8da2d10e80782fdd90eec2275">0x5f7a20...0eec2275</p>
                                                    </a>
                                                </td>
                                                <td>13-05-2022 11:08:43</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                    
                                </div>


                            </div>
                            </div>

                        </div>
                    </section>
                    <br/><br/>

                </div>
                <Modal visible={this.state.visible} width="400"  effect="fadeInUp" onClickAway={() => this.closeModal()}>
                    <div className='header_modal connect_wallet'>
                       <div className='modal-header text-right'> 
                             <button  className='close' onClick={() => this.closeModal()}><span>x</span></button>
                        </div>
                        <div className='modal-body'> 
                             <h1 class="ant-typography title">Connect Wallet</h1>
                             <p class="desc">Please connect your wallet to continue. The system supports the following wallets</p>
                             <br/>
                             <button type="button" class="ant-btn btn">
                             <img class="btn__icon-logo" src="images/coinbase.svg"/>
                                <span>Coin  Base</span>
                                <img class="btn__icon-right" src="images/right_arrow.svg"/>
                              </button>
                             {/* <button type="button" class="ant-btn btn">
                                <img class="btn__icon-logo" src="images/torus.png"/>
                                <span>Torus</span>
                                <img class="btn__icon-right" src="images/right_arrow.svg"/>
                             </button> */}
                             {/* <button type="button" class="ant-btn btn">
                                <img class="btn__icon-logo" src="images/coinbase.svg"/>
                                <span>Coinbase Wallet</span>
                                <img class="btn__icon-right" src="images/right_arrow.svg"/>
                              </button> */}
                            
                        </div>
                        
                    </div>

                </Modal>  



                <Footer />

            </>
        )
    }
}
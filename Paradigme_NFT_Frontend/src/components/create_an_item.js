import React, { Component } from 'react';
import Header from '../directives/header'
import Footer from '../directives/footer'
import Modal from 'react-awesome-modal';


export default class nftdetail extends Component {
    constructor(props) {
        super(props)

        this.state = {
            visible: false

        }


    }


    componentDidMount() {

    }
    openModal() {
        this.setState({
            visible: true
        });
    }

    closeModal() {
        this.setState({
            visible: false
        });
    }


    render() {
        return (

            <>
                <Header />


                <div id="content-block" className=''>

                    <div className="breadcrumb-wrap bg-f br-3">
                        <div className="overlay bg-black op-7" />
                        <div className="container">
                            <div className="breadcrumb-title">
                                <h2>Mint An NFT</h2>
                                    {/* <ul className="breadcrumb-menu list-style">
                                        <li>
                                            <a href="index.html">Home </a>
                                        </li>
                                        <li>Mint An NFT</li>
                                    </ul> */}
                            </div>
                        </div>
                    </div>
                    <section className="recent-nfts ptb-60 mt-0 ">
                        <div className="container-fluid custom-container">
                            <div className="Toastify" />

                                    
                            <div className="container">
                                <div className="row">
                                    <div className="col-xs-12 col-md-12 _editor-content_">
                                        <div className="sec" data-sec="basic-information">
                                            <div className="">

                                                <div className="be-large-post-align">
                                                    <div className="be-change-ava">
                                                        <div className='row'>
                                                            <div className='col-sm-12'>
                                                                <h5>Upload file</h5>
                                                            </div>

                                                            <div className="col-sm-3 col-xs-6 ">
                                                                <div className='form-label' style={{fontSize:"13px"}}>File types supported: PNG, JPG, GIF or WEBP</div>
                                                                <div className="d-create-file" >
                                                                    <input
                                                                        type="button"
                                                                        id="get_file"
                                                                        className="btn-main"
                                                                        defaultValue="Browse"
                                                                    />
                                                                    <input
                                                                        type="file"
                                                                        accept=".png,.jpg,.gif,.webo,.mp4"
                                                                        id="upload_file"
                                                                        name="image"
                                                                    />
                                                                </div>
                                                                <span className="error-asterick"> </span>
                                                            </div>
                                                            <div className="col-sm-8 ">

                                                            </div>
                                                        </div>

                                                        {/* <a className="be-ava-user style-2" href="#">
                                                            <img src="images/author-item-1.jpg" alt="" />
                                                        </a> */}
                                                        {/* <a className="btn color-4 size-2 hover-7"></a> */}
                                                    </div>
                                                </div>
                                                <div className="be-large-post-align">
                                                    <div className="row">
                                                        <div className="input-col col-xs-12 col-sm-12">
                                                            <div className="form-group fg_icon focus-2">
                                                                <div className="form-label">Title</div>
                                                                <input className="form-input" type="text" defaultValue="Taylor" />
                                                            </div>
                                                        </div>
                                                        <div className="input-col col-xs-12 col-sm-12">
                                                            <div className="form-group focus-2">
                                                                <div className="form-label">Description</div>
                                                                <textarea className='form-input'>dffsdfdsfdfs</textarea>

                                                            </div>
                                                        </div>

                                                        <div className="input-col col-xs-12">
                                                            <div className="form-group focus-2">
                                                                <div className='row'>
                                                                    <div className='col-sm-6'>
                                                                        <div className="form-label">Collection</div>

                                                                    </div>
                                                                    <div className='col-sm-6 text-right'>
                                                                        <button onClick={() => this.openModal()} className='btn-main style1 plusbtn'>Add&nbsp;&nbsp;<i className='fa fa-plus'></i></button>

                                                                    </div>

                                                                </div>

                                                                <select className=''>
                                                                    <option>Select Collection</option>

                                                                </select>
                                                            </div>
                                                        </div>
                                                        <div className="input-col col-xs-12 col-sm-12">
                                                            <div className='form-group'>
                                                                <div className="form-label">Categories</div>
                                                                <select className=''>
                                                                    <option>Select Category</option>
                                                                    <option>Art</option>
                                                                    <option>Music</option>

                                                                </select>
                                                            </div>

                                                        </div>
                                                        <div className="input-col col-xs-12">
                                                            <div className="form-group focus-2">
                                                                <div className="form-label">Price</div>
                                                                <input
                                                                    className="form-input"
                                                                    type="text"
                                                                    defaultValue=""
                                                                />
                                                            </div>
                                                        </div>
                                                        <div className="col-xs-12 col-sm-12">
                                                            <div className='sale_methode'>
                                                                <div className='form-label'>Select sale method</div>
                                                                <div className="tab-wrapper style-1">
                                                                    <div className="tab-nav-wrapper">
                                                                        <div className="nav-tab  clearfix">
                                                                            <div className="nav-tab-item active">

                                                                                <span><i class="fa fa-tag"></i><br /><br />Fixed Price</span>
                                                                            </div>
                                                                            <div className="nav-tab-item ">

                                                                                <span><i class="fa fa-hourglass-1"></i><br /><br />Time auction</span>
                                                                            </div>
                                                                            <div className="nav-tab-item ">
                                                                                <span><i class="fa fa-ban"></i><br /><br />Not Sale</span>
                                                                            </div>

                                                                        </div>
                                                                    </div>
                                                                    <div className="tabs-content clearfix">
                                                                        <div className="tab-info active">
                                                                            <div className='row'>
                                                                                <div className="input-col col-xs-12 col-sm-12 mb-5">
                                                                                    <div className="form-group fg_icon focus-2">
                                                                                        <div className="form-label">Price(INR)</div>
                                                                                        <input className="form-input" type="text" defaultValue="Taylor" />
                                                                                    </div>
                                                                                </div>


                                                                            </div>
                                                                        </div>
                                                                        <div className="tab-info">
                                                                            <div className='row'>
                                                                                <div className="input-col col-xs-12 col-sm-12">
                                                                                    <div className="form-group fg_icon focus-2">
                                                                                        <div className="form-label">Minimum bid(INR)</div>
                                                                                        <input className="form-input" type="text" defaultValue="Taylor" />
                                                                                    </div>
                                                                                </div>
                                                                                <div className="input-col col-xs-12 col-sm-6">
                                                                                    <div className="form-group fg_icon focus-2">
                                                                                        <div className="form-label">Starting date</div>
                                                                                        <input className="form-input" type="date" defaultValue="Taylor" />
                                                                                    </div>
                                                                                </div>
                                                                                <div className="input-col col-xs-12 col-sm-6">
                                                                                    <div className="form-group fg_icon focus-2">
                                                                                        <div className="form-label">Expiration date</div>
                                                                                        <input className="form-input" type="date" defaultValue="Taylor" />
                                                                                    </div>
                                                                                </div>

                                                                            </div>
                                                                        </div>
                                                                        <div className="tab-info">

                                                                        </div>

                                                                    </div>
                                                                </div>
                                                            </div>


                                                            {/* <div className="form-group focus-2">
                                                                <div className="form-label">Select Sale Methods</div>
                                                                <select className=''>
                                                                    <option>Fixed Price</option>
                                                                    <option>Timed Auction</option>
                                                                    <option>Not Sale</option>
                                                                    
                                                                </select>
                                                                
                                                            </div> */}
                                                        </div>

                                                        <div className='col-xs-12 text-left'>
                                                            <button className='btn-main pt-2 pb-2 style1'>Submit</button>

                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>


                                    </div>

                                </div>
                            </div>

                        </div>
                    </section>

                    <br /><br />

                </div>
                <Modal visible={this.state.visible} width="700" effect="fadeInUp" onClickAway={() => this.closeModal()}>
                    <div className='header_modal add_collection'>
                        <div className='modal-header d-flex'>
                            <div className='text-left'>
                                <h5 className='text-white'>Add Collections</h5>

                            </div>
                            <div className='text-right'>
                                <button className='close' onClick={() => this.closeModal()}><span>x</span></button>
                            </div>
                        </div>
                        <div className='modal-body text-left'>
                            <div className='row '>
                                <div className='col-sm-4'>
                                    <div className="form-label mb-3">Image</div>
                                    
                                    <div
                                        className=" mb-1  rounded-lg overflow-hidden relative "
                                       >
                                        <img
                                            className="object-cover w-full h-32"
                                            src="https://placehold.co/300x300/e2e8f0/e2e8f0"
                                            alt=""
                                            style={{ height: 150 }}
                                        />
                                        <div className="absolute top-0 left-0 right-0 bottom-0 w-full cursor-pointer flex items-center justify-center">
                                            <button type="button" className="btn-upload">
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    className="icon icon-tabler icon-tabler-camera"
                                                    width={24}
                                                    height={24}
                                                    viewBox="0 0 24 24"
                                                    strokeWidth={2}
                                                    stroke="currentColor"
                                                    fill="none"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                >
                                                    <rect x={0} y={0} width={24} height={24} stroke="none" />
                                                    <path d="M5 7h1a2 2 0 0 0 2 -2a1 1 0 0 1 1 -1h6a1 1 0 0 1 1 1a2 2 0 0 0 2 2h1a2 2 0 0 1 2 2v9a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2v-9a2 2 0 0 1 2 -2" />
                                                    <circle cx={12} cy={13} r={3} />
                                                </svg>
                                            </button>
                                        </div>
                                        <input
                                            name="cl_profile_pic"
                                            id="fileInput"
                                            accept="image/*"
                                            className=""
                                            type="file"
                                        />
                                    </div>


                                </div>
                                <div className='col-sm-8'>
                                   <div className="form-label mb-3">Cover Photo</div>
                                    
                                   
                                    <div
                                        className=" mb-1  rounded-lg overflow-hidden relative "
                                       >
                                        <img
                                            className="object-cover w-full h-32"
                                            src="https://placehold.co/300x300/e2e8f0/e2e8f0"
                                            alt=""
                                            style={{ height: 150 }}
                                        />
                                        <div className="absolute top-0 left-0 right-0 bottom-0 w-full cursor-pointer flex items-center justify-center">
                                            <button type="button" className="btn-upload">
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    className="icon icon-tabler icon-tabler-camera"
                                                    width={24}
                                                    height={24}
                                                    viewBox="0 0 24 24"
                                                    strokeWidth={2}
                                                    stroke="currentColor"
                                                    fill="none"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                >
                                                    <rect x={0} y={0} width={24} height={24} stroke="none" />
                                                    <path d="M5 7h1a2 2 0 0 0 2 -2a1 1 0 0 1 1 -1h6a1 1 0 0 1 1 1a2 2 0 0 0 2 2h1a2 2 0 0 1 2 2v9a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2v-9a2 2 0 0 1 2 -2" />
                                                    <circle cx={12} cy={13} r={3} />
                                                </svg>
                                            </button>
                                        </div>
                                        <input
                                            name="cl_profile_pic"
                                            id="fileInput"
                                            accept="image/*"
                                            className=""
                                            type="file"
                                        />
                                    </div>


                                </div>
                                <div className="input-col col-xs-12 col-sm-12 mt-3">
                                    <div className="form-group fg_icon focus-2">
                                        <div className="form-label">Name</div>
                                        <input className="form-control" type="text" placeholder='e.g. CryptoFunk' />
                                    </div>
                                </div>
                                <div className="input-col col-xs-12 col-sm-12">
                                    <div className="form-group fg_icon focus-2">
                                        <div className="form-label">Description</div>
                                        <input className="form-control" type="text" placeholder='e.g. This is very limited item' />
                                    </div>
                                </div>
                                <div className="input-col col-xs-12 col-sm-12">
                                    <div className="form-group fg_icon focus-2">
                                        <div className="form-label">Website Link</div>
                                        <input className="form-control" type="text" placeholder='e.g. https://example.com' />
                                    </div>
                                </div>
                                <div className='col-sm-12'>
                                    <div className='social-icons mt-1'>
                                        <div className='form-label'>Link social media</div>

                                        <div
                                            className="social-input form-group focus-2"
                                        >
                                            <div className="s_icon" >
                                                <i className="fa fa-facebook" />
                                            </div>
                                            <div className="s_input" >
                                                <input
                                                    className="form-control"
                                                    type="text"
                                                    name="facebook"
                                                    placeholder="e.g. https://example.com"
                                                    defaultValue=""
                                                />
                                            </div>
                                        </div>
                                        <div
                                            className="social-input form-group focus-2"
                                        >
                                            <div className="s_icon" >
                                                <i className="fa fa-twitter" />
                                            </div>
                                            <div className="s_input" >
                                                <input
                                                    className="form-control"
                                                    type="text"
                                                    name="twitter"
                                                    placeholder="e.g. https://example.com"
                                                    defaultValue=""
                                                />
                                            </div>
                                        </div>
                                        <div
                                            className="social-input form-group focus-2"
                                        >
                                            <div className="s_icon" >
                                                <i className="fa fa-telegram" />
                                            </div>
                                            <div className="s_input" >
                                                <input
                                                    className="form-control"
                                                    type="text"
                                                    name="telegram"
                                                    placeholder="e.g. https://example.com"
                                                    defaultValue=""
                                                />
                                            </div>
                                        </div>
                                        <div
                                            className="social-input form-group focus-2"
                                        >
                                            <div className="s_icon" >
                                                <i className="fa fa-instagram" />
                                            </div>
                                            <div className="s_input" >
                                                <input
                                                    className="form-control"
                                                    type="text"
                                                    name="insta"
                                                    placeholder="e.g. https://example.com"
                                                    defaultValue=""
                                                />
                                            </div>
                                        </div>
                                        <div
                                            className="social-input form-group focus-2"
                                        >
                                            <div className="s_icon" >
                                                <div className="discord-img" >
                                                    <img src="images/discord.png" />
                                                </div>
                                            </div>
                                            <div className="s_input" >
                                                <input
                                                    className="form-control"
                                                    type="text"
                                                    name="discord"
                                                    placeholder="e.g. https://example.com"
                                                    defaultValue=""
                                                />
                                            </div>
                                        </div>
                                        <div className="socail_news mt-4" >
                                            <button id="submit" className="btn-main pt-2 pb-2" type="submit">
                                                Create Collection
                                            </button>
                                        </div>



                                    </div>

                                </div>

                            </div>


                        </div>

                    </div>

                </Modal>



                <Footer />

            </>
        )
    }
}
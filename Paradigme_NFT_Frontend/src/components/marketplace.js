import React, { Component } from 'react';
import Header from '../directives/header'
import Footer from '../directives/footer'

export default class marketplace extends Component {


    componentDidMount() {

    }

    render() {
        return (

            <>
                <Header />

                <div id="content-block" className='mt-0'>

                    <div className="breadcrumb-wrap bg-f br-1">
                        {/* <div className="overlay bg-black op-7" /> */}
                        <div className="container">
                            <div className="breadcrumb-title">
                                <h2>Marketplace</h2>
                                {/* <ul className="breadcrumb-menu list-style">
                                    <li>
                                        <a href="index.html">Home </a>
                                    </li>
                                    <li>Marketplace</li>
                                </ul> */}
                            </div>
                        </div>
                    </div>
                    <section className="recent-nfts ptb-60 ">
                        <div className="container-fluid custom-container">
                            <div className="Toastify" />

                            <div className="container">
                                <div className="row">
                                    <div className='col-md-12'>
                                        <div className="row mb-3" >
                                            <div className="col-xl-2 col-lg-2 col-md-4 col-sm-4 col-xs-12  ">
                                                    <div className="search-box">
                                                        <div className="form-group">
                                                        <label class="input-label">Search</label>
                                                            <input type="search" placeholder="Search" />
                                                            <button type="submit">
                                                            <i className="fa fa-search" />
                                                            </button>
                                                        </div>
                                                    </div>

                                                
                                            </div>
                                            <div className="col-xl-2 col-lg-2 col-md-4 col-sm-4 col-xs-12  ">
                                                    <div className="form-group">
                                                    <label class="input-label">Status</label>
                                                        <select class="">
                                                            <option value="0">Status</option>
                                                            <option value="1">Buy Now</option>
                                                            <option value="2">Auction</option>
                                                        </select>
                                                        
                                                    </div>

                                               
                                            </div>
                                            <div className="col-xl-2 col-lg-2 col-md-4 col-sm-4 col-xs-12  ">
                                                    <div className="form-group">
                                                    <label class="input-label">Sort by</label>
                                                        <select class="">
                                                            <option value="All">Price</option>
                                                            <option value="Lowtohigh">Price: Low to High</option>
                                                            <option value="Hightolow">Price: High to Low</option>
                                                            <option value="newest">Newest</option>
                                                            <option value="oldest">Oldest</option>
                                                        </select>
                                                    </div>
                                                
                                            </div>
                                            <div
                                                className="col-xl-2 col-lg-2 col-md-4 col-sm-4 col-xs-12 ">
                                                    <div className="form-group">
                                                    <label class="input-label">Collection</label>
                                                    <select class="">
                                                            <option value="0">Collection</option>
                                                            <option value='1'>JB</option>
                                                            <option value='2'>CREYZIES</option>
                                                            <option value='3'>Tarsi</option>
                                                            <option value='4'>buiding</option>
                                                            <option value='5'>Reso</option>
                                                           
                                                        </select>

                                                    </div>
                                                
                                            </div>
                                            <div className="col-xl-2 col-lg-2 col-md-4 col-sm-4 col-xs-12  ">
                                                    <div className="form-group">
                                                    <label class="input-label">Category</label>
                                                    <select className="">
                                                        <option value='0'>Category</option>
                                                        <option value='1'>Art</option>
                                                        <option value='2'> Collectibles</option>
                                                        <option value='3'>Photography</option>
                                                        <option value='4'>Sports</option>
                                                        <option value='5'>Utility</option>
                                                    </select>

                                                    </div>
                                                
                                            </div>
                                            <div className="col-xl-2 col-lg-2 col-md-4 col-sm-4 col-xs-12  ">
                                                    <label class="input-label">&nbsp;</label>
                                                    <button className='btn-main style1 w-100'>Reset</button>
                                                
                                            </div>
                                        </div>


                                    </div>
                                    <div className="col-md-12">
                                        <br />
                                        <div className="row _post-container_">
                                            <div className='col-md-4 col-sm-6 mb-5'>
                                                <div className="auction-card">
                                                    <div className="auction-img">
                                                        <img src="images/auction-item-5.jpg" alt="Image" />
                                                    </div>
                                                    <div className="auction-info-wrap">
                                                        <div className="auction-author-info">
                                                            <div className="author-info">
                                                                <div className="author-img">
                                                                    <img src="images/author-8.jpg" alt="Image" />
                                                                </div>
                                                                <div className="author-name">
                                                                    <h6>
                                                                        <a href="#">Mash Haris</a>
                                                                    </h6>
                                                                </div>
                                                            </div>
                                                            <div className="auction-bid">
                                                                <span className="item-popularity">
                                                                    <i className="flaticon-heart" />
                                                                    1.2k
                                                                </span>
                                                            </div>
                                                        </div>
                                                        <div className="auction-stock">
                                                            <p>10 In Stock</p>
                                                            <h6>3.45 ETH</h6>
                                                        </div>
                                                        <div className="auction-title">
                                                            <h3>
                                                                <a href="#">Liquid Forest Princes</a>
                                                            </h3>
                                                        </div>

                                                    </div>
                                                </div>


                                            </div>
                                            <div className='col-md-4 col-sm-6 mb-5'>
                                                <div className="auction-card">
                                                    <div className="auction-img">
                                                        <img src="images/auction-item-6.jpg" alt="Image" />
                                                    </div>
                                                    <div className="auction-info-wrap">
                                                        <div className="auction-author-info">
                                                            <div className="author-info">
                                                                <div className="author-img">
                                                                    <img src="images/author-8.jpg" alt="Image" />
                                                                </div>
                                                                <div className="author-name">
                                                                    <h6>
                                                                        <a href="#">Mash Haris</a>
                                                                    </h6>
                                                                </div>
                                                            </div>
                                                            <div className="auction-bid">
                                                                <span className="item-popularity">
                                                                    <i className="flaticon-heart" />
                                                                    1.2k
                                                                </span>
                                                            </div>
                                                        </div>
                                                        <div className="auction-stock">
                                                            <p>10 In Stock</p>
                                                            <h6>3.45 ETH</h6>
                                                        </div>
                                                        <div className="auction-title">
                                                            <h3>
                                                                <a href="#">Dodo Hide &amp; Seek</a>
                                                            </h3>
                                                        </div>

                                                    </div>
                                                </div>

                                            </div>
                                            <div className='col-md-4 col-sm-6 mb-5'>
                                                <div className="auction-card">
                                                    <div className="auction-img">
                                                        <img src="images/auction-item-7.jpg" alt="Image" />
                                                    </div>
                                                    <div className="auction-info-wrap">
                                                        <div className="auction-author-info">
                                                            <div className="author-info">
                                                                <div className="author-img">
                                                                    <img src="images/author-8.jpg" alt="Image" />
                                                                </div>
                                                                <div className="author-name">
                                                                    <h6>
                                                                        <a href="#">Mash Haris</a>
                                                                    </h6>
                                                                </div>
                                                            </div>
                                                            <div className="auction-bid">
                                                                <span className="item-popularity">
                                                                    <i className="flaticon-heart" />
                                                                    1.2k
                                                                </span>
                                                            </div>
                                                        </div>
                                                        <div className="auction-stock">
                                                            <p>10 In Stock</p>
                                                            <h6>3.45 ETH</h6>
                                                        </div>
                                                        <div className="auction-title">
                                                            <h3>
                                                                <a href="#">Spider Eyes Art</a>
                                                            </h3>
                                                        </div>

                                                    </div>
                                                </div>

                                            </div>
                                            <div className='col-md-4 col-sm-6 mb-5'>
                                                <div className="auction-card">
                                                    <div className="auction-img">
                                                        <img src="images/auction-item-5.jpg" alt="Image" />
                                                    </div>
                                                    <div className="auction-info-wrap">
                                                        <div className="auction-author-info">
                                                            <div className="author-info">
                                                                <div className="author-img">
                                                                    <img src="images/author-8.jpg" alt="Image" />
                                                                </div>
                                                                <div className="author-name">
                                                                    <h6>
                                                                        <a href="#">Mash Haris</a>
                                                                    </h6>
                                                                </div>
                                                            </div>
                                                            <div className="auction-bid">
                                                                <span className="item-popularity">
                                                                    <i className="flaticon-heart" />
                                                                    1.2k
                                                                </span>
                                                            </div>
                                                        </div>
                                                        <div className="auction-stock">
                                                            <p>10 In Stock</p>
                                                            <h6>3.45 ETH</h6>
                                                        </div>
                                                        <div className="auction-title">
                                                            <h3>
                                                                <a href="#">Liquid Forest Princes</a>
                                                            </h3>
                                                        </div>

                                                    </div>
                                                </div>


                                            </div>
                                            <div className='col-md-4 col-sm-6 mb-5'>
                                                <div className="auction-card">
                                                    <div className="auction-img">
                                                        <img src="images/auction-item-6.jpg" alt="Image" />
                                                    </div>
                                                    <div className="auction-info-wrap">
                                                        <div className="auction-author-info">
                                                            <div className="author-info">
                                                                <div className="author-img">
                                                                    <img src="images/author-8.jpg" alt="Image" />
                                                                </div>
                                                                <div className="author-name">
                                                                    <h6>
                                                                        <a href="#">Mash Haris</a>
                                                                    </h6>
                                                                </div>
                                                            </div>
                                                            <div className="auction-bid">
                                                                <span className="item-popularity">
                                                                    <i className="flaticon-heart" />
                                                                    1.2k
                                                                </span>
                                                            </div>
                                                        </div>
                                                        <div className="auction-stock">
                                                            <p>10 In Stock</p>
                                                            <h6>3.45 ETH</h6>
                                                        </div>
                                                        <div className="auction-title">
                                                            <h3>
                                                                <a href="#">Dodo Hide &amp; Seek</a>
                                                            </h3>
                                                        </div>

                                                    </div>
                                                </div>

                                            </div>
                                            <div className='col-md-4 col-sm-6 mb-5'>
                                                <div className="auction-card">
                                                    <div className="auction-img">
                                                        <img src="images/auction-item-7.jpg" alt="Image" />
                                                    </div>
                                                    <div className="auction-info-wrap">
                                                        <div className="auction-author-info">
                                                            <div className="author-info">
                                                                <div className="author-img">
                                                                    <img src="images/author-8.jpg" alt="Image" />
                                                                </div>
                                                                <div className="author-name">
                                                                    <h6>
                                                                        <a href="#">Mash Haris</a>
                                                                    </h6>
                                                                </div>
                                                            </div>
                                                            <div className="auction-bid">
                                                                <span className="item-popularity">
                                                                    <i className="flaticon-heart" />
                                                                    1.2k
                                                                </span>
                                                            </div>
                                                        </div>
                                                        <div className="auction-stock">
                                                            <p>10 In Stock</p>
                                                            <h6>3.45 ETH</h6>
                                                        </div>
                                                        <div className="auction-title">
                                                            <h3>
                                                                <a href="#">Spider Eyes Art</a>
                                                            </h3>
                                                        </div>

                                                    </div>
                                                </div>

                                            </div>
                                            <div className='col-md-4 col-sm-6 mb-5'>
                                                <div className="auction-card">
                                                    <div className="auction-img">
                                                        <img src="images/auction-item-5.jpg" alt="Image" />
                                                    </div>
                                                    <div className="auction-info-wrap">
                                                        <div className="auction-author-info">
                                                            <div className="author-info">
                                                                <div className="author-img">
                                                                    <img src="images/author-8.jpg" alt="Image" />
                                                                </div>
                                                                <div className="author-name">
                                                                    <h6>
                                                                        <a href="#">Mash Haris</a>
                                                                    </h6>
                                                                </div>
                                                            </div>
                                                            <div className="auction-bid">
                                                                <span className="item-popularity">
                                                                    <i className="flaticon-heart" />
                                                                    1.2k
                                                                </span>
                                                            </div>
                                                        </div>
                                                        <div className="auction-stock">
                                                            <p>10 In Stock</p>
                                                            <h6>3.45 ETH</h6>
                                                        </div>
                                                        <div className="auction-title">
                                                            <h3>
                                                                <a href="#">Liquid Forest Princes</a>
                                                            </h3>
                                                        </div>

                                                    </div>
                                                </div>


                                            </div>
                                            <div className='col-md-4 col-sm-6 mb-5'>
                                                <div className="auction-card">
                                                    <div className="auction-img">
                                                        <img src="images/auction-item-6.jpg" alt="Image" />
                                                    </div>
                                                    <div className="auction-info-wrap">
                                                        <div className="auction-author-info">
                                                            <div className="author-info">
                                                                <div className="author-img">
                                                                    <img src="images/author-8.jpg" alt="Image" />
                                                                </div>
                                                                <div className="author-name">
                                                                    <h6>
                                                                        <a href="#">Mash Haris</a>
                                                                    </h6>
                                                                </div>
                                                            </div>
                                                            <div className="auction-bid">
                                                                <span className="item-popularity">
                                                                    <i className="flaticon-heart" />
                                                                    1.2k
                                                                </span>
                                                            </div>
                                                        </div>
                                                        <div className="auction-stock">
                                                            <p>10 In Stock</p>
                                                            <h6>3.45 ETH</h6>
                                                        </div>
                                                        <div className="auction-title">
                                                            <h3>
                                                                <a href="#">Dodo Hide &amp; Seek</a>
                                                            </h3>
                                                        </div>

                                                    </div>
                                                </div>

                                            </div>
                                            <div className='col-md-4 col-sm-6 mb-5'>
                                                <div className="auction-card">
                                                    <div className="auction-img">
                                                        <img src="images/auction-item-7.jpg" alt="Image" />
                                                    </div>
                                                    <div className="auction-info-wrap">
                                                        <div className="auction-author-info">
                                                            <div className="author-info">
                                                                <div className="author-img">
                                                                    <img src="images/author-8.jpg" alt="Image" />
                                                                </div>
                                                                <div className="author-name">
                                                                    <h6>
                                                                        <a href="#">Mash Haris</a>
                                                                    </h6>
                                                                </div>
                                                            </div>
                                                            <div className="auction-bid">
                                                                <span className="item-popularity">
                                                                    <i className="flaticon-heart" />
                                                                    1.2k
                                                                </span>
                                                            </div>
                                                        </div>
                                                        <div className="auction-stock">
                                                            <p>10 In Stock</p>
                                                            <h6>3.45 ETH</h6>
                                                        </div>
                                                        <div className="auction-title">
                                                            <h3>
                                                                <a href="#">Spider Eyes Art</a>
                                                            </h3>
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

                </div>



                <Footer />

            </>
        )
    }
}
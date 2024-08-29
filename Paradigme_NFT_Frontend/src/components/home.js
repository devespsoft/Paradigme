import React, { Component } from 'react';
import axios from 'axios';
import Header from '../directives/header'
import Footer from '../directives/footer'
import 'react-toastify/dist/ReactToastify.css';
import 'react-sticky-header/styles.css';
import StickyHeader from 'react-sticky-header';
import 'react-lazy-load-image-component/src/effects/blur.css';
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
// import Particles from 'react-particles-js';
const headers = {
    'Content-Type': 'application/json'
};
const btnFill = {
    background: 'linear-gradient(rgba(0,0,0,.7), rgba(0,0,0,.7)), url("images/main-bg.jpg")'
    // background:"linear-gradient(rgba(0,0,0,.7), rgba(0,0,0,.7))", `url("images/main-bg.jpg")`
}
export default class home extends Component {


    componentDidMount() {

    }

    render() {
        return (

            <>
                <Header />
              
                <div id="content-block" className='mt-0'>
                {/* <Particles /> */}
                    <section className="hero-wrap style2 ">
                  
                        {/* <img
                            src="images/shape-5.png"
                            alt="Image"
                            className="hero-shape-one bounce"
                        /> */}
                        <img
                            src="images/naptune.png"
                            alt="Image"
                            className="hero-shape-two rotate"
                        />
                        {/* <img
                            src="images/shape-1.png"
                            alt="Image"
                            className="hero-shape-three moveVertical"
                        /> */}
                        {/* <img
                            src="images/shape-4.png"
                            alt="Image"
                            className="hero-shape-four animationFramesTwo"
                        /> */}
                        {/* <img
                            src="images/shape-8.png"
                            alt="Image"
                            className="hero-shape-six bounce"
                        /> */}
                        {/* <img
                            src="images/hero-shape-10.png"
                            alt="Image"
                            className="hero-shape-seven moveHorizontal"
                        /> */}
                        {/* <img
                            src="images/hero-shape-11.png"
                            alt="Image"
                            className="hero-shape-eight"
                        /> */}
                        <div className="container" style={{padding:"85px 0"}}>
                            <div className="row gx-5 align-items-center">
                                {/* <div className="col-lg-6">
                                    <div className="hero-img-wrap">
                                        <img src="images/hero-img-new.png" alt="Image" className='rotateX' />
                                    </div>
                                </div> */}
                                <div className='col-lg-1'></div>
                                <div className="col-lg-10">
                                    <div
                                        className="hero-content">
                                        <h1

                                            className="aos-init"
                                        >
                                            Explore &amp; Sell Your Awesome NFTs Art
                                        </h1>
                                        <p

                                            className="aos-init"
                                        >
                                            Here are many variations of passages of Lorem Ipsum available but
                                            the new majority have suffer alteration in by injected humour or
                                            randomised words. Lorem ipsum dolor sit amet consectetur adipiscing
                                            elits sed aliquam.{" "}
                                        </p>
                                        <div
                                            className="hero-btn aos-init"

                                        >
                                            <a href="#" className="btn-main style1">
                                                Get Started
                                            </a>
                                            <a href="#" className="btn-main style2">
                                                Create NFT
                                            </a>
                                        </div>
                                    </div>
                                </div>
                                <div className='col-lg-1'></div>
                            </div>
                        </div>
                    </section>

                    <section className="recent-nfts ptb-60 ">
                        <div className="container-fluid custom-container">
                            <div className="Toastify" />

                            <div className="container">
                                <div className="row">
                                    <div className="col-md-6 col-xs-8">
                                        <h3>
                                            <strong>Trending NFT</strong>
                                        </h3>
                                    </div>
                                    <div className="col-md-6 col-xs-4 text-right">
                                        <div>
                                            <a href="#" style={{ color: "rgb(255, 255, 255)" }}>View all &nbsp;
                                                <i className="fa fa-angle-right" style={{ fontSize: 17 }} />
                                            </a>
                                        </div>
                                    </div>
                                    <div className="col-md-12">
                                        <br />
                                        <div className="row _post-container_">
                                            <div className='col-sm-4 mb-5'>
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
                                                        <button
                                                            type="button"
                                                            className="btn style5"
                                                            data-bs-toggle="modal"
                                                            data-bs-target="#placeBid"
                                                        >
                                                            Place Bid
                                                        </button>
                                                    </div>
                                                </div>


                                            </div>
                                            <div className='col-sm-4 mb-5'>
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
                                                        <button
                                                            type="button"
                                                            className="btn style5"
                                                            data-bs-toggle="modal"
                                                            data-bs-target="#placeBid"
                                                        >
                                                            Place Bid
                                                        </button>
                                                    </div>
                                                </div>

                                            </div>
                                            <div className='col-sm-4 mb-5'>
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
                                                        <button
                                                            type="button"
                                                            className="btn style5"
                                                            data-bs-toggle="modal"
                                                            data-bs-target="#placeBid"
                                                        >
                                                            Place Bid
                                                        </button>
                                                    </div>
                                                </div>

                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </section>
                    <section className="trending-collection  ptb-100">
                        <img src="images/shape-2.png" alt="Image" class="promo-shape-one" />
                        <img src="images/shape-1.png" alt="Image" class="promo-shape-two" />
                        <img src="images/section-shape-1.png" alt="Image" class="section-shape" />
                        <div className="container-fluid custom-container">
                            <div className="Toastify" />

                            <div className="container">
                                <div className="row">
                                    <div className="col-md-6 col-xs-8">
                                        <h3>
                                            <strong>Trending Collections</strong>
                                        </h3>
                                    </div>
                                    <div className="col-md-6 col-xs-4 text-right">
                                        <div>
                                            <a href="#" style={{ color: "rgb(255, 255, 255)" }}>View all &nbsp;
                                                <i className="fa fa-angle-right" style={{ fontSize: 17 }} />
                                            </a>
                                        </div>
                                    </div>
                                    <div className="col-md-12">
                                        <br />
                                        <div className="row _post-container_">

                                            <div className="col-lg-4 col-md-6 mb-5">
                                                <div className="auction-list box-hover-effect">
                                                    <div className="auction-img">
                                                        <a href="#">
                                                            <img src="images/author-item-1.jpg" />
                                                        </a>
                                                    </div>
                                                    <div className="chakra-stack css-1wdu7zf">
                                                        <div className="d-flex">
                                                            <div className="seaflightImage">
                                                                <div
                                                                    aria-label="Sea Flights"
                                                                    role="image"
                                                                    className="sea-img"
                                                                    style={{
                                                                        backgroundImage:
                                                                            'url("images/author-item-1.jpg")'
                                                                    }}
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="bottom">
                                                        <div className="chakra-stack css-1npz8pa">
                                                            <h3 className="chakra-text css-1yfa4pt mb-2">
                                                                <a href="#">Tumblr</a>
                                                            </h3>
                                                            <svg
                                                                viewBox="0 0 24 24"
                                                                focusable="false"
                                                                className="chakra-icon chakra-icon css-100vr6x"
                                                            >
                                                                <path d="" fill="currentColor" />
                                                            </svg>
                                                            <div className="css-17xejub" />
                                                        </div>
                                                        <div className="chakra-stack css-198f9j2">
                                                            <a
                                                                className="chakra-link chakra-linkbox__overlay css-1me1ekj"
                                                                href="#"
                                                            >
                                                                <div className="nftprofile">
                                                                    <div className="nftprodetail">
                                                                        <div className="proimage">
                                                                            <img src="images/author-8.jpg" />
                                                                        </div>
                                                                    </div>
                                                                    <div className="proheadname">Angie Plasty</div>
                                                                </div>
                                                            </a>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-lg-4 col-md-6 mb-5">
                                                <div className="auction-list box-hover-effect">
                                                    <div className="auction-img">
                                                        <a href="#">
                                                            <img src="images/author-item-2.jpg" />
                                                        </a>
                                                    </div>
                                                    <div className="chakra-stack css-1wdu7zf">
                                                        <div className="d-flex">
                                                            <div className="seaflightImage">
                                                                <div
                                                                    aria-label="Sea Flights"
                                                                    role="image"
                                                                    className="sea-img"
                                                                    style={{
                                                                        backgroundImage:
                                                                            'url("images/author-item-2.jpg")'
                                                                    }}
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="bottom">
                                                        <div className="chakra-stack css-1npz8pa">
                                                            <h3 className="chakra-text css-1yfa4pt mb-2">
                                                                <a href="#">Tumblr</a>
                                                            </h3>
                                                            <svg
                                                                viewBox="0 0 24 24"
                                                                focusable="false"
                                                                className="chakra-icon chakra-icon css-100vr6x"
                                                            >
                                                                <path d="" fill="currentColor" />
                                                            </svg>
                                                            <div className="css-17xejub" />
                                                        </div>
                                                        <div className="chakra-stack css-198f9j2">
                                                            <a
                                                                className="chakra-link chakra-linkbox__overlay css-1me1ekj"
                                                                href="#"
                                                            >
                                                                <div className="nftprofile">
                                                                    <div className="nftprodetail">
                                                                        <div className="proimage">
                                                                            <img src="images/author-7.jpg" />
                                                                        </div>
                                                                    </div>
                                                                    <div className="proheadname">Mash Haris</div>
                                                                </div>
                                                            </a>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-lg-4 col-md-6 mb-5">
                                                <div className="auction-list box-hover-effect">
                                                    <div className="auction-img">
                                                        <a href="#">
                                                            <img src="images/auction-item-7.jpg" />
                                                        </a>
                                                    </div>
                                                    <div className="chakra-stack css-1wdu7zf">
                                                        <div className="d-flex">
                                                            <div className="seaflightImage">
                                                                <div
                                                                    aria-label="Sea Flights"
                                                                    role="image"
                                                                    className="sea-img"
                                                                    style={{
                                                                        backgroundImage:
                                                                            'url("images/auction-item-7.jpg")'
                                                                    }}
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="bottom">
                                                        <div className="chakra-stack css-1npz8pa">
                                                            <h3 className="chakra-text css-1yfa4pt mb-2">
                                                                <a href="#">Tumblr</a>
                                                            </h3>
                                                            <svg
                                                                viewBox="0 0 24 24"
                                                                focusable="false"
                                                                className="chakra-icon chakra-icon css-100vr6x"
                                                            >
                                                                <path d="" fill="currentColor" />
                                                            </svg>
                                                            <div className="css-17xejub" />
                                                        </div>
                                                        <div className="chakra-stack css-198f9j2">
                                                            <a
                                                                className="chakra-link chakra-linkbox__overlay css-1me1ekj"
                                                                href="#"
                                                            >
                                                                <div className="nftprofile">
                                                                    <div className="nftprodetail">
                                                                        <div className="proimage">
                                                                            <img src="images/author-6.jpg" />
                                                                        </div>
                                                                    </div>
                                                                    <div className="proheadname">Mick Donalds</div>
                                                                </div>
                                                            </a>
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
                    <section className="recent-nfts ptb-40">
                        <div className="container-fluid custom-container">
                            <div className="Toastify" />

                            <div className="container">
                                <div className="row">
                                    <div className="col-md-6 col-xs-8">
                                        <h3>
                                            <strong>Recent NFT</strong>
                                        </h3>
                                    </div>
                                    <div className="col-md-6 col-xs-4 text-right">
                                        <div>
                                            <a href="#" style={{ color: "rgb(255, 255, 255)" }}>View all &nbsp;
                                                <i className="fa fa-angle-right" style={{ fontSize: 17 }} />
                                            </a>
                                        </div>
                                    </div>
                                    <div className="col-md-12">
                                        <br />
                                        <div className="row _post-container_">
                                            <div className='col-sm-4 mb-5'>
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
                                                        <button
                                                            type="button"
                                                            className="btn style5"
                                                            data-bs-toggle="modal"
                                                            data-bs-target="#placeBid"
                                                        >
                                                            Place Bid
                                                        </button>
                                                    </div>
                                                </div>


                                            </div>
                                            <div className='col-sm-4 mb-5'>
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
                                                        <button
                                                            type="button"
                                                            className="btn style5"
                                                            data-bs-toggle="modal"
                                                            data-bs-target="#placeBid"
                                                        >
                                                            Place Bid
                                                        </button>
                                                    </div>
                                                </div>

                                            </div>
                                            <div className='col-sm-4 mb-5'>
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
                                                        <button
                                                            type="button"
                                                            className="btn style5"
                                                            data-bs-toggle="modal"
                                                            data-bs-target="#placeBid"
                                                        >
                                                            Place Bid
                                                        </button>
                                                    </div>
                                                </div>

                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </section>
                    <section className='how_to_get_started ptb-40' style={{position:"relative"}}>
                        <img src="images/shape-2.png" alt="Image" class="promo-shape-one"/>
                            <img src="images/shape-1.png" alt="Image" class="promo-shape-two"/>
                                <img src="images/section-shape-1.png" alt="Image" class="section-shape"/>
                                    <div className="rn-service-area">
                                        <div className="container-fluid custom-container mb-5">
                                            <div className="container">
                                                <div className="row">
                                                    <div className="col-lg-12 mb-5">
                                                        <h3>
                                                            <strong>How to get started:</strong>
                                                        </h3>
                                                    </div>
                                                </div>
                                                <div className="row g-5">
                                                    {/* start single service */}
                                                    <div className="col-xxl-4 col-lg-4 col-md-6 col-sm-6 mb-5">
                                                        <div
                                                            data-sal="slide-up"
                                                            data-sal-delay={150}
                                                            data-sal-duration={800}
                                                            className="rn-service-one color-shape-7 sal-animate"
                                                        >
                                                            <div className="inner">
                                                                <div className="icon">
                                                                    <img src="images/shape-7.png" alt="Shape" />
                                                                </div>
                                                                <div className="subtitle">Step-01</div>
                                                                <div className="content">
                                                                    <h4 className="title">
                                                                        <a href="#">Set up your wallet</a>
                                                                    </h4>
                                                                    <p className="description">
                                                                        Powerful features and inclusions, which makes Nuron standout,
                                                                        easily customizable and scalable.
                                                                    </p>
                                                                    <a className="read-more-button" href="#">
                                                                        <i className="feather-arrow-right" />
                                                                    </a>
                                                                </div>
                                                            </div>
                                                            <a className="over-link" href="#" />
                                                        </div>
                                                    </div>
                                                    {/* End single service */}
                                                    {/* start single service */}
                                                    <div className="col-xxl-4 col-lg-4 col-md-6 col-sm-6 mb-5">
                                                        <div
                                                            data-sal="slide-up"
                                                            data-sal-delay={200}
                                                            data-sal-duration={800}
                                                            className="rn-service-one color-shape-1 sal-animate"
                                                        >
                                                            <div className="inner">
                                                                <div className="icon">
                                                                    <img src="images/shape_1.png" alt="Shape" />
                                                                </div>
                                                                <div className="subtitle">Step-02</div>
                                                                <div className="content">
                                                                    <h4 className="title">
                                                                        <a href="#">Create your collection</a>
                                                                    </h4>
                                                                    <p className="description">
                                                                        A great collection of beautiful website templates for your need.
                                                                        Choose the best suitable template.
                                                                    </p>
                                                                    <a className="read-more-button" href="#">
                                                                        <i className="feather-arrow-right" />
                                                                    </a>
                                                                </div>
                                                            </div>
                                                            <a className="over-link" href="#" />
                                                        </div>
                                                    </div>
                                                    {/* End single service */}
                                                    {/* start single service */}
                                                    <div className="col-xxl-4 col-lg-4 col-md-6 col-sm-6 mb-5">
                                                        <div
                                                            data-sal="slide-up"
                                                            data-sal-delay={250}
                                                            data-sal-duration={800}
                                                            className="rn-service-one color-shape-5 sal-animate"
                                                        >
                                                            <div className="inner">
                                                                <div className="icon">
                                                                    <img src="images/shape_2.png" alt="Shape" />
                                                                </div>
                                                                <div className="subtitle">Step-03</div>
                                                                <div className="content">
                                                                    <h4 className="title">
                                                                        <a href="#">Add your NFT's</a>
                                                                    </h4>
                                                                    <p className="description">
                                                                        We've made the template fully responsive, so it looks great on
                                                                        all devices: desktop, tablets and.
                                                                    </p>
                                                                    <a className="read-more-button" href="#">
                                                                        <i className="feather-arrow-right" />
                                                                    </a>
                                                                </div>
                                                            </div>
                                                            <a className="over-link" href="#" />
                                                        </div>
                                                    </div>
                                                    {/* End single service */}

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
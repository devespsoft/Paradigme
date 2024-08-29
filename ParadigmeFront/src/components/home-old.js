import React, { Component } from 'react';
import axios from 'axios';
import Header from '../directives/header'
import Footer from '../directives/footer'
import config from '../config/config'
import Carousel from "react-multi-carousel";
import Cookies from 'js-cookie';
import { Link } from 'react-router-dom'
import { ToastContainer, toast } from 'react-toastify';
import "react-multi-carousel/lib/styles.css";
import Countdown, { zeroPad } from 'react-countdown';
import { Player } from 'video-react';
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import 'swiper/swiper-bundle.min.css'
import 'swiper/swiper.min.css'

// import Swiper core and required modules
import SwiperCore, {
    Pagination
} from 'swiper';

// install Swiper modules
SwiperCore.use([Pagination]);
export default class home extends Component {

    constructor(props) {
        super(props)
        this.state = {
            trendingAuctionNfts: [],
            trendingNfts: [],
            allNfts: [],
            getItemAllNfts:'',
            tredingNfts: [],
            recentNfts: [],
            collections: [],
            getBannerNFTData:'',
            getBannerNFTData1:'',
            responsive: {
                superLargeDesktop: {
                    // the naming can be any, depends on you.
                    breakpoint: { max: 4000, min: 3000 },
                    items: 6
                },
                desktop: {
                    breakpoint: { max: 3000, min: 1024 },
                    items: 6
                },
                tablet: {
                    breakpoint: { max: 1024, min: 464 },
                    items: 2
                },
                mobile: {
                    breakpoint: { max: 464, min: 0 },
                    items: 1
                }
            }
        };

        this.loginData = (!Cookies.get('loginSuccessParadigme')) ? [] : JSON.parse(Cookies.get('loginSuccessParadigme'))
    }

    componentDidMount() {
        this.trendingAuctionNftsAPI()
        this.trendingNftsAPI()
        this.allNftsAPIAPI()
        this.collectionListAPI()
        this.totalNfts()
        this.bannerNftsAPI()
    }

    async bannerNftsAPI() {
        await axios({
            method: 'get',
            url: `${config.apiUrl}getBannerNFT`,
        }).then((res) => {
            if (res.data.success === true) {
                this.setState({
                    getBannerNFTData: res.data.response[0],
                    getBannerNFTData1: res.data.response[1]
                })
            }
        }).catch((error) => {

        })
    }

    async trendingAuctionNftsAPI() {
        await axios({
            method: 'post',
            url: `${config.apiUrl}trendingNfts`,
            data: { 'type': 2 }
        }).then((res) => {
            if (res.data.success === true) {
                this.setState({
                    trendingAuctionNfts: res.data.response
                })
            }
        }).catch((error) => {

        })
    }

    async totalNfts() {
        await axios({
            method: 'get',
            url: `${config.apiUrl}getItemAll`,
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


    async trendingNftsAPI() {
        await axios({
            method: 'post',
            url: `${config.apiUrl}trendingNfts`,
            data: { 'type': 1 }
        }).then((res) => {
            if (res.data.success === true) {
                this.setState({
                    trendingNfts: res.data.response
                })
            }
        }).catch((error) => {

        })
    }

    async allNftsAPIAPI() {
        await axios({
            method: 'post',
            url: `${config.apiUrl}trendingNfts`,
            data: {}
        }).then((res) => {
            if (res.data.success === true) {
                this.setState({
                    allNfts: res.data.response
                })
            }
        }).catch((error) => {

        })
    }

    async collectionListAPI() {
        await axios({
            method: 'post',
            url: `${config.apiUrl}getHomeCollections`,
            data: {
                "limit": "0"
            }
        }).then((res) => {
            if (res.data.success === true) {
                this.setState({
                    collections: res.data.response
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
                    <div className="no-bottom no-top" id="content">
                        <div id="top"></div>

                        <section id="section-hero" aria-label="section" className="pt20 pb20 section-hero" data-bgimage="url(images/bg/7.jpg) bottom">
                            <div class="hero-bg-left absolute -bottom-52 left-0 -z-10">
                                <svg class="w-full" width="301" height="691" viewBox="0 0 301 691" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <g filter="url(#filter0_f_1423_12670)">
                                        <path d="M-70 634.739L-261.912 378.673L-19.4497 196.956C51.2609 143.961 151.544 158.322 204.539 229.033C257.534 299.744 243.173 400.027 172.462 453.022L-70 634.739Z" fill="#F0FDFA" />
                                    </g>
                                    <g filter="url(#filter1_f_1423_12670)">
                                        <path d="M-154 255.221L-51.9803 105L90.2602 201.6C131.743 229.772 142.533 286.238 114.361 327.72C86.1887 369.203 29.7227 379.993 -11.7596 351.821L-154 255.221Z" fill="#FEFCE8" />
                                    </g>
                                    <defs>
                                        <filter id="filter0_f_1423_12670" x="-317.912" y="108.979" width="610.428" height="581.759" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
                                            <feFlood flood-opacity="0" result="BackgroundImageFix" />
                                            <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
                                            <feGaussianBlur stdDeviation="28" result="effect1_foregroundBlur_1423_12670" />
                                        </filter>
                                        <filter id="filter1_f_1423_12670" x="-259" y="0" width="494.053" height="472.514" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
                                            <feFlood flood-opacity="0" result="BackgroundImageFix" />
                                            <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
                                            <feGaussianBlur stdDeviation="52.5" result="effect1_foregroundBlur_1423_12670" />
                                        </filter>
                                    </defs>
                                </svg>
                            </div>
                            <div class="hero-bg-right absolute -top-40 right-0 -z-10">
                                <svg class="w-full" width="1262" height="1356" viewBox="0 0 1262 1356" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <g filter="url(#filter0_f_1423_12669)">
                                        <ellipse rx="295.353" ry="293.376" transform="matrix(-1 0 0 1 973.353 275.376)" fill="#BBF7D0" />
                                    </g>
                                    <circle cx="795.5" cy="440.5" r="253.5" stroke="white" stroke-width="50" />
                                    <g filter="url(#filter1_f_1423_12669)">
                                        <ellipse cx="785.5" cy="572.5" rx="285.5" ry="283.5" fill="#FEF9C3" />
                                    </g>
                                    <g filter="url(#filter2_f_1423_12669)">
                                        <circle cx="1008" cy="186" r="325" fill="#F0FDFA" />
                                    </g>
                                    <defs>
                                        <filter id="filter0_f_1423_12669" x="178" y="-518" width="1590.71" height="1586.75" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
                                            <feFlood flood-opacity="0" result="BackgroundImageFix" />
                                            <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
                                            <feGaussianBlur stdDeviation="250" result="effect1_foregroundBlur_1423_12669" />
                                        </filter>
                                        <filter id="filter1_f_1423_12669" x="0" y="-211" width="1571" height="1567" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
                                            <feFlood flood-opacity="0" result="BackgroundImageFix" />
                                            <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
                                            <feGaussianBlur stdDeviation="250" result="effect1_foregroundBlur_1423_12669" />
                                        </filter>
                                        <filter id="filter2_f_1423_12669" x="560" y="-262" width="896" height="896" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
                                            <feFlood flood-opacity="0" result="BackgroundImageFix" />
                                            <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
                                            <feGaussianBlur stdDeviation="61.5" result="effect1_foregroundBlur_1423_12669" />
                                        </filter>
                                    </defs>
                                </svg>
                            </div>
                            <div className="absolute hidden xl:block opacity-25 2xl:opacity-100 top-0 bottom-0 right-0 left-0" style={{ zIndex: '-1' }}>
                                <span className="animate-1 absolute left-16 bottom-0">
                                    <svg width={101} height={75} viewBox="0 0 101 75" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <rect width="3.1317" height="3.13172" transform="matrix(0.707116 0.707097 -0.707116 0.707097 2.2146 0)" fill="#a1cd1a" />
                                        <rect width="3.1317" height="3.13172" transform="matrix(0.707116 0.707097 -0.707116 0.707097 21.4348 0)" fill="#a1cd1a" />
                                        <rect width="3.1317" height="3.13172" transform="matrix(0.707116 0.707097 -0.707116 0.707097 40.6553 0)" fill="#a1cd1a" />
                                        <rect width="3.1317" height="3.13172" transform="matrix(0.707116 0.707097 -0.707116 0.707097 59.8757 0)" fill="#a1cd1a" />
                                        <rect width="3.1317" height="3.13172" transform="matrix(0.707116 0.707097 -0.707116 0.707097 79.0962 0)" fill="#a1cd1a" />
                                        <rect width="3.1317" height="3.13172" transform="matrix(0.707116 0.707097 -0.707116 0.707097 98.3164 0)" fill="#a1cd1a" />
                                        <rect width="3.1317" height="3.13172" transform="matrix(0.707116 0.707097 -0.707116 0.707097 2.2146 17.5488)" fill="#a1cd1a" />
                                        <rect width="3.1317" height="3.13172" transform="matrix(0.707116 0.707097 -0.707116 0.707097 2.2146 35.0986)" fill="#a1cd1a" />
                                        <rect width="3.1317" height="3.13172" transform="matrix(0.707116 0.707097 -0.707116 0.707097 2.2146 52.6475)" fill="#a1cd1a" />
                                        <rect width="3.1317" height="3.13172" transform="matrix(0.707116 0.707097 -0.707116 0.707097 2.2146 70.1963)" fill="#a1cd1a" />
                                        <rect width="3.1317" height="3.13172" transform="matrix(0.707116 0.707097 -0.707116 0.707097 21.4348 17.5488)" fill="#a1cd1a" />
                                        <rect width="3.1317" height="3.13172" transform="matrix(0.707116 0.707097 -0.707116 0.707097 21.4348 35.0986)" fill="#a1cd1a" />
                                        <rect width="3.1317" height="3.13172" transform="matrix(0.707116 0.707097 -0.707116 0.707097 21.4348 52.6475)" fill="#a1cd1a" />
                                        <rect width="3.1317" height="3.13172" transform="matrix(0.707116 0.707097 -0.707116 0.707097 21.4348 70.1963)" fill="#a1cd1a" />
                                        <rect width="3.1317" height="3.13172" transform="matrix(0.707116 0.707097 -0.707116 0.707097 40.6553 17.5488)" fill="#a1cd1a" />
                                        <rect width="3.1317" height="3.13172" transform="matrix(0.707116 0.707097 -0.707116 0.707097 40.6553 35.0986)" fill="#a1cd1a" />
                                        <rect width="3.1317" height="3.13172" transform="matrix(0.707116 0.707097 -0.707116 0.707097 40.6553 52.6475)" fill="#a1cd1a" />
                                        <rect width="3.1317" height="3.13172" transform="matrix(0.707116 0.707097 -0.707116 0.707097 40.6553 70.1963)" fill="#a1cd1a" />
                                        <rect width="3.1317" height="3.13172" transform="matrix(0.707116 0.707097 -0.707116 0.707097 59.8757 17.5488)" fill="#a1cd1a" />
                                        <rect width="3.1317" height="3.13172" transform="matrix(0.707116 0.707097 -0.707116 0.707097 59.8757 35.0986)" fill="#a1cd1a" />
                                        <rect width="3.1317" height="3.13172" transform="matrix(0.707116 0.707097 -0.707116 0.707097 59.8757 52.6475)" fill="#a1cd1a" />
                                        <rect width="3.1317" height="3.13172" transform="matrix(0.707116 0.707097 -0.707116 0.707097 59.8757 70.1963)" fill="#a1cd1a" />
                                        <rect width="3.1317" height="3.13172" transform="matrix(0.707116 0.707097 -0.707116 0.707097 79.0962 17.5488)" fill="#a1cd1a" />
                                        <rect width="3.1317" height="3.13172" transform="matrix(0.707116 0.707097 -0.707116 0.707097 79.0962 35.0986)" fill="#a1cd1a" />
                                        <rect width="3.1317" height="3.13172" transform="matrix(0.707116 0.707097 -0.707116 0.707097 79.0962 52.6475)" fill="#a1cd1a" />
                                        <rect width="3.1317" height="3.13172" transform="matrix(0.707116 0.707097 -0.707116 0.707097 79.0962 70.1963)" fill="#a1cd1a" />
                                        <rect width="3.1317" height="3.13172" transform="matrix(0.707116 0.707097 -0.707116 0.707097 98.3164 17.5488)" fill="#a1cd1a" />
                                        <rect width="3.1317" height="3.13172" transform="matrix(0.707116 0.707097 -0.707116 0.707097 98.3164 35.0986)" fill="#a1cd1a" />
                                        <rect width="3.1317" height="3.13172" transform="matrix(0.707116 0.707097 -0.707116 0.707097 98.3164 52.6475)" fill="#a1cd1a" />
                                        <rect width="3.1317" height="3.13172" transform="matrix(0.707116 0.707097 -0.707116 0.707097 98.3164 70.1963)" fill="#a1cd1a" />
                                    </svg>
                                </span>
                                <span className="animate-2 absolute left-20 bottom-52">
                                    <svg width={20} height={20} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <circle cx={10} cy={10} r={10} fill="#a1cd1a" />
                                    </svg>
                                </span>
                                <span className="animate-3 absolute left-20 top-10">
                                    <svg width={38} height={38} viewBox="0 0 38 38" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path fillRule="evenodd" clipRule="evenodd" d="M0.651129 19.1367C10.928 19.0878 19.2461 10.8072 19.2657 0.592236C19.2849 10.6462 27.3431 18.8262 37.3956 19.1283L37.3951 19.1451C27.5222 19.442 19.5732 27.3379 19.2744 37.1447C19.2686 37.1449 19.2628 37.1451 19.257 37.1453C18.9536 27.1781 10.7477 19.1847 0.651129 19.1367ZM0.46822 19.1367C0.311684 19.1359 0.155604 19.1333 0 19.1288C0.000156532 19.134 0.00031529 19.1393 0.000476273 19.1446C0.155922 19.1401 0.311844 19.1374 0.46822 19.1367ZM19.2738 0.000481984C19.2687 0.172956 19.266 0.34602 19.2657 0.519642C19.2653 0.345857 19.2626 0.172632 19.2575 0L19.2738 0.000481984Z" fill="#3f007e" />
                                    </svg>
                                </span>
                                <span className="animate-3 absolute right-2 top-40">
                                    <svg width={101} height={75} viewBox="0 0 101 75" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <rect width="3.1317" height="3.13172" transform="matrix(0.707116 0.707097 -0.707116 0.707097 2.2146 0)" fill="#a1cd1a" />
                                        <rect width="3.1317" height="3.13172" transform="matrix(0.707116 0.707097 -0.707116 0.707097 21.4348 0)" fill="#a1cd1a" />
                                        <rect width="3.1317" height="3.13172" transform="matrix(0.707116 0.707097 -0.707116 0.707097 40.6553 0)" fill="#a1cd1a" />
                                        <rect width="3.1317" height="3.13172" transform="matrix(0.707116 0.707097 -0.707116 0.707097 59.8757 0)" fill="#a1cd1a" />
                                        <rect width="3.1317" height="3.13172" transform="matrix(0.707116 0.707097 -0.707116 0.707097 79.0962 0)" fill="#a1cd1a" />
                                        <rect width="3.1317" height="3.13172" transform="matrix(0.707116 0.707097 -0.707116 0.707097 98.3164 0)" fill="#a1cd1a" />
                                        <rect width="3.1317" height="3.13172" transform="matrix(0.707116 0.707097 -0.707116 0.707097 2.2146 17.5488)" fill="#a1cd1a" />
                                        <rect width="3.1317" height="3.13172" transform="matrix(0.707116 0.707097 -0.707116 0.707097 2.2146 35.0986)" fill="#a1cd1a" />
                                        <rect width="3.1317" height="3.13172" transform="matrix(0.707116 0.707097 -0.707116 0.707097 2.2146 52.6475)" fill="#a1cd1a" />
                                        <rect width="3.1317" height="3.13172" transform="matrix(0.707116 0.707097 -0.707116 0.707097 2.2146 70.1963)" fill="#a1cd1a" />
                                        <rect width="3.1317" height="3.13172" transform="matrix(0.707116 0.707097 -0.707116 0.707097 21.4348 17.5488)" fill="#a1cd1a" />
                                        <rect width="3.1317" height="3.13172" transform="matrix(0.707116 0.707097 -0.707116 0.707097 21.4348 35.0986)" fill="#a1cd1a" />
                                        <rect width="3.1317" height="3.13172" transform="matrix(0.707116 0.707097 -0.707116 0.707097 21.4348 52.6475)" fill="#a1cd1a" />
                                        <rect width="3.1317" height="3.13172" transform="matrix(0.707116 0.707097 -0.707116 0.707097 21.4348 70.1963)" fill="#a1cd1a" />
                                        <rect width="3.1317" height="3.13172" transform="matrix(0.707116 0.707097 -0.707116 0.707097 40.6553 17.5488)" fill="#a1cd1a" />
                                        <rect width="3.1317" height="3.13172" transform="matrix(0.707116 0.707097 -0.707116 0.707097 40.6553 35.0986)" fill="#a1cd1a" />
                                        <rect width="3.1317" height="3.13172" transform="matrix(0.707116 0.707097 -0.707116 0.707097 40.6553 52.6475)" fill="#a1cd1a" />
                                        <rect width="3.1317" height="3.13172" transform="matrix(0.707116 0.707097 -0.707116 0.707097 40.6553 70.1963)" fill="#a1cd1a" />
                                        <rect width="3.1317" height="3.13172" transform="matrix(0.707116 0.707097 -0.707116 0.707097 59.8757 17.5488)" fill="#a1cd1a" />
                                        <rect width="3.1317" height="3.13172" transform="matrix(0.707116 0.707097 -0.707116 0.707097 59.8757 35.0986)" fill="#a1cd1a" />
                                        <rect width="3.1317" height="3.13172" transform="matrix(0.707116 0.707097 -0.707116 0.707097 59.8757 52.6475)" fill="#a1cd1a" />
                                        <rect width="3.1317" height="3.13172" transform="matrix(0.707116 0.707097 -0.707116 0.707097 59.8757 70.1963)" fill="#a1cd1a" />
                                        <rect width="3.1317" height="3.13172" transform="matrix(0.707116 0.707097 -0.707116 0.707097 79.0962 17.5488)" fill="#a1cd1a" />
                                        <rect width="3.1317" height="3.13172" transform="matrix(0.707116 0.707097 -0.707116 0.707097 79.0962 35.0986)" fill="#a1cd1a" />
                                        <rect width="3.1317" height="3.13172" transform="matrix(0.707116 0.707097 -0.707116 0.707097 79.0962 52.6475)" fill="#a1cd1a" />
                                        <rect width="3.1317" height="3.13172" transform="matrix(0.707116 0.707097 -0.707116 0.707097 79.0962 70.1963)" fill="#a1cd1a" />
                                        <rect width="3.1317" height="3.13172" transform="matrix(0.707116 0.707097 -0.707116 0.707097 98.3164 17.5488)" fill="#a1cd1a" />
                                        <rect width="3.1317" height="3.13172" transform="matrix(0.707116 0.707097 -0.707116 0.707097 98.3164 35.0986)" fill="#a1cd1a" />
                                        <rect width="3.1317" height="3.13172" transform="matrix(0.707116 0.707097 -0.707116 0.707097 98.3164 52.6475)" fill="#a1cd1a" />
                                        <rect width="3.1317" height="3.13172" transform="matrix(0.707116 0.707097 -0.707116 0.707097 98.3164 70.1963)" fill="#a1cd1a" />
                                    </svg>
                                </span>
                                <span className="animate-1 absolute right-96 top-5">
                                    <svg width={101} height={75} viewBox="0 0 101 75" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <rect width="3.1317" height="3.13172" transform="matrix(0.707116 0.707097 -0.707116 0.707097 2.2146 0)" fill="#a1cd1a" />
                                        <rect width="3.1317" height="3.13172" transform="matrix(0.707116 0.707097 -0.707116 0.707097 21.4348 0)" fill="#a1cd1a" />
                                        <rect width="3.1317" height="3.13172" transform="matrix(0.707116 0.707097 -0.707116 0.707097 40.6553 0)" fill="#a1cd1a" />
                                        <rect width="3.1317" height="3.13172" transform="matrix(0.707116 0.707097 -0.707116 0.707097 59.8757 0)" fill="#a1cd1a" />
                                        <rect width="3.1317" height="3.13172" transform="matrix(0.707116 0.707097 -0.707116 0.707097 79.0962 0)" fill="#a1cd1a" />
                                        <rect width="3.1317" height="3.13172" transform="matrix(0.707116 0.707097 -0.707116 0.707097 98.3164 0)" fill="#a1cd1a" />
                                        <rect width="3.1317" height="3.13172" transform="matrix(0.707116 0.707097 -0.707116 0.707097 2.2146 17.5488)" fill="#a1cd1a" />
                                        <rect width="3.1317" height="3.13172" transform="matrix(0.707116 0.707097 -0.707116 0.707097 2.2146 35.0986)" fill="#a1cd1a" />
                                        <rect width="3.1317" height="3.13172" transform="matrix(0.707116 0.707097 -0.707116 0.707097 2.2146 52.6475)" fill="#a1cd1a" />
                                        <rect width="3.1317" height="3.13172" transform="matrix(0.707116 0.707097 -0.707116 0.707097 2.2146 70.1963)" fill="#a1cd1a" />
                                        <rect width="3.1317" height="3.13172" transform="matrix(0.707116 0.707097 -0.707116 0.707097 21.4348 17.5488)" fill="#a1cd1a" />
                                        <rect width="3.1317" height="3.13172" transform="matrix(0.707116 0.707097 -0.707116 0.707097 21.4348 35.0986)" fill="#a1cd1a" />
                                        <rect width="3.1317" height="3.13172" transform="matrix(0.707116 0.707097 -0.707116 0.707097 21.4348 52.6475)" fill="#a1cd1a" />
                                        <rect width="3.1317" height="3.13172" transform="matrix(0.707116 0.707097 -0.707116 0.707097 21.4348 70.1963)" fill="#a1cd1a" />
                                        <rect width="3.1317" height="3.13172" transform="matrix(0.707116 0.707097 -0.707116 0.707097 40.6553 17.5488)" fill="#a1cd1a" />
                                        <rect width="3.1317" height="3.13172" transform="matrix(0.707116 0.707097 -0.707116 0.707097 40.6553 35.0986)" fill="#a1cd1a" />
                                        <rect width="3.1317" height="3.13172" transform="matrix(0.707116 0.707097 -0.707116 0.707097 40.6553 52.6475)" fill="#a1cd1a" />
                                        <rect width="3.1317" height="3.13172" transform="matrix(0.707116 0.707097 -0.707116 0.707097 40.6553 70.1963)" fill="#a1cd1a" />
                                        <rect width="3.1317" height="3.13172" transform="matrix(0.707116 0.707097 -0.707116 0.707097 59.8757 17.5488)" fill="#a1cd1a" />
                                        <rect width="3.1317" height="3.13172" transform="matrix(0.707116 0.707097 -0.707116 0.707097 59.8757 35.0986)" fill="#a1cd1a" />
                                        <rect width="3.1317" height="3.13172" transform="matrix(0.707116 0.707097 -0.707116 0.707097 59.8757 52.6475)" fill="#a1cd1a" />
                                        <rect width="3.1317" height="3.13172" transform="matrix(0.707116 0.707097 -0.707116 0.707097 59.8757 70.1963)" fill="#a1cd1a" />
                                        <rect width="3.1317" height="3.13172" transform="matrix(0.707116 0.707097 -0.707116 0.707097 79.0962 17.5488)" fill="#a1cd1a" />
                                        <rect width="3.1317" height="3.13172" transform="matrix(0.707116 0.707097 -0.707116 0.707097 79.0962 35.0986)" fill="#a1cd1a" />
                                        <rect width="3.1317" height="3.13172" transform="matrix(0.707116 0.707097 -0.707116 0.707097 79.0962 52.6475)" fill="#a1cd1a" />
                                        <rect width="3.1317" height="3.13172" transform="matrix(0.707116 0.707097 -0.707116 0.707097 79.0962 70.1963)" fill="#a1cd1a" />
                                        <rect width="3.1317" height="3.13172" transform="matrix(0.707116 0.707097 -0.707116 0.707097 98.3164 17.5488)" fill="#a1cd1a" />
                                        <rect width="3.1317" height="3.13172" transform="matrix(0.707116 0.707097 -0.707116 0.707097 98.3164 35.0986)" fill="#a1cd1a" />
                                        <rect width="3.1317" height="3.13172" transform="matrix(0.707116 0.707097 -0.707116 0.707097 98.3164 52.6475)" fill="#a1cd1a" />
                                        <rect width="3.1317" height="3.13172" transform="matrix(0.707116 0.707097 -0.707116 0.707097 98.3164 70.1963)" fill="#a1cd1a" />
                                    </svg>
                                </span>
                                <span className="animate-2 absolute right-96 top-28 mr-6">
                                    <svg width={20} height={20} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <circle cx={10} cy={10} r={10} fill="#a1cd1a" />
                                    </svg>
                                </span>
                                <span className="animate-3 absolute right-40 top-32">
                                    <svg width={38} height={38} viewBox="0 0 38 38" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path fillRule="evenodd" clipRule="evenodd" d="M0.651129 19.1367C10.928 19.0878 19.2461 10.8072 19.2657 0.592236C19.2849 10.6462 27.3431 18.8262 37.3956 19.1283L37.3951 19.1451C27.5222 19.442 19.5732 27.3379 19.2744 37.1447C19.2686 37.1449 19.2628 37.1451 19.257 37.1453C18.9536 27.1781 10.7477 19.1847 0.651129 19.1367ZM0.46822 19.1367C0.311684 19.1359 0.155604 19.1333 0 19.1288C0.000156532 19.134 0.00031529 19.1393 0.000476273 19.1446C0.155922 19.1401 0.311844 19.1374 0.46822 19.1367ZM19.2738 0.000481984C19.2687 0.172956 19.266 0.34602 19.2657 0.519642C19.2653 0.345857 19.2626 0.172632 19.2575 0L19.2738 0.000481984Z" fill="#3f007e" />
                                    </svg>
                                </span>
                                <span className="animate-2 absolute right-96 top-60">
                                    <svg width={21} height={20} viewBox="0 0 21 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <ellipse cx="10.0674" cy={10} rx="10.0674" ry={10} fill="#99F6E4" />
                                    </svg>
                                </span>
                                <span className="animate-3 absolute right-52 top-72">
                                    <svg width={38} height={38} viewBox="0 0 38 38" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <ellipse cx="18.706" cy="18.5808" rx="18.706" ry="18.5808" fill="#FEF9C3" />
                                    </svg>
                                </span>
                                <span className="animate-2 absolute right-4 -bottom-4">
                                    <svg width={93} height={75} viewBox="0 0 93 75" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <rect width="3.00513" height="3.00514" transform="matrix(0.676024 0.736879 -0.676024 0.736879 2.03162 0)" fill="#3f007e" />
                                        <rect width="3.00513" height="3.00514" transform="matrix(0.676024 0.736879 -0.676024 0.736879 19.6641 0)" fill="#3f007e" />
                                        <rect width="3.00513" height="3.00514" transform="matrix(0.676024 0.736879 -0.676024 0.736879 37.2966 0)" fill="#3f007e" />
                                        <rect width="3.00513" height="3.00514" transform="matrix(0.676024 0.736879 -0.676024 0.736879 54.9293 0)" fill="#3f007e" />
                                        <rect width="3.00513" height="3.00514" transform="matrix(0.676024 0.736879 -0.676024 0.736879 72.5621 0)" fill="#3f007e" />
                                        <rect width="3.00513" height="3.00514" transform="matrix(0.676024 0.736879 -0.676024 0.736879 90.1945 0)" fill="#3f007e" />
                                        <rect width="3.00513" height="3.00514" transform="matrix(0.676024 0.736879 -0.676024 0.736879 2.03162 17.5488)" fill="#3f007e" />
                                        <rect width="3.00513" height="3.00514" transform="matrix(0.676024 0.736879 -0.676024 0.736879 2.03162 35.0986)" fill="#3f007e" />
                                        <rect width="3.00513" height="3.00514" transform="matrix(0.676024 0.736879 -0.676024 0.736879 2.03162 52.6475)" fill="#3f007e" />
                                        <rect width="3.00513" height="3.00514" transform="matrix(0.676024 0.736879 -0.676024 0.736879 2.03162 70.1963)" fill="#3f007e" />
                                        <rect width="3.00513" height="3.00514" transform="matrix(0.676024 0.736879 -0.676024 0.736879 19.6641 17.5488)" fill="#3f007e" />
                                        <rect width="3.00513" height="3.00514" transform="matrix(0.676024 0.736879 -0.676024 0.736879 19.6641 35.0986)" fill="#3f007e" />
                                        <rect width="3.00513" height="3.00514" transform="matrix(0.676024 0.736879 -0.676024 0.736879 19.6641 52.6475)" fill="#3f007e" />
                                        <rect width="3.00513" height="3.00514" transform="matrix(0.676024 0.736879 -0.676024 0.736879 19.6641 70.1963)" fill="#3f007e" />
                                        <rect width="3.00513" height="3.00514" transform="matrix(0.676024 0.736879 -0.676024 0.736879 37.2966 17.5488)" fill="#3f007e" />
                                        <rect width="3.00513" height="3.00514" transform="matrix(0.676024 0.736879 -0.676024 0.736879 37.2966 35.0986)" fill="#3f007e" />
                                        <rect width="3.00513" height="3.00514" transform="matrix(0.676024 0.736879 -0.676024 0.736879 37.2966 52.6475)" fill="#3f007e" />
                                        <rect width="3.00513" height="3.00514" transform="matrix(0.676024 0.736879 -0.676024 0.736879 37.2966 70.1963)" fill="#3f007e" />
                                        <rect width="3.00513" height="3.00514" transform="matrix(0.676024 0.736879 -0.676024 0.736879 54.9293 17.5488)" fill="#3f007e" />
                                        <rect width="3.00513" height="3.00514" transform="matrix(0.676024 0.736879 -0.676024 0.736879 54.9293 35.0986)" fill="#3f007e" />
                                        <rect width="3.00513" height="3.00514" transform="matrix(0.676024 0.736879 -0.676024 0.736879 54.9293 52.6475)" fill="#3f007e" />
                                        <rect width="3.00513" height="3.00514" transform="matrix(0.676024 0.736879 -0.676024 0.736879 54.9293 70.1963)" fill="#3f007e" />
                                        <rect width="3.00513" height="3.00514" transform="matrix(0.676024 0.736879 -0.676024 0.736879 72.5621 17.5488)" fill="#3f007e" />
                                        <rect width="3.00513" height="3.00514" transform="matrix(0.676024 0.736879 -0.676024 0.736879 72.5621 35.0986)" fill="#3f007e" />
                                        <rect width="3.00513" height="3.00514" transform="matrix(0.676024 0.736879 -0.676024 0.736879 72.5621 52.6475)" fill="#3f007e" />
                                        <rect width="3.00513" height="3.00514" transform="matrix(0.676024 0.736879 -0.676024 0.736879 72.5621 70.1963)" fill="#3f007e" />
                                        <rect width="3.00513" height="3.00514" transform="matrix(0.676024 0.736879 -0.676024 0.736879 90.1945 17.5488)" fill="#3f007e" />
                                        <rect width="3.00513" height="3.00514" transform="matrix(0.676024 0.736879 -0.676024 0.736879 90.1945 35.0986)" fill="#3f007e" />
                                        <rect width="3.00513" height="3.00514" transform="matrix(0.676024 0.736879 -0.676024 0.736879 90.1945 52.6475)" fill="#3f007e" />
                                        <rect width="3.00513" height="3.00514" transform="matrix(0.676024 0.736879 -0.676024 0.736879 90.1945 70.1963)" fill="#3f007e" />
                                    </svg>
                                </span>
                                <span className="animate-2 absolute right-1/4 -bottom-12">
                                    <svg width={20} height={20} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <circle cx={10} cy={10} r={10} fill="#a1cd1a" />
                                    </svg>
                                </span>
                                <span className="animate-3 absolute right-16 bottom-32">
                                    <svg width={38} height={38} viewBox="0 0 38 38" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path fillRule="evenodd" clipRule="evenodd" d="M0.651129 19.1367C10.928 19.0878 19.2461 10.8072 19.2657 0.592236C19.2849 10.6462 27.3431 18.8262 37.3956 19.1283L37.3951 19.1451C27.5222 19.442 19.5732 27.3379 19.2744 37.1447C19.2686 37.1449 19.2628 37.1451 19.257 37.1453C18.9536 27.1781 10.7477 19.1847 0.651129 19.1367ZM0.46822 19.1367C0.311684 19.1359 0.155604 19.1333 0 19.1288C0.000156532 19.134 0.00031529 19.1393 0.000476273 19.1446C0.155922 19.1401 0.311844 19.1374 0.46822 19.1367ZM19.2738 0.000481984C19.2687 0.172956 19.266 0.34602 19.2657 0.519642C19.2653 0.345857 19.2626 0.172632 19.2575 0L19.2738 0.000481984Z" fill="#a1cd1a" />
                                    </svg>
                                </span>
                                <span className="animate-2 absolute right-80 bottom-32">
                                    <svg width={21} height={20} viewBox="0 0 21 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <ellipse cx="10.0674" cy={10} rx="10.0674" ry={10} fill="#99F6E4" />
                                    </svg>
                                </span>
                            </div>
                            <div className="v-center">
                                <div className="container-fluid">
                                    <div className="row align-items-center">
                                        <div className="col-md-6">
                                            <div className="spacer-single" />
                                            <div className="spacer-10" />
                                            <h1 className="wow fadeInUp" data-wow-delay=".75s">Discover rare <span className="id-color-2">artworks</span> by world class artists</h1>
                                            <p className="wow fadeInUp lead" data-wow-delay="1s">
                                                Unit of data stored on a digital ledger, called a blockchain, that certifies a digital asset to be unique and therefore not interchangeable</p>
                                            <div className="spacer-10" />
                                            <Link to={`${config.baseUrl}marketplace`} className="btn-main wow fadeInUp lead" data-wow-delay="1.25s">Marketplace</Link>
                                            <div class="row">
                                                <div class="spacer-single"></div>
                                                <div class="row">
                                                    <div class="col-lg-4 col-md-6 col-sm-4 col-4 wow fadeInRight mb30" data-wow-delay="1.1s">
                                                        <div class="de_count text-left">
                                                            <h3><span>{this.state.getItemAllNfts.nft_count}</span></h3>
                                                            <h5 class="id-color">Collectibles</h5>
                                                        </div>
                                                    </div>

                                                    <div class="col-lg-4 col-md-6 col-sm-4 col-4 wow fadeInRight mb30" data-wow-delay="1.4s">
                                                        <div class="de_count text-left">
                                                            <h3><span>{this.state.getItemAllNfts.auction_count}</span></h3>
                                                            <h5 class="id-color">Auctions</h5>
                                                        </div>
                                                    </div>

                                                    <div class="col-lg-4 col-md-6 col-sm-4 col-4 wow fadeInRight mb30" data-wow-delay="1.7s">
                                                        <div class="de_count text-left">
                                                            <h3><span>{this.state.getItemAllNfts.creator_count}</span></h3>
                                                            <h5 class="id-color">NFT Artist</h5>
                                                        </div>
                                                    </div>
                                                </div>
                                            
                                            </div>
                                            <div className="mb-sm-30" />
                                        </div>
                                        <div className="col-md-6 ">
                                            <div className="banner-card-area">
                                                <div className="row">
                                                    <div className="col-lg-6 col-sm-6">
                                                        <div className="banner-card">
                                                            <div className="banner-card-img">
                                                            <Link to={`${config.baseUrl}nftDetails/${this.state.getBannerNFTData.id}`}>
                                                                <img src={`${config.imageUrl + this.state.getBannerNFTData.image}`} alt="Images" />
                                                                <div className="banner-card-content">
                                                                    <div className="card-left">
                                                                        <span>Start Bid</span>
                                                                        <h3>{this.state.getBannerNFTData.price} ETH</h3>
                                                                    </div>
                                                                    <div className="card-right">
                                                                        <h3>Expiry Date</h3>
                                                                        <div className="timer-text" data-countdown="2021/10/10">{this.state.getBannerNFTData.expiry_date}</div>
                                                                    </div>
                                                                </div>
                                                                </Link>
                                                            </div>
                                                            <div className="content">
                                                                <div className="banner-user-list">
                                                                    <div className="banner-user-list-img">
                                                                       <Link to={`${config.baseUrl}nftDetails/${this.state.getBannerNFTData.id}`}>
                                                                            <img src={`${config.imageUrl1 + this.state.getBannerNFTData.profile_pic}`} style={{width:'50px',height:'50px'}} alt="Images" />
                                                                        </Link>
                                                                        <i className="icon_check" />
                                                                    </div>
                                                                    <h3><Link to={`${config.baseUrl}nftDetails/${this.state.getBannerNFTData.id}`}>{this.state.getBannerNFTData.name}</Link></h3>
                                                                    <span>Created by<Link to={`${config.baseUrl}nftDetails/${this.state.getBannerNFTData.id}`}>{this.state.getBannerNFTData.full_name}</Link></span>
                                                                </div>
                                                                <Link to={`${config.baseUrl}nftDetails/${this.state.getBannerNFTData.id}`} className="banner-user-btn"><i className="arrow_right" /></Link>
                                                                <button type="button" className="default-btn border-radius-5">Place Bid</button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="col-lg-6 col-sm-6">
                                                        <div className="banner-card banner-card-mt">
                                                            <div className="banner-card-img">
                                                            <Link to={`${config.baseUrl}nftDetails/${this.state.getBannerNFTData.id}`}>
                                                                <img src={`${config.imageUrl + this.state.getBannerNFTData1.image}`} alt="Images" />
                                                                <div className="banner-card-content">
                                                                    <div className="card-left">
                                                                        <span>Start Bid</span>
                                                                        <h3>{this.state.getBannerNFTData1.price} ETH</h3>
                                                                    </div>
                                                                    <div className="card-right">
                                                                        <h3>Expiry Date</h3>
                                                                        <div className="timer-text" data-countdown="2021/09/09">{this.state.getBannerNFTData1.expiry_date}</div>
                                                                    </div>
                                                                </div>
                                                                </Link>
                                                            </div>
                                                            <div className="content">
                                                                <div className="banner-user-list">
                                                                    <div className="banner-user-list-img">
                                                                       <Link to={`${config.baseUrl}nftDetails/${this.state.getBannerNFTData.id}`}>
                                                                            <img src={`${config.imageUrl1 + this.state.getBannerNFTData1.profile_pic}`} style={{width:'50px',height:'50px'}} alt="Images" />
                                                                        </Link>
                                                                        <i className="icon_check" />
                                                                    </div>
                                                                    <h3><Link to={`${config.baseUrl}nftDetails/${this.state.getBannerNFTData.id}`}>{this.state.getBannerNFTData1.name}</Link></h3>
                                                                    <span>Created by<Link to={`${config.baseUrl}nftDetails/${this.state.getBannerNFTData.id}`}>{this.state.getBannerNFTData1.full_name}</Link></span>
                                                                </div>
                                                                <Link to={`${config.baseUrl}nftDetails/${this.state.getBannerNFTData.id}`} className="banner-user-btn"><i className="arrow_right" /></Link>
                                                                <button type="button" className="default-btn border-radius-5">Place Bid</button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="banner-shape">
                                <div className="shape-circle1">
                                    <img src="images/circle1.png" alt="Images" />
                                </div>
                                <div className="shape-circle2">
                                    <img src="images/circle2.png" alt="Images" />
                                </div>
                            </div>

                        </section>



                        <section id="section-nfts" className="trending-nft">
                            <div className="container-fluid">
                                <div className="row">
                                    <div className="col-lg-12">
                                        <div className="text-left">
                                            <h2 className="blue">Trending <span className='green'>auctions</span> 🔥</h2>
                                            <div className="small-border bg-color-2"></div>
                                        </div>
                                    </div>
                                </div>
                                <div className="row wow fadeIn">
                                    <div className="col-sm-12">
                                        <div className="hot-auction">
                                            <Swiper slidesPerView={3} spaceBetween={30} pagination={{
                                                "clickable": true
                                            }} className="mySwiper">

                                                {this.state.trendingAuctionNfts.map(item => (
                                                    <SwiperSlide>
                                                        <Link id="trending_slider" to={`${config.baseUrl}nftDetails`}>
                                                            <div className="auction-list">
                                                                <div className="auction-img">
                                                                    <img src={`${config.imageUrl + item.image}`} />
                                                                    <button className="btn btn-primary buy-btn"><svg viewBox="0 0 24 24" focusable="false" class="chakra-icon css-1pckyyl" aria-hidden="true"><path fill-rule="evenodd" clip-rule="evenodd" d="M7.11 5.368a4 4 0 000 5.657l6.365 6.364a4 4 0 005.656 0l2.829-2.828a4 4 0 000-5.657L15.596 2.54a4 4 0 00-5.657 0L7.11 5.368zm4.243-1.414L8.525 6.782a2 2 0 000 2.829l5.657-5.657a2 2 0 00-2.829 0zm2.122 10.607l-3.536-3.536 5.657-5.657 3.535 3.536-5.656 5.657zm1.414 1.414a2 2 0 002.828 0l2.829-2.829a2 2 0 000-2.828l-5.657 5.657z" fill="currentColor"></path><path d="M9.232 11.732l-6.01 6.01a2.5 2.5 0 003.535 3.536l6.01-6.01-1.414-1.414-6.01 6.01a.5.5 0 01-.707-.707l6.01-6.01-1.414-1.415z" fill="currentColor"></path></svg>Bid</button>
                                                                </div>
                                                                <div class="chakra-stack css-1wdu7zf">
                                                                    <div class="chakra-stack css-1npz8pa">
                                                                        <p class="chakra-text css-1yfa4pt"><a class="chakra-link css-f4h6uy" href="#">{item.name ? item.name : ''}</a></p>
                                                                        <svg viewBox="0 0 24 24" focusable="false" class="chakra-icon chakra-icon css-100vr6x">
                                                                            <path d="M22 12.469c0 .699-.168 1.347-.504 1.941a3.594 3.594 0 01-1.351 1.383c.015.105.023.27.023.492 0 1.059-.355 1.957-1.059 2.7-.707.745-1.558 1.117-2.554 1.117-.446 0-.871-.082-1.274-.247a3.873 3.873 0 01-1.351 1.551A3.358 3.358 0 0112 22a3.39 3.39 0 01-1.941-.582 3.787 3.787 0 01-1.34-1.563 3.332 3.332 0 01-1.274.247c-.996 0-1.851-.372-2.566-1.118-.715-.742-1.07-1.644-1.07-2.699 0-.117.015-.281.043-.492A3.622 3.622 0 012.5 14.41 3.917 3.917 0 012 12.47c0-.742.188-1.426.559-2.043a3.443 3.443 0 011.496-1.371 3.863 3.863 0 01-.246-1.34c0-1.055.355-1.957 1.07-2.7.715-.742 1.57-1.117 2.566-1.117.446 0 .871.082 1.274.247a3.874 3.874 0 011.351-1.551A3.388 3.388 0 0112 2c.7 0 1.344.2 1.93.59.586.394 1.039.91 1.351 1.55a3.331 3.331 0 011.274-.245c.996 0 1.847.37 2.554 1.117.707.746 1.059 1.644 1.059 2.699 0 .492-.074.937-.223 1.34a3.443 3.443 0 011.496 1.37c.372.622.559 1.306.559 2.048zM11.574 15.48l4.13-6.183a.717.717 0 00.1-.535.654.654 0 00-.3-.446.76.76 0 00-.535-.113.685.685 0 00-.469.29l-3.637 5.468-1.675-1.672a.665.665 0 00-.512-.21.79.79 0 00-.512.21c-.133.133-.2.3-.2.504 0 .2.067.367.2.504l2.3 2.3.114.09c.133.09.27.133.402.133a.655.655 0 00.594-.34z" fill="currentColor"></path>
                                                                        </svg>
                                                                        <div class="css-17xejub"></div>
                                                                    </div>
                                                                    <div class="chakra-stack css-198f9j2">
                                                                        <a class="chakra-link chakra-linkbox__overlay css-1me1ekj" href="#">
                                                                            <p class="chakra-text css-1ucdead">#{item.token_id ? item.token_id : ''}</p>
                                                                        </a>
                                                                        <div class="chakra-stack css-1d1j63x">
                                                                            <p class="chakra-text css-0">
                                                                                ${item.price ? item.price : '0.00'}
                                                                            </p>
                                                                            <svg viewBox="0 0 24 24" focusable="false" class="chakra-icon chakra-icon css-96p3mx">
                                                                                <path fill-rule="evenodd" clip-rule="evenodd" d="M7.11 5.368a4 4 0 000 5.657l6.365 6.364a4 4 0 005.656 0l2.829-2.828a4 4 0 000-5.657L15.596 2.54a4 4 0 00-5.657 0L7.11 5.368zm4.243-1.414L8.525 6.782a2 2 0 000 2.829l5.657-5.657a2 2 0 00-2.829 0zm2.122 10.607l-3.536-3.536 5.657-5.657 3.535 3.536-5.656 5.657zm1.414 1.414a2 2 0 002.828 0l2.829-2.829a2 2 0 000-2.828l-5.657 5.657z" fill="currentColor"></path>
                                                                                <path d="M9.232 11.732l-6.01 6.01a2.5 2.5 0 003.535 3.536l6.01-6.01-1.414-1.414-6.01 6.01a.5.5 0 01-.707-.707l6.01-6.01-1.414-1.415z" fill="currentColor"></path>
                                                                            </svg>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </Link>
                                                    </SwiperSlide>
                                                ))}
                                            </Swiper>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>

                        <section id="section-collections" className="trending-collection bg-grey recent-nft " data-bgcolor="#F7F4FD">
                            <div className="container-fluid">
                                <div className="row">
                                    <div className="col-lg-12">

                                        <div className="row mt-3 mb-5" style={{ backgroundSize: 'cover' }}
                                        ><div className="col-xl-9 col-lg-9 col-md-9 col-sm-12" style={{ backgroundSize: 'cover' }}>
                                                <div className="text-left">
                                                    <h2 className="blue">Trending <span className='green'>collections</span> 🍱</h2>
                                                    <div className="small-border bg-color-2"></div>

                                                </div>
                                            </div>
                                            <div className="col-xl-3 col-lg-3 col-md-3 col-sm-12" style={{ backgroundSize: 'cover' }}>
                                                <div className="form-inline">
                                                    <div className="form-group col-sm-6"></div>
                                                    <div className="form-group col-sm-6 text-center">
                                                        {/* <button className="btn  btn-outline-dark btn-round " style={{ height: '45px' }}>
                                                            View all&nbsp;&nbsp;<i className="arrow_right" style={{ position: 'relative', top: '2px' }}></i>
                                                        </button> */}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-sm-12">
                                        <ol className="author_list">
                                            {this.state.collections.map(item => (
                                                <li>
                                                    <div className="author_list_pp">
                                                        <Link to={`${config.baseUrl}collections/` + item.id}>
                                                            {!item.profile_pic || item.profile_pic == "" || item.profile_pic == null || item.profile_pic == 'null' ?
                                                                <img className="lazy pp-author" src="images/default-user-icon.jpg" alt />
                                                                :
                                                                <img className="lazy pp-author" src={`${config.imageUrl1 + item.profile_pic}`} alt />
                                                            }
                                                        </Link>
                                                    </div>
                                                    <div className="author_list_info">
                                                        <Link to={`${config.baseUrl}collections/` + item.id}>{item.name ? item.name : ''}</Link>
                                                    </div>
                                                </li>
                                            ))}

                                        </ol>

                                    </div>

                                </div>
                            </div>
                        </section>

                        <section id="section-nfts">
                            <div className="container-fluid">
                                <div className="row">
                                    <div className="col-xl-9 col-lg-9 col-md-9 col-sm-12 ">
                                        <div className="text-left">
                                            <h2 class="blue">Trending <span className='green'>NFT</span>🐋</h2>
                                            <div className="small-border bg-color-2"></div>
                                        </div>
                                    </div>

                                    <div className="col-xl-3 col-lg-3 col-md-3 col-sm-12" style={{ backgroundSize: 'cover' }}>
                                        <div className="form-inline">
                                            <div className="form-group col-sm-6 text-center"></div>
                                            <div className="form-group col-sm-6 text-center">
                                                <Link to={`${config.baseUrl}marketplace`}>
                                                    {/* <button className="btn  btn-outline-dark btn-round " style={{ height: '45px' }}>
                                                        View all&nbsp;&nbsp;<i className="arrow_right" style={{ position: 'relative', top: '2px' }}></i>
                                                    </button> */}
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="row wow fadeIn">

                                    <div className="row wow fadeIn">
                                        <div className="col-sm-12">
                                            <div className="hot-auction">
                                                <Swiper slidesPerView={3} spaceBetween={30} pagination={{
                                                    "clickable": true
                                                }} className="mySwiper">
                                                    {this.state.trendingNfts.map(item => (
                                                        <SwiperSlide>
                                                            <Link id="trending_slider" to={`${config.baseUrl}nftDetails`}>
                                                                <div className="auction-list">
                                                                    <div className="auction-img">
                                                                        <img src={`${config.imageUrl + item.image}`} />
                                                                        <button className="btn btn-primary buy-btn"><svg viewBox="0 0 24 24" focusable="false" class="chakra-icon css-1pckyyl" aria-hidden="true"><path fill-rule="evenodd" clip-rule="evenodd" d="M7.11 5.368a4 4 0 000 5.657l6.365 6.364a4 4 0 005.656 0l2.829-2.828a4 4 0 000-5.657L15.596 2.54a4 4 0 00-5.657 0L7.11 5.368zm4.243-1.414L8.525 6.782a2 2 0 000 2.829l5.657-5.657a2 2 0 00-2.829 0zm2.122 10.607l-3.536-3.536 5.657-5.657 3.535 3.536-5.656 5.657zm1.414 1.414a2 2 0 002.828 0l2.829-2.829a2 2 0 000-2.828l-5.657 5.657z" fill="currentColor"></path><path d="M9.232 11.732l-6.01 6.01a2.5 2.5 0 003.535 3.536l6.01-6.01-1.414-1.414-6.01 6.01a.5.5 0 01-.707-.707l6.01-6.01-1.414-1.415z" fill="currentColor"></path></svg>Bid</button>
                                                                    </div>
                                                                    <div class="chakra-stack css-1wdu7zf">
                                                                        <div class="chakra-stack css-1npz8pa">
                                                                            <p class="chakra-text css-1yfa4pt"><a class="chakra-link css-f4h6uy" href="#">{item.name ? item.name : ''}</a></p>
                                                                            <svg viewBox="0 0 24 24" focusable="false" class="chakra-icon chakra-icon css-100vr6x">
                                                                                <path d="M22 12.469c0 .699-.168 1.347-.504 1.941a3.594 3.594 0 01-1.351 1.383c.015.105.023.27.023.492 0 1.059-.355 1.957-1.059 2.7-.707.745-1.558 1.117-2.554 1.117-.446 0-.871-.082-1.274-.247a3.873 3.873 0 01-1.351 1.551A3.358 3.358 0 0112 22a3.39 3.39 0 01-1.941-.582 3.787 3.787 0 01-1.34-1.563 3.332 3.332 0 01-1.274.247c-.996 0-1.851-.372-2.566-1.118-.715-.742-1.07-1.644-1.07-2.699 0-.117.015-.281.043-.492A3.622 3.622 0 012.5 14.41 3.917 3.917 0 012 12.47c0-.742.188-1.426.559-2.043a3.443 3.443 0 011.496-1.371 3.863 3.863 0 01-.246-1.34c0-1.055.355-1.957 1.07-2.7.715-.742 1.57-1.117 2.566-1.117.446 0 .871.082 1.274.247a3.874 3.874 0 011.351-1.551A3.388 3.388 0 0112 2c.7 0 1.344.2 1.93.59.586.394 1.039.91 1.351 1.55a3.331 3.331 0 011.274-.245c.996 0 1.847.37 2.554 1.117.707.746 1.059 1.644 1.059 2.699 0 .492-.074.937-.223 1.34a3.443 3.443 0 011.496 1.37c.372.622.559 1.306.559 2.048zM11.574 15.48l4.13-6.183a.717.717 0 00.1-.535.654.654 0 00-.3-.446.76.76 0 00-.535-.113.685.685 0 00-.469.29l-3.637 5.468-1.675-1.672a.665.665 0 00-.512-.21.79.79 0 00-.512.21c-.133.133-.2.3-.2.504 0 .2.067.367.2.504l2.3 2.3.114.09c.133.09.27.133.402.133a.655.655 0 00.594-.34z" fill="currentColor"></path>
                                                                            </svg>
                                                                            <div class="css-17xejub"></div>
                                                                        </div>
                                                                        <div class="chakra-stack css-198f9j2">
                                                                            <a class="chakra-link chakra-linkbox__overlay css-1me1ekj" href="#">
                                                                                <p class="chakra-text css-1ucdead">#{item.token_id ? item.token_id : ''}</p>
                                                                            </a>
                                                                            <div class="chakra-stack css-1d1j63x">
                                                                                <p class="chakra-text css-0">
                                                                                    ${item.price ? item.price : '0.00'}
                                                                                </p>
                                                                                <svg viewBox="0 0 24 24" focusable="false" class="chakra-icon chakra-icon css-96p3mx">
                                                                                    <path fill-rule="evenodd" clip-rule="evenodd" d="M7.11 5.368a4 4 0 000 5.657l6.365 6.364a4 4 0 005.656 0l2.829-2.828a4 4 0 000-5.657L15.596 2.54a4 4 0 00-5.657 0L7.11 5.368zm4.243-1.414L8.525 6.782a2 2 0 000 2.829l5.657-5.657a2 2 0 00-2.829 0zm2.122 10.607l-3.536-3.536 5.657-5.657 3.535 3.536-5.656 5.657zm1.414 1.414a2 2 0 002.828 0l2.829-2.829a2 2 0 000-2.828l-5.657 5.657z" fill="currentColor"></path>
                                                                                    <path d="M9.232 11.732l-6.01 6.01a2.5 2.5 0 003.535 3.536l6.01-6.01-1.414-1.414-6.01 6.01a.5.5 0 01-.707-.707l6.01-6.01-1.414-1.415z" fill="currentColor"></path>
                                                                                </svg>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </Link>
                                                        </SwiperSlide>
                                                    ))}
                                                </Swiper>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>
                        <section id="section-collections" className="trending-collection bg-grey recent-nft " data-bgcolor="#F7F4FD">
                            <div className="container-fluid">
                                <div className="row">
                                    <div className="col-lg-12">

                                        <div className="row mt-3 mb-5" style={{ backgroundSize: 'cover' }}
                                        ><div className="col-xl-9 col-lg-9 col-md-9 col-sm-12" style={{ backgroundSize: 'cover' }}>
                                                <div className="text-left">
                                                    <h2 class="blue">Top <span className='green'>Artists </span></h2>
                                                    <div className="small-border bg-color-2"></div>

                                                </div>
                                            </div>
                                            <div className="col-xl-3 col-lg-3 col-md-3 col-sm-12" style={{ backgroundSize: 'cover' }}>
                                                <div className="form-inline">
                                                    <div className="form-group col-sm-6"></div>
                                                    <div className="form-group col-sm-6">
                                                        {/* <button className="btn  btn-outline-dark btn-round " style={{ height: '45px' }}>
                                                            View all&nbsp;&nbsp;<i className="arrow_right" style={{ position: 'relative', top: '2px' }}></i>
                                                        </button> */}
                                                    </div>

                                                </div>
                                            </div>

                                        </div>
                                    </div>
                                    <div className="col-sm-12">
                                        <ol className="author_list">
                                            {this.state.collections.map(item => (
                                                <li>
                                                    <div className="author_list_pp">
                                                        <Link to={`${config.baseUrl}collections/` + item.id}>
                                                            {!item.profile_pic || item.profile_pic == "" || item.profile_pic == null || item.profile_pic == 'null' ?
                                                                <img className="lazy pp-author" src="images/default-user-icon.jpg" alt />
                                                                :
                                                                <img className="lazy pp-author" src={`${config.imageUrl1 + item.profile_pic}`} alt />
                                                            }
                                                        </Link>
                                                    </div>
                                                    <div className="author_list_info">
                                                        <Link to={`${config.baseUrl}collections/` + item.id}>{item.name ? item.name : ''}</Link>
                                                    </div>
                                                </li>
                                            ))}

                                        </ol>

                                    </div>

                                </div>
                            </div>

                        </section>
                        <section id="section-collections" className="trending-collection discover  recent-nft" data-bgcolor="#F7F4FD">
                            <div className="container-fluid">
                                <div className="row">
                                    <div className="col-xl-9 col-lg-9 col-md-9 col-sm-12 ">
                                        <div className="text-left">
                                            <h2 class="blue">Marketplace</h2>
                                            <div className="small-border bg-color-2"></div>
                                        </div>
                                    </div>

                                    <div className="col-xl-3 col-lg-3 col-md-3 col-sm-12" style={{ backgroundSize: 'cover' }}>
                                        <div className="form-inline">
                                            <div className="form-group col-sm-6 text-center"></div>
                                            <div className="form-group col-sm-6 text-center">
                                                <Link to={`${config.baseUrl}marketplace`}>
                                                    {/* <button className="btn  btn-outline-dark btn-round " style={{ height: '45px' }}>
                                                        View all&nbsp;&nbsp;<i className="arrow_right" style={{ position: 'relative', top: '2px' }}></i>
                                                    </button> */}
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-lg-12">
                                        <div className="row mt-0">

                                            <div className="col-sm-12">
                                                <hr className="mt-2" />
                                                <div class="tab-content" id="pills-tabContent">
                                                    <div class="tab-pane fade show active" id="pills-home" role="tabpanel" aria-labelledby="pills-home-tab">
                                                        <div className="discover-list-itme">
                                                            <ul>
                                                                {this.state.allNfts.map((item,i) => (
                                                                    i>7 ||
                                                                    <li>
                                                                        <Link to={`${config.baseUrl}nftDetails`} >
                                                                            <div className="auction-list">
                                                                                <div className="auction-img">
                                                                                    <img src={`${config.imageUrl + item.image}`} />
                                                                                    <button className="btn btn-primary buy-btn"><svg viewBox="0 0 24 24" focusable="false" class="chakra-icon css-1pckyyl" aria-hidden="true"><path fill-rule="evenodd" clip-rule="evenodd" d="M12.361 13l-.985 5.91L17.09 11h-5.45l.985-5.91L6.912 13h5.449zm2.938-11.79C15.472.167 14.12-.397 13.502.46L4.145 13.414A1 1 0 004.955 15H10l-1.298 7.79c-.174 1.043 1.178 1.607 1.797.75l9.356-12.954A1 1 0 0019.045 9H14L15.3 1.21z" fill="currentColor"></path></svg>&nbsp;{item.sell_type == 1? 'Buy' : 'Bid'}</button>
                                                                                </div>
                                                                                <div class="chakra-stack css-1wdu7zf">
                                                                                    <div class="chakra-stack css-1npz8pa">
                                                                                        <p class="chakra-text css-1yfa4pt"><a class="chakra-link css-f4h6uy" href="#">{item.name ? item.name : ''}</a></p>
                                                                                        <svg viewBox="0 0 24 24" focusable="false" class="chakra-icon chakra-icon css-100vr6x">
                                                                                            <path d="M22 12.469c0 .699-.168 1.347-.504 1.941a3.594 3.594 0 01-1.351 1.383c.015.105.023.27.023.492 0 1.059-.355 1.957-1.059 2.7-.707.745-1.558 1.117-2.554 1.117-.446 0-.871-.082-1.274-.247a3.873 3.873 0 01-1.351 1.551A3.358 3.358 0 0112 22a3.39 3.39 0 01-1.941-.582 3.787 3.787 0 01-1.34-1.563 3.332 3.332 0 01-1.274.247c-.996 0-1.851-.372-2.566-1.118-.715-.742-1.07-1.644-1.07-2.699 0-.117.015-.281.043-.492A3.622 3.622 0 012.5 14.41 3.917 3.917 0 012 12.47c0-.742.188-1.426.559-2.043a3.443 3.443 0 011.496-1.371 3.863 3.863 0 01-.246-1.34c0-1.055.355-1.957 1.07-2.7.715-.742 1.57-1.117 2.566-1.117.446 0 .871.082 1.274.247a3.874 3.874 0 011.351-1.551A3.388 3.388 0 0112 2c.7 0 1.344.2 1.93.59.586.394 1.039.91 1.351 1.55a3.331 3.331 0 011.274-.245c.996 0 1.847.37 2.554 1.117.707.746 1.059 1.644 1.059 2.699 0 .492-.074.937-.223 1.34a3.443 3.443 0 011.496 1.37c.372.622.559 1.306.559 2.048zM11.574 15.48l4.13-6.183a.717.717 0 00.1-.535.654.654 0 00-.3-.446.76.76 0 00-.535-.113.685.685 0 00-.469.29l-3.637 5.468-1.675-1.672a.665.665 0 00-.512-.21.79.79 0 00-.512.21c-.133.133-.2.3-.2.504 0 .2.067.367.2.504l2.3 2.3.114.09c.133.09.27.133.402.133a.655.655 0 00.594-.34z" fill="currentColor"></path>
                                                                                        </svg>
                                                                                        <div class="css-17xejub"></div>
                                                                                    </div>
                                                                                    <div class="chakra-stack css-198f9j2">
                                                                                        <a class="chakra-link chakra-linkbox__overlay css-1me1ekj" href="#">
                                                                                            <p class="chakra-text css-1ucdead">#{item.token_id ? item.token_id : ''}</p>
                                                                                        </a>
                                                                                        <div class="chakra-stack css-1d1j63x">
                                                                                            <p class="chakra-text css-0">
                                                                                                ${item.price ? item.price : ''}
                                                                                            </p>
                                                                                            <svg viewBox="0 0 24 24" focusable="false" class="chakra-icon chakra-icon css-96p3mx">
                                                                                                <path fill-rule="evenodd" clip-rule="evenodd" d="M7.11 5.368a4 4 0 000 5.657l6.365 6.364a4 4 0 005.656 0l2.829-2.828a4 4 0 000-5.657L15.596 2.54a4 4 0 00-5.657 0L7.11 5.368zm4.243-1.414L8.525 6.782a2 2 0 000 2.829l5.657-5.657a2 2 0 00-2.829 0zm2.122 10.607l-3.536-3.536 5.657-5.657 3.535 3.536-5.656 5.657zm1.414 1.414a2 2 0 002.828 0l2.829-2.829a2 2 0 000-2.828l-5.657 5.657z" fill="currentColor"></path>
                                                                                                <path d="M9.232 11.732l-6.01 6.01a2.5 2.5 0 003.535 3.536l6.01-6.01-1.414-1.414-6.01 6.01a.5.5 0 01-.707-.707l6.01-6.01-1.414-1.415z" fill="currentColor"></path>
                                                                                            </svg>
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        </Link>
                                                                    </li>
                                                                ))}
                                                            </ul>


                                                        </div>
                                                    </div>
                                                    <div class="tab-pane fade" id="pills-contact" role="tabpanel" aria-labelledby="pills-contact-tab"><p>Est quis nulla laborum officia ad nisi ex nostrud culpa Lorem excepteur aliquip dolor aliqua irure ex. Nulla ut duis ipsum nisi elit fugiat commodo sunt reprehenderit laborum veniam eu veniam. Eiusmod minim exercitation fugiat irure ex labore incididunt do fugiat commodo aliquip sit id deserunt reprehenderit aliquip nostrud. Amet ex cupidatat excepteur aute veniam incididunt mollit cupidatat esse irure officia elit do ipsum ullamco Lorem.</p></div>
                                                </div>

                                            </div>



                                        </div>
                                    </div>
                                    <div className="col-sm-12">



                                    </div>

                                </div>
                            </div>

                        </section>


                        <section id="section-steps" data-bgcolor="#F7F4FD" className="bg-grey">
                            <div className="container-fluid">
                                <div className="row">
                                    <div className="col-lg-12">
                                        <div className="text-left">
                                            <h2 class="blue">How to get <span className='green'>started:</span></h2>
                                            <div className="small-border bg-color-2"></div>
                                        </div>
                                    </div>
                                    <div className="col-lg-4 col-md-6 mb-sm-30">
                                        <div className="feature-box f-boxed style-3">
                                            <i className="wow fadeInUp bg-color-1 i-boxed icon_wallet"></i>
                                            <div className="text">
                                                <h4 className="wow fadeInUp">Set up your wallet</h4>
                                                <p className="wow fadeInUp" data-wow-delay=".25s">Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem.</p>
                                            </div>
                                            <i className="wm icon_wallet"></i>
                                        </div>
                                    </div>
                                    <div className="col-lg-4 col-md-6 mb-sm-30">
                                        <div className="feature-box f-boxed style-3">
                                            <i className="wow fadeInUp bg-color-1 i-boxed icon_cloud-upload_alt"></i>
                                            <div className="text">
                                                <h4 className="wow fadeInUp">Add your NFT's</h4>
                                                <p className="wow fadeInUp" data-wow-delay=".25s">Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem.</p>
                                            </div>
                                            <i className="wm icon_cloud-upload_alt"></i>
                                        </div>
                                    </div>
                                    <div className="col-lg-4 col-md-6 mb-sm-30">
                                        <div className="feature-box f-boxed style-3">
                                            <i className="wow fadeInUp bg-color-1 i-boxed icon_tags_alt"></i>
                                            <div className="text">
                                                <h4 className="wow fadeInUp">Sell your NFT's</h4>
                                                <p className="wow fadeInUp" data-wow-delay=".25s">Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem.</p>
                                            </div>
                                            <i className="wm icon_tags_alt"></i>
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



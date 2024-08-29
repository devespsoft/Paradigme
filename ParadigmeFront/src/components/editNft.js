import React, { Component } from 'react';
import axios from 'axios';
import Header from '../directives/header'
import Footer from '../directives/footer'
import config from '../config/config'
import { Dialog, Classes } from "@blueprintjs/core";
import { Player } from 'video-react';
import Cookies from 'js-cookie';
import toast, { Toaster } from 'react-hot-toast';
import DatePicker from "react-datepicker";
import reactImageSize from 'react-image-size';
import ReactTooltip from 'react-tooltip';
export default class createnft extends Component {

    constructor(props) {
        super(props)
        this.state = {
            name: '',
            description: '',
            user_collection_id: '0',
            item_category_id: '0',
            royalty_percent: '0',
            methodType: '1',
            sell_type: '1',
            price: '0',
            minimum_bid: '0',
            start_date: '',
            expiry_date: '',
            image_file: '',
            image_preview: '',
            categoryData: [],
            collectionData: [],
            spinLoader: '0',
            currentDate: '',
            endDate: '',
            ImageFileHash: '',
            popupData: false,
            token_id: '',
            MATICtoUsdprice: '0.00',
            rows1: [''],
            royaltiesAddress: [{ 'royaltiesAddress': '' }]

        }
        this.loginData = (!Cookies.get('loginSuccessParadigme')) ? [] : JSON.parse(Cookies.get('loginSuccessParadigme'));
        this.token = (!Cookies.get('token')) ? [] : JSON.parse(Cookies.get('token'));
        this.updateNftAPI = this.updateNftAPI.bind(this)
        this.onChange = this.handleChange.bind(this);

        const { match: { params } } = this.props;
        this.id = params.id
    }

    componentDidMount() {

        // var startDate = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');
        // var array = startDate.split(' ');
        // if (array[0]) {
        //     this.setState({
        //         currentDate: array[0],
        //         endDate: array[0]
        //     })
        // }
        this.setState({
            currentDate: new Date(),
            endDate: new Date()
        })

        Cookies.set('selectedTab', '1');

        if (!this.loginData?.id) {
            window.location.href = `${config.baseUrl}`
        }
        this.getCategoryAPI()
        this.getUserCollectionAPI()
        this.getNftDetailsAPI()
        this.getETHToUsd();
    }

    async getETHToUsd() {
        await axios({
            method: 'get',
            url: `https://api.binance.com/api/v3/ticker/price?symbol=MATICUSDT`,
        }).then(response => {
            this.setState({
                'MATICtoUsdprice': response.data.price
            })
        })
    }

    async getNftDetailsAPI() {
        await axios({
            method: 'post',
            url: `${config.apiUrl}itemDetail`,
            data: { 'item_id': this.id, 'user_id': '0' }
        }).then(response => {
            if (response.data.success === true) {
                let arr = JSON.parse(response.data.response?.royaltiesAddress);
                this.setState({
                    nftData: response.data.response,
                    rows1: arr,
                })
            }
        })
    }

    async getCategoryAPI() {
        await axios({
            method: 'get',
            url: `${config.apiUrl}getCategory`,
        }).then(response => {
            if (response.data.success === true) {
                this.setState({
                    categoryData: response.data.response
                })
            }
        })
    }

    async getUserCollectionAPI() {
        await axios({
            method: 'post',
            url: `${config.apiUrl}getUserCollection`,
            data: { "user_id": this.loginData?.id }
        }).then(response => {
            if (response.data.success === true) {
                this.setState({
                    collectionData: response.data.response
                })
            }
        })
    }

    toBase64 = file => new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });

    nftimageChange = async (e) => {
        let image_as_base64 = URL.createObjectURL(e.target.files[0])
        let image_as_files = e.target.files[0];

        if (image_as_files.type.indexOf('image') === 0) {
            var file_type = 'image';
        } else {
            var file_type = 'video';
        }

        this.setState(prevState => ({
            nftData: { ...prevState.nftData, ['file_type']: file_type }
        }))

        let dd = await this.toBase64(e.target.files[0]);
        const { width, height } = await reactImageSize(dd);
        if (height >= 600 && width >= 600) {
            this.setState({
                image_preview: image_as_base64,
                image_file: image_as_files,
                file_type: file_type,
                image_type: e.target.files[0].type,
                imageError: "",
                imageSizeError: ''
            })
        } else {
            this.setState({
                imageSizeError: 'Height and width must be greater than or equal to 600px and 600px!!'
            })
        }

    }

    handleChange = e => {

        if (e.target.name == 'name') {
            this.setState({
                'nameError': ""
            })
        }

        if (e.target.name == 'description') {
            this.setState({
                'descError': ""
            })
        }

        if (e.target.name == 'user_collection_id') {
            this.setState({
                'collectionError': ""
            })
        }

        if (e.target.name == 'item_category_id') {
            this.setState({
                'categoryError': ""
            })
        }

        if (e.target.name == 'start_date') {
            this.setState(prevState => ({
                nftData: { ...prevState.nftData, ['start_date1']: e.target.value }
            }))

            this.setState({
                endDate: e.target.value
            })

        }

        if (e.target.name == 'expiry_date') {
            this.setState(prevState => ({
                nftData: { ...prevState.nftData, ['expiry_date1']: e.target.value }
            }))
        }

        if (e.target.name == 'minimum_bid_amount') {
            this.setState(prevState => ({
                nftData: { ...prevState.nftData, ['price']: e.target.value }
            }))
        }

        this.setState({
            [e.target.name]: e.target.value
        })

        let value = e.target.value;
        this.setState(prevState => ({
            nftData: { ...prevState.nftData, [e.target.name]: value }
        }))
    }

    handleChangeStartDate = e => {
        let startDate = this.formatDate(e);
        this.setState(prevState => ({
            nftData: { ...prevState.nftData, ['start_date1']: startDate }
        }))
    }

    handleChangeEndDate = e => {
        let endDate = this.formatDate(e);
        this.setState(prevState => ({
            nftData: { ...prevState.nftData, ['expiry_date1']: endDate }
        }))
    }

    formatDate(str) {
        var date = new Date(str),
            mnth = ("0" + (date.getMonth() + 1)).slice(-2),
            day = ("0" + date.getDate()).slice(-2);
        return [date.getFullYear(), mnth, day].join("-");
    }

    sellType(type) {
        this.setState({
            'sell_type': type
        })

        this.setState(prevState => ({
            nftData: { ...prevState.nftData, ['sell_type']: type }
        }))
    }

    validate = () => {
        // var [  descError, imageError, collectionError, categoryError, blockchainTypeError, priceError, minimumBidAmountError, startDateError, endDateError ] = ["", "", "", "", "", "", "", "", "", ""];

        let nameError = "";
        let descError = "";
        let imageError = "";
        let collectionError = "";
        let categoryError = "";
        let priceError = "";
        let minimumBidAmountError = "";
        let startDateError = "";
        let endDateError = "";

        if (this.state.nftData?.name === '') {
            nameError = "Title field is required."
        }
        if (this.state.nftData?.description === '') {
            descError = "Description field is required."
        }
        if (this.state.nftData?.user_collection_id === '0' || this.state.nftData?.user_collection_id === '') {
            collectionError = "Collection field is required."
        }
        if (this.state.nftData?.item_category_id === '0' || this.state.nftData?.item_category_id == '') {
            categoryError = "Category field is required."
        }

        if (this.state.nftData?.sell_type == '1') {
            if (!this.state.nftData?.price || this.state.nftData?.price == '0' || this.state.nftData?.price == '') {
                priceError = "Price field is required."
            }
        }
        else if (this.state.nftData?.sell_type == '2') {
            if (!this.state.nftData?.price || this.state.nftData?.price == '0' || this.state.nftData?.price == '') {
                minimumBidAmountError = "Minimum bid field is required."
            }

            if (!this.state.nftData?.start_date1 || this.state.nftData?.start_date1 == '0000-00-00' || this.state.nftData?.start_date1 == '') {
                startDateError = "Start date field is required."
            }

            if (!this.state.nftData?.expiry_date1 || this.state.nftData?.expiry_date1 == '0000-00-00' || this.state.nftData?.expiry_date1 == '') {
                endDateError = "End date field is required."
            }
        }

        if (nameError || descError || collectionError || categoryError || priceError || minimumBidAmountError || startDateError || endDateError) {
            window.scrollTo(0, 220)
            this.setState({
                nameError, descError, categoryError, collectionError, priceError, minimumBidAmountError, startDateError, endDateError
            })
            return false
        }
        return true
    }

    async imageUpload() {
        let formData1 = new FormData();
        formData1.append('file', this.state.image_file);
        const url = `https://api.pinata.cloud/pinning/pinFileToIPFS`;
        let resIPF = await axios.post(url,
            formData1,
            {
                headers: {
                    'Content-Type': `multipart/form-data; boundary= ${formData1._boundary}`,
                    'pinata_api_key': '344e7ffaf4699a2f8c05',
                    'pinata_secret_api_key': 'd9502a6470fbe256e6edef484a8fd794c11b284abd3500babe45870dc02d5a70'
                }
            }
        );
        let ipfsImg = resIPF.data.IpfsHash;
        this.setState({
            ImageFileHash: ipfsImg
        })
        return ipfsImg;
    }

    async metaDataUpload(file) {
        let resIPF = await axios({
            method: 'post',
            url: `${config.apiUrl}updateMetadata`,
            data: {
                "tokenid": this.state.nftData?.token_id,
                "name": this.state.nftData?.name,
                "description": this.state.nftData?.description,
                "image": `https://meme.mypinata.cloud/ipfs/${this.state.image_preview ? this.state.ImageFileHash : this.state.nftData?.image}`
            }
        });
        let status = resIPF.data.status;
        this.setState({
            token_id: status
        })
        return status;

    }

    async updateNftAPI(e) {
        e.preventDefault();
        const isValid = this.validate()
        if (!isValid) {

        }
        else {
            this.setState({
                spinLoader: '1',
                // isDialogOpen: true
            })

            let ImageFileHash = this.state.ImageFileHash;
            if (this.state.image_preview) {
                ImageFileHash = await this.imageUpload();
            } else {
                ImageFileHash = this.state.nftData?.image;
            }

            await this.metaDataUpload();

            let getRoyaltiesAddress = document.getElementsByClassName('royaltiesAddress');
            let royaltiesAddress = []
            if (getRoyaltiesAddress.length > 0) {
                for (let i = 0; i < getRoyaltiesAddress.length; i++) {
                    if (getRoyaltiesAddress[i].value) {
                        royaltiesAddress[i] = {
                            'royaltiesAddress': getRoyaltiesAddress[i].value
                        }
                    }
                }
            }

            let formData = new FormData();

            formData.append('royaltiesAddress', JSON.stringify(royaltiesAddress));
            formData.append('price', this.state.nftData?.price);
            formData.append('item_id', this.state.nftData?.item_id);
            formData.append('image', ImageFileHash);
            formData.append('name', this.state.nftData?.name);
            formData.append('is_minted', this.state.nftData?.is_minted);
            formData.append('file_type', this.state.file_type ? this.state.file_type : this.state.nftData?.file_type);
            formData.append('royalty_percent', this.state.nftData?.royalty_percent);
            formData.append('description', this.state.nftData?.description);
            formData.append('start_date', this.state.nftData?.start_date1 ? this.formatDate(this.state.nftData?.start_date1) : '');
            formData.append('expiry_date', this.state.nftData?.expiry_date1 ? this.formatDate(this.state.nftData?.expiry_date1) : '');
            formData.append('item_category_id', this.state.nftData?.item_category_id);
            formData.append('user_collection_id', this.state.nftData?.user_collection_id);
            formData.append('sell_type', this.state.nftData?.sell_type);
            formData.append('user_id', this.loginData?.id);
            formData.append('email', this.loginData?.user_email);
            formData.append('to_address', this.loginData?.address);

            axios.post(`${config.apiUrl}updateNftByUser`, formData)
                .then(result => {

                    this.setState({
                        spinLoader: '0'
                    })

                    if (result.data.success === true) {
                        // toast.success(result.data.msg);
                        // setTimeout(() => {
                        //     window.location.href = `${config.baseUrl}accountsetting`
                        // }, 2000);

                        this.setState({
                            popupData: true
                        })

                    } else {
                        toast.error(result.data.msg);
                        this.setState({
                            spinLoader: '0'
                        })
                    }
                }).catch(err => {
                    toast.error(err.response.data?.msg,

                    );
                    this.setState({
                        spinLoader: '0'
                    })
                })
        }
    }

    movePage() {
        window.location.href = `${config.baseUrl}accountsetting`
    }

    addNewRow = (i) => {
        var rows = this.state.rows1
        rows.push({ 'royaltiesAddress': '' })
        this.setState({ royaltiesAddress: rows })
    }

    spliceRow = (i) => {
        const rows = this.state.rows1;
        rows.splice(i, 1)
        this.setState({ royaltiesAddress: rows })
    }

    handleChange1 = e => {
        var key = e.target.id;
        let arr = this.state.rows1;
        arr[key] = e.target.value
        this.setState({
            rows1: arr
        })
    }

    render() {
        return (

            <>
                <Header />
                <Toaster />

                <Dialog
                    title="Please Wait..."
                    style={{
                        color: '#000',
                        textAlign: "center"
                    }}
                    isOpen={this.state.isDialogOpen}
                    isCloseButtonShown={false}
                >
                    <div className="text-center pl-3 pr-3">
                        < br />
                        <h4 style={{ color: '#000', fontSize: '16px' }}>NFT data updating in progress, once process completed NFT will be display on your portfolio page.</h4>
                        <p style={{ color: '#091f3f' }}>
                            Please do not refresh page or close tab.
                        </p>
                        <div>
                            <div class="spinner-border"></div>
                        </div>
                    </div>
                </Dialog>

                <Dialog
                    title={`You Updated-${this.state.nftData?.name}`}
                    style={{
                        color: '#000',
                        textAlign: "center"
                    }}
                    isOpen={this.state.popupData}
                    isCloseButtonShown={false}
                >
                    <div className="text-center pl-3 pr-3">
                        < br />
                        <h4 style={{ color: '#000', fontSize: '16px' }}>To get set up for selling on marketplace, please put the item on sale from portfolio page.</h4>
                        <div className='mb-3'>
                            {this.state.image_preview ?
                                <img src={`${this.state.image_preview}`} width="150px" />
                                :
                                <img src={`${config.imageUrl + this.state.nftData?.image}`} width="150px" />
                            }

                        </div>
                        <button type='button' className='btn btn-primary' onClick={this.movePage.bind(this)}>Ok</button>
                    </div>
                </Dialog>

                <div className="no-bottom no-top" id="content">
                    <div id="top" />
                    {/* section begin */}
                    <section id="subheader" className="text-light" style={{ backgroundImage: `url("images/inner-banner11.jpg")`, backgroundSize: 'cover' }}>
                        <div className="center-y relative text-center">
                            <div className="container">
                                <div className="row">
                                    <div className="col-md-12 text-center">
                                        <h1>Edit NFT</h1>
                                    </div>
                                    <div className="clearfix" />
                                </div>
                            </div>
                        </div>
                    </section>

                    <section aria-label="section">
                        <div className="container">
                            <div className="row wow fadeIn">
                                <div className="col-lg-8 offset-lg-1">
                                    <form id="form-create-item" className="form-border" method="post" action="email.php">
                                        <div className="field-set">

                                            <h5>Upload file</h5>
                                            <div className=" col-sm-4 col-8">
                                                <p >File types supported: PNG, JPG, GIF or WEBP</p>
                                                <div className="d-create-file">
                                                    {this.state.nftData?.file_type === 'image' ?
                                                        this.state.image_preview === '' ?
                                                            <img style={{ height: '150px', width: '150px', marginTop: '20px' }} id="image" className="object-cover w-full h-32" src={`${config.imageUrl}` + this.state.nftData?.image} />
                                                            :
                                                            <img style={{ height: '150px', width: '150px', marginTop: '20px' }} id="image" className="object-cover w-full h-32" src={this.state.image_preview} />

                                                        :
                                                        this.state.nftData?.file_type === 'video' ?
                                                            this.state.image_preview != '' ?
                                                                <Player style={{ height: '50px', width: '50px', marginTop: '20px' }} id="image" className="" src={this.state.image_preview} />
                                                                :
                                                                <Player id="image" className="" src={`${config.imageUrl}` + this.state.nftData?.image} />
                                                            : ""
                                                    }


                                                    <input type="button" id="get_file" className="btn-main" defaultValue="Browse" />
                                                    <input type="file" accept=".png,.jpg,.gif,.webo,.mp4" onChange={this.nftimageChange.bind(this)} id="upload_file" name="image" />
                                                </div>
                                                <span className="error-asterick"> {this.state.imageSizeError}</span>

                                            </div>



                                            {/* <h5>Image</h5>
                                            <div className="d-create-file col-sm-4">

                                                {this.state.nftData?.file_type === 'image' ?
                                                    this.state.image_preview === '' ?
                                                        <img style={{ height: '150px', width: '150px' }} id="image" className="object-cover w-full h-32" src={`${config.imageUrl}` + this.state.nftData?.image} />
                                                        :
                                                        <img style={{ height: '150px', width: '150px' }} id="image" className="object-cover w-full h-32" src={this.state.image_preview} />

                                                    :
                                                    this.state.nftData?.file_type === 'video' ?
                                                        this.state.image_preview != '' ?
                                                            <Player style={{ height: '50px', width: '50px' }} id="image" className="" src={this.state.image_preview} />
                                                            :
                                                            <Player id="image" className="" src={`${config.imageUrl}` + this.state.nftData?.image} />
                                                        : ""
                                                }
                                                <p id="file_name">PNG, JPG, GIF or WEBP</p>
                                                <input type="button" id="get_file" className="btn-main" defaultValue="Browse" />
                                                <input type="file" accept=".png,.jpg,.gif,.webo,.mp4" onChange={this.nftimageChange.bind(this)} id="upload_file" name="image" />
                                                <span className="error-asterick"> {this.state.imageSizeError}</span>
                                                <span className="error-asterick"> {this.state.imageError}</span>
                                            </div> */}

                                            <div className="spacer-single" />
                                            <h5>Title</h5>
                                            <input maxLength="150" type="text" name="name" onChange={this.handleChange} id="item_title" value={this.state.nftData?.name} className="form-control" placeholder="e.g. 'Crypto Funk" />
                                            <span className="error-asterick"> {this.state.nameError}</span>
                                            <div className="spacer-10" />

                                            <h5>Description</h5>
                                            <p style={{ color: 'rgb(110, 119, 128)' }}>The description will be included on the item's detail page underneath its image</p>
                                            <textarea maxLength="500" style={{ minHeight: '100px' }} data-autoresize name="description" onChange={this.handleChange} id="item_desc" className="form-control" placeholder="e.g. 'This is very limited item'" rows="10" value={this.state.nftData?.description} ></textarea>
                                            <span className="error-asterick"> {this.state.descError}</span>
                                            <div className="spacer-10" />
                                            <div className="collection-drop">
                                                <h5>Collection</h5>
                                                <p style={{ color: 'rgb(110, 119, 128)', fontSize: '13px' }}>This is the collection where your item will appear</p>
                                                <select onChange={this.handleChange} value={this.state.nftData?.user_collection_id} className="form-control" name="user_collection_id">
                                                    <option value="">Select Collection</option>
                                                    {this.state.collectionData.map((item) => (
                                                        <option value={item.collection_id}>{item.name}</option>
                                                    ))}
                                                </select>
                                                <span className="error-asterick"> {this.state.collectionError}</span>
                                                <h5>Categories</h5>
                                                <select onChange={this.handleChange} value={this.state.nftData?.item_category_id} className="form-control" name="item_category_id">
                                                    <option value="">Select Category</option>
                                                    {this.state.categoryData.map((item) => (
                                                        <option value={item.id}>{item.name}</option>
                                                    ))}
                                                </select>
                                                <span className="error-asterick"> {this.state.categoryError}</span>
                                            </div>
                                            <div className="spacer-10" />
                                            <h5>Royalties</h5>
                                            <input onKeyPress={(event) => { if (!/^\d*[.]?\d{0,1}$/.test(event.key)) { event.preventDefault(); } }} type="text" value={this.state.nftData?.royalty_percent} onChange={this.handleChange} name="royalty_percent" id="item_royalties" className="form-control" placeholder="suggested: 0%, 5%, 10%, 20%. Maximum is 25%" />
                                            <div className="spacer-10" />
                                            <h5>Select sale method</h5>
                                            <div className="de_tab tab_methods">
                                                <ul className="de_nav">
                                                    <li onClick={this.sellType.bind(this, 1)} className={this.state.nftData?.sell_type == 1 ? 'active' : ''}><span><i className="fa fa-tag" />Price</span>
                                                    </li>
                                                    <li className={this.state.nftData?.sell_type == 2 ? 'active' : ''} onClick={this.sellType.bind(this, 2)}><span><i className="fa fa-hourglass-1" />Timed auction</span>
                                                    </li>
                                                </ul>
                                                <div className="de_tab_content">
                                                    {this.state.nftData?.sell_type === 1 ?
                                                        <>
                                                            <h5>Price</h5>
                                                            <input type="text" onKeyPress={(event) => { if (!/^\d*[.]?\d{0,1}$/.test(event.key)) { event.preventDefault(); } }} onChange={this.handleChange} value={this.state.nftData?.price} name="price" id="item_price_bid" className="form-control" placeholder="Enter Price" />
                                                            <span>{this.state.nftData?.price ? this.state.nftData?.price + ' ETH ~ $' + parseFloat(this.state.MATICtoUsdprice * this.state.nftData?.price).toFixed(2) : '0 ETH ~ $0.00'}</span>
                                                        </>

                                                        :
                                                        this.state.nftData?.sell_type === 2 ?
                                                            <>
                                                                <h5>Minimum bid</h5>
                                                                <input type="text" onKeyPress={(event) => { if (!/^\d*[.]?\d{0,1}$/.test(event.key)) { event.preventDefault(); } }} name="minimum_bid_amount" onChange={this.handleChange} value={this.state.nftData?.price} id="item_price_bid" className="form-control" placeholder="Enter Minimum Bid" />
                                                                <span>{this.state.nftData?.price ? this.state.nftData?.price + ' ETH ~ $' + parseFloat(this.state.MATICtoUsdprice * this.state.nftData?.price).toFixed(2) : '0 ETH ~ $0.00'}</span>
                                                                <div className="spacer-10" />

                                                                <div className="row">
                                                                    <div className="col-md-6">
                                                                        <h5>Starting date</h5>
                                                                        <DatePicker autoComplete="off" name="start_date" className="form-control" minDate={this.state.currentDate} value={this.state.nftData?.start_date1} onChange={this.handleChangeStartDate} />
                                                                        <span className="error-asterick"> {this.state.startDateError}</span>
                                                                    </div>
                                                                    <div className="col-md-6">
                                                                        <h5>Expiration date</h5>
                                                                        <DatePicker autoComplete="off" name="expiry_date" className="form-control" minDate={this.state.currentDate} value={this.state.nftData?.expiry_date1} onChange={this.handleChangeEndDate} />
                                                                        <span className="error-asterick"> {this.state.endDateError}</span>
                                                                    </div>
                                                                    <div className="spacer-single" />
                                                                </div>

                                                            </>
                                                            :

                                                            ""
                                                    }
                                                </div>
                                            </div>

                                            <br />
                                            <div className="">
                                                <ReactTooltip />
                                                <h5>Royalties Address  <i class="fa fa-exclamation-circle" data-tip='Address cannot be edited once the item is listed.' aria-hidden="true" style={{ fontSize: "18px", cursor: "pointer" }}></i></h5>

                                                <div className="row">
                                                    {this.state.rows1.map((r, i) => (
                                                        <>
                                                            <div className="col-md-9">
                                                                <input type="text" value={r.royaltiesAddress} name="royaltiesAddress[]" id={i} onChange={this.handleChange1} className="form-control royaltiesAddress" placeholder="e.g. 0x243DSFWE23SDW4......" />
                                                            </div>

                                                            <div className="col-md-1">
                                                                {this.state.rows1.length > 1 ?
                                                                    <button class="btn btn-inverse" type="button" style={{ color: '#fff' }} id="addBtn" onClick={() => this.spliceRow(i)}><i class="icofont icofont-minus"></i></button>
                                                                    : ""}
                                                            </div>
                                                        </>

                                                    ))}
                                                    <div className="col-md-2">
                                                        <button class="btn btn-inverse" type="button" style={{ color: '#fff' }} id="addBtn" onClick={() => this.addNewRow(1)}><i class="icofont icofont-plus"></i></button>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="spacer-10" />
                                            {this.state.spinLoader === '0' ?
                                                <input disabled={this.state.imageSizeError} type="submit" onClick={this.updateNftAPI} value="Update" id="submit" className="btn-main" defaultValue="Create Item" />
                                                :
                                                <button disabled className="btn-main" id="deposit-page" >Updating NFT &nbsp; <i className="fa fa-spinner fa-spin validat"></i></button>
                                            }
                                            <div className="spacer-single" />
                                        </div></form>
                                </div>
                                <div className="col-lg-3 col-sm-6 col-xs-12">
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
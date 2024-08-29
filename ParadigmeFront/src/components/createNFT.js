import React, { Component } from 'react';
import axios from 'axios';
import Header from '../directives/header'
import Footer from '../directives/footer'
import config from '../config/config'
import Cookies from 'js-cookie';
import { Dialog, Classes } from "@blueprintjs/core";
import toast, { Toaster } from 'react-hot-toast';
import ReactTooltip from 'react-tooltip';
import DatePicker from "react-datepicker";
import reactImageSize from 'react-image-size';
import Select from 'react-select';
import ReactAudioPlayer from 'react-audio-player';
import {OBJModel} from 'react-3d-viewer'

const date = require('date-and-time')

const customStyles = {
  option: (provided, state) => ({
    ...provided,
    borderBottom: '1px solid #ccc',
    color: state.isSelected ? '#000' : '#000',
  })
}

export default class createnft extends Component {

  constructor(props) {
    super(props)
    this.state = {
      name: '',
      description: '',
      user_collection_id: '0',
      item_category_id: '0',
      royaltie: '0',
      methodType: '1',
      sell_type: '1',
      price: '0',
      minimum_bid: '0',
      start_date: '',
      expiry_date: '',
      image_file: '',
      token_id: '',
      image_preview: '',
      categoryData: [],
      collectionData: [],
      currentDate: '',
      endDate: '',
      spinLoader: '0',
      isDialogOpen: false,
      popupData: false,
      isCollectionModelOpen: 0,
      nft_type_select:'0',
      cl_name: '',
      cl_image_file: '',
      cl_image_preview: '',
      cl_banner_preview: '',
      facebook: "",
      insta: "",
      twitter: "",
      pinterest: "",
      website: "",
      youtube: "",
      discord: "",
      cl_coverPhoto: '',
      cl_description: '',
      telegram: '',
      MATICtoUsdPrice: '0.00',
      royaltiesAddress: [{ 'royaltiesAddress': '' }]
    }
    this.loginData = (!Cookies.get('loginSuccessParadigme')) ? [] : JSON.parse(Cookies.get('loginSuccessParadigme'));
    this.token = (!Cookies.get('token')) ? [] : JSON.parse(Cookies.get('token'));
    this.createNftAPI = this.createNftAPI.bind(this)
    this.onChange = this.handleChange.bind(this);
    this.createCollectionAPI = this.createCollectionAPI.bind(this)
  }

  componentDidMount() {
    this.setState({
      currentDate: new Date(),
      endDate: new Date()
    })

    this.getCategoryAPI()
    this.getUserCollectionAPI()
    this.getAboutDetailAPI()
    this.getETHToUsd();
  }

  async getETHToUsd() {
    await axios({
      method: 'get',
      url: `https://api.binance.com/api/v3/ticker/price?symbol=MATICUSDT`,
    }).then(response => {
      this.setState({
        'MATICtoUsdPrice': response.data.price
      })
    })
  }

  profilePicChange = (e) => {
    if (e.target.files[0]) {
      let image_as_base64 = URL.createObjectURL(e.target.files[0])
      let image_as_files = e.target.files[0];
      this.setState({
        cl_image_preview: image_as_base64,
        cl_image_file: image_as_files,
        imageError: ""
      })
    }
  }

  bannerPicChange = (e) => {
    if (e.target.files[0]) {
      let image_as_base64 = URL.createObjectURL(e.target.files[0])
      let image_as_files = e.target.files[0];
      this.setState({
        cl_banner_preview: image_as_base64,
        cl_coverPhoto: image_as_files,
        coverError: ""
      })
    }
  }

  /** ---------------------- Collection Code Start ---------------------------------- */
  collectionValidate = () => {
    let clnameError = ""
    let cldescError = ""
    let imageError = ""
    let coverError = ""

    if (this.state.cl_name === '') {
      clnameError = "Name is required."
    }
    if (this.state.cl_description === '') {
      cldescError = "Description is required."
    }
    if (this.state.cl_image_file === '') {
      imageError = "Image is required."
    }
    if (this.state.cl_coverPhoto === '') {
      coverError = "Cover photo is required."
    }
    if (clnameError || cldescError || imageError || coverError) {
      window.scrollTo(0, 260)
      this.setState({
        clnameError, cldescError, imageError, coverError
      })
      return false
    }
    return true
  }

  createCollectionAPI(e) {
    e.preventDefault();

    const isValid = this.collectionValidate()
    if (!isValid) {
    }
    else {
      let formData = new FormData();
      formData.append('profile_pic', this.state.cl_image_file);
      formData.append('banner', this.state.cl_coverPhoto);
      formData.append('name', this.state.cl_name);
      formData.append('description', this.state.cl_description);
      formData.append('website', this.state.website);
      formData.append('facebook', this.state.facebook);
      formData.append('twitter', this.state.twitter);
      formData.append('insta', this.state.insta);
      formData.append('telegram', this.state.telegram);
      formData.append('discord', this.state.discord);
      formData.append('user_id', this.loginData?.id);
      axios.post(`${config.apiUrl}insertUserCollection`, formData)
        .then(result => {
          if (result.data.success === true) {

            this.setState({
              isCollectionModelOpen: 0
            })

            toast.success(result.data.msg);
            this.componentDidMount()
          } else {
            toast.error(result.data.msg);
          }
        }).catch(err => {
          toast.error(err.response.data?.msg,

          );
        })
    }
  }

  async getCategoryAPI() {
    await axios({
      method: 'get',
      url: `${config.apiUrl}getCategory`,
    }).then(res => {

      if (res.data.success === true) {
        let allData = res.data.response.length;
        let allDataVal = res.data.response;
        if (allData > 0) {
          let fullcategory = [];
          for (let i = 0; i < allData; i++) {
            fullcategory[i] = {
              value: allDataVal[i].id,
              label: allDataVal[i].name
            }
          }
          this.setState({
            categoryData: fullcategory
          })
        }
      }
    })
  }

  async getAboutDetailAPI() {
    await axios({
      method: 'post',
      url: `${config.apiUrl}getAboutDetail`,
      data: { "id": this.loginData.id }
    }).then(response => {
      if (response.data.success === true) {
        this.setState({
          aboutData: response.data.response
        })
      }
    })
  }

  async getUserCollectionAPI() {
    await axios({
      method: 'post',
      url: `${config.apiUrl}getUserCollection`,
      data: { "user_id": this.loginData?.id }
    }).then(res => {

      if (res.data.success === true) {
        let allData = res.data.response.length;
        let allDataVal = res.data.response;
        if (allData > 0) {
          let fullcollection = [];
          for (let i = 0; i < allData; i++) {
            fullcollection[i] = {
              value: allDataVal[i].collection_id,
              label: allDataVal[i].name
            }
          }
          this.setState({
            collectionData: fullcollection
          })
        }
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
    if (e.target.files[0]) {

      let image_as_base64 = URL.createObjectURL(e.target.files[0])
      let image_as_files = e.target.files[0];
      let file_type = '';
      console.log('image_as_files',image_as_files)
      if (image_as_files.type.indexOf('image') === 0) {
        file_type = 'image';
      } else if (image_as_files.type.indexOf('video') === 0) {
        file_type = 'video';
      }
      else if (image_as_files.type.indexOf('audio') === 0) {
        file_type = 'audio';
      }
      else if (image_as_files.type.indexOf('application') === 0) {
        file_type = 'OBJ';
      }

      this.setState({
        image_preview: image_as_base64,
        image_type: e.target.files[0].type,
        image_file: image_as_files,
        file_type: file_type
      })
      console.log(this.state.file_type)
      this.setState({
        imageSizeError: ''
      })
      let dd = await this.toBase64(e.target.files[0]);
      const { width, height } = await reactImageSize(dd);
      if ((height < 600 && width < 600) && file_type == 'image') {
        this.setState({
          imageSizeError: 'Height and width must be greater than or equal to 600px and 600px!!'
        })
      }



    }
  }


  handleChangeStartDate = e => {
    let startDate = this.formatDate(e);
    this.setState({
      start_date: startDate,
      endDate: startDate
    });
  }

  handleChangeEndDate = e => {
    let endDate = this.formatDate(e);
    this.setState({
      expiry_date: endDate
    });
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

    this.setState({
      [e.target.name]: e.target.value
    })
  }

  sellType(type) {
    this.setState({
      'sell_type': type
    })
  }


  /** ---------------------- Create NFT Code Start ---------------------------------- */
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
      url: `${config.apiUrl}createMetadata`,
      data: {
        "name": this.state.name,
        "description": this.state.description,
        "image": `https://meme.mypinata.cloud/ipfs/${this.state.ImageFileHash}`
      }
    });
    let tokenId = resIPF.data.tokenId;
    this.setState({
      token_id: tokenId
    })
    return tokenId;

  }

  validate = () => {

    let nameError = "";
    let descError = "";
    let imageError = "";
    let collectionError = "";
    let categoryError = "";
    let priceError = "";
    let minimumBidAmountError = "";
    let startDateError = "";
    let endDateError = "";

    if (this.state.name === '') {
      nameError = "Title field is required."
    }
    if (this.state.description === '') {
      descError = "Description field is required."
    }
    if (this.state.user_collection_id === '0' || this.state.user_collection_id === '') {
      collectionError = "Collection field is required."
    }
    if (this.state.item_category_id === '0' || this.state.item_category_id == '') {
      categoryError = "Category field is required."
    }

    if (this.state.sell_type == '1') {
      if (!this.state.price || this.state.price == '0' || this.state.price == '') {
        priceError = "Price field is required."
      }
    }
    else if (this.state.sell_type == '2') {
      if (!this.state.minimum_bid_amount || this.state.minimum_bid_amount == '0' || this.state.minimum_bid_amount == '') {
        minimumBidAmountError = "Minimum bid field is required."
      }

      if (!this.state.start_date || this.state.start_date == '0000-00-00' || this.state.start_date == '') {
        startDateError = "Start date field is required."
      }

      if (!this.state.expiry_date || this.state.expiry_date == '0000-00-00' || this.state.expiry_date == '') {
        endDateError = "End date field is required."
      }

    }

    if (this.state.image_file === '') {
      imageError = "Image field is required."
    }
    if (nameError || descError || imageError || collectionError || categoryError || priceError || minimumBidAmountError || startDateError || endDateError || this.state.imageSizeError) {
      window.scrollTo(0, 220)
      this.setState({
        nameError, descError, categoryError, collectionError, imageError, priceError, minimumBidAmountError, startDateError, endDateError
      })
      return false
    }
    return true
  }

  formatDate(str) {
    var date = new Date(str),
      mnth = ("0" + (date.getMonth() + 1)).slice(-2),
      day = ("0" + date.getDate()).slice(-2);
    return [date.getFullYear(), mnth, day].join("-");
  }


  async createNftAPI(e) {
    e.preventDefault();
    const isValid = this.validate()
    if (!isValid) {

    }
    else {
      this.setState({
        spinLoader: '1',
      })

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

      let ImageFileHash = this.state.ImageFileHash;
      if (!ImageFileHash) {
        ImageFileHash = await this.imageUpload();
      }
      let token_id = this.state.token_id;
      if (!token_id) {
        token_id = await this.metaDataUpload();
      }

      let formData = new FormData();
      if (this.state.sell_type == 2) {
        formData.append('price', this.state.minimum_bid_amount);
      } else {
        formData.append('price', this.state.price);
      }

      formData.append('royaltiesAddress', JSON.stringify(royaltiesAddress));
      formData.append('image', ImageFileHash);
      formData.append('name', this.state.name);
      formData.append('file_type', this.state.file_type);
      formData.append('royalty_percent', this.state.royaltie);
      formData.append('image_type', this.state.image_type);
      formData.append('description', this.state.description);
      formData.append('start_date', this.state.start_date ? this.formatDate(this.state.start_date) : '');
      formData.append('expiry_date', this.state.expiry_date ? this.formatDate(this.state.expiry_date) : '');
      formData.append('item_category_id', this.state.item_category_id);
      formData.append('user_collection_id', this.state.user_collection_id);
      formData.append('sell_type', this.state.sell_type);
      formData.append('user_id', this.loginData?.id);
      formData.append('email', this.loginData?.user_email);
      formData.append('to_address', this.state.aboutData?.address);
      formData.append('tokenId', token_id);
      formData.append('nft_type_select', this.state.nft_type_select);

      axios.post(`${config.apiUrl}addNftByUser`, formData)
        .then(result => {

          this.setState({
            spinLoader: '0'
          })

          if (result.data.success === true) {
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

  async closeModel() {
    this.setState({
      isCollectionModelOpen: 0
    })
  }

  async openModel() {
    this.setState({
      isCollectionModelOpen: 1
    })
  }

  movePage() {
    window.location.href = `${config.baseUrl}accountsetting`
  }

  categoryHandleChange = e => {
    this.setState({
      'item_category_id': e.value
    })
  }

  collectionHandleChange = (e) => {
    this.setState({
      'user_collection_id': e.value
    })
  };

  addNewRow = (i) => {
    var rows = this.state.royaltiesAddress
    rows.push({ 'royaltiesAddress': '' })
    this.setState({ royaltiesAddress: rows })
  }

  spliceRow = (i) => {
    const rows = this.state.royaltiesAddress;
    rows.splice(i, 1)
    this.setState({ royaltiesAddress: rows })
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
            <h4 style={{ color: '#000', fontSize: '16px' }}>NFT minting in progress, once process completed NFT will be display on your portfolio page.</h4>
            <p style={{ color: '#091f3f' }}>
              Please do not refresh page or close tab.
            </p>
            <div>
              <div class="spinner-border"></div>
            </div>
          </div>
        </Dialog>

        <Dialog
          title={`You Created-${this.state.name}`}
          style={{
            color: '#000',
            textAlign: "center"
          }}
          isOpen={this.state.popupData}
          isCloseButtonShown={false}
        >
          <div className="text-center pl-3 pr-3">
            < br />
            <h4 style={{ fontSize: '16px', color: '#000' }}>To get set up for selling on marketplace, please put the item on sale from portfolio page.</h4>
            <div className='mb-3'>
              {this.state.file_type == 'image' ?
                <img src={`${this.state.image_preview}`} width="150px" />
                :
                this.state.file_type == 'video' ?
                  <video width="320" height="240" controls>
                    <source src={this.state.image_preview} type="video/mp4" />
                  </video>

                  :
                  this.state.file_type == 'audio' ?
                    <ReactAudioPlayer
                      src={(this.state.image_preview)}

                      controls
                    /> :  this.state?.file_type == 'OBJ' ?
                    <OBJModel height='192'  width='292' src={this.state.image_preview} texPath=""/>: ""


              }
            </div>
            <button type='button' className='btn btn-primary' onClick={this.movePage.bind(this)}>Ok</button>
          </div>
        </Dialog>

        <div className="no-bottom no-top" id="content">
          <div id="top" />
          {/* section begin */}
          <section id="subheader" className="text-light" style={{ backgroundImage: `url("images/inner-banner11.jpg")`, backgroundSize: 'cover' }}>
            <div class="overlay bg-black op-7"></div>
            <div className="center-y relative text-center">
              <div className="container-fluid">
                <div className="row">
                  <div className="col-md-12 text-center">
                    <h1>Create NFT</h1>
                  </div>
                  <div className="clearfix" />
                </div>
              </div>
            </div>
          </section>

          <section aria-label="section">
            <div className="container-fluid">
              <div className="row wow fadeIn">
                <div className="col-lg-2 col-sm-6 col-xs-12">
                </div>
                <div className="col-lg-8">
                  <form id="form-create-item" className="form-border" method="post" action="#">
                    <div className="field-set">
                      <h5>Upload file</h5>
                      <div className=" col-sm-4 col-8">
                        <p >File types supported: PNG, JPG, GIF, MP3, OBJ or WEBP</p>
                        <div className="d-create-file">
                          {this.state.file_type == 'image' ?
                            this.state.image_preview === '' ?
                              ""
                              :
                              <img style={{ height: '192px', width: '292px' }} id="image" className="object-cover w-full h-32 w-100" src={this.state.image_preview} />

                            :
                            this.state.file_type == 'video' ?
                              <video style={{ height: '192px', width: '292px' }} controls>
                                <source src={this.state.image_preview} type="video/mp4" />
                              </video>

                              :
                              this.state.file_type == 'audio' ?
                                <ReactAudioPlayer
                                  src={(this.state.image_preview)}

                                  controls
                                /> :  this.state?.file_type == 'OBJ' ?
                                <OBJModel  height='192'  width='292' src={this.state.image_preview} texPath=""/>: ""
                          }




                          <input type="button" id="get_file" className="btn-main" defaultValue="Browse" />
                          <input type="file" accept=".png,.jpg,.gif,.webo,.mp4,.mp3,.obj" onChange={this.nftimageChange.bind(this)} id="upload_file" name="image" />
                        </div>
                        <span className="error-asterick"> {this.state.imageSizeError}</span>

                      </div>
                      <div className="spacer-single" />
                      <h5>Title</h5>
                      <input maxLength="150" type="text" name="name" onChange={this.handleChange} id="item_title" className="form-control" placeholder="e.g. 'Crypto Funk" />
                      <span className="error-asterick"> {this.state.nameError}</span>
                      <div className="spacer-10" />

                      <h5>Description</h5>
                      <p style={{ color: 'rgb(110, 119, 128)' }}>The description will be included on the item's detail page underneath its image</p>
                      <textarea maxLength="500" data-autoresize name="description" onChange={this.handleChange} id="item_desc" className="form-control" placeholder="e.g. 'This is very limited item'" />
                      <span className="error-asterick"> {this.state.descError}</span>
                      <div className="spacer-10" />

                      <div className="collection-drop">
                        <h5>Collection &nbsp;
                          {/* <span style={{ cursor: 'pointer' }} onClick={this.openModel.bind(this)} className='green' style={{ float: 'right' }}>Add <i class="fa fa-plus " aria-hidden="true" ></i></span> */}
                        </h5>
                        <p style={{ color: 'rgb(110, 119, 128)', fontSize: '13px' }}>This is the collection where your item will appear<button style={{ marginTop: '-12px' }} onClick={this.openModel.bind(this)} type="button" class="btn btn-sm btn-primary pull-right add-plus mb-2">Add <i class="fa fa-plus"></i></button></p>
                        {/* <select onChange={this.handleChange} className="form-control mb-3" name="user_collection_id">
                          <option value="">Select Collection</option>
                          {this.state.collectionData.map((item) => (
                            <option value={item.collection_id}>{item.name}</option>
                          ))}
                        </select> */}

                        <Select
                          styles={customStyles}
                          options={this.state.collectionData ? this.state.collectionData : ''}
                          onChange={this.collectionHandleChange}
                          menuColor='#fff'
                          theme={(theme) => ({
                            ...theme,
                            borderRadius: 0,
                            colors: {
                              ...theme.colors,
                              primary25: '#fc7d00',
                              primary: '#fc7d00',
                            },
                          })}
                        />

                        <span className="error-asterick"> {this.state.collectionError}</span>
                        <h5>Categories</h5>
                        {/* <select onChange={this.handleChange} value={this.state.item_category_id} className="form-control mb-2" name="item_category_id">
                          <option value="">Select Category</option>
                          {this.state.categoryData.map((item) => (
                            <option value={item.id}>{item.name}</option>
                          ))}
                        </select> */}

                        <Select
                          styles={customStyles}
                          options={this.state.categoryData ? this.state.categoryData : ''}
                          onChange={this.categoryHandleChange}
                          menuColor='#fff'
                          theme={(theme) => ({
                            ...theme,
                            borderRadius: 0,
                            colors: {
                              ...theme.colors,
                              primary25: '#fc7d00',
                              primary: '#fc7d00',
                            },
                          })}
                        />

                        <span className="error-asterick"> {this.state.categoryError}</span>
                      </div>

                      <div className="spacer-10" />
                      <h5>Royalties(%)</h5>
                      <input type="text" onKeyPress={(event) => { if (!/^\d*[.]?\d{0,1}$/.test(event.key)) { event.preventDefault(); } }} onChange={this.handleChange} name="royaltie" id="item_royalties" className="form-control" placeholder="Suggested: 0%, 5%, 10%, 20%" />
                      <div className="spacer-10" />

                      <h5>Nft Type</h5>
                      <select class="form-control  basic" name="nft_type_select" onChange={this.handleChange} value={this.state.nft_type_select} >
                                                                        <option selected="selected" value="">Select Options</option>
                                                                        <option value="0">Digital</option>
                                                                        <option value="1">Physical</option>
                                                                    </select>
                      <div className="spacer-10" />

                      
                      <h5>Select sale method</h5>
                      <div className="de_tab tab_methods">
                        <ul className="de_nav">
                          <li onClick={this.sellType.bind(this, 1)} className={this.state.sell_type == '1' ? "active" : ''}><span><i className="fa fa-tag" />Price</span>
                          </li>
                          <li onClick={this.sellType.bind(this, 2)} className={this.state.sell_type == '2' ? "active" : ''}><span><i className="fa fa-hourglass-1" />Timed auction</span>
                          </li>
                        </ul>
                        <div className="de_tab_content">

                          <div id="tab_opt_1" style={{ display: this.state.sell_type == '1' ? 'block' : 'none' }}>
                            <i class="fa fa-exclamation-circle pull-right" data-tip={`List price and listing schedule cannot be edited once the item is listed`} aria-hidden="true" style={{ fontSize: "18px", cursor: "pointer" }}></i>
                            <ReactTooltip />
                            <h5>Price(MATIC) </h5>
                            <input type="text" onKeyPress={(event) => { if (!/^\d*[.]?\d{0,1}$/.test(event.key)) { event.preventDefault(); } }} onChange={this.handleChange} name="price" id="item_price_bid" className="form-control" placeholder="Enter Price" />

                            <span>{this.state.price ? this.state.price + ' MATIC ~ $' + parseFloat(this.state.MATICtoUsdPrice * this.state.price).toFixed(2) : '0 ETH ~ $0.00'}</span>

                            <span className="error-asterick"> {this.state.priceError}</span>
                          </div>

                          <div id="tab_opt_2" style={{ display: this.state.sell_type == '2' ? 'block' : 'none' }}>
                            <i class="fa fa-exclamation-circle pull-right" data-tip='Sell to the highest bidder price, which allows the listing to reduce in price until a buyer is found' aria-hidden="true" style={{ fontSize: "18px", cursor: "pointer" }}></i>
                            <ReactTooltip />
                            <h5>Minimum bid(MATIC)</h5>
                            <input type="text" name="minimum_bid_amount" onKeyPress={(event) => { if (!/^\d*[.]?\d{0,1}$/.test(event.key)) { event.preventDefault(); } }} onChange={this.handleChange} id="item_price_bid" className="form-control" placeholder="Enter Minimum Bid" />
                            <span>{this.state.minimum_bid_amount ? this.state.minimum_bid_amount + ' ETH ~ $' + parseFloat(this.state.MATICtoUsdPrice * this.state.minimum_bid_amount).toFixed(2) : '0 ETH ~ $0.00'}</span>
                            <span className="error-asterick"> {this.state.minimumBidAmountError}</span>

                            <div className="spacer-10" />
                            <div className="row">
                              <div className="col-md-6">
                                <h5>Starting date</h5>
                                <DatePicker autoComplete="off" name="start_date" className="form-control" minDate={this.state.currentDate} value={this.state.start_date} onChange={this.handleChangeStartDate} />
                                <span className="error-asterick"> {this.state.startDateError}</span>
                              </div>
                              <div className="col-md-6">
                                <h5>Expiration date</h5>
                                {/* <input type="date" onChange={this.handleChange} min={this.state.endDate} name="expiry_date" id="bid_expiration_date" className="form-control" /> */}
                                <DatePicker autoComplete="off" name="expiry_date" className="form-control" minDate={this.state.currentDate} value={this.state.expiry_date} onChange={this.handleChangeEndDate} />
                                <span className="error-asterick"> {this.state.endDateError}</span>
                              </div>
                              <div className="spacer-single" />
                            </div>
                          </div>
                          <div id="tab_opt_3" style={{ display: this.state.sell_type == '3' ? 'block' : 'none' }}>
                          </div>
                        </div>

                        <br />
                        <div className="">
                          <ReactTooltip />
                          <h5>Royalties Address  <i class="fa fa-exclamation-circle" data-tip='Address cannot be edited once the item is listed.' aria-hidden="true" style={{ fontSize: "18px", cursor: "pointer" }}></i></h5>

                          <div className="row">
                            {this.state.royaltiesAddress.map((r, i) => (
                              <>
                                <div className="col-md-9">
                                  <input type="text" name="royaltiesAddress[]" id="royaltiesAddress" className="form-control royaltiesAddress" placeholder="e.g. 0x243DSFWE23SDW4......" />
                                </div>

                                <div className="col-md-1">
                                  {this.state.royaltiesAddress.length > 1 ?
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

                      </div>
                      <div className="spacer-10" />
                      {this.state.spinLoader === '0' ?
                        <input type="submit" onClick={this.createNftAPI.bind(this)} id="submit" className="btn-main" defaultValue="Create Item" />
                        :
                        <button disabled className="btn-main" id="deposit-page" >Creating NFT &nbsp;<i className="fa fa-spinner fa-spin validat"></i></button>
                      }
                      <div className="spacer-single" />
                    </div></form>
                </div>
                <div className="col-lg-2 col-sm-6 col-xs-12">
                </div>
              </div>
            </div>
          </section>
        </div>

        <div className={this.state.isCollectionModelOpen == 1 ? 'modal fade in show' : 'modal fade'} style={{ display: this.state.isCollectionModelOpen == 1 ? 'block' : 'none' }} id="createCollection" tabindex="-1" aria-labelledby="createCollectionLabel" aria-hidden="true">
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="createCollectionLabel">Add Collection</h5>
                <button type="submit" className="btn-close" onClick={this.closeModel.bind(this)}></button>
              </div>
              <div className="modal-body">
                <div className="row">
                  <div className="col-sm-12 col-xs-12">
                    <div className="tab-content create-collection" id="v-pills-tabContent">
                      <div className="be-large-post">
                        <div className="row">
                          <div className="col-sm-4">
                            <h4>Image</h4>
                            <div className="w-32 h-32 mb-1  rounded-lg overflow-hidden relative bg-gray-100">
                              {this.state.cl_image_preview === '' ?
                                <img style={{ height: '150px', width: '150px' }} className="object-cover w-full h-32" src="https://placehold.co/300x300/e2e8f0/e2e8f0" alt="" /> :
                                <img style={{ height: '150px', width: '150px' }} id="image" className="object-cover w-full h-32" src={this.state.cl_image_preview} />
                              }

                              <div className="absolute top-0 left-0 right-0 bottom-0 w-full block cursor-pointer flex items-center justify-center" onclick="document.getElementById('fileInput').click()">
                                {this.state.cl_image_preview === '' ?
                                  <button type="button" style={{ backgroundColor: '#ffffff6e' }} className="hover:bg-gray-100 text-gray-700 font-semibold py-2 px-4 text-sm border border-gray-300 rounded-lg shadow-sm">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-camera" width={24} height={24} viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                      <rect x={0} y={0} width={24} height={24} stroke="none" />
                                      <path d="M5 7h1a2 2 0 0 0 2 -2a1 1 0 0 1 1 -1h6a1 1 0 0 1 1 1a2 2 0 0 0 2 2h1a2 2 0 0 1 2 2v9a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2v-9a2 2 0 0 1 2 -2" />
                                      <circle cx={12} cy={13} r={3} />
                                    </svg>
                                  </button>
                                  : ""}
                              </div>

                              <input name="cl_profile_pic" onChange={this.profilePicChange.bind(this)} id="fileInput" accept="image/*" className="hidden" type="file" />
                            </div>
                            <span className="error-asterick"> {this.state.imageError}</span>
                          </div>
                          <div className="col-sm-8 upload-cover">
                            <h4>Cover Photo</h4>
                            <div className="w-32 h-32 mb-1  rounded-lg overflow-hidden relative bg-gray-100">

                              {this.state.cl_banner_preview === '' ?
                                <img style={{ height: '150px', width: '100%' }} className="object-cover w-full h-32" src="https://placehold.co/300x300/e2e8f0/e2e8f0" alt="" /> :
                                <img style={{ height: '150px', width: '100%' }} id="image" className="object-cover w-full h-32" src={this.state.cl_banner_preview} />
                              }
                              <div className="absolute top-0 left-0 right-0 bottom-0 w-full block cursor-pointer flex items-center justify-center" type="file" >
                                {this.state.cl_banner_preview === '' ?
                                  <button type="button" style={{ backgroundColor: '#ffffff6e' }} className="hover:bg-gray-100 text-gray-700 font-semibold py-2 px-4 text-sm border border-gray-300 rounded-lg shadow-sm">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-camera" width={24} height={24} viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                      <rect x={0} y={0} width={24} height={24} stroke="none" />
                                      <path d="M5 7h1a2 2 0 0 0 2 -2a1 1 0 0 1 1 -1h6a1 1 0 0 1 1 1a2 2 0 0 0 2 2h1a2 2 0 0 1 2 2v9a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2v-9a2 2 0 0 1 2 -2" />
                                      <circle cx={12} cy={13} r={3} />
                                    </svg>
                                  </button>
                                  : ""}
                                <input id="fileInput" onChange={this.bannerPicChange.bind(this)} className="hidden" type="file" name="cl_coverPhoto" accept=".png,.jpg,.jpeg" />
                              </div>
                              <span className="error-asterick"> {this.state.coverError}</span>
                            </div>
                          </div>
                        </div>

                        <div className="spacer-single" />
                        <div className="socail_news">
                          <h5>Name</h5>
                          <input type="text" name="cl_name" onChange={this.handleChange} value={this.state.cl_name} className="form-control mb-4" placeholder="e.g. 'Crypto Funk" />
                          <span className="error-asterick"> {this.state.clnameError}</span>
                        </div>
                        <div class="socail_news">
                          <h5>Description</h5>
                          <textarea name="cl_description" onChange={this.handleChange} value={this.state.cl_description} id="item_desc" class="form-control" placeholder="e.g. 'This is very limited item'" ></textarea>
                          <span className="error-asterick"> {this.state.cldescError}</span>
                        </div>
                        <div class="socail_news mt-3">
                          <h5>Website Link</h5>
                          <input type="text" name="website" onChange={this.handleChange} value={this.state.website} id="item_title" class="form-control mb-4" placeholder="e.g. https://example.com" />
                        </div>
                        <div className="social-icons mt-1" style={{ backgroundSize: 'cover' }}>
                          <h5>Link social media</h5>
                          <div className="be-large-post-align">
                            <div className="social-input form-group focus-2">
                              <div className="s_icon">
                                <i className="fa fa-facebook" />
                              </div>
                              <div className="s_input">
                                <input className="form-control" type="text" name="facebook" onChange={this.handleChange} value={this.state.facebook} placeholder="e.g. https://example.com" />
                              </div>
                            </div>
                            <div className="social-input form-group focus-2">
                              <div className="s_icon">
                                <i className="fa fa-twitter" />
                              </div>
                              <div className="s_input">
                                <input className="form-control" type="text" name="twitter" onChange={this.handleChange} value={this.state.twitter} placeholder="e.g. https://example.com" />
                              </div>
                            </div>
                            <div className="social-input form-group focus-2">
                              <div className="s_icon">
                                <i className="fa fa-telegram " />
                              </div>
                              <div className="s_input">
                                <input className="form-control" type="text" name="telegram" onChange={this.handleChange} value={this.state.telegram} placeholder="e.g. https://example.com" />
                              </div>
                            </div>
                            <div className="social-input form-group focus-2">
                              <div className="s_icon">
                                <i className="fa fa-instagram" />
                              </div>
                              <div className="s_input">
                                <input className="form-control" type="text" name="insta" onChange={this.handleChange} value={this.state.insta} placeholder="e.g. https://example.com" />
                              </div>
                            </div>
                            <div className="social-input form-group focus-2">
                              <div className="s_icon">

                                <div className="discord-img"><img src="images/discord.png" /></div>

                              </div>
                              <div className="s_input">
                                <input className="form-control" type="text" name="discord" onChange={this.handleChange} value={this.state.discord} placeholder="e.g. https://example.com" />
                              </div>
                            </div>

                            <div className="socail_news mt-4">
                              <button id="submit" className="btn-main" type="submit" onClick={this.createCollectionAPI}  >Create Collection</button>
                            </div>
                          </div>

                        </div>
                      </div>

                    </div>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={this.closeModel.bind(this)}>Close</button>
              </div>
            </div>
          </div>
        </div>

        <Footer />

      </>
    )
  }
}
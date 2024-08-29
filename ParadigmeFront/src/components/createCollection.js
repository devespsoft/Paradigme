import React, { Component } from 'react';
import axios from 'axios';
import Header from '../directives/header'
import Footer from '../directives/footer'
import config from '../config/config'
import Cookies from 'js-cookie';
import { Link } from 'react-router-dom';
// import toast, { Toaster } from 'react-hot-toast';
import ReactDatatable from '@ashvin27/react-datatable'
import 'react-toastify/dist/ReactToastify.css';
import toast, { Toaster } from 'react-hot-toast';
const headers = {
  'Content-Type': 'application/json'
};

export default class createCollection extends Component {

  constructor(props) {
    super(props)
    this.state = {
      name: '',
      profileData: '',
      image_file: '',
      image_preview: '',
      banner_preview: '',
      image_file1: null,
      image_preview1: '',
      facebook: "",
      insta: "",
      twitter: "",
      pinterest: "",
      website: "",
      youtube: "",
      discord: "",
      spinLoader: '0',
      coverPhoto: '',
      description: '',
      telegram: ''

    }
    this.loginData = (!Cookies.get('loginSuccessParadigme')) ? [] : JSON.parse(Cookies.get('loginSuccessParadigme'));
    this.token = (!Cookies.get('token')) ? [] : JSON.parse(Cookies.get('token'));
    this.createCollectionAPI = this.createCollectionAPI.bind(this)
    this.onChange = this.handleChange.bind(this);
  }

  componentDidMount() {
    Cookies.set('selectedTab', '6');
    localStorage.setItem('type', 6)
    if (!this.loginData?.id) {
      window.location.href = `${config.baseUrl}`
    }

  }

  profilePicChange = (e) => {
    if (e.target.files[0]) {
      let image_as_base64 = URL.createObjectURL(e.target.files[0])
      let image_as_files = e.target.files[0];
      this.setState({
        image_preview: image_as_base64,
        image_file: image_as_files,
        imageError: ""
      })
    }
  }

  bannerPicChange = (e) => {
    if (e.target.files[0]) {
      let image_as_base64 = URL.createObjectURL(e.target.files[0])
      let image_as_files = e.target.files[0];
      this.setState({
        banner_preview: image_as_base64,
        coverPhoto: image_as_files,
        coverError: ""
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

    this.setState({
      [e.target.name]: e.target.value
    })
  }

  validate = () => {
    let nameError = ""
    let descError = ""
    let imageError = ""
    let coverError = ""

    if (this.state.name === '') {
      nameError = "Name is required."
    }
    if (this.state.description === '') {
      descError = "Description is required."
    }
    if (this.state.image_file === '') {
      imageError = "Image is required."
    }
    if (this.state.coverPhoto === '') {
      coverError = "Cover photo is required."
    }
    if (nameError || descError || imageError || coverError) {
      window.scrollTo(0, 260)
      this.setState({
        nameError, descError, imageError, coverError
      })
      return false
    }
    return true
  }

  createCollectionAPI(e) {
    e.preventDefault();

    const isValid = this.validate()
    if (!isValid) {
    }
    else {
      let formData = new FormData();
      formData.append('profile_pic', this.state.image_file);
      formData.append('banner', this.state.coverPhoto);
      formData.append('name', this.state.name);
      formData.append('description', this.state.description);
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
            toast.success(result.data.msg);
            setTimeout(() => {
              window.location.href = `${config.baseUrl}accountsetting`
            }, 2000);
          } else {
            toast.error(result.data.msg);
          }
        }).catch(err => {
          toast.error(err.response.data?.msg,

          );
        })
    }
  }

  render() {
    return (

      <>
        <Header />

        <div className="no-bottom no-top" id="content">
          <div id="top" />
          <Toaster />
          <section id="subheader" className="text-light" style={{ backgroundImage: `url("images/background/bg-3.jpg")`, backgroundSize: 'cover' }} >
            <div className="center-y relative text-center">
              <div className="container">
                <div className="row">
                  <div className="col-md-12 text-center">
                    <h1>Create Collection </h1>
                  </div>
                  <div className="clearfix" />
                </div>
              </div>
            </div>
          </section>
          <section aria-label="section">
            <div className="container">
              <div className=" wow fadeIn">
                <div className="row">
                  <div className="col-sm-2 col-xs-12"></div>
                  <div className="col-sm-9 col-xs-12">
                    <div className="tab-content create-collection" id="v-pills-tabContent">
                      <div className="info-block style-1">
                        <div className="be-large-post-align ">
                          <h3 className="info-block-label">Collection Details</h3>
                        </div>
                      </div>
                      <div className="be-large-post">
                        <div className="row">
                          <div className="col-sm-4">
                            <h4>Image</h4>
                            <div className="w-32 h-32 mb-1  rounded-lg overflow-hidden relative bg-gray-100">
                              {this.state.image_preview === '' ?
                                <img style={{ height: '150px', width: '150px' }} className="object-cover w-full h-32" src="https://placehold.co/300x300/e2e8f0/e2e8f0" alt="" /> :
                                <img style={{ height: '150px', width: '150px' }} id="image" className="object-cover w-full h-32" src={this.state.image_preview} />
                              }

                              <div className="absolute top-0 left-0 right-0 bottom-0 w-full block cursor-pointer flex items-center justify-center" onclick="document.getElementById('fileInput').click()">
                                {this.state.image_preview === '' ?
                                  <button type="button" style={{ backgroundColor: '#ffffff6e' }} className="hover:bg-gray-100 text-gray-700 font-semibold py-2 px-4 text-sm border border-gray-300 rounded-lg shadow-sm">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-camera" width={24} height={24} viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                      <rect x={0} y={0} width={24} height={24} stroke="none" />
                                      <path d="M5 7h1a2 2 0 0 0 2 -2a1 1 0 0 1 1 -1h6a1 1 0 0 1 1 1a2 2 0 0 0 2 2h1a2 2 0 0 1 2 2v9a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2v-9a2 2 0 0 1 2 -2" />
                                      <circle cx={12} cy={13} r={3} />
                                    </svg>
                                  </button>
                                  : ""}
                              </div>

                              <input name="profile_pic" onChange={this.profilePicChange.bind(this)} id="fileInput" accept="image/*" className="hidden" type="file" />
                            </div>
                            <span className="error-asterick"> {this.state.imageError}</span>
                          </div>
                          <div className="col-sm-8 upload-cover">
                            <h4>Cover Photo</h4>
                            <div className="w-32 h-32 mb-1  rounded-lg overflow-hidden relative bg-gray-100">

                              {this.state.banner_preview === '' ?
                                <img style={{ height: '150px', width: '100%' }} className="object-cover w-full h-32" src="https://placehold.co/300x300/e2e8f0/e2e8f0" alt="" /> :
                                <img style={{ height: '150px', width: '100%' }} id="image" className="object-cover w-full h-32" src={this.state.banner_preview} />
                              }
                              <div className="absolute top-0 left-0 right-0 bottom-0 w-full block cursor-pointer flex items-center justify-center" type="file" >
                                {this.state.banner_preview === '' ?
                                  <button type="button" style={{ backgroundColor: '#ffffff6e' }} className="hover:bg-gray-100 text-gray-700 font-semibold py-2 px-4 text-sm border border-gray-300 rounded-lg shadow-sm">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-camera" width={24} height={24} viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                      <rect x={0} y={0} width={24} height={24} stroke="none" />
                                      <path d="M5 7h1a2 2 0 0 0 2 -2a1 1 0 0 1 1 -1h6a1 1 0 0 1 1 1a2 2 0 0 0 2 2h1a2 2 0 0 1 2 2v9a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2v-9a2 2 0 0 1 2 -2" />
                                      <circle cx={12} cy={13} r={3} />
                                    </svg>
                                  </button>
                                  : ""}
                                <input id="fileInput" onChange={this.bannerPicChange.bind(this)} className="hidden" type="file" name="coverPhoto" accept=".png,.jpg,.jpeg" />
                              </div>
                              <span className="error-asterick"> {this.state.coverError}</span>
                            </div>
                          </div>
                        </div>

                        <div className="spacer-single" />
                        <div className="socail_news">
                          <h5>Name</h5>
                          <input type="text" name="name" onChange={this.handleChange} value={this.state.name} className="form-control mb-4" placeholder="e.g. 'Crypto Funk" />
                          <span className="error-asterick"> {this.state.nameError}</span>
                        </div>
                        <div class="socail_news">
                          <h5>Description</h5>
                          <textarea name="description" onChange={this.handleChange} value={this.state.description} id="item_desc" class="form-control" placeholder="e.g. 'This is very limited item'" style={{ height: '66px' }}></textarea>
                          <span className="error-asterick"> {this.state.descError}</span>
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
                                <a className="social-btn color-1" href="#"><i className="fa fa-facebook" /></a>
                              </div>
                              <div className="s_input">
                                <input className="form-control" type="text" name="facebook" onChange={this.handleChange} value={this.state.facebook} placeholder="e.g. https://example.com" />
                              </div>
                            </div>
                            <div className="social-input form-group focus-2">
                              <div className="s_icon">
                                <a className="social-btn color-2" href="#"><i className="fa fa-twitter" /></a>
                              </div>
                              <div className="s_input">
                                <input className="form-control" type="text" name="twitter" onChange={this.handleChange} value={this.state.twitter} placeholder="e.g. https://example.com" />
                              </div>
                            </div>
                            <div className="social-input form-group focus-2">
                              <div className="s_icon">
                                <a className="social-btn color-3" href="#"><i className="fa fa-telegram " /></a>
                              </div>
                              <div className="s_input">
                                <input className="form-control" type="text" name="telegram" onChange={this.handleChange} value={this.state.telegram} placeholder="e.g. https://example.com" />
                              </div>
                            </div>
                            <div className="social-input form-group focus-2">
                              <div className="s_icon">
                                <a className="social-btn color-5" href="#"><i className="fa fa-instagram" /></a>
                              </div>
                              <div className="s_input">
                                <input className="form-control" type="text" name="insta" onChange={this.handleChange} value={this.state.insta} placeholder="e.g. https://example.com" />
                              </div>
                            </div>
                            <div className="social-input form-group focus-2">
                              <div className="s_icon">
                                <a className="social-btn color-5" href="#">
                                  <div className="discord-img"><img src="images/discord.png" /></div>
                                </a>
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
                  <div className="col-sm-2 col-xs-12"></div>
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
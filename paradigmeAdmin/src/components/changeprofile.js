import React, { Component } from 'react';
import Header from '../directives/header'
import Leftsidebar from '../directives/leftsidebar'
import Footer from '../directives/footer'
import axios from 'axios'
import config from '../config/config'
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';
import Cookies from 'js-cookie';
const headers = {
    'Content-Type': 'application/json'
};


export default class changeprofile extends Component {

    constructor(props) {
        super(props)
        this.state = {
            full_name : '',
            email : '',
            profile_pic: '',
            image_file: null,
            image_preview: '',
        }

        this.loginData = (!Cookies.get('loginSuccessParadigmeAdmin')) ? [] : JSON.parse(Cookies.get('loginSuccessParadigmeAdmin'));
        this.updateProfilePicAPI = this.updateProfilePicAPI.bind(this)
        this.onChange = this.handleChange.bind(this);
    }

    componentDidMount() {
        this.getUserProfilePicAPI();
    }

    handleChange = e => {
        this.setState({
            [e.target.name]: e.target.value
        })
    }    

    async getUserProfilePicAPI() {
        await axios({
            method: 'post',
            url: `${config.apiUrl}adminprofilepic`,
            headers: { "Authorization": this.loginData?.data?.token },
            data: { 'email': this.loginData.data.user_email, 'is_admin': this.loginData.data.is_admin }
        }).then(response => {
            if (response.data.success === true) {
                this.setState({
                    profile_pic: response.data.response?.profile_pic,
                    full_name : response.data.response?.full_name,
                    email : response.data.response?.email
                })
            }
        })
    }

    async updateProfilePicAPI(e) {
        e.preventDefault()
        const formData = new FormData();
        formData.append('profile_pic', this.state.image_file);
        formData.append('old_profile_pic', this.state.profile_pic);
        formData.append('full_name', this.state.full_name);
        formData.append('email', this.state.email);
        await axios({
            method: 'post',
            url: `${config.apiUrl}updateAdminProfile`,
            headers: { "Authorization": this.loginData?.data?.token },
            data: formData
        }).then(result => {
            if (result.data.success === true) {
                toast.success(result.data.msg, {
                    position: toast.POSITION.TOP_CENTER
                });
                this.getUserProfilePicAPI()
            }
            else if (result.data.success === false) {
                toast.error(result.data.msg, {
                    position: toast.POSITION.TOP_CENTER
                });
            }
        }).catch(err => {

        });
    }

    handleImagePreview = (e) => {
        let image_as_base64 = URL.createObjectURL(e.target.files[0])
        let image_as_files = e.target.files[0];
        this.setState({
            image_preview: image_as_base64,
            image_file: image_as_files,
        })
    }

    render() {

        return (
            <>
                <ToastContainer />
                <div className="wrapper theme-6-active pimary-color-green">
                    <Header />
                    <Leftsidebar />
                    <div className="page-wrapper">
                        <div className="container-fluid">

                            <div className="row heading-bg">
                                <div className="col-lg-3 col-md-4 col-sm-4 col-xs-12">
                                    <h5 className="txt-dark">Change Profile Pic</h5>
                                </div>
                            </div>

                            <div className="row">
                                <div className="col-sm-12">
                                    <div className="panel panel-default card-view">
                                        <div className="panel-wrapper collapse in">
                                            <div className="panel-body">
                                                <div className="form-wrap">
                                                    <form action="#">

                                                        <hr className="light-grey-hr" />
                                                        <div className="row">
                                                            <div className="col-md-6">

                                                            <div className="form-group">
                                                                    <label className="control-label mb-10">Name</label>
                                                                    <br />
                                                                    <input type="text" value={this.state.full_name} onChange={this.handleChange} name="full_name" className="form-control" />
                                                                </div>

                                                                <div className="form-group">
                                                                    <label className="control-label mb-10">Email</label>
                                                                    <br />
                                                                    <input disabled type="email" onChange={this.handleChange} value={this.state.email}  name="email" className="form-control" />
                                                                </div>

                                                                <div className="form-group">
                                                                    <label className="control-label mb-10">Change Profile Pic</label>
                                                                    <br />
                                                                    {this.state.profile_pic ?
                                                                        <img className="user-auth-img img-circle" style={{ height: '100px', width: '100px' }} src={`${config.imageUrl1 + this.state.profile_pic}`}></img>
                                                                        : ''
                                                                    }

                                                                    <input type="file" accept="image/x-png,image/gif,image/jpeg" id="firstName" onChange={this.handleImagePreview} name="profile" className="form-control" />
                                                                </div>

                                                                <div className="col-md-6">
                                                                    <div className="form-group">
                                                                        <label className="control-label mb-10"></label>
                                                                        <button type="submit" onClick={this.updateProfilePicAPI} className="btn btn-primary">Change Profile</button>
                                                                    </div>
                                                                </div>

                                                            </div>
                                                        </div>
                                                    </form>
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
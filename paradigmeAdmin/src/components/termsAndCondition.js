import React, { Component } from 'react';
import Header from '../directives/header'
import Leftsidebar from '../directives/leftsidebar'
import Footer from '../directives/footer'
import axios from 'axios'
import config from '../config/config'
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';
import Cookies from 'js-cookie';

import 'jodit';
import 'jodit/build/jodit.min.css';
import JoditEditor from "jodit-react";



const headers = {
    'Content-Type': 'application/json'
};


export default class termsAndCondition extends Component {

    constructor(props) {
        super(props)
        this.state = {
            terms_conditions: '',
        }
        this.onChange = this.onChange.bind(this);
        this.submitLandingForm = this.submitLandingForm.bind(this);
    }

    /**
     * @property Jodit jodit instance of native Jodit
     */
    jodit;
    setRef = jodit => this.jodit = jodit;
    config = {
        readonly: false // all options from https://xdsoft.net/jodit/doc/
    }
    onChange(e) {
        this.setState({
            [e.target.name]: e.target.value
        })

        this.setState(prevState => ({
            landingPage: { ...prevState.landingPage, [e.target.name]: e.target.value }
        }))

    }

    componentDidMount() {
        this.getTermsConditions();
    }

    async getTermsConditions() {
        await axios({
            method: 'get',
            url: `${config.apiUrl}/getTermsConditions`
        })
            .then(response => {
                if (response.data.success === true) {
                    this.setState({
                        landingPage: response.data.response[0]
                    })

                }
            })
    }

    async submitLandingForm(e) {
        e.preventDefault()
        var data = {
            terms_conditions: this.state.terms_conditions

        }
        await axios({
            method: 'post',
            url: `${config.apiUrl}/updateTermsConditions`, data,

        })
            .then(result => {
                if (result.data.success === true) {

                    toast.success(result.data.msg, {
                        position: toast.POSITION.TOP_CENTER
                    });
                }

                else if (result.data.success === false) {
                    toast.error(result.data.msg, {
                        position: toast.POSITION.TOP_CENTER
                    });

                }

            }).catch(err => {
                console.log(err);

            });
    }

    updateContent = (value) => {
        this.setState({ 'terms_conditions': value })
    }

    render() {
        return (

            <>
                <ToastContainer />
                <div className="wrapper theme-6-active pimary-color-green">
                    <Header />
                    <Leftsidebar />
                    <div className="right-sidebar-backdrop"></div>
                    <div className="page-wrapper nft-user">
                        <div className="container-fluid">
                            <div className="row heading-bg">
                                <div className="col-lg-3 col-md-4 col-sm-4 col-xs-12">
                                    <h5 className="txt-dark">Terms and Condition</h5>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-md-12">
                                    <div className="form-group">
                                        <JoditEditor
                                            editorRef={this.setRef} style={{ color: '#000' }}
                                            value={this.state.landingPage?.terms_conditions}
                                            config={this.config}
                                            onChange={this.updateContent}
                                        />
                                    </div>
                                    <div className="col-md-6">
                                        <div className="form-group">
                                            <label className="control-label mb-10"></label>
                                            <button type="submit" onClick={this.submitLandingForm} className="btn btn-primary">Update</button>
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


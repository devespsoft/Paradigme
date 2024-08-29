import React, { Component } from 'react';
import Header from '../directives/header'
import Leftsidebar from '../directives/leftsidebar'
import Footer from '../directives/footer'
import axios from 'axios'
import config from '../config/config'
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';
import { confirmAlert } from 'react-confirm-alert'; // Import
import ReactDatatable from '@ashvin27/react-datatable'
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css
import Cookies from 'js-cookie';

export default class categorylist extends Component {

    constructor(props) {
        super(props)
        this.state = {
            category_list: [],
            category_names: [],
            viewAllData : '',
            update_id: '',
            getCategoryData: ''
        };
        this.deleteCategory = this.deleteCategory.bind(this);
        this.onChange = this.nftUserDetail.bind(this)
        this.updateSupport = this.updateSupport.bind(this)

        this.loginData = (!Cookies.get('loginSuccessParadigmeAdmin')) ? [] : JSON.parse(Cookies.get('loginSuccessParadigmeAdmin'));

        this.columns = [
            {
                key: '#',
                text: '#',
                cell: (row, index) => index + 1
            },

            {
                key: "category",
                text: "Category",
                cell: (item) => {
                    return (
                        <td nowrap="nowrap">
                            <span>
                                {item.support_category}
                            </span>
                        </td>
                    )
                }
            },
            {
                key: "question",
                text: "Question",
                cell: (item) => {
                    return (
                        <td nowrap="nowrap">
                            <span>
                                {item.question.length > 50 ? 
                                <>
                                    {item.question.substring(0,50)+'.....'}
                                    <a href="javascript:void(0)" data-toggle="modal" onClick={this.viewmore.bind(this, item.question)} data-target="#viewmore">more</a>
                                </>
                                : 
                                    item.question
                                }
                            </span>
                        </td>
                    )
                }
            },
            {
                key: "answer",
                text: "Answer",
                cell: (item) => {
                    return (
                        <td nowrap="nowrap">
                            <span>
                                {item.answer.length > 50 ? 
                                <>
                                    {item.answer.substring(0,50)+'.....'}
                                    <a href="javascript:void(0)" data-toggle="modal" onClick={this.viewmore.bind(this, item.answer)} data-target="#viewmore">more</a>
                                </>
                                : 
                                    item.answer
                                }
                            </span>
                        </td>
                    )
                }
            },
            {
                key: "action",
                text: "Action",
                cell: (item) => {
                    return (
                        <td nowrap="nowrap">
                            <button type="submit" data-toggle="modal" onClick={this.editCategory.bind(this, item)} data-target="#responsive-modal2" className="btn-primary" data-original-title="Edit"> <i class="fa fa-pencil text-inverse m-r-10"></i> </button>&nbsp;&nbsp;
                            <button className=" btn-danger" onClick={this.deleteCategory.bind(this, item)} data-toggle="tooltip" data-original-title="Close"> <i class="fa fa-close m-r-10"></i> </button>
                        </td>
                    )
                }
            },
        ];
        this.config = {
            page_size: 10,
            length_menu: [10, 20, 50],
            show_filter: true,
            show_pagination: true,
            pagination: 'advance',
            button: {
                excel: false,
                print: false
            }
        }

    }

    componentDidMount() {
        this.categoryList();
        this.categoryName();
    }

    viewmore(value){
        this.setState({
            viewAllData : value
        })
    }

    async categoryList() {
        await
            axios({
                method: 'get',
                url: `${config.apiUrl}supportList`,
                data: {}
            }).then(result => {
                if (result.data.success === true) {
                    this.setState({
                        category_list: result.data.data
                    })
                }
                else if (result.data.success === false) {

                }
            }).catch(err => {

            })
    }


    async categoryName() {
        await
            axios({
                method: 'get',
                url: `${config.apiUrl}getSupportCategory`,
                data: {}
            }).then(result => {
                if (result.data.success === true) {
                    this.setState({
                        category_names: result.data.data
                    })
                }
                else if (result.data.success === false) {

                }
            }).catch(err => {

            })
    }

    async editCategory(support_id) {
        await axios({
            method: 'post',
            url: `${config.apiUrl}supportListById`,
            // headers: { "Authorization": this.loginData.Token },
            data: { "email": this.loginData?.data.user_email, 'is_admin': this.loginData.data.is_admin, "support_id": support_id.support_id, "user_id": this.state.user_id }
        }).then(result => {
            if (result.data.success === true) {
                this.setState({
                    getCategoryData: result.data.data
                })
            }
            else if (result.data.success === false) {

            }
        }).catch(err => {

        })
    }

    async deleteCategory(support_id) {

        confirmAlert({
            title: 'Confirm to submit',
            message: 'Are you sure to delete this Category..',
            buttons: [
                {
                    label: 'Yes',
                    onClick: () =>

                        axios.post(`${config.apiUrl}/deleteSupport`, { 'is_admin': this.loginData.data.is_admin, 'support_id': support_id.support_id })

                            .then(result => {

                                toast.success(result.data.msg, {
                                    position: toast.POSITION.TOP_CENTER
                                });
                                this.categoryList()
                            }).catch(err => {
                                toast.error(err.response.data?.msg, {
                                    position: toast.POSITION.TOP_CENTER,

                                }, setTimeout(() => {

                                }, 500));
                            })
                },
                {
                    label: 'No',
                }
            ]
        });
    }

    nftUserDetail = event => {
        event.preventDefault()
        let value = event.target.value;
        this.setState(prevState => ({
            getCategoryData: { ...prevState.getCategoryData, [event.target.name]: value }
        }))
    }

    handleChange = e => {
        this.setState({
            [e.target.name]: e.target.value
        });
    }

    handleSubmit = event => {
        event.preventDefault();
        axios({
            method: 'post',
            url: `${config.apiUrl}insertSupport`,
            // headers: { "Authorization": this.loginData?.Token },
            data: { 'is_admin': this.loginData.data.is_admin, 'category_id': this.state.category_id, 'question': this.state.question, 'answer': this.state.answer }
        })
            .then(result => {

                if (result.data.success === true) {
                    toast.success(result.data.msg, {
                        position: toast.POSITION.TOP_CENTER,
                    }, setTimeout(() => {
                        // window.location.reload();
                    }));

                    this.categoryList();
                    this.setstate({
                        name: ''
                    })

                }
            }).catch((error) => {
                toast.error(error.data?.msg, {
                    position: toast.POSITION.TOP_CENTER,

                }, setTimeout(() => {

                }, 500));

            })
    }


    async updateSupport(e) {
        e.preventDefault()
        this.state.getCategoryData.email = this.loginData?.data.user_email
        await axios({
            method: 'post',
            url: `${config.apiUrl}updateSupport`,
            // headers: { "Authorization": this.loginData.Token },
            data: this.state.getCategoryData
        }).then(response => {
            if (response.data.success === true) {
                toast.success(response.data.msg, {
                    position: toast.POSITION.TOP_CENTER
                });
                window.location.reload()
            }
            else if (response.data.success === false) {
                toast.error(response.data.msg, {
                    position: toast.POSITION.TOP_CENTER
                });
            }
        })
            .catch(err => {
                toast.error(err?.response?.data?.msg, {
                    position: toast.POSITION.TOP_CENTER
                });

            })
    }

    render() {
        return (
            <>
                <ToastContainer />
                <div className="wrapper theme-6-active pimary-color-green">
                    <Header />
                    <Leftsidebar />
                    <div className="right-sidebar-backdrop"></div>
                    <div className="page-wrapper">
                        <div className="container-fluid">
                            {/* <!-- Title --> */}
                            <div className="row heading-bg">
                                <div className="col-lg-3 col-md-4 col-sm-4 col-xs-12">
                                    <h5 className="txt-dark">Support List</h5>
                                </div>
                            </div>

                            <div className="row">
                                <div className="col-sm-12">
                                    <div className="panel panel-default card-view">
                                        <div className="panel-wrapper collapse in">
                                            <div className="panel-body">
                                                <div className="form-wrap">
                                                    <form action="#">

                                                        <div className="row">
                                                        </div>
                                                        <div className="form-actions">
                                                            <button type='button' data-toggle="modal" data-target="#responsive-modal1" className="btn btn-primary">Add Faq </button> <br /><br />

                                                            <div className="clearfix"></div>
                                                        </div>
                                                    </form>
                                                </div>
                                                <div className="form-wrap">

                                                    <div className="table-responsive">
                                                        <ReactDatatable
                                                            config={this.config}
                                                            records={this.state.category_list}
                                                            columns={this.columns}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                </div>
                            </div>

                            <div id="responsive-modal1" class="modal fade" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true" style={{ display: "none" }}>
                                <div class="modal-dialog">
                                    <div class="modal-content">

                                        <div class="modal-body">
                                            <form>

                                                <div>
                                                    <div className="form-group mb-0">
                                                        <label className="control-label mb-10">Category</label>
                                                        <select name="category_id" onChange={this.handleChange} value={this.state.category_id} class="form-control  basic">
                                                            <option value="0">Select Category</option>
                                                            {this.state.category_names.map(item => (
                                                                <option value={item.id}>{item.name}</option>
                                                            ))}
                                                        </select>
                                                    </div>
                                                    <div className="form-group mb-0">
                                                        <label className="control-label mb-10">Question</label>
                                                        <input type="text" id="firstName" onChange={this.handleChange} name="question" className="form-control" placeholder="Question" value={this.state.question} />
                                                    </div>
                                                    <div className="form-group mb-0">
                                                        <label className="control-label mb-10">Answer</label>
                                                        <textarea type="text" id="firstName" onChange={this.handleChange} name="answer" className="form-control" placeholder="Answer" value={this.state.answer} />
                                                    </div>
                                                </div>
                                            </form>
                                        </div>
                                        <div class="modal-footer pt-0">
                                            <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>

                                            <button type='submit' disabled={!this.state.answer || !this.state.question || !this.state.category_id} onClick={this.handleSubmit} data-dismiss="modal" className="btn btn-primary">Add </button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div id="responsive-modal2" class="modal fade" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true" style={{ display: "none" }}>
                                <div class="modal-dialog">
                                    <div class="modal-content">
                                        <div class="modal-body">
                                            <form>
                                                <div>
                                                    <div className="form-group mb-0">
                                                        <label className="control-label mb-10">Category Type</label>
                                                    </div>

                                                    <div className="form-group mb-0">
                                                        <label className="control-label mb-10">Category</label>
                                                        <select name="category_id" onChange={this.nftUserDetail} value={this.state.getCategoryData?.category_id} class="form-control  basic">
                                                            <option selected="selected" value="">Select Category</option>
                                                            {this.state.category_names.map(item => (
                                                                <option value={item.id}>{item.name}</option>
                                                            ))}
                                                        </select>
                                                    </div>

                                                    <div className="form-group mb-0">
                                                        <label className="control-label mb-10">Question</label>
                                                        <input type="text" id="firstName" onChange={this.nftUserDetail} name="question" className="form-control" placeholder="Queston" value={this.state.getCategoryData?.question} />
                                                    </div>

                                                    <div className="form-group mb-0">
                                                        <label className="control-label mb-10">Answer</label>
                                                        <textarea type="text" id="firstName" onChange={this.nftUserDetail} name="answer" className="form-control" placeholder="Answer" value={this.state.getCategoryData?.answer} />
                                                    </div>
                                                </div>
                                            </form>
                                        </div>
                                        <div class="modal-footer pt-0">
                                            <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
                                            <button type='submit' onClick={this.updateSupport} className="btn btn-primary">Update </button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div id="viewmore" class="modal fade" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true" style={{ display: "none" }}>
                                <div class="modal-dialog">
                                    <div class="modal-content">
                                        <div class="modal-body">
                                            <br />
                                           {this.state.viewAllData? this.state.viewAllData : ''}    
                                        </div>
                                        <div class="modal-footer pt-0">
                                            <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
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

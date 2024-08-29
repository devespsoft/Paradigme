import React, { Component } from 'react';
import Header from '../directives/header'
import Leftsidebar from '../directives/leftsidebar'
import Footer from '../directives/footer'
import axios from 'axios'
import config from '../config/config'
import 'react-toastify/dist/ReactToastify.css';
import toast, { Toaster } from 'react-hot-toast';
import Cookies from 'js-cookie';
import ReactDatatable from '@ashvin27/react-datatable'
import { Link } from 'react-router-dom'
import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css
// import ReactDatatable from 'react-datatable';

export default class userlist extends Component {
    constructor(props) {
        super(props)
        this.state = {
            email: '',
            user_id: '',
            user_list: [],
            data: [],
            index: 0,
            checkSelect: ''
        };
        this.loginData = (!Cookies.get('loginSuccessParadigmeAdmin')) ? [] : JSON.parse(Cookies.get('loginSuccessParadigmeAdmin'));
        this.token = (!Cookies.get('token')) ? [] : JSON.parse(Cookies.get('token'));

        this.columns = [
            {
                key: '#',
                text: '#',
                cell: (row, index) => index + 1
            },
            {
                key: "full_name",
                text: "User Name",
                sortable: true
            },
            {
                key: "email",
                text: "Email",
                cell: (item) => {
                    return (
                        <td nowrap="nowrap">
                            <span>
                            </span>
                            <>
                               {!item.email || item.email == 'null'? "" : item.email }
                            </>
                        </td>
                    )
                },
                sortable: true
            },
            {
                key: "address",
                text: "Address",
                cell: (item) => {
                    return (
                        <td nowrap="nowrap">
                            <span>
                            </span>
                            <>
                                <a href={config.blockchinUrl + item.address} target="_blank" >
                                    <p title={item.address}>{item.address == null ? '' : item.address.toString().substring(0, 8) + '...' + item.address.toString().substr(item.address.length - 8)}</p>
                                </a>
                            </>
                        </td>
                    )
                }
            },


            {
                key: "Action",
                text: "Action",
                cell: (item) => {
                    return (
                        <>
                            <Link to={`${config.baseUrl}userDetail/${item.id}`} data-toggle="tooltip" data-original-title="" style={{ margin: "5px" }} >
                                <button type='button' className="btn-primary" ><i class="fa fa-eye"></i> </button>

                            </Link>

                        </>
                    );
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

    redirectPage(address) {
        window.open(config.ethUrl + address, '_blank');
    }

    componentDidMount() {
        if (!Cookies.get('loginSuccessParadigmeAdmin')) {
            window.location.href = `${config.baseUrl}`
            return false;
        }
        this.userList();
    }

    checkData(id) {
        if (id.is_featured === 0) {
            confirmAlert({
                title: 'Confirm to submit',
                message: 'Are you sure to Feature creator this.',
                buttons: [
                    {
                        label: 'Yes',
                        onClick: () =>
                            axios({
                                method: 'post',
                                url: `${config.apiUrl}addFeatured`,
                                headers: { "Authorization": this.loginData?.Token },
                                data: { 'email': id.email, 'user_id': id.id }
                            }).then((res) => {
                                toast.success(res.data.msg);
                                this.componentDidMount()
                            }).catch((error) => {
                                toast.danger(error.data.msg);
                            })
                    },
                    {
                        label: 'No',
                    }
                ]
            });
        }
        else if (id.is_featured === 1) {
            confirmAlert({
                title: 'Confirm to submit',
                message: 'Are you sure to remove Feature creator this.',
                buttons: [
                    {
                        label: 'Yes',
                        onClick: () =>
                            axios({
                                method: 'post',
                                url: `${config.apiUrl}removeFeatured`,
                                headers: { "Authorization": this.loginData?.Token },
                                data: { 'email': id.email, 'user_id': id.id }
                            })
                                .then((res) => {
                                    toast.success(res.data.msg);
                                    this.componentDidMount()
                                }).catch((error) => {
                                    toast.danger(error.data.msg);
                                })
                    },
                    {
                        label: 'No',
                    }
                ]
            });
        }
    }


    async userList() {

        await axios.get(`${config.apiUrl}getuser`, {},)
            .then(result => {
                const data = result.data;
                console.log('result', result)

                if (result.data.success === true) {
                    this.setState({
                        user_list: result.data.response,
                    })
                }
                else if (result.data.success === false) {

                }
            })

            .catch(err => {
            })
    }




    updateApprovedAPI = (id) => {
        confirmAlert({
            title: 'Confirm to submit',
            message: 'Are you sure to approve him.',
            buttons: [
                {
                    label: 'Yes',
                    onClick: () =>
                        axios({
                            method: 'post',
                            url: `${config.apiUrl}updateTelentForApproved`,
                            data: { 'email': id.email, 'user_id': id.id }
                        })
                            .then((res) => {
                                toast.success(res.data.msg, {
                                    position: toast.POSITION.TOP_CENTER
                                });
                                this.componentDidMount()
                            }).catch((error) => {
                                toast.danger(error.data.msg, {
                                    position: toast.POSITION.TOP_CENTER
                                });
                            })
                },
                {
                    label: 'No',
                }
            ]
        });
    }

    updateRejectAPI = (id) => {
        confirmAlert({
            title: 'Confirm to submit',
            message: 'Are you sure to reject him.',
            buttons: [
                {
                    label: 'Yes',
                    onClick: () =>

                        axios({
                            method: 'post',
                            url: `${config.apiUrl}updateTelentForReject`,
                            data: { 'email': id.email, 'user_id': id.id }
                        })

                            .then((res) => {
                                toast.success(res.data.msg, {
                                    position: toast.POSITION.TOP_CENTER
                                });
                                this.componentDidMount()
                            }).catch((error) => {
                                toast.danger(error.data.msg, {
                                    position: toast.POSITION.TOP_CENTER
                                });
                            })
                },
                {
                    label: 'No',
                }
            ]
        });
    }


    async deleteUser(id) {

        confirmAlert({
            title: 'Confirm to submit',
            message: 'Are you sure to delete this User..',
            buttons: [
                {
                    label: 'Yes',
                    onClick: () =>
                        axios({
                            method: 'post',
                            url: `${config.apiUrl}deleteuser`,
                            headers: { "Authorization": this.loginData?.Token },
                            data: { 'email': this.loginData?.data.user_email, id: id.id }
                        })
                            .then(result => {

                                toast.success(result.data.msg, {
                                    position: toast.POSITION.TOP_CENTER
                                });
                                this.userList();
                            }).catch((error) => {
                                toast.danger(error.data.msg, {
                                    position: toast.POSITION.TOP_CENTER
                                });
                            })
                },
                {
                    label: 'No',
                }
            ]
        });
    }


    updateDeactiveAPI(id) {
        confirmAlert({
            title: 'Confirm to submit',
            message: 'Are you sure you want to Inactive the user.',
            buttons: [
                {
                    label: 'Yes',
                    onClick: () =>
                        axios.post(`${config.apiUrl}userInativate`, { 'id': id.id })
                            .then(result => {

                                if (result.data.success === true) {
                                    toast.success(result.data.msg);
                                    this.componentDidMount();

                                }

                                else if (result.data.success === false) {

                                }
                            })

                            .catch(err => {
                            })
                },
                {

                    label: 'No',
                }
            ]
        });
    }
    updateActivateAPI(id) {
        confirmAlert({
            title: 'Confirm to submit',
            message: 'Are you sure you want to Active the user .',
            buttons: [
                {
                    label: 'Yes',
                    onClick: () =>
                        axios.post(`${config.apiUrl}/userActive`, { 'id': id.id })
                            .then(result => {

                                if (result.data.success === true) {
                                    toast.success(result.data.msg);

                                    this.componentDidMount();

                                }

                                else if (result.data.success === false) {

                                }
                            })

                            .catch(err => {
                            })
                },
                {
                    label: 'No',
                }
            ]
        });
    }





    render() {

        return (

            <>
                <Toaster />
                <div className="wrapper theme-6-active pimary-color-green">
                    <Header />
                    <Leftsidebar />
                    <div className="page-wrapper nft-user">
                        <div className="container-fluid">
                            <div className="row heading-bg">
                                <div className="col-lg-3 col-md-4 col-sm-4 col-xs-12">
                                    <h5 className="txt-dark">Users List</h5>
                                </div>
                            </div>

                            <div className="row">
                                <div className="col-sm-12">
                                    <div className="panel panel-default card-view">
                                        <div className="panel-wrapper collapse in">
                                            <div className="panel-body">
                                                <div className="form-wrap">
                                                    <div class="table-responsive">
                                                        <ReactDatatable
                                                            config={this.config}
                                                            records={this.state.user_list}
                                                            columns={this.columns}
                                                        />
                                                    </div>
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

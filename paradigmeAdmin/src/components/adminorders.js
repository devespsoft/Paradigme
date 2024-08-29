import React, { Component } from 'react';
import Header from '../directives/header'
import Leftsidebar from '../directives/leftsidebar'
import Footer from '../directives/footer'
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';
import axios from 'axios'
import config from '../config/config'
import Cookies from 'js-cookie';
import ReactDatatable from '@ashvin27/react-datatable'
import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css
import { EmailIcon, EmailShareButton } from 'react-share';

export default class adminorder extends Component {
    constructor(props) {
        super(props)
        this.state = {
            from_address: '',
            to_address: '',
            hash: '',
            amount: '',
            currency: '',
            datetime: '',
            getAllTransaction: [],
            user_list: [],
            transaction_type: '',
            from_date: '',
            to_date: '',
            from_amount: '',
            to_amount: '',
            physicalNftShow: false,
            physicalData: ''
        };
        this.loginData = (!Cookies.get('loginSuccessParadigmeAdmin')) ? [] : JSON.parse(Cookies.get('loginSuccessParadigmeAdmin'));
        this.userTransaction = this.userTransaction.bind(this);
        this.onChange = this.onChange.bind(this)
        this.columns = [
            {
                key: '#',
                text: '#',
                cell: (row, index) => index + 1
            },

            // {
            //     key: "full_name",
            //     text: "User Name"
            // },

            {
                key: "item_name",
                text: "NFT Name",
                cell: (item) => {
                    return (
                        <>
                            <a href={`${config.redirectUrl + 'nftDetails/' + item.item_id}`} target="_blank" >
                                {item.item_name}
                            </a>

                        </>
                    );
                }
            },

            {
                key: "amount",
                text: "AMOUNT",
            },
            {
                key: "Nft Type",
                text: "Nft Type",
                cell: (item) => {
                    return (
                        item.nft_type_select == '1' ?
                            'Physical'
                            : 'Digital'
                    );
                }

            },
            {
                key: "owner_name",
                text: "Nft Owner",
                cell: (item) => {
                    return (
                        <a href={`${config.redirectUrl1 + 'userProfile/' + item.owner_id}`} target="_blank" >
                            {item.owner_name}
                        </a>

                    );
                }
            },
            // {
            //     key: "transaction_type",
            //     text: "Transaction Type",
            //     sortable: true,
            //     cell: (item) => {
            //         return (
            //             item.transaction_type == 'Sell' ?
            //                 <td nowrap="nowrap" style={{ 'color': 'red' }}>
            //                     {item.transaction_type}
            //                 </td>
            //                 :
            //                 item.transaction_type == 'Buy' ?
            //                     <td nowrap="nowrap" style={{ 'color': 'blue' }}>
            //                         {item.transaction_type}
            //                     </td>
            //                     :
            //                     item.transaction_type == 'Withdrawal' ?
            //                         <td nowrap="nowrap" style={{ 'color': 'Green' }}>
            //                             {item.transaction_type}
            //                         </td>
            //                         :
            //                         item.transaction_type == 'Royalty Received' ?
            //                             <td nowrap="nowrap" style={{ 'color': 'black' }}>
            //                                 {item.transaction_type}
            //                             </td>
            //                             :
            //                             <td nowrap="nowrap">
            //                                 {item.transaction_type}
            //                             </td>
            //         );
            //     }

            // },
            {
                key: "transaction_status",
                text: "Transaction Status",
                sortable: true,

            },
            {
                key: "datetime",
                text: "Date",
                cell: (item) => {
                    return (
                        <td nowrap="nowrap">
                            {item.datetime.slice(0, 10)}
                        </td>
                    );
                }
            },
            {
                key: "hash",
                text: "Hash",
                cell: (item) => {
                    return (
                        <td nowrap="nowrap">
                            <span>

                            </span>
                            <>
                                <a href={`${config.blockchainUrl + item.hash}`} target="_blank" >
                                    <p title={item.hash}>{item.hash == null ? '' : item.hash.toString().substring(0, 8) + '...' + item.hash.toString().substr(item.hash.length - 8)}</p>
                                </a>

                            </>
                        </td>
                    )
                }
            },
            {
                key: "order_status",
                text: "order Status",
                cell: (item) => {
                    return (
                        <td nowrap="nowrap">
                            <span>
                                {item.nft_type_select == '1' ?


                                    item.order_status == 1 ? <p style={{ color: 'yellow' }}>In progress</p> :
                                        item.order_status == 2 ? <p style={{ color: '#a35502' }}>Shipped</p> : item.order_status == 3 ? <p style={{ color: 'green' }}>Delivered</p> : '' : 'NA'
                                }
                            </span>

                        </td>
                    )
                }
            },
            {
                text: "Shipped Address",
                cell: (item) => {
                    return (
                        <td nowrap="nowrap">


                            {item.nft_type_select == '1' ?
                                <>
                                    <EmailShareButton
                                        url={''}
                                        title="Share via Email"
                                        subject={"Address"}
                                        body={
                                            `Item is : ${item.item_name}
                                    Shipped Adress is : Mobile number: ${item.mobile_number}, Pin code: ${item.pin_code}, Shipping Address : ${item.shipping_address}, Locality : ${item.locality}, City : ${item.city}, State : ${item.state}, Landmark : ${item.landmark} `

                                        }
                                        className="Demo__some-network__share-button">
                                        <EmailIcon
                                            title="Share via Email"
                                            size={32}
                                            round />
                                    </EmailShareButton>

                                    <button style={{ marginTop: '-27px', marginLeft: '5px' }} className='btn btn-primary' onClick={this.purchaseItem.bind(this, item)}>Shipped Address</button>

                                </>
                                : 'NA'
                            }

                        </td>
                    )
                }
            },
            // {
            //     text: "Buyer Address",
            //     cell: (item) => {
            //         return (
            //             <td nowrap="nowrap">
            //                 <span>

            //                 </span>
            //                 <>
            //                     <a href={`${config.blockchainUrl + item.hash}`} target="_blank" >
            //                         <p title={item.hash}>{item.hash == null ? '' : item.hash.toString().substring(0, 8) + '...' + item.hash.toString().substr(item.hash.length - 8)}</p>
            //                     </a>

            //                 </>
            //             </td>
            //         )
            //     }
            // },
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


    async closeModel() {
        this.setState({
            physicalNftShow: false
        })
    }


    async purchaseItem(item) {
        console.log(item);
        this.setState({
            physicalNftShow: true,
            physicalData: item
        })
    }


    onChange(e) {

        this.setState({
            [e.target.name]: e.target.value
        })
        if (e.target.name === 'transaction_type') {
            this.userTransaction(e.target.value, this.state.from_date, this.state.to_date, this.state.from_amount, this.state.to_amount)
        }
        if (e.target.name === 'from_date') {
            this.userTransaction(this.state.transaction_type, e.target.value, this.state.to_date, this.state.from_amount, this.state.to_amount)
        } if (e.target.name === 'to_date') {
            this.userTransaction(this.state.transaction_type, this.state.from_date, e.target.value, this.state.from_amount, this.state.to_amount)
        } if (e.target.name === 'from_amount') {
            this.userTransaction(this.state.transaction_type, this.state.from_date, this.state.to_date, e.target.value, this.state.to_amount)
        } if (e.target.name === 'to_amount') {
            this.userTransaction(this.state.transaction_type, this.state.from_date, this.state.to_date, this.state.from_amount, e.target.value)
        }
    }

    componentDidMount() {
        if (!Cookies.get('loginSuccessParadigmeAdmin')) {
            window.location.href = `${config.baseUrl}`
            return false;
        }
        this.userTransaction();
    }
    // async filterData(transaction_type) {
    //     alert(transaction_type)
    // }
    async userTransaction(transaction_type, from_date, to_date, from_amount, to_amount) {
        console.log(this.state.transaction_type);

        if (transaction_type === undefined) {
            transaction_type = ''
        }
        else if (from_date === undefined) {
            from_date = ''
        }
        else if (to_date === undefined) {
            to_date = ''
        }
        else if (from_amount === undefined) {
            from_amount = ''
        }
        else if (to_amount === undefined) {
            to_amount = ''
        }

        await axios.post(`${config.apiUrl}getAllTransaction`, { 'is_admin': this.loginData.data.is_admin, 'transaction_type_id': transaction_type, 'from_date': from_date, 'to_date': to_date, 'from_amount': from_amount, 'to_amount': to_amount }, {})
            .then(result => {
                console.log(result)
                if (result.data.success === true) {
                    this.setState({
                        user_list: result.data.response.filter(item => item.full_name == "Admin " && item.transaction_type == "Sell Product")
                    })
                }
                else if (result.data.success === false) {
                }
            })
            .catch(err => {
                this.setState({
                    user_list: []
                })
            })
    }


    async NftShippedPhysical(item) {
        var data = {
            id: item.item_id,
            order_status: 2

        }
        await axios({
            method: 'post',
            url: `${config.apiUrl}/updateTransaction`, data,

        })
            .then(result => {
                if (result.data.success === true) {

                    toast.success(result.data.msg, {
                        position: toast.POSITION.TOP_CENTER
                    });
                    setTimeout(() => {
                        window.location.reload()
                    }, 2000)
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


    render() {

        return (

            <>

                <ToastContainer />
                <div className="wrapper theme-6-active pimary-color-green">
                    <Header />
                    <Leftsidebar />
                    <div className="setting-panel">
                        <ul className="right-sidebar nicescroll-bar pa-0">
                        </ul>
                    </div>
                    <div className="right-sidebar-backdrop"></div>
                    <div className="page-wrapper nft-user">
                        <div className="container-fluid">
                            <div className="row heading-bg">
                                <div className="col-lg-3 col-md-4 col-sm-4 col-xs-12">
                                    <h5 className="txt-dark">Admin Transaction</h5>
                                </div>
                            </div>
                            <div className="panel panel-default card-view" >
                                {/* <div className="row mb-4">
                                <div class="col-xl-3 col-lg-3 col-md-3 col-sm-12">
                                    <div className='bannerimage'>
                                        {console.log(this.state.transaction_type)}
                                        <label for="email" class="pt-2">Transaction Type</label>
                                        <select id="transaction_type" name="transaction_type" value={this.state.transaction_type} class="form-control" onChange={this.onChange} >
                                            <option>All</option>
                                            <option value="1">Sell </option>
                                            <option value="6">Withdrawal</option>
                                            <option value="3">Buy</option>
                                            <option value="11">Deposit</option>
                                            <option value="14">Minting Fees</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="col-lg-9 col-md-8 col-sm-8 col-xs-12">
                                    <div className="row">
                                        <div class="col-xl-3 col-lg-3 col-md-3 col-sm-12">
                                            <div className='date'>
                                                <label for="email" class="pt-2">From</label>

                                                <input type="date" className="form-control" name="from_date" value={this.state.from_date} onChange={this.onChange} />
                                            </div>
                                        </div>
                                        <div class="col-xl-3 col-lg-3 col-md-3 col-sm-12">
                                            <div className='date'>
                                                <label for="email" class="pt-2">To</label>

                                                <input type="date" className="form-control" name="to_date" value={this.state.to_date} onChange={this.onChange} />
                                            </div>
                                        </div>
                                        <div class="col-xl-3 col-lg-3 col-md-3 col-sm-12">
                                            <div className='date'>
                                                <label for="email" class="pt-2">From Amount</label>

                                                <input type="text" className="form-control" name="from_amount" value={this.state.from_amount} onChange={this.onChange} />
                                            </div>
                                        </div>
                                        <div class="col-xl-3 col-lg-3 col-md-3 col-sm-12">
                                            <div className='date'>
                                                <label for="email" class="pt-2">To Amount</label>
                                                <input type="text" className="form-control" name="to_amount" value={this.state.to_amount} onChange={this.onChange} />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <br />
                            </div> */}
                                <div className="row">
                                    <div className="col-sm-12">
                                        <div className="table-responsive">
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
                        <Footer />
                    </div>
                </div>



                <div className={this.state.physicalNftShow == true ? 'modal fade in show' : 'modal fade'} style={{ display: this.state.physicalNftShow == true ? 'block' : 'none' }} id="createCollection" tabindex="-1" aria-labelledby="createCollectionLabel" aria-hidden="true">
                    <div className="modal-dialog modal-lg">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title" id="createCollectionLabel">Shipping Address</h5>
                                {/* <button type="submit" className="btn-close" onClick={this.closeModel.bind(this)}></button> */}
                            </div>
                            <div className="modal-body">
                                <div className="row">
                                    <div className="col-sm-12 col-xs-12">
                                        <div className="tab-content create-collection" id="v-pills-tabContent">
                                            <div className="be-large-post">
                                                {/* <h2 class="mt-5 mb-5">Create Collection</h2> */}
                                                <div className="spacer-single" />

                                                <div className="socail_news row">
                                                    <div className='col-md-6'>
                                                        <h5>Mobile Number</h5>
                                                        <input type="number" placeholder='Enter mobile number' name="mobile_number" disabled value={this.state.physicalData?.mobile_number ? this.state.physicalData?.mobile_number : ''} className="form-control mb-4" />
                                                    </div>

                                                    <div className='col-md-6'>
                                                        <h5>Pin Code</h5>
                                                        <input type="text" placeholder='Enter Pin Code' name="pin_code" disabled value={this.state.physicalData?.pin_code ? this.state.physicalData?.pin_code : ''} className="form-control mb-4" />
                                                    </div>
                                                </div>


                                                <div className="socail_news row">


                                                    <div className='col-md-12'>
                                                        <h5>Address</h5>
                                                        <textarea placeholder='Enter shipping address' name="shipping_address" disabled value={this.state.physicalData?.shipping_address ? this.state.physicalData?.shipping_address : ''} className="form-control mb-4" rows="4" cols="50">

                                                        </textarea>
                                                    </div>
                                                </div>


                                                <div className="socail_news row">

                                                    <div className='col-md-6'>
                                                        <h5>Locality</h5>
                                                        <input type="text" placeholder='Enter Locality' name="locality" disabled value={this.state.physicalData?.locality ? this.state.physicalData?.locality : ''} className="form-control mb-4" />
                                                    </div>

                                                    <div className='col-md-6'>
                                                        <h5>City</h5>
                                                        <input type="text" placeholder='Enter city' name="city" disabled value={this.state.physicalData?.city ? this.state.physicalData?.city : ''} className="form-control mb-4" />
                                                    </div>


                                                </div>

                                                <div className="socail_news row">
                                                    <div className='col-md-6'>
                                                        <h5>State</h5>
                                                        <input type="text" placeholder='Enter state' name="state" disabled value={this.state.physicalData?.state ? this.state.physicalData?.state : ''} className="form-control mb-4" />
                                                    </div>
                                                    <div className='col-md-6'>
                                                        <h5>LandMark</h5>
                                                        <input type="text" placeholder='Enter landmark' name="landmark" disabled value={this.state.physicalData?.landmark ? this.state.physicalData?.landmark : ''} className="form-control mb-4" />
                                                    </div>



                                                </div>

                                                <br />
                                                <div className="socail_news mt-4">
                                                    {this.state.physicalData.order_status == 1 ?
                                                        <button id="submit" className="btn btn-primary" type="submit" onClick={this.NftShippedPhysical.bind(this, this.state.physicalData)}  >Confirm to Shipped</button> : ''
                                                    }

                                                </div>
                                            </div>

                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" style={{ background: 'red', color: '#fff' }} onClick={this.closeModel.bind(this)}>Close</button>
                            </div>
                        </div>
                    </div>
                </div>

            </>


        )

    }
}

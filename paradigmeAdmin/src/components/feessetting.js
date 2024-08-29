import React, { Component } from 'react';
import Header from '../directives/header'
import Leftsidebar from '../directives/leftsidebar'
import Footer from '../directives/footer'
import axios from 'axios'
import config from '../config/config'
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';
import { Dialog, Classes } from "@blueprintjs/core";
import '@blueprintjs/core/lib/css/blueprint.css';
import BarLoader from 'react-bar-loader'
import Web3 from 'web3';
export default class feessetting extends Component {

    constructor(props) {
        super(props)
        this.state = {
            bid_increase_percentage: '',
            admin_address: '',
            admin_commission: '',
            isDialogOpen: false
        };
        this.getFeesAPI = this.getFeesAPI.bind(this)
        this.updateFeesAPI = this.updateFeesAPI.bind(this)
        this.updateSetting = this.updateSetting.bind(this);

    }

    componentDidMount() {
        this.getFeesAPI();
        this.getWalletDetailsAPI()
    }


    //================================  Owner public key ====================================

    async getWalletDetailsAPI(){
        var web3 = new Web3(window.ethereum);
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        const contractAddress = config.marketplaceContract;
        const contract = await new web3.eth.Contract(config.abiMarketplace, contractAddress);
        var from_address = accounts[0];
        web3.eth.defaultAccount = from_address;
        let myToken = await contract.methods.settlementFeeAddress().call();
        this.setState({
            admin_address:myToken
        })
        console.log(this.state.admin_address);
    }

    handleChange1 = e => {
        this.setState({
            [e.target.name]: e.target.value
        })
    }


    getFeesAPI = async e => {
        await axios.get(`${config.apiUrl}getFees`, {})
            .then(result => {
                if (result.data.success === true) {
                    this.setState({
                        bid_increase_percentage: result.data.response[0].bid_increase_percentage,
                        admin_commission: result.data.response[0].admin_commission

                    })
                }
            })
    }

    onChange = event => {
        this.setState({
            [event.target.name]: event.target.value
        })
    };

    async updateFeesAPI(type) {
        var data = {
            bid_increase_percentage: this.state.bid_increase_percentage,
            admin_commission:this.state.admin_commission
        }
        axios.post(`${config.apiUrl}updateFees`, data, {})
            .then(response => {
                if (response.data.success === true) {
                    toast.success('Updated Successfully');
                }
                else if (response.data.success === false) {
                    toast.error(response.data.msg);
                }
            })
            .catch(err => {
                toast.error(err.response.data?.msg);
            })
    }
    handleSubmit = async (event) => {
        event.preventDefault();
    }



    async updateSetting() {
        console.log(this.state.admin_address)
        this.setState({
            spinLoader: '1',
            isDialogOpen: true
        })
        if (window.ethereum) {
            this.setState({
                spinLoader: '1',
                isDialogOpen: true
            })
            var web3 = '';
            web3 = new Web3(window.ethereum);
            const accounts = await web3.eth.getAccounts();
            let currentNetwork = await web3.currentProvider.chainId;
            web3.eth.defaultAccount = accounts[0];
            if (currentNetwork !== config.chainId) {
                toast.error('Please select MATIC Test network!!');
                this.setState({
                    spinLoader: '0',
                    isDialogOpen: false
                })
                return false;
            }
            var chainId = config.chainId;
            try {
                let contractAddress = `${config.marketplaceContract}`
                let from_address = accounts[0];
                const contract = await new web3.eth.Contract(config.abiMarketplace, contractAddress);
                await contract.methods.setsettlementFeeAddress(this.state.admin_address).call();

                let tx_builder = await contract.methods.setsettlementFeeAddress(this.state.admin_address);

                let encoded_tx = tx_builder.encodeABI();
                let gasPrice = await web3.eth.getGasPrice();
                gasPrice = parseInt(gasPrice) + parseInt(10000000000);

                let gasLimit = await web3.eth.estimateGas({
                    gasPrice: web3.utils.toHex(gasPrice),
                    to: contractAddress,
                    from: from_address,
                    chainId: chainId,
                    data: encoded_tx
                });

                const txData = await web3.eth.sendTransaction({
                    gasPrice: web3.utils.toHex(gasPrice),
                    gas: web3.utils.toHex(gasLimit),
                    to: contractAddress,
                    from: from_address,
                    chainId: chainId,
                    data: encoded_tx
                });
                this.componentDidMount()
                this.setState({
                    isDialogOpen: false
                })


            } catch (err) {

                if (err.message.toString().split('insufficient funds')[1]) {
                    toast.error('Transaction reverted : ' + err.message)
                } else {
                    if (err.toString().split('execution reverted:')[1]) {
                        toast.error('Transaction reverted : ' + (err.toString().split('execution reverted:')[1]).toString().split('{')[0])

                    } else {
                        toast.error(err.message);
                    }
                }

                this.setState({
                    spinLoader: 0,
                    isDialogOpen: false
                })
                return false;
            }
        } else {
            toast.error('Please Connect to MetaMask.');
            this.setState({
                spinLoader: 0,
                isDialogOpen: false
            })
            return false;
        }

    }
    render() {
        return (
            <>
                <ToastContainer />
                <Dialog
                        title="Warning"
                        icon="warning-sign"
                        style={{
                            color: 'red'
                        }}
                        isOpen={this.state.isDialogOpen}
                        isCloseButtonShown={false}
                    >
                        <div className="text-center">
                            <BarLoader color="#e84747" height="2" />
                            <br />
                            <h4 style={{ color: '#000' }}>Transaction under process...</h4>
                            <p style={{ color: 'red' }}>
                                Please do not refresh page or close tab.
                            </p>
                            <div>
                            </div>
                        </div>
                    </Dialog>
                <div className="wrapper theme-6-active pimary-color-green">
                    <Header />
                    <Leftsidebar />
                    <div className="page-wrapper nft-user">
                        <div className="container-fluid">
                            <div className="row heading-bg">
                                <h5 className="txt-dark">Fees Management</h5>
                                <div className="col-lg-3 col-md-4 col-sm-4 col-xs-12">
                                </div>
                            </div>

                            <div className="row">
                                <div className="col-xl-12 col-lg-12 col-md-12 col-12">
                                    <div className="form-group">
                                        <label for="email">Admin Wallet public key</label>
                                        <input type="text" className="form-control" placeholder="Admin Wallet public key" value={this.state.admin_address} onChange={this.onChange} name='admin_address'  />
                                    </div>
                                </div>
                                <div className="col-xl-1 col-lg-1 col-md-3 col-12">
                                    <div className="">
                                        <button type="submit" onClick={this.updateSetting}  className="btn btn-primary update_btn">Update</button>&nbsp;
                                    </div>
                                </div>
                            </div>


                            <div className="row">
                                <div className="col-xl-4 col-lg-4 col-md-3 col-12">
                                    <div className="form-group">
                                        <label for="email">Bid increase(%)</label>
                                        <input type="number" className="form-control" placeholder="Bid increase(%)" value={this.state.bid_increase_percentage} onChange={this.onChange} name='bid_increase_percentage'  />
                                    </div>
                                </div>

                                <div className="col-xl-4 col-lg-4 col-md-3 col-12">
                                    <div className="form-group">
                                        <label for="email">Admin Commission</label>
                                        <input type="number" className="form-control" placeholder="Admin Commission" value={this.state.admin_commission} onChange={this.onChange} name='admin_commission'  />
                                    </div>
                                </div>

                                <div className="col-xl-1 col-lg-1 col-md-3 col-12">
                                    <div className="">
                                        <button type="submit" style={{ marginTop: "21px" }} onClick={this.updateFeesAPI.bind(this, '1')} className="btn btn-primary update_btn">Update</button>&nbsp;
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

import React, { Component } from 'react';
import Header from '../directives/header'
import Leftsidebar from '../directives/leftsidebar'
import Footer from '../directives/footer'
import 'react-toastify/dist/ReactToastify.css';
import toast, { Toaster } from 'react-hot-toast';
import axios from 'axios'
import config from '../config/config'
import Cookies from 'js-cookie';
import ReactDatatable from '@ashvin27/react-datatable'
import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css
import $ from 'jquery';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import moment from 'moment'
import Web3 from 'web3';
import { Dialog } from "@blueprintjs/core";
import { Link } from 'react-router-dom';
import reactImageSize from 'react-image-size';
import ReactAudioPlayer from 'react-audio-player';
import ReactTooltip from 'react-tooltip';
import {OBJModel} from 'react-3d-viewer'

export default class adminnft extends Component {
    constructor(props) {
        super(props)
        this.loginData = (!Cookies.get('loginSuccessParadigmeAdmin')) ? [] : JSON.parse(Cookies.get('loginSuccessParadigmeAdmin'))
        this.state = {
            item_id: '',
            item_name: '',
            description: '',
            image: '',
            owner_id: '',
            file_name: 'Select File',
            owner_profile_pic: '',
            file_type: '',
            item_category_id: '',
            item_subcategory_id: '',
            price: '',
            collection_id: '',
            user_id: '',
            is_sold: '',
            expiry_date: '',
            start_date: '',
            sell_type: '0',
            nft_type_select:'0',
            sell_type_text: '',
            bid_list: [],
            royaltie: 0,
            quantity: '',
            loader: '',
            spinLoader: 0,
            category_list: [],
            item_list1: [],
            admin_collection_list: [],
            gamesCategoryRes: [],
            ImageFileHash: '',
            isDialogOpen: false,
            isProcess: 0,
            is_banner: 0,
            isPutonSale: 0,
            isCancelOrder: 0,
            royaltie: 0,
            processBtn: 0,
            blockchainUpdationType: 1,
            popupData: false,
            addnftModel: 0,
            isMintDialogOpen: false,
            isDialogOpen: false,
            bidDetails: 0,
            imageSizeError: '',
            royaltiesAddress: [{ 'royaltiesAddress': '' }]
        }
        console.log(this.loginData?.data?.user_email, this.loginData?.data);
        this.editDataAPI = this.editDataAPI.bind(this);
        this.onChange = this.itemDetail.bind(this)
        this.columns = [
            {
                key: '#',
                text: '#',
                cell: (row, index) => index + 1
            },

            {
                key: "name",
                text: "Name",
                cell: (item) => {
                    return (
                        <>
                            <a href={`${config.redirectUrl + 'nftDetails/' + item.id}`} target="_blank" >
                                {item.name}
                            </a>

                        </>
                    );
                }
            },
            {
                key: "image",
                text: "Image",
                cell: (item) => {
                    return (
                        <>
                            {item.file_type == 'image' ?
                                <div className="">
                                    <img src={`${config.imageUrl}` + item.image} width="70px" className="product-img" />
                                </div>
                                :


                                item.file_type == 'video' ?
                                    <video muted autoPlay width="70px" height="70px" controls>
                                        <source src={`${config.imageUrl}${item.image}`} type="video/mp4" className="product-img" />
                                    </video>

                                    :
                                    item.file_type == 'audio' ?
                                        <ReactAudioPlayer

                                            src={`${config.imageUrl}${item.image}`}

                                            controls
                                            className='audio-play' /> :  item?.file_type == 'OBJ' ?
                                            <OBJModel width="70" height="70" src={`${config.imageUrl}${item?.image}`} texPath=""/>
              
                                               :
                                            ""


                            }
                        </>
                    );
                }
            },

            {
                key: "item_category",
                text: "Category Name",
                sortable: true
            },

            {
                key: "price",
                text: "Price",
                cell: (item) => {
                    return (
                        <>
                            <span>{item.price + `${item.blockchainType == 1 ? ' MATIC' : ' MATIC'} `} </span>
                        </>
                    )
                }
            },
            // {
            //     key: "is_banner",
            //     text: "Banner NFT Status",
            //     sortable: true,
            //     cell: (item) => {
            //         return (
            //             <>
            //                 {item.is_banner == 1 ? 'Yes' : '-'}
            //             </>
            //         )
            //     }
            // },

            // {
            //     key: "is_banner",
            //     text: "Banner NFT Status",
            //     sortable: true,
            //     cell: (item) => {
            //         return (
            //             <>
            //                 <input type='checkbox' checked={item.is_banner === 0 ? '' : 'checked'} onClick={this.updateUserNftBanner.bind(this, item.id, item.is_banner)} />
            //             </>
            //         )
            //     }
            // },

            {
                key: "Action",
                text: "Action",
                cell: (item) => {
                    return (
                        <>
                            <div className='d-flex' style={{ display: "flex" }}>
                                {item.is_active == 1 ?
                                    <button type="submit" onClick={this.hideNFTAPI.bind(this, item)} data-toggle="tooltip" data-original-title="Close" className=" btn-primary"> <i class="fa fa-minus-square m-r-10"></i> </button> :
                                    <button type="submit" onClick={this.showNFTAPI.bind(this, item)} data-toggle="tooltip" data-original-title="Close" className=" btn-primary"> <i class="fa fa-plus-square m-r-10"></i> </button>
                                }&nbsp;
                                {this.loginData?.data?.id == item.owner_id ?
                                    item.is_on_sale == 1 ?
                                        <div>
                                            <button type='button' className='btn-primary'> <a onClick={this.cancelOrder.bind(this, item)} className='putonsale' style={{ color: "#fff" }} > Cancel listing</a></button>&nbsp;
                                        </div>
                                        :
                                        <>
                                            <button className='btn-primary'> <Link to={`${config.baseUrl}editNft/` + item.id} className="btn-primary"><i class="fa fa-pencil text-inverse m-r-10"></i></Link>&nbsp;</button>&nbsp;

                                            <button className='btn-primary'><a onClick={this.putOnSaleModelAPI.bind(this, item, 1)} className='putonsale' data-toggle="modal" data-target="#putOnSale" style={{ color: '#fff' }}> Put on sale </a></button>&nbsp;
                                        </>
                                    : ""}
                                {item.sell_type == 2 ?
                                    <>&nbsp;
                                        <button
                                            type='button' onClick={this.getBidDetailAPI.bind(this, item)} data-toggle="modal" data-target="#exampleModalCenter" className="btn-primary">
                                            View Bid</button> </> : ''
                                }


                            </div>
                        </>
                    );
                }
            },

        ];

        this.config = {
            page_size: 10,
            length_menu: [10, 20, 50,],
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
        this.getItemAPI();
        this.getAdminNFTAPI();
        this.getAdminCollection()

        var startDate = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');
        var array = startDate.split(' ');
        if (array[0]) {
            this.setState({
                currentDate: array[0],
                endDate: array[0]
            })
        }

    }

    async updateUserNftBanner(id, banner) {
        axios({
            method: 'post',
            url: `${config.apiUrl}updateUserNftBanner`,
            headers: { "Authorization": this.loginData?.Token },
            data: { id: id, is_banner: banner === 0 ? '1' : '0' }
        }).then(result => {
            if (result.data.success === true) {
                if (banner == 0) {
                    toast.success('Added in banner!!');
                }
                else if (banner == 1) {
                    toast.error('Removed From banner!!');
                }
                this.getAdminNFTAPI();

            }
        }).catch(err => {

        })
    }

    async getBidDetailAPI(id) {
        this.setState({
            bidDetails: 1
        })
        axios({
            method: 'post',
            url: `${config.apiUrl}getBidDetailForAdmin`,
            headers: { authorization: this.loginData?.data.token },
            data: { 'email': this.loginData?.data.user_email, item_id: id.id }
        }).then(response => {
            if (response.data.success === true) {
                this.setState({
                    bid_list: response.data.response
                })
            }
            else if (response.data.success === false) {

            }
        }).catch(err => {
            this.setState({
                bid_list: []
            })
        })
    }

    async cancelOrder(item) {
        this.setState({
            isCancelOrder: 1
        })
        confirmAlert({
            title: 'Confirm to submit',
            message: 'Are you sure want to cancel this order?.',
            buttons: [
                {
                    label: 'Yes',
                    onClick: () =>
                        this.approveNFT(item)
                },
                {
                    label: 'No',
                }
            ]
        });
    }

    async getAdminCollection() {
        await axios.get(`${config.apiUrl}getAdminCollection`, {},)
            .then(result => {
                if (result.data.success === true) {
                    this.setState({
                        admin_collection_list: result.data.response
                    })
                }
                else if (result.data.success === false) {
                }
            })
            .catch(err => {

            })
    }

    closeModal(e) {
        this.setState({
            item_id: '',
            name: '',
            description: '',
            image: '',
            owner_id: '',
            file_name: '',
            owner_profile_pic: '',
            file_type: '',
            item_category_id: '',
            price: '',
            user_id: '',
            is_sold: '',
            expiry_date: '',
            start_date: '',
            sell_type: '',
            sell_type_text: '',
            quantity: '',
            loader: '',
        })
    }

    async getAdminNFTAPI() {
        axios.get(`${config.apiUrl}getAdminNFT`, {},)
            .then(response => {
                if (response.data.success === true) {
                    this.setState({
                        item_list1: response.data.response
                    })
                }
                else if (response.data.success === false) {

                }
            })
            .catch(err => {

            })
    }

    async getItemAPI() {
        axios.get(`${config.apiUrl}getAdminNFT`, {},)
            .then(response => {
                if (response.data.success === true) {
                    this.setState({
                        item_list: response.data.response
                    })
                }
                else if (response.data.success === false) {
                }
            })
            .catch(err => {

            })
    }

    async categoryList() {
        await
            axios({
                method: 'get',
                url: `${config.apiUrl}getCategory`,
                data: {}
            }).then(result => {
                if (result.data.success === true) {
                    this.setState({
                        category_list: result.data.response
                    })
                }
                else if (result.data.success === false) {

                }
            }).catch(err => {

            })
    }

    handleChange = event => {
        event.persist();
        let value = event.target.value;
        this.setState(prevState => ({
            item_list: { ...prevState.item_list, [event.target.name]: value }
        }))
    };

    handleChange1 = e => {
        this.setState({
            [e.target.name]: e.target.value
        })
        if (e.target.checked === true && e.target.name === 'end_start_date') {
            this.setState({
                dateShow: 1
            })
        }
        else if (e.target.checked === false && e.target.name === 'end_start_date') {
            this.setState({
                dateShow: 0
            })
        }
    }

    toBase64 = file => new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });

    handleEditImagePreview = async (e) => {
        let image_as_base64 = URL.createObjectURL(e.target.files[0])
        let image_as_files = e.target.files[0];
        console.log(image_as_files)
        let file_name = e.target.files[0].name
        let file_type = '';
        if (image_as_files.type.indexOf('image') === 0) {
            file_type = 'image';
        } else {
            file_type = 'video';
        }

        let dd = await this.toBase64(e.target.files[0]);
        const { width, height } = await reactImageSize(dd);
        if (height >= 600 && width >= 600) {
            this.setState(prevState => ({
                getItemData: { ...prevState.getItemData, image_as_base64, 'file_type': file_type, image_file: image_as_files },
                file_name: file_name,
                imageSizeError: ''
            }))
        } else {
            this.setState({
                imageSizeError: 'Height and width must be greater than or equal to 600px and 600px!!'
            })
        }
    }

    handleImagePreview = async (e) => {
        let image_as_base64 = URL.createObjectURL(e.target.files[0])
        let image_as_files = e.target.files[0];
        let file_type = '';
        if (image_as_files.type.indexOf('image') === 0) {
            file_type = 'image';
        }else if (image_as_files.type.indexOf('video') === 0) {
            file_type = 'video';
          }
          else if (image_as_files.type.indexOf('audio') === 0) {
            file_type = 'audio';
          }
          else if (image_as_files.type.indexOf('application') === 0) {
            file_type = 'OBJ';
          }

        let dd = await this.toBase64(e.target.files[0]);
        const { width, height } = await reactImageSize(dd);
        if (height >= 600 && width >= 600) {
            this.setState({
                image_preview: image_as_base64,
                image_file: image_as_files,
                file_type: file_type,
                imageSizeError: ''
            })
        } else {
            this.setState({
                imageSizeError: 'Height and width must be greater than 600px and 600px!!'
            })
        }
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
            url: `${config.apiUrl}createMetadata`,
            data: {
                "name": this.state.item_name,
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
    async createUserNft() {
        if (this.state.item_name == '') {
            toast.error('Item name required');
        }
        else if (this.state.description == '') {
            toast.error('Item description required');
        }
        else if (!this.state.image_file) {
            toast.error('Item image required');
        }
        else if (!this.state.item_category_id) {
            toast.error('Please select category');
        }
        else if (!this.state.user_collection_id) {
            toast.error('Please select collection');
        }
        else if (this.state.sell_type == 0 || this.state.sell_type == '') {
            toast.error('Sell type required');
        }
        else if (this.state.sell_type == 2 && !this.state.start_date) {
            toast.error('Please select start date');
        }
        else if (this.state.sell_type == 2 && !this.state.expiry_date) {
            toast.error('Please select end date');
        }
        else if (this.state.price == '') {
            toast.error('Item price required');
        }
        else {

            this.setState({
                spinLoader: '1',
                isMintDialogOpen: true,
                addnftModel: 0
            })

            let ImageFileHash = this.state.ImageFileHash;
            if (!ImageFileHash) {
                ImageFileHash = await this.imageUpload();
            }
            let token_id = this.state.token_id;
            if (!token_id) {
                token_id = await this.metaDataUpload();
            }

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
            formData.append('price', this.state.price);
            formData.append('image', this.state.ImageFileHash);
            formData.append('metadata', this.state.MetadataFileHash);
            formData.append('name', this.state.item_name);
            formData.append('file_type', this.state.file_type);
            formData.append('royalty_percent', this.state.royaltie);
            formData.append('image_type', this.state.image_type);
            formData.append('description', this.state.description);
            formData.append('start_date', this.state.start_date);
            formData.append('expiry_date', this.state.expiry_date);
            formData.append('item_category_id', this.state.item_category_id);
            formData.append('user_collection_id', this.state.user_collection_id);
            formData.append('sell_type', this.state.sell_type);
            formData.append('nft_type_select', this.state.nft_type_select);
            formData.append('user_id', this.loginData?.data?.id);
            formData.append('email', this.loginData?.data?.user_email);
            formData.append('blockchainType', 1);
            formData.append('tokenId', this.state.token_id);

            axios.post(`${config.apiUrl}addNftByUser`, formData)
                .then(result => {
                    if (result.data.success === true) {
                        this.setState({
                            spinLoader: '0',
                            popupData: true,
                            isMintDialogOpen: false,
                            addnftModel: 0
                        })
                    } else {
                        toast.error(result.data.msg);
                        this.setState({
                            spinLoader: '0',
                            isMintDialogOpen: false,
                        })
                    }
                }).catch(err => {
                    toast.error(err.response.data?.msg,

                    );
                    this.setState({
                        spinLoader: '0',
                        isMintDialogOpen: false,
                    })
                })
        }
    }

    async approveNFT(itemDetails) {
        console.log('itemDetails', itemDetails);
        this.setState({
            spinLoader: '1',
            isPutonSale: 0,
            isDialogOpen: true
        })

        if (window.ethereum) {

            var web3 = '';
            web3 = new Web3(window.ethereum);
            const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
            // const accounts = await web3.eth.getAccounts();
            let currentNetwork = await web3.currentProvider.chainId;
            web3.eth.defaultAccount = accounts[0];

            if (currentNetwork !== config.chainId) {
                toast.error('Please select testnet MATIC smartchain!!');
                this.setState({
                    spinLoader: '0',
                    isPutonSale: 1,
                    isDialogOpen: false
                })
                setTimeout(() => {
                    window.location.reload();
                }, 2000);
                return false;
            }
            var chainId = config.chainId;


            try {
                let mintFee = 0;
                let SalePrice;
                let start_date = 0;
                let expiry_date = 0;
                let tokenId = itemDetails.token_id;
                if (itemDetails.sell_type == 1) {
                    SalePrice = parseInt(parseFloat(itemDetails.price) * (10 ** 18)).toString()
                    this.setState({
                        start_date: 0,
                        expiry_date: 0
                    })
                }

                else if (itemDetails.sell_type == 2) {
                    SalePrice = parseInt(parseFloat(itemDetails.price) * (10 ** 18)).toString();
                    start_date = Math.round(new Date(itemDetails.start_date).getTime() / 1000);
                    expiry_date = Math.round(new Date(itemDetails.expiry_date).getTime() / 1000);
                }

                let contractAddress = `${config.marketplaceContract}`
                let from_address = accounts[0];
                const contract = await new web3.eth.Contract(config.abiMarketplace, contractAddress);
                console.log(tokenId)
                if (this.state.isCancelOrder == 1) {
                    this.setState({
                        blockchainUpdationType: 2
                    });
                    await contract.methods.cancelOrder(tokenId.toString()).call();
                    var tx_builder = await contract.methods.cancelOrder(tokenId.toString());
                } else {
                    if (itemDetails.is_minted == 1) {
                        this.setState({
                            blockchainUpdationType: 2
                        });
                        await contract.methods.updateDetails(tokenId.toString(), SalePrice.toString(), itemDetails.sell_type.toString(), start_date.toString(), expiry_date.toString()).call();

                        var tx_builder = await contract.methods.updateDetails(tokenId.toString(), SalePrice.toString(), itemDetails.sell_type.toString(), start_date.toString(), expiry_date.toString());
                    } else {
                        this.setState({
                            blockchainUpdationType: 1
                        });

                        let royaltiesAddress = JSON.parse(itemDetails.royaltiesAddress);
                        let royaltiesAddressArray = [];
                        if (royaltiesAddress.length > 0) {
                          for (let i = 0; i < royaltiesAddress.length; i++) {
                            royaltiesAddressArray[i] = royaltiesAddress[i].royaltiesAddress;
                          }
                        }                        
                        
                        console.log(tokenId.toString(), SalePrice.toString(), (itemDetails.royalty_percent * 100).toString(), itemDetails.sell_type.toString(), start_date.toString(), expiry_date.toString(), royaltiesAddressArray);

                        await contract.methods._mint(tokenId.toString(), SalePrice.toString(), (itemDetails.royalty_percent * 100).toString(), itemDetails.sell_type.toString(), start_date.toString(), expiry_date.toString(), royaltiesAddressArray).call();

                        var tx_builder = await contract.methods._mint(tokenId.toString(), SalePrice.toString(), (itemDetails.royalty_percent * 100).toString(), itemDetails.sell_type.toString(), start_date.toString(), expiry_date.toString(), royaltiesAddressArray);
                    }
                }

                let encoded_tx = tx_builder.encodeABI();
                let gasPrice = await web3.eth.getGasPrice();
                gasPrice = parseInt(gasPrice) + parseInt(10000000000);

                let gasLimit = await web3.eth.estimateGas({
                    gasPrice: web3.utils.toHex(gasPrice),
                    to: contractAddress,
                    from: from_address,
                    value: web3.utils.toHex(mintFee),
                    chainId: chainId,
                    data: encoded_tx
                });

                const txData = await web3.eth.sendTransaction({
                    gasPrice: web3.utils.toHex(gasPrice),
                    gas: web3.utils.toHex(gasLimit),
                    to: contractAddress,
                    from: from_address,
                    value: web3.utils.toHex(mintFee),
                    chainId: chainId,
                    data: encoded_tx
                });

                if (txData.transactionHash) {

                    const token = this.token
                    await axios({
                        method: 'post',
                        url: this.state.isCancelOrder ? `${config.apiUrl}cancelOrder` : `${config.apiUrl}putOnSale`,
                        headers: { authorization: token },
                        data: {
                            "user_id": this.loginData.data.id,
                            "address": from_address,
                            "item_id": this.state.isCancelOrder ? itemDetails.id : this.state.nftData.item_id,
                            "token_hash": txData.transactionHash,
                            "is_minted": itemDetails.is_minted
                        }
                    }).then((res) => {
                        if (res.data.success === true) {
                            toast.success(res.data.msg);
                            this.setState({
                                isDialogOpen: false,
                                isPutonSale: 0,
                            })
                            setTimeout(() => {
                                window.location.reload();
                            }, 2000);
                        } else {
                            toast.error(res.data.msg);
                            this.setState({
                                spinLoader: '0'
                            })
                        }
                    }).catch((error) => {
                        this.setState({
                            spinLoader: '0'
                        })
                        toast.error(error.response?.data?.msg, {});
                    })
                } else {
                    toast.error('Something went wrong please try again.');
                    this.setState({
                        spinLoader: '0',
                        isPutonSale: this.state.this.state.isCancelOrder == 1 ? 0 : 1,
                        isDialogOpen: false
                    })
                    setTimeout(() => {
                        window.location.reload();
                    }, 2000);
                    return false;
                }

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
                    spinLoader: '0',
                    isPutonSale: this.state.isCancelOrder == 1 ? 0 : 1,
                    isDialogOpen: false
                })
                setTimeout(() => {
                    window.location.reload();
                }, 2000);
                return false;
            }
        } else {
            toast.error('Please Connect to MetaMask.');
            this.setState({
                spinLoader: '0',
                isPutonSale: this.state.isCancelOrder == 1 ? 0 : 1,
                isDialogOpen: false
            })
            setTimeout(() => {
                window.location.reload();
            }, 2000);
            return false;
        }
    }

    handleChangeStart = (date, name) => {
        console.log(name, date)
        this.setState(prevState => ({
            getItemData: { ...prevState.getItemData, [name]: moment(date).format('YYYY-MM-DD') }
        }))
    }

    addhandleChangeStart = (date, name) => {
        this.setState({
            [name]: moment(date).format('YYYY-MM-DD')
        })
    }

    itemDetail = event => {
        event.preventDefault()
        let value = event.target.value;
        this.setState(prevState => ({
            getItemData: { ...prevState.getItemData, [event.target.name]: value }
        }))

        if (event.target.name == 'item_category_id') {
            this.setState({
                'categoryError': ""
            })
            this.getGamesCategoryAPI(event.target.value)
        }
        else if (event.target.checked === true && event.target.name === 'end_start_date') {
            this.setState({
                dateShow: 1
            })
        }
        else if (event.target.checked === false && event.target.name === 'end_start_date') {
            this.setState({
                dateShow: 0
            })
        }
    }

    async editDataAPI(nftData) {
        console.log('nftData', nftData);
        this.setState({
            item_category_id: nftData.item_category_id,
            price: nftData.price,
            item_id: nftData.id,
            user_collection_id: nftData.user_collection_id,
            name: nftData.name,
            is_banner: nftData.is_banner,
            is_trending: nftData.is_trending,
            is_on_sale: nftData.is_on_sale
        })
    }

    hideNFTAPI(id) {
        confirmAlert({
            title: 'Confirm to submit',
            message: 'Are you sure to hide this NFT..',
            buttons: [
                {
                    label: 'Yes',
                    onClick: () =>
                        axios({
                            method: 'post',
                            url: `${config.apiUrl}hideNFT`,
                            headers: { "Authorization": this.loginData?.data.token },
                            data: { 'email': this.loginData?.data.user_email, item_id: id.id, is_admin: 1 }
                        })

                            .then(result => {

                                toast.success(result.data.msg);
                                this.componentDidMount();
                            }).catch((error) => {
                                toast.danger(error.data?.msg);
                            })
                },
                {
                    label: 'No',
                }
            ]
        });
    }

    showNFTAPI(id) {
        confirmAlert({
            title: 'Confirm to submit',
            message: 'Are you sure to show this NFT..',
            buttons: [
                {
                    label: 'Yes',
                    onClick: () =>
                        axios({
                            method: 'post',
                            url: `${config.apiUrl}showNFT`,
                            headers: { "Authorization": this.loginData?.data?.token },
                            data: { 'email': this.loginData?.data.user_email, item_id: id.id, is_admin: 1 }
                        }).then(result => {
                            toast.success(result.data.msg);
                            this.componentDidMount();
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

    async putOnSaleModelAPI(item, type) {
        console.log(item);
        this.setState({
            isPutonSale: 1,
            updateType: type
        })

        $("#nft" + item.item_id).css({ "display": "none" });
        await axios({
            method: 'post',
            url: `${config.apiUrl}itemDetail`,
            data: { 'item_id': item.id, 'user_id': this.loginData.id }
        }).then(response => {
            if (response.data.success === true) {
                this.setState({
                    nftData: response.data.response
                })
            }
        })
    }

    async BidAcceptAPI(itemData) {
        let tokenId = itemData.token_id;
        if (window.ethereum) {

            const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
            let web3 = new Web3(window.ethereum);

            var chainId = config.chainId;

            try {
                this.setState({
                    processBtn: 1,
                    bidDetails: 0,
                    blockchainUpdationType: 3,
                    isDialogOpen: true
                })
                let contractAddress = `${config.marketplaceContract}`
                let from_address = accounts[0];

                const contract = await new web3.eth.Contract(config.abiMarketplace, contractAddress);
                let tx_builder = await contract.methods.acceptBid(tokenId.toString());

                let encoded_tx = tx_builder.encodeABI();
                let gasPrice = await web3.eth.getGasPrice();

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


                if (txData.transactionHash) {
                    const token = this.token
                    axios({
                        method: 'post',
                        url: `${config.apiUrl}bidAccept`,
                        headers: { authorization: token },
                        data: { "user_id": itemData.user_id, "address": from_address, 'item_id': itemData.item_id, "bid_id": itemData.bid_id, "hash": txData.transactionHash }
                    })
                        .then(async response => {
                            if (response.data.success === true) {
                                setTimeout(() => {
                                    window.location.reload();
                                }, 1000);
                                toast.success(response.data?.msg, {});
                                this.setState({
                                    processBtn: 0,
                                    isDialogOpen: false
                                })
                            }
                            else if (response.data.success === false) {
                                this.setState({
                                    processBtn: 0,
                                    isDialogOpen: false
                                })
                                toast.error(response.data?.msg, {});
                            }

                            setTimeout(() => {
                                window.location.reload();
                            }, 2000);

                        })
                        .catch(err => {
                            this.setState({
                                processBtn: 0,
                                isDialogOpen: false
                            })
                            toast.error(err.response.data?.msg, {});
                            setTimeout(() => {
                                window.location.reload();
                            }, 2000);
                        })
                    // window.location.reload();
                } else {
                    toast.error('Something went wrong please try again3.');
                    this.setState({
                        processBtn: 0,
                        isDialogOpen: false
                    })
                    return false;
                }

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
                    processBtn: 0,
                    isDialogOpen: false
                })

                setTimeout(() => {
                    window.location.reload();
                }, 2000);

                return false;
            }

        } else {
            toast.error('Please Connect to MetaMask.');
            this.setState({
                processBtn: 0,
                isDialogOpen: false
            })
            return false;
        }
    }

    modalShow(id) {
        if (id === 1) {
            this.setState({
                isSocial: 1,
                isPutonSale: 1,
                isTransferNft: 1
            })
        }
        else if (id === 0) {
            this.setState({
                isSocial: 0,
                isPutonSale: 0,
                isTransferNft: 0
            })
        }
    }

    movePage() {
        window.location.href = `${config.baseUrl}adminnft`
    }

    async closeModel() {
        this.setState({
            addnftModel: 0
        })
    }

    async openModel() {
        this.setState({
            addnftModel: 1
        })
    }

    redirectUrl() {
        window.location.reload()
    }

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

                <Dialog
                    title="Please Wait..."
                    style={{
                        color: '#000',
                        textAlign: "center"
                    }}
                    isOpen={this.state.isMintDialogOpen}
                    isCloseButtonShown={false}
                >
                    <div className="text-center pl-3 pr-3">
                        < br />
                        <p className="pl-2 pr-2" style={{ color: '#000', fontSize: '16px' }}>NFT minting in progress, once process completed NFT will be display on your NFTs List page.</p>
                        <p style={{ color: '#091f3f' }}>
                            Please do not refresh page or close tab.
                        </p>
                        <div>
                            <img src='images/loading.gif' style={{ width: '50px' }} />
                        </div>
                    </div>
                </Dialog>

                <Dialog
                    title={`You Created-${this.state.item_name}`}
                    style={{
                        color: '#6d1cbb',
                        textAlign: "center"
                    }}
                    isOpen={this.state.popupData}
                    isCloseButtonShown={false}
                >
                    <div className="text-center pl-3 pr-3">
                        < br />
                        <p className="pl-2 pr-2" style={{ color: '#000', fontSize: '16px' }}>To get set up for selling on marketplace, please put the item on sale from NFTs List.</p>
                        <div className='mb-3'>
                            {this.state.file_type == 'image' ?
                                <img src={`${this.state.image_preview}`} width="150px" />
                                :
                                <video width="320" height="240" controls>
                                    <source src={this.state.image_preview} type="video/mp4" />
                                </video>
                            }
                        </div>

                        <button type='button' className='btn btn-primary' onClick={this.movePage.bind(this)}>Ok</button>
                    </div>
                </Dialog>

                <Dialog
                    title="Please Wait..."
                    style={{
                        color: '#590ba2',
                        textAlign: "center"
                    }}
                    isOpen={this.state.isDialogOpen}
                    isCloseButtonShown={false}
                >
                    <div className="text-center pl-3 pr-3">
                        < br />
                        {this.state.blockchainUpdationType == 1 ?
                            <p className="pl-2 pr-2" style={{ color: '#000', fontSize: '16px' }}>
                                Put on sale in progress, once process completed NFT will be display on NFT list page.
                            </p>
                            :
                            this.state.blockchainUpdationType == 2 ?
                                <p className="pl-2 pr-2" style={{ color: '#000', fontSize: '16px' }}>
                                    Canceling your listing will unpublish this sale from Paradigme and requires a transaction.
                                </p>
                                :
                                <p className="pl-2 pr-2" style={{ color: '#000', fontSize: '16px' }}>
                                    Bid accepting in progress, Please wait for a while.
                                </p>
                        }

                        <p style={{ color: '#091f3f' }}>
                            Please do not refresh page or close tab.
                        </p>

                        <div>
                            <img src='images/loading.gif' style={{ width: '50px' }} />
                        </div>
                        <div>
                            <div class="spinner-border"></div>
                        </div>
                    </div>
                </Dialog>

                <Toaster />
                <div className="wrapper theme-6-active pimary-color-green">
                    <Header />
                    <Leftsidebar />
                    <div className="right-sidebar-backdrop"></div>
                    <div className="page-wrapper nft-user">
                        <div className="container-fluid">
                            <div className="row heading-bg">
                                <div className="col-lg-3 col-md-4 col-sm-4 col-xs-12">
                                    <h5 className="txt-dark">Admin NFT's</h5>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-sm-12">
                                    <div className="panel panel-default card-view">
                                        <div className="panel-wrapper collapse in">
                                            <div className="panel-body">

                                                <button type='button' onClick={this.openModel.bind(this)} className="btn btn-primary pb-4">Add NFT </button>
                                                <br />
                                                <br />

                                                <div className="form-wrap">
                                                    <div class="table-responsive">

                                                        <ReactDatatable
                                                            config={this.config}
                                                            records={this.state.item_list1}
                                                            columns={this.columns}
                                                        />
                                                    </div>

                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className={this.state.addnftModel == 1 ? 'modal fade in show' : 'modal fade'} style={{ display: this.state.addnftModel == 1 ? 'block' : 'none' }} id="addnftmodal" class="modal fade" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true" data-backdrop="false">
                                <div class="modal-dialog">
                                    <div class="modal-content">

                                        <div class="modal-body">
                                            <div className="form-wrap">
                                                <form action="#">
                                                    <h6 className="txt-dark capitalize-font"><i className="zmdi zmdi-info-outline mr-10"></i>Add NFT</h6>
                                                    <hr className="light-grey-hr" />
                                                    <div className="row">
                                                        <div className="col-md-6">
                                                            <div className="form-group">
                                                                <label className="control-label mb-10">Item Name</label>
                                                                <input type="text" onChange={this.handleChange1} name="item_name" className="form-control" placeholder="Item Name" value={this.state.item_name} />
                                                            </div>
                                                        </div>
                                                        <div className="col-md-6">
                                                            <div className="form-group">
                                                                <label className="control-label mb-10">Description</label>
                                                                <input type="text" onChange={this.handleChange1} name="description" className="form-control" placeholder="Description" value={this.state.description} />
                                                            </div>
                                                        </div>
                                                        <div className="col-md-6">
                                                            <div className="form-group">
                                                                <label className="control-label mb-10">Image(jpg, jpeg, png, gif, mp3, mp4, OBJ)</label>
                                                                <input type="file" accept=".jpg,.jpeg,.png,.gif,.mp3,.mp4,.obj" onChange={this.handleImagePreview} className="form-control" placeholder="Image File" />
                                                                {this.state.imageSizeError ?
                                                                    <label style={{ color: 'red' }}>{this.state.imageSizeError}</label>
                                                                    : ""}
                                                            </div>
                                                        </div>
                                                        <div className="col-md-6">
                                                            <div className="form-group">
                                                                <label className="control-label mb-10">Select Category</label>
                                                                <div className="customSelectHolder">
                                                                    <select name="item_category_id" onChange={this.handleChange1} value={this.state.item_category_id} class="form-control basic">
                                                                        <option selected="selected" value="">Select Category</option>
                                                                        {this.state.category_list.map(item => (
                                                                            <option value={item.id}>{item.name}</option>
                                                                        ))}
                                                                    </select>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <div className="col-md-6">
                                                            <div className="form-group">
                                                                <label className="control-label mb-10">Add Collection</label>
                                                                <div className="customSelectHolder">
                                                                    <select onChange={this.handleChange1} name='user_collection_id' className="form-control" >
                                                                        <option value="">Select Collection</option>
                                                                        {this.state.admin_collection_list.map((item) => (
                                                                            <option value={item.id}>{item.name}</option>
                                                                        ))}
                                                                    </select>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <div className="col-md-6">
                                                            <div className="form-group">
                                                                <label className="control-label mb-10">Fixed price(MATIC)</label>
                                                                <input type="text" onKeyPress={(event) => { if (!/^\d*[.]?\d{0,1}$/.test(event.key)) { event.preventDefault(); } }} onChange={this.handleChange1} name="price" className="form-control" placeholder="Price" value={this.state.price} />
                                                            </div>
                                                        </div>

                                                        <div className="col-md-6">
                                                            <div className="form-group">
                                                                <label className="control-label mb-10">Sell Type</label>
                                                                <div className="customSelectHolder">
                                                                    <select class="form-control  basic" name="sell_type" onChange={this.handleChange1} value={this.state.sell_type} >
                                                                        <option selected="selected" value="">Select Options</option>
                                                                        <option value="1">Price</option>
                                                                        <option value="2">Auction</option>
                                                                    </select>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <div className="col-md-6">
                                                            <div className="form-group">
                                                                <label className="control-label mb-10">Nft Type</label>
                                                                <div className="customSelectHolder">
                                                                    <select class="form-control  basic" name="nft_type_select" onChange={this.handleChange1} value={this.state.nft_type_select} >
                                                                        <option selected="selected" value="">Select Options</option>
                                                                        <option value="0">Digital</option>
                                                                        <option value="1">Physical</option>
                                                                    </select>
                                                                </div>
                                                            </div>
                                                        </div>


                                                        {this.state.sell_type === '2' ?
                                                            <>
                                                                <div className="col-md-6">
                                                                    <div className="form-group">
                                                                        <label className="control-label mb-10">Start Date</label>
                                                                        <input type="date" onChange={this.handleChange1} min={this.state.minDate} className="form-control" name="start_date" value={this.state.start_date} />
                                                                    </div>
                                                                </div>
                                                                <div className="col-md-6">
                                                                    <div className="form-group">
                                                                        <label className="control-label mb-10">Expiry Date</label>
                                                                        <input type="date" min={this.state.currentDate} onChange={this.handleChange1} className="form-control" name="expiry_date" value={this.state.expiry_date} />
                                                                    </div>
                                                                </div>

                                                            </>
                                                            : ''
                                                        }

                                                        <div className="col-md-12">
                                                            <div className='form-group'>
                                                                <h5>Royalties</h5>
                                                                <input onKeyPress={(event) => { if (!/^\d*[.]?\d{0,1}$/.test(event.key)) { event.preventDefault(); } }} type="text" onChange={this.handleChange1} name="royaltie" className="form-control" placeholder="suggested: 0%, 5%, 10%, 20%. Maximum is 25%" />
                                                            </div>
                                                        </div>

                                                        <div className="col-md-12">
                                                            <div className='form-group'>
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
                                                                                    <button class="btn btn-primary" type="button" style={{ color: '#fff' }} id="addBtn" onClick={() => this.spliceRow(i)}>-</button>
                                                                                    : ""}
                                                                            </div>
                                                                        </>

                                                                    ))}
                                                                    <div className="col-md-2">
                                                                        <button class="btn btn-primary" type="button" style={{ color: '#fff' }} id="addBtn" onClick={() => this.addNewRow(1)}>+</button>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>

                                                    </div>

                                                    <div className="form-actions">
                                                        <div className="clearfix"></div>
                                                    </div>
                                                </form>
                                            </div>
                                        </div>
                                        <div class="modal-footer pt-0">
                                            <button type="button" class="btn btn-default" onClick={this.closeModel.bind(this)} data-dismiss="modal">Close</button>

                                            {this.state.spinLoader == 0 ?
                                                <button type='submit' disabled={this.state.imageSizeError} onClick={this.createUserNft.bind(this)} className="btn btn-primary">Add </button>
                                                :
                                                <button type='submit' disabled className="btn btn-primary">Loading... </button>
                                            }
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>


                        <div className={this.state.bidDetails == 1 ? 'modal fade in show' : 'modal fade'} style={{ display: this.state.bidDetails == 1 ? 'block' : 'none' }} id="exampleModalCenter" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
                            <div class="modal-dialog modal-dialog-centered" role="document">
                                <div class="modal-content">
                                    <div class="modal-header">
                                        <h5 class="modal-title" id="exampleModalLongTitle">Item Bid Details</h5>
                                        <button type="button" class="close" onClick={this.redirectUrl.bind(this)} style={{ marginTop: '-25px' }}>
                                            <span aria-hidden="true">&times;</span>
                                        </button>
                                    </div>
                                    <div class="table-responsive">
                                        <table class="table table-striped mb-0">
                                            <thead>
                                                <tr>
                                                    <th>UserName</th>
                                                    <th>Profile Pic</th>
                                                    <th>Item Name</th>
                                                    <th>Bid Price</th>
                                                    <th>Action</th>
                                                </tr>
                                            </thead>

                                            <tbody>
                                                {this.state.bid_list.length === 0 ?
                                                    <tr >
                                                        <td colspan="6" className="text-center"><p>No data found!!</p></td></tr> :
                                                    this.state.bid_list.map(item => (
                                                        <tr>

                                                            <td> {item.full_name == null || item.full_name === '' || item.full_name === undefined
                                                                ?
                                                                <p title={item.full_name}>{item.full_name == null ? '' : item.full_name}</p>
                                                                :
                                                                item.full_name}   </td>
                                                            <td >
                                                                {item.profile_pic === null || item.profile_pic === '' || item.profile_pic === undefined
                                                                    ?
                                                                    <img src='images/noimage.png' className="product-img" />
                                                                    :
                                                                    <img src={`${config.imageUrl1}${item.profile_pic}`} className="product-img" />}
                                                            </td>
                                                            <td>{item.item_name}</td>
                                                            <td>{item.bid_price} MATIC</td>
                                                            <td>
                                                                {this.state.processBtn == 0 ?
                                                                    <button type='submit' onClick={this.BidAcceptAPI.bind(this, item)} className="btn btn-primary">Accept</button>
                                                                    :
                                                                    <button disabled className="btn btn-primary">Processing &nbsp; <i className="fa fa-spinner fa-spin validat"></i></button>
                                                                }
                                                            </td>
                                                        </tr>
                                                    ))}
                                            </tbody>
                                        </table>
                                    </div>
                                    <div class="modal-footer">
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className={this.state.isPutonSale === 0 ? "modal fade" : "modal fade show"} id="putOnSale" style={{ display: this.state.isPutonSale === 0 ? 'none' : 'block' }} tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true" data-backdrop="false">
                            <div className="modal-dialog" role="document">

                                <div className="modal-content">
                                    <div className="modal-header">
                                        <h5 className="modal-title" id="exampleModalLabel"> Put On Sale </h5>
                                        <a type="button" className="close" data-dismiss="modal" style={{
                                            fontSize: '26px', marginTop: '-30px'
                                        }} aria-label="Close" onClick={this.modalShow.bind(this, 0)} >
                                            <span aria-hidden="true">&times;</span>
                                        </a>
                                    </div>

                                    <div className="modal-body">
                                        <div className="spacer-10" />
                                        <div className="de_tab tab_methods">
                                            <div className="de_tab_content">
                                                {console.log(this.state.nftData)}
                                                {this.state.nftData?.sell_type === 1 ?
                                                    <>
                                                        <p style={{ color: 'red' }}>List price and listing schedule can not be edited once the item is listed. You will need to cancel your listing and relist the item with the updated price and dates.</p>
                                                        <h5>NFT Type : Price</h5>
                                                        <h5>Price</h5>
                                                        <input type="text" disabled value={this.state.nftData?.price} name="price" id="item_price_bid" className="form-control" placeholder="Enter Price" />
                                                    </>
                                                    :
                                                    this.state.nftData?.sell_type === 2 ?
                                                        <>
                                                            <p style={{ color: 'red' }}>List price and listing schedule can not be edited once the item is listed. You will need to cancel your listing and relist the item with the updated price and dates.</p>
                                                            <h5>NFT Type : Auction</h5> <br />
                                                            <h5>Minimum bid</h5>
                                                            <input type="text" name="minimum_bid_amount" disabled value={this.state.nftData?.price} id="item_price_bid" className="form-control" placeholder="Enter Minimum Bid" />
                                                            <div className="spacer-10" />
                                                            <div className="row">
                                                                <div className="col-md-6">
                                                                    <h5>Starting date</h5>
                                                                    <DatePicker className="form-control" name="start_date" disabled value={this.state.nftData?.start_date1 ? this.state.nftData?.start_date1 : ''} />
                                                                </div>
                                                                <div className="col-md-6">
                                                                    <h5>Expiration date</h5>
                                                                    <DatePicker className="form-control" name="expiry_date" minDate={this.state.endDate} disabled value={this.state.nftData?.expiry_date1 ? this.state.nftData?.expiry_date1 : ''} />

                                                                </div>
                                                                <div className="spacer-single" />
                                                            </div>
                                                        </>
                                                        :

                                                        ""
                                                }
                                            </div>
                                        </div>
                                        <div className="spacer-10" />
                                        <br />
                                        {this.state.spinLoader == 0 ?
                                            <input type="submit" onClick={this.approveNFT.bind(this, this.state.nftData)} value="Approve" id="submit" className="btn-primary btn-sm" defaultValue="Create Item" />
                                            :
                                            <button disabled className="btn-primary btn-sm" id="deposit-page" >Processing &nbsp; <i className="fa fa-spinner fa-spin validat"></i></button>
                                        }
                                        <div className="spacer-single" />
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
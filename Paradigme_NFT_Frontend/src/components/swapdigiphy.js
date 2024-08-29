import React, { Component } from 'react';
import Header from '../directives/header'
import Footer from '../directives/footer'



export default class nftdetail extends Component {
    constructor(props) {
        super(props)

        this.state = {
            visible: false


        }



    }



    componentDidMount() {

    }
    openModal() {
        this.setState({
            visible: true
        });
    }

    closeModal() {
        this.setState({
            visible: false
        });
    }

    render() {
        return (

            <>
                <Header />

                <div id="content-block" className='mt-5'>


                    <section className="ptb-100 ">
                        <div className="container-fluid custom-container">
                            <div className="Toastify" />

                            <div className="container">
                                <div className="row justify-content-center">
                                    <div className='col-sm-5'>
                                        <h3 className='text-white text-center'>Swap Digiphy Coin</h3>
                                                  
                                        <div className='swap_digiphycoin'>
                                            <div className='row'>
                                                <div className='col-sm-12'>
                                                   

                                                    <div class=" form-group">
                                                        <div className='swap-field'>
                                                            <div className='d-flex'>
                                                                <div class="asset-logo">
                                                                    <img src="https://tokens-list.s3.eu-central-1.amazonaws.com/bsc-bnb.svg" class="asset-logo__image" alt="Asset logo" />
                                                                </div>&nbsp;&nbsp;

                                                                <input type="text" class="form-control" placeholder="0.00" />
                                                            </div>
                                                            <button type="button" class="currency-btn">
                                                                <span class="button__content">
                                                                    <div class="">
                                                                        <span class="token__symbol ellipsis">INR</span>
                                                                    </div>
                                                                </span>
                                                            </button>
                                                        </div>
                                                        <div className='swap-para'>
                                                            <p class="swap-tokens-form-token__info">≈ $ 0.00</p>
                                                            <p class="swap-tokens-form-token__info">Balance: 0.00</p>

                                                        </div>
                                                    </div>




                                                </div>
                                                <div className='col-sm-12 text-center mb-5'>
                                                    <button className='btn-main style-1 btn_exchange'>
                                                        <i className='fa fa-exchange'></i>
                                                    </button>
                                                    <br/>

                                                </div>
                                                <div className='col-sm-12'>
                                                <div class=" form-group">
                                                        <div className='swap-field'>
                                                            <div className='d-flex'>
                                                                <div class="asset-logo">
                                                                    <img src="https://tokens-list.s3.eu-central-1.amazonaws.com/bsc-bnb.svg" class="asset-logo__image" alt="Asset logo" />
                                                                </div>&nbsp;&nbsp;

                                                                <input type="text" class="form-control" placeholder="0.00" />
                                                            </div>
                                                            <button type="button" class="currency-btn">
                                                                <span class="button__content">
                                                                    <div class="">
                                                                        <span class="token__symbol ellipsis">Digiphycoin</span>
                                                                    </div>
                                                                </span>
                                                            </button>
                                                        </div>
                                                        <div className='swap-para'>
                                                            <p class="swap-tokens-form-token__info">≈ $ 0.00</p>
                                                            <p class="swap-tokens-form-token__info">Balance: 0.00</p>

                                                        </div>
                                                    </div>

                                                </div>
                                                <div className='col-sm-12'>
                                                    <button className='btn-main pt-2 pb-2 w-100'>Buy Now</button>
                                                </div>

                                            </div>

                                        </div>


                                    </div>
                                </div>
                            </div>

                        </div>
                    </section>

                    <br /><br />

                </div>



                <Footer />

            </>
        )
    }
}
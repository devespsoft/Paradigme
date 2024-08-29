import React, { Component } from 'react';
import axios from 'axios';
import Header from '../directives/header'
import Footer from '../directives/footer'
import config from '../config/config'
import Cookies from 'js-cookie';
import Countdown, { zeroPad } from 'react-countdown';
import { ToastContainer, toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import { Player } from 'video-react';

export default class collectionList extends Component {
  constructor(props) {
    super(props)
    const { match: { params } } = this.props;
    this.id = params.id
    this.state = {
      collectionDetail: []
    };
    this.loginData = (!Cookies.get('loginSuccessBline')) ? [] : JSON.parse(Cookies.get('loginSuccessBline'))
    this.token = (!Cookies.get('token')) ? [] : JSON.parse(Cookies.get('token'));
  }

  async getCollectionAPI(id) {
    await axios({
      method: 'get',
      url: `${config.apiUrl}getCollection`,
    }).then(response => {
      if (response.data.success === true) {
        this.setState({
          collectionDetail: response.data.response,
        })
      }
    })
  }

  componentDidMount() {
    this.getCollectionAPI()
  }

  render() {
    return (

      <>
        <Header />
        <ToastContainer />

        <div className="no-bottom no-top" id="content">
          <div id="top" />
          {/* section begin */}
          <section id="profile_banner" aria-label="section" className="text-light"
            style={{
              backgroundImage: this.state.collectionDetail.banner === '' || this.state.collectionDetail.banner === null || this.state.collectionDetail.banner === undefined
                ?
                "url('images/background/bg-3.jpg')" :
                `url(${config.imageUrl1}${this.state.collectionDetail.banner})`
            }}>
          </section>
          {/* section close */}
          <section aria-label="section" className="d_coll no-top userprofile-page">
            <div className="container">
              <div className="row">
                <div className="col-md-12">
                  <div className="de_tab tab_simple">
                    <div className="items_filter" style={{ backgroundSize: 'cover' }}>
                      <div className="de_tab_content">
                        <div className="tab-1" style={{ display: this.state.isActive === 1 ? 'block' : 'none' }}>
                          <div className="row">
                            {/* nft item begin */}
                            {this.state.collectionDetail.map(item => (
                              <div className="col-lg-3 col-md-6 col-sm-6 col-xs-12">
                              <div className="nft__item">
                                <div className="author_list_pp">
                                  {!item.profile_pic ?
                                    <Link to={`${config.baseUrl}collections/${item.id}`}>
                                      <img className="lazy" src="images/author/author-1.jpg" alt="" />
                                    </Link>
                                    :
                                    <Link to={`${config.baseUrl}collections/${item.id}`}>
                                      <img className="lazy" src={`${config.imageUrl1}`+item.profile_pic} alt="" />
                                    </Link>
                                  }
                                </div>

                                <div className="nft__item_wrap">
                                  <Link to={item.file_type === 'video' ? '#' : `${config.baseUrl}collections/${item.id}`}>
                                    <img className="lazy nft__item_preview" src={`${config.imageUrl1}`+item.banner} alt="" /> 
                                  </Link>
                                </div>

                                  <div className="nft__item_price" style={{ backgroundSize: 'cover' }}>
                                    <Link style={{ color: '#727272' }} to={`${config.baseUrl}collections/${item.id}`}>
                                      {item.name}
                                    </Link>
                                  </div>
                              </div>
                            </div>
                            ))}

                          </div>
                        </div>

                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div></section>
        </div>


        <Footer />
      </>
    )
  }
}
import React, { Component } from 'react';
import axios from 'axios';
import Header from '../directives/header'
import Footer from '../directives/footer'
import config from '../config/config'
import Cookies from 'js-cookie';
import Countdown, { zeroPad } from 'react-countdown';
import ContentShimmer from 'react-content-shimmer'
import moment from 'moment'
import { ToastContainer, toast } from 'react-toastify';
import { Player } from 'video-react';
import { Link } from 'react-router-dom';
import Select from 'react-select';
import ReactAudioPlayer from 'react-audio-player';
import Accordion from 'react-bootstrap/Accordion';

import {OBJModel} from 'react-3d-viewer'

const options = [
  { value: '0', label: 'Status' },
  { value: '1', label: 'Buy Now' },
  { value: '2', label: 'Auction' },
];
const options1 = [
  { value: 'All', label: 'Price' },
  { value: 'Lowtohigh', label: 'Price: Low to High' },
  { value: 'Hightolow', label: 'Price: High to Low' },
  { value: 'newest', label: 'Newest' },
  { value: 'oldest', label: 'Oldest' },
];

const customStyles = {
  option: (provided, state) => ({
    ...provided,
    borderBottom: '1px solid #ccc',
    color: state.isSelected ? '#000' : '#000',
  })
}

export default class marketplace extends Component {

  constructor(props) {
    super(props)
    this.state = {
      marketPlaces: [],
      allMarketPlaces: [],
      collections: [],
      categories: [],
      getItemAllNfts: [],
      searchCollection: '',
      searchAnything: "",
      selectType: 1,
      priceType: 'ADA',
      minPrice: 0,
      maxPrice: 0,
      limit: 15,
      nft_count: '0',
      auction_count: '0',
      creator_count: '0',
      collectionIds: [],
      itemCategoryIds: [],
      noData: 0,
      isResponse: true,
      collectionId: '0',
      categoryId: '0',
      searchData: '',
      sale_type: '0',
      sortBy: ''
    };
    this.loginData = (!Cookies.get('loginSuccessParadigme')) ? [] : JSON.parse(Cookies.get('loginSuccessParadigme'))
    this.CollectionHandler = this.CollectionHandler.bind(this)
    this.CategoryHandler = this.CategoryHandler.bind(this)

  }

  async collectionList() {
    await axios({
      method: 'post',
      url: `${config.apiUrl}getAllUserCollection`,
      data: {
        "limit": "0"
      }
    }).then((res) => {
      if (res.data.success === true) {
        this.setState({
          collections: res.data.response
        })
        // let allData = res.data.response.length;
        // let allDataVal = res.data.response;
        // if (allData > 0) {
        //   let fullcollection = [];
        //   for (let i = 0; i < allData; i++) {
        //     fullcollection[i] = {
        //       value: allDataVal[i].collection_id,
        //       label: allDataVal[i].collection_name
        //     }
        //   }
        //   this.setState({
        //     collections: fullcollection
        //   })
        // }
      }
    }).catch((error) => {

    })
  }

  async getCategories() {
    await axios({
      method: 'get',
      url: `${config.apiUrl}getCategory`,
      params: {
        "limit": "0"
      }
    }).then((res) => {
      if (res.data.success === true) {
        this.setState({
          categories: res.data.response
        })
        // let allData = res.data.response.length;
        // let allDataVal = res.data.response;
        // if (allData > 0) {
        //   let fullcategory = [];
        //   for (let i = 0; i < allData; i++) {
        //     fullcategory[i] = {
        //       value: allDataVal[i].id,
        //       label: allDataVal[i].name
        //     }
        //   }
        //   this.setState({
        //     categories: fullcategory
        //   })
        // }
      }

    }).catch((error) => {

    })
  }

  async allMarketPlaces() {
    await axios({
      method: 'post',
      url: `${config.apiUrl}marketplace`,
      data: {
        "user_id": "0",
        "login_user_id": this.loginData && this.loginData.id ? this.loginData.id : '0',
        "user_collection_id": this.state.collectionId,
        "category_id": this.state.categoryId,
        "searchData": this.state.searchData,
        "sale_type": this.state.sale_type,
        "sortBy": this.state.sortBy,
        "is_trending": "0",
        "recent": "0",
        "limit": "0"
      }
    }).then((res) => {
      if (res.data.success === true) {
        this.setState({
          allMarketPlaces: res.data.response,
          marketPlaces: res.data.response,
          isResponse: false,
          noData: 0
        })
      } else {
        this.setState({
          noData: 1,
          isResponse: false,
        })
      }

    }).catch((error) => {
      this.setState({
        noData: 1,
        isResponse: false,
      })
    })

  }

  searchAnything = (e) => {
    const { value } = e.target
    this.setState({ searchAnything: value })
    var regex = new RegExp(value.toUpperCase());
    const matchedData = this.state.allMarketPlaces.filter(item => (item.name == null ? '' : item.name.toUpperCase().match(regex)) || item.description.toUpperCase().match(regex) || (item.collection_name == null ? '' : item.collection_name.toUpperCase().match(regex)));
    if (matchedData.length > 0) {
      this.setState({ marketPlaces: matchedData })
    } else {
      this.setState({ marketPlaces: [] })
    }
  }

  CollectionHandler = (e, selectitem) => {
    e.preventDefault()
    let collectionIds = [...this.state.collectionIds];

    const index = collectionIds.indexOf(selectitem.collection_id);

    if (index > -1) {
      collectionIds.splice(index, 1);
    } else {
      collectionIds.push(selectitem.collection_id);
    }

    this.setState({ collectionIds });
    const filterItems = this.state.allMarketPlaces.filter(item => collectionIds.includes(item.collection_id));
    if (filterItems.length > 0) {
      this.setState({ marketPlaces: filterItems })
    } else {
      this.setState({ marketplace: [] })
    }




    if (collectionIds.length == 0) {
      // this.setState({ marketplace: this.state.allMarketPlaces })
      this.componentDidMount()
    }

  }

  CategoryHandler = async (e, selectcategory) => {
    e.preventDefault()
    let itemCategoryIds = [...this.state.itemCategoryIds];


    const index = itemCategoryIds.indexOf(selectcategory.id);

    if (index > -1) {
      itemCategoryIds.splice(index, 1);
    } else {
      itemCategoryIds.push(selectcategory.id);
    }

    this.setState({ itemCategoryIds });
    const filterItems = this.state.allMarketPlaces.filter(item => itemCategoryIds.includes(item.item_category_id));
    if (filterItems.length > 0) {
      this.setState({ marketPlaces: filterItems })
    } else {
      this.setState({ marketplace: [] })
    }

   




    // const filterItems = this.state.allMarketPlaces.filter(item => item.item_category_id === selectcategory.id);
    // if (filterItems.length > 0) {
    //   this.setState({ marketPlaces: filterItems })
    // } else {
    //   this.setState({ marketplace: [] })
    // }
  }

  selectTypeHandler = (value) => {
    this.setState({
      sale_type: value,
      selectType:value
    })
    console.log(this.state.sale_type)
    setTimeout(() => {
      this.allMarketPlaces();
    }, 500);
  }

  PriceHeaderFilter = async (data) => {
    this.setState({
      sortBy: data?.value
    })
    setTimeout(() => {
      this.allMarketPlaces();
    }, 500);
  }

  loadMore = () => {

    this.setState({ limit: parseInt(this.state.limit) + 6 })
  }

  componentDidMount() {
    this.collectionList()
    this.getCategories()
    this.allMarketPlaces()
    this.totalNfts()
  }

  getTimeOfStartDate(dateTime) {
    var date = new Date(dateTime); // some mock date
    var milliseconds = date.getTime();
    return milliseconds;
  }

  CountdownTimer({ days, hours, minutes, seconds, completed }) {
    if (completed) {
      // Render a completed state
      return "Starting";
    } else {
      // Render a countdowns
      var dayPrint = (days > 0) ? days + 'd' : '';
      return <span>{dayPrint} {zeroPad(hours)}h {zeroPad(minutes)}m {zeroPad(seconds)}s</span>;
    }
  };

  async resetButton() {
    this.componentDidMount()
  }

  async totalNfts() {
    await axios({
      method: 'get',
      url: `${config.apiUrl}getDashboardCount`,
      data: {}
    }).then((res) => {
      if (res.data.success === true) {
        this.setState({
          getItemAllNfts: res.data.response
        })
      }
    }).catch((error) => {

    })
  }

  //==============================  for price filter  =============================================

  applyPriceFilter = () => {
    if (this.state.priceType === 'ADA') {
      // alert('4')

      var filterItems = this.state.minPrice > 0 && !this.state.maxPrice ?
        this.state.allMarketPlaces.filter(item => parseFloat(item.usd_price) >= parseFloat(this.state.minPrice))
        : this.state.maxPrice > 0 && !this.state.minPrice
          ? this.state.allMarketPlaces.filter(item => parseFloat(item.usd_price) <= parseFloat(this.state.maxPrice))
          :
          this.state.allMarketPlaces.filter(item => parseFloat(item.usd_price) >= parseFloat(this.state.minPrice) && parseFloat(item.usd_price) <= parseFloat(this.state.maxPrice));

      if (this.state.minPrice === '' || this.state.maxPrice === '') {
        this.setState({ marketPlaces: this.state.allMarketPlaces })
      }
    } else if (this.state.priceType === 'USD') {
      // alert('41')

      var filterItems = this.state.minPrice > 0 && !this.state.maxPrice ?
        this.state.allMarketPlaces.filter(item => parseFloat(item.usd_price) >= parseFloat(this.state.minPrice))
        : this.state.maxPrice > 0 && !this.state.minPrice
          ? this.state.allMarketPlaces.filter(item => parseFloat(item.usd_price) <= parseFloat(this.state.maxPrice))
          :
          this.state.allMarketPlaces.filter(item => parseFloat(item.usd_price) >= parseFloat(this.state.minPrice) && parseFloat(item.usd_price) <= parseFloat(this.state.maxPrice));
    }
    if (filterItems.length > 0) {
      // alert('411')

      this.setState({ marketPlaces: filterItems })
    }
    else {
      // alert('41111')

      this.setState({ marketPlaces: [] })
    }

  }

  async resetButton() {
    window.location.reload()
  }

  render() {
    return (

      <>
        <div id="wrapper">
          <Header />
          <ToastContainer />
          <div className="no-bottom" id="content">
            <div id="top" />
            {/* section begin */}
            <section aria-label="section" className="marketplace">
              <div className="container">
                <div className='de_count text-left'>
                  <ul>
                    <li className='active'><h4>NFTs&nbsp;{this.state.getItemAllNfts.nfts}</h4></li>

                    <a href={`${config.baseUrl}collectionList`}>
                      <li><h4 >Collections&nbsp;{this.state.getItemAllNfts.totalCollection}</h4></li>
                    </a>

                    <a href={`${config.baseUrl}profileList`}>
                      <li><h4 >Profiles&nbsp; {this.state.getItemAllNfts.totalUsers}</h4></li>
                    </a>
                  </ul>
                </div>

                <div className='container-fluid'>
                  <div className='row'>
                    <div className='col-md-3'>
                      <aside>
                        <div className="mb-3" style={{ backgroundSize: 'cover' }}>
                          <div className="col-lg-12 mb-3" style={{ backgroundSize: 'cover' }}>
                            <form className="form-inline d-block">
                              <label className='input-label'>Search</label>
                              <div className="form" style={{ backgroundSize: 'cover' }}>
                                <i className="fa fa-search" />
                                <input type="text" onChange={e => this.searchAnything(e)} value={this.state.searchAnything} className="form-control form-input" placeholder="Search" />
                              </div>
                            </form>
                          </div>

                          {/* <div className="col-lg-12 mb-3" style={{ backgroundSize: 'cover' }}>
                          <div id="buy_category" className="dropdown2" style={{ backgroundSize: 'cover' }}>
                            <label className='input-label'>Status</label>
                            <Select
                              styles={customStyles}
                              options={options}
                              onChange={this.selectTypeHandler}
                              menuColor='#fff'
                              theme={(theme) => ({
                                ...theme,
                                borderRadius: 0,
                                colors: {
                                  ...theme.colors,
                                  primary25: '#fc7d00',
                                  primary: '#fc7d00',
                                },
                              })}
                            />
                          </div>
                        </div> */}

                          <div className='col-lg-12 mb-3'>
                            <div className="filter-area">
                              <div className="filter-title">
                                <div className="filterone">
                                  <span>Filters</span>
                                </div>
                                <div className="filtertwo">
                                  <span>Clear all</span>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className='col-lg-12'>
                          <Accordion defaultActiveKey={['0']} alwaysOpen>
                              <Accordion.Item eventKey="0">
                                <Accordion.Header>Sell Type</Accordion.Header>
                                <Accordion.Body>
                                <div className="tab1-nft" style={{ backgroundSize: 'cover' }}>
                              <div className="accordion-body Panel--isContentPadded FeaturedFilter--items">
                                <div className={`FeaturedFilter-item ${this.state.selectType === 1 ? 'FeaturedFilter--isSelected' : ""}`} onClick={e => this.selectTypeHandler(1)}>Buy Now</div>
                                <div className={`FeaturedFilter-item ${this.state.selectType === 2 ? 'FeaturedFilter--isSelected' : ""}`} onClick={e => this.selectTypeHandler(2)}>On Auction</div>

                              </div>
                            </div>
                                </Accordion.Body>
                              </Accordion.Item>
                              <Accordion.Item eventKey="1">
                                <Accordion.Header>Price</Accordion.Header>
                                <Accordion.Body>
                                <div className="min-max-field">
                              <div className>
                                <input type="text" onChange={e => this.setState({ minPrice: e.target.value })} className="form-control" name placeholder="Min" />
                              </div>
                              <div className="to">to</div>
                              <div className>
                                <input type="text" onChange={e => this.setState({ maxPrice: e.target.value })} className="form-control" name placeholder="Max" />
                              </div>
                            </div>
                            <button className="btn btn-primary mt-3 ml-1" onClick={e => this.applyPriceFilter()}>Apply</button>
                                </Accordion.Body>
                              </Accordion.Item>
                              <Accordion.Item eventKey="2">
                                <Accordion.Header>Collections</Accordion.Header>
                                <Accordion.Body style={{marginLeft:'15px'}}>
                                {this.state.collections.map(item => {
                                    return (
                                      item.nft_count > 0 ?
                                        <div className="CollectionFilter--item">
                                          <div className=" hezVSt Image--isImageLoaded Image--isImageLoaderVisible CollectionFilter--item-image" style={{ height: '32px', width: '32px' }}><img className="Image--image" src={`${config.imageUrl1}${item.banner}`} style={{ objectFit: 'cover' }} /></div>
                                          <label className="CollectionFilter--item-name" style={{ padding: '5px', width: '110%', cursor: 'pointer', backgroundColor: (this.state.collectionIds.includes(item.collection_id)) ? 'rgb(109 73 33)' : '' }} onClick={e => this.CollectionHandler(e, item)}>
                                            {item.collection_name}
                                          </label>
                                        
                                        </div> : '')
                                  })}
                                </Accordion.Body>
                              </Accordion.Item>
                              <Accordion.Item eventKey="3">
                                <Accordion.Header>Category</Accordion.Header>
                                <Accordion.Body style={{marginLeft:'15px'}}>
                                <div className=" gUuGNP CategoryFilter--panel">
                              <div className="Scrollbox--content">
                                {this.state.categories.map(item => {
                                  return (
                                    item.nft_count > 0 ?
                                      <div className="CategoryFilter--item">

                                        <label className="CategoryFilter--name" style={{ padding: '5px', width: '100%', cursor: 'pointer', background: (this.state.itemCategoryIds.includes(item.id)) ? 'rgb(109 73 33)' : '' }} onClick={e => this.CategoryHandler(e, item)}>{item.name}</label>
                                      </div> : ''
                                  )
                                })}

                              </div>

                            </div>
                                </Accordion.Body>
                              </Accordion.Item>
                            </Accordion>
                          </div>


                          {/* <div className="col-lg-12 mb-3" style={{ backgroundSize: 'cover' }}>
                          <div id="buy_category" className="dropdown2" style={{ backgroundSize: 'cover' }}>
                            <label className='input-label'>Sort by</label>
                            <Select
                              styles={customStyles}
                              options={options1}
                              onChange={this.PriceHeaderFilter}
                              menuColor='#fff'
                              theme={(theme) => ({
                                ...theme,
                                borderRadius: 0,
                                colors: {
                                  ...theme.colors,
                                  primary25: '#fc7d00',
                                  primary: '#fc7d00',
                                },
                              })}
                            />
                          </div>
                        </div>


                        <div className="col-lg-12 mb-3" style={{ backgroundSize: 'cover' }}>
                          <div id="buy_category" className="dropdown2" style={{ backgroundSize: 'cover' }}>
                            <label className='input-label'>Collection</label>

                            <Select
                              styles={customStyles}
                              options={this.state.collections ? this.state.collections : ''}
                              onChange={this.CollectionHandler}
                              menuColor='#fff'
                              theme={(theme) => ({
                                ...theme,
                                borderRadius: 0,
                                colors: {
                                  ...theme.colors,
                                  primary25: '#fc7d00',
                                  primary: '#fc7d00',
                                },
                              })}
                            />

                          </div>
                        </div>

                        <div className="col-lg-12 mb-3" style={{ backgroundSize: 'cover' }}>
                          <div id="buy_category" className="dropdown2" style={{ backgroundSize: 'cover' }}>
                            <label className='input-label'>Category</label>
                            <Select
                              styles={customStyles}
                              options={this.state.categories ? this.state.categories : ''}
                              onChange={this.CategoryHandler}
                              menuColor='#fff'
                              theme={(theme) => ({
                                ...theme,
                                borderRadius: 0,
                                colors: {
                                  ...theme.colors,
                                  primary25: '#fc7d00',
                                  primary: '#fc7d00',
                                },
                              })}
                            />
                          </div>

                        </div> */}

                          {/* <div className="col-lg-12 mb-3" style={{ backgroundSize: 'cover' }}>
                          <label className='input-label'>&nbsp;</label>
                          <a href={`${config.baseUrl}marketplace`}><button id="reset_button" className="btn btn-primary btn-sm">Reset</button></a>
                        </div> */}

                        </div>
                      </aside>
                    </div>

                    <div className='col-md-9'>
                      <div className="row wow fadeIn">
                        <div className="col-md-12">
                          <div className='row'>
                            {this.state.isResponse == true ?
                              <>
                                <div className='col-sm-4'>
                                  <ContentShimmer rows="1" style={{ marginTop: "1rem", background: '#e6e6e4', width: '100%' }} rounded={"20px"} size={{ height: 400 }} />
                                </div>

                                <div className='col-sm-4'>
                                  <ContentShimmer rows="1" style={{ marginTop: "1rem", background: '#e6e6e4', width: '100%' }} rounded={"20px"} size={{ height: 400 }} />
                                </div>

                                <div className='col-sm-4'>
                                  <ContentShimmer rows="1" style={{ marginTop: "1rem", background: '#e6e6e4', width: '100%' }} rounded={"20px"} size={{ height: 400 }} />
                                </div>
                              </>
                              :

                              !this.state.marketPlaces || this.state.noData == 1 ?
                                <>
                                  <span className='text-center bg-grey'><img src='images/nodata-found.png' /></span>
                                </>
                                :
                                this.state.marketPlaces.map(item => (
                                  <div className='col-lg-4 col-md-6 mb-5'>
                                    <div className={item.owner_id == 1?'auction-list gradient-border turningcard':'auction-list' }>
                                      <div className='profilebox'>
                                        {!item.owner_profile_pic || item.owner_profile_pic === null || item.owner_profile_pic == 'null' || item.owner_profile_pic === undefined ?
                                          <img src="images/default-user-icon.jpg" alt="" />
                                          :
                                          <img src={`${config.imageUrl1 + item.owner_profile_pic}`} />
                                        }
                                        <Link to={`${config.baseUrl}UserProfile/` + item.owner_id} >
                                          <h5>{item.owner_name}</h5>
                                        </Link>
                                      </div>
                                      <div class="auction-img" style={{ backgroundImage: item.file_type == 'audio' ? "url(./images/audio.jpeg)" : '', backgroundPosition: item.file_type == 'audio' ? "center" : '', position: item.file_type == 'audio' ? "relative" : '' }}>

                                        <Link to={`${config.baseUrl}nftDetails/` + item.item_id}>

                                          {item.file_type == 'image' ?
                                            <div className="">
                                              <img src={`${config.imageUrl}` + item.image} width="70px" />
                                            </div>
                                            :


                                            item.file_type == 'video' ?
                                              <video muted autoPlay width="70px" height="70px" controls>
                                                <source src={`${config.imageUrl}${item.image}`} type="video/mp4" />
                                              </video>

                                              :
                                              item.file_type == 'audio' ?
                                                <ReactAudioPlayer
                                                  className='audio-play'
                                                  src={`${config.imageUrl}${item.image}`}

                                                  controls
                                                /> : ""


                                          }
                                        </Link>

                                      </div>
                                      <div className='profileboxdetail'>
                                        <Link to={`${config.baseUrl}collections/` + item.user_collection_id}>
                                          <img src={`${config.imageUrl1 + item.collection_image}`} />
                                          {item.collection_name}
                                        </Link> <br />
                                        <Link to={`${config.baseUrl}nftDetails/` + item.item_id}>

                                          <h2>{item.name.length < 20 ? item.name : item.name.substring(0, 20) + '....'}</h2>
                                        </Link>
                                        <p style={{ float: 'right' }}>{item.nft_type_select == 1 ? 'Physical' : 'Digital'}</p>

                                      </div>

                                      {item.sell_type == 2 ?
                                        <div className='nft-dark-box bg-dark'>
                                          <table width='100%'>
                                            <thead>
                                              <tr>
                                                <th><p>Price</p></th>
                                                <th className='text-right'><p>

                                                  {item.is_on_sale === 0 ? '' :
                                                    item.sell_type === 1 || item.expiry_date === null ? '' :
                                                      new Date(item.start_date) > new Date() ?
                                                        <>
                                                          Sale start in
                                                        </>
                                                        :
                                                        new Date(item.expiry_date) > new Date() ?
                                                          <>
                                                            Sale ends in
                                                          </>
                                                          :
                                                          "Sale ends"
                                                  }
                                                </p></th>
                                              </tr>
                                            </thead>
                                            <tbody>
                                              <tr>
                                                <td><p>{item.price} MATIC </p></td>
                                                <td className='text-right'>

                                                  {item.is_on_sale === 0 ? '' :
                                                    item.sell_type === 1 || item.expiry_date === null ? '' :
                                                      <div className="item_info_like"><i className="fa fa-clock-o" aria-hidden="true" />
                                                        {new Date(item.start_date) > new Date() ?
                                                          <>
                                                            {(item.start_date && item) ?
                                                              <Countdown
                                                                date={this.getTimeOfStartDate(item.start_date)}
                                                                renderer={this.CountdownTimer}
                                                              /> :
                                                              <>
                                                                <span className="days">{moment(item.start_date).diff(moment(), 'days')} day </span>
                                                              </>
                                                            }
                                                          </>
                                                          :
                                                          new Date(item.expiry_date) > new Date() ?
                                                            <>
                                                              {(item.expiry_date && item) ?
                                                                <Countdown
                                                                  date={this.getTimeOfStartDate(item.expiry_date)}
                                                                  renderer={this.CountdownTimer}
                                                                /> :
                                                                <>
                                                                  <span className="days">{moment(item.expiry_date).diff(moment(), 'days')} day </span>
                                                                </>
                                                              }

                                                            </>
                                                            :
                                                            "Sale ends"
                                                        }
                                                      </div>}
                                                </td>
                                              </tr>
                                            </tbody>
                                          </table>
                                        </div>

                                        :
                                        <div className='nft-dark-box bg-dark'>
                                          <table width='100%'>
                                            <thead>
                                              <tr>
                                                <th><p>Price</p></th>
                                                <th className='text-right'><p>
                                                  Owner
                                                </p></th>
                                              </tr>
                                            </thead>
                                            <tbody>
                                              <tr>
                                                <td><p>{parseFloat(item.price).toFixed(6)} MATIC </p></td>
                                                <td className='text-right'>
                                                  <p>{item.owner_name}</p>
                                                </td>
                                              </tr>
                                            </tbody>
                                          </table>
                                        </div>

                                      }

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
            </section>
          </div>
          <Footer />
        </div>
      </>
    )
  }
}

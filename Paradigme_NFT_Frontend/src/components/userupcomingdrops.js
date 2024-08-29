import React, { Component } from 'react';
 import axios from 'axios';
 import Header from '../directives/header'
 import Footer from '../directives/footer'
 import config from '../config/config'
import { Link } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';
import Cookies from 'js-cookie'

import Countdown,{zeroPad} from 'react-countdown';
import { LazyLoadImage  } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';
import Loader from "react-loader-spinner";

const headers = {
    'Content-Type': 'application/json'
 };

export default class userupcomingdrops extends Component {

    constructor(props) {
        super(props)
        this.loginData = (!Cookies.get('loginSuccess'))?[]:JSON.parse(Cookies.get('loginSuccess'))
        this.state = {
         getListUpcoming:[],
         getTelentUserData:[],
         isLoader:0


        }
    }

    componentDidMount() {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      this.getItemUpcoming()
      this.getTelentUserAPI()

    }


     //=======================================  New Talent  =====================

     async getTelentUserAPI() {
        await axios({
           method: 'post',
           url: `${config.apiUrl}getUserTelent`,
           data: { limit:'4',is_feature:'0' }
        })
           .then(result => {
              if (result.data.success === true) {
                 this.setState({
                    getTelentUserData: result.data.response
                 })
              }
              else if (result.data.success === false) {
              }
           }).catch(err => {
           });
     }

    getTimeOfStartDate(dateTime){
      var date = new Date(dateTime); // some mock date
      var milliseconds = date.getTime();
      return milliseconds;
    }

   CountdownTimer({days, hours, minutes, seconds, completed }){
      if (completed) {
        // Render a completed state
        return "Starting";
      } else {
        // Render a countdowns
        var dayPrint = (days>0)?days+'d':'';
        return <span>{dayPrint} {zeroPad(hours)}h {zeroPad(minutes)}m {zeroPad(seconds)}s</span>;
      }
    };

       //=======================================  Imaages show according to category  =====================

   async getItemUpcoming() {
    this.setState({
        isLoader:1
       })
      await axios({
         method: 'post',
         url: `${config.apiUrl}listitem`,
         data: {"limit":"0", "category_id": "-1" }
      })
         .then(result => {
            if (result.data.success === true) {
               this.setState({
                  getListUpcoming: result.data.response,
                  isLoader:0
               })
            }
            else if (result.data.success === false) {
                this.setState({
                    isLoader:0
                   })
            }
         }).catch(err => {
            this.setState({
                isLoader:0
               })
         });
   }


   async talentStatusAPI(){
    await axios({
       method: 'post',
       url: `${config.apiUrl}getTelentStatus`,
       data: {'user_id':this.loginData.data.id}
    })
       .then(result => {
          if (result.data.success === true) {
             if(result.data.response[0].telent_status === 2 || result.data.response[0].telent_status === 3 || result.data.response[0].telent_status === 0){
                window.location.href = `${config.baseUrl}createyourownnfts`
             }
             else if(result.data.response[0].telent_status === 1){
               window.location.href = `${config.baseUrl}featurescreator/${this.loginData.data.id}`
             }
             // else if(result.data.response[0].telent_status === 0){
             //   toast.error('Your Account is in process to get verify from admin side, Please wait to "Create NFT".', {
             //      position: toast.POSITION.TOP_CENTER
             //    });
             // }
          }
          else if (result.data.success === false) {
          }
       }).catch(err => {
       });
    }


   loginCheck(){
    if(this.loginData.length === 0){
       window.location.href = `${config.baseUrl}login`
    }
    else{
       this.talentStatusAPI()
     
 }
}


    render() {
        return (    

            <>
  <Header/>
  <div id="content-block">
       <br/><br/>
        
         <div className="container-fluid custom-container pl-0 pr-0">
           
                <div className="container-fluid custom-container upcomming-drops" id="upcomming-drops">
               <div className="container">
                  <div className="row">
                   
                  <div className="col-xs-12 col-md-12">
                            <div className="row">
                              <div className="col-sm-9">
                
                              </div>
                              <div className="col-sm-3">
                                <div className="be-vidget back-block mb-4 btn-right">
                                      <a className="btn full btn-primary size-1 hover-2" onClick={this.loginCheck.bind(this)} >Create Your Own NFTs</a>
                                </div>
                              </div>
              
                            </div>
                          </div>
                      
                     <br/><br/><br/>

                  
                     
                     <div className="col-md-12">
                     <h3><strong>Upcoming Drops</strong></h3>
                        <hr/>                      
                        <div  className="row _post-container_">

                        {this.state.isLoader === 1 ?
               <div className="row _post-container_" style={{ height: '200px' }}>
                  <div className="caroselHeight loaderBars">
                     <Loader type="Bars" color="#00BFFF" height={40} width={40} />
                  </div>
               </div> :
                        this.state.getListUpcoming.length === 0 ? 
                 <h4 className="text-center upcomigClass" style={{color:'#fff'}}>There isn't any assest available.</h4>:
                     this.state.getListUpcoming.map(item => (
                 
                 <div className="category-1 mix col-md-4">
                    <div className="be-post">
                    {item.is_sold === 0 ? 
                           '':
                           <div className="soldOut">
                           <img src="images/sold.png"/>
                        </div>
                        }
                       <Link to={`${config.baseUrl}itemdetails/${item.item_edition_id}`} className="be-img-block">
                       <img effect="blur"  src={`${config.imageUrl}${item.image}`} alt="omg"/>
                       </Link>
                       <div className="timer">
                       <Countdown
                           date={this.getTimeOfStartDate(item.start_date)}
                           renderer={this.CountdownTimer}
                        />
                       </div>
                       <Link to={`${config.baseUrl}itemdetails/${item.item_edition_id}`} className="be-post-title">
                          {item.name}</Link>
                          {/* <Link to={`${config.baseUrl}itemdetails/${item.item_edition_id}`} class="be-post-title price price-data">$ {item.price}</Link> */}

                       <span>
                       
                       </span>
                       <div className="author-post">
                          
                          
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
          <Footer/>
            </>

        )
    }
}
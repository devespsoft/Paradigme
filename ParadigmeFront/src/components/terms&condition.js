import React, { Component } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie'
import Header from '../directives/header'
import Footer from '../directives/footer'
import config from '../config/config'

export default class termsandcondition extends Component {

  constructor(props) {
    super(props);
    this.state = {
        name : '',
        termsandcondition : [],
       
                 }
    this.loginData = (!Cookies.get('loginSuccessParadigme')) ? [] : JSON.parse(Cookies.get('loginSuccessParadigme'));
    this.token = (!Cookies.get('token')) ? [] : JSON.parse(Cookies.get('token'));
    // this.handleSubmit = this.handleSubmit.bind(this)
    // this.handleChange = this.handleChange.bind(this)  
    }

    componentDidMount() {
      this.getTandCList();
  }


    async getTandCList() {
       
      await axios.get(`${config.apiUrl}getTermsConditions`, {},)
          .then(result => {
              const data = result.data;
                 if (result.data.success === true) {
                  this.setState({
                    termsandcondition: result.data.response[0],
                              })
                           }
              else if (result.data.success === false) {

              }
          })

          .catch(err => {
          })
          }




    render() {
        return (    
          
            <>
            <Header/>
            <div className="no-bottom no-top" id="content">
        <div id="top" />
        
        <section id="subheader" className="text-light" style={{ backgroundImage: `url("images/background/contact.jpg")` , backgroundSize: 'cover' }}>
        <div class="overlay bg-black op-7"></div>
          <div className="center-y relative text-center">
            <div className="container">
              <div className="row">
                <div className="col-md-12 text-center">
                  <h1>Terms &amp; Condition</h1>
                </div>
                <div className="clearfix" />
              </div>
            </div>
          </div>
        </section>
        <section aria-label="section">
          <div className="container">
            <div className="term-condition">
              <div className="row">
                <div className="col-lg-12 col-md-12 col-12">
                  <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam at ex vulputate, tempus tellus ut, feugiat neque. Phasellus pharetra orci mauris, a accumsan nisl dictum id. Vestibulum luctus laoreet metus, sagittis finibus ante mattis et. Phasellus tempus orci ac eleifend faucibus. Pellentesque scelerisque at arcu a ornare. Cras fringilla rutrum diam quis pharetra. Suspendisse at quam urna. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas ac pulvinar lorem. Fusce consequat suscipit justo a maximus. Sed sed leo eu elit tristique porta. Quisque hendrerit turpis risus, sed tristique ipsum consectetur sit amet.</p>

                  <p>Sed a orci rhoncus, elementum nibh id, elementum diam. Etiam ligula turpis, auctor et ullamcorper ut, imperdiet in enim. Ut convallis faucibus justo, vel tincidunt nisl ultricies nec. Suspendisse potenti. Quisque ut feugiat velit, ut bibendum leo. Fusce condimentum dapibus laoreet. Donec ut nisi eget neque eleifend efficitur. Sed eget imperdiet erat. Etiam commodo velit mi, in sagittis eros ultricies sit amet. Mauris interdum ut risus quis dapibus. Sed imperdiet velit vel lacus vestibulum tincidunt. Vivamus in urna dolor. Curabitur feugiat convallis lectus et pulvinar. Maecenas ornare suscipit ultrices. Nulla a congue quam.</p>

                  <p>Maecenas interdum malesuada nisl non blandit. Proin quis nunc quis quam viverra tincidunt. Sed et nunc lobortis, porta diam sed, pellentesque ipsum. Morbi a maximus dolor. Phasellus semper interdum enim ultricies dictum. Vestibulum in eros ante. Maecenas pellentesque condimentum lectus et volutpat. Etiam ut augue placerat, imperdiet orci non, tempus tellus. Pellentesque iaculis malesuada tincidunt.</p>

                  <p>In augue nulla, mollis eget interdum ut, placerat et lacus. Curabitur vel tortor posuere, vulputate lorem quis, posuere orci. Nullam tincidunt erat nisl, eu congue arcu hendrerit non. Vivamus feugiat fringilla lectus, eget auctor ipsum tempus sit amet. Nullam a consectetur ipsum. Nam dignissim ornare augue, sed lobortis eros tincidunt at. Fusce nec congue justo. Phasellus tempor sapien eu tortor commodo posuere. Etiam sed arcu at ex semper blandit laoreet ac arcu. In eget convallis tortor. Vestibulum accumsan, orci quis semper porttitor, diam arcu aliquam tellus, facilisis rhoncus elit neque vitae mi.</p>

                  <p>Duis at mauris ipsum. Donec sed nisl dapibus, convallis turpis vitae, placerat libero. Vestibulum elementum purus vestibulum, feugiat nibh ut, fermentum est. Maecenas vitae lacinia sem, vitae gravida elit. Cras nisi nunc, pretium at nisl id, mattis lobortis nulla. Integer in lacinia leo, vitae varius sem. Maecenas ac mi auctor, suscipit mauris nec, malesuada diam.</p>
                {/* <div dangerouslySetInnerHTML={{__html: this.state.termsandcondition.terms_conditions}}></div> */}
                </div>  
              </div>
            </div>
          </div>
        </section>
      </div>
      <Footer/>
            </>
              
        )
    }
}
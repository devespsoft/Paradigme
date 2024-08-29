import React, { Component } from 'react';
import axios from 'axios';
import Header from '../directives/header'
import Footer from '../directives/footer'
import config from '../config/config'

export default class faq extends Component {


  constructor(props) {
    super(props)
    this.state = {
      faqLists: [],
    };


  }

  async getFaqList() {
    await axios({
      method: 'get',
      url: `${config.apiUrl}getFaq`,
    }).then((res) => {
      if (res.data.success === true) {
        this.setState({ faqLists: res.data.response })
      }

    }).catch((error) => {

    })
  }

  componentDidMount() {
    this.getFaqList();
  }


  render() {
    return (

      <>
      <Header />
        <div className="no-bottom no-top" id="content">
          <div id="top" />

          <section id="subheader" className="text-light" style={{ backgroundImage: `url("images/background/header-banner.jpg")` }}>
            <div className="center-y relative text-center">
              <div className="container">
                <div className="row">
                  <div className="col-md-12 text-center">
                    <h1>Support</h1>

                  </div>
                  <div className="clearfix" />
                </div>
              </div>
            </div>
          </section>

          <section aria-label="section ">
            <div className="container">
              <div className="row mb-5 text-center">
                <div className="col-md-2" style={{ backgroundSize: 'cover' }} />
                <div className="col-md-8" style={{ backgroundSize: 'cover' }}>
                  <h3>FAQ</h3>
                  <div className="accordion accordion-flush" id="accordionFlushExample" style={{ backgroundSize: 'cover' }}>
                  {this.state.faqLists.length>0 &&
                    <div className="accordion-item" style={{ backgroundSize: 'cover' }}>
                      <h2 className="accordion-header" id="flush-headingOne">
                        <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#flush-collapseOne" aria-expanded="false" aria-controls="flush-collapseOne">
                          {this.state.faqLists.length>0 && this.state.faqLists[0].question}
                        </button>
                      </h2>
                      <div id="flush-collapseOne" className="accordion-collapse collapse show" aria-labelledby="flush-headingOne" data-bs-parent="#accordionFlushExample" style={{ backgroundSize: 'cover' }}>
                        <div className="accordion-body" style={{ backgroundSize: 'cover' }}>{this.state.faqLists.length>0 && this.state.faqLists[0].answer}</div>
                      </div>
                    </div>}
                    {this.state.faqLists.length>1 &&
                    <div className="accordion-item" style={{ backgroundSize: 'cover' }}>
                      <h2 className="accordion-header" id="flush-headingTwo">
                        <button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#flush-collapseTwo" aria-expanded="true" aria-controls="flush-collapseTwo">
                        {this.state.faqLists.length>1 && this.state.faqLists[1].question}
                        </button>
                      </h2>
                      <div id="flush-collapseTwo" className="accordion-collapse collapse" aria-labelledby="flush-headingTwo" data-bs-parent="#accordionFlushExample" style={{ backgroundSize: 'cover' }}>
                        <div className="accordion-body" style={{ backgroundSize: 'cover' }}>{this.state.faqLists.length>1 && this.state.faqLists[1].answer}</div>
                      </div>
                    </div>}
                    {this.state.faqLists.length>2 &&
                    <div className="accordion-item" style={{ backgroundSize: 'cover' }}>
                      <h2 className="accordion-header" id="flush-headingThree">
                        <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#flush-collapseThree" aria-expanded="false" aria-controls="flush-collapseThree">
                        {this.state.faqLists.length > 2 && this.state.faqLists[2].question}
                        </button>
                      </h2>
                      <div id="flush-collapseThree" className="accordion-collapse collapse" aria-labelledby="flush-headingThree" data-bs-parent="#accordionFlushExample" style={{ backgroundSize: 'cover' }}>
                        <div className="accordion-body" style={{ backgroundSize: 'cover' }}>{this.state.faqLists.length > 2 && this.state.faqLists[2].answer} </div>
                      </div>
                    </div>}
                    {this.state.faqLists.length>3 &&
                    <div className="accordion-item" style={{ backgroundSize: 'cover' }}>
                      <h2 className="accordion-header" id="flush-headingfour">
                        <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#flush-collapsefour" aria-expanded="false" aria-controls="flush-collapsefour">
                          {this.state.faqLists.length > 3 && this.state.faqLists[3].question}
                        </button>
                      </h2>
                      <div id="flush-collapsefour" className="accordion-collapse collapse" aria-labelledby="flush-headingfour" data-bs-parent="#accordionFlushExample" style={{ backgroundSize: 'cover' }}>
                        <div className="accordion-body" style={{ backgroundSize: 'cover' }}> {this.state.faqLists.length > 3 && this.state.faqLists[3].answer}</div>
                      </div>
                    </div>}
                    {this.state.faqLists.length>4 &&
                    <div className="accordion-item" style={{ backgroundSize: 'cover' }}>
                      <h2 className="accordion-header" id="flush-headingfive">
                        <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#flush-collapsefive" aria-expanded="false" aria-controls="flush-collapsefive">
                          {this.state.faqLists.length > 4 && this.state.faqLists[4].question}
                        </button>
                      </h2>
                      <div id="flush-collapsefive" className="accordion-collapse collapse" aria-labelledby="flush-headingfour" data-bs-parent="#accordionFlushExample" style={{ backgroundSize: 'cover' }}>
                        <div className="accordion-body" style={{ backgroundSize: 'cover' }}> {this.state.faqLists.length > 4 && this.state.faqLists[4].answer}</div>
                      </div>
                    </div>}
                    {this.state.faqLists.length>5 &&
                    <div className="accordion-item" style={{ backgroundSize: 'cover' }}>
                      <h2 className="accordion-header" id="flush-headingSix">
                        <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#flush-headingSix" aria-expanded="false" aria-controls="flush-headingSix">
                          {this.state.faqLists.length > 5 && this.state.faqLists[5].question}
                        </button>
                      </h2>
                      <div id="flush-headingSix" className="accordion-collapse collapse" aria-labelledby="flush-headingfour" data-bs-parent="#accordionFlushExample" style={{ backgroundSize: 'cover' }}>
                        <div className="accordion-body" style={{ backgroundSize: 'cover' }}> {this.state.faqLists.length > 5 && this.state.faqLists[5].answer}</div>
                      </div>
                    </div>}
                    {this.state.faqLists.length>6 &&
                    <div className="accordion-item" style={{ backgroundSize: 'cover' }}>
                      <h2 className="accordion-header" id="flush-headingSeven">
                        <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#flush-headingSeven" aria-expanded="false" aria-controls="flush-headingSeven">
                          {this.state.faqLists.length > 6 && this.state.faqLists[6].question}
                        </button>
                      </h2>
                      <div id="flush-headingSeven" className="accordion-collapse collapse" aria-labelledby="flush-headingSeven" data-bs-parent="#accordionFlushExample" style={{ backgroundSize: 'cover' }}>
                        <div className="accordion-body" style={{ backgroundSize: 'cover' }}> {this.state.faqLists.length > 6 && this.state.faqLists[6].answer}</div>
                      </div>
                    </div>}
                    {this.state.faqLists.length>7 &&
                    <div className="accordion-item" style={{ backgroundSize: 'cover' }}>
                      <h2 className="accordion-header" id="flush-headingEight">
                        <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#flush-collapseEight" aria-expanded="false" aria-controls="flush-collapseEight">
                          {this.state.faqLists.length > 7 && this.state.faqLists[7].question}
                        </button>
                      </h2>
                      <div id="flush-collapseEight" className="accordion-collapse collapse" aria-labelledby="flush-collapseEight" data-bs-parent="#accordionFlushExample" style={{ backgroundSize: 'cover' }}>
                        <div className="accordion-body" style={{ backgroundSize: 'cover' }}> {this.state.faqLists.length > 7 && this.state.faqLists[7].answer}</div>
                      </div>
                    </div>}
                    {this.state.faqLists.length>8 &&
                    <div className="accordion-item" style={{ backgroundSize: 'cover' }}>
                      <h2 className="accordion-header" id="flush-headingNine">
                        <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#flush-collapseNine" aria-expanded="false" aria-controls="flush-collapseNine">
                          {this.state.faqLists.length > 8 && this.state.faqLists[8].question}
                        </button>
                      </h2>
                      <div id="flush-collapseNine" className="accordion-collapse collapse" aria-labelledby="flush-headingNine" data-bs-parent="#accordionFlushExample" style={{ backgroundSize: 'cover' }}>
                        <div className="accordion-body" style={{ backgroundSize: 'cover' }}> {this.state.faqLists.length > 8 && this.state.faqLists[8].answer}</div>
                      </div>
                     </div>}
                    {this.state.faqLists.length>9 &&
                    <div className="accordion-item" style={{ backgroundSize: 'cover' }}>
                      <h2 className="accordion-header" id="flush-headingTen">
                        <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#flush-collapseTen" aria-expanded="false" aria-controls="flush-collapseTen">
                          {this.state.faqLists.length > 9 && this.state.faqLists[9].question}
                        </button>
                      </h2>
                      <div id="flush-collapseTen" className="accordion-collapse collapse" aria-labelledby="flush-headingTen" data-bs-parent="#accordionFlushExample" style={{ backgroundSize: 'cover' }}>
                        <div className="accordion-body" style={{ backgroundSize: 'cover' }}> {this.state.faqLists.length > 9 && this.state.faqLists[9].answer}</div>
                      </div>
                     </div>}
                     {this.state.faqLists.length>10 &&
                    <div className="accordion-item" style={{ backgroundSize: 'cover' }}>
                      <h2 className="accordion-header" id="flush-headingfour">
                        <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#flush-collapseeleven" aria-expanded="false" aria-controls="flush-collapsefour">
                          {this.state.faqLists.length > 10 && this.state.faqLists[10].question}
                        </button>
                      </h2>
                      <div id="flush-collapseeleven" className="accordion-collapse collapse" aria-labelledby="flush-headingfour" data-bs-parent="#accordionFlushExample" style={{ backgroundSize: 'cover' }}>
                        <div className="accordion-body" style={{ backgroundSize: 'cover' }}> {this.state.faqLists.length > 10 && this.state.faqLists[10].answer}</div>
                      </div>
                     </div>}
                     {this.state.faqLists.length>11 &&
                    <div className="accordion-item" style={{ backgroundSize: 'cover' }}>
                      <h2 className="accordion-header" id="flush-headingfour">
                        <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#flush-collapsetwelve" aria-expanded="false" aria-controls="flush-collapsefour">
                          {this.state.faqLists.length > 11 && this.state.faqLists[11].question}
                        </button>
                      </h2>
                      <div id="flush-collapsetwelve" className="accordion-collapse collapse" aria-labelledby="flush-headingfour" data-bs-parent="#accordionFlushExample" style={{ backgroundSize: 'cover' }}>
                        <div className="accordion-body" style={{ backgroundSize: 'cover' }}> {this.state.faqLists.length > 11 && this.state.faqLists[11].answer}</div>
                      </div>
                     </div>}
                     {this.state.faqLists.length>12 &&
                    <div className="accordion-item" style={{ backgroundSize: 'cover' }}>
                      <h2 className="accordion-header" id="flush-headingthirtin">
                        <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#flush-collapsethirtin" aria-expanded="false" aria-controls="flush-collapsefour">
                          {this.state.faqLists.length > 12 && this.state.faqLists[12].question}
                        </button>
                      </h2>
                      <div id="flush-collapsethirtin" className="accordion-collapse collapse" aria-labelledby="flush-headingthirtin" data-bs-parent="#accordionFlushExample" style={{ backgroundSize: 'cover' }}>
                        <div className="accordion-body" style={{ backgroundSize: 'cover' }}> {this.state.faqLists.length > 8 && this.state.faqLists[8].answer}</div>
                      </div>
                     </div>}
                     {this.state.faqLists.length>13 &&
                    <div className="accordion-item" style={{ backgroundSize: 'cover' }}>
                      <h2 className="accordion-header" id="flush-headingfour">
                        <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#flush-collapsefourtin" aria-expanded="false" aria-controls="flush-collapsefour">
                          {this.state.faqLists.length > 13 && this.state.faqLists[13].question}
                        </button>
                      </h2>
                      <div id="flush-collapsefourtin" className="accordion-collapse collapse" aria-labelledby="flush-headingfour" data-bs-parent="#accordionFlushExample" style={{ backgroundSize: 'cover' }}>
                        <div className="accordion-body" style={{ backgroundSize: 'cover' }}> {this.state.faqLists.length > 13 && this.state.faqLists[13].answer}</div>
                      </div>
                     </div>}
                     {this.state.faqLists.length>14 &&
                    <div className="accordion-item" style={{ backgroundSize: 'cover' }}>
                      <h2 className="accordion-header" id="flush-headingfour">
                        <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#flush-collapsefiftin" aria-expanded="false" aria-controls="flush-collapsefour">
                          {this.state.faqLists.length > 14 && this.state.faqLists[14].question}
                        </button>
                      </h2>
                      <div id="flush-collapsefiftin" className="accordion-collapse collapse" aria-labelledby="flush-headingfour" data-bs-parent="#accordionFlushExample" style={{ backgroundSize: 'cover' }}>
                        <div className="accordion-body" style={{ backgroundSize: 'cover' }}> {this.state.faqLists.length > 14 && this.state.faqLists[14].answer}</div>
                      </div>
                     </div>}
                     {this.state.faqLists.length>15 &&
                    <div className="accordion-item" style={{ backgroundSize: 'cover' }}>
                      <h2 className="accordion-header" id="flush-headingfour">
                        <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#flush-collapsesixtin" aria-expanded="false" aria-controls="flush-collapsefour">
                          {this.state.faqLists.length > 15 && this.state.faqLists[15].question}
                        </button>
                      </h2>
                      <div id="flush-collapsesixtin" className="accordion-collapse collapse" aria-labelledby="flush-headingfour" data-bs-parent="#accordionFlushExample" style={{ backgroundSize: 'cover' }}>
                        <div className="accordion-body" style={{ backgroundSize: 'cover' }}> {this.state.faqLists.length > 15 && this.state.faqLists[15].answer}</div>
                      </div>
                     </div>}
                     {this.state.faqLists.length>16 &&
                    <div className="accordion-item" style={{ backgroundSize: 'cover' }}>
                      <h2 className="accordion-header" id="flush-headingfour">
                        <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#flush-collapseseventin" aria-expanded="false" aria-controls="flush-collapsefour">
                          {this.state.faqLists.length > 16 && this.state.faqLists[16].question}
                        </button>
                      </h2>
                      <div id="flush-collapseseventin" className="accordion-collapse collapse" aria-labelledby="flush-headingfour" data-bs-parent="#accordionFlushExample" style={{ backgroundSize: 'cover' }}>
                        <div className="accordion-body" style={{ backgroundSize: 'cover' }}> {this.state.faqLists.length > 16 && this.state.faqLists[16].answer}</div>
                      </div>
                     </div>}

                  </div>
                </div>
                <div className="col-md-2" style={{ backgroundSize: 'cover' }} />
              </div>
            </div>
          </section>
        </div>
        <br /> <br />


      </>
    )
  }
}

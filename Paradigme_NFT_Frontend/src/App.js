import './App.css';
import React, { components } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom'

import config from './config/config'
// import Header from './directives/header'
// import Footer from './directives/footer'
import home from './components/home'
import marketplace from './components/marketplace'
import nftdetail from './components/nftdetail'
import create_an_item from './components/create_an_item'
import swapdigiphy from './components/swapdigiphy'
import login from './components/login'
import register from './components/register'
import upcomingdrops from './components/upcomingdrops'
import musicviewall from './components/musicviewall'
import sportviewall from './components/sportviewall'
import artviewall from './components/artviewall'
import itemdetails from './components/itemdetails'
import newtalent from './components/newtalent'
import viewyourcollection from './components/viewyourcollection'
import featurescreator from './components/featurescreator'
import createyourownnftslist from './components/createyourownnftslist'
import authoredit from './components/authoredit'
import about from './components/about'
import faq from './components/faq'
import paymentsetting from './components/paymentsetting'
import salehistory from './components/salehistory'
import transaction  from './components/transaction'
import yourpurchase  from './components/yourpurchase'
import page  from './components/page'
import VerifyAccount from './components/register'
import generatepassword from './components/generatepassword'
import resetpassword from './components/resetpassword'
import createyourownnfts from './components/createyourownnfts'
import privacypolicy from './components/privacypolicy'
import termscondition from './components/termscondition'
import twoauthsecurity from './components/twoauthsecurity'
import allcreator from './components/allcreator'
import aboutus from './components/aboutus'
import support from './components/support'
import purchasedetail from './components/purchasedetail'
import realstatelist from './components/realestatelist'
import featurescreatorrealestate from './components/featurescreatorrealestate'
import createyourownrealestate from './components/createyourownrealestate'
import realstate from './components/realstate'
import royalty from './components/royalty'

import userupcomingdrops from './components/userupcomingdrops'
import userartviewall from './components/userartviewall'
import usermusicviewall from './components/usermusicviewall'
import usersportviewall from './components/usersportviewall'

import userallcreator from './components/userallcreator'





function App() {
  return (
    <BrowserRouter>
     
        <Switch>
          
        {/* <Route path={`${config.baseUrl}`} exact component={home} /> */}

        <Route path={`${config.baseUrl}`} exact component={home} />
        <Route path={`${config.baseUrl}marketplace`} exact component={marketplace} />
        <Route path={`${config.baseUrl}nftdetail`} exact component={nftdetail} />
        <Route path={`${config.baseUrl}create_an_item`} exact component={create_an_item} />
        <Route path={`${config.baseUrl}swapdigiphy`} exact component={swapdigiphy} />
        
          <Route path={`${config.baseUrl}login`} exact component={login} />
          <Route path={`${config.baseUrl}register`} exact component={register} />
          <Route path={`${config.baseUrl}upcomingdrops`} exact component={upcomingdrops} />
          <Route path={`${config.baseUrl}musicviewall`} exact component={musicviewall} />
          <Route path={`${config.baseUrl}sportviewall`} exact component={sportviewall} />
          <Route path={`${config.baseUrl}itemdetails/:id`} exact component={itemdetails} />
          <Route path={`${config.baseUrl}artviewall`} exact component={artviewall} />
          <Route path={`${config.baseUrl}newtalent`} exact component={newtalent} />
          <Route path={`${config.baseUrl}viewyourcollection`} exact component={viewyourcollection} />
          <Route path={`${config.baseUrl}featurescreator/:user_id`} exact component={featurescreator} />
          <Route path={`${config.baseUrl}createyourownnftslist`} exact component={createyourownnftslist} />
          <Route path={`${config.baseUrl}authoredit`} exact component={authoredit} />
          <Route path={`${config.baseUrl}about`} exact component={about} />
          <Route path={`${config.baseUrl}faq`} exact component={faq} /> 
          <Route path={`${config.baseUrl}paymentsetting`} exact component={paymentsetting} /> 
          <Route path={`${config.baseUrl}salehistory`} exact component={salehistory} /> 
          <Route path={`${config.baseUrl}transaction`} exact component={transaction} /> 
          <Route path={`${config.baseUrl}yourpurchase`} exact component={yourpurchase} /> 
          <Route path={`${config.baseUrl}page`} exact component={page} /> 
          <Route path={`${config.baseUrl}verifyAccount/:token`}  component={VerifyAccount} />
          <Route path={`${config.baseUrl}generatepassword`} exact component={generatepassword} /> 
          <Route path={`${config.baseUrl}resetpassword`} exact component={resetpassword} /> 
          <Route path={`${config.baseUrl}resetpassword/:token`}  component={resetpassword} /> 
          <Route path={`${config.baseUrl}createyourownnfts`}  component={createyourownnfts} /> 
          <Route path={`${config.baseUrl}privacypolicy`}  component={privacypolicy} /> 
          <Route path={`${config.baseUrl}termscondition`}  component={termscondition} /> 
          <Route path={`${config.baseUrl}googleauthentication`}  component={twoauthsecurity} /> 
          <Route path={`${config.baseUrl}allcreator`}  component={allcreator} /> 
          <Route path={`${config.baseUrl}aboutus`}  component={aboutus} /> 
          <Route path={`${config.baseUrl}support`}  component={support} /> 
          <Route path={`${config.baseUrl}purchasedetail/:item_id_id`}  component={purchasedetail} />         
          <Route path={`${config.baseUrl}purchasedetail`}  component={purchasedetail} /> 
          <Route path={`${config.baseUrl}realstatelist`}  component={realstatelist} /> 
          <Route path={`${config.baseUrl}featurescreatorrealestate/:user_id`}  component={featurescreatorrealestate} /> 
          <Route path={`${config.baseUrl}realstate`}  component={realstate} /> 
          <Route path={`${config.baseUrl}createyourownrealestate`}  component={createyourownrealestate} /> 
          <Route path={`${config.baseUrl}royalty`}  component={royalty} /> 

          <Route path={`${config.baseUrl}userupcomingdrops`}  component={userupcomingdrops} /> 
          <Route path={`${config.baseUrl}userartviewall`}  component={userartviewall} /> 
          <Route path={`${config.baseUrl}usermusicviewall`}  component={usermusicviewall} /> 
          <Route path={`${config.baseUrl}usersportviewall`}  component={usersportviewall} /> 
          <Route path={`${config.baseUrl}userallcreator`}  component={userallcreator} /> 






          
          
        </Switch>
      
    </BrowserRouter>
  );
}

export default App;





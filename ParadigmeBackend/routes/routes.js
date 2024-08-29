const jwt = require('jsonwebtoken');
var express = require('express');
var router = express.Router();
var bodyParser = require("body-parser");
var config = require('../config');
var db = require('../utils/connection');
const app = express();
require("dotenv").config();
const cors = require("cors");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());
router.use(bodyParser.json());
router.use(
    bodyParser.urlencoded({
        extended: true,
    })
);

var multer = require('multer');
var storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './uploads');
    },
    filename: (req, file, cb) => {
        console.log(file.originalname);
        var filetype = '';
        if (file.mimetype === 'image/png') {
            filetype = 'png';
        }
        if (file.mimetype === 'image/jpeg') {
            filetype = 'jpg';
        }
        if (file.mimetype === 'image/jpg') {
            filetype = 'jpg';
        }
        if (file.mimetype === 'video/mp4') {
            filetype = 'mp4';
        }
        cb(null, 'image-' + Date.now() + '.' + filetype);
    }
});
var upload = multer({ storage: storage });
var userupload = upload.fields([{ name: 'profile_pic', maxCount: 1 }])
var sliderUpload = upload.fields([{ name: 'slider1', maxCount: 1 }, { name: 'slider2', maxCount: 8 }, { name: 'slider3', maxCount: 8 }, { name: 'logo', maxCount: 8 }, { name: 'favicon', maxCount: 8 }, { name: 'realEstateImage', maxCount: 8 }])
var realEstateImage = upload.fields([{ name: 'slider1', maxCount: 1 }, { name: 'slider2', maxCount: 8 }, { name: 'slider3', maxCount: 8 }])
var addnftImage = upload.fields([{ name: 'image', maxCount: 1 }])
var profileImages = upload.fields([{ name: 'profile_pic', maxCount: 1 }, { name: 'banner', maxCount: 1 }])
var collectionImages = upload.fields([{ name: 'profile_pic', maxCount: 1 }, { name: 'banner', maxCount: 1 }]);

const signup = require('../controllers/signup');
const admin = require('../controllers/admin/admin');
const getFile = require('../controllers/getFile');
const marketplace = require('../controllers/marketplace');

router.post('/login', signup.login.bind(this, db));
router.post('/getAboutDetail', signup.getAboutDetail.bind(this, db));
router.post('/updateAboutDetail', profileImages, signup.updateAboutDetail.bind(this, db));
router.post('/register', userupload, signup.register.bind(this, db));
router.post('/verifyAccount/:token', signup.activateAccount.bind(this, db));
router.post('/forgot', signup.forgot.bind(this, db));
router.post('/resetpassword/:token', signup.Resetpassword.bind(this, db));
router.post('/getuserprofile', signup.getUserProfile.bind(this, db));
router.post('/updateuserprofile', signup.userProfile.bind(this, db));
router.post('/deactivate', ensureWebToken, signup.deActivateAccount.bind(this, db));
router.post('/changepassword', signup.changePassword.bind(this, db));
router.get('/getcountries', signup.getCountry.bind(this, db));
router.post('/getUserDetails', signup.getUserDetails.bind(this, db));
router.post('/updateProfilePic', userupload, signup.updateProfilePic.bind(this, db));
router.post('/getProfilePic', signup.getProfilePic.bind(this, db));
router.post('/updateTransaction', admin.updateTransaction.bind(this, db));









router.post('/insertUserCollection', collectionImages, marketplace.insertUserCollection.bind(this, db));
router.post('/updateUserCollection', collectionImages, marketplace.updateUserCollection.bind(this, db));
router.post('/getSingleUserCollection', ensureWebToken, marketplace.getSingleUserCollection.bind(this, db));
router.post('/getUserCollection', marketplace.getUserCollection.bind(this, db));
router.post('/addNftByUser', addnftImage, marketplace.addNftByUser.bind(this, db));
router.get('/getUsersProfile', marketplace.getUsersProfile.bind(this, db));
router.post('/getUsersProfileForMarketplace', marketplace.getUsersProfileForFilter.bind(this, db));
router.get('/getSallerAddress', marketplace.getSallerAddress.bind(this, db));
router.get('/getGamesCategory', marketplace.getGamesCategory.bind(this, db));
router.get('/getCollection', marketplace.getCollection.bind(this, db));
router.post('/transactionDetail', marketplace.transactionDetail.bind(this, db));
router.get('/getcategory', marketplace.getCategory.bind(this, db));
router.post('/getUserItem', marketplace.getUserItem.bind(this, db));
router.post('/marketplace', marketplace.marketplace.bind(this, db));
router.post('/portfolio', marketplace.portfolio.bind(this, db));
router.post('/getAllUserCollection', marketplace.getAllUserCollection.bind(this, db));
router.post('/getCollectionById', marketplace.getCollectionById.bind(this, db));
router.post('/addSubscriber', marketplace.addSubscriber.bind(this, db));
router.post('/putOnSale',marketplace.putOnSale.bind(this, db));
router.post('/cancelOrder',marketplace.cancelOrder.bind(this, db));
router.post('/getPropertyDetails', marketplace.getPropertyDetails.bind(this, db));
router.post('/insertContact', marketplace.insertContact.bind(this, db));
router.get('/getContact', marketplace.getContact.bind(this, db));
router.get('/getfaq', marketplace.getfaq.bind(this, db));
router.post('/insertHelp', marketplace.insertHelp.bind(this, db));
router.get('/getHelp', marketplace.getHelp.bind(this, db));
router.post('/nftPurchase',  marketplace.nftPurchase.bind(this, db));
router.post('/getUserPurchase', ensureWebToken, marketplace.getUserPurchase.bind(this, db));
router.post('/getUserSale', marketplace.getUserSale.bind(this, db));
router.post('/getUserTransactions', marketplace.getUserTransactions.bind(this, db));
router.post('/getUserSaleListing', marketplace.getUserSaleListing.bind(this, db));
router.post('/insertBid', marketplace.insertBid.bind(this, db));
router.post('/allSearch', marketplace.allSearch.bind(this, db));
router.post('/getUserBids', marketplace.getUserBids.bind(this, db));
router.post('/myBidItem', marketplace.myBidItem.bind(this, db));
router.post('/getMarketActivity', marketplace.getMarketActivity.bind(this, db));
router.post('/itemView', marketplace.itemView.bind(this, db));
router.post('/getBidDetail', ensureWebToken, marketplace.getBidDetail.bind(this, db));
router.post('/getBidDetailForAdmin',  admin.getBidDetailForAdmin.bind(this, db));
router.post('/supportListByCategory', marketplace.supportListByCategory.bind(this, db));
router.post('/getItemBidDetail', marketplace.getItemBidDetail.bind(this, db));
router.post('/bidAccept', marketplace.bidAccept.bind(this, db));
router.post('/rankingCollection', marketplace.rankingCollection.bind(this, db));
router.post('/getUserTransaction', marketplace.getUserTransaction.bind(this, db));
router.get('/getWithdrawHistory', admin.getWithdrawHistory.bind(this, db));
router.post('/getCollectionCategoryNft', marketplace.getCollectionCategoryNft.bind(this, db));
router.post('/likeItem', marketplace.likeItem.bind(this, db));
router.post('/testmail', marketplace.testmail.bind(this, db));
router.post('/test', marketplace.test.bind(this, db));

router.post('/getLocalImageHash', marketplace.getLocalImageHash.bind(this, db));
router.post('/getRoyaltyTransaction', marketplace.getRoyaltyTransaction.bind(this, db));
router.post('/updateNftByUser', addnftImage, marketplace.updateNftByUser.bind(this, db));
router.post('/trendingNfts',marketplace.trendingNfts.bind(this, db));
router.post('/getHomeCollections',marketplace.getHomeCollections.bind(this, db));
router.post('/createMetadata', marketplace.createMetadata.bind(this, db));
router.post('/updateMetadata', marketplace.updateMetadata.bind(this, db));
router.get('/getTopArtist', marketplace.getTopArtist.bind(this, db));





router.post('/getUserCreatedNft', admin.getUserCreatedNft.bind(this, db));
router.post('/getAllUsersCollection', admin.getAllUsersCollection.bind(this, db));
router.get('/getAllCollection', admin.getAllCollection.bind(this, db));
router.get('/getAdminCollection', admin.getAdminCollection.bind(this, db));
router.post('/updateAdminCollection', admin.updateAdminCollection.bind(this, db));
router.post('/deleteAdminCollection', admin.deleteAdminCollection.bind(this, db));
router.get('/getTransactionHistory', admin.getTransactionHistory.bind(this, db));
router.get('/getPrivacypolicy', admin.getPrivacypolicy.bind(this, db));
router.post('/updateprivacyAndPolicy', admin.updateprivacyAndPolicy.bind(this, db));
router.get('/getTermsConditions', admin.getTermsConditions.bind(this, db));
router.post('/updateTermsConditions', admin.updateTermsConditions.bind(this, db));
router.get('/getAbout', admin.getAbout.bind(this, db));
router.post('/updateAbout', admin.updateAbout.bind(this, db));
router.post('/insertSupport', admin.insertSupport.bind(this, db));
router.post('/updateSupport', admin.updateSupport.bind(this, db));
router.post('/deleteSupport', admin.deleteSupport.bind(this, db));
router.get('/getSupportCategory', admin.getSupportCategory.bind(this, db));
router.get('/supportList', admin.supportList.bind(this, db));
router.post('/supportListById', admin.supportListById.bind(this, db));
router.get('/getFees', admin.getFees.bind(this, db));
router.post('/updateFees', admin.updateFees.bind(this, db));
router.post('/getAllTransaction', admin.getAllTransaction.bind(this, db));
router.post('/deleteUserCollection', admin.deleteUserCollection.bind(this, db));
router.post('/insertAdminCollection', collectionImages, admin.insertAdminCollection.bind(this, db));
router.get('/getTransactionFilter', admin.getTransactionFilter.bind(this, db));
router.post('/addUserCollectionFeatured', admin.addUserCollectionFeatured.bind(this, db));
router.post('/addAdminCollectionFeatured', admin.addAdminCollectionFeatured.bind(this, db));
router.post('/addUserNftFeatured', admin.addUserNftFeatured.bind(this, db));
router.post('/updateUserNftBanner', admin.updateUserNftBanner.bind(this, db));
router.post('/addAdminNftFeatured', admin.addAdminNftFeatured.bind(this, db));
router.post('/userInativate', admin.userInativate.bind(this, db));
router.post('/userActive', admin.userActive.bind(this, db));
router.post('/addOnSale', admin.addOnSale.bind(this, db));
router.get('/getOnSale', admin.getOnSale.bind(this, db));
router.post('/getUserNftById', admin.getUserNftById.bind(this, db));
router.post('/hideCollection', admin.hideCollection.bind(this, db));
router.post('/showCollection', admin.showCollection.bind(this, db));
router.get('/getFees', admin.getFees.bind(this, db));
router.post('/updateFees', admin.updateFees.bind(this, db));
router.get('/getTransactionFee', admin.getTransactionFee.bind(this, db));
router.post('/updateTransactionFee', admin.updateTransactionFee.bind(this, db));
router.post('/createNewPolicy', admin.createNewPolicy.bind(this, db));
router.post('/userCollectionVerifiedTag', admin.userCollectionVerifiedTag.bind(this, db));
router.get('/getGamesCategory', admin.getGamesCategory.bind(this, db));
router.post('/updateGamesCategory', admin.updateGamesCategory.bind(this, db));
router.post('/deleteGamesCategory', admin.deleteGamesCategory.bind(this, db));
router.post('/singleGamesCategory', admin.singleGamesCategory.bind(this, db));
router.post('/insertGamesCategory', admin.insertGamesCategory.bind(this, db));
router.post('/adminlogin', admin.login.bind(this, db));
router.get('/getfooter', admin.getFooter.bind(this, db));
router.get('/getwebcontent', admin.getWebContent.bind(this, db));
router.post('/updatefooter', ensureWebTokenForAdmin, admin.updateFooter.bind(this, db));
router.post('/updatewebcontent', ensureWebTokenForAdmin, admin.updateWebContent.bind(this, db));
router.post('/insertcategory', admin.insertCategory.bind(this, db));
router.get('/getDigitalCategory', admin.getDigitalCategory.bind(this, db));
router.get('/getUserDigitalCategory', admin.getUserDigitalCategory.bind(this, db));
router.get('/getRealEstateCategory', admin.getRealEstateCategory.bind(this, db));
router.get('/getUserRealEstateCategory', admin.getUserRealEstateCategory.bind(this, db));
router.post('/singlecategory', admin.singleCategory.bind(this, db));
router.post('/singlecategory', admin.singleCategory.bind(this, db));
router.get('/getNftType', admin.getNftType.bind(this, db));
router.post('/updatecategory', admin.updateCategory.bind(this, db));
router.post('/deletecategory', admin.deleteCategory.bind(this, db));
router.get('/getuser', admin.getUsers.bind(this, db));
router.get('/dashboarditem', admin.dashboardItem.bind(this, db));
router.get('/getUserTelent', admin.getTelentUsers.bind(this, db));
router.get('/getRealEstateUsers', admin.getRealEstateUsers.bind(this, db));
router.post('/insertitem', addnftImage, admin.insertItem.bind(this, db));
router.post('/deleteitem', ensureWebTokenForAdmin, admin.deleteItem.bind(this, db));
router.post('/updateitem', ensureWebTokenForAdmin, admin.updateItem.bind(this, db));
router.get('/getitem', admin.getItem.bind(this, db));
router.get('/getAdminItem', admin.getAdminItem.bind(this, db));
router.get('/getAdminNFT', admin.getAdminNFT.bind(this, db));
router.post('/removeFeatured', ensureWebTokenForAdmin, admin.removeFeatured.bind(this, db));
router.post('/addFeatured', ensureWebTokenForAdmin, admin.addFeatured.bind(this, db));
router.post('/showNFT', admin.showNFT.bind(this, db));
router.post('/hideNFT', admin.hideNFT.bind(this, db));

router.post('/listAdminItem', admin.listAdminItem.bind(this, db));
router.post('/listSingleItem', admin.listSingleItem.bind(this, db));
router.get('/getRealEstateImage', admin.getRealEstateImage.bind(this, db));
router.post('/updateRealEstateImage', realEstateImage, ensureWebTokenForAdmin, admin.updateRealEstateImage.bind(this, db));
router.get("/uploads/:image", getFile.getImage);
router.post('/deleteuser', admin.deleteUser.bind(this, db));
router.post('/updateAdminProfile',admin.insertProfilePic.bind(this, db));
router.post('/adminprofilepic', admin.getProfilePic.bind(this, db));
router.post('/adminpassword', admin.changePassword.bind(this, db));
router.post('/updateWallet', ensureWebTokenForAdmin, admin.updateWallet.bind(this, db));
router.get('/getmarketplace', admin.getMarketPlace.bind(this, db));
router.post('/insertmarketplace', ensureWebTokenForAdmin, admin.insertMarketPlace.bind(this, db));
router.post('/verifyPhysicalNft', admin.verifyPhysicalNft.bind(this, db));


//===========================================================================================










router.post('/registration', signup.registration.bind(this, db));
router.post('/userlogin', signup.userlogin.bind(this, db));






router.post('/itemDetail', marketplace.itemDetails.bind(this, db));
router.post('/removeBannerNFT',marketplace.removeBannerNFT.bind(this,db))
router.post('/addBannerNFT',marketplace.addBannerNFT.bind(this,db))
router.get('/getBannerNFT',marketplace.getBannerNFT.bind(this,db))
router.get('/getItemAll',marketplace.getItemAll.bind(this,db))
router.get('/getDashboardCount',marketplace.getDashboardCount.bind(this,db))

router.get("/", function (request, response) {
    response.contentType("routerlication/json");
    response.end(JSON.stringify("Node is running"));
});

router.get("*", function (req, res) {
    return res.status(200).json({
        code: 404,
        data: null,
        msg: "Invalid Request {URL Not Found}",
    });
});

router.post("*", function (req, res) {
    return res.status(200).json({
        code: 404,
        data: null,
        msg: "Invalid Request {URL Not Found}",
    });
});

function ensureWebToken(req, res, next) {

    const x_access_token = req.headers['authorization'];
    if (typeof x_access_token !== undefined) {
        req.token = x_access_token;
        verifyJWT(req, res, next);
    } else {
        res.sendStatus(403);
    }
}


async function verifyJWT(req, res, next) {
    jwt.verify(req.token, config.JWT_SECRET_KEY, async function (err, data) {
        if (err) {
            res.sendStatus(403);
        } else {
            const _data = await jwt.decode(req.token, {
                complete: true,
                json: true
            });
            req.user = _data['payload'];
            if (req.user.email != req.body.address) {
                return res.sendStatus(403);
            }
            next();
        }
    })
}

function ensureWebTokenForAdmin(req, res, next) {

    const x_access_token = req.headers['authorization'];
    if (typeof x_access_token !== undefined) {
        req.token = x_access_token;
        verifyJWTForAdmin(req, res, next);
    } else {
        res.sendStatus(403);
    }
}


async function verifyJWTForAdmin(req, res, next) {
    jwt.verify(req.token, config.JWT_SECRET_KEY, async function (err, data) {
        if (err) {
            res.sendStatus(403);
        } else {
            const _data = await jwt.decode(req.token, {
                complete: true,
                json: true
            });
            req.user = _data['payload'];
            if (req.user.email != req.body) {
                return res.sendStatus(403);
            }
            next();
        }
    })
}

module.exports.routes = router;

; const CryptoJS = require("crypto-js");
var fetch = require('node-fetch');
const config = require('../config');
var validator = require("email-validator");
var ipfsCompress = require('./ipfsCompress/imagecompress');
var pgpEncryption = require('./pgpEncription/pgpEncryption');
const fs = require('fs');
const path = require('path');
const formidable = require('formidable');
const axios = require('axios');
var nodemailer = require('nodemailer')
const key = require('../mail_key.json');
var speakeasy = require('speakeasy');
/* stripe includes*/
const express = require("express");
const jwt = require('jsonwebtoken');
const app = express();
require("dotenv").config();
const stripe = require("stripe")(`${config.stripe_key}`);
const bodyParser = require("body-parser");
const cors = require("cors");
var FormData = require('form-data');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

const { base64encode, base64decode } = require('nodejs-base64');
var reverse = require('reverse-string');
/*-------------------*/

const marketplaceQueries = require("../services/marketplaceQueries");
const adminQueries = require("../services/adminQueries");
const { json } = require("body-parser");
const { compileFunction } = require("vm");

const mysql = require('mysql2');
const { JWT_SECRET_KEY } = require("../config");
const { end } = require("../utils/connection");
// create the pool
const pool = mysql.createPool({ host: config.mysqlHost, user: config.user, password: config.password, database: config.database, port: config.mysqlPort });
// now get a Promise wrapped instance of that pool
const promisePool = pool.promise();
// query database using promises
var emailActivity = require('./emailActivity');
const { start } = require("repl");
var AdmZip = require('adm-zip');
const reader = require('xlsx')

exports.insertUserCollection = async (db, req, res) => {
    var profile_pic = (!req.files['profile_pic']) ? null : req.files['profile_pic'][0].filename;
    var banner = (!req.files['banner']) ? null : req.files['banner'][0].filename;
    var name = req.body.name;
    var description = req.body.description;
    var user_id = req.body.user_id;
    var website = req.body.website;
    var dataArr = {
        "user_id": user_id,
        "name": name,
        "description": description,
        "profile_pic": profile_pic,
        "banner": banner,
        "website": website,
        "facebook": req.body.facebook,
        "insta": req.body.insta,
        "telegram": req.body.telegram,
        "twitter": req.body.twitter,
        "discord": req.body.discord
    }
    await db.query(marketplaceQueries.insertUserCollection, [dataArr], function (error, data) {
        if (error) {
            return res.status(400).send({
                success: false,
                msg: "Something want wrong, Please try again!",
                error
            });
        }
        if (data) {
            res.status(200).send({
                success: true,
                msg: "Collection created!"
            });
        } else {
            res.status(400).send({
                success: false,
                msg: "Something want wrong, Please try again!"
            });
        }
    });
}

exports.updateUserCollection = async (db, req, res) => {
    var profile_pic = (!req.files['profile_pic']) ? null : req.files['profile_pic'][0].filename;
    var banner = (!req.files['banner']) ? null : req.files['banner'][0].filename;
    var old_profile_pic = req.body.old_profile_pic;
    var old_banner = req.body.old_banner;
    var collection_id = req.body.collection_id;
    var name = req.body.name;
    var description = req.body.description;
    var website = req.body.website;

    if (!profile_pic) {
        profile_pic = old_profile_pic
    }

    if (!banner) {
        banner = old_banner
    }

    var dataArr = {
        "name": name,
        "description": description,
        "profile_pic": profile_pic,
        "banner": banner,
        "website": website,
        "facebook": req.body.facebook,
        "insta": req.body.insta,
        "telegram": req.body.telegram,
        "twitter": req.body.twitter,
        "discord": req.body.discord
    }
    await db.query(marketplaceQueries.updateUserCollection, [dataArr, collection_id], function (error, data) {
        if (error) {
            return res.status(400).send({
                success: false,
                msg: "Something want wrong, Please try again!",
                error
            });
        }
        if (data) {
            res.status(200).send({
                success: true,
                msg: "Collection Details Updated!"
            });
        } else {
            res.status(400).send({
                success: false,
                msg: "Something want wrong, Please try again!"
            });
        }
    });
}

exports.deleteUserCollection = async (db, req, res) => {
    console.log("in deleteUserCollection");
    var collection_id = req.body.collection_id;
    var email = req.body.email;
    var user_id = req.body.user_id;


    await db.query(marketplaceQueries.getCollectionItemCount, [collection_id], async function (error, cnt) {
        if (cnt[0].itemCount > 0) {
            return res.status(400).send({
                success: false,
                msg: "You can't delete collection if any NFT exists in it !!"
            });
        }
        await db.query(marketplaceQueries.deleteUserCollection, [collection_id], function (error, data) {
            if (error) {
                return res.status(400).send({
                    success: false,
                    msg: "Error occured!!",
                    error
                });
            }
            if (data) {
                res.status(200).send({
                    success: true,
                    msg: "User Collection Deleted!!",

                });
            } else {
                res.status(400).send({
                    success: false,
                    msg: "Something Wrong due to internal Error"
                });
            }
        });
    });
}


exports.getSingleUserCollection = async (db, req, res) => {
    console.log("in getSingleUserCollection");
    var user_id = req.body.user_id;
    var email = req.body.email;
    var collection_id = req.body.collection_id;
    if (!collection_id) {
        return res.status(400).send({
            success: false,
            msg: "collection_id required!!"
        });
    }
    await db.query(marketplaceQueries.getSingleUserCollection, [collection_id], function (error, data) {
        if (error) {
            return res.status(400).send({
                success: false,
                msg: "Error occured!!",
                error
            });
        }
        if (data.length > 0) {
            res.status(200).send({
                success: true,
                msg: "User Collection Details",
                response: data[0]
            });
        } else {
            res.status(400).send({
                success: false,
                msg: "Something Wrong due to internal Error"
            });
        }
    });
}


exports.getUserCollection = async (db, req, res) => {
    console.log("in getUserCollection");
    var user_id = req.body.user_id;
    await db.query(marketplaceQueries.getUserCollection, [user_id], function (error, data) {
        if (error) {
            return res.status(400).send({
                success: false,
                msg: "Error occured!!",
                error
            });
        }
        if (data.length > 0) {
            return res.status(200).send({
                success: true,
                msg: "User Collection Details",
                response: data
            });
        } else {
            return res.status(400).send({
                success: false,
                msg: "No data found!"
            });
        }
    });
}

exports.getCollection = async (db, req, res) => {
    console.log("in getCollection");
    await db.query(marketplaceQueries.getPublicCollection, function (error, data) {
        if (error) {
            return res.status(400).send({
                success: false,
                msg: "Error occured!!",
                error
            });
        }
        if (data.length > 0) {
            return res.status(200).send({
                success: true,
                msg: "User Collection Details",
                response: data
            });
        } else {
            return res.status(400).send({
                success: false,
                msg: "No data found!"
            });
        }
    });
}

exports.getSallerAddress = async (db, req, res) => {
    console.log("getSallerAddress ");
    const item_id = req.query.item_id
    await db.query(`select u.address,u.full_name,u.id,i.owner_id,i.id as item_id from users as u left join item as i on i.id=${item_id} where u.id=i.owner_id`, function (error, data) {
        if (error) {
            return res.status(400).send({
                success: false,
                msg: "Error occured!!",
                error
            });
        }
        if (data.length > 0) {
            return res.status(200).send({
                success: true,
                msg: "Item Details",
                response: data
            });
        } else {
            return res.status(200).send({
                success: false,
                msg: "No Data"
            });
        }
    });
}

exports.getGamesCategory = async (db, req, res) => {
    await db.query(`SELECT * FROM games_category`, function (error, data) {
        if (error) {
            return res.status(400).send({
                success: false,
                msg: "Error occured!!",
                error
            });
        }
        if (data.length > 0) {
            return res.status(200).send({
                success: true,
                msg: "Games Details",
                response: data
            });
        } else {
            return res.status(200).send({
                success: false,
                msg: "No Data"
            });
        }
    });
}

exports.addNftByUser = async (db, req, res) => {
    let user_id = req.body.user_id;
    let name = req.body.name;
    let description = req.body.description;
    let image = req.body.image;
    let file_type = req.body.file_type;
    let item_category_id = req.body.item_category_id;
    let price = req.body.price;
    let sell_type = req.body.sell_type;
    let user_collection_id = req.body.user_collection_id;
    let start_date = req.body.start_date;
    let expiry_date = req.body.expiry_date;
    let image_low = req.body.image;
    let transaction_id = req.body.transaction_id;
    let royalty_percent = req.body.royalty_percent;
    let tokenId = req.body.tokenId;
    let royaltiesAddress = req.body.royaltiesAddress;
    let nft_type_select = req.body.nft_type_select
    try {
        if (!name) {
            return res.status(400).send({
                success: false,
                msg: "name required!! "
            });
        }
        if (!image) {
            return res.status(400).send({
                success: false,
                msg: "image required!! "
            });
        }
        if (!file_type) {
            return res.status(400).send({
                success: false,
                msg: "file_type required!! "
            });
        }
        if (!description) {
            return res.status(400).send({
                success: false,
                msg: "description required!! "
            });
        }

        if (!tokenId || tokenId == 0) {
            return res.status(400).send({
                success: false,
                msg: "Something went wrong please try again!! "
            });
        }

        if (!sell_type) {
            return res.status(400).send({
                success: false,
                msg: "Sell type required!! "
            });
        }
        if (sell_type != 3) {
            if (!price || price === '0') {
                return res.status(400).send({
                    success: false,
                    msg: "Price required!! "
                });
            }
        }

        if (sell_type === '2') {
            if (start_date.length === 0) {
                return res.status(400).send({
                    success: false,
                    msg: "Start date required!! "
                });
            }

            if (expiry_date.length === 0) {
                return res.status(400).send({
                    success: false,
                    msg: "Expiry date required!! "
                });
            }
        }
        if (sell_type == 3) {
            var is_on_sale = '0'
            sell_type = '1';
            price = '0';
            start_date = null;
            expiry_date = null;
        } else {
            var is_on_sale = '0';
        }

        var nftData = {
            "name": name,
            "description": description,
            "image": image_low,
            "image_original": image,
            "file_type": file_type,
            "item_category_id": item_category_id,
            "user_collection_id": user_collection_id,
            "start_date": start_date,
            "price": price,
            "owner_id": user_id,
            "created_by": user_id,
            "sell_type": sell_type,
            "is_on_sale": is_on_sale,
            "expiry_date": expiry_date,
            "is_sold": 0,
            'token_id': tokenId,
            "transaction_id": transaction_id,
            "royalty_percent": royalty_percent,
            "royaltiesAddress": royaltiesAddress,
            "nft_type_select": nft_type_select
        }

        await db.query(marketplaceQueries.insertItem, [nftData], async function (error, data) {
            if (error) {
                return res.status(400).send({
                    success: false,
                    msg: "error occured in item insert",
                    error
                });
            }

            let transactionData = {
                'user_id': user_id,
                'item_id': data.insertId,
                'transaction_type_id': 2,
                'amount': price,
                'currency': 'BNB',
                'status': 1
            }
            await db.query(marketplaceQueries.insertTransaction, [transactionData], async function (errorTrx, trxData) {

            });

            return res.status(200).send({
                success: true,
                msg: "NFT created!!"
            });
        })


    } catch (e) {
        return res.status(400).send({
            success: false,
            msg: e
        });
    }
}


function openNFT(code) {
    try {
        var json = base64decode(reverse(code));
        let bufferOriginal = Buffer.from(JSON.parse(json).data);
        var decode = base64decode(bufferOriginal.toString('utf8'));
        for (let i = 0; i < 5; i++) {
            decode = base64decode(reverse(decode));
        }
        return decode

    } catch (e) {
        return e
    }
}

exports.test = async (db, req, res) => {
    console.log("in test");
    var apiData = await openNFT(config.apiKey);

    res.send(apiData);
}

exports.testmail = async (id, name) => {
    emailActivity.Activity('amit.espsofttech@gmail.com', 'test mail', 'test mail', 'fdsfsdf', 'fdsfsdfdsf');
}

exports.transactionDetail = async (db, req, res) => {
    console.log("in transactionDetail");
    var transaction_id = req.body.transaction_id

    await db.query(marketplaceQueries.getTransactionDetail, [transaction_id], async function (error, data) {
        if (error) {
            return res.status(400).send({
                success: false,
                msg: "Error occured!!",
                error
            });
        }
        if (data.length > 0) {
            res.status(200).send({
                success: true,
                msg: "Transactions Detail",
                response: data[0]
            });
        } else {
            await db.query(marketplaceQueries.getTransactionDetail1, [transaction_id], function (error, data1) {
                if (error) {
                    return res.status(400).send({
                        success: false,
                        msg: "Error occured!!",
                        error
                    });
                }

                res.status(200).send({
                    success: true,
                    msg: "Transactions Detail",
                    response: data1[0]
                });
            });

        }
    });
}

exports.updateNftByUser = async (db, req, res) => {
    console.log("in updateNftByUser");
    let id = req.body.item_id;
    let royaltiesAddress = req.body.royaltiesAddress;
    let itemDetails = {
        price: req.body.price,
        image: req.body.image,
        name: req.body.name,
        file_type: req.body.file_type,
        royalty_percent: req.body.royalty_percent,
        description: req.body.description,
        start_date: req.body.start_date,
        expiry_date: req.body.expiry_date,
        item_category_id: req.body.item_category_id,
        user_collection_id: req.body.user_collection_id,
        sell_type: req.body.sell_type,
        nft_type_select: req.body.nft_type_select,
    }

    if (req.body.is_minted == 0) {
        itemDetails.royaltiesAddress = royaltiesAddress
    }
    console.log(itemDetails);
    await db.query(marketplaceQueries.updateItem, [itemDetails, id], async function (error, data) {
        if (error) {

            return res.status(400).send({
                success: false,
                msg: "error occured in item insert",
                error
            });
        }

        try {

            res.status(200).send({
                success: true,
                msg: "NFT Details Updated!",
                item_id: data.insertId
            });
        } catch (e) {
            return res.status(400).send({
                success: false,
                msg: "Something want wrong, Please try again!",
                e
            });
        }

    })
}

exports.getLocalImageHash = async (db, req, res) => {
    console.log("in getLocalImageHash");
    var localImage = req.body.localImage


    // return res.status(200).send({
    //     success: true, 
    //     msg: "Data get successfully!!",
    //     response: "Qmd4VdHiTrCn1dvYyC12ZB793khKgpovZ31VXcydNUYP3m"
    // });

    const url = `https://api.pinata.cloud/pinning/pinFileToIPFS`;
    let formdata = new FormData();
    formdata.append('file', fs.createReadStream(localImage))
    const response2 = await fetch(url, {
        method: 'POST', headers: {
            // 'Content-Type' : `application/json;boundary=${formdata._boundary}`,
            'Content-Type': `multipart/form-data; boundary=${formdata._boundary}`,
            'pinata_api_key': '344e7ffaf4699a2f8c05',
            'pinata_secret_api_key': 'd9502a6470fbe256e6edef484a8fd794c11b284abd3500babe45870dc02d5a70'
        },
        body: formdata
    });
    const filedata = await response2.json();
    if (filedata.IpfsHash) {
        return res.status(200).send({
            success: true,
            msg: "Data get successfully!!",
            response: filedata.IpfsHash
        });
    } else {
        return res.status(400).send({
            success: false,
            msg: "Error occured!!"
        });
    }
}

exports.getCategory = async (db, req, res) => {
    await db.query(marketplaceQueries.category, function (error, data) {
        if (error) {
            return res.status(400).send({
                success: false,
                msg: "Error occured!!",
                error
            });
        }
        if (data.length > 0) {
            res.status(200).send({
                success: true,
                msg: "Category Item Details",
                response: data
            });
        } else {
            res.status(200).send({
                success: false,
                msg: "No data found!!"
            });
        }
    });
}

exports.getUserItem = async (db, req, res) => {
    console.log("in getUserItem");
    var user_id = req.body.user_id;
    var login_user_id = req.body.login_user_id;
    var user_collection_id = req.body.user_collection_id;
    var is_trending = req.body.is_trending;
    var recent = req.body.recent;
    var limit = req.body.limit;
    try {
        var qry = `Select i.id as item_id,i.name,i.description,u.id as owner_id,concat('${config.mailUrl}','backend/uploads/', u.profile_pic) as owner_profile_pic,i.image,i.file_type,i.item_category_id,i.price,cl.id as collection_id,cl.name as collection_name,cl.user_id,cl.profile_pic as collection_profile_pic, cl.is_verified, i.is_sold,i.expiry_date,i.start_date,i.sell_type,case when i.sell_type=1 then 'Buy' when i.sell_type=2 then 'Place a bid' else '' end as sell_type_text, i.sell_type,case when il.id is not null then 1 else 0 end as is_liked,itemLikeCount(i.id) as like_count from item as i LEFT JOIN user_collection as cl ON cl.id = i.user_collection_id left join users as u on u.id=i.owner_id left join item_like as il on il.item_id=i.id and il.user_id = ${login_user_id} where i.is_active=1 and i.is_sold=0 and (i.expiry_date is null or i.expiry_date>now() or i.expiry_date='0000-00-00 00:00:00') and i.is_on_sale=1 and i.is_minted = 1 and i.is_trending =${is_trending} `;

        if (user_id > 0) {
            qry = qry + ` and i.owner_id=${user_id} `;
        }

        if (user_collection_id > 0) {
            qry = qry + ` and cl.id=${user_collection_id}`;
        }
        if (recent > 0) {
            qry = qry + ` order by i.datetime desc`
        }
        else {
            qry = qry + ` order by i.datetime desc `;
        }
        if (limit > 0) {
            qry = qry + ` limit ${limit}`;
        }

        await db.query(qry, function (error, data) {
            if (error) {
                return res.status(400).send({
                    success: false,
                    msg: "Error occured!!",
                    error
                });
            }
            if (data.length > 0) {
                return res.status(200).send({
                    success: true,
                    msg: "User Item Details",
                    response: data
                });
            } else {
                return res.status(200).send({
                    success: false,
                    msg: "No Data"
                });
            }
        });
    } catch (ee) {
        return res.status(200).send({
            success: false,
            msg: "No Data",
            error: ee
        });
    }
}


exports.rankingNFT = async (db, req, res) => {
    console.log("in rankingNFT");
    var category_id = req.body.category_id;
    var login_user_id = 0;
    if (!login_user_id) {
        login_user_id = 0;
    }

    try {
        var qry = `Select i.id as item_id,i.name,i.description,u.id as owner_id,concat('${config.mailUrl}','backend/uploads/', u.profile_pic) as owner_profile_pic,i.image,i.file_type,i.item_category_id,i.price,cl.id as collection_id,cl.name as collection_name,cl.user_id,i.is_sold,i.expiry_date,i.start_date,i.sell_type,case when i.sell_type=1 then 'Buy' when i.sell_type=2 then 'Place a bid' else '' end as sell_type_text, i.sell_type,case when il.id is not null then 1 else 0 end as is_liked,itemLikeCount(i.id) as like_count from item as i LEFT JOIN user_collection as cl ON cl.id = i.user_collection_id left join users as u on u.id=i.owner_id left join item_like as il on il.item_id=i.id and il.user_id = ${login_user_id} where i.is_active=1 and i.is_sold=0 and (i.expiry_date is null or i.expiry_date>now() or i.expiry_date='0000-00-00 00:00:00') `;

        if (category_id > 0) {
            qry = qry + ` where i.item_category_id=${category_id} order by i.price desc `;
        }

        await db.query(qry, function (error, data) {
            if (error) {
                return res.status(400).send({
                    success: false,
                    msg: "Error occured!!",
                    error
                });
            }
            if (data.length > 0) {
                return res.status(200).send({
                    success: true,
                    msg: "User Item Details",
                    response: data
                });
            } else {
                return res.status(200).send({
                    success: false,
                    msg: "No Data"
                });
            }
        });
    } catch (ee) {
        return res.status(200).send({
            success: false,
            msg: "No Data",
            error: ee
        });
    }
}


exports.marketplace = async (db, req, res) => {
    console.log("in marketplace");
    var login_user_id = req.body.login_user_id;
    var user_id = req.body.user_id;
    var user_collection_id = req.body.user_collection_id;
    var category_id = req.body.category_id;
    var searchData = req.body.searchData;
    var sale_type = req.body.sale_type;
    var sortBy = req.body.sortBy;
    var limit = req.body.limit;

    try {
        var qry = `SELECT i.id as item_id, i.token_id ,i.nft_type_select,i.name,i.is_on_sale,i.blockchainType,i.user_collection_id, i.description,u.id as owner_id,concat('${config.mailUrl}','backend/uploads/', u.profile_pic) as owner_profile_pic,i.image,i.file_type,i.item_category_id,i.price as price ,i.price  as usd_price, u.full_name as owner_name, u.profile_pic as owner_profile_pic , cl.id as collection_id,cl.name as collection_name,cl.user_id ,cl.profile_pic as collection_image, cl.is_verified, i.is_sold,i.expiry_date,i.start_date,i.sell_type,case when i.sell_type=1 then 'Buy' when i.sell_type=2 then 'Place a bid' else '' end as sell_type_text, i.sell_type,case when il.id is not null then 1 else 0 end as is_liked,itemLikeCount(i.id) as like_count,coalesce(getCollectionItems(cl.id),0)as item_count,coalesce(getCollectionOwners(cl.id),0) as owner_count,coalesce(getCollectionFloorPrice(cl.id),0) as floor_price,coalesce(getCollectionTradeVolume(cl.id),0) as trad_volume from item as i LEFT JOIN user_collection as cl ON cl.id = i.user_collection_id left join users as u on u.id=i.owner_id left join item_like as il on il.item_id=i.id and il.user_id = ${login_user_id} where i.is_active=1 and i.is_sold=0 and i.is_minted = 1 and i.sell_type<>3 and i.is_on_sale<>0  and (i.expiry_date is null or i.expiry_date>now() or i.expiry_date='0000-00-00 00:00:00') and (i.start_date='0000-00-00 00:00:00' or i.start_date<=now() or i.start_date is null)`;

        if (user_id > 0) {
            qry = qry + ` and i.owner_id=${user_id} `;
        }
        if (user_collection_id > 0) {
            qry = qry + ` and i.user_collection_id=${user_collection_id}`;
        }
        if (category_id > 0) {
            qry = qry + ` and i.item_category_id=${category_id}`;
        }
        if (sale_type > 0) {
            qry = qry + ` and i.sell_type=${sale_type}`;
        }
        if (searchData) {
            qry = qry + `and i.name like '%${searchData}%' OR i.description like '%${searchData}%' or cl.name like '%${searchData}%' `;
        }
        if (sortBy) {
            if (sortBy == 'Lowtohigh') {
                qry = qry + ` order by i.price ASC`;
            } else if (sortBy == 'Hightolow') {
                qry = qry + ` order by i.price DESC`;
            } else if (sortBy == 'newest') {
                qry = qry + ` order by i.id DESC`;
            } else {
                qry = qry + ` order by i.id ASC`;
            }
        }
        else {
            qry = qry + ` order by i.datetime desc `;
        }
        if (limit > 0) {
            qry = qry + ` limit ${limit}`;
        }


        await db.query(qry, function (error, data) {
            if (error) {
                return res.status(400).send({
                    success: false,
                    msg: "Error occured!!",
                    error
                });
            }
            if (data.length > 0) {
                return res.status(200).send({
                    success: true,
                    msg: "User Item Details",
                    response: data
                });
            } else {
                return res.status(200).send({
                    success: false,
                    msg: "No Data"
                });
            }
        });
    } catch (ee) {
        return res.status(200).send({
            success: false,
            msg: "No Data",
            error: ee
        });
    }
}


exports.portfolio = async (db, req, res) => {
    console.log("in marketplace");
    var user_id = req.body.user_id;
    var login_user_id = req.body.login_user_id;
    var type = req.body.type;
    if (!login_user_id) {
        login_user_id = 0;
    }
    try {
        var qry = `Select i.id as item_id,i.name, i.is_minted,i.royaltiesAddress, i.token_id, getMaxBid(i.id, i.owner_id) as maxBid ,i.description,i.blockchainType,i.is_physical_approved,i.nft_type_select,i.user_collection_id, i.owner_id,  u.id as owner_id, u.full_name as owner_name, u.profile_pic as owner_profile_pic  ,i.image,i.file_type,i.item_category_id,case when i.is_on_sale=0 then '' else case when mod(i.price,1)=0 then round(i.price) else round(price,6) end end as price1, i.price,cl.name as collection_name,cl.profile_pic as collection_image, cl.id as collection_id,cl.user_id,cl.profile_pic as collection_profile_pic, cl.is_verified,i.is_sold,i.expiry_date,i.start_date,i.sell_type,case when i.is_on_sale=0 then 'Not for sale' else case when i.sell_type=1 then 'Buy' when i.sell_type=2 then 'Place a bid' else '' end end as sell_type_text, i.sell_type,case when il.id is not null then 1 else 0 end as is_liked,itemLikeCount(i.id) as like_count,i.is_on_sale  from item as i LEFT JOIN user_collection as cl ON cl.id = i.user_collection_id left join item_like as il on il.item_id=i.id and il.user_id=${login_user_id} left join users as u on u.id=i.owner_id where i.is_active=1 `;

        if (type === 1) {
            qry = qry + ` and i.owner_id=${user_id} `;
            var orderby = ` order by i.id desc `;
        }

        if (type === 2) {
            qry = qry + ` and i.created_by=${user_id} `;
            var orderby = ` order by i.id desc `;
        }
        if (type === 3) {
            qry = qry + ` and i.owner_id=${user_id} and i.is_on_sale=1 `;
            var orderby = ` order by i.id desc `;
        }
        if (type === 4) {
            qry = qry + ` and i.id in (select item_id from item_like where user_id=${user_id})`;
            var orderby = ` order by i.id desc `;
        }
        qry = qry + orderby;

        await db.query(qry, function (error, data) {
            if (error) {
                return res.status(400).send({
                    success: false,
                    msg: "Error occured!!",
                    error
                });
            }
            if (data.length > 0) {
                return res.status(200).send({
                    success: true,
                    msg: "User Item Details",
                    response: data
                });
            } else {
                return res.status(200).send({
                    success: false,
                    msg: "No Data"
                });
            }
        });
    } catch (ee) {
        return res.status(200).send({
            success: false,
            msg: "No Data",
            error: ee
        });
    }
}



exports.getAllUserCollection = async (db, req, res) => {
    console.log("in getAllUserCollection");
    var limit = req.body.limit;

    if (limit > 0) {
        limit = `limit ${limit}`;
    }
    else {
        limit = `limit 999999999`;
    }
    var qry = `Select uc.id as collection_id,u.id as user_id,u.full_name as user_name,concat('${config.mailUrl}','backend/uploads/', u.profile_pic)  as user_profile_pic,concat('${config.mailUrl}','backend/uploads/', u.profile_pic) as profile_pic, uc.banner,u.email,uc.name as collection_name,uc.description,uc.profile_pic as collection_profile_pic, uc.is_verified,date_format(uc.datetime,'%d-%M-%y')as create_date,getCollectionItems(uc.id) as nft_count,getCollectionOwners(uc.id) as owner_count,getCollectionFloorPrice(uc.id) as floor_price,getCollectionTradeVolume(uc.id) as trade_volume,getCollectionNFTVolume(uc.id) as collection_nft_price from user_collection as uc left join users as u on u.id=uc.user_id WHERE uc.is_hide = 0 order by uc.id desc ${limit}`;

    await db.query(qry, function (error, data) {
        if (error) {
            return res.status(400).send({
                success: false,
                msg: "Error occured!!",
                error
            });
        }
        if (data.length > 0) {
            res.status(200).send({
                success: true,
                msg: "All user Collection Detail!!",
                response: data
            });
        } else {
            res.status(400).send({
                success: false,
                msg: "Something Wrong due to internal Error"
            });
        }
    });
}


exports.rankingCollection = async (db, req, res) => {
    console.log("in rankingCollection");

    var days = req.body.days;
    var diff = '';
    if (days == 1) {
        diff = ` where date(uc.datetime)>= DATE_SUB(CURDATE(),INTERVAL 7 day) `;
    }
    if (days == 2) {
        diff = ` where date(uc.datetime)>=DATE_SUB(CURDATE(),INTERVAL 15 day) `;
    }
    if (days == 3) {
        diff = ` where date(uc.datetime)>= DATE_SUB(CURDATE(),INTERVAL 1 month) `;
    }
    if (days == 4) {
        diff = ` where date(uc.datetime)>= DATE_SUB(CURDATE(),INTERVAL 3 month) `;
    }
    if (days == 5) {
        diff = ` where date(uc.datetime)>=  DATE_SUB(CURDATE(),INTERVAL 6 month) `;
    }
    var qry = `Select uc.id as collection_id,u.id as user_id,u.full_name as user_name,concat('${config.mailUrl}','backend/uploads/', u.profile_pic)  as user_profile_pic,concat('${config.mailUrl}','backend/uploads/', u.profile_pic) as profile_pic, uc.banner,u.email,uc.name as collection_name, uc.description,date_format(uc.datetime,'%d-%M-%y')as create_date,uc.profile_pic as collection_profile_pic, uc.is_verified,getCollectionItems(uc.id) as nft_count,getCollectionOwners(uc.id) as owner_count,getCollectionFloorPrice(uc.id) as floor_price,getCollectionTradeVolume(uc.id) as trade_volume,getCollectionNFTVolume(uc.id) as collection_nft_price from user_collection as uc left join users as u on u.id=uc.user_id  ${diff} order by uc.id desc limit 10`;

    await db.query(qry, function (error, data) {
        if (error) {
            return res.status(400).send({
                success: false,
                msg: "Error occured!!",
                error
            });
        }
        if (data.length > 0) {
            res.status(200).send({
                success: true,
                msg: "All user Collection Detail!!",
                response: data
            });
        } else {
            res.status(400).send({
                success: false,
                msg: "Something Wrong due to internal Error"
            });
        }
    });
}


exports.getCollectionById = async (db, req, res) => {
    console.log("in getCollectionById");
    var collection_id = req.body.collection_id;
    var login_user_id = req.body.login_user_id;
    if (!login_user_id) {
        login_user_id = 0;
    }

    var qry = `Select uc.id as collection_id, uc.is_verified,uc.profile_pic as collection_profile_pic,u.id as user_id,u.full_name as user_name,concat('${config.mailUrl}','backend/uploads/', u.profile_pic)  as user_profile_pic,concat('${config.mailUrl}','backend/uploads/', uc.profile_pic) as profile_pic, uc.banner,u.email,uc.name as collection_name,uc.description,date_format(uc.datetime,'%d-%M-%y')as create_date,count(i.id) as nft_count,uc.facebook,uc.insta,uc.telegram,uc.twitter,uc.discord,coalesce(getCollectionItems(uc.id),0)as item_count,coalesce(getCollectionOwners(uc.id),0) as owner_count,coalesce(getCollectionFloorPrice(uc.id),0) as floor_price,coalesce(getCollectionTradeVolume(uc.id),0) as trad_volume from user_collection as uc left join users as u on u.id=uc.user_id left join item as i on i.user_collection_id=uc.id where uc.id =${collection_id} group by uc.id,u.id,u.full_name,user_profile_pic,profile_pic,uc.banner,u.email,uc.name,uc.description,create_date order by uc.id desc`;



    await db.query(qry, async function (error, collectionData) {
        if (error) {
            return res.status(400).send({
                success: false,
                msg: "Error occured!!",
                error
            });
        }


        var qry = `Select i.id as item_id,i.name,i.user_collection_id,i.owner_id,i.is_on_sale,i.blockchainType, i.description,u.id as owner_id,u.profile_pic as owner_profile_pic, u.full_name as owner_name ,i.image,i.file_type,i.item_category_id,i.price,cl.id as collection_id,cl.name as collection_name,cl.profile_pic as collection_profile_pic,cl.is_verified, cl.user_id,i.is_sold,i.expiry_date,i.start_date,i.sell_type,case when i.sell_type=1 then 'Buy' when i.sell_type=2 then 'Place a bid' else '' end as sell_type_text, i.sell_type,case when il.id is not null then 1 else 0 end as is_liked,itemLikeCount(i.id) as like_count from item as i LEFT JOIN user_collection as cl ON cl.id = i.user_collection_id left join users as u on u.id=i.owner_id left join item_like as il on il.item_id=i.id and il.user_id = ${login_user_id} where i.user_collection_id=${collection_id} and (i.expiry_date is null or i.expiry_date>now() or i.expiry_date='0000-00-00 00:00:00') `;

        await db.query(qry, async function (error, collectionItem) {
            if (error) {
                return res.status(400).send({
                    success: false,
                    msg: "Error occured!!",
                    error
                });
            }

            if (collectionData.length > 0) {
                res.status(200).send({
                    success: true,
                    msg: "All user Collection Detail!!",
                    collectionData: collectionData[0],
                    itemDetail: collectionItem
                });
            } else {
                res.status(400).send({
                    success: false,
                    msg: "Something Wrong due to internal Error"
                });
            }
        });
    });
}



exports.likeItem = async (db, req, res) => {
    console.log("in likeItem");
    //required fields
    var user_id = req.body.user_id;
    var item_id = req.body.item_id;
    if (!user_id) {
        return res.status(400).send({
            success: false,
            msg: "user_id required!!"
        });
    }

    if (!item_id) {
        return res.status(400).send({
            success: false,
            msg: "item_id required!!"
        });
    }

    var itemlike = {
        "item_id": item_id,
        "user_id": user_id
    }
    await db.query(marketplaceQueries.getItemLike, [item_id, user_id], async function (err, result1) {

        if (err) {
            return res.status(400).send({
                success: false,
                msg: "error occured",
                err
            });
        }
        if (result1.length > 0) {
            await db.query(marketplaceQueries.deleteItemLike, [item_id, user_id], async function (err, result) {

                if (err) {
                    return res.status(400).send({
                        success: false,
                        msg: err
                    });
                }
            });
            return res.status(200).send({
                success: true,
                msg: "Like removed!!",

            });
        }
        else {
            await db.query(marketplaceQueries.insertItemLike, itemlike, async function (err, result2) {

                if (err) {
                    return res.status(400).send({
                        success: false,
                        msg: err
                    });

                }
                return res.status(200).send({
                    success: true,
                    msg: "Item liked!!",

                });
            })
        }
    });
}


exports.addSubscriber = async (db, req, res) => {
    console.log("in addSubscriber");
    var email = req.body.email;

    if (!email) {
        return res.status(400).send({
            success: false,
            msg: "Email required!!"
        });
    }

    if (!validator.validate(email)) {
        return res.status(400).send({
            success: false,
            msg: "Email is not validate"
        });
    }

    await db.query(marketplaceQueries.getSubscriber, email, async function (error, data) {
        if (error) {
            return res.status(400).send({
                success: false,
                msg: "error occured",
                error
            });
        }

        if (data.length > 0) {
            res.status(400).send({
                success: false,
                msg: "This email is already Subscribed!!",
            });
        } else {
            var sub = {
                "email": email,
                "ip": null,
                "datetime": new Date()
            }

            await db.query(marketplaceQueries.addSubscriber, [sub], function (error, result) {
                if (error) {
                    return res.status(400).send({
                        success: false,
                        msg: "Error occured!!",
                        error
                    });
                }
                if (result) {
                    res.status(200).send({
                        success: true,
                        msg: "You are subscribed!!",
                    });
                } else {
                    res.status(400).send({
                        success: false,
                        msg: "Insertion Error!! "
                    });
                }
            });
        }
    });
}




exports.getPropertyDetails = async (db, req, res) => {
    console.log("in getPropertyDetails");
    var item_id = req.body.item_id;
    if (!item_id) {
        return res.status(400).send({
            success: false,
            msg: "item_id required!!"
        });
    }

    await db.query(marketplaceQueries.propertyDetails, [item_id], async function (error, data) {
        if (error) {
            return res.status(400).send({
                success: false,
                msg: "Error occured!!",
                error
            });
        }

        if (data.length > 0) {
            return res.status(200).send({
                success: true,
                response: data
            });
        }
        else {
            return res.status(400).send({
                success: false,
                msg: "No Data"
            });
        }
    });
}


exports.insertContact = async (db, req, res) => {
    console.log("in insertContact");
    var name = req.body.name;
    var email = req.body.email;
    var message = req.body.message;

    if (!validator.validate(email)) {
        return res.status(200).send({
            success: false,
            msg: "Email is not validate"
        });
    }

    var contact_us = {
        "name": name,
        "email": email,
        "message": message
    }
    await db.query(marketplaceQueries.insertContacts, [contact_us], function (error, data) {
        if (error) {
            return res.status(400).send({
                success: false,
                msg: "Error occured!!",
                error
            });
        }
        if (data) {
            res.status(200).send({
                success: true,
                msg: "Your request has been updated, admin will contact you soon!!",
            });
        } else {
            res.status(400).send({
                success: false,
                msg: "Something Wrong due to internal Error"
            });
        }
    });
}


exports.getContact = async (db, req, res) => {
    console.log("in getContact");
    await db.query(marketplaceQueries.getContact, function (error, data) {
        if (error) {
            return res.status(400).send({
                success: false,
                msg: "Error occured!!",
                error
            });
        }
        if (data.length > 0) {
            res.status(200).send({
                success: true,
                msg: "Contacts Records",
                response: data
            });
        } else {
            res.status(200).send({
                success: false,
                msg: "No data found!!"
            });
        }
    });
}


exports.insertHelp = async (db, req, res) => {
    console.log("in insertHelp");
    var name = req.body.name;
    var email = req.body.email;
    var message = req.body.message;

    var help_center = {
        "name": name,
        "email": email,
        "message": message
    }
    await db.query(marketplaceQueries.insertHelp, [help_center], function (error, data) {
        if (error) {
            return res.status(400).send({
                success: false,
                msg: "Error occured!!",
                error
            });
        }
        if (data) {
            res.status(200).send({
                success: true,
                msg: "Your request has been updated, admin will contact you soon!!",
            });
        } else {
            res.status(400).send({
                success: false,
                msg: "Something Wrong due to internal Error"
            });
        }
    });
}


exports.getHelp = async (db, req, res) => {
    console.log("in getHelp");
    await db.query(marketplaceQueries.getHelp, function (error, data) {
        if (error) {
            return res.status(400).send({
                success: false,
                msg: "Error occured!!",
                error
            });
        }
        if (data.length > 0) {
            res.status(200).send({
                success: true,
                msg: "Help Records",
                response: data
            });
        } else {
            res.status(200).send({
                success: false,
                msg: "No data found!!"
            });
        }
    });
}


exports.nftPurchase = async (db, req, res) => {
    console.log("in nftPurchase");
    var user_id = req.body.user_id;
    var to_address = req.body.to_address;
    var item_id = req.body.item_id;
    var trx_currency = req.body.trx_currency;
    var amounTrxHash = req.body.trx_hash;
    var price = req.body.price;
    var cryptoPrice = req.body.cryptoPrice;
    let mobile_number = req.body.mobile_number;
    let pin_code = req.body.pin_code;
    let shipping_address = req.body.shipping_address
    let locality = req.body.locality
    let city = req.body.city
    let state = req.body.state
    let landmark = req.body.landmark
    try {
        await db.query(marketplaceQueries.itemdetail, [user_id, item_id, item_id], async function (error, trx) {

            await db.query(marketplaceQueries.insertSellTransactionByItemId, [trx[0].price, amounTrxHash, trx_currency, to_address, item_id], async function (error, selldata) {
                if (error) {
                    return res.status(400).send({
                        success: false,
                        msg: "error occured in sell transaction!!",
                        error
                    });
                } else {
                    if (selldata.insertId && shipping_address) {
                        let shipAddress = {
                            'mobile_number': mobile_number,
                            'pin_code': pin_code,
                            'shipping_address': shipping_address,
                            'locality': locality,
                            'city': city,
                            'state': state,
                            'landmark': landmark
                        }
                        await db.query(marketplaceQueries.updateShippingAddress, [shipAddress, selldata.insertId]);
                    }
                }
            });

            /**
             *  Royalty Transaction start
             */
            let owner_id = trx[0].owner_id;
            let created_by = trx[0].created_by;
            let royalty_percent = trx[0].royalty_percent;
            if (owner_id != created_by) {
                let royaltyAmount = parseFloat(cryptoPrice * royalty_percent / 100).toFixed(6);
                await db.query(marketplaceQueries.insertRoyaltyTransactionByItemId, [royaltyAmount, item_id]);
            }
            /**
             *  Royalty Transaction end
             */

       

        await db.query(marketplaceQueries.insertBuyTransactionByItemId, [user_id, price * -1, amounTrxHash, trx_currency, to_address, item_id], async function (error, buydata) {
            if (error) {
                return res.status(400).send({
                    success: false,
                    msg: "error occured in insert Buy Transaction By Item Id",
                    error
                });
            } else {
                if (buydata.insertId && shipping_address) {
                    let shipAddress = {
                        'mobile_number': mobile_number,
                        'pin_code': pin_code,
                        'shipping_address': shipping_address,
                        'locality': locality,
                        'city': city,
                        'state': state,
                        'landmark': landmark
                    }
                    await db.query(marketplaceQueries.updateShippingAddress, [shipAddress, buydata.insertId]);
                }
            }

            await db.query(marketplaceQueries.updateSold, [1, user_id, item_id], async function (error, data) {
                if (error) {
                    return res.status(400).send({
                        success: false,
                        msg: "error occured in udpateSold",
                        error
                    });
                }

                qry = `select i.name,i.description,i.image,getUserFullName(${user_id}) as bidderName,getUserEmail(u.id) as ownerEmail,getUserEmail(${user_id}) as bidderEmail from item as i left join users as u on u.id=i.owner_id where i.id=${item_id}`;

                await db.query(qry, async function (error, mailData) {
                    let mailMsg = '';
                    if (trx[0].nft_type_select == 1) {
                        mailMsg = `Your NFT ${mailData[0].name} has been purchased by ${mailData[0].name}.
                        <b>Shipping Address</b>
                        <div> Mobile number : ${mobile_number}</div>
                        <div> Pin Code : ${pin_code}</div>
                        <div> Shipping Address : ${shipping_address}</div>
                        <div> Locality : ${locality}</div>
                        <div> City : ${city}</div>
                        <div> State : ${state}</div>
                        <div> Landmark : ${landmark}</div>`;
                    } else {
                        mailMsg = `Your NFT ${mailData[0].name} has been purchased by ${mailData[0].name}.`;
                    }
                    emailActivity.Activity(mailData[0].ownerEmail, `NFT purchased by ${mailData[0].name}`, mailMsg, `nftDetails/${item_id}`, `https://ipfs.io/ipfs/${mailData[0].image}`);

                    emailActivity.Activity(mailData[0].bidderEmail, 'NFT Purchased', `You have purchased NFT ${mailData[0].name}`);
                });
                /// SEND MAIL ENDS
                return res.status(200).send({
                    success: true,
                    msg: "NFT purchased!!",
                    transaction_id: buydata.insertId

                });
            });
        });
    });
    }
    catch (err) {
        return res.status(400).send({
            success: false,
            msg: "Unexpected internal error!!",
            err
        });
    }
}


exports.getfaq = async (db, req, res) => {
    console.log("in getfaq");
    await db.query(marketplaceQueries.getfaq, function (error, data) {
        if (error) {
            return res.status(400).send({
                success: false,
                msg: "Error occured!!",
                error
            });
        }
        if (data.length > 0) {
            return res.status(200).send({
                success: true,
                msg: "Item Details",
                response: data
            });
        } else {
            return res.status(200).send({
                success: false,
                msg: "No Data"
            });
        }
    });
}


exports.getUserPurchase = async (db, req, res) => {
    console.log("in getUserPurchase");
    var user_id = req.body.user_id

    var qry = `select  t.id as transaction_id,u.id as user_id,i.is_sold,i.owner_id,u.full_name,u.email,i.id as item_id,i.blockchainType ,i.name as item_name,i.description,i.order_status,i.nft_type_select,i.image,i.file_type,abs(t.amount) as price,date_format(i.datetime,'%d-%M-%y') as nft_datetime,date_format(t.datetime,'%d-%M-%y') as purchase_datetime,concat('https://mumbai.polygonscan.com/tx/',t.hash) as transfer_hash,cu.full_name as creator,uc.name as collection_name from transaction as t left join  item as i on i.id=t.item_id left join users as u on u.id=i.created_by left join users as cu on cu.id=i.created_by left join user_collection as uc on uc.id=i.user_collection_id where t.user_id=${user_id} and t.transaction_type_id in (3) and t.status<>3   order by t.id desc`;
    await db.query(qry, async function (error, data) {
        if (error) {
            return res.status(400).send({
                success: false,
                msg: "Error occured!!",
                error
            });
        }
        if (data.length > 0) {
            return res.status(200).send({
                success: true,
                msg: "User purchase detail",
                response: data
            });
        } else {
            return res.status(400).send({
                success: false,
                msg: "No data found!!"
            });
        }
    });
}

exports.getUserSale = async (db, req, res) => {
    console.log("in getUserSale");
    var user_id = req.body.user_id
    var qry = `select u.id as user_id,u.full_name,u.email,i.id as item_id,i.blockchainType,i.order_status,i.nft_type_select,i.name as item_name,t.shipping_address,t.pin_code,t.locality,t.city,t.state,i.description,t.landmark,i.image,t.mobile_number,i.file_type,abs(round(t.amount,6)) as price,date_format(i.datetime,'%d-%M-%y') as nft_datetime,date_format(t.datetime,'%d-%M-%y') as purchase_datetime,concat('https://mumbai.polygonscan.com/tx/',t.hash) as transfer_hash,cu.full_name as creator,uc.name as collection_name from item as i inner join transaction as t on t.item_id=i.id and t.user_id=${user_id} and t.transaction_type_id in (1) and t.status=1 left join users as u on u.id=i.owner_id left join users as cu on cu.id=i.created_by left join user_collection as uc on uc.id=i.user_collection_id where t.user_id=${user_id} and t.transaction_type_id in (1)  order by t.id desc`;
    await db.query(qry, function (error, data) {
        if (error) {
            return res.status(400).send({
                success: false,
                msg: "Error occured!!",
                error
            });
        }
        if (data.length > 0) {
            return res.status(200).send({
                success: true,
                msg: "User Sale detail",
                response: data
            });
        } else {
            return res.status(400).send({
                success: false,
                msg: "No data found"
            });
        }
    });
}

exports.getUserTransactions = async (db, req, res) => {
    let user_id = req.body.user_id

    var qry = `select i.id as item_id ,tt.name as trxType,i.blockchainType,i.name as item_name,i.image,i.file_type,abs(round(t.amount,6)) as price,date_format(i.datetime,'%d-%M-%y') as nft_datetime,uc.name as collection_name from item as i inner join transaction as t on t.item_id=i.id and t.user_id=${user_id} and t.transaction_type_id in (1,2,3,4,5,6,7,8,16) and t.status=1 left join transaction_type as tt on tt.id=t.transaction_type_id left join user_collection as uc on uc.id=i.user_collection_id where t.user_id=${user_id} and t.transaction_type_id in (1,2,3,4,5,6,7,8,16)  order by t.id desc`;
    await db.query(qry, function (error, data) {
        if (error) {
            return res.status(400).send({
                success: false,
                msg: "Error occured!!",
                error
            });
        }
        if (data.length > 0) {
            return res.status(200).send({
                success: true,
                msg: "User Sale detail",
                response: data
            });
        } else {
            return res.status(400).send({
                success: false,
                msg: "No data found"
            });
        }
    });
}

exports.getUserSaleListing = async (db, req, res) => {
    console.log("in getUserSale");
    let user_id = req.body.user_id

    var qry = `SELECT i.id as item_id, i.image,i.file_type, i.name as item_name,i.blockchainType, abs(i.price) as price, DATE_FORMAT(i.datetime, '%d-%m-%Y %H:%i:%s') as nft_datetime, uc.name as collection_name FROM item as i LEFT JOIN user_collection as uc ON uc.id = i.user_collection_id WHERE i.owner_id = ${user_id} AND i.is_on_sale = 1 ORDER BY i.id DESC`;

    await db.query(qry, function (error, data) {
        if (error) {
            return res.status(400).send({
                success: false,
                msg: "Error occured!!",
                error
            });
        }
        if (data.length > 0) {
            return res.status(200).send({
                success: true,
                msg: "Sale List",
                response: data
            });
        } else {
            return res.status(400).send({
                success: false,
                msg: "No data found"
            });
        }
    });
}


exports.insertBid = async (db, req, res) => {
    let user_id = req.body.user_id;
    let item_id = req.body.item_id;
    let bid_price = req.body.bid_price;
    let txhash = req.body.txhash;
    let mobile_number = req.body.mobile_number;
    let pin_code = req.body.pin_code;
    let shipping_address = req.body.shipping_address
    let locality = req.body.locality
    let city = req.body.city
    let state = req.body.state
    let landmark = req.body.landmark
    if (!user_id) {
        return res.status(400).send({
            success: false,
            msg: "User ID required!!"
        });
    }
    if (!item_id) {
        return res.status(400).send({
            success: false,
            msg: "item_edition_id required!!"
        });
    }

    if (!bid_price) {
        return res.status(400).send({
            success: false,
            msg: "bid_price required!!"
        });
    }

    var transaction = {
        user_id: user_id,
        transaction_type_id: 4,
        item_id: item_id,
        amount: bid_price * -1,
        status: 1,
        hash: txhash,
        currency: "ETH"
    }

    await db.query(marketplaceQueries.insertTransaction, transaction, async function (error, transactionInsert) {
        if (error) {
            return res.status(400).send({
                success: false,
                msg: "error occured",
                error
            });
        }
        await db.query(marketplaceQueries.bidStatusChange, [4, item_id], async function (error, data1) {
            if (error) {
                return res.status(400).send({
                    success: false,
                    msg: "error occured",
                    error
                });
            }

            var insertdata = {
                user_id: user_id,
                item_id: item_id,
                owner_id: req.body.owner_id,
                bid_price: bid_price,
                transaction_id: transactionInsert.insertId
            }

            await db.query(marketplaceQueries.insertBid, [insertdata], async function (error, data) {
                if (error) {
                    return res.status(400).send({
                        success: false,
                        msg: "Error occured!!",
                        error
                    });
                }
                else if (transactionInsert.insertId && shipping_address) {
                    let shipAddress = {
                        'mobile_number': mobile_number,
                        'pin_code': pin_code,
                        'shipping_address': shipping_address,
                        'locality': locality,
                        'city': city,
                        'state': state,
                        'landmark': landmark
                    }
                    await db.query(marketplaceQueries.updateShippingAddress, [shipAddress, transactionInsert.insertId]);
                }
                if (data) {
                    /// SEND MAIL STARTS
                    qry = `select i.name,i.description,i.image,getUserFullName(${user_id}) as bidderName,getUserEmail(u.id) as ownerEmail,getUserEmail(${user_id}) as bidderEmail from item as i left join users as u on u.id=i.owner_id where i.id=${item_id}`;

                    await db.query(qry, async function (error, mailData) {
                        let mailMsg = '';
                        if (trx[0].nft_type_select == 1) {
                            mailMsg = `Bid Placed on ${mailData[0].name} for $${bid_price}.
                            <b>Shipping Address</b>
                            <div> Mobile number : ${mobile_number}</div>
                            <div> Pin Code : ${pin_code}</div>
                            <div> Shipping Address : ${shipping_address}</div>
                            <div> Locality : ${locality}</div>
                            <div> City : ${city}</div>
                            <div> State : ${state}</div>
                            <div> Landmark : ${landmark}</div>`;
                        } else {
                            mailMsg = `Bid Placed on ${mailData[0].name} for $${bid_price}.`;
                        }
                        emailActivity.Activity(mailData[0].ownerEmail, 'Bid Placed', mailMsg, `salehistory`, `https://ipfs.io/ipfs/${mailData[0].image}`);

                        emailActivity.Activity(mailData[0].bidderEmail, 'Bid Placed', `You have placed bid on ${mailData[0].name} for $${bid_price}.`, `accountsetting`, `https://ipfs.io/ipfs/${mailData[0].image}`);

                    });
                    /// SEND MAIL ENDS

                    /// SEND MAIL FOR PURCHASING NFT ENDS
                    return res.status(200).send({
                        success: true,
                        msg: "Bid placed!!",
                    });
                } else {
                    res.status(400).send({
                        success: false,
                        msg: "Something Wrong due to internal Error"
                    });
                }
            });
        });
    });

}


exports.allSearch = async (
    db, req, res) => {
    console.log("in allSearch");

    var search = (!req.body.search) ? '' : req.body.search;


    if (!search) {
        return res.status(400).send({
            success: false,
            msg: "Search parameter required"
        });
    }
    qry = "select uc.id as id,'' as email,uc.name as user_name,uc.name as full_name,uc.profile_pic,'' as file_type,'collection' as type from user_collection as uc where uc.name like '" + `${search}` + "%' or uc.description like '" + `${search}` + "%' and is_hide=0  union all select id,email,full_name as user_name,full_name as name,profile_pic,'' as file_type,'talent' as type from users where email like '" + `${search}` + "%' or full_name like '" + `${search}` + "%' union all select i.id,u.email,u.user_name,i.name,i.image as profile_pic,i.file_type as file_type,'nft' as type from  item as i left join users as u on u.id=i.created_by where i.name like '" + `${search}` + "%' and i.is_active=1 ";

    try {
        await db.query(qry, async function (err, result) {
            if (err) {
                return res.status(400).send({
                    success: false,
                    msg: "error occured ",
                    error
                });
            }
            else if (result.length > 0) {
                return res.status(200).send({
                    success: true,
                    msg: 'data  found',
                    response: result

                });
            }
            else {
                return res.status(400).send({
                    success: false,
                    msg: "No data found ",
                    data: []
                });
            }
        })



    } catch (err) {
        return res.status(500).send({
            success: false,
            msg: `unable to add customer address due to internal error :${err}`
        });
    }
}


exports.getUserBids = async (db, req, res) => {
    console.log("in getUserBids");
    var user_id = req.body.user_id

    await db.query(marketplaceQueries.getUserBids, [user_id, user_id], function (error, data) {
        if (error) {
            return res.status(400).send({
                success: false,
                msg: "Error occured!!",
                error
            });
        }
        if (data.length > 0) {
            return res.status(200).send({
                success: true,
                msg: "User bids detail",
                response: data
            });
        } else {
            return res.status(400).send({
                success: false,
                msg: "No data found!!"
            });
        }
    });
}

exports.myBidItem = async (db, req, res) => {
    console.log("in myBidItem");
    var user_id = req.body.user_id
    await db.query(marketplaceQueries.myBidItem, [user_id], function (error, data) {
        if (error) {
            return res.status(400).send({
                success: false,
                msg: "Error occured!!",
                error
            });
        }
        if (data.length > 0) {
            return res.status(200).send({
                success: true,
                msg: "Item bid detail!!",
                response: data
            });
        } else {
            return res.status(400).send({
                success: false,
                msg: "No data found!!"
            });
        }
    });
}


exports.itemView = async (db, req, res) => {
    console.log("in itemView");
    var user_id = req.body.user_id;
    var item_id = req.body.item_id;

    if (!user_id) {
        return res.status(400).send({
            success: false,
            msg: "user_id required!!"
        });
    }
    if (!item_id) {
        return res.status(400).send({
            success: false,
            msg: "item_id required!!"
        });
    }
    var views = {
        "user_id": user_id,
        'item_id': item_id
    }

    await db.query(marketplaceQueries.itemView, [views], function (error, data) {
        if (error) {
            return res.status(400).send({
                success: false,
                msg: "Error occured!!",
                error
            });
        }
        if (data) {
            res.status(200).send({
                success: true,
                msg: "Insert item view successfully!!",
            });
        } else {
            res.status(400).send({
                success: false,
                msg: "Error in insertion!!"
            });
        }
    });
}


exports.getMarketActivity = async (db, req, res) => {
    console.log("in getMarketActivity");
    var item_id = req.body.item_id;
    await db.query(marketplaceQueries.getNftDetailsActivity, [item_id, item_id], function (error, data) {
        if (error) {
            return res.status(400).send({
                success: false,
                msg: "Error occured!!",
                error
            });
        }
        if (data.length > 0) {
            res.status(200).send({
                success: true,
                msg: "Activity details!!",
                response: data
            });
        } else {
            res.status(400).send({
                success: false,
                msg: "No data found!!"
            });
        }
    });
}


exports.getItemBidDetail = async (db, req, res) => {
    console.log("in getItemBidDetail");
    var item_id = req.body.item_id;
    await db.query(marketplaceQueries.getItemBidDetail, [item_id, item_id], function (error, data) {
        if (error) {
            return res.status(400).send({
                success: false,
                msg: "Error occured!!",
                error
            });
        }
        if (data.length > 0) {
            res.status(200).send({
                success: true,
                msg: "Bid details!!",
                response: data
            });
        } else {
            res.status(400).send({
                success: false,
                msg: "No data found!!"
            });
        }
    });
}


exports.getBidDetail = async (db, req, res) => {
    console.log("in getBidDetail");
    var item_id = req.body.item_id

    await db.query(marketplaceQueries.getBidDetail, [item_id], function (error, data) {
        if (error) {
            return res.status(400).send({
                success: false,
                msg: "Error occured!!",
                error
            });
        }
        if (data.length > 0) {
            res.status(200).send({
                success: true,
                msg: "Item Bid Details",
                response: data
            });
        } else {
            res.status(400).send({
                success: false,
                msg: "No data found!!"
            });
        }
    });
}


exports.checkExpiry = async (db, req, res) => {
    console.log("in checkExpiry");
    var item_id = req.body.item_id

    await db.query(marketplaceQueries.checkExpiry, [item_id], function (error, data) {
        if (error) {
            return res.status(400).send({
                success: false,
                msg: "Error occured!!",
                error
            });
        }
        if (data[0].is_expired == 1) {
            res.status(200).send({
                success: true,
                msg: "Item expired",
                response: data[0]
            });
        } else {
            res.status(400).send({
                success: false,
                msg: "Item not expired yet!!",
                response: data[0]

            });
        }
    });
}


exports.supportListByCategory = async (db, req, res) => {
    var category_id = req.body.category_id;
    await db.query(marketplaceQueries.supportListByCategory, [category_id], function (error, data) {
        if (error) {
            return res.status(400).send({
                success: false,
                msg: "Error occured!!",
                error
            });
        }
        if (data.length > 0) {
            return res.status(200).send({
                success: true,
                msg: "Support List!! ",
                data: data
            });
        }
        else {
            return res.status(400).send({
                success: false,
                msg: "No data found!!",
                error
            });
        }
    });
}

exports.bidAccept = async (db, req, res) => {
    console.log("in bidAccept");
    var user_id = req.body.user_id;
    var item_id = req.body.item_id;
    var bid_id = req.body.bid_id;
    let hash = req.body.hash;
    var is_sold = 1;

    await db.query(marketplaceQueries.getBidRecord, [bid_id], async function (error, biddata) {
        if (error) {
            return res.status(400).send({
                success: false,
                msg: "error occured in getWalletDetail",
                error
            });
        }

        await db.query(marketplaceQueries.insertSellTransactionByBidId, [hash, bid_id], async function (error, data3) {
            if (error) {
                return res.status(400).send({
                    success: false,
                    msg: "Error occured in insertSellTransactionByBidId!!",
                    error
                });
            }
        });

        /**
         *  Royalty Transaction start
        */
        await db.query(marketplaceQueries.itemdetail, [item_id, 0, 0, item_id, item_id], async function (getItemerror, trx) {
            let owner_id = trx[0].owner_id;
            let created_by = trx[0].created_by;
            let royalty_percent = trx[0].royalty_percent;
            console.log(owner_id, created_by, royalty_percent);
            if (owner_id != created_by) {
                let cryptoPrice = biddata[0].bid_price;
                console.log(cryptoPrice);
                let royaltyAmount = parseFloat(cryptoPrice * royalty_percent / 100).toFixed(6);
                console.log(royaltyAmount);
                await db.query(marketplaceQueries.insertRoyaltyTransactionByItemId, [royaltyAmount, item_id]);
            }
        });
        /** 
         * Royalty Transaction End
         */

        await db.query(marketplaceQueries.updateSold2, [is_sold, biddata[0].user_id, item_id], async function (error, data) {
            if (error) {
                return res.status(400).send({
                    success: false,
                    msg: "Error occured!!",
                    error
                });
            }

            await db.query(marketplaceQueries.updateItemBid, [item_id, bid_id], async function (error, data) {
                if (error) {
                    return res.status(400).send({
                        success: false,
                        msg: "Error occured updateItemBid!!",
                        error
                    });
                }

                await db.query(marketplaceQueries.updateItemBid2, [bid_id], async function (error, data) {
                    if (error) {
                        return res.status(400).send({
                            success: false,
                            msg: "Error occured in updateItemBid2!!",
                            error
                        });
                    }

                    await db.query(marketplaceQueries.insertBuyTransactionByBidId, [biddata[0].user_id, hash, bid_id], async function (error, data3) {
                        if (error) {
                            return res.status(400).send({
                                success: false,
                                msg: "Error occured in insertBuyTransactionByBidId!!",
                                error
                            });
                        }

                        /// SEND MAIL STARTS
                        qry = `select i.name,i.description,i.image,getUserFullName(ib.user_id) as bidderName,getUserEmail(${user_id}) as ownerEmail,getUserEmail(ib.user_id) as bidderEmail,ib.bid_price from item_bid as ib left join item as i on i.id=ib.item_id left join users as u on u.id=i.owner_id where ib.id=${bid_id}`;

                        await db.query(qry, async function (error, mailData) {
                            emailActivity.Activity(mailData[0].ownerEmail, `Bid Accepted`, `You have accepted bid of $${mailData[0].bid_price} for ${mailData[0].name}.`, `nftDetails/${item_id}`, `https://ipfs.io/ipfs/${mailData[0].image}`);

                            emailActivity.Activity(mailData[0].bidderEmail, 'Bid Accepted', `Your bid has been accepted for $${mailData[0].bid_price} for ${mailData[0].name}.`, `nftDetails/${item_id}`, `https://ipfs.io/ipfs/${mailData[0].image}`);
                        });
                        /// SEND MAIL ENDS

                        if (data) {
                            return res.status(200).send({
                                success: true,
                                msg: "Bid accepted!!",
                            });
                        } else {
                            return res.status(400).send({
                                success: false,
                                msg: "Something Wrong due to internal Error"
                            });
                        }

                    });
                });
            });
        });
    });
}

exports.getUserTransaction = async (db, req, res) => {
    console.log("in getUserTransaction");
    var user_id = req.body.user_id;
    await db.query(marketplaceQueries.getUserTransaction, [user_id], function (error, data) {
        if (error) {
            return res.status(400).send({
                success: false,
                msg: "Error occured!!",
                error
            });
        }
        if (data.length > 0) {
            res.status(200).send({
                success: true,
                msg: "User transaction details!!",
                response: data
            });
        } else {
            res.status(400).send({
                success: false,
                msg: "No data found!!"
            });
        }
    });
}


exports.getRoyaltyTransaction = async (db, req, res) => {
    console.log("in getRoyaltyTransaction");
    var user_id = req.body.user_id;
    await db.query(marketplaceQueries.getRoyaltyTransaction, [user_id], function (error, data) {
        if (error) {
            return res.status(400).send({
                success: false,
                msg: "Error occured!!",
                error
            });
        }
        if (data.length > 0) {
            res.status(200).send({
                success: true,
                msg: "Royalty transaction details!!",
                response: data
            });
        } else {
            res.status(400).send({
                success: false,
                msg: "No data found!!"
            });
        }
    });
}

exports.getCollectionCategoryNft = async (db, req, res) => {
    var collection_category_id = req.body.collection_category_id;
    var login_user_id = req.body.login_user_id;
    try {
        var qry = `SELECT i.id as item_id,i.name,i.description,u.id as owner_id,concat('${config.mailUrl}','backend/uploads/', u.profile_pic) as owner_profile_pic,i.image,i.file_type,i.item_category_id,case when mod(i.price,1)=0 then round(i.price) else round(i.price,2) end as price,cl.id as collection_id, cl.games_category ,cl.name as collection_name,cl.user_id, cl.games_category ,cl.profile_pic as collection_profile_pic, cl.is_verified, i.is_sold,i.expiry_date,i.start_date,i.sell_type,case when i.sell_type=1 then 'Buy' when i.sell_type=2 then 'Place a bid' else '' end as sell_type_text, i.sell_type,case when il.id is not null then 1 else 0 end as is_liked,itemLikeCount(i.id) as like_count,coalesce(getCollectionItems(cl.id),0)as item_count,coalesce(getCollectionOwners(cl.id),0) as owner_count,coalesce(getCollectionFloorPrice(cl.id),0) as floor_price,coalesce(getCollectionTradeVolume(cl.id),0) as trad_volume from item as i LEFT JOIN user_collection as cl ON cl.id = i.user_collection_id left join users as u on u.id=i.owner_id left join item_like as il on il.item_id=i.id and il.user_id = ${login_user_id} where i.is_active=1 and i.is_sold=0 and i.is_minted = 1 and i.sell_type<>3 and i.is_on_sale<>0  and (i.expiry_date is null or i.expiry_date>now() or start_date='0000-00-00 00:00:00') AND cl.games_category = ${collection_category_id}`;

        await db.query(qry, function (error, data) {
            if (error) {
                return res.status(400).send({
                    success: false,
                    msg: "Error occured!!",
                    error
                });
            }
            if (data.length > 0) {
                return res.status(200).send({
                    success: true,
                    msg: "Item Details",
                    response: data
                });
            } else {
                return res.status(200).send({
                    success: false,
                    msg: "No Data"
                });
            }
        });
    } catch (ee) {
        return res.status(200).send({
            success: false,
            msg: "No Data",
            error: ee
        });
    }
}

exports.trendingNfts = async (db, req, res) => {
    let type = req.body.type;
    try {
        if (type) {
            var qry = `SELECT getItemSellCount(i.id) as sell_count,i.id,i.nft_type_select, i.file_type ,i.image, i.name, i.price, i.owner_id, i.is_on_sale, i.sell_type, i.blockchainType, i.start_date, i.expiry_date, uc.name as collection_name, uc.profile_pic as collection_image, i.user_collection_id, u.full_name as owner_name, u.profile_pic as owner_profile_pic FROM item as i LEFT JOIN user_collection as uc ON i.user_collection_id = uc.id LEFT JOIN users as u ON i.owner_id = u.id WHERE i.sell_type = ${type} and i.is_on_sale<>0 and (i.expiry_date is null or i.expiry_date>now() or start_date='0000-00-00 00:00:00') ORDER BY getItemSellCount(i.id) desc, i.id DESC LIMIT 6;`;
        } else {
            var qry = `SELECT i.id, i.image, i.name, i.price, i.owner_id,i.nft_type_select, i.file_type, i.is_on_sale, i.sell_type, i.blockchainType, i.start_date, i.expiry_date, uc.name as collection_name, uc.profile_pic as collection_image, i.user_collection_id, u.full_name as owner_name, u.profile_pic as owner_profile_pic FROM item as i LEFT JOIN user_collection as uc ON i.user_collection_id = uc.id LEFT JOIN users as u ON i.owner_id = u.id ORDER BY i.id DESC LIMIT 12`;
        }

        await db.query(qry, function (error, data) {
            if (error) {
                return res.status(400).send({
                    success: false,
                    msg: "Error occured!!",
                    error
                });
            }
            if (data.length > 0) {
                return res.status(200).send({
                    success: true,
                    msg: "Item Details",
                    response: data
                });
            } else {
                return res.status(200).send({
                    success: false,
                    msg: "No Data"
                });
            }
        });
    } catch (ee) {
        return res.status(200).send({
            success: false,
            msg: "No Data",
            error: ee
        });
    }
}

exports.getHomeCollections = async (db, req, res) => {
    var qry = `SELECT uc.id, uc.name, uc.profile_pic, uc.banner, u.full_name as creater_name, u.profile_pic as user_profile, u.id as userid FROM user_collection as uc LEFT JOIN users as u ON uc.user_id = u.id WHERE uc.is_hide = 0 order by getCollectionTradeVolume(uc.id) desc, uc.id DESC limit 6`;

    await db.query(qry, function (error, data) {
        if (error) {
            return res.status(400).send({
                success: false,
                msg: "Error occured!!",
                error
            });
        }
        if (data.length > 0) {
            res.status(200).send({
                success: true,
                msg: "All Collection Detail!!",
                response: data
            });
        } else {
            res.status(400).send({
                success: false,
                msg: "Something Wrong due to internal Error"
            });
        }
    });
}

//==============================================================================================

/// NEW CODE STARTS HERE

/////===================================================================================










exports.getDashboardCount = async (db, req, res) => {
    await db.query(marketplaceQueries.getDashboardCount, function (error, data) {
        if (error) {
            return res.status(400).send({
                success: false,
                msg: "Error Occured"
            })
        }
        if (data.length > 0) {
            res.status(200).send({
                success: true,
                msg: "Item Details",
                response: data[0]
            });
        } else {
            res.status(200).send({
                success: false,
                msg: "No data found!!"
            });
        }
    })
}

exports.getItemAll = async (db, req, res) => {
    await db.query(marketplaceQueries.getItemAll, function (error, data) {
        if (error) {
            return res.status(400).send({
                success: false,
                msg: "Error Occured"
            })
        }
        if (data.length > 0) {
            res.status(200).send({
                success: true,
                msg: "Item Details",
                response: data[0]
            });
        } else {
            res.status(200).send({
                success: false,
                msg: "No data found!!"
            });
        }
    })
}

exports.getBannerNFT = async (db, req, res) => {
    console.log("in getBannerNFT");
    await db.query(marketplaceQueries.getBannerNFT, function (error, data) {
        if (error) {
            return res.status(400).send({
                success: false,
                msg: "Error Occured"
            })
        }
        if (data.length > 0) {
            res.status(200).send({
                success: true,
                msg: "Banner Details",
                response: data
            });
        } else {
            res.status(200).send({
                success: false,
                msg: "No data found!!"
            });
        }
    })
}


exports.addBannerNFT = async (db, req, res) => {
    console.log("in addBannerNFT");
    let item_id = req.body.item_id;
    var updateData = {
        "is_banner": 1
    }
    await db.query(marketplaceQueries.updateItem, [updateData, item_id], function (error, data) {
        if (error) {
            return res.status(400).send({
                success: false,
                msg: "Error Occured"
            })
        }
        else {
            res.status(200).send({
                success: true,
                msg: "NFT added as banner!!"
            });
        }
    })
}


exports.removeBannerNFT = async (db, req, res) => {
    console.log("in removeBannerNFT");
    let item_id = req.body.item_id;
    var updateData = {
        "is_banner": 0
    }
    await db.query(marketplaceQueries.updateItem, [updateData, item_id], function (error, data) {
        if (error) {
            return res.status(400).send({
                success: false,
                msg: "Error Occured"
            })
        }
        else {
            res.status(200).send({
                success: true,
                msg: "NFT removed as banner!!"
            });
        }
    })
}

exports.getUsersProfile = async (db, req, res) => {
    await db.query(marketplaceQueries.getUsersProfile, function (error, data) {
        if (error) {
            return res.status(400).send({
                success: false,
                msg: "Error Occured"
            })
        }
        if (data.length > 0) {
            res.status(200).send({
                success: true,
                msg: "Profile Details",
                response: data
            });
        } else {
            res.status(200).send({
                success: false,
                msg: "No data found!!"
            });
        }
    })
}

exports.getUsersProfileForFilter = async (db, req, res) => {
    let sortBy = req.body.sortBy;
    let type = req.body.type;
    let qry = '';

    if (sortBy) {
        if (sortBy == 1) {
            qry = `SELECT * FROM users ORDER BY datetime DESC`;
        } else if (sortBy == 2) {
            qry = `SELECT * FROM users ORDER BY datetime ASC`;
        } else if (sortBy == 3) {
            qry = `SELECT *, gettopMinted(id) as topMint FROM users ORDER BY gettopMinted(id) DESC`;
        } else if (sortBy == 4) {
            qry = `SELECT *, getMostSold(id) as mostSold FROM users ORDER BY getMostSold(id) DESC`;
        }
    } else {
        if (type == 1) {
            qry = `SELECT *, gettopMinted(id) as topMint FROM users WHERE gettopMinted(id) > 0 ORDER BY id DESC`;
        } else if (type == 2) {
            qry = `SELECT *, getCollector(id) as topMint FROM users WHERE getCollector(id) > 0 ORDER BY id DESC`;
        } else if (type == 3) {
            qry = `SELECT * FROM users ORDER BY datetime DESC`;
        }
    }

    if (sortBy == 0 && type == 0) {
        qry = "SELECT * FROM users ORDER BY id DESC"
    }

    await db.query(qry, function (error, data) {
        if (error) {
            return res.status(400).send({
                success: false,
                msg: "Error Occured"
            })
        }
        if (data.length > 0) {
            res.status(200).send({
                success: true,
                msg: "Profile Details",
                response: data
            });
        } else {
            res.status(200).send({
                success: false,
                msg: "No data found!!"
            });
        }
    })
}

exports.itemDetails = async (db, req, res) => {
    console.log("in itemDetails");
    var item_id = req.body.item_id;
    var user_id = req.body.user_id;
    var itemLike = req.body.itemLike;

    if (!item_id) {
        return res.status(400).send({
            success: false,
            msg: "item_id required!!"
        });
    }
    if (!user_id) {
        user_id = 0;
    }

    var views = {
        "user_id": user_id,
        'item_id': item_id
    }

    if (itemLike == 0) {
        await db.query(marketplaceQueries.itemView, [views], async function (error, data) { });
    }
    await db.query(marketplaceQueries.itemdetail, [user_id, item_id, item_id], async function (error, data) {
        if (error) {
            return res.status(400).send({
                success: false,
                msg: "Error occured!!",
                error
            });
        }
        if (data.length > 0) {
            await db.query(marketplaceQueries.getSettingData, async function (error, settingData) {
                return res.status(200).send({
                    success: true,
                    response: data[0],
                    settingData: settingData[0]
                });
            })
        }
        else {
            return res.status(400).send({
                success: false,
                msg: "No Data"
            });
        }
    });
}

exports.createMetadata = async (db, req, res) => {
    console.log(" in createMetadata");
    var additem = req.body;
    let dir = './metadata/';
    fs.readdir(dir, (err, files) => {
        if (files.length == 0) {
            var count = 1;
        } else {
            var count = parseInt(files.length) + parseInt(1);
        }

        var userfile = count + ''.concat('.json');
        fs.writeFile(`./metadata/${userfile}`, JSON.stringify(additem), async (err, fd) => {
            if (err) throw err;

            // const url = `https://api.pinata.cloud/pinning/pinFileToIPFS`;
            // let formdata = new FormData();
            // formdata.append('file', fs.createReadStream('./metadata/' + userfile));
            // const response2 = await fetch(url, {
            //     method: 'POST', headers: {
            //         'Content-Type': `multipart/form-data; boundary=${formdata._boundary}`,
            //         'pinata_api_key': '856f580ed9c0f2715b45',
            //         'pinata_secret_api_key': '2dd1305d32198f643db71dd781fa8c1269f5afede54cfcccf9e8647a71114b40'
            //     },
            //     body: formdata
            // });
            // const filedata = await response2.json();

            // if (filedata) {
            return res.status(200).send({
                success: true,
                msg: "Metadata created!!",
                status: 1,
                tokenId: count
            });
            // }
            // else {
            //     return res.status(400).send({
            //         success: false,
            //         msg: "Unexpected internal error!!",
            //         err
            //     });
            // }
        });
    });
}

exports.updateMetadata = async (db, req, res) => {
    console.log(" in updateMetadata");
    let additem = {
        "name": req.body.name,
        "description": req.body.description,
        "image": req.body.image,
    };
    let tokenid = req.body.tokenid;
    let dir = './metadata/';
    fs.readdir(dir, (err, files) => {
        let userfile = tokenid + ''.concat('.json');
        fs.writeFile(`./metadata/${userfile}`, JSON.stringify(additem), async (err, fd) => {
            if (err) throw err;
            return res.status(200).send({
                success: true,
                msg: "Metadata created!!",
                status: 1
            });
        });
    });
}

exports.getTopArtist = async (db, req, res) => {
    console.log("in getTopArtist");
    // let query = `SELECT u.id, u.full_name, u.description, u.profile_pic, u.banner, i.created_by FROM users as u INNER JOIN item as i ON u.id = i.created_by where u.profile_pic IS NOT NULL AND u.profile_pic != 'null' AND u.banner IS NOT NULL AND u.banner != 'null' GROUP BY i.created_by LIMIT 6`

    let query = `SELECT users.full_name, users.description, users.profile_pic, users.banner, count(item.created_by) as top_artist, item.created_by as id from item LEFT JOIN users ON item.created_by = users.id GROUP BY created_by ORDER BY top_artist DESC LIMIT 6`;

    await db.query(query, async function (error, data) {
        if (error) {
            return res.status(400).send({
                success: false,
                msg: "Error occured!!",
                error
            });
        }
        if (data.length > 0) {
            return res.status(200).send({
                success: true,
                response: data
            });
        }
        else {
            return res.status(400).send({
                success: false,
                msg: "No Data"
            });
        }
    });
}

exports.putOnSale = async (db, req, res) => {
    let item_id = req.body.item_id;
    let arr = [];
    if (req.body.is_minted == 1) {
        arr = {
            "is_on_sale": '1',
            "is_sold": '0',
            "order_status": 1
        }
    } else {
        arr = {
            "is_on_sale": '1',
            "is_sold": '0',
            "is_minted": 1,
            "token_hash": req.body.token_hash,
            "order_status": 1
        }
    }

    try {

        await db.query(marketplaceQueries.getItemDetails, [item_id], async function (error, nftData) {

            await db.query(marketplaceQueries.putOnSale1, [arr, item_id], async function (error, data) {
                if (error) {
                    return res.status(400).send({
                        success: false,
                        msg: "Error occured!!",
                        error
                    });
                }
                else {
                    let transactionData = {
                        'user_id': req.body.user_id,
                        'item_id': item_id,
                        'transaction_type_id': 5,
                        'amount': nftData[0].price,
                        'currency': nftData[0].blockchainType == 1 ? 'ETH' : 'MATIC',
                        'status': 1
                    }
                    await db.query(marketplaceQueries.insertTransaction, [transactionData], async function (errorTrx, trxData) {

                    });

                    return res.status(200).send({
                        success: true,
                        msg: "Item put on sale!!"
                    });
                }
            });
        })
    } catch (ee) {
        return res.status(200).send({
            success: false,
            msg: "No Data",
            error: ee
        });
    }
}

exports.cancelOrder = async (db, req, res) => {
    let item_id = req.body.item_id;
    let arr = {
        "is_on_sale": '0',
        "is_sold": '0'
    }
    try {
        await db.query(marketplaceQueries.getItemDetails, [item_id], async function (error, nftData) {

            await db.query(marketplaceQueries.putOnSale1, [arr, item_id], async function (error, data) {
                if (error) {
                    return res.status(400).send({
                        success: false,
                        msg: "Error occured!!",
                        error
                    });
                }
                else {

                    let transactionData = {
                        'user_id': req.body.user_id,
                        'item_id': item_id,
                        'transaction_type_id': 7,
                        'amount': nftData[0].price,
                        'currency': nftData[0].blockchainType == 1 ? 'ETH' : 'MATIC',
                        'status': 1
                    }
                    await db.query(marketplaceQueries.insertTransaction, [transactionData], async function (errorTrx, trxData) {

                    });

                    return res.status(200).send({
                        success: true,
                        msg: "Order cancelled!!"
                    });
                }
            });
        })
    } catch (ee) {
        return res.status(200).send({
            success: false,
            msg: "No Data",
            error: ee
        });
    }
}
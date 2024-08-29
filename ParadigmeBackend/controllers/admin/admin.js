const CryptoJS = require("crypto-js");
var fetch = require('node-fetch'); 
const config = require('../../config');
const adminQueries = require("../../services/adminQueries");
var validator = require("email-validator");
const fs = require('fs');
const path = require('path');
const formidable = require('formidable');
const axios = require('axios');
const jwt = require('jsonwebtoken');
var ipfsCompress = require('../ipfsCompress/imagecompress');
const marketplaceQueries = require("../../services/marketplaceQueries");

var FormData = require('form-data');
const { response } = require("express");

var AdmZip = require('adm-zip');
const reader = require('xlsx')

const { base64encode, base64decode } = require('nodejs-base64');
var reverse = require('reverse-string');



function closeNFT(code) {
    try {
        var encoded = base64encode(code);
        for (let i = 0; i < 5; i++) {
            encoded = base64encode(reverse(encoded));
        }
        encoded = Buffer.from(encoded);
        let json = JSON.stringify(encoded);
        var data = base64encode(json);
        return {
            data: reverse(data)
        }
    } catch (e) {
        return {
            data: ''
        }
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
        return 'error!!'
    }
}

// Login User
exports.login = async (db, req, res) => {
    console.log("login");
    var email = req.body.email;
    var password = req.body.password;

    console.log(email);
    try {
        if (email == '') {
            return res.status(400).send({
                success: false,
                msg: "Email required!! "
            });
        }
        if (password == '') {
            return res.status(400).send({
                success: false,
                msg: "Password required!!"
            });
        }
        if (!validator.validate(email)) {
            return res.status(400).send({
                success: false,
                msg: "Enter a valid email address!!"
            });
        }


        db.query(adminQueries.getUsersEmail, email, async function (error, user) {
            //console.log(user);
            if (error) {
                return res.status(400).send({
                    success: false,
                    msg: "Unexpected error occured!!",
                    error
                });
            } else if (user.length == 0) {
                return res.status(400).send({
                    success: false,
                    msg: "No user found!!"
                });
            }

            else {
                var hash = CryptoJS.SHA256(password).toString(CryptoJS.enc.Hex);
                if (user[0].password === hash) {

                    const jwtToken = jwt.sign({
                        email: req.body.email,
                        id: user[0].id,
                    }, config.JWT_SECRET_KEY, {
                        expiresIn: config.SESSION_EXPIRES_IN
                    })
                    return res.status(200).send({
                        success: true,
                        msg: "Login successfully!!",
                        data: {
                            id: user[0].id,
                            user_email: user[0].email,
                            username: user[0].username,
                            token: jwtToken,
                        }
                    });
                } else {
                    return res.status(400).send({
                        success: false,
                        msg: "Password does not match!!"
                    });
                }

            }



        })
    } catch (err) {
        console.log(err)
        return res.status(400).send({
            success: false,
            msg: "Unexpected internal error!!",
            err
        });
    }

}

exports.getUserCreatedNft = async (db, req, res) => {
    let user_id = req.body.user_id;
    let qry = `Select i.id as item_id,i.name,i.description,i.image,i.file_type,i.item_category_id,i.price,cl.id as collection_id,cl.name as collection_name, i.sell_type,case when i.sell_type=1 then 'Buy' when i.sell_type=2 then 'Place a bid' else '' end as sell_type_text from item as i LEFT JOIN user_collection as cl ON cl.id = i.user_collection_id where i.created_by = ${user_id}`
    await db.query(qry, function (error, data) {
        if (error) {
            return res.status(400).send({
                success: false,
                msg: "Error Occured!!",
                error
            });
        }
        if (data.length > 0) {
            res.status(200).send({
                success: true,
                msg: "All Colletion Details",
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

exports.getAllUsersCollection = async (db, req, res) => {
    let type = req.body.type;
    let qry = '';
    if(type == 'admin'){
        qry = `SELECT id,is_hide, is_featured, is_verified, user_id, name, description, datetime, facebook, insta, twitter, profile_pic, banner FROM user_collection WHERE user_id == 1 ORDER BY id DESC`
    }else{
        qry = `SELECT id,is_hide, is_featured, is_verified, user_id, name, description, datetime, facebook, insta, twitter, profile_pic, banner FROM user_collection WHERE user_id != 1 ORDER BY id DESC`
    }

    await db.query(qry, function (error, data) {
        if (error) {
            return res.status(400).send({
                success: false,
                msg: "Error Occured!!",
                error
            });
        }
        if (data.length > 0) {
            res.status(200).send({
                success: true,
                msg: "All Colletion Details",
                response: data
            });
        } else {
            res.status(400).send({
                success: false,
                msg: "Something went wrong due to internal error"
            });
        }
    });
}

exports.getAllCollection = async (db, req, res) => {

    await db.query(adminQueries.getAllCollection, function (error, data) {
        if (error) {
            return res.status(400).send({
                success: false,
                msg: "Error Occured!!",
                error
            });
        }
        if (data.length > 0) {
            res.status(200).send({
                success: true,
                msg: "All Colletion Details",
                response: data
            });
        } else {
            res.status(400).send({
                success: false,
                msg: "Something went wrong due to internal error"
            });
        }
    });
}

exports.getAllTransaction = async (db, req, res) => {
    console.log(req.body);
    var id = req.body.id;
    var transaction_type = req.body.transaction_type_id;
    var from_date = req.body.from_date;
    var to_date=req.body.to_date;
    var from_amount =req.body.from_amount;
    var to_amount = req.body.to_amount;
      
    
    
    var qry = `select t.id, t.item_id, item.name as item_name ,item.nft_type_select as nft_type_select,item.owner_id as owner_id,ou.full_name as owner_name,t.to_address,t.from_address,abs(t.amount) as amount,t.mobile_number,t.pin_code,item.order_status,t.landmark,t.state,t.locality,t.hash,t.shipping_address,t.city,t.datetime, users.full_name , t.currency,tt.name as transaction_type,ts.name as transaction_status from transaction as t left join transaction_type as tt on tt.id=t.transaction_type_id left join transaction_status as ts on ts.id=t.status LEFT JOIN users ON users.id = t.user_id LEFT JOIN item ON item.id = t.item_id left join users as ou on ou.id=item.owner_id where 1 `

    if (from_date) {
        console.log('>>', transaction_type)
        qry = qry + ` and date(t.datetime)>='${from_date}'  `;
    }
    if (to_date) {
        console.log('>>', transaction_type)
        qry = qry + ` and date(t.datetime)<='${to_date}'  `;
    }
    if (from_amount) {
        console.log('>>', transaction_type)
        qry = qry + ` and amount>=${from_amount}  `;
    }
    if (to_amount) {
        console.log('>>', transaction_type)
        qry = qry + ` and amount<=${to_amount}  `;
    }
    if (transaction_type) {
        console.log('>>', transaction_type)

        qry = qry + ` and transaction_type_id =${transaction_type} `;
    }
    qry=qry + `  order by t.id desc `;
    console.log(qry);
    await db.query(qry, function (error, data) {
        if (error) {
            return res.status(400).send({
                success: false,
                msg: "Error : Server is not responding please try again later",
                error
            });
        }
        if (data.length > 0) {
            res.status(200).send({
                success: true,
                msg: "All Buy transaction Details",
                response: data
            });
        } else {
            res.status(400).send({
                success: false,
                msg: "No Data"
            });
        }
    });
}

exports.getTransactionFilter = async (db, req, res) => {
    await db.query(adminQueries.getTransactionFilter, function (error, data) {
        if (error) {
            return res.status(400).send({
                success: false,
                msg: "Error Occured!!",
                error
            });
        }
        if (data.length > 0) {
            res.status(200).send({
                success: true,
                msg: "All transaction Details",
                response: data
            });
        } else {
            res.status(400).send({
                success: false,
                msg: "Something went wrong due to internal error"
            });
        }
    });
}

// exports.updateUserCollection = async (db, req, res) => {
//     var id = 1;
//     var name = req.body.name;
//     var description = req.body.description;
//     var datetime = req.body.datetime;
//     var profile_pic = req.body.profile_pic;
//     var banner = req.body.banner;
//     try {
//         var arr = {
//             'name': name,
//             'description' : description,
//             'datetime' : datetime,
//             'profile_pic' : profile_pic,
//             'banner' : banner,

//         }
//         let updated = await db.query(adminQueries.updateFees, [arr, id]);
//         if (updated) {
//             try {
//                 return res.status(200).send({
//                     success: true,
//                     msg: "Content updated successfully."
//                 });
//             } catch (e) {
//                 return res.status(500).send({
//                     success: false,
//                     msg: e
//                 });
//             }
//         } else {
//             return res.status(400).send({
//                 success: false,
//                 msg: "Content not update due to internal error"
//             });
//         }
//     } catch (err) {
//         return res.status(500).send({
//             success: false,
//             msg: "Content not update due to internal error"
//         });
//     }
// }

exports.getAdminCollection = async (db, req, res) => {

    await db.query(adminQueries.getAdminCollection, function (error, data) {
        if (error) {
            return res.status(400).send({
                success: false,
                msg: "Error Occured!!",
                error
            });
        }
        if (data.length > 0) {
            res.status(200).send({
                success: true,
                msg: "All Collection Details",
                response: data
            });
        } else if (data.length == 0) {
            res.status(400).send({
                success: false,
                msg: "Collection not found"
            });
        } else {
            res.status(400).send({
                success: false,
                msg: "Something went wrong due to internal error"
            });
        }
    });
}

exports.updateAdminCollection = async (db, req, res) => {
    let id = req.body.id;
    let name = req.body.name;
    let description = req.body.description;
    let banner = req.body.banner;
    let facebook = req.body.facebook;
    let insta = req.body.insta;
    let telegram = req.body.telegram;
    let twitter = req.body.twitter;
    let discord = req.body.discord;
    

    var collection = {
        "id": id,
        "name": name,
        "description": description,
        "banner": banner,
        "facebook": facebook,
        "insta": insta,
        "telegram": telegram,
        "twitter": twitter,
        "discord": discord

    }

    await db.query(adminQueries.updateAdminCollection, [collection, 1], function (error, data) {
        if (error) {
            return res.status(400).send({
                success: false,
                msg: "Error : Server is not responding please try again later",
                error
            });
        } if (data) {
            return res.status(200).send({
                success: true,
                msg: "Admin Collection Updated!!",
                data
            });
        } else {
            return res.status(400).send({
                success: false,
                msg: "Error",
                error
            });
        }
    });
}

exports.deleteAdminCollection = async (db, req, res) => {

    var id = req.body.id;

    console.log(id)
    await db.query(adminQueries.deleteAdminCollection, [id], function (error, data) {
        if (error) {
            return res.status(400).send({
                success: false,
                msg: "Error : Server not responding please try again later! ",
                error
            });
        }
        if (data) {
            res.status(200).send({
                success: true,
                msg: "Collection Removed!!!",
            });
        } else {
            res.status(400).send({
                success: false,
                msg: "No Data Found"
            });
        }
    });
}




exports.getFooter = async (db, req, res) => {

    await db.query(adminQueries.getFooter, function (error, data) {
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
                msg: "Footer details",
                response: data[0]
            });
        } else {
            res.status(400).send({
                success: false,
                msg: "No data found!!"
            });
        }
    });
}


exports.updateFooter = async (db, req, res) => {

    var description = req.body.description;
    var email = req.body.email;
    var contact = req.body.contact;

    if (description == '') {
        return res.status(400).send({
            success: false,
            msg: "Description required!!"
        });
    }

    if (email == '') {
        return res.status(400).send({
            success: false,
            msg: "Email required!!"
        });
    }
    if (!validator.validate(email)) {
        return res.status(400).send({
            success: false,
            msg: "Enter a valid email address!!"
        });
    }
    if (contact == '') {
        return res.status(400).send({
            success: false,
            msg: "Contact required!!"
        });
    }
    if (contact.length == '') {
        return res.status(400).send({
            success: false,
            msg: "Contact number length must be 10 digit!!"
        });
    }


    await db.query(adminQueries.updateFooter, [description, email, contact], function (error, data) {
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
                msg: "Footer Updated",

            });
        } else {
            res.status(400).send({
                success: false,
                msg: "No data found!!"
            });
        }
    });
}


exports.getWebContent = async (db, req, res) => {

    await db.query(adminQueries.getWebContent, function (error, data) {
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
                msg: "Web Content Details",
                response: data[0]
            });
        } else {
            res.status(400).send({
                success: false,
                msg: "No data!!"
            });
        }
    });
}

exports.updateWebContent = async (db, req, res) => {


    var form = new formidable.IncomingForm();
    form.parse(req, async function (err, fields, files) {

        if (logo == '') {
            return res.status(400).send({
                success: false,
                msg: "Logo required!!"
            });
        }
        var favicon_upload = (!files.favicon) ? null : (!files.favicon.name) ? null : files.favicon;
        var logo_upload = (!files.logo) ? null : (!files.logo.name) ? null : files.logo;
        if (title == '') {
            return res.status(400).send({
                success: false,
                msg: "Title required!!"
            });
        }
        if (description == '') {
            return res.status(400).send({
                success: false,
                msg: "Description required!!"
            });
        }

        if (!favicon_upload) {
            var favicon = '';

        } else {
            var oldpath = files.favicon.path;

            var filePath = "./uploads/"
            let newfilename = filePath + files.favicon.name

            // Read the file
            await fs.readFile(oldpath, async function (err, data) {
                if (err) throw err;
                // Write the file
                await fs.writeFile(newfilename, data, function (err) {
                    if (err) throw err;

                });
            });
            var favicon = files.favicon.name;

        }
        if (!logo_upload) {
            var logo = '';
        } else {
            var oldpath = files.logo.path;
            var filePath = "./uploads/"
            let newfilename = filePath + files.logo.name

            // Read the file
            await fs.readFile(oldpath, async function (err, data) {
                if (err) throw err;
                // Write the file
                await fs.writeFile(newfilename, data, function (err) {
                    if (err) throw err;

                })
            });
            var logo = files.logo.name;
        }


        var title = fields.title;
        var description = fields.description;

        db.query(adminQueries.getWebContent, function (error, result) {
            if (error) {
                return res.status(400).send({
                    success: false,
                    msg: "Error occured!!",
                    error
                });
            }
            var webContent = {
                "favicon": favicon,
                "logo": logo,
                "title": title,
                "description": description
            }
            if (!favicon) {
                webContent.favicon = result[0].favicon;
            }
            if (!logo) {
                webContent.logo = result[0].logo;
            }

            db.query(adminQueries.updateWebContent, webContent, function (error, data) {
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
                        msg: "Web Content Updated",

                    });
                } else {
                    res.status(400).send({
                        success: false,
                        msg: "No data found!!"
                    });
                }
            });
        });
    });

}

exports.insertMarketPlace = async (db, req, res) => {

    try {

        var form = new formidable.IncomingForm();
        form.parse(req, async function (err, fields, files) {

            if (item_image == '') {
                return res.status(400).send({
                    success: false,
                    msg: "Item image required!!"
                });
            }
            var item_image_upload = (!files.item_image) ? null : (!files.item_image.name) ? null : files.item_image;
            if (fields.title == '') {
                return res.status(400).send({
                    success: false,
                    msg: "Title required!!"
                });
            }
            if (fields.price == '') {
                return res.status(400).send({
                    success: false,
                    msg: "Price required!!"
                });
            }
            if (!item_image_upload) {
                var item_image = '';

            } else {
                var oldpath = files.item_image.path;

                var filePath = "./uploads/"
                let newfilename = filePath + files.item_image.name

                // Read the file
                await fs.readFile(oldpath, async function (err, data) {
                    if (err) throw err;
                    // Write the file
                    await fs.writeFile(newfilename, data, function (err) {
                        if (err) throw err;

                    });
                });
                var item_image = files.item_image.name;

            }
            var title = fields.title;
            var description = fields.description;
            var author = fields.author;
            var web_link = fields.web_link;
            var price = fields.price;
            var datetime = new Date();

            var users = {
                "title": title,
                "author": author,
                "description": description,
                "item_image": item_image,
                "web_link": web_link,
                "price": price,
                "datetime": datetime
            }
            db.query(adminQueries.insertMarketPlace, [users], function (error, result) {
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
                        msg: "Inserted Successfully",
                    });
                } else {
                    res.status(200).send({
                        success: true,
                        msg: "Insertion Failed",
                    });
                }
            })
        });

    } catch (err) {
        // console.log(err)
        return res.status(400).send({
            success: false,
            msg: "Unexpected internal error!!",
            err
        });
    }

}

exports.getMarketPlace = async (db, req, res) => {


    await db.query(adminQueries.getMarketPlace, function (error, data) {
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
                msg: "Market Places",
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


exports.listAdminItem = async (db, req, res) => {

    var category_id = req.body.category_id;
    var limit = req.body.limit;

    if (!category_id) {
        return res.status(400).send({
            success: false,
            msg: "category_id required!!"
        });
    }
    if (!limit) {
        return res.status(400).send({
            success: false,
            msg: "limit required!!"
        });
    }

    var qry = `Select i.id,ie.id as item_edition_id, case when length(i.name)>=30 then concat(left(i.name,30),'...') else i.name end as name,i.name as item_fullname,i.description,i.image,i.file_type,i.owner,i.item_category_id,i.token_id,ie.price,coalesce(ie.start_date,ie.datetime) as start_date,i.end_date,ie.expiry_date,ie.edition_text,ie.edition_no,ie.is_sold,concat('${config.mailUrl}backend/infinity8_backend/uploads/',i.local_image) as local_image from item_edition as ie left join item as i on i.id=ie.item_id where (ie.owner_id=1 or (ie.owner_id in (select id from users where is_featured=1) and ie.is_sold=0 )) and i.is_active=1 and ie.is_sold=0 and ie.id in (select min(id) from item_edition group by item_id,owner_id,is_sold) and (ie.expiry_date >= now() or ie.expiry_date is null) and i.is_active=1`;

    if (category_id != '0') {
        if (category_id === '-1') {
            qry = qry + ' and ie.start_date>now() and ie.start_date is not null'
        } else {
            qry = qry + ' and i.item_category_id =' + category_id;
            qry = qry + ' and (ie.start_date<now() or ie.start_date is null)';
        }
    } else {
        qry = qry + ' and (ie.start_date<now() or ie.start_date is null)';
    }

    qry = qry + ' order by ie.id desc  ';

    if (limit != '0') {
        qry = qry + ' LIMIT ' + limit
    }

    //console.log(qry);
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

exports.listSingleItem = async (db, req, res) => {

    var item_edition_id = req.body.item_edition_id;
    await db.query(adminQueries.listSingleItem, [item_edition_id], function (error, data) {
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

                response: data[0]
            });
        } else {
            res.status(400).send({
                success: false,
                msg: "No data found!!"
            });
        }
    });
}

exports.insertCategory = async (db, req, res) => {

    var name = req.body.name;
    // var nft_type_id = req.body.nft_type_id;

    if (name == '') {
        return res.status(400).send({
            success: false,
            msg: "name required!! "
        });
    }

    // if (nft_type_id == '') {
    //     return res.status(400).send({
    //         success: false,
    //         msg: "Nft Type id required!! "
    //     });
    // }

    var users = {
        "name": name,
        // "nft_type_id": nft_type_id
    }

    await db.query(adminQueries.insertCategory, [users], function (error, data) {
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
                msg: "Category Inserted!!"
            });
        } else {
            res.status(200).send({
                success: false,
                msg: "Insertion failed!!"
            });
        }
    });
}

exports.getCategory = async (db, req, res) => {
    await db.query(adminQueries.Category, function (error, data) {
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
exports.getDigitalCategory = async (db, req, res) => {
    await db.query(adminQueries.getDigitalCategory, function (error, data) {
        if (error) {
            return res.status(400).send({
                success: false,
                msg: "Error occured!!",
                error
            });
        }
        if (data) {
            return res.status(200).send({
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

exports.getUserDigitalCategory = async (db, req, res) => {
    await db.query(adminQueries.getUserDigitalCategory, function (error, data) {
        if (error) {
            return res.status(400).send({
                success: false,
                msg: "Error occured!!",
                error
            });
        }
        if (data) {
            return res.status(200).send({
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

exports.getUserRealEstateCategory = async (db, req, res) => {
    await db.query(adminQueries.getUserRealEstateCategory, function (error, data) {
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

exports.getRealEstateCategory = async (db, req, res) => {
    await db.query(adminQueries.getRealEstateCategory, function (error, data) {
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

exports.singleCategory = async (db, req, res) => {

    var id = req.body.id;

    await db.query(adminQueries.singleCategory, [id], function (error, data) {
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
                msg: "Category Single Item Details",
                response: data[0]
            });
        } else {
            res.status(200).send({
                success: false,
                msg: "No data found!!"
            });
        }
    });
}
exports.getNftType = async (db, req, res) => {
    await db.query(adminQueries.getNftType, function (error, data) {
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
                msg: "NFT type Details",
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

exports.getTransactionHistory = async (db, req, res) => {
    await db.query(adminQueries.getTransactionHistory, function (error, data) {
        if (error) {
            return res.status(400).send({
                success: false,
                msg: "Error Occured!!",
                error
            });
        }
        if (data.length > 0) {
            res.status(200).send({
                success: true,
                msg: "Transaction Details",
                response: data
            });
        } else {
            res.status(200).send({
                success: false,
                msg: "No Data Found"
            });
        }
    });
}


exports.updateCategory = async (db, req, res) => {

    var id = req.body.id;
    var name = req.body.name;
    // var nft_type_id = req.body.nft_type_id;

    if (name == '') {
        return res.status(400).send({
            success: false,
            msg: "name required!! "
        });
    }
    var users = {
        "name": name,
        // "nft_type_id": nft_type_id
    }

    await db.query(adminQueries.updateCategory, [users, id], function (error, data) {
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
                msg: "Category Item Updated!!"
            });
        } else {
            res.status(200).send({
                success: false,
                msg: "Updation failed!!"
            });
        }
    });
}

exports.addFeatured = async (db, req, res) => {
    var user_id = req.body.user_id;
    if (!user_id) {
        return res.status(400).send({
            success: false,
            msg: "user_id required!! "
        });
    }
    var updateData = {
        "is_featured": 1
    }
    await db.query(adminQueries.updateUser, [updateData, user_id], function (error, data) {
        if (error) {
            return res.status(400).send({
                success: false,
                msg: "Error occured!!",
                error
            });
        }
        else {
            res.status(200).send({
                success: true,
                msg: "User Updated!!"
            });
        }
    });
}

exports.removeFeatured = async (db, req, res) => {
    var user_id = req.body.user_id;
    if (!user_id) {
        return res.status(400).send({
            success: false,
            msg: "user_id required!! "
        });
    }
    var updateData = {
        "is_featured": 0
    }
    await db.query(adminQueries.updateUser, [updateData, user_id], function (error, data) {
        if (error) {
            return res.status(400).send({
                success: false,
                msg: "Error occured!!",
                error
            });
        }
        else {
            res.status(200).send({
                success: true,
                msg: "User Updated!!"
            });
        }
    });
}


exports.showNFT = async (db, req, res) => {
    var item_id = req.body.item_id;
    if (!item_id) {
        return res.status(400).send({
            success: false,
            msg: "item_id required!! "
        });
    }
    var updateData = {
        "is_active": 1
    }
    await db.query(adminQueries.updateItem, [updateData, item_id], function (error, data) {
        if (error) {
            return res.status(400).send({
                success: false,
                msg: "Error occured!!",
                error
            });
        }
        else {
            res.status(200).send({
                success: true,
                msg: "NFT Unhide!!"
            });
        }
    });
}

exports.hideNFT = async (db, req, res) => {
    var item_id = req.body.item_id;
    if (!item_id) {
        return res.status(400).send({
            success: false,
            msg: "item_id required!! "
        });
    }
    var updateData = {
        "is_active": 0
    }
    await db.query(adminQueries.updateItem, [updateData, item_id], function (error, data) {
        if (error) {
            return res.status(400).send({
                success: false,
                msg: "Error occured!!",
                error
            });
        }
        else {
            res.status(200).send({
                success: true,
                msg: "NFT Hided!!"
            });
        }
    });
}


exports.deleteCategory = async (db, req, res) => {

    var id = req.body.id;

    await db.query(adminQueries.deleteCategory, [id], function (error, data) {
        if (error) {
            return res.status(400).send({
                success: false,
                msg: "Error occured!!",
                error
            });
        }
        if (data.length > 0) {
            return res.status(400).send({
                success: false,
                msg: "You can not delete this category!!",
                error
            })
        }
        if (data) {
            res.status(200).send({
                success: true,
                msg: "Category Deleted!!"
            });
        } else {
            res.status(200).send({
                success: false,
                msg: "Deletion failed!!"
            });
        }
    });
}

/* -------------------Insert Item -------------------------*/

exports.insertItem = async (db, req, res) => {

    var name = req.body.name;
    var description = req.body.description;
    var image = req.body.image;
    var file_type = req.body.file_type;
    //  var owner = req.body.owner;
    var item_category_id = req.body.item_category_id;
    var price = req.body.price;
    var sell_type = req.body.sell_type;
    var user_collection_id = req.body.user_collection_id;
    var start_date = req.body.start_date;
    var end_date = req.body.end_date;
    var expiry_date = req.body.expiry_date;
    var quantity = (!req.body.quantity || req.body.quantity == 0) ? 1 : req.body.quantity;
    var ip = null;
    var datetime = new Date();
    var image_low = req.body.image;
    //   if(file_type==='image'){
    var recCompress = await ipfsCompress.compressImages(["https://ipfs.io/ipfs/" + image], file_type);
    if (recCompress.success == false) {
        // return res.status(400).send({
        //     success: false,
        //     msg: "Image compress issue "
        // });
        var image_low = image;
    } else {
        var image_low = recCompress.imageHash[0];
    }
    //  return res.json({
    //     image_low:image_low,
    //     image:image
    //  })       
    //}
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
    // if (!owner) {
    //     return res.status(400).send({
    //         success: false,
    //         msg: "owner required!! "
    //     });
    // }
    // if (!token_id) {
    //     return res.status(400).send({
    //         success: false,
    //         msg: "token_id required "
    //     });
    // }
    if (!price) {
        return res.status(400).send({
            success: false,
            msg: "price required!! "
        });
    }

    if (!quantity) {
        return res.status(400).send({
            success: false,
            msg: "quantity required!! "
        });
    }

    var users = {
        "name": name,
        "description": description,
        "image": image_low,
        "image_original": image,
        "owner": "nxft",
        "item_category_id": item_category_id,
        "price": price,
        "sell_type": sell_type,
        "created_by": 1,
        "owner_id": 1,
        "user_collection_id": user_collection_id,
        "start_date": start_date,
        "end_date": end_date,
        "expiry_date": expiry_date,
        "quantity": quantity,
        "ip": ip,
        "datetime": datetime,
        "file_type": file_type
    }

    await db.query(adminQueries.insertItem, [users], async function (error, data) {
        if (error) {
            return res.status(400).send({
                success: false,
                msg: "Error occured in insertItem!!",
                error
            });
        }

        /**---------------------------IPFS Json ---------------------------------- */
        var additem = {
            "name": name,
            "description": description,
            "image": 'ipfs://' + image
        }
        var userfile = 'item_'.concat(data.insertId, '.json');
        console.log(userfile);


        fs.writeFile(`./metadata/${userfile}`, JSON.stringify(additem), async (err, fd) => {

            // Checking for errors
            if (err) throw err;

          

         if (data) {
                / create NFT and update into table /
                var apiData = await openNFT(config.apiKey);
                const response1 = await fetch(`${config.blockchainApiUrl}mint`, {
                    method: 'POST', headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        "from_address": `${config.contractOwnerAddress}`,
                        "from_private_key": `${apiData}`,
                        "contract_address": `${config.contractAddress}`,
                        "to_address": `${config.contractOwnerAddress}`,
                        "MetaDataHash": `${filedata.data.IpfsHash}`,
                        "TokenName": `${name}`,
                        "TokenId": `${data.insertId}`,
                        "totalSupply": `${quantity}`
                    })
                });
                const data1 = await response1.json();
                //console.log(data1);
                if (!data1.hash) {
                    return res.status(400).send({
                        success: false,
                        msg: "Error occured in mint NFT!!",
                        error
                    });
                }
                //console.log(data1);
                var updateData = {
                    "token_hash": data1.hash,
                    "token_id": data.insertId
                }
                await db.query(adminQueries.updateItem, [updateData, data.insertId], async function (error, data) {
                    if (error) {
                        return res.status(400).send({
                            success: false,
                            msg: "Error occured in update item!! ",
                            error
                        });
                    }
                })

                res.status(200).send({
                    success: true,
                    msg: "Insert Item in Category Successfully "
                });
            } else {
                res.status(200).send({
                    success: false,
                    msg: "Insertion failed!!"
                });
            }
        });
    });
}

exports.getAdminItem = async (db, req, res) => {

    await db.query(adminQueries.getAdminItem, function (error, data) {
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
                msg: "Item Details",
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
exports.getAdminNFT = async (db, req, res) => {

    await db.query(adminQueries.getAdminNFT, function (error, data) {
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
                msg: "Item Details",
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
exports.getPrivacypolicy = async (db, req, res) => {
    await db.query(adminQueries.getPrivacypolicy, function (error, data) {
        if (error) {
            return res.status(400).send({
                success: false,
                msg: "Error Occured",
                error
            });
        }
        if (data.length > 0) {
            res.status(200).send({
                success: true,
                msg: "Privacy policies of NXFT",
                response: data
            });
        } else {
            res.status(200).send({
                success: false,
                msg: "No Data found!!"
            });
        }
    });
}

exports.updateprivacyAndPolicy = async (db, req, res) => {
    var id = 1;
    var privacy_policy = req.body.privacy_policy;

    try {
        var arr = {
            'privacy_policy': privacy_policy
        }
        let updated = await db.query(adminQueries.updateprivacyAndPolicy, [arr, id]);
        if (updated) {
            try {
                return res.status(200).send({
                    success: true,
                    msg: "Content updated!!"
                });

            } catch (e) {
                return res.status(500).send({
                    success: false,
                    msg: e
                });
            }
        } else {
            return res.status(400).send({
                success: false,
                msg: "Content not update due to internal error"
            });
        }

    } catch (err) {
        return res.status(500).send({
            success: false,
            msg: "Content not update due to internal error"
        });
    }
}
exports.getTermsConditions = async (db, req, res) => {
    await db.query(adminQueries.getTermsConditions, function (error, data) {
        if (error) {
            return res.status(400).send({
                success: false,
                msg: "Error Occured",
                error
            });
        }
        if (data.length > 0) {
            res.status(200).send({
                success: true,
                msg: "Privacy policies of NXFT",
                response: data
            });
        } else {
            res.status(200).send({
                success: false,
                msg: "No Data found!!"
            });
        }
    });
}
exports.updateTermsConditions = async (db, req, res) => {
    var id = 1;
    var terms_conditions = req.body.terms_conditions;

    try {
        var arr = {
            'terms_conditions': terms_conditions
        }
        let updated = await db.query(adminQueries.updateTermsConditions, [arr, id]);
        if (updated) {
            try {
                return res.status(200).send({
                    success: true,
                    msg: "Content updated!!"
                });

            } catch (e) {
                return res.status(500).send({
                    success: false,
                    msg: e
                });
            }
        } else {
            return res.status(400).send({
                success: false,
                msg: "Content not update due to internal error"
            });
        }

    } catch (err) {
        return res.status(500).send({
            success: false,
            msg: "Content not update due to internal error"
        });
    }
}
exports.getAbout = async (db, req, res) => {
    await db.query(adminQueries.getAbout, function (error, data) {
        if (error) {
            return res.status(400).send({
                success: false,
                msg: "Error Occured",
                error
            });
        }
        if (data.length > 0) {
            res.status(200).send({
                success: true,
                msg: "Privacy policies of NXFT",
                response: data
            });
        } else {
            res.status(200).send({
                success: false,
                msg: "No Data found!!"
            });
        }
    });
}
exports.getAddress = async (db, req, res) => {
    await db.query(adminQueries.getAddress, function (error, data) {
        if (error) {
            return res.status(400).send({
                success: false,
                msg: "Error occured",
                error
            });
        }
        if (data.length > 0) {
            res.status(200).send({
                success: true,
                msg: "Address",
                response: data
            });
        } else {
            res.status(400).send({
                success: false,
                msg: "No Data Found"
            })
        }
    })
}
exports.updateAbout = async (db, req, res) => {
    var id = 1;
    var about = req.body.about;

    try {
        var arr = {
            'about': about
        }
        let updated = await db.query(adminQueries.updateAbout, [arr, id]);
        if (updated) {
            try {
                return res.status(200).send({
                    success: true,
                    msg: "Content updated!!"
                });

            } catch (e) {
                return res.status(500).send({
                    success: false,
                    msg: e
                });
            }
        } else {
            return res.status(400).send({
                success: false,
                msg: "Content not update due to internal error"
            });
        }

    } catch (err) {
        return res.status(500).send({
            success: false,
            msg: "Content not update due to internal error"
        });
    }
}
exports.getItem = async (db, req, res) => {

    await db.query(adminQueries.getItem, function (error, data) {
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
                msg: "Item Details",
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

exports.updateWallet = async (db, req, res) => {
    var user_id = req.body.user_id;
    var public = req.body.public;
    var private = req.body.private;

    var updateData = {
        public: public,
        private: private
    }
    await db.query(adminQueries.updateWallet, [updateData, user_id], function (error, data) {
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
                msg: "Wallet Updated!!",

            });
        } else {
            res.status(400).send({
                success: false,
                msg: "Something Wrong due to internal Error"
            });
        }
    });
}


exports.updateItem = async (db, req, res) => {

    let item_id = req.body.item_id;
    let user_collection_id = req.body.user_collection_id
    let item_category_id = req.body.item_category_id;
    let price = req.body.price;
    let is_trending = req.body.is_trending;
    let is_on_sale = req.body.is_on_sale;
    let is_banner = req.body.is_banner;

    if (!price) {
        return res.status(400).send({
            success: false,
            msg: "Price required!! "
        });
    }
   
    var updateData = {
        "item_category_id": item_category_id,
        "price": price,
        "user_collection_id": user_collection_id,
        "is_trending": is_trending,
        "is_on_sale" : is_on_sale,
        "is_banner" : is_banner
    }

    await db.query(adminQueries.updateItem, [updateData, item_id], function (error, data) {
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
                msg: "NFT data Updated!! "
            });
        } else {
            res.status(200).send({
                success: false,
                msg: "Updation failed!!"
            });
        }
    });

}

exports.deleteItem = async (db, req, res) => {

    var id = req.body.id;
    if (!id) {
        return res.status(400).send({
            success: false,
            msg: "id required!! "
        });
    }

    await db.query(adminQueries.deleteItem, [id], function (error, data) {
        if (error) {
            return res.status(400).send({
                success: false,
                msg: "You can't delete NFT purchased by other or in bid process!!",
                error
            });
        }
        if (data) {
            res.status(200).send({
                success: true,
                msg: "Item Deleted!!"
            });
        } else {
            res.status(200).send({
                success: false,
                msg: "Deletion failed!!"
            });
        }
    });
}


exports.getUsers = async (db, req, res) => {
    await db.query(adminQueries.getUsers, function (error, data) {
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
                msg: "Users Details",
                response: data
            });
        } else {
            res.status(200).send({
                success: false,
                msg: "No data found"
            });
        }
    });
}

exports.getRealEstateUsers = async (db, req, res) => {

    await db.query(adminQueries.getRealEstateUsers, function (error, data) {
        if (error) {
            return res.status(400).send({
                success: false,
                msg: "error occured!!",
                error
            });
        }
        if (data.length > 0) {
            res.status(200).send({
                success: true,
                msg: "Real estate user Detail!!",
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

exports.getTelentUsers = async (db, req, res) => {

    await db.query(adminQueries.getTelentUsers, function (error, data) {
        if (error) {
            return res.status(400).send({
                success: false,
                msg: "error occured!!",
                error
            });
        }
        if (data.length > 0) {
            res.status(200).send({
                success: true,
                msg: "Telent User Details",
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


exports.deleteUser = async (db, req, res) => {

    var id = req.body.id;
    if (id == '') {
        return res.status(400).send({
            success: false,
            msg: "ID required!! "
        });
    }

    await db.query(adminQueries.deleteUser, [id], function (error, data) {
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
                msg: "User Deleted!!"
            });
        } else {
            res.status(200).send({
                success: false,
                msg: "Deletion failed!!"
            });
        }
    });
}



exports.dashboardItem = async (db, req, res) => {

    await db.query(adminQueries.dashItem, function (error, data) {
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
                msg: "Item Details",
                response: data[0]
            });
        } else {
            res.status(200).send({
                success: false,
                msg: "No data found!!"
            });
        }
    });
}


exports.getProfilePic = async (db, req, res) => {
    var email = req.body.email;

    await db.query(adminQueries.getProfile, [email], function (error, data) {
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
                msg: "Profile Pic",
                response: data[0]
            });
        } else {
            res.status(204).send({
                success: false,
                msg: "No data found!!"
            });
        }
    });
}

exports.insertProfilePic = async (db, req, res) => {

    try {
        var form = new formidable.IncomingForm();
        form.parse(req, async function (err, fields, files) {

            if (profile_pic == '') {
                return res.status(400).send({
                    success: false,
                    msg: "Profile_pic required!!"
                });
            }
            var profile_pic_upload = (!files.profile_pic) ? null : (!files.profile_pic.name) ? null : files.profile_pic;

            if (!profile_pic_upload) {
                var profile_pic = '';

            } else {
                var oldpath = files.profile_pic.path;

                var filePath = "./uploads/"
                let newfilename = filePath + files.profile_pic.name

                // Read the file
                await fs.readFile(oldpath, async function (err, data) {
                    if (err) throw err;
                    // Write the file
                    await fs.writeFile(newfilename, data, function (err) {
                        if (err) throw err;

                    });
                });
                var profile_pic = files.profile_pic.name;
            }
            var email = fields.email;
            if(!profile_pic || profile_pic == null){
                var profile_pic = fields.old_profile_pic;
            }
            db.query(adminQueries.updateProfile, [profile_pic, fields.full_name ,email], function (error, result) {
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
                        msg: "Profile Updated!!",
                    });
                } else {
                    res.status(200).send({
                        success: true,
                        msg: "update Profile Failed",
                    });
                }
            })
        });

    } catch (err) {
        // console.log(err)
        return res.status(400).send({
            success: false,
            msg: "Unexpected internal error!!",
            err
        });
    }

}



exports.changePassword = async (db, req, res) => {

    var email = req.body.email;
    var currentPassword = req.body.currentPassword;
    var password = req.body.password;
    var password2 = req.body.password2;

    try {
        if (currentPassword == '') {
            return res.status(400).send({
                success: false,
                msg: "Current password required!! "
            });
        }

        if (password == '') {
            return res.status(400).send({
                success: false,
                msg: "New password required!! "
            });
        }
        if (password2 == '') {
            return res.status(400).send({
                success: false,
                msg: "Re-type password required!! "
            });
        }
        if (password != password2) {
            return res.status(400).send({
                success: false,
                msg: "New password and re-type password not match!!"
            });
        }
        if (password.length < 6) {
            return res.status(400).send({
                success: false,
                msg: "password length should be 6 characters or more!!"
            });
        }



        db.query(adminQueries.getPassword, [email], function (error, result) {

            if (error) {
                return res.status(400).send({
                    success: false,
                    msg: "error occured in getPassword",
                    error
                });
            }
            // console.log('result',result);
            const hashpassword = CryptoJS.SHA256(currentPassword).toString(CryptoJS.enc.Hex);
            if (result[0].password == hashpassword) {

                const newpassword = CryptoJS.SHA256(password).toString(CryptoJS.enc.Hex);

                db.query(adminQueries.updatepassword, [newpassword, email], function (error, result) {
                    if (error) {
                        return res.status(400).send({
                            success: false,
                            msg: "error occured in updatepassword!!",
                            error
                        });
                    }
                    if (result) {
                        return res.status(200).send({
                            success: true,
                            msg: "Password Changed!!"
                        })
                    } else {
                        return res.status(400).send({
                            success: false,
                            msg: "Password Changed Failed due to Error"
                        })
                    }
                });
            } else {
                return res.status(200).send({
                    success: false,
                    msg: "Current Password Wrong"
                })

            }
        });
    }
    catch (err) {
        //  console.log(err)
        return res.status(400).send({
            success: false,
            msg: "Unexpected internal error!!",
            err
        });
    }

}


exports.getRealEstateImage = async (db, req, res) => {

    await db.query(adminQueries.getRealEstateImage, function (error, data) {
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
                msg: "Real estate images!!",
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

exports.updateRealEstateImage = async (db, req, res) => {

    var id = req.body.id;
    var slider1 = (!req.files['slider1']) ? null : req.files['slider1'][0].filename;
    var slider2 = (!req.files['slider2']) ? null : req.files['slider2'][0].filename;
    var slider3 = (!req.files['slider3']) ? null : req.files['slider3'][0].filename;
    var text1 = req.body.text1;
    var text2 = req.body.text2;
    var text3 = req.body.text3;

    await db.query(adminQueries.getRealEstateImage, async function (error, result1) {
        if (error) {
            return res.status(400).send({
                success: false,
                msg: "Error occured!!",
                error
            });
        }

        if (!slider1) {
            slider1 = result1[0].slider1;
        }
        if (!slider2) {
            slider2 = result1[0].slider2;
        }
        if (!slider3) {
            slider3 = result1[0].slider3;
        }

        if (!text1) {
            text1 = result1[0].text1;
        }
        if (!text2) {
            text2 = result1[0].text2;
        }
        if (!text3) {
            text3 = result1[0].text3;
        }

        var users = {
            "slider1": slider1,
            "slider2": slider2,
            "slider3": slider3,
            "text1": text1,
            "text2": text2,
            "text3": text3
        }
        //console.log(users)
        await db.query(adminQueries.updateRealEstateImage, [users, id], function (error, data) {
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
                    msg: "Real estate images and text updated!!",

                });
            } else {
                res.status(400).send({
                    success: false,
                    msg: "No data found!!"
                });
            }
        });
    });
}

exports.userDetail = async (db, req, res) => {
    var id = req.body.id
    if (id == '') {
        return res.status(400).send({
            success: false,
            msg: "user id required"
        });
    }
    await db.query(adminQueries.getSingleUserDetail, [id], function (error, data) {
        if (error) {
            return res.status(400).send({
                success: false,
                msg: "Error : Server not responding please try again later",
                error
            });
        }
        if (data.length > 0) {
            res.status(200).send({
                success: true,
                msg: "All User Details",
                response: data[0]
            });
        } else {
            res.status(400).send({
                success: false,
                msg: "No Data"
            });
        }
    })
}
exports.getUserTransaction = async (db, req, res) => {
    console.log("in getUserCollection");
    var user_id = req.body.user_id;
    await db.query(adminQueries.getUserTransaction, [user_id, user_id], function (error, data) {
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
                msg: "User Transaction Details",
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


// exports.insertSupport = async (db, req, res) => {
//     console.log("in insertSupport");
//     var category_id = req.body.category_id;
//     var question = req.body.question;
//     var answer = req.body.answer;
//     // var datetime = req.body.datetime;
//     var ip = req.body.ip;
//     var datetime = new Date();

//     var contact_us = {
//         "category_id": category_id,
//         "question": question,
//         "answer": answer,
//         "ip": ip,
//         "datetime": datetime
//     }
//     await db.query(adminQueries.insertSupport, [contact_us], function (error, data) {
//         if (error) {
//             return res.status(400).send({
//                 success: false,
//                 msg: "Error occured!!",
//                 error
//             });
//         }
//         if (data) {
//             res.status(200).send({
//                 success: true,
//                 msg: "Data updated successfully !!",
//             });
//         } else {
//             res.status(400).send({
//                 success: false,
//                 msg: "Something Wrong due to internal Error"
//             });
//         }
//     });
// }


// exports.updateSupport = async (db, req, res) => {
//     var category_id = req.body.category_id;
//     var question = req.body.question;
//     var answer = req.body.answer;

//     var updateSupport = {
//         question: question,
//         answer: answer,
//     }
//     await db.query(adminQueries.updateSupport, [updateSupport, category_id], function (error, data){
//         if (error) {
//             return res.status(400).send({
//                 success : false, 
//                 msg : "Error Occured!!",
//                 error
//             });
//         } if (data) {
//             res.status(200).send({
//                 success : true,
//                 msg : "Support Updated Successfully!!",

//             });
//         } else {
//             res.status(400).send({
//                 success : false,
//                 msg : "Something went wrong due to internal Error"
//             });
//         }
//     });
// }


// exports.deleteSupport = async (db, req, res) => {

//     var category_id = req.body.category_id;

//     await db.query(adminQueries.deleteSupport, [category_id], function (error, data) {
//         if (error) {
//             return res.status(400).send({
//                 success: false,
//                 msg: "Error occured!!",
//                 error
//             });
//         }
//         if (data.length > 0) {
//             return res.status(400).send({
//                 success: false,
//                 msg: "You can not delete this category!!",
//                 errro
//             })
//         }
//         if (data) {
//             res.status(200).send({
//                 success: true,
//                 msg: "Category Item Deleted Successfully "
//             });
//         } else {
//             res.status(200).send({
//                 success: false,
//                 msg: "Deletion failed!!"
//             });
//         }
//     });
// }





exports.getSupportCategory = async (db, req, res) => {
    console.log("in getSupportCategory");
    await db.query(adminQueries.getSupportCategory, function (error, data) {
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
                msg: "Support categories list!!",
                data: data
            });
        } else {
            res.status(400).send({
                success: false,
                msg: "No data found!!"
            });
        }
    });
}


exports.insertSupport = async (db, req, res) => {
    console.log("in insertSupport");
    var category_id = req.body.category_id;
    var question = req.body.question;
    var answer = req.body.answer;
    // var datetime = req.body.datetime;
    var ip = req.body.ip;
    var datetime = new Date();

    var support = {
        "category_id": category_id,
        "question": question,
        "answer": answer,
        "ip": ip,
        "datetime": datetime
    }
    await db.query(adminQueries.insertSupport, [support], function (error, data) {
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
                msg: "Data added!!",
            });
        } else {
            res.status(400).send({
                success: false,
                msg: "Something Wrong due to internal Error"
            });
        }
    });
}


exports.updateSupport = async (db, req, res) => {
    var support_id = req.body.support_id;
    var category_id = req.body.category_id;
    var question = req.body.question;
    var answer = req.body.answer;

    var updateSupport = {
        category_id: category_id,
        question: question,
        answer: answer,
    }
    await db.query(adminQueries.updateSupport, [updateSupport, support_id], function (error, data) {
        if (error) {
            return res.status(400).send({
                success: false,
                msg: "Error Occured!!",
                error
            });
        } if (data) {
            res.status(200).send({
                success: true,
                msg: "Support Updated!!",

            });
        } else {
            res.status(400).send({
                success: false,
                msg: "Something went wrong due to internal Error"
            });
        }
    });
}


exports.deleteSupport = async (db, req, res) => {

    var support_id = req.body.support_id;

    await db.query(adminQueries.deleteSupport, [support_id], function (error, data) {
        if (error) {
            return res.status(400).send({
                success: false,
                msg: "Error occured!!",
                error
            });
        }
        else {
            res.status(200).send({
                success: true,
                msg: "Support Deleted!!"
            });
        }
    });
}


exports.supportList = async (db, req, res) => {
    await db.query(adminQueries.supportList, function (error, data) {
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
                msg: "Support detail!! ",
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

exports.supportListById = async (db, req, res) => {
    var support_id = req.body.support_id;
    await db.query(adminQueries.supportListById, [support_id], function (error, data) {
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
                data: data[0]
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

exports.getWithdrawHistory = async (db, req, res) => {
    await db.query(adminQueries.getWithdrawHistory, function (error, data) {
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
                msg: "Users Details",
                response: data
            });
        } else {
            res.status(200).send({
                success: false,
                msg: "No data found"
            });
        }
    });
}
exports.getFees = async (db, req, res) => {
    await db.query(adminQueries.getFees, function (error, data) {
        if (error) {
            return res.status(400).send({
                success: false,
                msg: "Error Occured!!",
                error
            });
        }
        if (data.length > 0) {
            res.status(200).send({
                success: true,
                msg: "Fees",
                response: data
            });
        } else {
            res.status(200).send({
                success: false,
                msg: "No Data Found"
            });
        }
    });
}

exports.updateFees = async (db, req, res) => {
    let id = 1;
    let bid_increase_percentage = req.body.bid_increase_percentage;
    let admin_commission = req.body.admin_commission
    try {
        let updated = await db.query(adminQueries.updateFees, [bid_increase_percentage,admin_commission, id]);
        if (updated) {
            try {
                return res.status(200).send({
                    success: true,
                    msg: "Fees updated!!"
                });
            } catch (e) {
                return res.status(500).send({
                    success: false,
                    msg: e
                });
            }
        } else {
            return res.status(400).send({
                success: false,
                msg: "Content not update due to internal error"
            });
        }
    } catch (err) {
        return res.status(500).send({
            success: false,
            msg: "Content not update due to internal error"
        });
    }
}
exports.insertAdminCollection = async (db, req, res) => {
    var profile_pic = (!req.files['profile_pic']) ? null : req.files['profile_pic'][0].filename;
    var banner = (!req.files['banner']) ? null : req.files['banner'][0].filename;
    var name = req.body.name;
    var description = req.body.description;
    var user_id = req.body.user_id;
    var website = req.body.website;
    var facebook = req.body.facebook;
    var insta = req.body.insta;
    var telegram = req.body.telegram;
    var twitter = req.body.twitter;
    var discord = req.body.discord;
    var dataArr = {
        "user_id": '1',
        "name": name,
        "description": description,
        "profile_pic": profile_pic,
        "banner": banner,
        "website": website,
        "facebook": facebook,
        "insta": insta,
        "telegram": telegram,
        "twitter": twitter,
        "discord": discord
    }
    await db.query(adminQueries.insertAdminCollection, [dataArr], function (error, data) {
        if (error) {
            console.log(error);
            return res.status(400).send({
                success: false,
                msg: "Something want wrong, Please try again!",
                error
            });
        }
        if (data) {
            res.status(200).send({
                success: true,
                msg: "Collection created!!"
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
    // var email = req.body.email;
    // var user_id = req.body.user_id;
    console.log({ collection_id })


    await db.query(adminQueries.getCollectionItemCount, [collection_id], async function (error, cnt) {
        if (cnt[0].itemCount > 0) {
            return res.status(400).send({
                success: false,
                msg: "You can't delete collection if any NFT exists in it !!"
            });
        }
        await db.query(adminQueries.deleteUserCollection, [collection_id], function (error, data) {
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


exports.addUserCollectionFeatured = async (db, req, res) => {
    var id = req.body.id;
    var is_featured = req.body.is_featured;
    if (!id) {
        return res.status(400).send({
            success: false,
            msg: "id required!! "
        });
    }
    if (is_featured === '1') {
        var is_featured1 = 1
    } else {
        var is_featured1 = 0
    }
    var updateData = {
        "is_featured": is_featured1
    }
    await db.query(adminQueries.addUserCollectionFeatured, [updateData, id], function (error, data) {
        if (error) {
            return res.status(400).send({
                success: false,
                msg: "Error occured!!",
                error
            });
        } else {
            res.status(200).send({
                success: true,
                msg: "Added in featured!!"
            });
        }
    });
}

exports.addOnSale = async (db, req, res) => {
    var id = req.body.id;
    var is_on_sale = req.body.is_on_sale;

    if (!id) {
        return res.status(400).send({
            success: false,
            mag: "id required!!"
        });
    } if (is_on_sale === '1') {
        var is_on_sale = 1
    } else {
        var is_on_sale = 0
    }
    var updateDate = {
        "is_on_sale": is_on_sale
    }
    await db.query(adminQueries.addOnSale, [updateDate, id], function (error, data) {
        if (error) {
            return res.status(400).send({
                success: false,
                msg: "Error Occured!!",
                error
            });
        } else {
            res.status(200).send({
                success: true,
                msg: "Added In Sale"
            })
        }
    })
}








exports.addAdminCollectionFeatured = async (db, req, res) => {
    var id = req.body.id;
    var is_featured = req.body.is_featured;
    if (!id) {
        return res.status(400).send({
            success: false,
            msg: "id required!! "
        });
    }
    var updateData = {
        "is_featured": is_featured
    }
    await db.query(adminQueries.addAdminCollectionFeatured, [updateData, id], function (error, data) {
        if (error) {
            return res.status(400).send({
                success: false,
                msg: "Error occured!!",
                error
            });
        } else {
            res.status(200).send({
                success: true,
                msg: "Added in featured!!"
            });
        }
    });
}

exports.updateUserNftBanner = async (db, req, res) => {
    let id = req.body.id;
    let is_banner = req.body.is_banner;
    if (!id) {
        return res.status(400).send({
            success: false,
            msg: "id required!! "
        });
    }
    let updateData = {
        "is_banner": is_banner
    }
    await db.query(adminQueries.updateItem, [updateData, id], function (error, data) {
        if (error) {
            return res.status(400).send({
                success: false,
                msg: "Error occured!!",
                error
            });
        } else {
            res.status(200).send({
                success: true,
                msg: "Added in banner!!"
            });
        }
    });
}

exports.addUserNftFeatured = async (db, req, res) => {
    var id = req.body.id;
    var is_featured = req.body.is_featured;
    console.log('is_featured', is_featured)
    if (!id) {
        return res.status(400).send({
            success: false,
            msg: "id required!! "
        });
    }
    var updateData = {
        "is_featured": is_featured
    }
    await db.query(adminQueries.addUserNftFeatured, [updateData, id], function (error, data) {
        if (error) {
            return res.status(400).send({
                success: false,
                msg: "Error occured!!",
                error
            });
        } else {
            res.status(200).send({
                success: true,
                msg: "Added in featured!!"
            });
        }
    });
}


exports.addAdminNftFeatured = async (db, req, res) => {
    var id = req.body.id;
    var is_featured = req.body.is_featured;
    console.log('is_featured', is_featured)
    if (!id) {
        return res.status(400).send({
            success: false,
            msg: "id required!! "
        });
    }
    // var updateData = {
    //     "is_featured": is_featured
    // }
    await db.query(adminQueries.addAdminNftFeatured, [is_featured, id], function (error, data) {
        if (error) {
            return res.status(400).send({
                success: false,
                msg: "Error occured!!",
                error
            });
        } else {
            res.status(200).send({
                success: true,
                msg: "Added in featured!!"
            });
        }
    });
}

exports.userInativate = async (db, req, res) => {

    let id = req.body.id;
    console.log(id)
    await db.query(adminQueries.userActivate, [id], function (error, data) {
        if (error) {
            return res.status(400).send({
                success: false,
                msg: "Error : Server not responding please try again later! ",
                error
            });
        }
        if (data) {
            res.status(200).send({
                success: true,
                msg: "User Inactive Successfully",

            });
        } else {
            res.status(400).send({
                success: false,
                msg: "Un-Block User Error"
            });
        }
    });
}
exports.userActive = async (db, req, res) => {

    let id = req.body.id;
    // console.log(id)
    await db.query(adminQueries.userInactive, [id], function (error, data) {
        if (error) {
            return res.status(400).send({
                success: false,
                msg: "Error : Server not responding please try again later! ",
                error
            });
        }
        if (data) {
            res.status(200).send({
                success: true,
                msg: "User Active Successfully",

            });
        } else {
            res.status(400).send({
                success: false,
                msg: "Block User Error"
            });
        }
    });
}

exports.userCollectionVerifiedTag = async (db, req, res) => {
    var id = req.body.id;
    var is_verified = req.body.is_verified;
    // console.log('is_verified', is_verified)
    if (!id) {
        return res.status(400).send({
            success: false,
            msg: "id required!! "
        });
    }
    var updateData = {
        "is_verified": is_verified
    }
    await db.query(adminQueries.userCollectionVerifiedTag, [updateData, id], function (error, data) {
        if (error) {
            return res.status(400).send({
                success: false,
                msg: "Error occured!!",
                error
            });
        } {
            res.status(200).send({
                success: true,
                msg: "Verified tag addedd!!"
            });
        }
    });
}
exports.updateNftByUser = async (db, req, res) => {
    console.log("in updateNftByUser");
    var user_id = req.body.user_id;
    var id = req.body.id;
    var royaltie = req.body.royaltie;
    var price = req.body.price;
    var sell_type = req.body.sell_type;
    var start_date = req.body.start_date;
    var expiry_date = req.body.expiry_date;

    if (sell_type == 3) {
        var users = {
            "royalty_percent": royaltie,
            is_on_sale: 0,
            sell_type: null,
            price: null,
            start_date: null,
            expiry_date: null
        }
    }
    else {
        var users = {
            "royalty_percent": royaltie,
            is_on_sale: 1,
            sell_type: sell_type,
            price: price,
            start_date: start_date,
            expiry_date: expiry_date
        }
    }
    //console.log(users);
    await db.query(adminQueries.updateItem, [users, id], async function (error, data) {
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
                msg: "NFT Details Updated!!",
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

exports.getOnSale = async (db, req, res) => {
    await db.query(adminQueries.getOnSale, function (error, data) {
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


exports.getUserNftById = async (db, req, res) => {


    var id = req.body.id;

    await db.query(adminQueries.getUserNftById, [id],function (error, data) {
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
                msg: "NFT Details",
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















exports.updateUserNft = async (db, req, res) => {
    var image = (!req.files['image']) ? null : req.files['image'][0].filename;
    var old_profile_pic = req.body.old_profile_pic;
    // var collection_id = req.body.collection_id;
    var is_active = req.body.is_active;
    var description = req.body.description;
    var is_on_sale = req.body.is_on_sale;
    var royalty_percent = req.body.royalty_percent;
    var price = req.body.price;
    var name = req.body.name;
    var item_category = req.body.item_category;
    var file_type = req.body.file_type;

    if (!image) {
        image = image
    }



    var dataArr = {
        "name": name,
        "description": description,
        "profile_pic": profile_pic,
        "is_active": is_active,
        "is_on_sale" : is_on_sale,
        "royalty_percent" : royalty_percent,
        "price" : price,
        "item_category" : item_category,
        "file_type" : file_type

      
    }
    await db.query(adminQueries.updateUserCollection, [dataArr, collection_id], function (error, data) {
        if (error) {
            console.log(error);
            return res.status(400).send({
                success: false,
                msg: "Something went wrong, Please try again!",
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

exports.hideCollection = async (db, req, res) => {
    var id = req.body.id;
    if (!id) {
        return res.status(400).send({
            success: false,
            msg: "id required!! "
        });
    }
    var updateData = {
        "is_hide": 1
    }
    await db.query(adminQueries.hideCollection, [updateData, id], function (error, data) {
        if (error) {
            return res.status(400).send({
                success: false,
                msg: "Error occured!!",
                error
            });
        }
        else {
            res.status(200).send({
                success: true,
                msg: "Collection hided!!"
            });
        }
    });
}

exports.showCollection = async (db, req, res) => {
    var id = req.body.id;
    if (!id) {
        return res.status(400).send({
            success: false,
            msg: "id required!! "
        });
    }
    var updateData = {
        "is_hide": 0
    }
    await db.query(adminQueries.showCollection, [updateData, id], function (error, data) {
        if (error) {
            return res.status(400).send({
                success: false,
                msg: "Error occured!!",
                error
            });
        }
        else {
            res.status(200).send({
                success: true,
                msg: "Collection unhided!!"
            });
        }
    });
}

exports.getTransactionFee = async (db, req, res) => {
    await db.query(adminQueries.getTransactionFee, function (error, data) {
        if (error) {
            return res.status(400).send({
                success: false,
                msg: "Error Occured!!",
                error
            });
        }
        if (data.length > 0) {
            res.status(200).send({
                success: true,
                msg: "Transaction Fee",
                response: data
            });
        } else {
            res.status(200).send({
                success: false,
                msg: "No Data Found"
            });
        }
    });
}

exports.updateTransactionFee = async (db, req, res) => {
    var id = 1;
    var sale_price_percent = req.body.sale_price_percent;
    var minimum_transaction_fee = req.body.minimum_transaction_fee;
    try {
        
        let updated = await db.query(adminQueries.updateTransactionFee, [sale_price_percent,minimum_transaction_fee, id]);
        if (updated) {
            try {
                return res.status(200).send({
                    success: true,
                    msg: "Transaction fees updated!!"
                });
            } catch (e) {
                return res.status(500).send({
                    success: false,
                    msg: e
                });
            }
        } else {
            return res.status(400).send({
                success: false,
                msg: "Content not update due to internal error"
            });
        }
    } catch (err) {
        return res.status(500).send({
            success: false,
            msg: "Content not update due to internal error"
        });
    }
}


exports.createNewPolicy = async (db, req, res) => {
    console.log("in createNewPolicy");
    var user_id = req.body.user_id;
    try{
        await db.query(adminQueries.userWallet, [user_id] , async function (error, walletDetails) {
            if (error) {
                return res.status(400).send({
                    success: false,
                    msg: "Wallet not found!!"
                });
            }else if(walletDetails.length > 0){
                var walletName = walletDetails[0].wallet_name
                const response1 = await fetch(`${config.cardanoAPI}create-policyid`, {
                    method: 'POST', headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        "wallet_name": walletName
                    })
                });
                const data1 = await response1.json();
                if(data1.code == 200 && data1.status == true){
                    return res.status(200).send({
                        success: true,
                        msg: "Policy id created!!",
                        policy_id : data1.policy_id
                    });
                }else{
                    return res.status(400).send({
                        success: false,
                        msg: "Something Wrong due to internal Error!!"
                    });
                }
            }else{
                return res.status(400).send({
                    success: false,
                    msg: "Wallet not found!!"
                });            
            }  
            });
    }catch(err){
        return res.status(400).send({
            success: false,
            msg: "Wallet not found!!"
        }); 
    }
}


exports.getGamesCategory = async (db, req, res) => {
    await db.query(adminQueries.gamesCategory, function (error, data) {
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


exports.singleGamesCategory = async (db,req,res)=>{

    var id = req.body.id;

await db.query(adminQueries.singleGamesCategory,[id],function(error,data){
            if(error){
            return res.status(400).send({
                success: false,
                msg: "Error occured!!",
                error
            });
        }
            if(data.length>0){
        res.status(200).send({
            success:true,
            msg : "Category Single Item Details",
            response:data[0]
         });
            }else{
                res.status(200).send({
                    success:false,
                    msg:"No data found!!"
                });            
            }
        });
        }

exports.updateGamesCategory = async (db, req, res) => {
    var name = req.body.name;
    var id =  req.body.id;
    var updateData = {
        name: name
    }
    await db.query(adminQueries.updateGamesCategory, [updateData, id], function (error, data) {
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
                msg: "Games Category updated!!",

            });
        } else {
            res.status(400).send({
                success: false,
                msg: "Something Wrong due to internal Error"
            });
        }
    });
}

exports.deleteGamesCategory = async (db, req, res) => {

    var id = req.body.id;

    await db.query(adminQueries.deleteGamesCategory, [id], function (error, data) {
        if (error) {
            return res.status(400).send({
                success: false,
                msg: "Error occured!!",
                error
            });
        }
        if (data.length > 0) {
            return res.status(400).send({
                success: false,
                msg: "You can not delete this category!!",
                errro
            })
        }
        if (data) {
            res.status(200).send({
                success: true,
                msg: "Category Item Deleted!!"
            });
        } else {
            res.status(200).send({
                success: false,
                msg: "Deletion failed!!"
            });
        }
    });
}

exports.insertGamesCategory = async (db, req, res) => {

    var name = req.body.name;
    console.log('name',name)
    // var nft_type_id = req.body.nft_type_id;

    if (name == '') {
        return res.status(400).send({
            success: false,
            msg: "name required!! "
        });
    }

    // if (nft_type_id == '') {
    //     return res.status(400).send({
    //         success: false,
    //         msg: "Nft Type id required!! "
    //     });
    // }

    var users = {
        "name": name,
        // "nft_type_id": nft_type_id
    }

    await db.query(adminQueries.insertGamesCategory, [users], function (error, data) {
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
                msg: "Games Category Inserted!! "
            });
        } else {
            res.status(200).send({
                success: false,
                msg: "Insertion failed!!"
            });
        }
    });
}

exports.getBidDetailForAdmin = async (db, req, res) => {
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




exports.updateTransaction = async (db, req, res) => {
    var id = req.body.id;
    var order_status = req.body.order_status;

    try {
        var arr = {
            'order_status': order_status
        }
        let updated = await db.query(adminQueries.updateTransaction, [arr, id]);
        if (updated) {
            try {
                return res.status(200).send({
                    success: true,
                    msg: "Order status updated!!"
                });

            } catch (e) {
                return res.status(500).send({
                    success: false,
                    msg: e
                });
            }
        } else {
            return res.status(400).send({
                success: false,
                msg: "Content not update due to internal error"
            });
        }

    } catch (err) {
        return res.status(500).send({
            success: false,
            msg: "Content not update due to internal error"
        });
    }
}



//==========================================  Verify physical Nft  ===========================

exports.verifyPhysicalNft = async (db, req, res) => {
    var item_id = req.body.item_id;
    var is_physical_approved = req.body.is_physical_approved;

    var updateData = {
        is_physical_approved: is_physical_approved,
    }
    await db.query(adminQueries.verifyPhysicalNft, [updateData, item_id], function (error, data) {
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
                msg: "This Physical Nft is Approved!!",

            });
        } else {
            res.status(400).send({
                success: false,
                msg: "Something Wrong due to internal Error"
            });
        }
    });
}













/* -------------------End Item -------------------------*/
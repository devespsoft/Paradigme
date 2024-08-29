var db = require('../utils/connection');

module.exports = {
    getUserAddress : "SELECT * FROM users WHERE address = ?",
    insertUserData : "insert into users SET ?",
    aboutDetail :  "Select * from users where id = ?",


 






    getUsersEmail : "select u.*,coalesce(uw.id,0) as wallet_id,uw.public from users as u left join user_wallet as uw on uw.user_id=u.id where u.email = ?",

    updateStatus : "update users SET is_email_verify=1 where email=?",
    updatepassword : "update users SET password=? where id = ?",
    resetpassword : "update users SET password=? where email = ?",
    updateUser : "Update users SET ? where email=?",    
    getCountry : "Select id,name,code from country order by name",
    getUserProfile : "Select u.id as user_id,u.full_name,u.user_name,u.full_name,u.profile_pic,u.banner,u.email,follower_count(u.id) as follower_count,following_count(u.id) as folling_count,view_count(u.id) as view_count, date_format(u.dob,'%Y-%m-%d') as dob,u.phone,u.country_id,c.name as country_name,u.description,u.facebook,u.insta,u.twitter,u.pinterest,u.website,u.youtube,u.artstation,u.behance,u.steemit from users as u left join country as c on c.id=u.country_id where u.email=?",
    getPassword : "Select password from users where id =?",
    updateAccount : "Update users SET deactivate_account=1 where email=?",
    updateProfile : "update users SET profile_pic=?,banner=?  where email=?",
    getProfile :  "Select full_name,profile_pic,banner,email,user_name from users where email=?",

    getUserdetails :  "Select * from users where id = ?",
    updateaboutDetail :  "update users SET ? where id = ?",
    
    createUserWallet : "insert into user_wallet SET ?",
}

var db = require('../utils/connection');
const config = require('../config');
 
module.exports = {
    getWalletDetail: "select u.user_name, uw.user_id,uw.wallet_name,uw.wallet_password,uw.public,uw.private,coalesce(sum(t.amount),0) as balance from user_wallet as uw left join transaction as t on t.user_id=uw.user_id and t.status=1 and transaction_type_id in (1,6,3,5,10,8,11) left join users as u on uw.user_id=u.id where uw.user_id= ? group by uw.user_id,uw.public ",
    userWallet: "Select * from user_wallet where user_id =?",
    getUsersProfile : "SELECT * FROM users ORDER BY id DESC",
    adminWallet: "Select * from admin_wallet",
    insertTransaction: "insert into transaction SET ?",
    withdrawDepositList: "SELECT t.id as transaction_id,t.amount,tt.name as transaction_type,t.transaction_type_id,u.full_name,t.to_address,t.currency,date_format(t.datetime,'%d-%M-%y') as transaction_date,ts.name as status,t.hash   FROM transaction as t left join transaction_status as ts on ts.id=t.status left join users as u on u.id=t.user_id left join transaction_type as tt on tt.id=t.transaction_type_id where t.user_id=? and t.transaction_type_id in(3,11) and t.amount<>0 order by t.id desc",
    getTransactionDetail: "Select i.name as item_name,i.image,i.file_type,case when i.transfer_hash is not null then concat('https://etherscan.io/tx/',i.transfer_hash) else t.receipt_url end as transfer_hash,u.user_name,u.profile_pic,t.*,'' as edition_text,abs(t.amount) as amount,date_format(t.datetime,'%d-%M-%y %H:%i:%s') as datetime,case when t.status=0 then 'Pending' when t.status=1 then 'Completed' else 'Rejected' end as status,tc.name as type_name from transaction as t left join item as i ON i.id=t.item_id  LEFT JOIN users as u ON i.owner_id=u.id LEFT JOIN transaction_type as tc ON t.transaction_type_id=tc.id where t.id=? ORDER BY t.id DESC limit 1",
    insertUserCollection: "insert into user_collection SET ?",
    deleteUserCollection: "Delete from user_collection  where id=?",
    updateUserCollection: "update user_collection SET ?  where id=? ",
    getSingleUserCollection: "Select *,id as collection_id from user_collection where id=?",
    getSingleCollectionDetails: "SELECT user_collection.max_nft_supply , COUNT(item.id) as totalNft, user_collection.policy_id FROM user_collection LEFT JOIN item on user_collection.id = item.user_collection_id WHERE user_collection.id = ? ",
    category: "select ic.id,ic.name,getCategoryItem(ic.id) as nft_count from item_category as ic order by ic.name",
    insertItem: "insert into item SET ?",
    getItemLike: "select * from item_like where item_id= ? and user_id = ?",
    deleteItemLike: "DELETE from item_like where item_id= ? and user_id = ?",
    insertItemLike: "INSERT INTO item_like SET ?",
    getSubscriber: "Select * from subscriber where email=?",
    addSubscriber: "insert into subscriber SET ?",    
    insertContacts: "insert into contact_us SET ?",
    getContact: "Select * from contact_us",
    insertHelp: "insert into help_center SET ?",
    getHelp: "Select * from help_center",
    insertRoyaltyTransactionByItemId: "INSERT INTO transaction (user_id,item_id,transaction_type_id,amount,currency,status) select i.created_by,i.id,8 as transaction_type_id,? as price,'ETH' AS currency,1 as status from item as i where i.id=?",
    bidReversal: "INSERT INTO transaction (user_id,item_id,transaction_type_id,amount,currency,status) select ib.user_id,ib.item_id,16 as transaction_type_id,ib.bid_price as price,'ETH' AS currency,1 as status from item_bid as ib where ib.item_id=? and status=0",

    insertBuyTransactionByItemId: "INSERT INTO transaction (user_id,item_id,transaction_type_id,amount,status,hash, currency, to_address )select ?,i.id,3,? as price, 1, ?, ?, ? from item as i where i.id =?",

    updateSold: "update item  SET  is_sold = ?,owner_id=?,is_on_sale=0 where id=?",

    insertSellTransactionByItemId: "INSERT INTO transaction (user_id,item_id,transaction_type_id,amount,hash ,currency,status, to_address) select i.owner_id,i.id,1 as transaction_type_id, ? as price,? as hash,? AS currency,1  as status, ? as to_address from item as i where i.id=?",

    getSettingData: "select * from settings",
    insertBid: "insert into item_bid SET ?",
    putOnSale: "update item set is_on_sale=1 , is_sold=0 where id=?",
    putOnSale1: "update item set ? where id=?",
    removeOnSale: "update item set is_on_sale=0, is_sold=1 where id=?",
    deleteNFT: "update item set is_active=0 where id=?",
    getUserBids: "select ib.id as bid_id,t.id as transaction_id,u.id as user_id,u.full_name,u.email,i.id as item_id, i.blockchainType ,i.name as item_name,i.description,i.image,i.file_type,ib.bid_price,case when ib.status=2 then 'Cancelled' else case when getMaxBid(i.id, i.owner_id)> ib.bid_price then 'Outbid' else  case when ib.status=0 then 'Pending' when ib.status=1 then 'Accepted' else 'Outbid' end end end as status,ib.status as status_id,date_format(ib.datetime,'%d-%M-%y') as bid_datetime,date_format(i.datetime,'%d-%M-%y') as nft_datetime,cu.full_name as creator,ou.full_name as owner_name,i.price as item_price,getMaxBid(i.id, i.owner_id) as max_bid,ou.id as owner_id from transaction as t inner join  item_bid as ib on ib.transaction_id=t.id  and ib.user_id=? left join item as i on i.id=ib.item_id left join users as u on u.id=ib.user_id  left join users as cu on cu.id=i.created_by left join users as ou on ou.id=i.owner_id  where t.user_id=? and t.transaction_type_id=4  order by ib.id desc",
    myBidItem: "SELECT i.id as item_id,i.name as item_name, i.blockchainType ,i.description,i.image,i.file_type,ic.name as item_category,i.price,date_format(i.datetime,'%d-%M-%y') as create_date,uc.id as collection_id,uc.name as collection_name,getMaxBid(i.id, i.owner_id) as max_bid from  item as i left join item_category as ic on ic.id=i.item_category_id left join user_collection as uc on uc.id=i.user_collection_id where i.owner_id=? and i.is_sold=0 and i.id in (select distinct item_id from item_bid where status=0 ) order by i.id desc",
    
    cancelBid: "UPDATE item_bid set status=2 where id = ?",
    getMarketActivity: "select t.id as transaction_id,case when tt.id=6 then 'Purchased for ' when tt.id=4 then 'Placed an offer for ' when tt.id =1 then 'Sell Product' when tt.id=3 then 'Accepted bid offer for  ' when tt.id=9 then 'Published for resell ' when tt.id=12 then 'Transafer NFT ' when tt.id=13 then 'Received NFT ' when tt.id=1 then 'Accept Bid ' end as transaction_type,abs(t.amount) as amount,date_format(t.datetime,'%d %M %Y') as transaction_date,t.item_id,i.name,i.image, i.blockchainType,u.full_name,u.profile_pic,u.id as user_id From transaction as t left join transaction_type as tt on tt.id=t.transaction_type_id left join item as i on i.id =t.item_id left join users as u on u.id=t.user_id where i.id=? and transaction_type_id in (1, 3,4) and t.status=1 union ALL select 0 as transaction_id,'Minted NFT' as transaction_type,i.price,date_format(i.datetime,'%d %M %Y') as transaction_date,i.id as item_id,i.name,i.image,i.blockchainType,u.full_name,u.profile_pic,u.id as user_id from item as i left join users as u on u.id=i.created_by where i.id=? order by transaction_id desc",
    checkBid: "select * from item_bid where item_id=? and status=0",
    getItemBidDetail: "select t.id as transaction_id,case when tt.id=6 then 'Purchased for ' when tt.id=4 then 'Placed an offer for ' when tt.id=2 then 'Accepted bid offer for  ' when tt.id=9 then 'Published for resell ' end as transaction_type,abs(t.amount) as amount,date_format(t.datetime,'%d %M %Y') as transaction_date,t.item_id,i.name,i.image,u.full_name,u.profile_pic,u.id as user_id From transaction as t left join transaction_type as tt on tt.id=t.transaction_type_id left join item as i on i.id =t.item_id left join users as u on u.id=t.user_id where i.id=? and transaction_type_id in (4) and t.status=1 order by t.id desc",
    getBidDetail: "Select bd.id as bid_id,u.id as user_id,u.user_name,u.full_name,u.profile_pic,i.id as item_id, i.token_id ,i.name as item_name,bd.bid_price,DATE_FORMAT(bd.datetime,'%d-%M-%Y %H:%i:%s') AS datetime from item_bid as bd left join item as i ON i.id = bd.item_id LEFT JOIN users as u ON bd.user_id=u.id  where bd.id in (select max(id) from item_bid where item_id= ? and status=0 group by user_id) order by bd.id desc, bd.user_id Desc",
    supportListByCategory: "select s.id as support_id,sc.id as category_id,sc.name as support_category, s.question,s.answer from support as s left join support_category as sc on sc.id=s.category_id where sc.id=?",
    getBidRecord: "select *,isResale(item_id) as is_resale, users.address as to_address from item_bid LEFT JOIN users on item_bid.user_id = users.id where item_bid.id = ?",
    ownerDetail: "select uw.user_id,uw.wallet_name,uw.wallet_password,uw.public,uw.private,isResale(?) as is_resale from user_wallet as uw where uw.user_id in (select owner_id from item where id=?)",
    insertSellTransactionByBidId: "INSERT INTO transaction (user_id,item_id,transaction_type_id,amount,hash,currency,status,item_bid_id)select i.owner_id as user_id,i.id as item_id,1 as transaction_type_id,ib.bid_price*.1 as amount,?, 'ETH' as currency,1 as status,ib.id as item_bid_id from item_bid  as ib left join item as i on i.id=ib.item_id where ib.id =?",
    updateSold2: "update item SET  is_sold = ?, is_on_sale=0, owner_id=? where id=?",
    updateItemBid: "update item_bid set status=3  where item_id=? and id<>? and status=0",
    updateItemBid2: "update item_bid set status=1  where  id=?",
    insertBuyTransactionByBidId: "INSERT INTO transaction (user_id,item_id,item_bid_id,transaction_type_id,hash,currency,status,amount)select ?,item_id,id,3,?,'ETH',1,bid_price*-1 from item_bid where id =?",
    getUserTransaction: "SELECT t.id as transaction_id,tt.name as transaction_type,t.transaction_type_id,u.full_name,i.id as item_id,i.name as item_name, i.file_type ,i.description,i.image,abs(t.amount) as amount,t.currency,date_format(t.datetime,'%d-%M-%y') as transaction_date  FROM transaction as t left join users as u on u.id=t.user_id left join  item as i on i.id=t.item_id left join transaction_type as tt on tt.id=t.transaction_type_id where t.user_id=? order by t.id desc limit 20",
    getRoyaltyTransaction: "SELECT t.id as transaction_id,tt.name as transaction_type,t.transaction_type_id,u.full_name,i.id as item_id,i.name as item_name,i.description,i.image,abs(t.amount),t.currency,date_format(t.datetime,'%d-%M-%y') as transaction_date,i.file_type,concat(i.royalty_percent,'%') as royalty_percent  FROM transaction as t left join users as u on u.id=t.user_id left join item as i on i.id=t.item_id left join transaction_type as tt on tt.id=t.transaction_type_id where t.user_id=? and t.transaction_type_id=8 and amount>0 order by t.id desc",
    bidStatusChange: "Update item_bid set status=? where item_id=? and status=0",
    getExpiredBid: "select i.id as item_id,i.name,i.description,i.expiry_date,count(ib.id) as bid_count,max(bid_price) as bid_price,max(ib.id) as max_bid_id  from item as i left join item_bid as ib on ib.item_id=i.id where  i.sell_type=2 and i.expiry_date<now() and i.is_sold=0 group by i.id,i.name,i.description,i.expiry_date;",
    getBidData: "select * from item_bid where id =?",
    checkExpiry: "select sum(is_expired) as is_expired from (select 0 as is_expired union all select case when (expiry_date>now() or expiry_date is null or expiry_date='0000-00-00 00:00:00') then 0 else 1 end as is_expired from item where id =?) as a;",
    updateTransaction: "update transaction SET ? where id =?",
    getSettings: "select * from settings",
    getPublicCollection: "Select uc.id as collection_id, uc.facebook, uc.insta,uc.telegram,uc.twitter,uc.discord, DATE_FORMAT(uc.datetime, '%Y-%m-%d') as datetime ,uc.name, uc.profile_pic, uc.banner, u.full_name as creater_name, u.profile_pic as user_profile, u.id as userid from user_collection as uc LEFT JOIN users as u ON uc.user_id = u.id where uc.is_hide = 0 order by uc.id desc",
    getCollectionCategoryNft: "SELECT * FROM user_collection",
    getUserCollection: "Select uc.id as collection_id, uc.facebook, uc.insta,uc.telegram,uc.twitter,uc.discord, DATE_FORMAT(uc.datetime, '%Y-%m-%d') as datetime ,uc.name, uc.profile_pic, uc.banner, u.full_name as creater_name, u.profile_pic as user_profile, u.id as userid from user_collection as uc LEFT JOIN users as u ON uc.user_id = u.id where uc.user_id =? order by uc.id desc ",

    //=========================================================================================
    ///     NEW CODE STARTS HERE
    /// ---------------------------------------------------
    getItemAll: "select count(id) as nft_count, sum(case when sell_type=2 then 1 else 0 end) as auction_count,count(distinct created_by)  as creator_count from item",
    getBannerNFT :"select i.id,i.file_type,i.name,i.sell_type,i.image,i.price,u.full_name as created_by,u.profile_pic,date_format(i.expiry_date,'%Y-%m-%d') as expiry_date from item as i left join users as u on u.id=i.created_by where i.is_banner=1 limit 2",
    updateItem:"update item set ? where id =?",
    itemView: "insert into item_view set ?",
    itemdetail: `SELECT i.id as item_id,i.royaltiesAddress, bidExist(i.id,i.owner_id) as bidexist ,i.blockchainType ,i.asset_id, i.is_minted ,i.minimum_bid ,i.user_collection_id, i.file_type ,date_format(i.expiry_date,'%d %M %Y %H:%i:%s') as expiry_date,date_format(i.expiry_date,'%Y-%m-%d') as expiry_date1, i.start_date, i.is_sold,i.owner_id as user_id,itemViewCount(i.id) as view_count,case when length(i.name)>=30 then concat(left(i.name,30),'...')  else i.name end as name,i.description,i.image,i.image_original,i.metadata,i.file_type,uo.full_name as owner,uo.profile_pic as owner_profile_pic,i.owner_id,i.created_by,uc.full_name as creator,uc.profile_pic as creator_profile_pic,i.item_category_id,i.sell_type,i.nft_type_select, case when i.sell_type=1 then 'Buy' else 'Place a bid' end as sell_type_name,ic.name as category_name,i.token_id,i.token_hash,i.price, case when iel.id is null then 0 else 1 end as is_liked,itemLikeCount(i.id) as like_count,concat(case when i.price>coalesce(bi.bid_price,0) then i.price else bi.bid_price end,'') as max_bid,case when i.start_date<=CURRENT_DATE or i.start_date is null  then 'Live' else 'Upcoming' end as nft_type,date_format(i.start_date,'%Y-%m-%d') as start_date1,i.end_date,isResale(i.id) as is_resale,concat('${config.mailUrl}backend/uploads/',i.local_image) as local_image,itemViewCount(i.id) as view_count,itemLikeCount(i.id) as like_count,'${config.contractAddress}' as contract_address,round(i.price,2) as usd_price,'BEP-721' as standard, 'Cardano' as blockchain,i.royalty_percent,coalesce(getAllCollectionItem(cl.id),0)as item_count,coalesce(getCollectionOwners(cl.id),0) as owner_count,coalesce(getCollectionFloorPrice(cl.id),0) as floor_price,coalesce(getCollectionTradeVolume(cl.id),0) as trad_volume,cl.id as collection_id,cl.name as collection_name,cl.policy_id as collection_policy_id, concat('${config.mailUrl}backend/uploads/',cl.profile_pic) as collection_pic,i.is_on_sale,i.txHash from item as i left join item_category as ic on ic.id=i.item_category_id  LEFT JOIN item_like as iel on iel.item_id=i.id and iel.user_id= ? left join (select item_id,max(bid_price) as bid_price from  item_bid where item_id=? and status=0) as bi on bi.item_id=i.id left join users as uo on uo.id=i.owner_id left join users as uc on uc.id=i.created_by LEFT JOIN user_collection as cl ON cl.id = i.user_collection_id  where i.id = ? and i.is_active=1`,

    getDashboardCount : "SELECT count(i.id) as nfts, (SELECT COUNT(id) FROM user_collection) as totalCollection, (SELECT COUNT(id) FROM users) as totalUsers FROM `item` as i WHERE i.is_active=1 and i.is_sold=0 and i.is_minted = 1 and i.sell_type<>3 and i.is_on_sale<>0  and (i.expiry_date is null or i.expiry_date>now() or i.expiry_date='0000-00-00 00:00:00') and (i.start_date='0000-00-00 00:00:00' or i.start_date<=now() or i.start_date is null)",

    getItemDetails : "SELECT * FROM item WHERE id = ?",

    getNftDetailsActivity : "SELECT t.id, t.user_id,t.transaction_type_id, abs(t.amount) as amount, t.currency as blockchainType, DATE_FORMAT(t.datetime, '%d-%m-%Y %H:%i:%s') as transaction_date, tt.name as transaction_type, u.full_name, u.address FROM transaction as t LEFT JOIN transaction_type as tt ON t.transaction_type_id = tt.id LEFT JOIN users as u ON t.user_id = u.id WHERE t.transaction_type_id IN(2,3,4,5,7,8,16) and t.item_id = ? ORDER BY t.id DESC",

    updateShippingAddress : "update transaction SET ? where id=? ",


}
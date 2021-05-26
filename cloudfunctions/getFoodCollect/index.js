// 云函数入口文件
const cloud = require('wx-server-sdk');
cloud.init();

const db = cloud.database();

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext();
  const { pageIndex = 1, pageSize = 10 } = event;
  const dbRes = await db.collection('FoodGiInfo').where({
    collecter: wxContext.APPID,
  }).limit(pageSize).get();

  return {
    returnCode: 0,
    returnMsg: 'success',
    returnData: dbRes
  }
}
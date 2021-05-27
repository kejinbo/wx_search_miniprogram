// 云函数入口文件
const cloud = require('wx-server-sdk');
cloud.init();

const db = cloud.database();

// 云函数入口函数
exports.main = async (event, context) => {
  try {
    const wxContext = cloud.getWXContext();
    const { pageIndex = 1, pageSize = 10 } = event;
    const dbRes = await db.collection('FoodGiInfo').where({
      collecter: wxContext.APPID,
    }).limit(pageSize).get();
    console.log(dbRes);
    if (dbRes.errMsg === 'collection.get:ok') {
      return {
        returnCode: 0,
        returnMsg: 'success',
        returnData: dbRes.data
      }
    } else {
      throw new Error('查询失败');
    }
  } catch (e) {
    return {
      returnCode: -1,
      returnMsg: e.message || '服务器错误，请稍后重试'
    }
  }
}
// 云函数入口文件
const cloud = require('wx-server-sdk');
cloud.init();

const db = cloud.database();
const _ = db.command;

// 云函数入口函数
exports.main = async (event, context) => {
  try {
    const wxContext = cloud.getWXContext();
    const { selectData } = event;
    const params = JSON.parse(selectData);

    const filderCondition = {
      foodId: [],
      collecter: wxContext.APPID
    };
    params.forEach(item => {
      item.collecter = wxContext.APPID;
      let temp = item.id;
      filderCondition.foodId.push(temp);
      item.foodId = temp;
      delete item.id;
    });
    // 查询已收藏的信息
    const searchCollectList = await db.collection('FoodGiInfo').where({
      foodId: _.in(filderCondition.foodId),
      collecter: _.eq(filderCondition.collecter)
    }).get();
    // 去除收藏过的信息，将需要收藏的添加到列表
    const { data: searchData } = searchCollectList;
    const collectList = [];
    for(let i = 0; i < params.length; i ++){
      const index = searchData.findIndex(item => params[i].foodId === item.foodId);
      if(index < 0){
        collectList.push(params[i]);
      }
    };
    if(collectList.length < 1) return {returnCode: -1, returnMsg: '该配置已收藏'}
    // 添加收藏到数据库
    const addRes = await db.collection('FoodGiInfo').add({
      data: collectList
    });
    if(addRes.errMsg === 'collection.add:ok'){
      return {
        returnCode: 0,
        returnMsg: 'success'
      }
    } else {
      throw new Error('收藏失败');
    }
  } catch (e) {
    return {
      returnCode: -1,
      returnMsg: e.message || '服务器错误，请稍后重试'
    }
  }
}
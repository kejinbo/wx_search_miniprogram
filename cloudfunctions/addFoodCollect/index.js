// 云函数入口文件
const cloud = require('wx-server-sdk');
cloud.init();

const db = cloud.database();

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext();
  const { selectData } = event;
  const params = JSON.parse(selectData);
  params.forEach(item => {
    item.collecter = wxContext.APPID;
    let temp = item.id
    item.foodId = temp;
    delete item.id;
  });

  console.log(params);
  
  return await db.collection('FoodGiInfo').add({
    data: params
  })
}
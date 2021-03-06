const webpack = require('webpack')
const path = require('path')
const appData = require('./data')
const seller = appData.seller
const goods = appData.goods
const ratings = appData.ratings

function resolve(dir){
  return path.join(__dirname,dir);
}

module.exports = {
  devServer:{
    before(app) {
      app.get('/api/seller', function(req, res){
        res.json({
          errno: 0,
          data: seller
        })
      })
      app.get('/api/goods', function(req, res){
        res.json({
          errno: 0,
          data: goods
        })
      })
      app.get('/api/ratings', function(req, res){
        res.json({
          errno: 0,
          data: ratings
        })
      })
    }
  }
}

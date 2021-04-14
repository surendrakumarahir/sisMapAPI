const db = require('_helpers/db');
const apiResponse = require("_helpers/apiResponse");


exports.getAllData= function(req, res) {

    let limit;
    let pageNumber = req.params.pageNumber || 0;
    req.params.limit < 0 || req.params.limit == undefined ? limit = 10 : limit = req.params.limit;
    let skip = parseInt(limit) * parseInt(pageNumber) ;
  db.connection.query(
    'select * FROM pemilih_2012 limit ' + skip + ','+ limit,
    async function (err, results) {
      if (err) {
        console.log("error", err);
        return false;

      }
      if(results.length){
        let normalResults = results.map((mysqlObj) => {
            return Object.assign({}, mysqlObj);
          });
        let count = await db.connection.query('select count(*) from pemilih_2012');
        count = count[0][0]['count(*)'];
        apiResponse.successResponseWithData(res,"Success",normalResults,count)
      }else{
        apiResponse.noRecordFound(res,"No record found in DB");
      }
    }
  );
}


exports.getData = function(req, res) {

    let limit;
    let pageNumber = req.params.pageNumber || 0;
    req.params.limit < 0 || req.params.limit == undefined ? limit = 10 : limit = req.params.limit;
    let skip = parseInt(limit) * parseInt(pageNumber) ;
    let queryString = req.body.name || "";
  db.connection.query(
    "select * from pemilih_2012 where nama like '%"+queryString+"%' limit " + skip + ','+ limit,
    async function (err, results) {
      if (err) {
        console.log("error", err);
        return false;

      }
      if(results.length){
        let normalResults = results.map((mysqlObj) => {
            return Object.assign({}, mysqlObj);
          });
        let count = await db.connection.query('select count(*) from pemilih_2012');
        count = count[0][0]['count(*)'];
        apiResponse.successResponseWithData(res,"Success",normalResults,count)
      }else{
        apiResponse.noRecordFound(res,"No record found in DB");
      }
    }
  );
}


exports.getUserData = function(req, res) {
    if(req.params.id){
        let queryString = req.params.id;
        db.connection.query(
          "select * from pemilih_2012 where id="+queryString,
          async function (err, results) {
            if (err) {
              console.log("error", err);
              return false;
      
            }
            if(results.length){
              let normalResults = results.map((mysqlObj) => {
                  return Object.assign({}, mysqlObj);
                });
              apiResponse.successResponseWithData(res,"Success",normalResults,1)
            }else{
              apiResponse.noRecordFound(res,"No record found in DB");
            }
          }
        );
    }else{
        apiResponse.ErrorResponse(res,"User id is required");
    }    
}
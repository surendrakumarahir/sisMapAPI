const config = require('config.json');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const crypto = require("crypto");
const { Op } = require('sequelize');
const sendEmail = require('_helpers/send-email');
const db = require('_helpers/db');
const Role = require('_helpers/role');
const fs = require("fs");
const NodeGeocoder = require('node-geocoder');
// let count = getCount();
let count =0;

async function getById() {
  // console.log("service", db);
  //  const result = await db.Pemilih.findByPk(1);
  let elementToSkip = 100;
  let skip = count * elementToSkip;
  db.connection.query(
    'select Count(id) Count FROM pemilih_2012 Group By Poskod limit ' + skip + ','+ elementToSkip,
    async function (err, results, fields) {
      if (err) {
        console.log("error", err);
        return false;

      }
      // console.log("Query res: ",results);
      if (results.length) {
        // console.log("Raw query result :",results); // results contains rows returned by server
        let normalResults = results.map((mysqlObj, index) => {
          return Object.assign({}, mysqlObj);
        });
        // // console.log("Query in json:",normalResults);
        // for(let i=0;i<10;i++){
        //   setTimeout(()=>{
        //     var promiseArray= [];
        //     var i, j, chunk = 5;
        //     for (i = 0, j = elementToSkip; i < j; i += chunk) {
        //       promiseArray.push(updateData(normalResults.slice(i, i + chunk)));
        //     }
        //     Promise.all(promiseArray);
        //     getById();
        //   },i*2000);
        // }
        // .then(() => {   getById();        });

        // await updateData(normalResults).then(() => {
        //   getById();
        //   console.log("Count: ", count);
        // });
        console.log("Query results: ",normalResults);
        while(normalResults.length){
          fs.appendFileSync("results.json", JSON.stringify(normalResults) + ",",(err)=>{
            if (err) {
              console.log(err);
            }
          });
          console.log(count++);
          getById();
        }        
        return "Done";
      } else {
        return "All id's updated";
      }
    }
  );
}

const updateData = async (normalResults) => {

  const options = {
    provider: 'google',
    // Optional depending on the providers
    // fetch: customFetchImplementation,
    apiKey: 'AIzaSyAqITkMCv4OZZ2sn8df0iZNDPxjwL5TK0c', // for Mapquest, OpenCage, Google Premier
    formatter: null // 'gpx', 'string', ...
  };
  //console.log(normalResults);
  const geocoder = NodeGeocoder(options);
  const promises =
    normalResults.map(async (item) => {
      // console.log(item);
      // console.log(`${item.Alamat1} ${item.Alamat2||''} ${item.Alamat3||''} ${item.Bandar||''} ${item.Negeri||''}`);
      const option = {
        address: `${item.Alamat1} ${item.Alamat2 || ''} ${item.Alamat3 || ''} ${item.Bandar || ''} ${item.Negeri || ''}`,
        country: 'Malaysia',
      }
      if (item.Poskod) {
        option.zipcode = item.Poskod;
      }
      let res = await geocoder.geocode(option);
      if (res.length) {
        // console.log(res);
        //   updateLatLongById ({ id: item.id, lat: res[0].latitude, long: res[0].longitude });
        return { id: item.id, lat: res[0].latitude, long: res[0].longitude }
        // count++;
      } else {
        fs.appendFile("db_update_fail.csv", String(item.id) + ",",(err)=>{
          if (err) {
            console.log(err);
          }
        });
        return {};
      }
      // console.log(count); 
      // count++;      
      //  if(res.length){
      //    console.log(item.id, res[0].latitude, res[0].longitude);
      //  }
    });
  //updateLatLongById ({ id: item.id, lat: res[0].latitude, long: res[0].longitude });
  const allResult = await Promise.all(promises);
// console.log(allResult);
  let items = [];

  allResult.map(item => {
    if (item.hasOwnProperty("id")) {
      count++;
      console.log("Count: ", count);
      items.push({ id: item.id, lat: item.lat, long: item.long });
      // return updateLatLongById({ id: item.id, lat: item.lat, long: item.long });
    }
  });
  console.log(items);
  const finalUpdate = updateDB(items);
  const updateAll = await Promise.all(finalUpdate);

  // console.log('promise all', updateAll);
  // updateLatLongById ({ id: item.id, lat: res[0].latitude, long: res[0].longitude });
  // allResult.forEach((item) => {
  //   if(!(Object.keys(item).length === 0 && item.constructor === Object)){
  //     updateLatLongById(item);
  //     count++;
  //   }
  // });
  // console.log(count);
  //return getById();
  return false;

  // console.log(res);
}

const updateLatLongById = (item) => {
  return new Promise((resolve, reject) => {
    db.connection.query(
      'UPDATE pemilih_2012 set latitude ='+ item.lat +' , longitude ='+ item.long +'  WHERE id = ' + item.id,
      function (err, results, fields) {
        // console.log("update");
        if (err) {
          console.log("error", err);
          // return false;
          reject(false);
        }
        // console.log("updated");
        fs.appendFileSync("db_update.csv", String(item.id) + ",",(err)=>{
          if (err) {
            console.log(err);
          }
        });
        //return true;
        resolve(true);
      }
    );
  })


  //  return results;
}

const updateDB = (items) => {
  return new Promise((resolve, reject) => {
    let vals= '',ids= '';
    items.forEach(item =>{
      vals=vals+'('+item.id+','+item.lat+','+item.long+'),';
      ids= ids+String(item.id)+',';
    });
    vals= vals.slice(0, -1);
    db.connection.query(
      'INSERT INTO pemilih_2012 (id, latitude, longitude) VALUES '+vals+' ON DUPLICATE KEY UPDATE latitude= VALUES(latitude),longitude = VALUES(longitude)',
      function (err, results, fields) {
        // console.log("update");
        if (err) {
          console.log("error", err);
          // return false;
          reject(false);
        }
        // console.log("updated");
        fs.appendFileSync("db_update.csv", String(ids),(err)=>{
          if (err) {
            console.log(err);
          }
        });
        //return true;
        resolve(true);
      }
    );
  })


  //  return results;
}

function getCount() {
  let count = fs.readFileSync("db_update.csv", { encoding: 'utf8', flag: 'r' });
  let count1 = fs.readFileSync("db_update_fail.csv", { encoding: 'utf8', flag: 'r' });
  count = count.split(",");
  count1 = count1.split(",");
  count.pop();
  count1.pop();
  console.log("Total success: ",count.length)
  console.log("Total fails: ",count1.length);
  console.log("Records updated: ",count.length + count1.length);
  return (count.length + count1.length);
}

module.exports = {
  getById,
};
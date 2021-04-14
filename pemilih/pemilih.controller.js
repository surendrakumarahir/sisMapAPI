const express = require('express');
const router = express.Router();
// const Joi = require('joi');
const pemilihService = require('./pemilih.service');
const pemilihHelpers = require("./pemilih.helpers");

// routes
router.get('/getData', getById);

router.get('/searchAll/:limit/:pageNumber', getAllData);

router.get('/user/:id', getUserData);

router.post('/search/:limit/:pageNumber', getData);

module.exports = router;

// function getAll(req, res, next) {
//     accountService.getAll()
//         .then(accounts => res.json(accounts))
//         .catch(next);
// }

async function getById(req, res) {
    console.log("controler");
   
   await pemilihService.getById().then(response => {
        
        console.log("response", response);
        res.send(response);
        res.end();
    }).catch(error => {
        console.log("error", error);
    })
}

function getAllData(req, res,next){
    return pemilihHelpers.getAllData(req, res,next);
}


function getData(req, res,next){
    return pemilihHelpers.getData(req, res,next);
}

function getUserData(req, res,next){
    return pemilihHelpers.getUserData(req, res,next);
}
const express = require('express');
const router = express.Router();
const experiments = {

};
/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('P5/p5', {
        name:'test',
        extraScripts:[],
        externalScripts:[],
        cssStyles:[],
    })
});

module.exports = router;
const express = require('express')
const router = express.Router()
const { v4: uuidv4 } = require('uuid')

const multer = require('multer')
const upload = multer({ dest: 'uploads/' })

const passport = require('passport')

const postings = [{
    "id": uuidv4(),
    "title": "Samsung Smartphone",
    "category": "Phones",
    "location": "Oulu",
    "images": "URL placeholder",
    "askingPrice": "300",
    "dateOfPosting": "2022-02-21",
    "deliveryType": "Shipping",
    "sellerName": "John Doe",
    "sellerContactInfo": "john.doe@gmail.com"
},
{
    "id": uuidv4(),
    "title": "SLR camera",
    "category": "Cameras",
    "location": "Helsinki",
    "images": "URL placeholder",
    "askingPrice": "450",
    "dateOfPosting": "2022-02-25",
    "deliveryType": "Pickup",
    "sellerName": "Jaska Jokunen",
    "sellerContactInfo": "j.jokunen@gmail.com"
}]
/*
router.get('/', passport.authenticate('jwt', {session: false}), (req, res) => {
    res.json(postings);
})

router.get('/:id', (req, res) => {
    let foundIndex = postings.findIndex(t => t.id === req.params.id);

    if(foundIndex === -1) {
        res.sendStatus(404);
    } else {
        res.json(postings[foundIndex]);
    }
})
*/
router.get('/search', (req, res) => {
    console.log(req.query.location);
    const foundPostings = postings.filter(t => (t.location == req.query.location) || (t.dateOfPosting == req.query.dateOfPosting) || (t.category == req.query.category));
    if(foundPostings) {
        res.json(foundPostings)
        res.sendStatus(202);
    } else {
        console.log(req.query);
        req.sendStatus(404);
    }
})

router.delete('/:id', passport.authenticate('jwt', {session: false}), (req, res) => {
    let foundIndex = postings.findIndex(t => t.id === req.params.id);

    if(foundIndex === -1) {
        res.sendStatus(404);
    } else {
        postings.splice(foundIndex, 1);
        res.sendStatus(202);
    }
})
/*
router.post('/upload', upload.single('image'), function (req, res, next) {
    console.log(req.file);
    console.log(req.body);

    var today = new Date();
    var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
    postings.push({
        id: uuidv4(),
        title: req.body.title,
        category: req.body.category,
        location: req.body.location,
        images: req.file.filename,
        askingPrice: req.body.askingPrice,
        dateOfPosting: date,
        deliveryType: req.body.deliveryType,
        sellerName: req.body.sellerName,
        sellerContactInfo: req.body.sellerContactInfo
    });

    res.sendStatus(200);
})
*/
router.post('/', passport.authenticate('jwt', {session: false}), (req, res) => {
    console.log(req.body);

    var today = new Date();
    var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
    postings.push({
        id: uuidv4(),
        title: req.body.title,
        category: req.body.category,
        location: req.body.location,
        images: req.body.images,
        askingPrice: req.body.askingPrice,
        dateOfPosting: date,
        deliveryType: req.body.deliveryType,
        sellerName: req.body.sellerName,
        sellerContactInfo: req.body.sellerContactInfo
    });

    res.sendStatus(201);
})

router.put('/:id', passport.authenticate('jwt', {session: false}), (req, res) => {
    let foundPosting = postings.find(t => t.id === req.params.id);

/*    if(foundPosting) {
        foundPosting.title = req.body.title;
        foundPosting.category = req.body.category;
        foundPosting.location = req.body.location;
        foundPosting.images = req.body.images;
        foundPosting.askingPrice = req.body.askingPrice;
        foundPosting.deliveryType = req.body.deliveryType;
        foundPosting.sellerName = req.body.sellerName;
        foundPosting.sellerContactInfo = req.body.sellerContactInfo;
        res.sendStatus(202);
    } else {
        req.sendStatus(404);
    } */

    if(foundPosting === -1) {
        res.sendStatus(404);
    } else {
        foundPosting.title = req.body.title;
        foundPosting.category = req.body.category;
        foundPosting.location = req.body.location;
        foundPosting.images = foundPosting.images;
        foundPosting.askingPrice = req.body.askingPrice;
        foundPosting.dateOfPosting = req.body.dateOfPosting;
        foundPosting.deliveryType = req.body.deliveryType;
        foundPosting.sellerName = req.body.sellerName;
        foundPosting.sellerContactInfo = req.body.sellerContactInfo;
        res.sendStatus(202);
    }
})

module.exports = router;
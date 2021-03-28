var express = require('express');
var bodyParser = require('body-parser')
var Car = require('../modules/car.js');

var app = express();

// create application/json parser
var jsonParser = bodyParser.json()
// create application/x-www-form-urlencoded parser
var urlencodedParser = bodyParser.urlencoded({ extended: false })

app.use(express.static('.'));
app.get('/', function(req, res) {
    // Car.collection.drop({})
    var allitems = [
        {cid: 1, year: 2009, make: "Chevrolet", model: "silverado", miles: 145904, price: 3700, dealer_id: "DB212"},
        {cid: 2, year: 2007, make: "Ford", model: "F150", miles: 158966, price: 2950, dealer_id: "DB348"},
        {cid: 3, year: 2005, make: "Dodge", model: "Ram", miles: 210578, price: 2568, dealer_id: "DB833"},
        {cid: 4, year: 2011, make: "Chevrolet", model: "Colorado", miles: 107894, price: 3790, dealer_id: "DB287"},
        {cid: 5, year: 2013, make: "GMC", model: "Denali", miles: 99958, price: 6899, dealer_id: "DB973"},
    ];
    
    Car.insertMany(allitems, function ( err, docs) {
        
        if(err) {
            console.log(err);
        } else {
            Car.count({}, function ( err, count) {
                console.log( "Number of items:", count );
            })
        }
    });
    res.end();
});

app.use('/showall', function(req, res) {

    Car.find( function(err, foundItems) {
        // console.log('items',foundItems)
        if (err) {
            res.type('html').status(500);
            res.send('Error: ' + err);
        }
        else {
            for(var i = 0; i<foundItems.length; i++) {
                res.write("<p>" + foundItems[i].cid + " " + foundItems[i].make +" "+ foundItems[i].model +" "+ foundItems[i].miles +" "+ foundItems[i].price +" "+ foundItems[i].dealer_id + "</p>");
            }
            res.end();
        }
    });
})

app.post('/addCar', urlencodedParser, async function(req, res) {
    
    const { cid, year, make, model, miles, price, dealer_id } = req.body;
    try {
        await Car.create({
            cid: cid,
            make: make,
            model: model,
            year: year,
            miles: miles,
            price: price,
            dealer_id: dealer_id
        });
        res.write("<p> Car successfully added.</p>")
    } catch(err) {
        res.write("<p>" + err + "</p>");
    }
    res.end();
});

app.post('/findCar', urlencodedParser, async function(req, res) {
    
    const { cid } = req.body;
    await Car.findOne({ cid: cid }, 'cid make miles dealer_id').exec((err,doc) => {
        if(err) {
            res.send("<p>" + err + "</p>");
        } else {
            res.send("<p>" + doc.cid + " " + doc.make + " " + doc.miles + " " + doc.dealer_id + "</p>");
        }

        res.end(); 
    });
   
});

app.post('/updateCar', urlencodedParser, async function(req, res) {
    
    const { cid, miles, price } = req.body;

    await Car.findOne({ cid: cid }, 'miles price').exec((err,doc) => {
        console.log(doc)
        if(err) {
            res.send("<p>" + err + "</p>");
        } else {
            doc.miles = miles;
            doc.price = price;

            doc.save(err => (
                (err) && res.status(500).send(err)
            ));

            res.send("<p>Update Successful</p>");
            
        }

        res.end(); 
    });
   
});

app.post('/deleteCar', urlencodedParser, async function(req, res) {
    var deleteCar = req.body.cid;

    Car.findOneAndRemove({cid: deleteCar}, function(err, item) {
        if (err){
            res.status(500).send(err);
        }
        else if (!item) {
            res.send('No Car by that ID ' + deleteCar);
        }
        else {
            res.send("cid: " + deleteCar + " deleted.");
        }

    });
 
    });
   
app.listen(3000);
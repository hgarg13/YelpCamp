var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");
var middleware = require("../middleware");
var geocoder   = require('geocoder');

router.get("/", function(req, res){
    Campground.find({}, function(err,allCampgrounds){
       if(err){
           console.log(err);
       } else{
           res.render("campgrounds/index",{campgrounds: allCampgrounds}); 
       }
    });
});

router.post("/", middleware.isLoggedIn, function(req, res){
    // get data from form and add to campgrounds array
    var name = req.body.name;
    var price = req.body.price;
    var image = req.body.image;
    var desc = req.body.description;
    var author = {
        id: req.user._id,
        username: req.user.username
    };
    geocoder.geocode(req.body.location, function (err, data) {
        var lat = data.results[0].geometry.location.lat;
        var lng = data.results[0].geometry.location.lng;
        var location = data.results[0].formatted_address;

     var newCampground={name:name,price:price,image:image,description:desc,author:author,location: location, lat: lat, lng: lng};
     Campground.create(newCampground,function(err,newlyCreated){
        if(err){
            console.log(err);
        } else{
            res.redirect("/campgrounds");
        }
     });
     });
});

router.get("/new", middleware.isLoggedIn, function(req, res){
    res.render("campgrounds/new");
});
//SHOW Route
router.get("/:id", function(req,res){
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
        if(err){
            console.log(err);
        }else{
            res.render("campgrounds/show", {campground: foundCampground});
        }
    });
});

//EDIT CAMPGROUND ROUTE
router.get("/:id/edit",middleware.checkCampgroundOwnership, function(req, res) {
        Campground.findById(req.params.id, function(err,foundCampground){
            if(err){
                console.log(err);
            } else{
                res.render("campgrounds/edit", {campground: foundCampground});
            }
        });
});
//UPDATE CAMPGROUND ROUTE
router.put("/:id", function(req, res){
  geocoder.geocode(req.body.location, function (err, data) {
    var lat = data.results[0].geometry.location.lat;
    var lng = data.results[0].geometry.location.lng;
    var location = data.results[0].formatted_address;
    var newData = {name: req.body.name, image: req.body.image, description: req.body.description, cost: req.body.cost, location: location, lat: lat, lng: lng};
    Campground.findByIdAndUpdate(req.params.id, {$set: newData}, function(err, campground){
        if(err){
            req.flash("error", err.message);
            res.redirect("back");
        } else {
            req.flash("success","Successfully Updated!");
            res.redirect("/campgrounds/" + campground._id);
        }
    });
  });
});

//DESTROY ROUTE
router.delete("/:id",middleware.checkCampgroundOwnership, function(req, res){
    Campground.findByIdAndRemove(req.params.id, function(err){
        if(err){
            console.log(err);
            res.redirect("/campgrounds");
        } else{
            res.redirect("/campgrounds");
        }
    });
});


module.exports = router;
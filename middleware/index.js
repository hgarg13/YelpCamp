var Campground = require("../models/campground");
var Comment = require("../models/comment");

var middlewareObj = {};

middlewareObj.checkCampgroundOwnership = function(req, res, next){
    if(req.isAuthenticated()){
        Campground.findById(req.params.id, function(err,foundCampground){
            if(err){
                req.flash("error", "Campground Not Found");
                res.redirect("back");
            } else{
                if(foundCampground.author.id.equals(req.user._id)){
                    next();
                } else{
                    req.flash("error","You Dont Have Permission To Do That");
                    res.redirect("back");
                }
               
            }
        });        
    } else{
        req.flash("error", "You Need To Be Logged In To Do That!!");
        res.redirect("back");
    }
};

middlewareObj.checkCommentOwnership = function(req, res, next){
    if(req.isAuthenticated()){
        Comment.findById(req.params.comment_id, function(err,foundComment){
            if(err){
                req.flash("error", "Comment Not Found");
                res.redirect("back");
            } else{
                if(foundComment.author.id.equals(req.user._id)){
                    next();
                } else{
                    req.flash("error","You Dont Have Permission To Do That");
                    res.redirect("back");
                }
            }
        });        
    } else{
        req.flash("error", "You Need To Be Logged In To Do That!!");
        res.redirect("back");
    }
};
    
middlewareObj.isLoggedIn = function(req, res,next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error", "You Need To Be Logged In To Do That!!");
    res.redirect("/login");
};


module.exports = middlewareObj;
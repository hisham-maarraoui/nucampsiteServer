
// I worked on this code as part of a coding bootcamp curriculum. I followed along with the instructions 
// (i.e. followed/copied instructions from the course/instructors and didn't design everything from scratch myself) while
//  writing code in this project/file. Moreover, I  acknowledge receiving support from and/or working/collaborating
//   with instructors/classmates, generally as is expected from being a participant in the coding bootcamp.


const express = require("express");

const authenticate = require("../authenticate");
const cors = require("./cors");
const Favorite = require("../models/favorite");

const favoriteRouter = express.Router();

favoriteRouter
  .route("/")
  .options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
  .get(cors.cors, authenticate.verifyUser, (req, res, next) => {
    console.log(req.user);
    Favorite.find({ user: req.user._id })
      .populate("user")
      .populate("campsites")
      .then((favorites) => {
        console.log(favorites);
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(favorites);
      })
      .catch((err) => next(err));
  })
  .post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorite.findOne({ user: req.user._id })
      .then((favorite) => {
        if (favorite) {
            console.log(29, favorite);
          req.body
            .forEach((campsite) => {
              if (!favorite.campsites.includes(campsite._id)) {
                favorite.campsites.push(campsite._id);
              }
            })
            favorite.save()
            .then((favorite) => {
              res.statusCode = 200;
              res.setHeader("Content-Type", "application/json");
              res.json(favorite);
            })
            .catch((err) => next(err));
        } else {
          Favorite.create({
            user: req.user._id,
            campsites: req.body.map((campsite) => campsite._id),
          })
            .then((favorite) => {
              res.statusCode = 200;
              res.setHeader("Content-Type", "application/json");
              res.json(favorite);
            })
            .catch((err) => next(err));
        }
      })
      .catch((err) => next(err));
  })
  .put(cors.corsWithOptions, authenticate.verifyUser, (req, res) => {
    res.statusCode = 403;
    res.end("PUT operation not supported on /favorites");
  })
  .delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorite.findOneAndDelete({ user: req.user._id }) // deletes all campsites favorited by user
      .then((response) => {
        if (response) {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(response);
        } else {
          res.setHeader("Content-Type", "text/plain");
          res.end("You do not have any favorites to delete.");
        }
      })
      .catch((err) => next(err));
  });

favoriteRouter
  .route("/:campsiteId")
  .options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
  .get(cors.corsWithOptions, authenticate.verifyUser, (req, res) => {
    res.statusCode = 403;
    res.end("GET operation not supported on /favorites/:campsiteId");
  })
  .post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorite.findOne({ user: req.user._id })
      .then((favorite) => {
        if (!favorite) {
          return Favorite.create({
            user: req.user._id,
            campsites: [req.params.campsiteId],
          });
        } else {
          if (!favorite.campsites.includes(req.params.campsiteId)) {
            favorite.campsites.push(req.params.campsiteId);
            return favorite.save();
          } else {
            res.statusCode = 200;
            res.setHeader("Content-Type", "plain/text");
            res.end("That campsite is already in the list of favorites!");
          }
        }
      })
      .then((favorite) => {
        if (favorite) {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(favorite);
        }
      })
      .catch((err) => next(err));
  })
  .put(cors.corsWithOptions, authenticate.verifyUser, (req, res) => {
    res.statusCode = 403;
    res.end("PUT operation not supported on /favorites/:campsiteId");
  })
  .delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorite.findOne({ user: req.user._id })
      .then((favorite) => {
        if (favorite) {
          const favoritedCampsite = favorite.campsites.includes(req.params.campsiteId);
          if (favoritedCampsite) {
            favorite.campsites = favorite.campsites.filter(
              (campsite) => campsite._id.toString() != req.params.campsiteId
            );
            favorite
              .save()
              .then((favorite) => {
                res.statusCode = 200;
                res.setHeader("Content-Type", "application/json");
                res.json(favorite);
              })
              .catch((err) => next(err));
          } else {
            res.statusCode = 200;
            res.setHeader("Content-Type", "text/plain");
            res.json("There are no favorite campsites to delete");
          }
        } else {
          res.statusCode = 200;
          res.setHeader("Content-Type", "text/plain");
          res.json("There are no favorites");
        }
      })
      .catch((err) => next(err));
  });

module.exports = favoriteRouter;

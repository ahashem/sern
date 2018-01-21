import { result, notFound, error } from 'express-easy-helper';
import User from '../../../orm/models/user.model';

// Create a user
export function create(req, res) {

  return User.create({
    username: req.body.username,
    name: req.body.name,
    email: req.body.email,
    password: req.body.password
  })
    .then(result(res, 201))
    .catch(error(res));

}

// Read a user
export function read(req, res) {

  return User.findById(req.swagger.params.id.value)
    .then(notFound(res))
    .then(result(res))
    .catch(error(res));

}

// Update user
export function update(req, res) {

  return User.findByIdAndUpdate(
    req.user.id, {
      $set: {
        username: req.body.username,
        name: req.body.name,
        email: req.body.email,
      }
    }, {
      new: true,
      // req:req
    }).exec()
    .then(notFound(res))
    .then(result(res))
    .catch(error(res))

}


/*
* Administrator
*/

// List of user's
export function listAdmin(req, res) {

  return User.find({})
    .select('-social')
    .exec()
    .then(notFound(res))
    .then(result(res))
    .catch(error(res));

}

// Update a user
export function updateAdmin(req, res) {

  return User.findByIdAndUpdate(
    req.swagger.params.id.value, {
      $set: {
        username: req.body.username,
        name: req.body.name,
        email: req.body.email,
        roles: req.body.roles,
      }
    }, {
      new: true
    }).exec()
    .then(notFound(res))
    .then(result(res))
    .catch(error(res))

}

// Destroy a user
export function destroyAdmin(req, res, next) {

  return User.findByIdAndRemove(
    req.swagger.params.id.value
  ).exec()
    .then(notFound(res))
    .then(result(res))
    .catch(error(res))

}

const express = require('express')
const routes = express.Router()

const passport = require('passport')
const localStrategy = require('passport-local').Strategy
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

module.exports = routes
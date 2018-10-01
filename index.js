"use strict";

const { promisify } = require("util");

const express = require('express');
const bodyParser = require('body-parser');
const redis = require('redis');

const config = require('./config');
const instaService = require('./insta-service');

const app = express();
const redisClient = redis.createClient({
  host: "redis"
});
const redisGet = promisify(redisClient.get).bind(redisClient);
const redisSet = promisify(redisClient.set).bind(redisClient);

redisClient.on('connect', function () {
  console.log('Connected Redis');
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static('client'));

app.post('/info', async function (req, res, next) {
  try {
    const { insta_login } = req.body;
    if (!insta_login) {
      throw new Error("insta_login expected");
    }
    let repl = await redisGet(insta_login);
    if (!repl) {
      repl = await instaService.loadInfo(req.body);
      await redisSet(insta_login, repl, 'EX', 60 * 60 * 6);
    }
    res.send(JSON.parse(repl));
  } catch (err) {
    console.error(err);
    res.send({
      success: false,
      message: err.message
    });
  }
});

app.listen(config.port, () => console.log('App listening on port ' + config.port));

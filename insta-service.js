"use strict";

const axios = require('axios-https-proxy-fix');

const BASE_INSTA_URL = "https://www.instagram.com/";

async function loadInfo(params) {
  let htmlPage;
  if (params.proxy_host && params.proxy_port) {
    const proxy = {
      host: params.proxy_host,
      port: params.proxy_port
    };
    if (params.proxy_login && params.proxy_password) {
      proxy.auth = {
        username: params.proxy_login,
        password: params.proxy_password
      }
    }
    htmlPage = await axios.get(`${BASE_INSTA_URL}${params.insta_login}/`, { proxy });
  } else {
    htmlPage = await axios.get(`${BASE_INSTA_URL}${params.insta_login}/`);
  }
  const userData = htmlPage.data.match(/<script type="text\/javascript">window\._sharedData = (.*)<\/script>/)[1].slice(0, -1);

  return userData;
}

module.exports = {
  loadInfo
};
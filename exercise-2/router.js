'use strict';

const {
  readFile
} = require('fs');
const path = require('path')
const cookieParser = require('cookie');
const jwt = require('jsonwebtoken');

const secretKey = 'azerty'; // key for token signature
const notFoundPage = '<p style="font-size: 10vh; text-align: center;">404!</p>';
const backToIndexPage = '<a href="/"><button>Back to Homepage</button></a>'; // button to turn back front page
var serverCode; // serverCode to use in
var pageContent; // page content to use in writeHeadHtmlType function

module.exports = (req, res) => {

  switch (`${req.method} ${req.url}`) {

    case 'GET /': // index
      console.log('index');
      return readFile(
        path.join(__dirname, 'index.html'),
        (err, data) => {
          res.writeHead(
            200, {
              'Content-Type': 'text/html',
              'Content-Length': data.length
            }
          );
          return res.end(data);
        }
      );

    case 'POST /login': // login
      console.log('login');
      var userData = {
        logged_in: true
      };
      var jsonWebToken = jwt.sign(userData, secretKey);
      res.writeHead(302, {
        'Set-Cookie': 'token=' + jsonWebToken + '; HttpOnly; Max-Age=9000',
        'Location': "/"
      });
      return res.end();

    case 'POST /logout': // logout
      console.log('logout');
      res.writeHead(302, {
        'Set-Cookie': 'token=; HttpOnly; Max-Age=0',
        'Location': "/"
      });
      return res.end();

    case 'GET /auth_check': // check log
      console.log('auth check');
      if (req.headers.cookie) { // checks if cookie exists
        var parsedCookie = cookieParser.parse(req.headers.cookie);
        console.log(parsedCookie);
        jwt.verify(parsedCookie.token, secretKey, function(err, result) {
          if (err) {
            serverCode = 401;
            pageContent = '<p style="font-size: 10vh; text-align: center;">Unauthorized access!</p>' + backToIndexPage;
            writeHeadHtmlType(serverCode, pageContent);
          }
          if (result.logged_in) { // then checks if cookie contains 'loggin_in'
            serverCode = 302;
            pageContent = '<p style="font-size: 10vh; text-align: center;">You\'re logged in!</p>' + backToIndexPage;
            writeHeadHtmlType(serverCode, pageContent);
          }
        });
        break;
        
      } else {
        serverCode = 302;
        pageContent = '<p style="font-size: 10vh; text-align: center;">Unauthorized access!</p>' + backToIndexPage;
        writeHeadHtmlType(serverCode, pageContent);
        break;
      }

    default:
      res.writeHead(
        404, {
          'Content-Type': 'text/html',
          'Content-Length': notFoundPage.length
        }
      );
      return res.end(notFoundPage);

  } // End switch

  // Generic function to response a HTML type content
  function writeHeadHtmlType(serverCode, pageContent) {
    res.writeHead(serverCode, {
      'Content-Type': 'text/html'
    });
    return res.end(req.headers.cookie + pageContent);
  }

}

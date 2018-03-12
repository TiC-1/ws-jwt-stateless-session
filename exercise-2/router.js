'use strict';

const {
  readFile
} = require('fs');
const path = require('path')
const cookieParser = require('cookie');
const jwt = require('jsonwebtoken');


const secret = 'azerty';
const notFoundPage = '<p style="font-size: 10vh; text-align: center;">404!</p>';
const returnIndexPage = '<a href="/"><button>Return to Homepage</button></a>';

module.exports = (req, res) => {
  switch (`${req.method} ${req.url}`) {
    case 'GET /':
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

    case 'POST /login':
      var user_data = {
        logged_in: true
      };
      var token = jwt.sign(user_data, secret);
      console.log(user_data);
      console.log(token);
      res.writeHead(302, {
        'Set-Cookie': 'token=' + token + '; Max-Age=9000',
        'Location': "/"
      });
      return res.end();

    case 'POST /logout':
      console.log('logout');
      res.writeHead(302, {
        'Set-Cookie': 'token=; HttpOnly; Max-Age=0',
        'Location': "/"
      });
      return res.end();

    case 'GET /auth_check':
      console.log('check auth');
      if (req.headers.cookie) {
        var parsedCookie = cookieParser.parse(req.headers.cookie);
        console.log(parsedCookie);

        jwt.verify(parsedCookie.token, secret, function(err, result) {
          if (err) {
            res.writeHead(401, {
              'Content-Type': 'text/html'
            });
            return res.end(req.headers.cookie + '<p style="font-size: 10vh; text-align: center;">Unauthorized access!</p>' + returnIndexPage);
          }
          if (result.logged_in) {
            res.writeHead(302, {
              'Content-Type': 'text/html'
            });
            return res.end(req.headers.cookie + '<p style="font-size: 10vh; text-align: center;">You\'re logged in!</p>' + returnIndexPage);
          }
        });
      } else {
        res.writeHead(401, {
          'Content-Type': 'text/html'
        });
        return res.end(req.headers.cookie + '<p style="font-size: 10vh; text-align: center;">Unauthorized access!</p>' + returnIndexPage);
      }
      break;

    default:
      res.writeHead(
        404, {
          'Content-Type': 'text/html',
          'Content-Length': notFoundPage.length
        }
      );
      return res.end(notFoundPage);
  }
}

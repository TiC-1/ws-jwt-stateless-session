
var crypto = require('crypto');

module.exports = secret => {
    if (!secret || typeof secret !== 'string') {
      throw Error('invalid secret!');
    }

    const functions = {
      sign: function(value) {
        hash = crypto
          .createHmac('sha256', secret)
          .update(value)
          .digest('hex');
        console.log(hash);
        return hash;
      },

      validate: function(value, hash) {
        if (functions.sign(value, secret) == hash) {
          return true;
        } else {
          return false;
        }
      }
    };

      return functions;
    };

const MongoClient = require("mongodb").MongoClient;
const url = "mongodb://localhost:27017/dating";

var _db;

module.exports = {
  connectToServer: function(callback) {
    MongoClient.connect(
      url,
      { useNewUrlParser: true, useUnifiedTopology: true },
      function(err, client) {
        _db = client.db("dating");
        return callback(err);
      }
    );
  },

  getDb: function() {
      console.log("connected..")
    return _db;
  }
};
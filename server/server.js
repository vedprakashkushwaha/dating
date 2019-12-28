const express = require('express');
const multer = require("multer");
const cors = require("cors");
const mkdirp = require("mkdirp");
const jwt = require("jsonwebtoken");
const SECRETKEY = "dwfdefvdvdfvsdfnhgjhgffgnhgf";
//const dbCon = require("./dbConnection");
var url1 = require("url");
const bodyParser = require("body-parser");

var url = "mongodb://localhost:27017/dating";

// create a client to mongodb
var MongoClient = require('mongodb').MongoClient;





const app = express()
app.use(cors());

var urlencodedParser = bodyParser.urlencoded({
  extended: false
});






var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    var path = __dirname + "/images/" + req.headers.path;

    mkdirp(path, function (err) {
      if (err) throw err;
      cb(null, path);
    });
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  }
});


var upload = multer({
  storage: storage
}).single("file");


// upload file to server
app.post("/upload", async function (req, res) {
  //console.log("request encountered.....")
  await upload(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      return res.status(500).json(err);
    } else if (err) {
      return res.status(500).json(err);
    }
    return res.status(201).json();
  });

});



async function register(fname, lname, email, sex, age, pass, file) {

  var doc = {
    fname: fname,
    lname: lname,
    email: email,
    sex: sex,
    age: age,
    pass: pass,
    file: file,
    like: 0,
    super: [],
    blocked: [email]
  };

  MongoClient.connect(url, {
    useUnifiedTopology: true
  }, (err, database) => {

    const myDb = database.db('dating');
    myDb.collection("clients").insertOne(doc, function (err, res) {
      if (err) throw err;
      //console.log("Document inserted");
    });
  });
}

app.post("/upload-texts", urlencodedParser, async function (req, res) {
  //console.log("data fund............");
  await register(req.body.fname, req.body.lname, req.body.email, req.body.sex, req.body.age, req.body.pass, req.body.file);
  return res.redirect("http://localhost:3000");
});







async function loginCkeck(uname, pass, res) {


  MongoClient.connect(url, {
    useUnifiedTopology: true
  }, (err, database) => {
    const myDb = database.db('dating');
    myDb.collection("clients").find({}, {
      projection: {
        pass: 1,
        email: 1,
        _id: 0
      }
    }).toArray(function (err, resD) {
      if (err) throw err;
      var flag = false;
      for (let i = 0; i < resD.length; i++) {
        var user = {
          uname: resD[i]['email'],
          fname: resD[i]['fname']
        }
        if (resD[i]['email'] == uname && resD[i]['pass'] == pass) {
          flag = true;
        }
      }


      if (flag) {


        jwt.sign({
          user
        }, SECRETKEY, (err, token) => {
          if (err) {
            throw err;
          } else {
            console.log(JSON.stringify({
              "results": [{
                "token": token
              }]
            }));
            res.end(JSON.stringify({
              "results": [{
                "token": token
              }]
            }));
          }
        });

        // res.end(JSON.stringify({
        //   "results": flag
        // }));



      } else {
        console.log(JSON.stringify({
          "results": [{
            "token": false
          }]
        }));
        res.end(JSON.stringify({
          "results": [{
            "token": false
          }]
        }));
      }





    });
  });



}

app.get("/login", urlencodedParser, async function (req, res) {


  var q = url1.parse(req.url, true);

  var qData = q.query;

  var uname = qData.uname;
  var pass = qData.pass;

  await loginCkeck(uname, pass, res);






});

app.post("/login1", function (req, res) {
  return res.redirect("http://localhost:3000");
});



async function loadImgSupport(res, data, selfEmail) {
  MongoClient.connect(url, {
    useUnifiedTopology: true
  }, (err, database) => {
    const myDb = database.db('dating');


    myDb.collection("clients").aggregate([{
      $sample: {
        size: 100000
      }
    }]).toArray(function (err, resD) {
      if (err) throw err;
      var count = 0;

      var data1 = [];
      for (let i = 0; i < resD.length; i++) {
        flag = 1;
        for (let j = 0; j < data[0]['blocked'].length; j++) {
          if (resD[i]['email'] == data[0]['blocked'][j]) {
            flag = 0;
          }
        }
        if (flag == 1) {
          data1.push({
            email: resD[i]['email'],
            image: resD[i]['file']
          });
          count = count + 1;
        }


        if (count == 4) {
          break;
        }
      }

      res.end(JSON.stringify({
        "results": data1
      }))

    });
  });




}
async function loadImg(res, email) {

  MongoClient.connect(url, {
    useUnifiedTopology: true
  }, (err, database) => {

    const myDb = database.db('dating');
    myDb.collection("clients")
      .find({
        email: email
      }, {
        projection: {
          _id: 0,
          blocked: 1
        }
      })
      .toArray(async function (err, resD) {
        if (err) throw err;
        await loadImgSupport(res, resD, email)
      });
  });
}

app.get("/api.loadImgDetail", async function (req, res) {

  var q = url1.parse(req.url, true);
  var qData = q.query
  await loadImg(res, qData.uname);

});



app.get("/getImage", function (req, res) {
  let q = url1.parse(req.url, true);
  let qData = q.query;
  let image = qData.i;
  let org = qData.o;
  let url = "/images/" + org + "/" + image;
  res.sendFile(__dirname + url);
});




async function addBlock(bList, email, target) {

  flag = 1;
  for (let i = 0; i < bList.length; i++) {
    if (bList[i] == target) {
      flag = 0;
    }
  }
  if (flag == 1) {
    MongoClient.connect(url, {
      useUnifiedTopology: true
    }, (err, database) => {
      const myDb = database.db('dating');
      bList.push(target);
      myDb.collection("clients").updateOne({
        email: email
      }, {
        $set: {
          blocked: bList
        }
      });
    });

  }

}

async function block(uname, target) {
  MongoClient.connect(url, {
    useUnifiedTopology: true
  }, (err, database) => {

    const myDb = database.db('dating');
    myDb.collection("clients")
      .find({
        email: uname
      }, {
        projection: {
          _id: 0,
          blocked: 1
        }
      })
      .toArray(async function (err, resD) {
        if (err) throw err;
        await addBlock(resD[0]['blocked'], uname, target);
      });
  });
}

app.get("/api.block", async function (req, res) {
  let q = url1.parse(req.url, true);
  let qData = q.query
  await block(qData.uname, qData.target);

});

app.get("/test", function (req, res) {
  res.end(JSON.stringify({
    "data": [{
      "name": "ved",
      "age": 12
    }, {
      "name": "ram",
      "age": 12
    }]
  }));
});



app.get("/jwt", async function (req, res) {
  test(res)
});
async function test(res) {

  var v = 1
  var uname = "ved@gmail.com"
  const user = {
    uname,
    age: 22
  }

  if (v == 1) {
    jwt.sign({
      user
    }, SECRETKEY, (err, token) => {
      if (err) {
        throw err;
      } else {
        res.end(JSON.stringify({
          "results": [{
            "token": token
          }]
        }));
      }
    });
  } else {
    res.end(JSON.stringify({
      "result": [{
        "token": false
      }]
    }));
  }



}




app.listen(8000, function () {
  console.log("server is running on 127.0.0.1:8000");
});
const express = require('express');
const multer = require("multer");
const cors = require("cors");
const mkdirp = require("mkdirp");
const jwt = require("jsonwebtoken");
const SECRETKEY = "dGKdsHnKKzHkkheGjKhjhKbHk";
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
    like: [],
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
            image: resD[i]['file'],
            name: resD[i]['fname'] + " " + resD[i]['lname'],
            sex: resD[i]['sex'],
            age: resD[i]['age'],
            likes: resD[i]['like'].length,
            super: resD[i]['super'].length

          });
          count = count + 1;
        }


        if (count == 20) {
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



//block users
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






//like photos
async function addLike(lList, email, target) {
  flag = 1;
  try {
    for (let i = 0; i < lList.length; i++) {
      if (lList[i] == email) {
        flag = 0;
      }
    }
  } catch {
    flag = 1
    lList = []
  }
  if (flag == 1) {
    MongoClient.connect(url, {
      useUnifiedTopology: true
    }, (err, database) => {
      const myDb = database.db('dating');
      lList.push(email);
      myDb.collection("clients").updateOne({
        email: target
      }, {
        $set: {
          like: lList
        }
      });
    });
  }
}



async function like(uname, target) {
  MongoClient.connect(url, {
    useUnifiedTopology: true
  }, (err, database) => {

    const myDb = database.db('dating');
    myDb.collection("clients")
      .find({
        email: target
      }, {
        projection: {
          _id: 0,
          like: 1
        }
      })
      .toArray(async function (err, resD) {
        if (err) throw err;
        await addLike(resD[0]['like'], uname, target);
      });
  });
}

app.get("/api.like", async function (req, res) {
  let q = url1.parse(req.url, true);
  let qData = q.query

  await like(qData.uname, qData.target);
  res.end()
});










//super like images
async function addSuper(lList, email, target, image) {
  flag = 1;
  try {
    for (let i = 0; i < lList.length; i++) {
      if (lList[i] == target) {
        flag = 0;
      }
    }
  } catch {
    flag = 1
    lList = []
  }
  if (flag == 1) {
    MongoClient.connect(url, {
      useUnifiedTopology: true
    }, (err, database) => {
      const myDb = database.db('dating');
      lList.push({
        "who": email,
        "image": image
      });
      myDb.collection("clients").updateOne({
        email: target
      }, {
        $set: {
          super: lList
        }
      });
    });
  }
}

async function unameImg(resLike,uname,target) {
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
          file: 1
        }
      })
      .toArray(async function (err, resD) {
        if (err) throw err;
        
        await addSuper(resLike, uname, target, resD[0]['file']);
      });
  });
}

async function superL(uname, target, image) {
  MongoClient.connect(url, {
    useUnifiedTopology: true
  }, (err, database) => {

    const myDb = database.db('dating');
    myDb.collection("clients")
      .find({
        email: target
      }, {
        projection: {
          _id: 0,
          super: 1
        }
      })
      .toArray(async function (err, resD) {
        if (err) throw err;
        await unameImg(resD[0]['super'], uname, target);
        //await addSuper(resD[0]['like'], uname, target, image);
      });
  });
}

app.get("/api.super", async function (req, res) {
  let q = url1.parse(req.url, true);
  let qData = q.query
  await superL(qData.uname, qData.target, qData.image);
 res.end()
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


async function getNotification(uname, res) {
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
          like: 1,
          super: 1
        }
      })
      .toArray(async function (err, resD) {
        if (err) throw err;

        res.end(JSON.stringify({
          "results": resD[0]
        }));

      });
  });
}

app.get("/api.notification", async function (req, res) {

  var q = url1.parse(req.url, true);
  var qData = q.query;
  getNotification(qData.uname, res);

});

app.listen(8000, function () {
  console.log("server is running on 127.0.0.1:8000");
});
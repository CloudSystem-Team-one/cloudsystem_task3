var express = require("express");
var router = express.Router();
var mongo = require("mongodb").MongoClient;
var objectId = require("mongodb").ObjectID;
var assert = require("assert");

var url = "mongodb://localhost:27017/test";

/* GET home page. */
router.get("/", function (req, res, next, file) {
  res.render("index");
});

router.get("/get-data", function (req, res, next, file) {
  var resultArray = [];
  mongo.connect(url, function (err, db) {
    assert.equal(null, err);
    var cursor = db.collection("user-data").find();
    cursor.forEach(
      function (doc, err) {
        assert.equal(null, err);
        resultArray.push(doc);
      },
      function () {
        db.close();
        res.render("index", { items: resultArray });
      }
    );
  });
});

router.post("/insert", function (req, res, next) {
  var item = {
    name: req.body.name,
    phone: req.body.phone,
    email: req.body.email,
  };

  mongo.connect(url, function (err, db) {
    assert.equal(null, err);
    db.collection("user-data").insertOne(item, function (err, result) {
      assert.equal(null, err);
      console.log("Item inserted");
      db.close();
    });
  });

  res.redirect("/");
});

router.post("/update", function (req, res, next) {
  var item = {
    name: req.body.name,
    phone: req.body.phone,
    email: req.body.email,
  };
  var id = req.body.id;

  mongo.connect(url, function (err, db) {
    assert.equal(null, err);
    db.collection("user-data").updateOne(
      { _id: objectId(id) },
      { $set: item },
      function (err, result) {
        assert.equal(null, err);
        console.log("Item updated");
        db.close();
      }
    );
  });
});

router.post("/delete", function (req, res, next) {
  var id = req.body.id;

  mongo.connect(url, function (err, db) {
    assert.equal(null, err);
    db.collection("user-data").deleteOne({ _id: objectId(id) }, function (
      err,
      result
    ) {
      assert.equal(null, err);
      console.log("Item deleted");
      db.close();
    });
  });
});

router.post(function insertFile(file,res) {
    mongo.connect(url, function (err, db) {
        if (err) {
            return err
        }
        else {
            let db = client.db('uploadDB')
            let collection = db.collection('files')
            try {
                collection.insertOne(file)
                console.log('File Inserted')
            }
            catch (err) {
                console.log('Error while inserting:', err)
            }
            db.close()
            res.redirect('/')
        }

    })
})

router.post(function getFile(file,res) {
    mongo.connect(url, function (err, db) {
        if (err) {
            return err
        }
        else {
            let db = client.db('uploadDB')
            let collection = db.collection('files')
            collection.find({}).toArray((err, doc) => {
                if (err) {
                    console.log('err in finding doc:', err)
                }
                else {
                    let buffer = doc[0].file.buffer
                    fs.writeFileSync('uploaded.pdf', buffer)
                }
            })
            db.close()
            res.redirect('/')
        }

    })
}
)
module.exports = router;

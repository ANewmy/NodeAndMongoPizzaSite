var fs = require('fs');
var http = require('http');
var url = require('url');
var ROOT_DIR = "static/";
var MongoClient = require('mongodb').MongoClient;
var db,menu;
var dbURL="mongodb://pizza1:pizza1@localhost:27017/pizza"
var server=http.createServer(function (req, res) {
   var urlObj = url.parse(req.url, true, false);
  console.log('pathname: ',urlObj.pathname)
  if(req.method=="GET")
  	if(urlObj.pathname=="/menu"){
      var query={}
      findMenuItems(res,query)
  	}
  else{ 
  fs.readFile(ROOT_DIR + urlObj.pathname, function (err,data) {
  if (err) {
    res.writeHead(404);
    res.end("<h1>Page does not exist!</h1>");
    return;
  }
  res.writeHead(200);
  res.end(data);
})
}
if(req.method="POST")
{
    console.log('Post method: ',urlObj.pathname)

  //placeOrder request
  if(urlObj.pathname=="/placeOrder") {
        console.log('url obj path is placeOrder: ')
    var dataFromClient=''
    req.on('data',function(chunk) {
      dataFromClient+=chunk;
    })
    req.on('end',function() {
      console.log('DFC: ',res)
      insertOrders(dataFromClient,res)
      res.writeHead(200);
      res.end("Thank you for order!")
    })
  }


}


  //}
})
// Initialize connection once
MongoClient.connect(dbURL, 
					function(err, database) {
  if(err) throw err;

  db=database.db("pizza")
  
  // Start the application after the database connection is ready
  server.listen(8000);
  console.log("Listening on port 8000");
});

function findMenuItems(res,query)
{
  console.log(query)
  db.collection("menu").find(query).toArray(function (err,results) {
 
    console.log('results from MongoClient.connect: ',results)
    
    res.writeHead(200);
    res.end(JSON.stringify(results))
  })

  //    res.writeHead(200);
  // res.end(results);
 
}

//function insertOrders(data,res)

function insertOrders(data,res) {
  console.log(data)
  var info=JSON.parse(data)
  var cart = info[0]
  var customerInfo=info[1]
  var currentDate = new Date()
  var records=[]
  for ( i in cart) {
    item = cart[i]
    tPrice=item.price*item.quantity
    var record = { customerID: customerInfo[0].customerID, pizzaName:item.pizzaName,totalPrice:tPrice,quantity:item.quantity,date:currentDate}
    records.push(record)
    console.log(record)

  }
  db.collection("orders").insertMany(records, function(err,result) {
    if (err) {
      console.log('dbMenuDemo.js: ',err)
    } else {
      console.log("insert: "+result.insertedCount)
      res.writeHead(200);
      res.end("Your order has been placed")
    }
  })
}
var express = require('express')
var router = express.Router()

var db = require("../config/db1")

router.get("/", (req, res) => {
    db.query("SELECT * FROM customer_details", function (err, result) {

        res.send(result)
    })
})

router.post('/', (req, res) => {
    var data = req.body

    db.query("insert into customer_details values (?,?,?)", [data.cus_id, data.name, data.phone], function (err, result) {
        if (err) {
            throw err
        }
        res.send({message:"Data saved sucessful"})
    })
})

router.put("/:id", function (req, res) {
    var data = req.body;
     
    db.query("update customer_details set name=?,phone=? where cus_id=?",[data.name, data.phone,req.params.id],function(err){
       try { if(err) throw err
        res.send({message:"update"})}
        catch{
            res.status(500).send({message:"failure"})
        }

    })


})

router.delete("/:id",function(req,res){
    db.query("delete from customer_details where cus_id=?",[req.params.id],function(err){
        if(err) throw err
        res.send("deleted movie from screen")
    })
})







module.exports = router
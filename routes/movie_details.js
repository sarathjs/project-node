var express = require('express')
var router = express.Router()

var db = require("../config/db1")

router.get("/", (req, res) => {
    db.query("select m.mov_id,m.movie_name,l.language_type,c.catagory,m.duration,m.total_seat,m.remaining_seat,m.screen from (movie_details m inner join language_details l on m.language_type=l.lang_no) inner join movie_catagory c on m.catagory=c.cata_no;", function (err, result) {

        res.send(result)
    })
})

router.post('/', (req, res) => {
    var data = req.body

    db.query("insert into movie_details values (?,?,?,?,?,?,?,?)", [data.mov_id, data.movie_name, data.language_type, data.catagory, data.duration, data.total_seat,data.remaining_seat,data.screen], function (err, result) {
        if (err) {
            throw err
        }
        res.send("data saved successfully")
    })
})

router.put("/:id", function (req, res) {
    var data = req.body;
     
    db.query("update movie_details set movie_name=?,language_type=?,catagory=?,duration=?,total_seat=?,remaining_seat=?,screen=? where mov_id=?",[data.movie_name, data.language_type, data.catagory, data.duration, data.total_seat,data.remaining_seat,data.screen,req.params.id],function(err){
       try{ if(err) throw err
        res.send({message:"update"})}

        catch{
            res.status(500).send({message:"failure"})
        }

    })


})

router.delete("/:id",function(req,res){
    db.query("delete from movie_details where mov_id=?",[req.params.id],function(err){
        if(err) throw err
        res.send("deleted movie from screen")
    })
})

router.put("/swap/:screen1/:screen2",function(req,res){
    db.query("select * from movie_details  where screen=? or screen=?",[req.params.screen1,req.params.screen2],function(err,result){
        db.query("update movie_details set movie_name=?,language_type=?,catagory=?,duration=?,remaining_seat=? where screen=?",[result[1].movie_name,result[1].language_type,result[1].catagory,result[1].duration,result[1].remaining_seat,req.params.screen1],function(err){
            if (err) throw err

        })
        db.query("update movie_details set movie_name=?,language_type=?,catagory=?,duration=?,remaining_seat=? where screen=?",[result[0].movie_name,result[0].language_type,result[0].catagory,result[0].duration,result[0].remaining_seat,req.params.screen2],function(err){
            if (err) throw err

        })
    })
    res.send("swaped")
})



router.get("/language_details", (req, res) => {
    db.query("SELECT * FROM language_details ", function (err, result) {

        res.send(result)
    })
})


router.get("/movie_catagory", (req, res) => {
    db.query("SELECT * FROM movie_catagory ", function (err, result) {

        res.send(result)
    })
})






module.exports = router
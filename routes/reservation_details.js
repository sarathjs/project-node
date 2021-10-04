var express = require('express')
var router = express.Router()

var db = require("../config/db1")

router.get("/", (req, res) => {
    db.query("select r.cus_id,r.mov_id,r.booked_seats,r.mov_date,b.book_status,s.show_time,r.res_id,r.no_of_booking from ((reservation_details r inner join show_time s on r.show_time=s.show_no) inner join status_booking b on r.book_status=b.status_no)", function (err, result) {

        res.send(result)
    })
})

router.post('/', (req, res) => {
    var data = req.body

    db.query("insert into reservation_details values (?,?,?,?,?,?,?,?)", [data.cus_id, data.mov_id, data.booked_seats, data.mov_date, data.book_status, data.show_time, data.res_id, data.no_of_booking], function (err, result) {
        if (err) {
            throw err
        }

        db.query("update movie_details set remaining_seat=remaining_seat-? where mov_id=?", [data.no_of_booking, data.mov_id], function (err) {
            if (err) {
                throw err
            }
        })

        res.send("data saved successfully")
    })
})

router.put("/:id", function (req, res) {
    var data = req.body;

    db.query("update reservation_details set mov_id=?,booked_seats=?,mov_date=?,book_status=?,show_time=?,no_of_booking=? where res_id=?", [data.mov_id, data.booked_seats, data.mov_date, data.book_status, data.show_time, data.no_of_booking, req.params.id], function (err) {
       try{ if (err) throw err

        if (data.book_status == "0") {
            db.query("update movie_details set remaining_seat=remaining_seat+? where mov_id=?", [data.no_of_booking, data.mov_id], function (err) {
                if (err) {
                    throw err
                }
            })
        }
        res.send({message:"update"})}

        catch{
            res.status(500).send({message:"failure"})
        }

    })



})

router.delete("/:id", function (req, res) {
    db.query("delete from reservation_details where res_id=?", [req.params.id], function (err) {
        if (err) throw err
        res.send("deleted movie from screen")
    })
})


router.get("/details/:id/:from/:to", function(req,res){
    var data = req.body

    db.query("select mov_date from reservation_details where cus_id=? and mov_date between ?  and ?",[req.params.id,req.params.from,req.params.to], function(err,result){
        if (err) throw err;
        res.send(result)
    })
   
    
})



router.get("/show_time", (req, res) => {
    db.query("SELECT * FROM show_time;", function (err, result) {

        res.send(result)
    })
})

router.get("/book_status", (req, res) => {
    db.query("SELECT * FROM status_booking;", function (err, result) {

        res.send(result)
    })
})


router.get("/reservation/:id", (req, res) => {
    db.query("select * from reservation_details where cus_id=?;",[req.params.id], function (err, result) {

        res.send(result)
    })
})



module.exports = router
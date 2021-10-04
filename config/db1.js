var mysql=require('mysql')

var connection=mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'Sarath#1998',
    database:'moviemannia'
})

connection.connect(function(err){
    if(err) throw err
    console.log("connection success")
}
)

module.exports=connection;

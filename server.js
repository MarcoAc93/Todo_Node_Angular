var express = require("express");
var mysql = require("mysql");
var bodyParser = require("body-parser");
var methodOverride = require("method-override");
var morgan = require("morgan");
var app = express();


app.use(express.static(__dirname + "/public"));
app.use(morgan("dev"));
app.use(bodyParser.urlencoded({"extended" : "true"}));
app.use(bodyParser.json());
app.use(bodyParser.json({ type: "application/vnd.api+json" }));
app.use(methodOverride());


var conexion = mysql.createConnection({
	host: "localhost",
	user: "root",
	password: "alonsocabralesAC93",
	database: "TodoNode"
});




/***************** RUTAS DEL API ********************/
app.get("/api/todos", function(req, res) {
	var query = conexion.query(
		'SELECT * FROM tareas' ,{}, function(error, resul){
		if (error) {
			throw error;
		} else {
			res.json(resul);
		}
	});
});

app.post("/api/todos",  function(req, res){
	/* agarra lo de la caja de texto del form */
	tarea = req.body.text;
	var query = conexion.query(
		'INSERT INTO tareas SET ?',
		{tarea: tarea}, function(error, resul){
		if (error) { throw error }

		var query = conexion.query(
			'SELECT tarea FROM tareas' ,{}, function(error, resul){
			if (error) {
				throw error;
			} else {
				res.json(resul);
			}
		});
	});
});

app.delete("/api/todos/:id", function(req, res){
	/* agarra el parametro que viene de la url */
	id = req.params.id;
	var query = conexion.query(
		'DELETE FROM tareas WHERE idTarea = ?', 
		[id], function(error, resul){
		if (error) { throw error}
		var query = conexion.query(
			'SELECT tarea FROM tareas' ,{}, function(error, resul){
			if (error) {
				throw error;
			} else {
				res.json(resul);
			}
		});
	});
});

app.get("*", function(req, res){
	res.sendFile("./public/index");
});

app.listen(7000, function(){
	console.log("Listening on port 7000");
});
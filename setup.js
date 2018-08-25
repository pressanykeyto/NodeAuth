var readline = require('readline-sync');
var bcryptNodejs = require("bcrypt-nodejs")
var salt = bcryptNodejs.genSaltSync(10);
var readline = require('readline-sync');
var username = readline.question("Please enter username: ");
var pass_a = readline.question("Please enter password: ", {
    hideEchoBack: true
  });

var pass_b = readline.question("Please re-enter password: ", {
    hideEchoBack: true 
  });

if (pass_a == pass_b) {
    var hash = bcryptNodejs.hashSync(pass_b, salt);
    console.log(hash);
}

else {
    console.log("Passwords didn't match!");
}


const pg = require("pg");
const pool = new pg.Pool({
user: "authuser",
host: "localhost",
database: "auth",
password: "P4ssword",
port: "5432"});

pool.query("INSERT INTO users(username, password, type) VALUES ('"+ username +"', '"+ hash +"', 'admin')", (err, res) => {
console.log(err, res);
pool.end();
});
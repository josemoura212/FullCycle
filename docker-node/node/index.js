const express = require("express");
const mysql = require("mysql");

const app = express();

const port = 3000;

const config = {
  host: "db",
  user: "root",
  password: "1524",
  database: "nodedb",
};

app.get("/", (req, res) => {
  insertAndListNames(res);
});

app.listen(port, () => {
  console.log("Rodando na porta " + port);
});

var names = [
  "Jose",
  "Wesley",
  "Geovanna",
  "Carlos",
  "Edson",
  "Thais",
  "Safira",
  "Oliver",
  "Hanna",
  "Mariza",
  "Eleida",
];

async function insertAndListNames(res) {
  const connection = mysql.createConnection(config);
  const create_table = `create table if not exists people(id int not null auto_increment primary key, name varchar(255))`;
  connection.query(create_table);

  var name = names[Math.floor(names.length * Math.random())];
  const insertQuery = `insert into people(name) values('${name}')`;

  connection.query(insertQuery, (error, _results, _fields) => {
    if (error) throw error;

    console.log(`Inserido ${name}`);

    listNames(res, connection);
  });
}

async function listNames(res, connection) {
  const query = `select name from people`;

  connection.query(query, (error, results, _fields) => {
    if (error) throw error;

    const names = results.map((result) => result.name);

    res.send(
      `<h1>Full Cycle Rocks!!</h1><ul>${names
        .map((name) => `<li>${name}</li>`)
        .join("")}</ul>`
    );
    connection.end();
  });
}

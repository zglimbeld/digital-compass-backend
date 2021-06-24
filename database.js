const { Connection, Request } = require('tedious');

const config = {
  authentication: {
    options: {
      userName: "daniel.zglimbea",
      password: "Database1"
    },
    type: "default"
  },
  server: "digitalcompass.database.windows.net",
  options: {
    database: "DigitalCompassDB",
    encrypt: true
  }
};

const connection = new Connection(config);

connection.connect();

connection.on("connect", err => {
  if (err) {
    console.error(err.message);
  }
  else {
    queryDatabase();
  }
});

function queryDatabase() {
  console.log("Connected to database!");
}

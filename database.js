const { Connection, Request } = require('tedious');
const { addDays, formatDate } = require("./utils/utils.js");

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

executeSql = query => new Promise((resolve, reject) => {
  var result = [];
  var data = [];
  const connection = new Connection(config);
  
  const request = new Request(query, (err) => {
    if (err) {
      reject(err);
    }
    else {
      if ((result == "" || result == null || result == "null")) result = [];
      resolve(result);
    }
    connection.close();
  });

  request.on('row', columns => {
    data = [];
    columns.forEach(column => {
      data.push(column.value);
    });
    result.push(data);
  });

  connection.on('connect', err => {
    if (err) {
      reject(err);
    }
    else {
      connection.execSql(request);
    }
  });

  connection.connect();
});

const createUser = async userData => {
  const queryText = userData.email === "" ?
    `INSERT INTO dbo.DigitalCompassUser (FirstName, LastName, UserName, Pass) VALUES ('${userData.firstName.toLowerCase()}', '${userData.lastName.toLowerCase()}', '${userData.userName.toLowerCase()}', '${userData.pass}');` :
    `INSERT INTO dbo.DigitalCompassUser (FirstName, LastName, UserName, Pass, Email) VALUES ('${userData.firstName.toLowerCase()}', '${userData.lastName.toLowerCase()}', '${userData.userName.toLowerCase()}', '${userData.pass}', '${userData.email.toLowerCase()}');`;
  const result = await executeSql(queryText);
  return result;
}

const findUser = async userName => {
  const queryText = `SELECT UserId, Pass, FirstName, LastName FROM dbo.DigitalCompassUser WHERE UserName='${userName.toLowerCase()}'`;
  const result = await executeSql(queryText);
  return result;
}

const addToken = async (userId, token) => {
  const targetDate = addDays(new Date(), 60);
  const formattedDate = formatDate(targetDate);

  const queryText = `INSERT INTO dbo.InstagramUserData (UserId, LongLivedAccessToken, TokenExpiration) VALUES (${userId}, '${token}', '${formattedDate}')`;
  const result = await executeSql(queryText);
  return result;
}

const findToken = async userId => {
  const queryText = `SELECT LongLivedAccessToken, TokenExpiration FROM dbo.InstagramUserData WHERE UserId=${userId}`;
  const result = await executeSql(queryText);
  return result;
}

const getAppData = async () => {
  const queryText = `SELECT AppID, AppSecret FROM dbo.InstagramAppData`;
  const result = await executeSql(queryText);
  return result;
}
  
exports.createUser = createUser;
exports.findUser = findUser;
exports.addToken = addToken;
exports.findToken = findToken;
exports.getAppData = getAppData;

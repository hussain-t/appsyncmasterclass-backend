require("dotenv").config();
const AWS = require("aws-sdk");

const user_exists_in_UsersTable = async (id) => {
  const DynamoDB = new AWS.DynamoDB.DocumentClient();

  console.log(`looking for user [${id}] in the table [${process.env.USERS_TABLE}]`);

  const res = await DynamoDB.get({
    TableName: process.env.USERS_TABLE,
    Key: {
      id
    }
  }).promise()

  console.log("res.Item...", res.Item)
  expect(res.Item).toBeTruthy();

  return res.Item;
}

module.exports = {
  user_exists_in_UsersTable,
}
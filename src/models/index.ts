"use strict";

import fs from "fs";
import path from "path";
import process from "process";
import { Sequelize, DataTypes } from "sequelize";

const basename = path.basename(__filename);
const env = process.env.NODE_ENV || "development";
const config = (
  require(path.join(__dirname, "..", "config", "config.json")) as any
)[env];

type DB = {
  [key: string]: any;
  sequelize?: Sequelize;
  Sequelize?: typeof Sequelize;
};

const db: DB = {};

let sequelize: Sequelize;
if (config.use_env_variable) {
  const connectionString = process.env[config.use_env_variable];
  if (!connectionString)
    throw new Error(
      `Environment variable ${config.use_env_variable} is not set`,
    );
  sequelize = new Sequelize(connectionString, config as any);
} else {
  sequelize = new Sequelize(
    config.database,
    config.username,
    config.password,
    config as any,
  );
}

fs.readdirSync(__dirname)
  .filter((file) => {
    return (
      file.indexOf(".") !== 0 &&
      file !== basename &&
      (file.endsWith(".js") || file.endsWith(".ts")) &&
      file.indexOf(".test.") === -1
    );
  })
  .forEach((file) => {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const modelDef = require(path.join(__dirname, file));
    const model =
      typeof modelDef === "function"
        ? modelDef(sequelize, DataTypes)
        : modelDef.default
          ? modelDef.default(sequelize, DataTypes)
          : modelDef;
    if (model && model.name) db[model.name] = model;
  });

Object.keys(db).forEach((modelName) => {
  if (db[modelName] && typeof db[modelName].associate === "function") {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

export default db;

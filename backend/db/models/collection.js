"use strict";
module.exports = (sequelize, DataTypes) => {
  const Collection = sequelize.define(
    "Collection",
    {
      userid: {
        type: DataTypes.INTEGER,
      },
      name: {
        type: DataTypes.STRING,
        validate: {
          len: [1, 12],
        },
      },
    },
    {}
  );
  Collection.associate = function (models) {
    // associations can be defined here
  };
  return Collection;
};

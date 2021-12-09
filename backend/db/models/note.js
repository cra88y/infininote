"use strict";
module.exports = (sequelize, DataTypes) => {
  const Note = sequelize.define(
    "Note",
    {
      userid: DataTypes.INTEGER,
      collectionid: DataTypes.INTEGER,
      title: DataTypes.STRING,
      content: DataTypes.STRING,
    },
    {}
  );
  Note.associate = function (models) {
    Note.belongsTo(models.User, { foreignKey: "userid" });
  };
  return Note;
};

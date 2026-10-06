import { Sequelize, DataTypes, Model } from 'sequelize'
import { dbConfig } from '../../configs/db.config.js'

export const sequelize = new Sequelize(dbConfig)

export class User extends Model {}

User.init(
  {
    username: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    passwordHash: {
      type: DataTypes.STRING,
      allowNull: false
    }
  },
  {
    sequelize,
    tableName: 'users'
  }
)

export const initDatabase = async () => {
  await sequelize.authenticate()
  await sequelize.sync()
}

export default User

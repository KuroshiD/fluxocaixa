import {
  Table,
  Column,
  Model,
  DataType,
  Default,
  PrimaryKey,
  CreatedAt,
  UpdatedAt,
  Scopes
} from 'sequelize-typescript';

@Scopes(() => ({
  withPassword: {
      attributes: {
          exclude: [],
      },
  },
  defaultScope: {
      attributes: {
          exclude: ['password'],
      },
  },
}))
@Table({
  tableName: 'users',
  timestamps: true,
  indexes: [
      {
          unique: true,
          fields: ['email'],
      },
  ],
})
export class User extends Model<User> {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  public id!: string;

  @Column({
      type: DataType.STRING,
      unique: true,
      allowNull: false,
  })
  public username!: string;

  @Column({
      type: DataType.STRING,
      allowNull: false,
  })
  public password!: string;

  @Column({
      type: DataType.STRING,
      unique: true,
      allowNull: false,
  })
  public email!: string;

  @Column({
      type: DataType.ENUM('admin', 'common'),
      allowNull: false,
  })
  public role!: 'admin' | 'common';

  @CreatedAt
  @Column(DataType.DATE)
  public readonly createdAt!: Date;

  @UpdatedAt
  @Column(DataType.DATE)
  public readonly updatedAt!: Date;
}

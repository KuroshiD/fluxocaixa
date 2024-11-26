import {
  Table,
  Column,
  Model,
  DataType,
  Default,
  PrimaryKey,
} from 'sequelize-typescript';

@Table({
  tableName: 'constants',
  timestamps: false,
})
export class Constants extends Model<Constants> {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  public id!: string;

  @Column({
    type: DataType.DECIMAL(5, 2),
    allowNull: true,
    validate: {
      min: 0,
      max: 100,
    },
  })
  public profitMargin?: number;

  @Column({
    type: DataType.BLOB,
    allowNull: true,
  })
  public logo?: Buffer;

  @Column({
    type: DataType.CHAR(7),
    allowNull: true,
    validate: {
      is: /^#[0-9A-Fa-f]{6}$/,
    },
  })
  public primaryColor?: string;
}

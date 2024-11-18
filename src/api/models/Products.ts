import {
    Table,
    Column,
    Model,
    DataType,
    Default,
    PrimaryKey,
    HasMany,
  } from 'sequelize-typescript';
  import { CashFlow } from './CashFlow';
  
  @Table({
    tableName: 'products',
    timestamps: true,
    indexes: [{ unique: true, fields: ['name'] }],
  })
  export class Product extends Model<Product> {
    @PrimaryKey
    @Default(DataType.UUIDV4)
    @Column(DataType.UUID)
    public id!: string;
  
    @Column({
      type: DataType.STRING,
      allowNull: false,
    })
    public name!: string;
  
    @Column(DataType.TEXT)
    public description?: string;
  
    @Column({
      type: DataType.DECIMAL(10, 2),
      allowNull: false,
    })
    public price!: number;
  
    @Column({
      type: DataType.INTEGER,
      allowNull: false,
      defaultValue: 0,
    })
    public stock!: number;
  
    @HasMany(() => CashFlow)
    public cashFlows!: CashFlow[];
  }
  
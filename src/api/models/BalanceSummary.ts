import {
    Table,
    Column,
    Model,
    DataType,
    Default,
    PrimaryKey,
    ForeignKey,
    BelongsTo,
  } from 'sequelize-typescript';
  import { Product } from './Products';
  
  @Table({
    tableName: 'balance_summaries',
    timestamps: true,
  })
  export class BalanceSummary extends Model<BalanceSummary> {
    @PrimaryKey
    @Default(DataType.UUIDV4)
    @Column(DataType.UUID)
    public id!: string;
  
    @Column({
      type: DataType.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0,
    })
    public totalIncome!: number;
  
    @Column({
      type: DataType.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0,
    })
    public totalExpense!: number;
  
    @Column({
      type: DataType.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0,
    })
    public netResult!: number;
  
    @Column({
      type: DataType.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0,
    })
    public currentBalance!: number;
  
    @Column({
      type: DataType.DATE,
      allowNull: false,
    })
    public date!: Date;
  
    @ForeignKey(() => Product)
    @Column({
      type: DataType.UUID,
      allowNull: true,
    })
    public productId?: string;
  
    @BelongsTo(() => Product)
    public product?: Product;
  }
  
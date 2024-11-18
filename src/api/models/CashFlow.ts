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
  tableName: 'cash_flows',
  timestamps: true,
})
export class CashFlow extends Model<CashFlow> {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  public id!: string;

  @Column({
    type: DataType.ENUM('venda', 'compra', 'taxa', 'aluguel'),
    allowNull: false,
  })
  public type!: 'venda' | 'compra' | 'taxa' | 'aluguel';

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  public description!: string;

  @Column({
    type: DataType.DECIMAL(10, 2),
    allowNull: false,
  })
  public amount!: number;

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

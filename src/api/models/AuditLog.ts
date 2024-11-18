import {
    Table,
    Column,
    Model,
    DataType,
    ForeignKey,
    CreatedAt,
    BelongsTo,
  } from 'sequelize-typescript';
  import { User } from './User';
  
  @Table({
    tableName: 'audit_logs',
    timestamps: false,
  })
  export class AuditLog extends Model<AuditLog> {
    @Column({
      type: DataType.STRING,
      allowNull: false,
    })
    action!: string;
  
    @Column({
      type: DataType.JSONB,
      allowNull: true,  // Caso você queira aceitar valores nulos
    })
    details!: object;
  
    @ForeignKey(() => User)
    @Column({
      type: DataType.UUID,
      allowNull: false,
    })
    userId!: string;
  
    @BelongsTo(() => User)
    user!: User;
  
    @CreatedAt
    @Column(DataType.DATE)
    createdAt!: Date;
  }
  
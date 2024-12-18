import { BelongsTo, Column, ForeignKey, Model, PrimaryKey } from "sequelize-typescript";
import { Table } from "sequelize-typescript/dist/model/table/table";
import InvoiceModel from "./transaction.model";

@Table({
    tableName: "invoices_items",
    timestamps: false,
  })
  export default class InvoiceItemModel extends Model {
    @PrimaryKey
    @Column({ allowNull: false })
    id: string;
  
    @ForeignKey(() => InvoiceModel)
    @Column({ allowNull: false })
    invoice_id: string;
  
    @BelongsTo(() => InvoiceModel)
    invoice: InvoiceModel;
  
    @Column({ allowNull: false })
    name: string;
  
    @Column({ allowNull: false })
    price: number;
  }
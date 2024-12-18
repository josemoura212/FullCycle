import {Table, Model, PrimaryKey, Column, HasMany, ForeignKey, BelongsTo } from "sequelize-typescript";
import ClientOrder from "./client.order.model";
import ProductOrder from "./product.order.model";

@Table({
    tableName: 'order',
    timestamps: false
})
export default class OrderModel extends Model{

    @PrimaryKey
    @Column({allowNull: false})
    declare id: string;

    @ForeignKey(() => ClientOrder)
    declare client_id: string;

    @BelongsTo(() => ClientOrder)
    declare client: ClientOrder;

    @HasMany(() => ProductOrder, {onUpdate: 'CASCADE'})
    declare products?: ProductOrder[];
}
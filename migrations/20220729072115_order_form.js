/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async (knex) => {
  const result = await knex.schema
    .createTable('users', (table) => {
      table.increments('userId').notNullable().primary().comment('Primary Key');
      table.datetime('createTime').notNullable().comment('建立時間');
      table.datetime('updateTime').notNullable().comment('更新時間');
      table.string('userName', 20).notNullable().comment('使用者名稱');
      table.string('userPassword', 64).comment('使用者密碼');
      table.tinyint('adminPermission').comment('管理者權限');
    })
    .createTable('product', (table) => {
      table
        .increments('productId')
        .notNullable()
        .primary()
        .comment('Primary Key');
      table.datetime('createTime').notNullable().comment('建立時間');
      table.datetime('updateTime').notNullable().comment('更新時間');
      table.string('productName', 20).notNullable().comment('商品名稱');
      table.integer('productPrice').comment('商品價格');
      table.integer('productSales').comment('已銷售數量');
      table.integer('productStock').comment('庫存');
      table.string('note').comment('備註');
    })
    .createTable('cart', (table) => {
      table.integer('userId').unsigned().notNullable().comment('使用者ID');
      table
        .foreign('userId')
        .references('users.userId')
        .onUpdate('CASCADE')
        .onDelete('CASCADE');
      table.integer('productId').unsigned().notNullable().comment('商品ID');
      table
        .foreign('productId')
        .references('product.productId')
        .onUpdate('CASCADE')
        .onDelete('CASCADE');
      table.datetime('createTime').notNullable().comment('建立時間');
      table.datetime('updateTime').notNullable().comment('更新時間');
      table.integer('amount').notNullable().comment('數量');
      table.integer('totalPrice').notNullable().comment('總價');
      table.primary(['userId', 'productId']);
    })
    .createTable('order', (table) => {
      table.increments('id').notNullable().primary().comment('Primary Key');
      table.integer('userId').unsigned().notNullable();
      table
        .foreign('userId')
        .references('users.userId')
        .onUpdate('NO ACTION')
        .onDelete('NO ACTION');
      table.string('orderId', 36).notNullable().comment('訂單編號');
      table.integer('productId').unsigned().notNullable();
      table
        .foreign('productId')
        .references('product.productId')
        .onUpdate('NO ACTION')
        .onDelete('NO ACTION');
      table.integer('amount').notNullable().comment('數量');
      table.datetime('createTime').notNullable().comment('建立時間');
    });
  return result;
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async (knex) => {
  const result = await knex.schema
    .dropTable('users')
    .dropTable('product')
    .dropTable('cart')
    .dropTable('order');
  return result;
};

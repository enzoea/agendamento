import knex, { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('calendario', (table) => {
    table.increments('id').primary();
    table.integer('usuarios_id').unsigned().notNullable();
    table.date('data_agendamento').notNullable(); // Nome atualizado da coluna
    table.time('hora').notNullable();
    table.enu('status', ['PENDING', 'CONFIRMED', 'CANCELED']).defaultTo('PENDING');
    table.foreign('usuarios_id').references('id').inTable('usuarios').onDelete('CASCADE');
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('calendario');
}

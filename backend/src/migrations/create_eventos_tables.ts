import knex, { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('eventos', (table) => {
    table.increments('id').primary();
    table.integer('usuarios_id').unsigned().notNullable();
    table.string('titulo', 255).notNullable();
    table.date('data_evento').notNullable();
    table.foreign('usuarios_id').references('id').inTable('usuarios').onDelete('CASCADE');
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('eventos');
}

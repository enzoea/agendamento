import knex, { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('usuarios', (table) => {
    table.increments('id').primary();
    table.string('nome', 100).notNullable();
    table.string('email', 100).unique().notNullable();
    table.string('senha', 255).notNullable();
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('usuarios');
}

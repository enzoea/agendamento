import knex, { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    await knex.schema.hasTable('eventos').then(exists => {
        if (!exists) {
          return knex.schema.createTable('eventos', table => {
            table.increments('id').primary().unsigned();
            table.integer('usuarios_id').unsigned().notNullable();
            table.string('titulo', 255).notNullable();
            table.date('data_evento').notNullable();
            table.foreign('usuarios_id').references('usuarios.id').onDelete('CASCADE');
          });
        }
      });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('eventos');
}

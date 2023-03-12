const { Pool } = require("pg");
const client = new Pool();

function labelise(catName: string) {
  return catName
    .toLocaleLowerCase()
    .replace(/ /g, '-')
    .replace(/'/g, '-')
    .replace(/[éèêë]/g, 'e')
    .replace(/[âà]/g, 'a')
    .replace(/[ùûü]/g, 'u')
    .replace(/ç/g, 'c')
    .replace(/ï/g, 'i')
    .replace(/\./g, '');
}

export async function getOrCreateCategory(_catName: string) {
  let id = -1;
  client.query('begin');
  const res = await client.query(
    'select id from categories where category_name like $1',
    [_catName]
  );
  if (res.rowCount === 0) {
    const insert = await client.query(
      'insert into categories (category_name, category_label) values ($1, $2)',
      [_catName, labelise(_catName)]
    );
    const res = await client.query(
      'select id from categories where category_name like $1',
      [_catName]
    );
    id = res.rows[0].id;
  } else {
    id = res.rows[0].id;
  }
  client.query('commit');
  return id;
}

export async function getOrCreateAuthor(_authorName: string) {
    let id = -1;
    client.query('begin');
    const res = await client.query(
      'select id from authors where author_name like $1',
      [_authorName]
    );
    if (res.rowCount === 0) {
      await client.query(
        'insert into authors (author_name, author_label) values ($1, $2)',
        [_authorName, labelise(_authorName)]
      );
      const res = await client.query(
        'select id from authors where author_name like $1',
        [_authorName]
      );
      id = res.rows[0].id;
    } else {
      id = res.rows[0].id;
    }
    client.query('commit');
    return id;
  }

  export async function getOrCreateCountry(_countryName: string) {
    let id = -1;
    client.query('begin');
    const res = await client.query(
      'select id from countries where country_name like $1',
      [_countryName]
    );
    if (res.rowCount === 0) {
      const insert = await client.query(
        'insert into countries (country_name, country_label) values ($1, $2)',
        [_countryName, labelise(_countryName)]
      );
      const res = await client.query(
        'select id from countries where country_name like $1',
        [_countryName]
      );
      id = res.rows[0].id;
    } else {
      id = res.rows[0].id;
    }
    client.query('commit');
    return id;
  }

  export async function getOrCreateField(_fieldName: string) {
    let id = -1;
    const res = await client.query(
      'select id from fields where field_name like $1',
      [_fieldName]
    );
    if (res.rowCount === 0) {
      await client.query(
        'insert into fields (field_name, field_label) values ($1, $2)',
        [_fieldName, labelise(_fieldName)]
      );
      const res = await client.query(
        'select id from fields where field_name like $1',
        [_fieldName]
      );
      id = res.rows[0].id;
    } else {
      id = res.rows[0].id;
    }
    client.query('commit');
    return id;
  }


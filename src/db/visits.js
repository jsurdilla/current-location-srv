import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const INSERT_VISIT_SQL = `
  INSERT INTO visits (user_id, name)
  VALUES ($1, $2)
  RETURNING *`;

const SELECT_BY_ID = `
  SELECT *
  FROM visits
  WHERE visit_id = $1`;

const SELECT_BY_USER_ID = `
  SELECT *
  FROM visits
  WHERE user_id = $1
  ORDER BY created_at DESC
  LIMIT $2`;

const MAPPING = {
  user_id: 'userId',
  visit_id: 'visitId',
};

const camelCase = (event) => {
  const e = event;
  Object.entries(MAPPING).forEach(([k1, k2]) => {
    e[k2] = event[k1];
    delete e[k1];
  });

  return e;
};

const createVisit = async ({ userId, name }) => (
  new Promise(async (resolve, reject) => {
    try {
      const res = await pool.query(INSERT_VISIT_SQL, [userId, name]);
      resolve(camelCase(res.rows[0]));
    } catch (err) {
      reject(err);
    }
  })
);

const getById = async visitId => (
  new Promise(async (resolve, reject) => {
    try {
      const res = await pool.query(SELECT_BY_ID, [visitId]);
      if (res.rowCount === 0) {
        resolve(null);
        return;
      }
      resolve(camelCase(res.rows[0]));
    } catch (err) {
      reject(err);
    }
  })
);

const getByUserId = async (userId, { limit } = { limit: 5 }) => (
  new Promise(async (resolve, reject) => {
    try {
      const res = await pool.query(SELECT_BY_USER_ID, [userId, limit]);
      resolve(res.rows.map(v => camelCase(v)));
    } catch (err) {
      reject(err);
    }
  })
);

module.exports = {
  createVisit,
  getById,
  getByUserId,
};

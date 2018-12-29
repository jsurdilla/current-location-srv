import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const INSERT_VISIT_SQL = `
  INSERT INTO visits (user_id, location_name)
  VALUES ($1, $2)
  RETURNING *`;

const SELECT_BY_ID = `
  SELECT *
  FROM visits
  WHERE id = $1`;

const SELECT_BY_USER_ID = `
  SELECT *
  FROM visits
  WHERE user_id = $1
  ORDER BY created_at DESC
  LIMIT $2`;


const createVisit = async ({ userId, locationName }) => new Promise(async (resolve, reject) => {
  try {
    const res = await pool.query(INSERT_VISIT_SQL, [userId, locationName]);
    resolve(res.rows[0]);
  } catch (err) {
    reject(err);
  }
});

const getById = async id => (
  new Promise(async (resolve, reject) => {
    try {
      const res = await pool.query(SELECT_BY_ID, [id]);
      if (res.length === 0) {
        resolve(null);
      }
      resolve(res.rows[0]);
    } catch (err) {
      reject(err);
    }
  })
);

const getByUserId = async (userId, { limit } = { limit: 5 }) => (
  new Promise(async (resolve, reject) => {
    try {
      const res = await pool.query(SELECT_BY_USER_ID, [userId, limit]);
      resolve(res.rows);
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

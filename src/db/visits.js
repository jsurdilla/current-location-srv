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

/**
 * Creates a visit.
 *
 * @param {string} userId
 * @param {string} name name of the location
 * @returns {Promise} If successful, the promise resolves to a
 * visit record.
 */
const createVisit = async ({ userId, name }) => (
  new Promise(async (resolve) => {
    const res = await pool.query(INSERT_VISIT_SQL, [userId, name]);
    resolve(camelCase(res.rows[0]));
  })
);

/**
 * Returns a visit correspondig to the ID, if it exists.
 *
 * @param {string} visitId
 * @returns {Promise} If successful, the promise resolves to a visit
 * record, if it exists; `null` otherwise.
 */
const getById = async visitId => (
  new Promise(async (resolve) => {
    const res = await pool.query(SELECT_BY_ID, [visitId]);
    if (res.rowCount === 0) {
      resolve(null);
      return;
    }
    resolve(camelCase(res.rows[0]));
  })
);

/**
 * Returns the most recent visits by a user.
 * @param {String} userId
 * @param {Hash} options hash of options. Currently only `limit`,
 * which defaults to 5.
 * @returns {Array[visit]}
 */
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

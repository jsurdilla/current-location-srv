import fuzzy from 'fuzzy';

import { respondWithError } from '../respond';

const FUZZY_OPTIONS = {
  extract(el) { return el.name; },
};

export default (options) => {
  const { createVisit, getById, getByUserId } = options.db;

  const handleCreateVisit = async (req, res) => {
    const { userId, name } = req.body;
    if (!userId || !name) {
      respondWithError(res, null, 400, 'userId and name are required');
      return;
    }

    try {
      const visit = await createVisit({ userId, name });
      res.status(201).json(visit);
    } catch (err) {
      respondWithError(res, err, 500, 'An internal server error occurred');
    }
  };

  const handleGetVisits = async (req, res) => {
    const { visitId, userId, searchString } = req.query;

    // ensure that either a visit ID or a userID-searchString combination exists
    if (!visitId && !(userId && searchString)) {
      respondWithError(res, null, 400, 'visitID or a userId-name combination required');
      return;
    }

    try {
      if (visitId) {
        const visit = await getById(visitId);
        const visits = visit == null ? [] : [visit];
        res.status(200).json(visits);
      } else if (userId && searchString) {
        const visits = await getByUserId(userId);
        const filtered = fuzzy
          .filter(searchString, visits, FUZZY_OPTIONS)
          .map(el => el.original);
        res.status(200).json(filtered);
      }
    } catch (err) {
      respondWithError(res, err, 500, 'An internal server error occurred');
    }
  };

  return {
    handleCreateVisit,
    handleGetVisits,
  };
};

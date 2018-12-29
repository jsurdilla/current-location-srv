# Current Location Service

## Implementation Notes
The entrypoint for the application is `index.js`. It sets up the routes and dependencies, which is currently just the database.

The request handlers themselves are in the `handlers` directory. `index.js` injects a reference to the database. The database pool is injected to the handler to easily swap implementations, including using a mock for tests.

## Deployment Notes
```sh
# transpile to plain JS
babel src/**/*.js -d dist

git push -f heroku master
```

The app is deployed to Heroku. The deployment process could use a little polish. Ideally, there's no ne need to transpile the src locally before pushing.

## Potential Improvments
- Use a robust logging framework
- As the app grows, we would need to find a sustainable and robust way to deal with db migrations. In bootstrapping the application, the sole migration is run manually. It may also be worth looking into an ORM or some sort of database wrapper. In my experience, handwritten SQL, if well organized, is good enough.
- Documentation
- Stayed true to the original requirements, but I would consider renaming the endpoint to `/visits`.
- Add more handler tests
- Add db tests. More importantly, add db-layer unit tests.
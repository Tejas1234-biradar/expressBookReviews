# Express Book Reviews

## Run locally

From this directory, install the dependencies and start the API:

```sh
npm install
npm start
```

The API listens on `http://localhost:5000`. Public routes provide all books,
book details by ISBN, author, or title, and reviews by ISBN. Register with
`POST /register`, then log in with `POST /customer/login`; send the returned
JWT as `Authorization: Bearer <token>` to add or delete a review at
`/customer/auth/review/:isbn`.

The `evidence/` directory contains cURL commands and outputs for the assignment
tasks that can be demonstrated with this local API. Its `githubrepo.txt` file
records that this checkout currently points to the upstream repository, not a
personal fork; replace it with a personal-fork GitHub API response after
forking and pushing the project.

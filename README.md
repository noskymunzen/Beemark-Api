<img src="https://github.com/noskymunzen/Next-Beemark-App/blob/main/public/beemark.png" width="300">

# Beemark Api

Beemark Api for Beemark App.

Made using:

- NestJs
- Mongoose
- Passport (JWT)

## 🐝 Features

- [x] Simple bookmark managment
- [x] Metadata extraction from URLs
- [x] JWT based authentication

## 🗺️ Roadmap

- [ ] Bookmark pagination
- [ ] Email verification
- [ ] Email brand template
- [ ] Avatar support
- [ ] Swagger integration

## 🔌 Endpoints

### 🗝️ Authentication

| Method | Uri                  | Description                                     |
| ------ | -------------------- | ----------------------------------------------- |
| POST   | /auth/signup         | Register a new account                          |
| POST   | /auth/login          | Authenticates user using credentials            |
| GET    | /auth/me             | Gets user data                                  |
| POST   | /auth/recover        | Generates a password token for account recovery |
| POST   | /auth/reset-password | Updates account password                        |
| GET    | /auth/token/:code    | Gets password token by code                     |

### 📚 Bookmarks

| Method | Uri           | Description            |
| ------ | ------------- | ---------------------- |
| GET    | /bookmark     | Gets all bookmarks     |
| POST   | /bookmark     | Adds a new bookmark    |
| PUT    | /bookmark/:id | Updates bookmark by id |
| DELETE | /bookmark/:id | Deletes bookmark by id |

### 🧑 Profile

| Use | Uri      | Description       |
| --- | -------- | ----------------- |
| PUT | /profile | Updates user data |


## 📦 Dependencies

- NodeJS v19
- NPM v8

## 📦 Installation

To install project dependencies, execute command:

```bash
$ npm install
```

Then, set required environment variables creating a `.env` file. You can just copy `.env.example` by using:
```bash
$ cp .env.example .env
```
and modifies it.

## 🖥 Execution

#### Development server

To execute development server, execute command:

```bash
$ npm run start:dev
```

#### Conventional server

To run built-in server, application pre-compiling is required. First run:

```bash
$ npm run build
```

Then just run built-in server using command:

```bash
$ npm run start:prod
```



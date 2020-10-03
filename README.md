# Adonis API application
[![Build Status](https://travis-ci.org/magocod/adonisbase.svg?branch=master)](https://travis-ci.org/magocod/adonisbase)

This is the boilerplate for creating an API server in AdonisJs, it comes pre-configured with.

1. Bodyparser
2. Authentication
3. CORS
4. Lucid ORM
5. Migrations and seeds

## Setup

Install dependencies

```bash
npm install
```

### Migrations

Run the following command to run startup migrations.

```js
adonis migration:run
```

### Run tests

Run all tests

```js
adonis test
```

### Schedule tasks

* node -> https://github.com/kelektiv/node-cron

# sephy-framework-node

A simple nodejs framework using MVC structure and some components.

There are lots of features that have yet to be implemented, if you have any good ideas, feel free to submit a pull request!

Get started now!

Some of the features supported by Sephy-node:

 * Routing
 * Route Groups
 * Middlewares (route specific middlewares).
 * ORM
 * Models
 * Helpers
 
## Routes / Group Routings / Middleware
  Configure yours routes in app/routes.js
```
module.exports = (router, app) => {
    router.get('/', app.HomeController.index);
};
```

## Route Groups & Middleware
Middleware are filters to your routes, and often used for modifying or authenticating requests.
```
module.exports = (router, app, middleware) => {
    router.group("/", (router) => {
	    router.use(middleware.auth);
	    router.get("/middleware", app.HomeController.middleware);
	  });
};
```

## DBMS Support (ORM)
* MySQL & MariaDB
* PostgreSQL
* Amazon Redshift
* SQLite
* MongoDB (beta, node 6 or older, doesn't work with node 8. Also, missing aggregation features)


## Models (ORM)
>A Model is an abstraction over one or more database tables. 
>Models support associations (more below). The name of the model is assumed to match the table name.
>Models support behaviours for accessing and manipulating table data.
>[ORM WIKI](https://www.npmjs.com/package/orm)
```
module.exports = function (orm, db) {
    db.define('post', {
        title:      { type: 'text' },
        content:    { type: 'text' }
    });
};
```

## Authors

 * [Adriel Oliveira](http://adrielov.com.br) ([Github](https://github.com/adrielov)) Creator of Sephy.

module.exports = (router, app, middleware , sephy) => {

    router.get('/'             , app.HomeController.index);

    router.get('/post/:id'     , app.HomeController.get);
    
    router.get('/posts'        , app.HomeController.getall);
    
    router.post('/post'        , app.HomeController.create);
    
    router.get('/comment/:id'  , app.CommentController.get);

    router.group("/", (router) => {
	    router.use(middleware.auth);
	    router.get("/middleware", app.HomeController.middleware);
	});
};
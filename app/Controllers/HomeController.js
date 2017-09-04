
let HomeController = {
    index: function (req, res, next) {
        res.send("Sephy Framework - NodeJS");
    },
    middleware: function (req, res, next) {
        res.send("With Middleware");
    },
    get: function (req, res, next) {
        req.models.post.find({id: req.params.id}, function(err, data) {
            if(err) res.status(500).send(err);

            res.send(data[0]);
        });
    },
    getall: function (req, res, next) {
        req.models.post.find(function(err, data) {
            if(err) res.status(500).send(err);

            res.send(data);
        });
    },
    create: function (req, res, next) {
        req.models.post.create({
            title: 'title',
            content: 'content'
        }, function(err, result) {
            if(err) res.status(500).send(err);
            res.send(result);
        });
    }
}
module.exports = HomeController;
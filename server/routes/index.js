module.exports = function(app) {
    var api = '/api';
    var data = '/../../data/';
    var jsonfileservice = require('./utils/jsonfileservice')();

    app.get(api + '/customer/:id', getCustomer);
    app.get(api + '/customers', getCustomers);
    app.get(api + '/beerstyle/:id', getBeerStyle);
    app.get(api + '/beerstyles', getBeerStyles);
    app.get(api + '/hop/:id', getHop);
    app.get(api + '/hops', getHops);
    app.get(api + '/fermentables', getFermentables);
    app.get(api + '/fermentable/:id', getFermentable);

    function getCustomer(req, res, next) {
        var json = jsonfileservice.getJsonFromFile(data + 'customers.json');
        var customer = json.filter(function(c) {
            return c.id === parseInt(req.params.id);
        });
        res.send(customer[0]);
    }

    function getCustomers(req, res, next) {
        var json = jsonfileservice.getJsonFromFile(data + 'customers.json');
        res.send(json);
    }

    function getBeerStyles(req, res, next) {
        var json = jsonfileservice.getJsonFromFile(data + 'beerstyles.json');
        res.send(json.data);
    }

    function getBeerStyle(req, res, next) {
        var json = jsonfileservice.getJsonFromFile(data + 'beerstyles.json');
        var style = json.data.filter(function(c) {
            return c.id === parseInt(req.params.id);
        });
        res.send(style[0]);
    }

    function getHops(req, res, next) {
        var json = jsonfileservice.getJsonFromFile(data + 'hops.json');
        res.send(json.data);
    }

    function getHop(req, res, next) {
        var json = jsonfileservice.getJsonFromFile(data + 'hops.json');
        var style = json.data.filter(function(c) {
            return c.id === parseInt(req.params.id);
        });
        res.send(style[0]);
    }

    function getFermentables(req, res, next) {
        res.send(getData(data + 'fermentables.json'));
    }

    function getFermentable(req, res, next) {
        res.send(getDataById(data + 'fermentables.json', req.params.id))
    }

    function getDataById(jsonfile,id) {
        var json = jsonfileservice.getJsonFromFile(jsonfile);
        var item = json.data.filter(function(c) {
            return c.id === parseInt(id);
        });
        return item[0];
    }

    function getData(jsonfile) {
        var json = jsonfileservice.getJsonFromFile(jsonfile);
        return json.data;
    }
};

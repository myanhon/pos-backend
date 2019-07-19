let index = require('../models/index');

module.exports = function (app) {
    app.get('/api/seedData', function (req, res) {
        let seedData = {
            users: [
                {
                    email: 'test@gmail.com',
                    password: 'test123',
                    role: 'admin'
                },
                {
                    email: 'asdasd@gmail.com',
                    password: 'hoihoi',
                    role: 'schoonmaker'
                }
            ],
            products: [
                {
                    name: 'Chicken',
                    pricing: '1$',
                    category:[{name: 'meat'}]
                },
                {
                    name: 'Pork',
                    pricing: '1$',
                    category:[{name: 'meat'}]
                },
                {
                    name: 'Brocolli',
                    pricing: '15$',
                    category:[{name: 'vegetable'}]
                },
                {
                    name: 'Carrot',
                    pricing: '13$',
                    category:[{name: 'vegetable'}]
                }

            ]
        };

        index.create(seedData, function (err, results) {
            if (err) throw err;
            res.send(results);
        });
    });
};

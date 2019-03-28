let mongoose = require('mongoose');
let controller = require('./app/controllers/clients');
var faker = require('faker');

mongoose.connect('mongodb://localhost/greenmile', {useNewUrlParser: true});

mongoose.connection.on('connected', function(){

    console.log("Preenchendo!");
    
    var descriptions = [];
    
    for(var i=0; i < 1000000; i++){

        var description = [];
    
        var qtd = Math.floor(Math.random() * 51);
    
        for(var j=0; j < qtd; j++){
            description.push(faker.commerce.productName());
        }
    
        var client = {
            name: faker.company.companyName(), 
            latitude: faker.address.latitude(),
            longitude: faker.address.longitude(),
            description: description
        };
    
        descriptions = descriptions.concat(description);
    
        controller.insertClient(client);
    }
    
    
    //var s = new Set(descriptions);

    console.log("Terminou!");
});


/*
//console.log(descriptions.length);
//console.log(s.size);*/
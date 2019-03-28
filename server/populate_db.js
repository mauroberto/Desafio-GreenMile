let mongoose = require('mongoose');
//let controller = require('./app/controllers/clients');
let Client = require('./app/models/client');
let Attribute = require('./app/models/attribute');
var faker = require('faker');

mongoose.connect('mongodb://localhost/greenmile', {useNewUrlParser: true});

mongoose.connection.on('connected', function(){
    console.log("Preenchendo!");
    
    var descriptions = [];
    
    var listOfClients = [];

    var counting = 0;
    for(var i=1; i <= 100000; i++){

        var description = [];
    
        var clientId = mongoose.Types.ObjectId();
        var qtd = Math.floor(Math.random() * 21);
    
        for(var j=0; j < qtd; j++){
            var descriptionName = faker.commerce.productName();
            if(descriptions[descriptionName] == undefined){
                descriptions[descriptionName] = {
                    name: descriptionName,
                    clients: [clientId]
                }
            } else{
                descriptions[descriptionName].clients.push(clientId);
            }

            description.push(descriptionName);
        }
    
        var client = {
            _id: clientId,
            name: faker.company.companyName(), 
            latitude: faker.address.latitude(),
            longitude: faker.address.longitude(),
            description: description
        };
    
        listOfClients.push(client);

        if(i % 10000 == 0 ){
            var newArrayOfClients = listOfClients.slice();
            console.log(counting++);
            Client.collection.insertMany(newArrayOfClients, function(err, docs) {
                if (err) {
                    console.log("Error!");
                    console.log(error);
                } else {
                    console.info('%d clients were successfully stored.', newArrayOfClients.length);
                }
            });

            listOfClients = [];
        }
    }

    var newArrayOfDescriptions = [];

    for(var key in descriptions){
        newArrayOfDescriptions.push(descriptions[key]);
    }

    console.log(newArrayOfDescriptions.length);

    Attribute.collection.insertMany(newArrayOfDescriptions, function(err, docs) {
        if (err) {
            console.log("Error!");
            console.log(err);
        } else {
            console.info('%d attributes were successfully stored.', newArrayOfDescriptions.length);
        }
    });
});

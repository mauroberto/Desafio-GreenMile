let AddonKNearests = require('../../build/Release/kNearests');
let Client = require('../models/client');
let Attribute = require('../models/attribute');

// Calcula a distância em KM entre duas coordenadas
// Fonte: https://stackoverflow.com/a/27943
module.exports.getDistanceFromLatLonInKm = function(lat1,lon1,lat2,lon2) {
    var R = 6371; // Raio da terra em km
    var dLat = (lat2-lat1) * (Math.PI/180);
    var dLon = (lon2-lon1) * (Math.PI/180); 
    var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * (Math.PI/180)) * Math.cos(lat2 * (Math.PI/180)) * 
      Math.sin(dLon/2) * Math.sin(dLon/2); 
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
    var d = R * c;
    return d;
}

// Recebe como entrada um cliente e uma lista de clientes
// Calcula a distância do cliente recebido no primeiro parâmetro para toda a lista de clientes passada no segundo parâmetro
// Devolve uma lista de objetos, em que cada objeto contém a distância em KM e o código do cliente  
module.exports.calculateDistances = function(client, listOfClients){
    var distances = [];

    if (client === undefined || listOfClients === undefined) return [];

    for (var i = 0; i < listOfClients.length; i++){
        if(listOfClients[i]._id.equals(client._id)){     //Eliminando o cliente passado como parâmetro
            continue;
        }

        distances.push({
            id: i,
            value: this.getDistanceFromLatLonInKm(client.latitude, client.longitude, 
                listOfClients[i].latitude, listOfClients[i].longitude)        
        });
    }

    return distances;
}

// Recebe um code de um ponto e um inteiro
// Busca os nResults pontos mais próximos do ponto com _id == code
// A complexidade esperada dessa função é O(N), em que N é o número de clientes no banco
// A complexidade de memória é O(N)
module.exports.findNearest = function(req, res){
    let idClient = req.params.code;
    let k = req.params.nResults;
    let promise = Client.findOne({"_id": idClient});
    
    promise.then(
        function(client){
            let promise2 = Client.find();
            promise2.then(
                function(clients){
                    var distances = module.exports.calculateDistances(client, clients);

                    var nearests = AddonKNearests.kNearests(distances, k);

                    var nearestClients = [].map.call(nearests, function(obj) {
                        return clients[obj];
                    });

                    res.json(nearestClients);
                }
            ).catch(
                function(error){
                    res.status(404).end();
                }
            )
        }
    ).catch(
        function(error){
            res.status(404).end();
        }
    )
}

// Recebe um code de um ponto, um inteiro nResults e uma string attr
// Busca os nResults pontos mais próximos do ponto com _id == code e que possuem attr como atributo
// A complexidade dessa função é O(lgM + N), em que M é o número de atributos distintos existentes no banco e N é o número de clientes com tal atributo
// A complexidade de memória é O(N)
module.exports.findNearestWithAttribute = function(req, res){
    let idClient = req.params.code;
    let k = req.params.nResults;
    let attr = req.params.attr;
    let promise = Client.findOne({"_id": idClient});
    promise.then(
        function(client){
            let promise2 = Attribute.findOne({"name": attr}).populate('clients').exec();
            promise2.then(
                function(attribute){
                    var clients = attribute.clients;
                    
                    var distances = module.exports.calculateDistances(client, clients);

                    var nearests = AddonKNearests.kNearests(distances, k);

                    var nearestClients = [].map.call(nearests, function(obj) {
                        return clients[obj];
                    });

                    res.json(nearestClients);
                }
            ).catch(
                function(error){
                    res.status(404).end();
                }
            )
        }
    ).catch(
        function(error){
            res.status(404).end();
        }
    )
}

module.exports.findClients = function(req, res){
    let promise = Client.find().limit(100);
    promise.then(
        function(clients){
            res.json(clients);
        }
    ).catch(
        function(error){
            res.status(500).end();
        }
    )
}

module.exports.findAttributes = function(req, res){
    let promise = Attribute.find({}, {'_id': false, 'clients': false});
    promise.then(
        function(attributes){
            res.json(attributes);
        }
    ).catch(
        function(error){
            res.status(500).end();
        }
    )
}
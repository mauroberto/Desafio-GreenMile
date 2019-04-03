let AddonKNearests = require('../../build/Release/kNearests');
let Client = require('../models/client');
let Attribute = require('../models/attribute');

// Recebe um code de um ponto e um inteiro
// Busca os nResults pontos mais próximos do ponto com _id == code
// A complexidade dessa função é O(N), em que N é o número de clientes no banco
// A complexidade de memória é O(N)
module.exports.findNearest = function(req, res){
    let idClient = req.params.code;
    let k = req.params.nResults;
    let promise = Client.findOne({"_id": idClient});
    
    promise.then(
        function(client){
            if (!client){
                res.status(404).end();
            }
            let promise2 = Client.find({"_id": {$ne: idClient}});
            promise2.then(
                function(clients){

                    var nearests, nearestsClients;
                    if( k < clients.length ){
                        nearests = AddonKNearests.kNearests(client, clients, k);
                        nearestsClients = [].map.call(nearests, function(i) {
                            return clients[i];
                        });
                    }else{
                        nearestsClients = clients;
                    }

                    res.json(nearestsClients);
                }
            ).catch(
                function(error){
                    res.status(500).end();
                }
            )
        }
    ).catch(
        function(error){
            res.status(500).end();
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
            if(!client){
                res.status(404).end();
            }
            let promise2 = Attribute.findOne({"name": attr}).populate('clients').exec();
            promise2.then(
                function(attribute){
                    if(!attribute){
                        res.status(404).end();
                    }

                    var clients = [];
                    
                    for(var i = 0; i < attribute.clients.length; i++){
                        if(attribute.clients[i]._id != idClient)
                            clients.push(attribute.clients[i]);   
                    }
                    
                    
                    var nearests, nearestsClients;
                    if( k < clients.length ){
                        nearests = AddonKNearests.kNearests(client, clients, k);
                        nearestsClients = [].map.call(nearests, function(i) {
                            return clients[i];
                        });
                    }else{
                        nearestsClients = clients;
                    }

                    res.json(nearestsClients);
                }
            ).catch(
                function(error){
                    res.status(404).end();
                }
            )
        }
    ).catch(
        function(error){
            res.status(500).end();
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
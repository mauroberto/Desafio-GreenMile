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

    if(client == undefined || listOfClients == undefined) return [];

    for (var i = 0; i < listOfClients.length; i++){
        if(listOfClients[i]._id.equals(client._id)){     //Eliminando o cliente passado como parâmetro
            continue;
        }

        distances.push({
            _id: listOfClients[i]._id,
            value: this.getDistanceFromLatLonInKm(client.latitude, client.longitude, 
                listOfClients[i].latitude, listOfClients[i].longitude),
            client: listOfClients[i]
        });
    }

    return distances;
}


// Recebe uma lista de distâncias, um inteiro p, o início da lista (begin) e o fim da lista (end)
// Modifica a lista de forma semelhante ao particionamento do quicksort, os valores melhores ou iguais ao da posição p são colocados a esquerda e os maiores a direita
// A compleixade de tempo é O(N), em que N é o número de elementos no intervalo [begin, end]
// Modifica a lista e devolve a posição de p na nova lista
module.exports.partition = function(distances, p, begin, end){

    if (begin >= end || distances == undefined || distances.length == 0) {
        return -1;
    }

    [distances[p], distances[end]] = [distances[end], distances[p]]; //swap end e p

    p = end;

    var start = begin - 1;

    for (var i = begin; i <= end - 1; i++){
        if (distances[i].value <= distances[p].value){
            start ++;
            [distances[start], distances[i]] = [distances[i], distances[start]];
        }
    }

    [distances[start + 1], distances[p]] = [distances[p], distances[start + 1]];
    p = start + 1;

    return p;
}


// Recebe uma lista de distâncias, um inteiro k, um inteiro begin (que indica em que índice começa a lista) e um inteiro end (que indica onde termina a lista)
// Devolve as k menores distâncias da lista
// A complexidade esperada é de O(N), em que N é o número de elementos no intervalo [begin, end]
// No pior caso, a complexidade é O(N^2), mas o pior caso é muito difícil de acontecer
// A complexidade de memória é O(N)
module.exports.kNearestsRecursive = function(distances, k, begin, end){
    var n = (end - begin) + 1;

    if(distances == undefined || k == 0 || n == 0){
        return;
    }

    if (n <= k || k == 0){
        return;
    } else{
        var p = begin + Math.floor(Math.random() * n); // Escolhe aleatoriamente uma posição no intervalo [begin, end] para ser o pivô

        p = this.partition(distances, p, begin, end); // Atualiza o pivô para a posição correta
        
        var smallersEqThanPivot = (p - begin + 1); 

        if(smallersEqThanPivot == k){
            return;
        }else if(smallersEqThanPivot > k){
            this.kNearestsRecursive(distances, k, begin, p - 1); 
        } else {
            this.kNearestsRecursive(distances, k - smallersEqThanPivot, p + 1, end);
        }
    }
}

// Recebe uma lista de distâncias e um inteiro k
// Devolve as k menores distâncias da lista
// Utiliza a função kNearestsRecursive para modificar a lista e devolve apenas os primeiros k elementos da lista modificada
module.exports.kNearests = function(distances, k){
    if(distances == undefined || k == 0 || distances.length == 0){
        return [];
    }
    this.kNearestsRecursive(distances, k, 0, distances.length - 1);
    return distances.slice(0, k);
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

                    var nearests = module.exports.kNearests(distances, k);

                    var nearestClients = [].map.call(nearests, function(obj) {
                        return obj.client;
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

                    var nearests = module.exports.kNearests(distances, k);

                    var nearestClients = [].map.call(nearests, function(obj) {
                        return obj.client;
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
            res.status(404).send("Não existe");
        }
    )
}
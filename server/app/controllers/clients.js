let Client = require('../models/client');

// Calcula a distância em KM entre duas coordenadas
// Fonte: https://stackoverflow.com/a/27943
module.exports.getDistanceFromLatLonInKm = function(lat1,lon1,lat2,lon2) {
    var R = 6371; // Raio da terra em km
    var dLat = (lat2-lat1) * (Math.PI/180);
    var dLon = (lon2-lon1) * (Math.PI/180); 
    var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
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

    for (var i = 0; i < listOfClients.length; i++){
        if(listOfClients[i]._id == client._id){     //Eliminando o cliente passado como parâmetro
            continue;
        }

        distances.push({
            _id: listOfClients[i]._id,
            value: getDistanceFromLatLonInKm(client.latitude, client.longitude, 
                    listOfClients[i].latitude, listOfClients[i].longitude)
        });
    }

    return distances;
}


// Recebe uma lista de distâncias, um inteiro p, o início da lista (begin) e o fim da lista (end)
// Modifica a lista de forma semelhante ao particionamento do quicksort, os valores melhores ou iguais ao da posição p são colocados a esquerda e os maiores a direita
// A compleixade de tempo é O(N), em que N é o tamanho da lista de distâncias
// Modifica a lista e devolve a posição de p na nova lista
module.exports.partition = function(distances, p, begin, end){
    [distances[p], distances[end]] = [distances[end], distances[p]]; //swap end e p

    p = end;

    if (begin == end) return;

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
// A complexidade esperada é de O(N), em que N é o tamanho da lista de distâncias
// No pior caso, a complexidade é O(N^2), mas o pior caso é muito difícil de acontecer
// A complexidade de memória é O(N)
module.exports.kNearestsRecursive = function(distances, k, begin, end){
    var n = (end - begin) + 1;

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
    this.kNearestsRecursive(distances, k, 0, distances.length - 1);
    return distances.slice(0, k);
}


module.exports.findNearest = function(req, res){
    let promise = User.find();
    promise.then(
        function(users){
            res.json(users);
        }
    ).catch(
        function(error){
            res.status(500).end();
        }
    )
}

module.exports.findNearestWithAttribute = function(req, res){
    let id = req.params.id;
    let promise = User.findById(id);
    promise.then(
        function(user){
            res.json(user);
        }
    ).catch(
        function(error){
            res.status(404).send("Não existe");
        }
    )
}

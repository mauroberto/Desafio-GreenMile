const test = require('tape')
const index = require('./app/controllers/clients')


//Partition Tests
 var validatePartition = function(distances, p, begin, end){
    var i;

    for (i = begin; i <= p; i++){
        if(distances[i].value > distances[p].value){
            return false;
        }
    }

    for (i = p+1; i <= end; i++){
        if(distances[i].value <= distances[p].value){
            return false;
        }
    }

    return true;
}

test('Particionar Vetor', (t) => {
    var distances = [
        {_id: 1, value: 10, client: {}}, 
        {_id: 2, value: 3, client: {}}, 
        {_id: 3, value: 20, client: {}},
        {_id: 4, value: 15, client: {}},
        {_id: 5, value: 2, client: {}},
        {_id: 6, value: 150, client: {}},
        {_id: 7, value: 1, client: {}}
    ];

    var p = index.partition(distances, 3, 0, 6);    
    t.assert(validatePartition(distances, p, 0, 6) == true, "Particionou Corretamente")
    t.end()  
})

test('Particionar Vetor Vazio', (t) => {
    var p = index.partition([], 3, 0, 6);    
    t.assert(p == -1, "Particionou Corretamente")
    t.end()  
})

test('Particionar Vetor undefined', (t) => {
    var p = index.partition(undefined, 3, 0, 6);    
    t.assert(p == -1, "Particionou Corretamente")
    t.end()  
})

test('Particionar Vetor com end > begin', (t) => {
    var distances = [
        {_id: 1, value: 10, client: {}}, 
        {_id: 2, value: 3, client: {}}, 
        {_id: 3, value: 20, client: {}},
        {_id: 4, value: 15, client: {}},
        {_id: 5, value: 2, client: {}},
        {_id: 6, value: 150, client: {}},
        {_id: 7, value: 1, client: {}}
    ];
    var p = index.partition(distances, 3, 6, 3);    
    t.assert(p == -1, "Particionou Corretamente")
    t.end()  
})

test('Particionar Subvetor', (t) => {
    var distances = [
        {_id: 1, value: 10, client: {}}, 
        {_id: 2, value: 3, client: {}}, 
        {_id: 3, value: 20, client: {}},
        {_id: 4, value: 15, client: {}},
        {_id: 5, value: 2, client: {}},
        {_id: 6, value: 150, client: {}},
        {_id: 7, value: 1, client: {}}
    ];

    var p = index.partition(distances, 3, 3, 6);    
    t.assert(validatePartition(distances, p, 3, 6) == true, "Particionou Corretamente")
    t.end()  
})

test('Particionar Subvetor 2', (t) => {
    var distances = [
        {_id: 1, value: 10, client: {}}, 
        {_id: 2, value: 3, client: {}}, 
        {_id: 3, value: 20, client: {}},
        {_id: 4, value: 15, client: {}},
        {_id: 5, value: 2, client: {}},
        {_id: 6, value: 150, client: {}},
        {_id: 7, value: 1, client: {}}
    ];

    var p = index.partition(distances, 6, 3, 6);    
    t.assert(validatePartition(distances, p, 3, 6) == true, "Particionou Corretamente")
    t.end()  
})


// kNearests Tests
var listContains = function(element, list){
    for (var i = 0; i < list.length; i++){
        if (list[i]._id == element._id)
            return true;
    }
    return false;
}

var validatekNearests = function(returned, expected){
    if(returned.length != expected.length)
        return false;

    for (var i = 0; i < returned.length; i++){
        if(!listContains(returned[i], expected))
            return false;
    }
    return true;
}


test('k mais próximos', (t) => {
    var distances = [
        {_id: 1, value: 10, client: {}}, 
        {_id: 2, value: 3, client: {}}, 
        {_id: 3, value: 20, client: {}},
        {_id: 4, value: 15, client: {}},
        {_id: 5, value: 2, client: {}},
        {_id: 6, value: 150, client: {}},
        {_id: 7, value: 1, client: {}}
    ];

    var returned = index.kNearests(distances, 3);    
    var expected = [ 
        {_id: 2, value: 3, client: {}}, 
        {_id: 5, value: 2, client: {}},
        {_id: 7, value: 1, client: {}}
    ];

    t.assert(validatekNearests(returned, expected) == true, "Selecionou Corretamente")
    t.end()  
})

test('k mais próximos com vetor distances vazio', (t) => {
    var returned = index.kNearests([], 3);   

    t.assert(returned != undefined && returned.length == 0, "Selecionou Corretamente")
    t.end()  
})

test('k mais próximos com vetor distances undefined', (t) => {
    var returned = index.kNearests(undefined, 3);    

    t.assert(returned != undefined && returned.length == 0, "Selecionou Corretamente")
    t.end()  
})

test('k mais próximos com k == 0', (t) => {
    var distances = [
        {_id: 1, value: 10, client: {}}, 
        {_id: 2, value: 3, client: {}}, 
        {_id: 3, value: 20, client: {}},
        {_id: 4, value: 15, client: {}},
        {_id: 5, value: 2, client: {}},
        {_id: 6, value: 150, client: {}},
        {_id: 7, value: 1, client: {}}
    ];

    var returned = index.kNearests(distances, 0); 

    t.assert(returned != undefined && returned.length == 0, "Selecionou Corretamente")
    t.end()  
})

test('k mais próximos com k > N/2', (t) => {
    var distances = [
        {_id: 1, value: 10, client: {}}, 
        {_id: 2, value: 3, client: {}}, 
        {_id: 3, value: 20, client: {}},
        {_id: 4, value: 15, client: {}},
        {_id: 5, value: 2, client: {}},
        {_id: 6, value: 150, client: {}},
        {_id: 7, value: 1, client: {}}
    ];

    var returned = index.kNearests(distances, 5);    
    var expected = [ 
        {_id: 2, value: 3, client: {}}, 
        {_id: 5, value: 2, client: {}},
        {_id: 7, value: 1, client: {}},
        {_id: 1, value: 10, client: {}}, 
        {_id: 4, value: 15, client: {}}
    ];

    t.assert(validatekNearests(returned, expected) == true, "Selecionou Corretamente")
    t.end()  
})

test('k mais próximos subvetor', (t) => {
    var distances = [
        {_id: 1, value: 10, client: {}}, 
        {_id: 2, value: 3, client: {}}, 
        {_id: 3, value: 20, client: {}},
        {_id: 4, value: 15, client: {}},
        {_id: 5, value: 2, client: {}},
        {_id: 6, value: 150, client: {}},
        {_id: 7, value: 1, client: {}}
    ];

    index.kNearestsRecursive(distances, 3, 3, 6);
    var returned = distances.slice(3, 6);
    var expected = [ 
        {_id: 4, value: 15, client: {}},
        {_id: 5, value: 2, client: {}},
        {_id: 7, value: 1, client: {}}
    ];

    t.assert(validatekNearests(returned, expected) == true, "Selecionou Corretamente")
    t.end()  
})


test('k mais próximos com k > N', (t) => {
    var distances = [
        {_id: 1, value: 10, client: {}}, 
        {_id: 2, value: 3, client: {}}, 
        {_id: 3, value: 20, client: {}},
        {_id: 4, value: 15, client: {}},
        {_id: 5, value: 2, client: {}},
        {_id: 6, value: 150, client: {}},
        {_id: 7, value: 1, client: {}}
    ];

    var returned = index.kNearests(distances, 15);    
    var expected = [ 
        {_id: 1, value: 10, client: {}}, 
        {_id: 2, value: 3, client: {}}, 
        {_id: 3, value: 20, client: {}},
        {_id: 4, value: 15, client: {}},
        {_id: 5, value: 2, client: {}},
        {_id: 6, value: 150, client: {}},
        {_id: 7, value: 1, client: {}}
    ];

    t.assert(validatekNearests(returned, expected) == true, "Selecionou Corretamente")
    t.end()  
})

test('k mais próximos com k == 0', (t) => {
    var distances = [
        {_id: 1, value: 10, client: {}}, 
        {_id: 2, value: 3, client: {}}, 
        {_id: 3, value: 20, client: {}},
        {_id: 4, value: 15, client: {}},
        {_id: 5, value: 2, client: {}},
        {_id: 6, value: 150, client: {}},
        {_id: 7, value: 1, client: {}}
    ];

    var returned = index.kNearests(distances, 0);

    t.assert(returned != undefined && returned.length == 0, "Selecionou Corretamente")
    t.end()  
})


// calculateDistances Tests

test('Calcular distâncias com vetor de clientes vazio', (t) => {
    var returned = index.calculateDistances({}, []);    

    t.assert(returned != undefined && returned.length == 0, "Calculou Corretamente")
    t.end()  
})

test('Calcular distâncias com vetor de clientes undefined', (t) => {
    var returned = index.calculateDistances({}, undefined);    

    t.assert(returned != undefined && returned.length == 0, "Calculou Corretamente")
    t.end()  
})

test('Calcular distâncias com cliente undefined', (t) => {
    var returned = index.calculateDistances(undefined, []);    

    t.assert(returned != undefined && returned.length == 0, "Calculou Corretamente")
    t.end()  
})
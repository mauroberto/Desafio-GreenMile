const test = require('tape')
const index = require('../app/controllers/clients')
const AddonKNearests = require('../build/Release/kNearests');

// kNearests Tests
var listContains = function(element, list){
    for (var i = 0; i < list.length; i++){
        if (list[i] == element)
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
    var distances = [10, 3, 20, 15, 2, 150, 1];

    var returned = AddonKNearests.kNearests(distances, 3);    
    var expected = [1, 4, 6];

    t.assert(validatekNearests(returned, expected) == true, "Selecionou Corretamente")
    t.end()  
})

test('k mais próximos com vetor distances vazio', (t) => {
    var returned = AddonKNearests.kNearests([], 3);   

    t.assert(returned != undefined && returned.length == 0, "Selecionou Corretamente")
    t.end()  
})

test('k mais próximos com vetor distances undefined', (t) => {
    var returned = AddonKNearests.kNearests(undefined, 3);    

    t.assert(returned != undefined && returned.length == 0, "Selecionou Corretamente")
    t.end()  
})

test('k mais próximos com k == 0', (t) => {
    var distances = [10, 3, 20, 15, 2, 150, 1];

    var returned = AddonKNearests.kNearests(distances, 0); 

    t.assert(returned != undefined && returned.length == 0, "Selecionou Corretamente")
    t.end()  
})

test('k mais próximos com k > N/2', (t) => {
    var distances = [10, 3, 20, 15, 2, 150, 1];

    var returned = AddonKNearests.kNearests(distances, 5);    
    var expected = [1, 4, 6, 0, 3];

    t.assert(validatekNearests(returned, expected) == true, "Selecionou Corretamente")
    t.end()  
})

test('k mais próximos com k > N', (t) => {
    var distances = [10, 3, 20, 15, 2, 150, 1];

    var returned = AddonKNearests.kNearests(distances, 15);    
    var expected = [0, 1, 2, 3, 4, 5, 6];

    console.log(returned);

    t.assert(validatekNearests(returned, expected) == true, "Selecionou Corretamente")
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
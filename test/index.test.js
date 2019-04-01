const test = require('tape')
const index = require('../app/controllers/clients')
const AddonKNearests = require('../build/Release/kNearests');

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

var clients = [
    {
        _id: "5c9d2a11388216d53cf18f52",
        name: "Horizonte",
        latitude: -4.0932347,
        longitude: -38.5068565,
        description:[
            "região metropolitana", "interior"
        ]
    },
    {
        _id: "5c9d2a1a8cc12816f5c6f2f6",
        name: "Fortaleza",
        latitude: -3.7900979,
        longitude: -38.5891584,
        description:[
            "capital"
        ]
    },        
    {
        _id: "5c9d2a251e6a406082e12074",
        name: "Pacajus",
        latitude: -4.1779033,
        longitude: -38.4810193,
        description:[
            "região metropolitana", "interior"
        ]
    },
    {
        _id: "5c9d2a5f9cb0f3638e05bce5",
        name: "Quixeramobim",
        latitude: -5.1975061,
        longitude: -39.2997464,
        description:[
            "sertão central", "interior"
        ]
    },
    {
        _id: "5c9d2a6b82edf5088c6e9205",
        name: "Cedro",
        latitude: -6.5783991,
        longitude: -39.1787392,
        description:[
            "sertão central", "interior"
        ]
    }
];

var client = {
    _id: "5c9d29fbcd7049d394076e1f",
    name: "Quixada",
    latitude: -4.9167557,
    longitude: -39.2055092,
    description:[
        "sertão central", "interior"
    ]
};

test('k mais próximos', (t) => {

    var returned = AddonKNearests.kNearests(client, clients, 3);    
    var expected = [0, 2, 3];

    console.log(returned);

    t.assert(validatekNearests(returned, expected) == true, "Selecionou Corretamente")
    t.end()  
})

test('k mais próximos com vetor de clientes vazio', (t) => {
    var returned = AddonKNearests.kNearests(client, [], 3);   

    t.assert(returned != undefined && returned.length == 0, "Selecionou Corretamente")
    t.end()  
})

test('k mais próximos com vetor clients undefined', (t) => {
    var returned = AddonKNearests.kNearests(client, undefined, 3);    

    t.assert(returned != undefined && returned.length == 0, "Selecionou Corretamente")
    t.end()  
})

test('k mais próximos com k == 0', (t) => {
    var returned = AddonKNearests.kNearests(client, clients, 0); 

    t.assert(returned != undefined && returned.length == 0, "Selecionou Corretamente")
    t.end()  
})

test('k mais próximos com k > N/2', (t) => {
    var returned = AddonKNearests.kNearests(client, clients, 4);    
    var expected = [0, 1, 2, 3];

    t.assert(validatekNearests(returned, expected) == true, "Selecionou Corretamente")
    t.end()  
})

test('k mais próximos com k > N', (t) => {

    var returned = AddonKNearests.kNearests(client, clients, 15);    
    var expected = [0, 1, 2, 3, 4];

    t.assert(validatekNearests(returned, expected) == true, "Selecionou Corretamente")
    t.end()  
})
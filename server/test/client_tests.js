let mongoose = require("mongoose");
let Client = require('../app/models/client');
let Attribute = require('../app/models/attribute');

let chai = require('chai');
let chaiHttp = require('chai-http');
process.env.NODE_ENV = 'test';
let server = require('../script');
let should = chai.should();
let data = require("./data");

var ObjectID = require('mongodb').ObjectID;

chai.use(chaiHttp);


describe('Clients', () => {
    before(function(done) {
        Client.remove({}, (err) => { 
            for (var i = 0; i < data.clients.length; i++){
                data.clients[i]._id = new ObjectID(data.clients[i]._id);
            }

            Client.collection.insertMany(data.clients, (err) => {
                console.log("Coleção de clientes configurada");
                Attribute.remove({}, (err) => { 

                    for (var i = 0; i < data.attributes.length; i++){
                        data.attributes[i]._id = new ObjectID(data.attributes[i]._id);
                        for (var j = 0; j < data.attributes[i].clients.length; j++){
                            data.attributes[i].clients[j] = new ObjectID(data.attributes[i].clients[j]);
                        }
                    }

                    Attribute.collection.insertMany(data.attributes, (err) => { 
                        console.log("Coleção de atributos configurada");
                        done();
                    });          
                });
            });        
        });
    });

    describe('FindNearests', () => {
        it('Deve retornar as duas cidades mais próximas de Horizonte (Fortaleza e Pacajus)', (done) => {
            chai.request(server)
                .get('/api/findNearest/5c9d2a11388216d53cf18f52/2')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('array');
                    res.body.length.should.be.eql(2);
                    done();
                });
        });

        it('Teste com nResults > N, deve retornar todas as cidades, exceto Horizonte', (done) => {
            chai.request(server)
                .get('/api/findNearest/5c9d2a11388216d53cf18f52/10')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('array');
                    res.body.length.should.be.eql(5);
                    done();
                });
        });

        it('Teste com nResults faltando. Deve retornar erro 404', (done) => {
            chai.request(server)
                .get('/api/findNearest/5c9d2a11388216d53cf18f52')
                .end((err, res) => {
                    res.should.have.status(404);
                    done();
                });
        });

        it('Teste com nResults negativo. Deve retornar erro 400', (done) => {
            chai.request(server)
                .get('/api/findNearest/5c9d2a11388216d53cf18f52/-10')
                .end((err, res) => {
                    res.should.have.status(400);
                    done();
                });
        });

        it('Teste com nResults double. Deve retornar erro 400', (done) => {
            chai.request(server)
                .get('/api/findNearest/5c9d2a11388216d53cf18f52/10.5')
                .end((err, res) => {
                    res.should.have.status(400);
                    done();
                });
        });

        it('Teste com nResults string. Deve retornar erro 400', (done) => {
            chai.request(server)
                .get('/api/findNearest/5c9d2a11388216d53cf18f52/asd')
                .end((err, res) => {
                    res.should.have.status(400);
                    done();
                });
        });

        it('Teste com code inválido. Deve retornar erro 400', (done) => {
            chai.request(server)
                .get('/api/findNearest/-10/5')
                .end((err, res) => {
                    res.should.have.status(400);
                    done();
                });
        });

        it('Teste com code válido, mas que não está no banco. Deve retornar 404', (done) => {
            chai.request(server)
                .get('/api/findNearest/5c9d799d32df2ef47c23a442/5')
                .end((err, res) => {
                    res.should.have.status(404);
                    done();
                });
        });
    });

    describe('FindNearestsWithAttribute', () => {
        it('Deve retornar a cidade mais próxima de Horizonte que é capital (Fortaleza)', (done) => {
            chai.request(server)
                .get('/api/findNearest/5c9d2a11388216d53cf18f52/1/capital')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('array');
                    res.body.length.should.be.eql(1);
                    res.body[0].name.should.be.eql("Fortaleza");
                    done();
                });
        });

        it('Teste com nResults > N, deve retornar todas as cidades do sertão central', (done) => {
            chai.request(server)
                .get('/api/findNearest/5c9d2a11388216d53cf18f52/10/sertão central')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('array');
                    res.body.length.should.be.eql(3);
                    done();
                });
        });

        it('Teste com nResults negativo. Deve retornar erro 400', (done) => {
            chai.request(server)
                .get('/api/findNearest/5c9d2a11388216d53cf18f52/-10/sertão central')
                .end((err, res) => {
                    res.should.have.status(400);
                    done();
                });
        });

        it('Teste com nResults double. Deve retornar erro 400', (done) => {
            chai.request(server)
                .get('/api/findNearest/5c9d2a11388216d53cf18f52/10.5/sertão central')
                .end((err, res) => {
                    res.should.have.status(400);
                    done();
                });
        });

        it('Teste com nResults string. Deve retornar erro 400', (done) => {
            chai.request(server)
                .get('/api/findNearest/5c9d2a11388216d53cf18f52/asd/sertão central')
                .end((err, res) => {
                    res.should.have.status(400);
                    done();
                });
        });

        it('Teste com code inválido. Deve retornar erro 400', (done) => {
            chai.request(server)
                .get('/api/findNearest/-10/5/sertão central')
                .end((err, res) => {
                    res.should.have.status(400);
                    done();
                });
        });

        it('Teste com code válido, mas que não está no banco. Deve retornar 404', (done) => {
            chai.request(server)
                .get('/api/findNearest/5c9d799d32df2ef47c23a442/5/sertão central')
                .end((err, res) => {
                    res.should.have.status(404);
                    done();
                });
        });

    });

});
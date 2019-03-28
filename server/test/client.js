let mongoose = require("mongoose");
let Client = require('../app/models/client');
let Attribute = require('../app/models/client');

let chai = require('chai');
let chaiHttp = require('chai-http');
process.env.NODE_ENV = 'test';
let server = require('../script');
let should = chai.should();
let data = require("./data");


chai.use(chaiHttp);

describe('Clear database', () => {
    Client.remove({}, (err) => { 
        done();           
    });

    Attribute.remove({}, (err) => { 
        done();           
    });
});

describe('Populate database', () => {
    Client.collection.insert(data.clients, (err) => { 
        done();           
    });

    Attribute.collection.insert(data.attributes, (err) => { 
        done();           
    });
});

describe('FindNearests', () => {
    it('Deve retornar as duas cidades mais próximas de Horizonte (Fortaleza e Pacajus)', (done) => {
        chai.request(server)
            .get('/api/findNearests/5c9d2a11388216d53cf18f52/2')
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('array');
                res.body.length.should.be.eql(2);
                done();
            });
    });
});

describe('Find k Nearests', () => {
    it('it should not POST a book without pages field', (done) => {
        let book = {
            title: "The Lord of the Rings",
            author: "J.R.R. Tolkien",
            year: 1954
        }
    chai.request(server)
        .post('/book')
        .send(book)
        .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a('object');
            res.body.should.have.property('errors');
            res.body.errors.should.have.property('pages');
            res.body.errors.pages.should.have.property('kind').eql('required');
            done();
        });
    });
});

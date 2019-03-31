/**
 * @api {get} /attributes Request Attributes
 * @apiName GetAttributes
 * @apiGroup Attribute
 * @apiVersion 0.1.0
 *
 * @apiSuccess {Attribute[]}    attributes          List of attributes.
 * @apiSuccess {String}         attributes.name     Attribute Name.
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       [
 *          {
 *              "name": "região metropolinata",
 *          },
 *          {
 *              "name": "capital",
 *          },
 *          {
 *              "name": "sertão central",
 *          },
 *          {
 *              "name": "interior",
 *          }
 *       ]
 *     }
 *
 * @apiError Internal Server Error
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 500 Internal Error
 *     {
 *       "error": "Internal Error"
 *     }
 */


 /**
 * @api {get} /clients Request Clients
 * @apiName GetClients
 * @apiGroup Client
 * @apiVersion 0.1.0
 *
 * @apiSuccess {Client[]}   clients                 List of clients.
 * @apiSuccess {String}     clients.name            Client Name.
 * @apiSuccess {String[]}   clients.description     Client Attributes.
 * @apiSuccess {String}     clients._id             Client Id.
 * @apiSuccess {Number}     clients.latitude        Client Latitude.
 * @apiSuccess {Number}     clients.longitude       Client Longitude.
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *        [
 *           {
 *              "_id": "5c9d29fbcd7049d394076e1f",
 *              "name": "Quixada",
 *              "latitude": -4.9167557,
 *              "longitude": -39.2055092,
 *              "description":[
 *                  "sertão central", "interior"
 *              ]
 *          },
 *          {
 *              "_id": "5c9d2a11388216d53cf18f52",
 *              "name": "Horizonte",
 *              "latitude": -4.0932347,
 *              "longitude": -38.5068565,
 *              "description":[
 *                  "região metropolitana", "interior"
 *              ]
 *          },
 *          {
 *              "_id": "5c9d2a1a8cc12816f5c6f2f6",
 *              "name": "Fortaleza",
 *              "latitude": -3.7900979,
 *              "longitude": -38.5891584,
 *              "description":[
 *                  "capital"
 *              ]
 *          },        
 *          {
 *              "_id": "5c9d2a251e6a406082e12074",
 *              "name": "Pacajus",
 *              "latitude": -4.1779033,
 *              "longitude": -38.4810193,
 *              "description":[
 *                  "região metropolitana", "interior"
 *              ]
 *          },
 *          {
 *              "_id": "5c9d2a5f9cb0f3638e05bce5",
 *              "name": "Quixeramobim",
 *              "latitude": -5.1975061,
 *              "longitude": -39.2997464,
 *              "description":[
 *                  "sertão central", "interior"
 *              ]
 *          },
 *          {
 *              "_id": "5c9d2a6b82edf5088c6e9205",
 *              "name": "Cedro",
 *              "latitude": -6.5783991,
 *              "longitude": -39.1787392,
 *              "description":[
 *                  "sertão central", "interior"
 *              ]
 *          }
 *       ]
 *     }
 *
 * @apiError Internal Server Error
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 500 Internal Error
 *     {
 *       "error": "Internal Error"
 *     }
 */


 /**
 * @api {get} /findNearest/:code/:nResults Get nearests clients
 * @apiVersion 0.1.0
 * @apiName FindNearest
 * @apiGroup Client
 *
 * @apiParam {String} code     Client unique ID.
 * @apiParam {Number} nResults Number of clients to be returned.
 *
 * @apiSuccess {Client[]}   clients                 List of clients.
 * @apiSuccess {String}     clients.name            Client Name.
 * @apiSuccess {String[]}   clients.description     Client Attributes.
 * @apiSuccess {String}     clients._id             Client Id.
 * @apiSuccess {Number}     clients.latitude        Client Latitude.
 * @apiSuccess {Number}     clients.longitude       Client Longitude.
 * 
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *        [
 *          {
 *              "_id": "5c9d2a1a8cc12816f5c6f2f6",
 *              "name": "Fortaleza",
 *              "latitude": -3.7900979,
 *              "longitude": -38.5891584,
 *              "description":[
 *                  "capital"
 *              ]
 *          },        
 *          {
 *              "_id": "5c9d2a251e6a406082e12074",
 *              "name": "Pacajus",
 *              "latitude": -4.1779033,
 *              "longitude": -38.4810193,
 *              "description":[
 *                  "região metropolitana", "interior"
 *              ]
 *          }
 *       ]
 *     }
 * 
 * @apiError ClientNotFound The id of the Client was not found.
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 404 Not Found
 *     {
 *       "error": "ClientNotFound"
 *     }
 * 
 * @apiError InvalidParams The code or nResults are invalid.
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 400 Bad Request
 *     {
 *       "error": "Bad Request"
 *     }
 */


 /**
 * @api {get} /findNearest/:code/:nResults/:attr Get nearests clients with attribute
 * @apiVersion 0.1.0
 * @apiName FindNearestWithAttribute
 * @apiGroup Client
 *
 * @apiParam {String} code     Client unique ID.
 * @apiParam {Number} nResults Number of clients to be returned.
 * @apiParam {String} attr     Attribute name.
 *
 * @apiSuccess {Client[]}   clients                 List of clients.
 * @apiSuccess {String}     clients.name            Client Name.
 * @apiSuccess {String[]}   clients.description     Client Attributes.
 * @apiSuccess {String}     clients._id             Client Id.
 * @apiSuccess {Number}     clients.latitude        Client Latitude.
 * @apiSuccess {Number}     clients.longitude       Client Longitude.
 * 
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *        [
 *           {
 *              "_id": "5c9d29fbcd7049d394076e1f",
 *              "name": "Quixada",
 *              "latitude": -4.9167557,
 *              "longitude": -39.2055092,
 *              "description":[
 *                  "sertão central", "interior"
 *              ]
 *          },  
 *          {
 *              "_id": "5c9d2a251e6a406082e12074",
 *              "name": "Pacajus",
 *              "latitude": -4.1779033,
 *              "longitude": -38.4810193,
 *              "description":[
 *                  "região metropolitana", "interior"
 *              ]
 *          },
 *          {
 *              "_id": "5c9d2a5f9cb0f3638e05bce5",
 *              "name": "Quixeramobim",
 *              "latitude": -5.1975061,
 *              "longitude": -39.2997464,
 *              "description":[
 *                  "sertão central", "interior"
 *              ]
 *          },
 *          {
 *              "_id": "5c9d2a6b82edf5088c6e9205",
 *              "name": "Cedro",
 *              "latitude": -6.5783991,
 *              "longitude": -39.1787392,
 *              "description":[
 *                  "sertão central", "interior"
 *              ]
 *          }
 *       ]
 *     }
 * 
 * @apiError ClientNotFound The id of the Client was not found.
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 404 Not Found
 *     {
 *       "error": "ClientNotFound"
 *     }
 * 
 * @apiError InvalidParams The code or nResults are invalid.
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 400 Bad Request
 *     {
 *       "error": "Bad Request"
 *     }
 */
define({ "api": [
  {
    "type": "get",
    "url": "/attributes",
    "title": "Request Attributes",
    "name": "GetAttributes",
    "group": "Attribute",
    "version": "0.1.0",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Attribute[]",
            "optional": false,
            "field": "attributes",
            "description": "<p>List of attributes.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "attributes.name",
            "description": "<p>Attribute Name.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n  [\n     {\n         \"name\": \"região metropolinata\",\n     },\n     {\n         \"name\": \"capital\",\n     },\n     {\n         \"name\": \"sertão central\",\n     },\n     {\n         \"name\": \"interior\",\n     }\n  ]\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "Internal",
            "description": "<p>Server Error</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 500 Internal Error\n{\n  \"error\": \"Internal Error\"\n}",
          "type": "json"
        }
      ]
    },
    "filename": "app/controllers/api_description.js",
    "groupTitle": "Attribute"
  },
  {
    "type": "get",
    "url": "/findNearest/:code/:nResults",
    "title": "Get nearests clients",
    "version": "0.1.0",
    "name": "FindNearest",
    "group": "Client",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "code",
            "description": "<p>Client unique ID.</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "nResults",
            "description": "<p>Number of clients to be returned.</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Client[]",
            "optional": false,
            "field": "clients",
            "description": "<p>List of clients.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "clients.name",
            "description": "<p>Client Name.</p>"
          },
          {
            "group": "Success 200",
            "type": "String[]",
            "optional": false,
            "field": "clients.description",
            "description": "<p>Client Attributes.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "clients._id",
            "description": "<p>Client Id.</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "clients.latitude",
            "description": "<p>Client Latitude.</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "clients.longitude",
            "description": "<p>Client Longitude.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n   [\n     {\n         \"_id\": \"5c9d2a1a8cc12816f5c6f2f6\",\n         \"name\": \"Fortaleza\",\n         \"latitude\": -3.7900979,\n         \"longitude\": -38.5891584,\n         \"description\":[\n             \"capital\"\n         ]\n     },        \n     {\n         \"_id\": \"5c9d2a251e6a406082e12074\",\n         \"name\": \"Pacajus\",\n         \"latitude\": -4.1779033,\n         \"longitude\": -38.4810193,\n         \"description\":[\n             \"região metropolitana\", \"interior\"\n         ]\n     }\n  ]\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "ClientNotFound",
            "description": "<p>The id of the Client was not found.</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "InvalidParams",
            "description": "<p>The code or nResults are invalid.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 404 Not Found\n{\n  \"error\": \"ClientNotFound\"\n}",
          "type": "json"
        },
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 400 Bad Request\n{\n  \"error\": \"Bad Request\"\n}",
          "type": "json"
        }
      ]
    },
    "filename": "app/controllers/api_description.js",
    "groupTitle": "Client"
  },
  {
    "type": "get",
    "url": "/findNearest/:code/:nResults/:attr",
    "title": "Get nearests clients with attribute",
    "version": "0.1.0",
    "name": "FindNearestWithAttribute",
    "group": "Client",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "code",
            "description": "<p>Client unique ID.</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "nResults",
            "description": "<p>Number of clients to be returned.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "attr",
            "description": "<p>Attribute name.</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Client[]",
            "optional": false,
            "field": "clients",
            "description": "<p>List of clients.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "clients.name",
            "description": "<p>Client Name.</p>"
          },
          {
            "group": "Success 200",
            "type": "String[]",
            "optional": false,
            "field": "clients.description",
            "description": "<p>Client Attributes.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "clients._id",
            "description": "<p>Client Id.</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "clients.latitude",
            "description": "<p>Client Latitude.</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "clients.longitude",
            "description": "<p>Client Longitude.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n   [\n      {\n         \"_id\": \"5c9d29fbcd7049d394076e1f\",\n         \"name\": \"Quixada\",\n         \"latitude\": -4.9167557,\n         \"longitude\": -39.2055092,\n         \"description\":[\n             \"sertão central\", \"interior\"\n         ]\n     },  \n     {\n         \"_id\": \"5c9d2a251e6a406082e12074\",\n         \"name\": \"Pacajus\",\n         \"latitude\": -4.1779033,\n         \"longitude\": -38.4810193,\n         \"description\":[\n             \"região metropolitana\", \"interior\"\n         ]\n     },\n     {\n         \"_id\": \"5c9d2a5f9cb0f3638e05bce5\",\n         \"name\": \"Quixeramobim\",\n         \"latitude\": -5.1975061,\n         \"longitude\": -39.2997464,\n         \"description\":[\n             \"sertão central\", \"interior\"\n         ]\n     },\n     {\n         \"_id\": \"5c9d2a6b82edf5088c6e9205\",\n         \"name\": \"Cedro\",\n         \"latitude\": -6.5783991,\n         \"longitude\": -39.1787392,\n         \"description\":[\n             \"sertão central\", \"interior\"\n         ]\n     }\n  ]\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "ClientNotFound",
            "description": "<p>The id of the Client was not found.</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "InvalidParams",
            "description": "<p>The code or nResults are invalid.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 404 Not Found\n{\n  \"error\": \"ClientNotFound\"\n}",
          "type": "json"
        },
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 400 Bad Request\n{\n  \"error\": \"Bad Request\"\n}",
          "type": "json"
        }
      ]
    },
    "filename": "app/controllers/api_description.js",
    "groupTitle": "Client"
  },
  {
    "type": "get",
    "url": "/clients",
    "title": "Request Clients",
    "name": "GetClients",
    "group": "Client",
    "version": "0.1.0",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Client[]",
            "optional": false,
            "field": "clients",
            "description": "<p>List of clients.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "clients.name",
            "description": "<p>Client Name.</p>"
          },
          {
            "group": "Success 200",
            "type": "String[]",
            "optional": false,
            "field": "clients.description",
            "description": "<p>Client Attributes.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "clients._id",
            "description": "<p>Client Id.</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "clients.latitude",
            "description": "<p>Client Latitude.</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "clients.longitude",
            "description": "<p>Client Longitude.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n   [\n      {\n         \"_id\": \"5c9d29fbcd7049d394076e1f\",\n         \"name\": \"Quixada\",\n         \"latitude\": -4.9167557,\n         \"longitude\": -39.2055092,\n         \"description\":[\n             \"sertão central\", \"interior\"\n         ]\n     },\n     {\n         \"_id\": \"5c9d2a11388216d53cf18f52\",\n         \"name\": \"Horizonte\",\n         \"latitude\": -4.0932347,\n         \"longitude\": -38.5068565,\n         \"description\":[\n             \"região metropolitana\", \"interior\"\n         ]\n     },\n     {\n         \"_id\": \"5c9d2a1a8cc12816f5c6f2f6\",\n         \"name\": \"Fortaleza\",\n         \"latitude\": -3.7900979,\n         \"longitude\": -38.5891584,\n         \"description\":[\n             \"capital\"\n         ]\n     },        \n     {\n         \"_id\": \"5c9d2a251e6a406082e12074\",\n         \"name\": \"Pacajus\",\n         \"latitude\": -4.1779033,\n         \"longitude\": -38.4810193,\n         \"description\":[\n             \"região metropolitana\", \"interior\"\n         ]\n     },\n     {\n         \"_id\": \"5c9d2a5f9cb0f3638e05bce5\",\n         \"name\": \"Quixeramobim\",\n         \"latitude\": -5.1975061,\n         \"longitude\": -39.2997464,\n         \"description\":[\n             \"sertão central\", \"interior\"\n         ]\n     },\n     {\n         \"_id\": \"5c9d2a6b82edf5088c6e9205\",\n         \"name\": \"Cedro\",\n         \"latitude\": -6.5783991,\n         \"longitude\": -39.1787392,\n         \"description\":[\n             \"sertão central\", \"interior\"\n         ]\n     }\n  ]\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "Internal",
            "description": "<p>Server Error</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 500 Internal Error\n{\n  \"error\": \"Internal Error\"\n}",
          "type": "json"
        }
      ]
    },
    "filename": "app/controllers/api_description.js",
    "groupTitle": "Client"
  }
] });

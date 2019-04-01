// kNearests.cc using N-API
#include <node.h>
#include <iostream>
#include <vector>
#include <cstdlib>
#include <ctime>
#include <math.h>
#include <algorithm>

namespace demo {

using v8::Exception;
using v8::FunctionCallbackInfo;
using v8::Isolate;
using v8::Local;
using v8::Number;
using v8::Object;
using v8::String;
using v8::Value;
using v8::Array;

std::vector<std::pair<int, double>> distances;

class Client { 
    public: 
        double latitude;
        double longitude;
}; 

// Calcula a mediana de um vetor de tamanho 5 em O(1)
double findMedian(std::vector<double>& vec){
    double median;
    std::sort(vec.begin(), vec.end());
    size_t size = vec.size();
    median = vec[(size/2)];
    return median;
}

// Encontra a mediana do vetor distances em O(N)
double findMedianOfMedians(int begin, int end){
    int n = (end - begin) + 1;
    std::vector<double> medians;

    int count = 0;
    while (count < n) {    
        int countRow = 0;
        std::vector<double> row;

        while ((countRow < 5) && (count < n)) {
            row.push_back(distances[begin+count].second);
            count++;
            countRow++;
        }

        int m = findMedian(row);
        medians.push_back(m);
    }

    return findMedian(medians);
}

// Calcula a distância em km entre duas coordenadas
// Fonte: https://stackoverflow.com/a/27943
double getDistanceFromLatLonInKm(double lat1, double lon1, double lat2, double lon2) {
    double R = 6371; // Raio da terra em km
    double dLat = (lat2-lat1) * (M_PI/180);
    double dLon = (lon2-lon1) * (M_PI/180); 
    double a = sin(dLat/2) * sin(dLat/2) +
      cos(lat1 * (M_PI/180)) * cos(lat2 * (M_PI/180)) * 
      sin(dLon/2) * sin(dLon/2); 
    double c = 2 * atan2(sqrt(a), sqrt(1-a)); 
    double d = R * c;
    return d;
}

// Recebe como entrada um cliente client e uma lista de clientes listOfClients
// Calcula a distância de client para cada cliente de listOfClients
// Atualiza a lista de distâncias  
void calculateDistances(Client& client, std::vector<Client>& listOfClients){
    distances.clear();

    for (unsigned int i = 0; i < listOfClients.size(); i++){
        distances.push_back(std::make_pair(i, getDistanceFromLatLonInKm(client.latitude, client.longitude, 
                listOfClients[i].latitude, listOfClients[i].longitude)));
    }
}

// Recebe um double m, o início da lista (begin) e o fim da lista (end)
// Modifica a lista de forma semelhante ao particionamento do quicksort, os valores menores ou iguais a m são colocados a esquerda e os maiores a direita
// A compleixade de tempo é O(N), em que N é o número de elementos no intervalo [begin, end] da lista
// Modifica a lista e devolve a posição de m na nova lista
int partition(double m, int begin, int end){
    if (begin >= end || distances.size() == 0) {
        return -1;
    }

    int start = begin - 1;

    for (int i = begin; i <= end; i++){
        if (distances[i].second <= m){
            start ++;
            std::swap(distances[start], distances[i]);
        }
    }

    return start;
}

// Recebe uma lista de distâncias, um inteiro k, um inteiro begin (que indica em que índice começa a lista) e um inteiro end (que indica onde termina a lista)
// Devolve as k menores distâncias da lista
// A complexidade é de O(N), em que N é o número de elementos no intervalo [begin, end] da lista
// A complexidade de memória é O(N)
void kNearestsRecursive(int k, int begin, int end){
    int n = (end - begin) + 1;

    if(k == 0 || n == 0){
        return;
    }

    if (n <= k || k == 0){
        return;
    } else{

        double m = findMedianOfMedians(begin, end); // Calcula a mediana do vetor

        int p = partition(m, begin, end); // Particiona e devolve a posição de m no vetor
        
        int smallersEqThanPivot = (p - begin + 1); 

        if(smallersEqThanPivot == k){
            return;
        }else if(smallersEqThanPivot > k){
            kNearestsRecursive(k, begin, p - 1); 
        } else {
            kNearestsRecursive(k - smallersEqThanPivot, p + 1, end);
        }
    }
}


// Transforma um objeto Client JavaScript em Client C++
Client unpackClient(Isolate * isolate, v8::Local<v8::Value> jsElement){
    Client client;
    v8::Handle<v8::Object> client_obj = v8::Handle<v8::Object>::Cast(jsElement);
    v8::Handle<v8::Value> lat_Value = client_obj->Get(String::NewFromUtf8(isolate,"latitude"));
    v8::Handle<v8::Value> lon_Value = client_obj->Get(String::NewFromUtf8(isolate,"longitude"));
    client.latitude = lat_Value->NumberValue();
    client.longitude = lon_Value->NumberValue();

    return client;
}

// Transforma um vetor [Client] de JavaScript em um vector<Client> em C++
void unpackClients(Isolate * isolate, const v8::FunctionCallbackInfo<v8::Value>& args, std::vector<Client>& clients) {
    clients.clear();

    v8::Local<v8::Array> jsArr = v8::Local<v8::Array>::Cast(args[1]);
    for (unsigned int i = 0; i < jsArr->Length(); i++) {
        v8::Local<v8::Value> jsElement = jsArr->Get(i);
        clients.push_back(unpackClient(isolate, jsElement));
    }
}

// Recebe um cliente C, umas lista L de clientes e um inteiro k
// Devolve os k clientes de L mais próximos de C
// Utiliza as funções kNearestsRecursive e calculateDistances
void kNearests(const FunctionCallbackInfo<Value>& args) {
    Isolate* isolate = args.GetIsolate();

    if (args.Length() < 3) {
        args.GetReturnValue().Set(v8::Array::New(isolate, 0));
        return;
    }

    if (!args[0]->IsObject() || !args[1]->IsArray() || !args[2]->IsNumber()) {
        args.GetReturnValue().Set(v8::Array::New(isolate, 0));
        return;
    }

    int k = args[2].As<Number>()->Value();

    v8::Local<v8::Value> jsElement = args[0];
    Client client = unpackClient(isolate, jsElement);

    std::vector<Client> clients;
    unpackClients(isolate, args, clients);

    calculateDistances(client, clients);

    int size = distances.size();

    kNearestsRecursive(k, 0, size - 1);

    k = k < size ? k : size;

    v8::Local<v8::Array> jsArrReturn = v8::Array::New(isolate, k);
    
    for (int i = 0; i < k; i++){
        v8::Local<v8::Value> jsElem = v8::Number::New(isolate, distances[i].first);
        jsArrReturn->Set(i, jsElem);
    }

    args.GetReturnValue().Set(jsArrReturn);
}

void Init(Local<Object> exports) {
    std::srand(time(NULL));
    NODE_SET_METHOD(exports, "kNearests", kNearests);
}

NODE_MODULE(NODE_GYP_MODULE_NAME, Init)

} 
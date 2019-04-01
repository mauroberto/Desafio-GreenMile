// hello.cc using N-API
#include <node.h>

#include <iostream>
#include <vector>
#include <cstdlib>
#include <ctime>

namespace demo {

using v8::Exception;
using v8::FunctionCallbackInfo;
using v8::Isolate;
using v8::Local;
using v8::NewStringType;
using v8::Number;
using v8::Object;
using v8::String;
using v8::Value;
using v8::Array;

std::vector<std::pair<int, double>> distances;

int getRandomNumber(int min, int max){
    int r = (std::rand() % (max - min + 1)) + min;
    return r;
}

// Recebe uma lista de distâncias, um inteiro p, o início da lista (begin) e o fim da lista (end)
// Modifica a lista de forma semelhante ao particionamento do quicksort, os valores melhores ou iguais ao da posição p são colocados a esquerda e os maiores a direita
// A compleixade de tempo é O(N), em que N é o número de elementos no intervalo [begin, end]
// Modifica a lista e devolve a posição de p na nova lista
int partition(int p, int begin, int end){
    if (begin >= end || distances.size() == 0) {
        return -1;
    }

    std::swap(distances[p], distances[end]);

    p = end;

    int start = begin - 1;

    for (int i = begin; i <= end - 1; i++){
        if (distances[i].second <= distances[p].second){
            start ++;
            std::swap(distances[start], distances[i]);
        }
    }

    std::swap(distances[start + 1], distances[p]);
    p = start + 1;

    return p;
}

// Recebe uma lista de distâncias, um inteiro k, um inteiro begin (que indica em que índice começa a lista) e um inteiro end (que indica onde termina a lista)
// Devolve as k menores distâncias da lista
// A complexidade esperada é de O(N), em que N é o número de elementos no intervalo [begin, end]
// No pior caso, a complexidade é O(N^2), mas o pior caso é muito difícil de acontecer
// A complexidade de memória é O(N)
void kNearestsRecursive(int k, int begin, int end){
    int n = (end - begin) + 1;

    if(k == 0 || n == 0){
        return;
    }

    if (n <= k || k == 0){
        return;
    } else{
        int p = getRandomNumber(begin, end); // Escolhe aleatoriamente uma posição no intervalo [begin, end] para ser o pivô

        p = partition(p, begin, end); // Atualiza o pivô para a posição correta
        
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

// Recebe uma lista de distâncias e um inteiro k
// Devolve as k menores distâncias da lista
// Utiliza a função kNearestsRecursive para modificar a lista e devolve apenas os primeiros k elementos da lista modificada
void kNearests(const FunctionCallbackInfo<Value>& args) {
    distances.clear();
    Isolate* isolate = args.GetIsolate();

    if (args.Length() < 2) {
        args.GetReturnValue().Set(v8::Array::New(isolate, 0));
        return;
    }

    if (!args[0]->IsArray() || !args[1]->IsNumber()) {
        args.GetReturnValue().Set(v8::Array::New(isolate, 0));
        return;
    }

    int k = args[1].As<Number>()->Value();

    v8::Local<v8::Array> jsArr = v8::Local<v8::Array>::Cast(args[0]);
    for (unsigned int i = 0; i < jsArr->Length(); i++) {
        v8::Local<v8::Value> jsElement = jsArr->Get(i);
        double number = jsElement->NumberValue();
        distances.push_back(std::make_pair(i, number));
    }

    int size = distances.size();

    /*std::cout << "size = " << size;
    std::cout << " -- [";
    for (int i = 0; i < size-1; i++){
        std::cout << distances[i].first << ", ";
    }
    std::cout << distances[size-1].first << "]" << std::endl;*/

    kNearestsRecursive(k, 0, size - 1);

    k = k < size ? k : size;

    v8::Local<v8::Array> jsArrReturn = v8::Array::New(isolate, k);
    
    for (int i = 0; i < k; i++){
        v8::Local<v8::Number> jsElement = v8::Number::New(isolate, distances[i].first);
        jsArrReturn->Set(i, jsElement);
    }

    args.GetReturnValue().Set(jsArrReturn);
}

void Init(Local<Object> exports) {
    std::srand(time(NULL));
    NODE_SET_METHOD(exports, "kNearests", kNearests);
}

NODE_MODULE(NODE_GYP_MODULE_NAME, Init)

} 
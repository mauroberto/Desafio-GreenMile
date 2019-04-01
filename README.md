# Desafio-GreenMile

[Demo](http://ec2-18-231-176-67.sa-east-1.compute.amazonaws.com:3000/) usando uma base com 100mil clientes  
[Descrição da API](http://ec2-18-231-176-67.sa-east-1.compute.amazonaws.com:3000/api)

## Build Project
```
npm install
npm run build
```

## Run Project
```
npm start
```

## Run Tests
```
npm test
```

## Estratégias usadas

### Busca 1:  
Foi implementado um algoritmo que, dado um cliente `C`, uma lista com `N` clientes e um inteiro `k`, devolve os  `k` clientes da lista mais próximos de `C`. A ideia desse algoritmo é baseada no `Partition` do `QuickSort`. Escolhemos um índice `P` aleatóriamente na lista para ser o pivô e particionamos usando o elemento da posição `P`. Se a nova posição de `P` é maior que `k`, chamamos o algoritmo recursivamente considerando apenas os primeiros `P-1` elementos da lista. Caso contrário, chamamos o algoritmo recursivamente considerando os últimos `N - P` elementos e para um `k' = k - p`. 

A complexidade desse algoritmo depende da escolha de `P`. A complexidade esperada é `O(N)`, mas no pior caso é `O(N^2)`. A probabilidade do pior caso acontecer é muito pequena. A complexidade de memória é `O(N)`.

Por ser uma parte que precisa de maior desempenho, esse algoritmo foi implementado em `C++`. O código fonte está em `app/controllers/kNearests.cc`.

### Busca 2:
A ideia na segunda busca é montar uma árvore binária e balanceada com os atributos, em que cada nó da árvore armazena uma referência para os clientes que possuem tal atributo. Essa ideia permite consultar em `O(lg(M))`, em que `M` é o número de atributos, quais clientes possuem um determinado atributo. Para isso, criamos uma coleção no `mongodb` em que cada elemento é um atributo e armazena uma lista de ids para os clientes que possuem esse atributo. Essa coleção foi indexada pelo nome do atributo, isso faz com que o próprio mongo crie uma árvore binária de busca e realize a operação em `O(lg(N))`.

Após retornar a lista de clientes com determinado atributo, podemos aplicar o mesmo algoritmo da busca 1 para escolher os `k` mais próximos.

A complexidade esperada dessa busca é `O(lg(M) + N)`, em que `N` é o número de elementos com o atributo recebido. A complexidade de memória é `O(NM)`, que corresponde à memória usada para armazenar a coleção de atributos no banco.

A complexidade para adicionar um novo atributo a um cliente é `O(lg(M))`, pois é necessário inserí-lo na lista do atributo. Já a complexidade de remover um atributo é `O(lg(M) + N)`. 

## O que poderia ser melhor

A busca 1 poderia ser feita em paralelo. Podemos dividir a lista em partes menores e usar threads para executar o algoritmo da busca 1 em cada parte (escolhendo os `k` mais próximos de cada parte). Ao final, bastava aplicar o mesmo algoritmo na lista resultante considerando apenas o `k` elementos devolvidos de cada parte. Como o servidor que estou usando na aws possui apenas um core, essa estratégia não ajudaria :(




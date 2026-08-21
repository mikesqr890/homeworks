// ==========================================
// MÉTODOS DE ARRAYS EN JAVASCRIPT
// ==========================================

// at(): Devuelve el elemento en el índice dado. Permite usar índices negativos para contar desde el final.
const frutasAt = ['Manzana', 'Banana', 'Pera'];
console.log(frutasAt.at(-1)); // 'Pera'

// concat(): Une dos o más arrays y devuelve un nuevo array sin modificar los originales.
const numeros1 = [1, 2];
const numeros2 = [3, 4];
console.log(numeros1.concat(numeros2)); // [1, 2, 3, 4]

// constructor: Es la función que creó el objeto Array.
const miArray = [];
console.log(miArray.constructor === Array); // true

// copyWithin(): Copia una sección de un array a otra posición dentro del mismo array sin cambiar su longitud.
const arrayCopy = [1, 2, 3, 4, 5];
console.log(arrayCopy.copyWithin(0, 3, 5)); // [4, 5, 3, 4, 5]

// entries(): Devuelve un objeto iterador con pares clave/valor [índice, elemento].
const letrasEntries = ['a', 'b'];
const iteradorEntries = letrasEntries.entries();
console.log(iteradorEntries.next().value); // [0, 'a']

// every(): Comprueba si TODOS los elementos del array cumplen con la condición especificada.
const edadesEvery = [20, 30, 25];
console.log(edadesEvery.every(edad => edad >= 18)); // true

// fill(): Rellena todos o parte de los elementos de un array con un valor estático.
const cerosFill = [1, 2, 3];
console.log(cerosFill.fill(0)); // [0, 0, 0]

// filter(): Crea un nuevo array con todos los elementos que cumplan una condición.
const numerosFilter = [1, 2, 3, 4, 5];
console.log(numerosFilter.filter(num => num > 3)); // [4, 5]

// find(): Devuelve el PRIMER elemento que cumpla con la condición dada.
const personasFind = [{ id: 1 }, { id: 2 }];
console.log(personasFind.find(p => p.id === 2)); // { id: 2 }

// findIndex(): Devuelve el ÍNDICE del primer elemento que cumpla con la condición (-1 si no existe).
const nombresIndex = ['Ana', 'Carlos'];
console.log(nombresIndex.findIndex(n => n === 'Carlos')); // 1

// findLast(): Devuelve el ÚLTIMO elemento que cumpla con la condición recorriendo el array de derecha a izquierda.
const numerosLast = [5, 12, 50, 130, 44];
console.log(numerosLast.findLast(n => n > 45)); // 130

// findLastIndex(): Devuelve el ÍNDICE del último elemento que cumpla con la condición (de derecha a izquierda).
const numerosLastIndex = [5, 12, 50, 130, 44];
console.log(numerosLastIndex.findLastIndex(n => n > 45)); // 3

// flat(): Aplana sub-arrays anidados hasta la profundidad especificada.
const anidadoFlat = [1, [2, [3]]];
console.log(anidadoFlat.flat(2)); // [1, 2, 3]

// flatMap(): Mapea cada elemento usando una función y luego aplana el resultado un nivel.
const frasesFlatMap = ['hola mundo', 'adios'];
console.log(frasesFlatMap.flatMap(f => f.split(' '))); // ['hola', 'mundo', 'adios']

// forEach(): Ejecuta una función para cada elemento del array (no devuelve nada).
const frutasForEach = ['Manzana', 'Pera'];
frutasForEach.forEach(f => console.log(f));

// includes(): Determina si un array contiene un determinado elemento (devuelve true o false).
const listaIncludes = ['a', 'b', 'c'];
console.log(listaIncludes.includes('b')); // true

// indexOf(): Devuelve el primer índice donde se encuentra un elemento (-1 si no está).
const coloresIndexOf = ['rojo', 'verde', 'azul'];
console.log(coloresIndexOf.indexOf('verde')); // 1

// join(): Une todos los elementos de un array en una cadena de texto usando un separador.
const letrasJoin = ['H', 'o', 'l', 'a'];
console.log(letrasJoin.join('-')); // 'H-o-l-a'

// keys(): Devuelve un objeto iterador que contiene los índices de cada posición del array.
const listaKeys = ['a', 'b', 'c'];
const iteradorKeys = listaKeys.keys();
console.log([...iteradorKeys]); // [0, 1, 2]

// lastIndexOf(): Devuelve el último índice en el que se puede encontrar un elemento.
const repetidosLastIndex = [1, 2, 3, 2];
console.log(repetidosLastIndex.lastIndexOf(2)); // 3

// map(): Crea un nuevo array con los resultados de aplicar una función a cada uno de sus elementos.
const doblesMap = [1, 2, 3];
console.log(doblesMap.map(x => x * 2)); // [2, 4, 6]

// pop(): Elimina el ÚLTIMO elemento de un array y lo devuelve (modifica el array original).
const pilaPop = [1, 2, 3];
console.log(pilaPop.pop()); // 3

// push(): Añade uno o más elementos al FINAL del array y devuelve la nueva longitud.
const frutasPush = ['Manzana'];
frutasPush.push('Banana');
console.log(frutasPush); // ['Manzana', 'Banana']

// reduce(): Aplica una función a un acumulador y a cada elemento para reducirlo a un único valor.
const sumaReduce = [1, 2, 3, 4];
console.log(sumaReduce.reduce((acc, curr) => acc + curr, 0)); // 10

// reduceRight(): Igual que reduce(), pero recorre el array de derecha a izquierda.
const letrasReduceRight = ['a', 'b', 'c'];
console.log(letrasReduceRight.reduceRight((acc, curr) => acc + curr)); // 'cba'

// reverse(): Invierte el orden de los elementos de un array en su mismo lugar (mutativo).
const ordenReverse = [1, 2, 3];
console.log(ordenReverse.reverse()); // [3, 2, 1]

// shift(): Elimina el PRIMER elemento de un array y lo devuelve (modifica el array original).
const filaShift = [1, 2, 3];
console.log(filaShift.shift()); // 1

// slice(): Devuelve una copia superficial de una porción del array sin modificar el original.
const letrasSlice = ['a', 'b', 'c', 'd'];
console.log(letrasSlice.slice(1, 3)); // ['b', 'c']

// some(): Comprueba si AL MENOS UN elemento del array cumple con la condición dada.
const numerosSome = [1, 2, 3, 4];
console.log(numerosSome.some(n => n > 3)); // true

// sort(): Ordena los elementos de un array localmente y devuelve el array ordenado.
const nombresSort = ['Carlos', 'Ana', 'Bernardo'];
console.log(nombresSort.sort()); // ['Ana', 'Bernardo', 'Carlos']

// splice(): Cambia el contenido de un array eliminando, reemplazando o agregando elementos.
const mesesSplice = ['Enero', 'Marzo'];
mesesSplice.splice(1, 0, 'Febrero'); // Inserta en el índice 1
console.log(mesesSplice); // ['Enero', 'Febrero', 'Marzo']

// toLocaleString(): Devuelve una cadena de texto representando los elementos adaptados a la configuración regional.
const preciosLocal = [1000, 2000];
console.log(preciosLocal.toLocaleString('es-ES')); // '1.000,2.000'

// toString(): Devuelve una cadena de texto que representa el array y sus elementos separados por comas.
const letrasString = ['Hola', 'Mundo'];
console.log(letrasString.toString()); // 'Hola,Mundo'

// unshift(): Añade uno o más elementos al INICIO del array y devuelve la nueva longitud.
const listaUnshift = [2, 3];
listaUnshift.unshift(1);
console.log(listaUnshift); // [1, 2, 3]

// values(): Devuelve un objeto iterador que contiene los valores de cada índice del array.
const listaValues = ['a', 'b', 'c'];
const iteradorValues = listaValues.values();
console.log(iteradorValues.next().value); // 'a'
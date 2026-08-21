// ==========================================
// DIFERENCIAS
// ==========================================

// Regular function: Usa la palabra 'function', requiere llaves {}, 'return' explícito y crea su propio 'this'.
const newRegularFunction = function (num) {
  if (num % 2 === 0) {
    return 'even';
  } else {
    return 'odd';
  }
};

// Arrow function: Usa '=>', permite retorno implícito en una sola línea y hereda el 'this' de su entorno.
const arrowFunction = (num) => (num % 2 === 0 ? 'even' : 'odd');


// ==========================================
// PRUEBA DEL CHALLENGE (Par / Impar)
// ==========================================

console.log(newRegularFunction(4)); // even
console.log(arrowFunction(7));       // odd
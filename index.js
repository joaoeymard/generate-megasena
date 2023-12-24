const loteriasCaixaAPI = {
  listaConcursos,
  listaResultados,
  ultimoConcurso,
};

const number = numeral;

const sum = (arr) => arr.reduce((a, b) => number(a).add(b).value(), 0);
const multiply = (arr) =>
  arr.reduce((a, b) => number(a).multiply(b).value(), 0);
const avg = (arr) => number(sum(arr)).divide(arr.length).value();

const sumPercent = (a, b) =>
  number(a).add(b).subtract(number(a).multiply(b).value()).value();

function calcularAtrasoDezena(dezena, concursos) {
  concursos = concursos.reverse();

  const atrasos = [];
  let ult = concursos[0].concurso;

  for (const concurso of concursos) {
    if (concurso.dezenas.includes(dezena)) {
      atrasos.push(ult - concurso.concurso);
      ult = concurso.concurso;
    }
  }

  return {
    atrasos,
    media: avg(atrasos) || 0,
    atual: atrasos[0] || 0,
  };
}

function gerarMapaPossibilidades(concursos) {
  let resultados = [];

  for (let i = 1; i <= 60; i++) {
    const dezena = i.toString().padStart(2, "0");
    const { atual } = calcularAtrasoDezena(dezena, [...concursos]);

    resultados = resultados.concat([...Array(atual || 1)].map((e) => dezena));
  }

  return resultados;
}

function selecionarDezenaAleatoria(desconsiderar, possibilidades) {
  possibilidades = possibilidades.filter((e) => !desconsiderar.includes(e));
  return possibilidades[Math.floor(Math.random() * possibilidades.length)];
}

function gerarConcursoAleatorio(possibilidades) {
  const dezenas = [];
  for (let i = 0; i < 6; i++) {
    dezenas.push(selecionarDezenaAleatoria(dezenas, possibilidades));
  }

  return dezenas;
}

function txaDezenasRepetidasUltimoConcurso(concurso, ultimoConcurso) {
  const { dezenas } = ultimoConcurso;
  const qtDezenasIguais = concurso.filter((e) => dezenas.includes(e)).length;

  return {
    0: 0.52,
    1: 0.39,
    2: 0.0817,
    3: 0.0075,
    4: 0.0004,
    5: 0.0004,
    6: 0.00001,
  }[qtDezenasIguais];
}

function txaSomatoriaDezenas(concurso) {
  const soma = sum(concurso);

  if (soma < 63) {
    return 0.00001;
  } else if (soma < 104) {
    return 0.0214;
  } else if (soma < 145) {
    return 0.1544;
  } else if (soma < 186) {
    return 0.3473;
  } else if (soma < 227) {
    return 0.3323;
  } else if (soma < 268) {
    return 0.1285;
  } else if (soma < 309) {
    return 0.0154;
  } else if (soma < 350) {
    return 0.0007;
  } else {
    return 0.00001;
  }
}

function txaMediaDezenas(concurso) {
  const media = avg(concurso);

  if (media < 11) {
    return 0.00001;
  } else if (media < 19) {
    return 0.043;
  } else if (media < 27) {
    return 0.248;
  } else if (media < 35) {
    return 0.461;
  } else if (media < 43) {
    return 0.221;
  } else if (media < 56) {
    return 0.027;
  } else {
    return 0.00001;
  }
}

function txaParesImpares(concurso) {
  const pares = concurso.filter((e) => e % 2 === 0).length;
  const impares = concurso.filter((e) => e % 2 === 1).length;

  if (pares === 0 && impares === 6) {
    return 0.0112;
  } else if (pares === 1 && impares === 5) {
    return 0.0888;
  } else if (pares === 2 && impares === 4) {
    return 0.2428;
  } else if (pares === 3 && impares === 3) {
    return 0.3057;
  } else if (pares === 4 && impares === 2) {
    return 0.2435;
  } else if (pares === 5 && impares === 1) {
    return 0.0963;
  } else if (pares === 6 && impares === 0) {
    return 0.0116;
  } else {
    return 0.00001;
  }
}

function txaGeral(taxas) {
  return taxas.reduce((a, b) => sumPercent(a, b));
}

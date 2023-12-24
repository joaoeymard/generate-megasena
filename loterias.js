const api = axios.create({
  baseURL: "https://loteriascaixa-api.herokuapp.com/api",
  timeout: 1000 * 30, // 30 seconds
});

const resultados = {};

/**
 * Retorna um array com os resultados dos concursos
 * @param {string} concurso
 * @returns {Promise<Array>}
 */
const buscarResultadosOnline = async (concurso) => {
  try {
    const { data } = await api.get(`/${concurso}`);

    return (resultados[concurso] = data
      .map((c) => ({
        concurso: c.concurso,
        data: c.data,
        dezenas: c.dezenas,
      }))
      .reverse());
  } catch (error) {
    console.log(error);
    return [];
  }
};

const listaConcursos = async function () {
  return (await api.get("/")).data;
};

const listaResultados = async function (concurso = "megasena") {
  try {
    if (resultados[concurso]) return resultados[concurso];

    return await buscarResultadosOnline(concurso);
  } catch (error) {
    console.log("ERR listaResultados:", error);
  }
};

const ultimoConcurso = async function (concurso = "megasena") {
  try {
    const { data } = await api.get(`/${concurso}/latest`);

    return {
      concurso: data.concurso,
      data: data.data,
      dezenas: data.dezenas,
    };
  } catch (error) {
    console.log("ERR listaResultados:", error);
  }
};

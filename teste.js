const  axios =require ('axios');

async function fetchHeaders() {
  try {
    // Fazendo uma requisição GET para o URL fornecido
    const response = await axios.get('https://opmenexo.bionexo.com/Login.do        ');

    // A resposta contém os headers em response.headers
    console.log(response.headers)
    console.log('Headers da resposta:', response.request._redirectable._currentUrl);
  } catch (error) {
    console.error('Erro na requisição:', error);
  }
}

fetchHeaders();
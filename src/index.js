import express from 'express';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import { OpenAI } from 'openai';
import { Agent } from './agents.js'; // Assumindo que a classe Agent está sendo exportada deste arquivo

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;
app.use(bodyParser.json());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// Criação dos agentes
const pesquisador = new Agent();
const desenvolvedor = new Agent();
const analista = new Agent();
const supervisor = new Agent();
const diretor = new Agent();

// Setup das interações (como definido anteriormente)
// ...

// Endpoint para iniciar a pesquisa
app.post('/iniciar-pesquisa', async (req, res) => {
  const { tema, area, numeroDeCaracteres } = req.body;

  if (!tema || !area || !numeroDeCaracteres) {
    return res.status(400).send({ error: 'Dados insuficientes fornecidos.' });
  }

  try {
    const completion = await openai.createCompletion({
      model: "text-davinci-002",
      prompt: `Pesquise informações detalhadas sobre ${tema} na área de ${area}.`,
      max_tokens: numeroDeCaracteres
    });

    pesquisador.emit('pesquisa', completion.data.choices[0].text);
    res.status(200).send({ message: "Pesquisa iniciada com sucesso!" });
  } catch (error) {
    console.error('Erro na API da OpenAI:', error);
    res.status(500).send({ error: 'Erro ao processar a pesquisa' });
  }
});

// Inicia o servidor
app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});

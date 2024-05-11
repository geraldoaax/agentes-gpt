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
const pesquisador = new Agent('Pesquisador');
const desenvolvedor = new Agent('Desenvolvedor');
const analista = new Agent('Analista');
const supervisor = new Agent('Supervisor');
const diretor = new Agent('Diretor');

// Setup das interações (como definido anteriormente)
pesquisador.on('taskCompleted', (input, history) => {
  desenvolvedor.performTask(input, history);
});

desenvolvedor.on('taskCompleted', (input, history) => {
  analista.performTask(input, history);
});

analista.on('taskCompleted', (input, history) => {
  supervisor.performTask(input, history);
});

supervisor.on('taskCompleted', (input, history) => {
  diretor.performTask(input, history);
});

diretor.on('taskCompleted', (input, history) => {
  // Aqui todos os processos foram completados e podemos retornar o resultado
  app.get('/result', (req, res) => {
      res.json({ history });
  });
});
// ...

// Endpoint para iniciar a pesquisa
app.post('/iniciar-pesquisa', async (req, res) => {
  const { tema, area, numeroDeCaracteres } = req.body;

  if (!tema || !area || !numeroDeCaracteres) {
    return res.status(400).send({ error: 'Dados insuficientes fornecidos.' });
  }

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "You are a helpful assistant." },
        { role: "user", content: `Pesquise informações detalhadas sobre ${tema} na área de ${area}.` }
      ],
      max_tokens: numeroDeCaracteres
    });

    const pesquisaContent = completion.choices[0].message.content;
    console.log(`Resultado da pesquisa: ${pesquisaContent}`);
    
    pesquisador.performTask(pesquisaContent, []);
    
    res.status(200).send("Pesquisa iniciada com sucesso. Acesse /result para ver os resultados finais.");
  } catch (error) {
    console.error('Erro na API da OpenAI:', error);
    res.status(500).send({ error: 'Erro ao processar a pesquisa' });
  }
});

// Inicia o servidor
app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});

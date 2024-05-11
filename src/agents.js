import { EventEmitter } from 'events';

class Agent extends EventEmitter {
  constructor(name) {
      super();
      this.name = name;
  }

  performTask(input, history = []) {
      console.log(`${this.name} começou a trabalhar em: ${input}`);
      setTimeout(() => {
          const result = `${this.name} processou: ${input}`;
          history.push({ agent: this.name, result });
          this.emit('taskCompleted', input, history);
      }, 1000); // Simulando trabalho com timeout
  }
}


// Criação dos agentes
const pesquisador = new Agent();
const desenvolvedor = new Agent();
const analista = new Agent();
const supervisor = new Agent();
const diretor = new Agent();

// Implementação das interações
pesquisador.on('pesquisa', (tema) => {
    console.log(`Pesquisando sobre: ${tema}`);
    // Simula uma pesquisa
    setTimeout(() => desenvolvedor.emit('desenvolve', 'Artigo sobre ' + tema), 1000);
});

desenvolvedor.on('desenvolve', (conteudo) => {
    console.log(`Desenvolvendo conteúdo: ${conteudo}`);
    // Simula desenvolvimento de conteúdo
    setTimeout(() => analista.emit('analisa', conteudo), 1000);
});

analista.on('analisa', (conteudo) => {
    console.log(`Analisando conteúdo: ${conteudo}`);
    // Simula análise
    setTimeout(() => supervisor.emit('supervisiona', conteudo), 1000);
});

supervisor.on('supervisiona', (conteudo) => {
    console.log(`Supervisionando conteúdo: ${conteudo}`);
    // Simula supervisão
    setTimeout(() => diretor.emit('direciona', conteudo), 1000);
});

diretor.on('direciona', (conteudo) => {
    console.log(`Direcionando estratégias para o conteúdo: ${conteudo}`);
    // Aqui o ciclo pode recomeçar ou terminar
});

// Inicia o ciclo
pesquisador.emit('pesquisa', 'Marketing Digital');

export { Agent };

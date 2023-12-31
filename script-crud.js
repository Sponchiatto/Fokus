// encontrar o botão adicionar tarefa
const btnAdicionarTarefa = document.querySelector(".app__button--add-task"); //Botão Adicionar tarefa
const formAdicionarTarefa = document.querySelector(".app__form-add-task"); //Formulário de Adicionar Tarefa
const textArea = document.querySelector(".app__form-textarea"); //Area dee texto do formulário
const ulTarefas = document.querySelector(".app__section-task-list"); // Selecionando formulário de adicionar tarefa
const btnCancelar = document.querySelector(".app__form-footer__button--cancel"); // Selecione o botão de Cancelar que adicionamos ao formulário
const paragrafoDescricaoTarefa = document.querySelector(
  ".app__section-active-task-description"
); //Selecionando o elemento que vai mostrar a tarefa selecionada

const btnRemoverConcluidas = document.querySelector("#btn-remover-concluidas"); //Botão de remover as tarefas concluídas
const btnRemoverTodas = document.querySelector("#btn-remover-todas"); //Botão de remover todas as tarefas

let tarefas = JSON.parse(localStorage.getItem("tarefas")) || []; //aqui precisamos fazer o inverso do que foi feito no stringfy
let tarefaSelecionada = ""; // objeto da tarefa selecionada
let liTarefaSelecionada = ""; // elemento html  item de lista da tarefa selecionada

//Salvar tarefa no localStorage
function atualizarTarefas() {
  localStorage.setItem("tarefas", JSON.stringify(tarefas));
}

//Criar tarefa e colocar na lista
function criarElementoTarefa(tarefa) {
  // Criar elemento 'li'
  const li = document.createElement("li");
  li.classList.add("app__section-task-list-item");

  // Criar elemento 'svg'
  const svg = document.createElement("svg");
  svg.innerHTML = `
    <svg class="app_section-task-icon-status" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="12" fill="#FFF"></circle>
            <path d="M9 16.1719L19.5938 5.57812L21 6.98438L9 18.9844L3.42188 13.4062L4.82812 12L9 16.1719Z" fill="#01080E"></path>
    </svg>
    `;
  li.append(svg);

  // Criar elemento 'p'
  const paragrafo = document.createElement("p");
  paragrafo.textContent = tarefa.descricao;
  paragrafo.classList.add("app__section-task-list-item-description");
  li.append(paragrafo);

  // Criar elemento 'button' - edit
  const botao = document.createElement("button");
  botao.classList.add("app_button-edit");

  //Evento editar elemento button
  botao.onclick = () => {
    //debugger - ferramenta para debugar;
    const novaDescricao = prompt("Qual é o novo nome da Tarefa?");
    // Javascript interpreta um nulo e uma string vazia como false, se estiver preenchida é True. Isso é programação "defensiva"
    // impede que ao clicar em cancelar ou colocar uma string vazia, o visual da tarefa não se altere.
    if (novaDescricao) {
      paragrafo.textContent = novaDescricao; //Alterar descrição do paragrafo (visual)
      tarefa.descricao = novaDescricao; //Alterar a referência da tarefa camada de dados
      atualizarTarefas(); // Atualizar localStorage
    }
  };

  // Criar elemento 'img'
  const imagemBotao = document.createElement("img");
  imagemBotao.setAttribute("src", "imagens/edit.png");

  // Anexar 'img' ao 'button'
  botao.append(imagemBotao);

  li.append(svg);
  li.append(paragrafo);
  li.append(botao);

  if (tarefa.completa) {
    li.classList.add("app__section-task-list-item-complete");
    botao.setAttribute("disabled", "disabled");
  } else {
    //Método para Evidênciar as tarefas ao clicar e deselecionar
    li.onclick = () => {
      document
        .querySelectorAll(".app__section-task-list-item-active")
        .forEach((elemento) => {
          elemento.classList.remove("app__section-task-list-item-active");
        });

      // Deselecionar a tarefa que está selecionada
      if (tarefaSelecionada == tarefa) {
        paragrafoDescricaoTarefa.textContent = "";
        tarefaSelecionada = null;
        liTarefaSelecionada = null;
        return; // Early Return, para terminar de executar o código por aqui
      }

      tarefaSelecionada = tarefa;
      liTarefaSelecionada = li;
      paragrafoDescricaoTarefa.textContent = tarefa.descricao;

      li.classList.add("app__section-task-list-item-active");
    };
  }

  return li;
}

// Alternar visibilidade do formulário
btnAdicionarTarefa.addEventListener("click", () => {
  formAdicionarTarefa.classList.toggle("hidden");
});

// Adicionar tarefa
formAdicionarTarefa.addEventListener("submit", (evento) => {
  // evitar comportamento submit padrão do formulário
  evento.preventDefault();

  //cria um novo objeto de tarefa
  const tarefa = {
    descricao: textArea.value,
  };

  //adiciona nova tarefa ao array
  tarefas.push(tarefa);
  const elementoTarefa = criarElementoTarefa(tarefa);
  ulTarefas.append(elementoTarefa);

  // localStorage API só aceita String, fornecer um objeto "complexo" ocasiona um "bug", para evitar isso,
  //utiliza-se stringify que pertence a API do JSON e transforma em uma string
  atualizarTarefas();
  textArea.value = "";
  formAdicionarTarefa.classList.add("hidden");
});

// Para cada tarefa no array de tarefas
tarefas.forEach((tarefa) => {
  // Cria um elemento de tarefa usando a função criarElementoTarefa, passando a tarefa como argumento
  const elementoTarefa = criarElementoTarefa(tarefa);

  // Adiciona o elemento de tarefa criado à lista ulTarefas (provavelmente uma <ul> na sua estrutura HTML)
  ulTarefas.append(elementoTarefa);
});

// limpar o conteúdo do textarea e esconder o formulário
const limparFormulario = () => {
  textArea.value = ""; // Limpe o conteúdo do textarea
  formAdicionarTarefa.classList.add("hidden"); // Adicione a classe 'hidden' ao formulário para escondê-lo
};

// Associe a função limparFormulario ao evento de clique do botão Cancelar
btnCancelar.addEventListener("click", limparFormulario);


// Adiciona um event listener para o evento "FocoFinalizado, cuja referência encontra-se em script.js"
document.addEventListener("FocoFinalizado", () => {
  // Verifica se tarefaSelecionada e liTarefaSelecionada estão definidos e são verdadeiros
  if (tarefaSelecionada && liTarefaSelecionada) {
    // Remove a classe "app__section-task-list-item-active" do elemento liTarefaSelecionada
    liTarefaSelecionada.classList.remove("app__section-task-list-item-active");
    
    // Adiciona a classe "app__section-task-list-item-complete" ao elemento liTarefaSelecionada
    liTarefaSelecionada.classList.add("app__section-task-list-item-complete");
    
    // Desabilita o botão dentro do elemento liTarefaSelecionada
    liTarefaSelecionada
      .querySelector("button")
      .setAttribute("disabled", "disabled");
    
    // Define a propriedade completa da tarefaSelecionada como true
    tarefaSelecionada.completa = true;
    
    // Chama a função atualizarTarefas() após as operações serem realizadas
    atualizarTarefas();
  }
});

// Definição da função removerTarefas que recebe um parâmetro booleano somenteCompletas
const removerTarefas = (somenteCompletas) => {
  // Define o seletor com base no parâmetro somenteCompletas
  const seletor = somenteCompletas
    ? ".app__section-task-list-item-complete" // Se somenteCompletas for verdadeiro, seleciona elementos completos
    : ".app__section-task-list-item"; // Caso contrário, seleciona todos os elementos
  
  // Remove todos os elementos encontrados pelo seletor
  document.querySelectorAll(seletor).forEach((elemento) => {
    elemento.remove();
  });

  // Atualiza a variável tarefas com base no parâmetro somenteCompletas
  tarefas = somenteCompletas
    ? tarefas.filter((tarefa) => !tarefa.completa) // Se somenteCompletas for verdadeiro, filtra as tarefas não completas
    : []; // Caso contrário, define a lista de tarefas como vazia
  
  // Chama a função atualizarTarefas após a remoção/alteração das tarefas
  atualizarTarefas();
};

btnRemoverConcluidas.onclick = () => removerTarefas(true);
btnRemoverTodas.onclick = () => removerTarefas(false);

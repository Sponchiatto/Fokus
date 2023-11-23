// encontrar o botão adicionar tarefa
const btnAdicionarTarefa = document.querySelector(".app__button--add-task"); //Botão Adicionar tarefa
const formAdicionarTarefa = document.querySelector(".app__form-add-task"); //Formulário de Adicionar Tarefa
const textArea = document.querySelector(".app__form-textarea"); //Area dee texto do formulário
const tarefas = JSON.parse(localStorage.getItem("tarefas")) || []; //aqui precisamos fazer o inverso do que foi feito no stringfy
//Porque precisamos do objeto novamente
const ulTarefas = document.querySelector(".app__section-task-list");

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
  li.append(paragrafo);

  // Criar elemento 'button'
  const botao = document.createElement("button");

  // Criar elemento 'img'
  const imagemBotao = document.createElement("img");
  imagemBotao.setAttribute("src", "imagens/edit.png");

  // Anexar 'img' ao 'button'
  botao.append(imagemBotao);

  // Anexar 'button' ao 'li'
  li.append(botao);

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

  // localStorage API só aceita String, fornecer um objeto "complexo" ocasiona um "bug", para evitar isso,
  //utiliza-se stringify que pertence a API do JSON e transforma em uma string
  localStorage.setItem("tarefas", JSON.stringify(tarefas));
});

tarefas.forEach((tarefa) => {
  const elementoTarefa = criarElementoTarefa(tarefa);

  ulTarefas.append(elementoTarefa);
});

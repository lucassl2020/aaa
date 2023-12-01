function collectData(){
    const nomeElement = document.getElementById("nome");
    const dataNascimentoElement = document.getElementById("data-nascimento");
    
    return {
        nomeElement,
        dataNascimentoElement
    };
}

function formatDate(date){
    return date.split('-').reverse().join('/');
}

function validatePessoa(data){
    let pessoaIsValid = true;
    let errorMessage;
    const regexDate = /^\d{2}\/\d{2}\/\d{4}$/;

    if (data.nome.length === 0 || data.dataNascimento.length === 0){
        errorMessage = "Preencha todos os campos";
        pessoaIsValid = false;
    }else if (!(/^[a-zA-Z\s]+$/.test(data.nome))){
        errorMessage = "O nome deve conter apenas letras e espaços";
        pessoaIsValid = false;
    }else if (data.nome.length < 3 || 120 <  data.nome.length){
        errorMessage = "O nome deve possuir de 3 a 120 caracteres";
        pessoaIsValid = false;
    }else if(!regexDate.test(data.dataNascimento)){
        errorMessage = "A data de nascimento precisa estar no padrão dd/mm/aaaa";
        pessoaIsValid = false;
    }
    
    return {pessoaIsValid, errorMessage};
}

function savePessoa(pessoa){
    const pessoasVetor = JSON.parse(localStorage.getItem('pessoas')) || [];

    pessoa.id = pessoasVetor.length;
    pessoasVetor.push(pessoa);

    localStorage.setItem('pessoas', JSON.stringify(pessoasVetor));
}

function updatePessoa(pessoa){
    const pessoasVetor = JSON.parse(localStorage.getItem('pessoas'));

    pessoasVetor[pessoa.id] = pessoa;

    localStorage.setItem('pessoas', JSON.stringify(pessoasVetor));
}

function removePessoa(pessoa){
    const pessoasVetor = JSON.parse(localStorage.getItem('pessoas'));

    for(let i=pessoa.id; i<pessoasVetor.length-1; i++){
        pessoasVetor[i].nome = pessoasVetor[i+1].nome;
        pessoasVetor[i].dataNascimento = pessoasVetor[i+1].dataNascimento;
    }
    pessoasVetor.pop();

    localStorage.setItem('pessoas', JSON.stringify(pessoasVetor));
}

function insertPessoaInTable(pessoa){
    const table = document.getElementById("tabela-pessoas").getElementsByTagName('tbody')[0];
    const newRow = table.insertRow(table.rows.length);
    const nomeElement = newRow.insertCell(0);
    const dataNascimentoElement = newRow.insertCell(1);
    const botoesElement = newRow.insertCell(2);
    const btnEditar = document.createElement('button');
    const btnRemover = document.createElement('button');
    
    btnEditar.textContent = "Editar";
    btnEditar.addEventListener('click', () => {
        if(btnEditar.textContent === "Editar"){
            btnEditar.textContent = "Salvar";

            nomeElement.contentEditable = true;
            nomeElement.style.backgroundColor = "rgb(235, 235, 235)";

            dataNascimentoElement.contentEditable = true;
            dataNascimentoElement.style.backgroundColor = "rgb(235, 235, 235)";

            btnEditar.style.color = "white";
            btnEditar.classList.add("border-none");
            btnEditar.classList.add("border-round");
            btnEditar.classList.add("botao-verde");
        }else{          
            btnEditar.textContent = "Editar";
            btnEditar.style.color = "black";
            btnEditar.classList = [];

            nomeElement.contentEditable = false;
            nomeElement.style.backgroundColor = "white";

            dataNascimentoElement.contentEditable = false;
            dataNascimentoElement.style.backgroundColor = "white";
            
            pessoa.nome = nomeElement.textContent;
            pessoa.dataNascimento = dataNascimentoElement.textContent;
            const {pessoaIsValid, errorMessage} = validatePessoa(pessoa);

            if(pessoaIsValid){
                updatePessoa(pessoa);
            }else{
                loadTable(table);
                showModalError(errorMessage);
            }
        }
    });

    btnRemover.textContent = "Remover";
    btnRemover.addEventListener('click', () =>{
        removePessoa(pessoa);
        loadTable(table);
    });
    // btnRemover.style.backgroundColor = "rgb(239, 108, 108)";
    btnRemover.classList.add("border-none");
    btnRemover.classList.add("border-round");
    btnRemover.classList.add("botao-vermelho");

    nomeElement.textContent = pessoa.nome;
    dataNascimentoElement.textContent = pessoa.dataNascimento;
    botoesElement.append(btnEditar, btnRemover);
}

function showModalError(errorMessage){
    const modalContainer = document.getElementsByClassName("modal-container")[0];
    const errorMessageElement = document.getElementById("error-message");

    errorMessageElement.textContent = errorMessage;
    modalContainer.style.opacity = "100%";
    modalContainer.style.pointerEvents = "all";
}

function handleClickEvent(event){
    event.preventDefault();
    
    const data = collectData();
    const pessoa = {nome: data.nomeElement.value, 
                    dataNascimento: formatDate(data.dataNascimentoElement.value)};
    const {pessoaIsValid, errorMessage} = validatePessoa(pessoa);

    if (pessoaIsValid){
        savePessoa(pessoa);
        insertPessoaInTable(pessoa);
    }else{
        showModalError(errorMessage);
    }    
}

function loadTable(table=undefined){
    if(table){
        table.innerHTML = '';
    }

    const pessoas = JSON.parse(localStorage.getItem('pessoas'));

    pessoas.forEach(insertPessoaInTable);
}

const btnSubmit = document.getElementById("btn-submit");
const btnCloseModal = document.querySelector(".modal button");

btnSubmit.addEventListener('click', handleClickEvent);
btnCloseModal.addEventListener('click', function(){
    const modalContainer = document.getElementsByClassName("modal-container")[0];

    modalContainer.style.opacity = "0%";
    modalContainer.style.pointerEvents = "none";
});

loadTable();
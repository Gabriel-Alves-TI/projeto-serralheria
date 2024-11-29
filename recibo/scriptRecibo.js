// Seletores de elementos

const novoItem = document.querySelector("#novo-item");
const itemInput = document.querySelector("#input_item");
const item = document.querySelector("#lista_item");
const btnFechar = document.querySelector("btn-fechar");
const addItens = document.getElementById('itens');


// Função para incluir a data atual automaticamente

const getDataAtual = () => {
    // Obter a data atual
    const atual = new Date()

    const ano = atual.getFullYear();
    const mes = String(atual.getMonth() + 1).padStart(2, '0'); // mês de Janeiro é "0", então por isso +1
    const dia = String(atual.getDate()).padStart(2, '0'); // Dia do mês

    // Formata a data
    const dataFormatada = `${dia}-${mes}-${ano}`;

    // seleciona o elemento e altera a data
    document.getElementById('data').innerText = dataFormatada;
}

window.onload = getDataAtual;

// Função para máscara de telefone

const handlePhone = (event) => {
    let input = event.target
    input.value = phoneMask(input.value)
}
  
const phoneMask = (value) => {
    if (!value) return ""
    value = value.replace(/\D/g,'')
    value = value.replace(/(\d{2})(\d)/,"($1) $2")
    value = value.replace(/(\d)(\d{4})$/,"$1-$2")
    return value
}

const formatReais = () => {
    const inputs = document.querySelectorAll(".input_reais, .item-total, .form-descricao");

    inputs.forEach(input => {
        let valor = parseFloat(input.value);
        if (!isNaN(valor)) {
            input.value = valor.toFixed(2);
        }
    });
};

const formatarMoeda = (value) => {
    value = value.replace(/\D/g, '');
    value = (value / 100).toFixed(2) + '';
    value = value.replace(".", ",");
    value = value.replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.");
    return value;
}

const formatarInput = (event) => {
    const input = event.target;
    input.value = formatarMoeda(input.value);
}


document.getElementById('valor').addEventListener('input', formatarInput)
const inputs = document.querySelectorAll("#valor");
inputs.forEach(input => {
    input.addEventListener('input', formatarInput);
});

// Busca o CEP

async function consultaCEP(cep) {
    const response = await fetch(`https://brasilapi.com.br/api/cep/v1/${cep}`);
    if (response.ok) {
        const data = await response.json();
        return data;
    } else {
        throw new Error('CEP não encontrado!');
    }
}

// Preenche os dados com base no CEP digitado

async function preencherDados() {
    const cepInput = document.getElementById('cep');
    const cep = cepInput.value.replace(/\D/g, ''); // Remove caracteres não numéricos

    if (cep.length === 8) { // Verifica se o CEP tem 8 dígitos
        try {
            const detalhes = await consultaCEP(cep);
            
            // Preenche os campos com os dados recebidos
            document.getElementById('endereco').value = detalhes.street || '';
            document.getElementById('cidade').value = detalhes.city || '';
            document.getElementById('estado').value = detalhes.state || '';
        } catch (error) {
            alert(error.message); // Mostra um alerta caso ocorra um erro
        }
    } else if (cep.length === 0) { // Se o campo CEP estiver vazio, limpa os campos
        document.getElementById('endereco').value = '';
        document.getElementById('cidade').value = '';
        document.getElementById('estado').value = '';
    }
}

// Busca o CNPJ

async function consultaCNPJ(cnpj) {
    const response = await fetch(`https://brasilapi.com.br/api/cnpj/v1/${cnpj}`);
    if (response.ok) {
        const data = await response.json();
        return data;
    } else {
        throw new Error('CNPJ não encontrado!');
    }
}

async function preencherCNPJ() {
    const cnpjInput = document.getElementById('cnpj');
    const cnpj = cnpjInput.value.replace(/\D/g, ''); // Remove caracteres não numéricos

    if (cnpj.length === 14) { // Verifica se o CNPJ tem 14 dígitos
        try {
            const detalhes = await consultaCNPJ(cnpj);
            const clienteInput = document.getElementById('cliente');
            clienteInput.value = detalhes.razao_social || '';

            // Chama a função alterarCliente para atualizar o texto do cliente
            alterarCliente({ target: clienteInput });
        } catch (error) {
            alert(error.message); // Mostra um alerta caso ocorra um erro
        }
    } else if (cnpj.length === 0) { // Se o campo CNPJ estiver vazio, limpa o campo cliente
        document.getElementById('cliente').value = '';
        alterarCliente({ target: document.getElementById('cliente') });
    }
}

const clienteInput = document.getElementById('cliente');
const textCliente = document.getElementById('text-cliente');

const alterarCliente = (event) => {
    textCliente.innerText = event.target.value;
};

clienteInput.addEventListener('input', alterarCliente);
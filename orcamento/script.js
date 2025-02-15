// Seletores de elementos

const novoItem = document.querySelector("#novo-item");
const itemInput = document.querySelector("#input_item");
const item = document.querySelector("#lista_item");
const btnFechar = document.querySelector("btn-fechar");
const addItens = document.getElementById('itens');




document.getElementById('novo-item').addEventListener('submit', function(event) {
    event.preventDefault(); // Evita o envio do formulário

    // Obtém os valores dos campos
    const descricao = document.getElementById('input_item').value;
    const valorMaterial = document.getElementById('item-material').value.replace(/[,.]/g, '');
    const valorServicos = document.getElementById('item-servicos').value.replace(/[,.]/g, '');
    const valorTotal = parseInt(valorMaterial) + parseInt(valorServicos);

    // Formata os valores para exibição
    const valorMaterialFormatado = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valorMaterial / 100);
    const valorServicosFormatado = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valorServicos / 100);
    const valorTotalFormatado = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valorTotal / 100);

    // Obtém o número do item
    const numeroItem = document.querySelectorAll('#lista_item .create').length + 1;

    // Cria um novo elemento de item
    const itemDiv = document.createElement('div');
    itemDiv.classList.add('create');

    // Adiciona o conteúdo ao novo item
    itemDiv.innerHTML = `
        <h3><span>${numeroItem}º </span><span class="descricao">${descricao}</span></h3>
        <hr>
        <div class="total-item">
            <div class="item-material">
                <p class="valor-material"><strong>Valor Material:</strong> <span class="valor">${valorMaterialFormatado}</span></p>
            </div>
            <div class="item-servicos">
                <p class="valor-servicos"><strong>Valor Serviços:</strong> <span class="valor">${valorServicosFormatado}</span></p>
            </div>
            <div class="item-total">
                <p class="valor-total"><strong>Valor Total:</strong> ${valorTotalFormatado}</p>
            </div>
        </div>
        <button class="edit-item" id="edit-item">
            <i class="bi bi-pencil-square"></i>
        </button>
        <button class="remove-item" id="remove-item">
            <i class="bi bi-trash"></i>
        </button>
    `;

    // Adiciona o novo item à lista de itens
    document.getElementById('lista_item').appendChild(itemDiv);

    // Atualiza a numeração dos itens
    atualizarNumeracao();

    // Atualiza os totais gerais
    atualizarTotais();

    // Limpa os campos do formulário
    document.getElementById('novo-item').reset();

    // Limpa os campos de valor material e serviços
    document.getElementById('item-material').value = '';
    document.getElementById('item-servicos').value = '';
});

// Event delegation para remoção e edição de itens
document.addEventListener('click', function(event) {
    const targetEl = event.target;
    const isRemoveButton = targetEl.classList.contains('remove-item') || targetEl.closest('.remove-item');
    const isEditButton = targetEl.classList.contains('edit-item') || targetEl.closest('.edit-item');

    if (isRemoveButton) {
        const parentEl = targetEl.closest('.create');
        if (parentEl) {
            parentEl.remove();
            atualizarNumeracao();
            atualizarTotais();
        }
    }

    if (isEditButton) {
        const parentEl = targetEl.closest('.create');
        if (parentEl) {
            const descricaoEl = parentEl.querySelector('.descricao');
            const valorMaterialEl = parentEl.querySelector('.valor-material .valor');
            const valorServicosEl = parentEl.querySelector('.valor-servicos .valor');

            if (descricaoEl && valorMaterialEl && valorServicosEl) {
                descricaoEl.innerHTML = `<textarea type="text" class="edit-descricao" value="">${descricaoEl.innerText}</textarea>`;
                valorMaterialEl.innerHTML = `<input type="text" class="edit-valor-material" value="${valorMaterialEl.innerText.replace(/[^\d]/g, '')}">`;
                valorServicosEl.innerHTML = `<input type="text" class="edit-valor-servicos" value="${valorServicosEl.innerText.replace(/[^\d]/g, '')}">`;

                // Zerar os valores de material e serviços
                valorMaterialEl.innerHTML = `<input type="text" class="edit-valor-material" value="">`;
                valorServicosEl.innerHTML = `<input type="text" class="edit-valor-servicos" value="">`;


                // Adicionar evento de input para formatar os valores conforme o usuário digita
                valorMaterialEl.querySelector('.edit-valor-material').addEventListener('input', formatarInput);
                valorServicosEl.querySelector('.edit-valor-servicos').addEventListener('input', formatarInput);

                // Adicionar evento de blur para salvar as mudanças
                descricaoEl.querySelector('.edit-descricao').addEventListener('blur', function(event) {
                    descricaoEl.innerText = event.target.value;
                });

                valorMaterialEl.querySelector('.edit-valor-material').addEventListener('blur', function(event) {
                    const novoValorMaterial = parseInt(event.target.value.replace(/[^\d]/g, ''));
                    valorMaterialEl.innerText = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(novoValorMaterial / 100);

                    // Atualiza o valor total
                    const novoValorServicos = parseInt(valorServicosEl.innerText.replace(/[^\d]/g, ''));
                    const novoValorTotal = novoValorMaterial + novoValorServicos;
                    parentEl.querySelector('.valor-total').innerHTML = `<strong>Valor Total:</strong> ${new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(novoValorTotal / 100)}`;
                });

                valorServicosEl.querySelector('.edit-valor-servicos').addEventListener('blur', function(event) {
                    const novoValorServicos = parseInt(event.target.value.replace(/[^\d]/g, ''));
                    valorServicosEl.innerText = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(novoValorServicos / 100);

                    // Atualiza o valor total
                    const novoValorMaterial = parseInt(valorMaterialEl.innerText.replace(/[^\d]/g, ''));
                    const novoValorTotal = novoValorMaterial + novoValorServicos;
                    parentEl.querySelector('.valor-total').innerHTML = `<strong>Valor Total:</strong> ${new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(novoValorTotal / 100)}`;

                    atualizarTotais();
                });
            }
        }
    }
});

// Função para atualizar a numeração dos itens
function atualizarNumeracao() {
    const itens = document.querySelectorAll('#lista_item .create');
    itens.forEach((item, index) => {
        const span = item.querySelector('h3 span');
        span.textContent = `${index + 1}º `;
    });
}

// Função para atualizar os totais gerais
function atualizarTotais() {
    const itens = document.querySelectorAll('#lista_item .create');
    let totalMaterial = 0;
    let totalServicos = 0;
    let totalGeral = 0;

    itens.forEach(item => {
        const valorMaterialText = item.querySelector('.item-material p').textContent.replace(/[^0-9,]/g, '').replace(',', '.');
        const valorServicosText = item.querySelector('.item-servicos p').textContent.replace(/[^0-9,]/g, '').replace(',', '.');

        const valorMaterial = parseFloat(valorMaterialText);
        const valorServicos = parseFloat(valorServicosText);

        totalMaterial += valorMaterial;
        totalServicos += valorServicos;
        totalGeral += valorMaterial + valorServicos;
    });

    // Formata os valores para exibição
    const totalMaterialFormatado = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totalMaterial);
    const totalServicosFormatado = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totalServicos);
    const totalGeralFormatado = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totalGeral);

    // Atualiza os campos no HTML
    document.getElementById('total-material').value = totalMaterialFormatado;
    document.getElementById('total-servicos').value = totalServicosFormatado;
    document.getElementById('total').value = totalGeralFormatado;
}



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
    const inputs = document.querySelectorAll(".input_reais, .item-total");

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

// document.getElementById('item-material').addEventListener('input', formatarInput);
// document.getElementById('item-servicos').addEventListener('input', formatarInput);
// document.getElementById('edit-valor-material').addEventListener('input', formatarInput);
// document.getElementById('total').addEventListener('input', formatarInput);
const inputs = document.querySelectorAll(".material, .servicos, .itemTotal, total");
inputs.forEach(input => {
    input.addEventListener('input', formatarInput);
});

// Eventos

novoItem.addEventListener("submit", (e) => { // adiciona um novo item 
    e.preventDefault();

    const inputValue = itemInput.value; // seleciona o que o usuário digitar no input

    if(inputValue){
        //salvar item
        saveItem(inputValue);
    }
    
});




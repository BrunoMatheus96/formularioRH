//Usando o jQuery para pegar os campos da primeira parte do formulário
const $stepText = $('#step-text');
const $stepDescription = $('#step-description');
const $stepOne = $('.step.one');
const $stepTwo = $('.step.two');
const $stepThree = $('.step.three');
const $title = $('#title');

const $inputNome = $('#nome');
const $inputSobrenome = $('#sobrenome');
const $inputEmail = $('#email');
const $inputDataNascimento = $('#dataNascimento');
const $inputMinibio = $('#minibio')
const $inputEndereco = $('#endereco');
const $inputComplemento = $('#complemento');
const $inputCidade = $('#cidade');
const $inputCep = $('#cep');
const $inputHabilidades = $('#habilidades');
const $inputPontosFortes = $('#pontosFortes');

const $containerBtnFormOne = $('#containerBtnFormOne');
const $btnFormOne = $('#btnFormOne');
const $containerBtnFormTwo = $('#containerBtnFormTwo');
const $btnFormTwo = $('#btnFormTwo');
const $containerBtnFormThree = $('#containerBtnFormThree');
const $btnFormThree = $('#btnFormThree');

let nomeValido = false;
let sobrenomeValido = false;
let emailValido = false;
let minibioValido = false;
let dataNascimentoValido = false;
let enderecoValido = false;
let cidadeValida = false;
let cepValido = false;
let habilidadesValido = false;
let pontosFortesValido = false;

const minLengthText = 2;
const minLengthArea = 10;
const emailRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const cepRegex = /^([\d]{2})([\d]{3})([\d]{3})|^[\d]{2}.[\d]{3}-[\d]{3}/;

//Função para sempre validar o fomulário e abilitar os botões
function validaFormularioUm() {
    if (nomeValido && sobrenomeValido && emailValido && dataNascimentoValido) {
        $containerBtnFormOne.removeClass('disabled');
        $btnFormOne.removeClass('disabled');
        $btnFormOne.off('click').on('click', iniciarFormulario2);
    } else {
        $containerBtnFormOne.addClass('disabled');
        $btnFormOne.addClass('disabled');
        $btnFormOne.off('click');
    }
}

//Função utilizada para configurações dos campos da segunda parte
function iniciarFormulario2() {
    $stepText.text('Passo 2 de 3 - Dados de correspondência');
    $stepDescription.text('Precisamos desses dados para que possamos entrar em contato.');
    $stepTwo.show();
    $stepOne.hide();
    $inputEndereco.keyup(function () {
        enderecoValido = validaInput(this, minLengthArea)
        validaFormulario2();
    });
    $inputCidade.keyup(function () {
        cidadeValida = validaInput(this, minLengthText);
        validaFormulario2();
    });
    $inputCep.keyup(function () {
        this.value = this.value.replace(/\D/g, '');
        cepValido = validaInput(this, null, null, cepRegex);
        if (cepValido) {
            this.value = this.value.replace(cepRegex, "$1.$2-$3");
        }
        validaFormulario2();
    });
    $inputComplemento.keyup(function () {
        validaFormulario2();
    });
}

//Função para habilitar o botão da segunda parte do formulário
function validaFormulario2() {
    if (enderecoValido && cidadeValida && cepValido) {
        $containerBtnFormTwo.removeClass('disabled');
        $btnFormTwo.removeClass('disabled');
        $btnFormTwo.off('click').on('click', iniciarFormulario3);
    } else {
        $containerBtnFormTwo.addClass('disabled');
        $btnFormTwo.addClass('disabled');
        $btnFormTwo.off('click');
    }
}

function iniciarFormulario3() {
    $stepText.text('Passo 3 de 3 - Conte-nos sobre você');
    $stepDescription.text('Não economize palavras, aqui é onde você pode se destacar.');
    $stepTwo.hide();
    $stepThree.show();

    $inputHabilidades.keyup(function () {
        habilidadesValido = validaInput(this, minLengthArea);
        validaFormularioTres();
    });
    $inputPontosFortes.keyup(function () {
        pontosFortesValido = validaInput(this, minLengthArea);
        validaFormularioTres();
    });
}

function validaFormularioTres() {
    if (habilidadesValido && pontosFortesValido) {
        $containerBtnFormThree.removeClass('disabled');
        $btnFormThree.removeClass('disabled');
        $btnFormThree.off('click').on('click', salvarNoTrello);
    } else {
        $containerBtnFormThree.addClass('disabled');
        $btnFormThree.addClass('disabled');
        $btnFormThree.off('click');
    }
}

function finalizarFormulario() {
    $stepThree.hide();
    //Omitir a descrição
    $stepDescription.hide();
    //Um novo título para página de finalização
    $title.text('Muito obrigado pela sua inscrição!');
    //Uma descrição para página de finalização
    $stepText.text('Entraremos em contato assim que possível, nosso prazo médio de resposta é de 5 dias. Fique atento na sua caixa de email.');
}

//Função assincrona
async function salvarNoTrello() {
    try {
        //O .val() é um método do JavaScript que retorna o valor de um elemento de entrada. No código fornecido, o .val() é usado para obter o valor dos campos de entrada do formulário.
        const nome = $inputNome.val();
        const sobrenome = $inputSobrenome.val();
        const email = $inputEmail.val();
        const dataNascimento = $inputDataNascimento.val();
        const minibio = $inputMinibio.val();
        const endereco = $inputEndereco.val();
        const complemento = $inputComplemento.val();
        const cidade = $inputCidade.val();
        const cep = $inputCep.val();
        const habilidades = $inputHabilidades.val();
        const pontosFortes = $inputPontosFortes.val();
        //Se algum dos campos não estiver preenchido
        if (!nome || !sobrenome || !email
            || !dataNascimento || !endereco
            || !cidade || !cep
            || !habilidades || !pontosFortes) {
            return alert('Favor preencher todos os dados para seguir');
        }
        const body = {
            name: 'Candidato - ' + nome + " " + sobrenome,
            desc: `
                Seguem dados do candidato(a):
                        ------------------- Dados pessoais ------------
                        Nome: ${nome}
                        Sobrenome: ${sobrenome}
                        Email: ${email}
                        Data nascimento: ${dataNascimento}
                        ------------------- Dados de correspondência ------------
                        Endereço: ${endereco}
                        Complemento: ${complemento}
                        Cidade: ${cidade}
                        CEP: ${cep}
                        ------------------- Dados de recrutamento ------------
                        Habilidades: ${habilidades}
                        Pontos Fortes: ${pontosFortes}`
        };
        //Faz com que espere algo acontecer ara ai sim executar algo
        await fetch('https://api.trello.com/1/cards?idList=656c08781782b91cb0200251&key=be3a04bdecad0e060589e47188ea78b2&token=ATTA95af9aa05da7d660dac1f5aebf21b99d210761c874fb55642b6bc54763179ab7D6294946',
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(body)
            });
        return finalizarFormulario();
    } catch (e) {
        console.log('Ocorreu erro ao salvar no Trello:', e);
    }
}

//Essa função é responsável por esconder as outras etapas do formulário dividindo o mesmo em 3 ao invés de um só
function init() {
    //Manipulação para mudar o Texto do subtítulo do fomlário
    $stepText.text('Passo 1 de 3 - Dados pessoais');
    //Manipoulação do subtitulo do formulário
    $stepDescription.text('Descreva seus dados para que possamos te conhecer melhor.');
    //Escondendo os div
    $stepTwo.hide();
    $stepThree.hide();
}

//Função genérica para validar campos obrigatórios que foram preenchidos incorretamente ou estão vazios
function validaInput(element, minLength, maxLength, regex) {
    const closest = $(element).closest('.input-data');
    if (!element.value
        || (minLength && element.value.trim().length < minLength)
        || (maxLength && element.value.trim().length > maxLength)
        || (regex && !element.value.toLowerCase().match(regex))) {
        closest.addClass('error');
        return false;
    }
    closest.removeClass('error');
    return true;
}

//Informa que o campo "Nome" é obrigatório caso esteja vazio ou com menos de 3 caracteres
$inputNome.keyup(function () {
    nomeValido = validaInput(this, minLengthText);
    validaFormularioUm();
    /*
    //Responsável por procurar no HTML qual o .imput-data mais proxímo do nome
    const closest = $(this).closest('.input-data');
    //Inválido
    //O método trim() remove os espaços em branco (whitespaces) do início e/ou fim de um texto. É considerado espaço em branco (espaço, tabulação, espaço fixo/rígido, etc.) e todo sinal de fim de linha de texto (LF, CR, etc.).
    if (!this.value || this.value.trim().length <= 2) {
        return closest.addClass('error');
    }
    //Válido
    return closest.removeClass('error');
    */
});

//Informa que o campo "Sobrenome" é obrigatório caso esteja vazio ou com menos de 3 caracteres
$inputSobrenome.keyup(function () {
    sobrenomeValido = validaInput(this, minLengthText);
    validaFormularioUm();
    /*
    //Responsável por procurar no HTML qual o .imput-data mais proxímo do Sobrenome
    const closest = $(this).closest('.input-data');
    //Inválido
    if (!this.value || this.value.trim().length < 2) {
        return closest.addClass('error');
    }
    //Válido
    return closest.removeClass('error')*/
});

//Validação de Email
$inputEmail.keyup(function () {
    emailValido = validaInput(this, null, null, emailRegex);
    validaFormularioUm();
});

$inputMinibio.keyup(function () {
    minibioValido = validaInput(this, minLengthText);
    validaFormularioUm();
});

//Campo de "Data de nascimento"
$inputDataNascimento.keyup(function () {
    dataNascimentoValido = validaInput(this, minLengthText);
    validaFormularioUm();
});
$inputDataNascimento.change(function () {
    dataNascimentoValido = validaInput(this, minLengthText);
});
//O elemento foco nessa linha linha de código informa que o campo "Data de nascimento" ganhou foco
$inputDataNascimento.on('focus', function () {
    //Fica com mascara dd/mm/yyyy
    this.type = 'date';
});
$inputDataNascimento.on('blur', function () {
    if (!this.value) {
        this.type = 'text';
    }
});

//Execuntando a função init
init();
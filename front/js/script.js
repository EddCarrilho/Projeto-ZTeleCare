function Cadastrar(event){
    if (validateDate(event) && funfou()) {
        const nome = document.querySelector("#nome");
        const cpf = document.querySelector("#cpf").value;
        const data = document.querySelector("#data");
        const phone = document.querySelector("#phone");
        const email = document.querySelector("#email");
        const senha = document.querySelector("#senha");

        const cleanCpf = getcleancpf(cpf);
        function getcleancpf(cpf) {
            return cpf.replace(/\D/g, '');
        }

        fetch("http://127.0.0.1:4100/api/v1/users/cadastrar",{
            method:"POST",
            headers:{
                "accept":"application/json",
                "content-type":"application/json"
            },
            body:JSON.stringify({
                nome:nome.value,
                cpf:cleanCpf,
                datadenascimento:data.value,
                telefone:phone.value,
                email:email.value,
                senha:senha.value
            })
        })
        .then((res)=>res.json())
        .then((result)=>{
            console.log({result});
            //location.reload();
        })
        .catch((error)=>console.error(`Erro na api ${error}`))
        event.preventDefault()
    }
    console.log('validateDate:', validateDate(event));
    console.log('validateCpf:', validateCpf());
    console.log('funfou:', funfou());
}

function Login(){

    const email2 = document.querySelector("#email2");
    const cpf2 = document.querySelector("#cpf2").value;
    const senha2 = document.querySelector("#senha2");

    const cleanCpf2 = getcleancpf2(cpf2);
    function getcleancpf2(cpf2) {
        return cpf2.replace(/\D/g, '');
    }

    fetch("http://127.0.0.1:4100/api/v1/users/login",{
        method:"POST",
        headers:{
            "accept":"application/json",
            "content-type":"application/json"
        },
        body:JSON.stringify({
            email:email2.value,
            cpf:cleanCpf2,
            senha:senha2.value
        })
    }).then((res)=>res.json())
    .then((result)=>{
        console.log(result);
    })
    .catch((error)=>console.error(`Erro ao tenta acessar a api ${error}`));
}

const togglePassword = document.getElementById('togglePassword');
const togglePassword2 = document.getElementById('togglePassword2');
const passwordField = document.getElementById('senha');
const passwordField2 = document.getElementById('senha2');

    togglePassword.addEventListener('click', function () {
        const type = passwordField.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordField.setAttribute('type', type);

        this.innerHTML = type === 'password' 
            ? '<i class="fa-solid fa-eye"></i>' 
            : '<i class="fa-solid fa-eye-slash"></i>';
    });
    togglePassword2.addEventListener('click', function () {
        const type = passwordField2.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordField2.setAttribute('type', type);

        this.innerHTML = type === 'password' 
            ? '<i class="fa-solid fa-eye"></i>' 
            : '<i class="fa-solid fa-eye-slash"></i>';
    });

const signupButton = document.getElementById('signup');
const signinButton = document.getElementById('signin');
const form = document.getElementById('MyForm');
const form2 = document.getElementById('MyForm2');

signinButton.addEventListener('click', function () {
    const errorMessage = document.getElementById('data-error');
    const errorMessage2 = document.getElementById('cpf-error');
    errorMessage.style.display = 'none';
    errorMessage2.style.display = 'none';
    form.reset();
});

signupButton.addEventListener('click', function () {
    const errorMessage = document.getElementById('data-error');
    const errorMessage2 = document.getElementById('cpf-error');
    removeInputError('data');
    removeInputError('cpf');
    errorMessage.style.display = 'none';
    errorMessage2.style.display = 'none';
    form2.reset();
});

function applyCpfMask(event) {
    let cpf = event.target.value;
    
    cpf = cpf.replace(/\D/g, '');
    
    if (cpf.length <= 11) {
        cpf = cpf.replace(/(\d{3})(\d{1,3})/, '$1.$2');
        cpf = cpf.replace(/(\d{3})(\d{1,2})/, '$1.$2');
        cpf = cpf.replace(/(\d{3})(\d{1,2})/, '$1-$2');
    }
    
    event.target.value = cpf;
}

document.getElementById('cpf').addEventListener('input', applyCpfMask);
document.getElementById('cpf2').addEventListener('input', applyCpfMask);

function setInputError(id) {
    document.getElementById(id).classList.add('input-error');
}

function removeInputError(id) {
    document.getElementById(id).classList.remove('input-error');
}

function validateDate(event) {
    const input = document.getElementById('data');
    const errorMessage = document.getElementById('data-error');
    const dateValue = input.value;
    if (dateValue) {
        const [year, month, day] = dateValue.split('-').map(Number);
        if (isValidDate(day, month, year)) {
            removeInputError('data');
            errorMessage.style.display = 'none';
            return true;
        } else {
            setInputError('data');
            errorMessage.style.display = 'block';
            event.preventDefault()
            return false;
        }
    } else {
        return false;
    }
    
}

function isValidDate(day, month, year) {
    if (year > 2010 || year < 1900) {
        return false;
    } 

    if (isNaN(day) || isNaN(month) || isNaN(year) || month < 1 || month > 12) {
        return false;
    }
    const date = new Date(year, month - 1, day);
    return date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day;
}

function validateCpf(event) {

    const cpf = document.querySelector("#cpf").value;
    const errorMessage = document.getElementById('cpf-error');

    const cleanCpf = getcleancpf(cpf);
        function getcleancpf(cpf) {
            return cpf.replace(/\D/g, '');
        }

    fetch(`http://127.0.0.1:4100/api/v1/users/buscarporcpf/${cleanCpf}`)
        .then((res)=>res.json())
        .then((dados)=>{
            // Verifica se os dados retornados da API são válidos
            if (dados && dados.payload) {
                setInputError('cpf');
                errorMessage.style.display = 'block';
                event.preventDefault()
                naofunfou()
            } else {
                removeInputError('cpf');
                errorMessage.style.display = 'none';
                funfou()
            }
        })
        .catch((error)=> {
            console.error(`Erro na api ${error}`)
            naofunfou()
        })
}

function naofunfou() {
    console.log("So vendo")
    return false;  // Dado foi encontrado
}

function funfou() {
    console.log("So vendo2")
    return true;  // Dado não encontrado
}

function setInputError(inputId) {
    const input = document.getElementById(inputId);
    input.style.border = '2px solid red'; 
}

function removeInputError(inputId) {
    const input = document.getElementById(inputId);
    input.style.border = ''; 
}

document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('MyForm').addEventListener('submit', function(event) {
        const nameInput = document.getElementById('nome');
        const cpfInput = document.getElementById('cpf');
        const phoneInput = document.getElementById('phone');
        const emailInput = document.getElementById('email');
        const senhaInput = document.getElementById('senha');
    
        // Verifica se o campo está vazio
        if (nameInput.value.trim() === '' || cpfInput.value.trim() === '' ||phoneInput.value.trim() === '' ||emailInput.value.trim() === '' ||senhaInput.value.trim() === '') {
            event.preventDefault();
            return false;
        } else {
            errorMessage.style.display = 'none';
        }
    });
});
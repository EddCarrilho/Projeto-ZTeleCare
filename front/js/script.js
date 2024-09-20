function Cadastrar(event){
    event.preventDefault()
    const isDateValid = validateDate();

    if (!isDateValid) {
        return;  
    }

    validateCpf().then((isCpfValid) => {
        validateEmail().then((isEmailValid) => {
            validatePhone().then((isPhoneValid) => {
                if (isCpfValid && isEmailValid && isPhoneValid) {
                    const nome = document.querySelector("#nome").value;
                    const cpf = document.querySelector("#cpf").value;
                    const data = document.querySelector("#data").value;
                    const phone = document.querySelector("#phone").value;
                    const countryCode = document.getElementById("country-code").value;
                    const email = document.querySelector("#email").value;
                    const senha = document.querySelector("#senha").value;
                    
                    const fullNumber = countryCode + phone;

                    const cleanCpf = getcleancpf(cpf);
                    function getcleancpf(cpf) {
                        return cpf.replace(/\D/g, ''); 
                    }
        
                    fetch("http://127.0.0.1:4100/api/v1/users/cadastrar", {
                        method: "POST",
                        headers: {
                            "accept": "application/json",
                            "content-type": "application/json"
                        },
                        body: JSON.stringify({
                            nome: nome,
                            cpf: cleanCpf,
                            datadenascimento: data,
                            telefone: fullNumber,
                            email: email,
                            senha: senha
                        })
                    })
                    .then((res) => res.json())
                    .then((result) => {
                        console.log({ result });
                        location.reload(); 
                    })
                    .catch((error) => console.error(`Erro na API: ${error}`));
                }
            });
        });
    });
}

function Login(event){
    event.preventDefault();
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
        console.log({result})
        console.log("logado");
        event.preventDefault();
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
    const errorMessage3 = document.getElementById('email-error');
    const errorMessage4 = document.getElementById('phone-error');
    removeInputError('data');
    removeInputError('cpf');
    removeInputError('email');
    removeInputError('phone');
    errorMessage.style.display = 'none';
    errorMessage2.style.display = 'none';
    errorMessage3.style.display = 'none';
    errorMessage4.style.display = 'none';
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

function validateDate() {
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

function validateCpf() {

    const cpf = document.querySelector("#cpf").value;
    const errorMessage = document.getElementById('cpf-error');

    const cleanCpf = getcleancpf(cpf);
        function getcleancpf(cpf) {
            return cpf.replace(/\D/g, '');
        }

    return fetch(`http://127.0.0.1:4100/api/v1/users/buscarporcpf/${cleanCpf}`)
        .then((res)=>res.json())
        .then((dados)=>{
            if (dados.payload && dados.payload.length > 0 || cpf.length < 14) {
                setInputError('cpf');
                errorMessage.style.display = 'block';
                return false;
            } else {
                removeInputError('cpf');
                errorMessage.style.display = 'none';
                return true;
            }
        })
        .catch((error)=> {
            console.error(`Erro na api ${error}`)
            return false;
        })
}

function validatePhone() {
    const phone = document.querySelector("#phone").value;
    const countryCode = document.getElementById("country-code").value;
    const errorMessage = document.getElementById('phone-error');
    const fullNumber = countryCode + phone;

    return fetch(`http://127.0.0.1:4100/api/v1/users/buscarportelefone/${fullNumber}`)
        .then((res)=>res.json())
        .then((dados)=>{
            if (dados.payload && dados.payload.length > 0 && phone >= 10) {
                setInputError('phone');
                errorMessage.style.display = 'block';
                return false;
            } else {
                removeInputError('phone');
                errorMessage.style.display = 'none';
                return true;
            }
        })
        .catch((error)=> {
            console.error(`Erro na api ${error}`)
            return false;
        })
}

function validateEmail() {

    const email = document.querySelector("#email").value;
    const errorMessage = document.getElementById('email-error');

    return fetch(`http://127.0.0.1:4100/api/v1/users/buscarporemail/${email}`)
        .then((res)=>res.json())
        .then((dados)=>{
            if (dados.payload && dados.payload.length > 0) {
                setInputError('email');
                errorMessage.style.display = 'block';
                return false;
            } else {
                removeInputError('email');
                errorMessage.style.display = 'none';
                return true;
            }
        })
        .catch((error)=> {
            console.error(`Erro na api ${error}`)
            return false;
        })
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
            Cadastrar(event);
        }
    });
});

document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('MyForm2').addEventListener('submit', function(event) {
        const emailInput = document.getElementById('email2');
        const cpfInput = document.getElementById('cpf2');
        const senhaInput = document.getElementById('senha2');
    
        // Verifica se o campo está vazio
        if (emailInput.value.trim() === '' ||cpfInput.value.trim() === '' ||senhaInput.value.trim() === '') {
            event.preventDefault();
            return false;
        } else {
            Login(event);
        }
    });
});

function apenasNumeros(event) {
    const char = String.fromCharCode(event.which);
    if (!/^[0-9]$/.test(char)) {
        event.preventDefault();
    }
}
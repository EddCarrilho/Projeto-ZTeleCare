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
                        const Sucesso = document.getElementById('card');
                        Sucesso.style.display = 'inline-flex';
                        localStorage.setItem('cardVisible', 'true');
                        location.reload();
                    })
                    .catch((error) => console.error(`Erro na API: ${error}`));
                }
            });
        });
    });
}

window.onload = function() {
    const Sucesso = document.getElementById('card');
    
    const cardVisible = localStorage.getItem('cardVisible');
    
    if (cardVisible === 'true') {
        Sucesso.style.display = 'inline-flex';
        localStorage.setItem('cardVisible', 'false');
        setTimeout(function() {
            Sucesso.style.display = 'none';
            localStorage.setItem('cardVisible', 'false');
        }, 3000);
    }
};

function Login(event){
    event.preventDefault();
    const email2 = document.querySelector("#email2").value;
    const cpf2 = document.querySelector("#cpf2").value;
    const senha2 = document.querySelector("#senha2").value;
    const errorMessage = document.getElementById('login-error');

    const cleanCpf2 = getcleancpf2(cpf2);
    function getcleancpf2(cpf2) {
        return cpf2.replace(/\D/g, '');
    }
    LoginError().then((isLoginValid) => {
        if (isLoginValid) {
            fetch("http://127.0.0.1:4100/api/v1/users/login",{
                method:"POST",
                headers:{
                    "accept":"application/json",
                    "content-type":"application/json"
                },
                body:JSON.stringify({
                    email:email2,
                    cpf:cleanCpf2,
                    senha:senha2
                })
            }).then((res)=> {
                if (res.status === 400) {
                    setInputError('email2');
                    setInputError('cpf2');
                    setInputError('senha2');
                    errorMessage.style.display = 'block';
                    return;
                } else if (res.status === 200){
                    return res.json();
                } else {
                    throw new Error(`Erro inesperado: ${res.status}`);
                }
            }).then((result)=>{
                if (result) {
                    const token = result.token;
                    localStorage.setItem('authToken', token);
                    window.parent.postMessage(localStorage.getItem('authToken'), 'http://127.0.0.1:5510');
                    window.location.href = 'http://127.0.0.1:5510/front/home.html';
                }
            })
            .catch((error)=>console.error(`Erro ao tenta acessar a api ${error}`));
        } else {
            LoginError2().then((isLoginValid2) => {
                const email2 = document.querySelector("#email2").value;
                const cpf2 = document.querySelector("#cpf2").value;
                const senha2 = document.querySelector("#senha2").value;
                const errorMessage = document.getElementById('login-error');

                const cleanCpf2 = getcleancpf2(cpf2);
                function getcleancpf2(cpf2) {
                    return cpf2.replace(/\D/g, '');
                }
                if (isLoginValid2) {
                    fetch("http://127.0.0.1:4100/api/v1/users/login2",{
                        method:"POST",
                        headers:{
                            "accept":"application/json",
                            "content-type":"application/json"
                        },
                        body:JSON.stringify({
                            email:email2,
                            cpf:cleanCpf2,
                            senha:senha2
                        })
                        
                    }).then((res)=> {
                        if (res.status === 400) {
                            setInputError('email2');
                            setInputError('cpf2');
                            setInputError('senha2');
                            errorMessage.style.display = 'block';
                            return;
                        } else if (res.status === 200){
                            return res.json();
                        } else {
                            throw new Error(`Erro inesperado: ${res.status}`);
                        }
                    }).then((result)=>{
                        if (result) {
                            const token = result.token;
                            localStorage.setItem('authToken', token);
                            window.parent.postMessage(localStorage.getItem('authToken'), 'http://127.0.0.1:5510');
                            window.location.href = 'http://127.0.0.1:5510/front/home.html';
                        }
                    })
                    .catch((error)=>console.error(`Erro ao tenta acessar a api ${error}`));
                }
            });
        }
    });
}    

document.addEventListener("DOMContentLoaded", function() {
    Verify();
});

function Verify(){
    const token = localStorage.getItem('authToken');
    if (token) {
        fetch("http://127.0.0.1:4100/api/v1/personaldata/verify",{
            method: 'GET',
            headers: {
            'Authorization': `Bearer ${token}`
            }
        }).then((res)=> {
            if (res.status === 200){
                return res.json();
            } else if (res.status === 403){
                localStorage.removeItem('authToken');
            }
            else {
                throw new Error(`Erro inesperado: ${res.status}`);
            }
        }).then((result)=>{
            if (result && result.msg === "Ok") {
                window.location.href = "http://127.0.0.1:5510/front/home.html";
            } 
        })
        .catch((error)=>console.error(`Erro ao tenta acessar a api ${error}`));
    }
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
    const errorMessage = document.getElementById('login-error');
    removeInputError('email2');
    removeInputError('cpf2');
    removeInputError('senha2');
    errorMessage.style.display = 'none';
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
        cpf = cpf.replace(/(\d{3})(\d)/, '$1.$2');
        cpf = cpf.replace(/(\d{3})(\d)/, '$1.$2');
        cpf = cpf.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
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
            if (dados.payload && dados.payload.rows.length > 0 || cpf.length < 14) {
                if(dados.payload.rows[0].cpf.length > 0) {
                    setInputError('cpf');
                    errorMessage.style.display = 'block';
                    return false;
                }  else {
                    removeInputError('cpf');
                    errorMessage.style.display = 'none';
                    return true;
                }
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
            if (dados.payload && dados.payload.rows.length > 0 || phone < 10) {
                if(dados.payload.rows[0].telefone.length > 0) {
                    setInputError('phone');
                    errorMessage.style.display = 'block';
                    return false;
                } else {
                    removeInputError('phone');
                    errorMessage.style.display = 'none';
                    return true;
                }
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
            if (dados.payload && dados.payload.rows.length > 0) {
                if(dados.payload.rows[0].telefone.length > 0) {
                    setInputError('email');
                    errorMessage.style.display = 'block';
                    return false;
                } else {
                    removeInputError('email');
                    errorMessage.style.display = 'none';
                    return true;
                }
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

function LoginError() {

    const email = document.querySelector("#email2").value;
    const cpf = document.querySelector("#cpf2").value;
    const errorMessage = document.getElementById('login-error');

    const cleanCpf = getcleancpf(cpf);
    function getcleancpf(cpf) {
        return cpf.replace(/\D/g, '');
    }
    
    return fetch(`http://127.0.0.1:4100/api/v1/users/buscarporcpf2/${cleanCpf}`)
        .then((res)=>res.json())
        .then((dados)=>{
            if (dados.payload && dados.payload.rows.length > 0) {
                return false;
            } else {
                return fetch(`http://127.0.0.1:4100/api/v1/users/buscarporemail/${email}`)
                    .then((res)=>res.json())
                    .then((dados)=>{
                        if (dados.payload && dados.payload.rows.length > 0) {
                            if (dados.payload.rows[0].email.length > 0) {
                                removeInputError('email2');
                                removeInputError('cpf2');
                                removeInputError('senha2');
                                errorMessage.style.display = 'none';


                                return fetch(`http://127.0.0.1:4100/api/v1/users/buscarporcpf/${cleanCpf}`) 
                                    .then((res)=>res.json())
                                    .then((dados)=>{
                                        if (dados.payload && dados.payload.rows.length > 0) {
                                            if (dados.payload.rows[0].cpf.length > 0) {
                                                removeInputError('email2');
                                                removeInputError('cpf2');
                                                removeInputError('senha2');
                                                errorMessage.style.display = 'none';
                                                return true;
                                            } else {
                                                setInputError('email2');
                                                setInputError('cpf2');
                                                setInputError('senha2');
                                                errorMessage.style.display = 'block';
                                                return false;
                                            };
                                        }  else {
                                            setInputError('email2');
                                            setInputError('cpf2');
                                            setInputError('senha2');
                                            errorMessage.style.display = 'block';
                                            return false;
                                        };
                        
                                });
                            } else {
                                setInputError('email2');
                                setInputError('cpf2');
                                setInputError('senha2');
                                errorMessage.style.display = 'block';
                                return false;
                };
            } else {
                setInputError('email2');
                setInputError('cpf2');
                setInputError('senha2');
                errorMessage.style.display = 'block';
                return false;
              };
        });
            }
        });
                    
};

function LoginError2() {

    const email = document.querySelector("#email2").value;
    const cpf = document.querySelector("#cpf2").value;
    const errorMessage = document.getElementById('login-error');

    const cleanCpf = getcleancpf(cpf);
    function getcleancpf(cpf) {
        return cpf.replace(/\D/g, '');
    }
    
    return fetch(`http://127.0.0.1:4100/api/v1/users/buscarporemail2/${email}`)
        .then((res)=>res.json())
        .then((dados)=>{
            if (dados.payload && dados.payload.rows.length > 0) {
                if (dados.payload.rows[0].email.length > 0) {
                    removeInputError('email2');
                    removeInputError('cpf2');
                    removeInputError('senha2');
                    errorMessage.style.display = 'none';


                    return fetch(`http://127.0.0.1:4100/api/v1/users/buscarporcpf2/${cleanCpf}`) 
                        .then((res)=>res.json())
                        .then((dados)=>{
                            if (dados.payload && dados.payload.rows.length > 0) {
                                if (dados.payload.rows[0].cpf.length > 0) {
                                    removeInputError('email2');
                                    removeInputError('cpf2');
                                    removeInputError('senha2');
                                    errorMessage.style.display = 'none';
                                    return true;
                                } else {
                                    setInputError('email2');
                                    setInputError('cpf2');
                                    setInputError('senha2');
                                    errorMessage.style.display = 'block';
                                    return false;
                                    };
                            }  else {
                                setInputError('email2');
                                setInputError('cpf2');
                                setInputError('senha2');
                                errorMessage.style.display = 'block';
                                return false;
                                };
                        
                                });
                            } else {
                                setInputError('email2');
                                setInputError('cpf2');
                                setInputError('senha2');
                                errorMessage.style.display = 'block';
                                return false;
                };
            } else {
                setInputError('email2');
                setInputError('cpf2');
                setInputError('senha2');
                errorMessage.style.display = 'block';
                return false;
              };
        });
};
                
    
                

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
        if (nameInput.value.trim() === '' || cpfInput.value.trim() === '' || phoneInput.value.trim() === '' || emailInput.value.trim() === '' || senhaInput.value.trim() === '') {
            event.preventDefault();
            return false;
        } else {
            event.preventDefault();
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

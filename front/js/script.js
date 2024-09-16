function Cadastrar(){
    const nome = document.querySelector("#nome");
    const cpf = document.querySelector("#cpf");
    const data = document.querySelector("#data");
    const phone = document.querySelector("#phone");
    const email = document.querySelector("#email");
    const senha = document.querySelector("#senha");

    // Remove pontos e traços dos CPFs
    const cleanCpf = getCleanCpf(cpf);

    fetch("http://127.0.0.1:4100/api/v1/users/cadastrar",{
        method:"POST",
        headers:{
            "accept":"application/json",
            "content-type":"application/json"
        },
        body:JSON.stringify({
            nome:nome.value,
            cpf:cleanCpf.value,
            datadenascimento:data.value,
            telefone:phone.value,
            email:email.value,
            senha:senha.value
        })
    })
    .then((res)=>res.json())
    .then((result)=>{
        console.log(result);
    })
    .catch((error)=>console.error(`Erro na api ${error}`))
}

function Login(){

    const email2 = document.querySelector("#email2");
    const cpf2 = document.querySelector("#cpf2");
    const senha2 = document.querySelector("#senha2");

    const cleanCpf2 = getCleanCpf(cpf2);

    fetch("http://127.0.0.1:4100/api/v1/users/login",{
        method:"POST",
        headers:{
            "accept":"application/json",
            "content-type":"application/json"
        },
        body:JSON.stringify({
            email:email2.value,
            cpf:cleanCpf2.value,
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
        // Alternar o tipo de input entre 'password' e 'text'
        const type = passwordField.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordField.setAttribute('type', type);

        // Alternar o ícone entre olho e olho com risco (opcional)
        this.innerHTML = type === 'password' 
            ? '<i class="fa-solid fa-eye"></i>' 
            : '<i class="fa-solid fa-eye-slash"></i>';
    });
    togglePassword2.addEventListener('click', function () {
        // Alternar o tipo de input entre 'password' e 'text'
        const type = passwordField2.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordField2.setAttribute('type', type);

        // Alternar o ícone entre olho e olho com risco (opcional)
        this.innerHTML = type === 'password' 
            ? '<i class="fa-solid fa-eye"></i>' 
            : '<i class="fa-solid fa-eye-slash"></i>';
    });

const signupButton = document.getElementById('signup');
const signinButton = document.getElementById('signin');
const form = document.getElementById('MyForm');
const form2 = document.getElementById('MyForm2');

signinButton.addEventListener('click', function () {
    // Usar a função reset para limpar todos os campos do formulário
    form.reset();
});

signupButton.addEventListener('click', function () {
    // Usar a função reset para limpar todos os campos do formulário
    form2.reset();
});

function applyCpfMask(event) {
    let cpf = event.target.value;
    
    // Remove caracteres não numéricos
    cpf = cpf.replace(/\D/g, '');
    
    // Adiciona máscara no formato xxx.xxx.xxx-xx
    if (cpf.length <= 11) {
        cpf = cpf.replace(/(\d{3})(\d{1,3})/, '$1.$2');
        cpf = cpf.replace(/(\d{3})(\d{1,2})/, '$1.$2');
        cpf = cpf.replace(/(\d{3})(\d{1,2})/, '$1-$2');
    }
    
    // Atualiza o valor do campo com a máscara aplicada
    event.target.value = cpf;
}

// Adicionar máscara aos campos de CPF
document.getElementById('cpf').addEventListener('input', applyCpfMask);
document.getElementById('cpf2').addEventListener('input', applyCpfMask);

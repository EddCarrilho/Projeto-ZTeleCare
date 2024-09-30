document.addEventListener("DOMContentLoaded", function() {
    const urlParams = new URLSearchParams(window.location.search);
    const userId = urlParams.get('id');
    const token = urlParams.get('token');
    const success = document.getElementById('success');
    const error = document.getElementById('error');
    const error2 = document.getElementById('error2');

    if(token) {
        fetch(`http://127.0.0.1:4100/api/v1/users/buscarportoken/${token}`,{
        }).then((res)=> {
            if (res.status === 200){
                return res.json();
            } else {
                throw new Error(`Erro inesperado: ${res.status}`);
            }
        }).then((result)=>{
            if (result.payload && result.payload.rows.length > 0 ) {
                error.style.display = 'none';
                error2.style.display = 'none';
            } else {
                success.style.display = 'none';
            }
        })
        .catch((error)=>console.error(`Erro ao tenta acessar a api ${error}`));
    } else {
        if (!userId || !token.length) {
            window.location.href = "http://127.0.0.1:5510/front/home.html";
        }
    }
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

function setInputError(id) {
    document.getElementById(id).classList.add('input-error');
}

function removeInputError(id) {
    document.getElementById(id).classList.remove('input-error');
}

function resetsenha(event) {
    event.preventDefault();
    const senha = document.getElementById('senha1').value;
    const confirmarSenha = document.getElementById('senha2').value;
    const mensagemErro = document.getElementById('senha-confirm');
    const Senharestaurada = document.getElementById('senha-confirm2');
    const urlParams = new URLSearchParams(window.location.search);
    const userId = urlParams.get('id');
    const token = urlParams.get('token');

    if (senha !== confirmarSenha) {
        setInputError('senha1');
        setInputError('senha2');
        mensagemErro.style.display = 'block'; // Exibe a mensagem de erro
    } else {
        removeInputError('senha1');
        removeInputError('senha2');
        mensagemErro.style.display = 'none';
        document.getElementById('botao').disabled = true;

        return fetch(`http://127.0.0.1:4100/api/v1/users/resetarsenha`, {
            method:"POST",
            headers:{
                "accept":"application/json",
                "content-type":"application/json"
            },
            body:JSON.stringify({
                senha: senha,
                token: token,
                userId: userId
            })
        }).then((res)=> {
            return res.json();
        })
        .then((dados)=>{
            if(dados) {
                Senharestaurada.style.display = 'block';
            }
        })
        .catch((error)=> {
            console.error(`Erro na api ${error}`)
            return false;
        })
    }

}
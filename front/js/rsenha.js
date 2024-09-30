function Recuperar() {
    const email = document.querySelector("#email");
    const emailMessage = document.getElementById('email-confirm');
    fetch(`http://127.0.0.1:4100/api/v1/users/esqueceuasenha`,{
        method:"POST",
        headers:{
            "accept":"application/json",
            "content-type":"application/json"
        },
        body:JSON.stringify({
            email:email.value
        })
        }).then((res)=>res.json())
        .then((dados)=>{
            if (dados && dados.success === true) {
            emailMessage.style.display = 'block';
            }
        })
        .catch((error)=> {
            console.error(`Erro na api ${error}`)
        })
}

document.addEventListener("DOMContentLoaded", function() {
        document.getElementById('MyForm').addEventListener('submit', function(event) {
            document.getElementById('botao').disabled = true;
            Recuperar();
            event.preventDefault();
        });
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

function Cadastrar(){
    const nome = document.querySelector("#nome");
    const cpf = document.querySelector("#cpf");
    const data = document.querySelector("#data");
    const phone = document.querySelector("#phone");
    const email = document.querySelector("#email");
    const senha = document.querySelector("#senha");

    fetch("http://127.0.0.1:4100/api/v1/users/cadastrar",{
        method:"POST",
        headers:{
            "accept":"application/json",
            "content-type":"application/json"
        },
        body:JSON.stringify({
            nome:nome.value,
            cpf:cpf.value,
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

    fetch("http://127.0.0.1:4100/api/v1/users/login",{
        method:"POST",
        headers:{
            "accept":"application/json",
            "content-type":"application/json"
        },
        body:JSON.stringify({
            email:email2.value,
            cpf:cpf2.value,
            senha:senha2.value
        })
    }).then((res)=>res.json())
    .then((result)=>{
        console.log(result);
    })
    .catch((error)=>console.error(`Erro ao tenta acessar a api ${error}`));
    
}

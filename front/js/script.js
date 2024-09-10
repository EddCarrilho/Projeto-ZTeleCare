function Cadastrar(){
    const nome = document.querySelector("#nome");
    const sobrenome = document.querySelector("#sobrenome");
    const cpf = document.querySelector("#cpf");
    const data = document.querySelector("#data");
    const phone = document.querySelector("#phone");
    const email = document.querySelector("#email");
    const senha = document.querySelector("#senha");
    const nomeCompleto = nome + ' ' + sobrenome;
    console.log(nomeCompleto);

    fetch("http://127.0.0.1:4100/api/v1/users/cadastrar",{
        method:"POST",
        headers:{
            "accept":"application/json",
            "content-type":"application/json"
        },
        body:JSON.stringify({
            nome:nomeCompleto.value,
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
function Recuperar() {
    fetch(`http://127.0.0.1:4100/api/v1/users/esqueceusenha`)
        .then((res)=>res.json())
        .then((dados)=>{
            console.log(dados);
        })
        .catch((error)=> {
            console.error(`Erro na api ${error}`)
        })
}
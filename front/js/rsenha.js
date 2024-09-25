function Recuperar() {
    fetch("http://127.0.0.1:4100/api/v1/users/resetsenha", {
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
                        console.log({result});
                        location.reload();
                    })
                    .catch((error) => console.error(`Erro na API: ${error}`));
}
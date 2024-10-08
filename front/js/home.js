// Função da navbar
$(document).ready(function () {
    $('.fa-bars').click(function () {
        $(this).toggleClass('fa-times');
        $('.navbar').toggleClass('nav-toggle');
    });

    $(Window).on('scroll load', function () {
        $('fa-bars').removeClass('fa-times');
        $('.navbar').removeClass('nav-toggle');

        if ($(Window).scrollTop() > 30) {
            $('header').addClass('header-active');
        } else {
            $('header').removeClass('header-active');
        }
    });
});

document.addEventListener("DOMContentLoaded", function() {
    window.addEventListener('message', function(event) {
        if (event.origin === 'http://127.0.0.1:5510/front/html/LogCad.html') {
            const token = event.data;
        }
    });
    Verify();
});

function Verify(){
    const token = localStorage.getItem('authToken');
    const deslogarLi = document.querySelector('li[onclick="Deslogar()"]');

    if (token) {
        fetch("http://127.0.0.1:4100/api/v1/personaldata/verify",{
            method: 'GET',
            headers: {
            'Authorization': `Bearer ${token}`
            }
        }).then((res)=> {
            console.log(res.status);
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
                document.querySelector('li a[href="./html/LogCad.html"]').parentElement.style.display = 'none';
                deslogarLi.style.display = 'block';
            } 
        })
        .catch((error)=>console.error(`Erro ao tenta acessar a api ${error}`));
    } else {
        document.querySelector('li a[href="./html/LogCad.html"]').parentElement.style.display = 'block';
        deslogarLi.style.display = 'none';
    }
}

document.getElementById('contactForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevenir o comportamento padrão de submit

    // Coletar valores do formulário
    var nome = document.getElementById('name').value;
    var email = document.getElementById('email').value;
    var telefone = document.getElementById('phone').value;
    var mensagem = document.getElementById('message').value;

    // Montar o corpo do email
    var emailBody = `Nome completo: ${nome} %0AEmail: ${email} %0ATelefone: ${telefone} %0A%0A%0AMensagem: ${mensagem} %0A%0A%0A`;

    // Criar a URL mailto com os dados
    var mailtoLink = `mailto:ztelecare@gmail.com?subject=Contato do site&body=${emailBody}`;

    // Abrir a URL para enviar o email
    window.location.href = mailtoLink;
});

function apenasNumeros(event) {
    const char = String.fromCharCode(event.which);
    if (!/^[0-9]$/.test(char)) {
        event.preventDefault();
    }
}

function Deslogar() {
    const deslogarLi = document.querySelector('li[onclick="Deslogar()"]');
    localStorage.removeItem('authToken');
    deslogarLi.style.display = 'none';
    window.location.href = "http://127.0.0.1:5510/front/html/LogCad.html";
}


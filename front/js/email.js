document.getElementById('contactForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevenir o comportamento padrão de submit

    // Coletar valores do formulário
    var nome = document.getElementById('name').value;
    var email = document.getElementById('email').value;
    var telefone = document.getElementById('phone').value;
    var mensagem = document.getElementById('message').value;

    // Montar o corpo do email
    var emailBody = `Nome completo: ${nome}%0AEmail: ${email}%0ATelefone: ${telefone}%0AMensagem: ${mensagem}`;

    // Criar a URL mailto com os dados
    var mailtoLink = `mailto:ztelecare@gmail.com?subject=Contato do site&body=${emailBody}`;

    // Abrir a URL para enviar o email
    window.location.href = mailtoLink;
});
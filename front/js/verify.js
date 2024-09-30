
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
                document.querySelector('li a[href="./LogCad.html"]').parentElement.style.display = 'none';
            } 
        })
        .catch((error)=>console.error(`Erro ao tenta acessar a api ${error}`));
    } else {
        document.querySelector('li a[href="./LogCad.html"]').parentElement.style.display = 'block';
    }
}
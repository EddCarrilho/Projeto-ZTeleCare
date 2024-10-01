// login elementos

const login = document.querySelector(".login")

const loginForm = login.querySelector(".login__form")

const loginInput = login.querySelector(".login__input")

// chats  elementos 
const chat = document.querySelector(".chat")

const chatForm = chat.querySelector(".chat__form")

const chatInput = chat.querySelector(".chat__input")

const chatMessages = chat.querySelector(".chat__messages")

const colors = [
    "cadetblue",
    "darkgoldenrod",
    "cornflowerblue",
    "darkkhaki",
    "hotpink",
    "gold"
]

const user = { id: "", name: "", color: "" }

let websocket

const createMessageSelfElement = (content) => {
    const div = document.createElement("div")

    div.classList.add("message--self")
    div.innerHTML = content

    return div
}

const createMessageOtherElement = (content, sender, senderColor) => {
    const div = document.createElement("div")
    const span = document.createElement("span")

    div.classList.add("message--other")

    span.classList.add("message--sender")
    span.style.color = senderColor

    div.appendChild(span)

    span.innerHTML = sender
    div.innerHTML += content

    return div
}

const getRandomColor = () => {
    const randomIndex = Math.floor(Math.random() * colors.length)
    return colors[randomIndex]
}

const scrollScreen = () => {
    window.scrollTo({
        top: document.body.scrollHeight,
        behavior: "smooth"
    })
}

const processMessage = ({ data }) => {
    const { userId, userName, userColor, content } = JSON.parse(data)

    const message =
        userId == user.id
            ? createMessageSelfElement(content)
            : createMessageOtherElement(content, userName, userColor)

    chatMessages.appendChild(message)

    scrollScreen()
}

const handleLogin = (event) => {
    event.preventDefault()

    user.id = crypto.randomUUID()
    user.name = loginInput.value
    user.color = getRandomColor()

    login.style.display = "none"
    chat.style.display = "flex"

    websocket = new WebSocket("https://chat-ztalecare.onrender.com")
    websocket.onmessage = processMessage
}

const sendMessage = (event) => {
    event.preventDefault()

    const message = {
        userId: user.id,
        userName: user.name,
        userColor: user.color,
        content: chatInput.value
    }

    fetch("http://127.0.0.1:4100/api/v1/chat/mensagem", {
        method: "POST",
        headers: {
          "accept": "application/json",
          "content-type": "application/json"
        },
        body: JSON.stringify({
            userId: user.id,
            userName: user.name,
            content: chatInput.value,
            userColor: user.color
            
        })
      }).then((res) => res.json())
       
     websocket.send(JSON.stringify(message))
  
    chatInput.value = ""

    if (content) {
        
    }
}

loginForm.addEventListener("submit", handleLogin)
chatForm.addEventListener("submit", sendMessage)


async function enviarMensagem(usuario, mensagem) {
    const response = await fetch('http://127.0.0.1:4100/api/v1/chat/mensagem', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ usuario, mensagem })
    });
    const data = await response.text()
    
  }

  async function receberMensagens() {
    const response = await fetch('http://127.0.0.1:4100/api/v1/chat/mensagem')
    const mensagens = await response.json()

  }






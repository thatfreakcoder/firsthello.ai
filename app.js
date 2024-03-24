var send_icon = document.getElementsByClassName("send-icon")[0];
var input = document.getElementsByClassName("InputMSG")[0];
var ContentChat = document.getElementsByClassName("ContentChat")[0];
var san1 = document.getElementById("send1");
var san2 = document.getElementById("send2");
var msg_lst = []
var apiUrl = "https://ai-chat-bot-mh1z.onrender.com";
// var apiUrl = "http://localhost:5110";

// Add event Click for icon send input message
send_icon.addEventListener("click", SendMsgByUser);

// Add event Enter for input message
input.addEventListener("keydown", (e) => {
  if (e.key == "Enter") {
    SendMsgByUser();
  }
});

//With the help of this parameter, we can find out whether the function status_func_SendMsgByBot is difficult to send a message or not (0 = no | 1 = yes)
var status_func_SendMsgByBot = 0;

// ---------------- message User ----------------

// Function Send message user in content chat
function SendMsgByUser(from_input_field = true, msg = "") {
  if (from_input_field) {
    console.log("triggered from input field");
    if (input.value != "" && status_func_SendMsgByBot == 0) {
      san1.classList.add("none");
      san2.classList.remove("none");

      let elementCPT = document.createElement("div");
      elementCPT.classList.add("message", "msgCaption");
      elementCPT.setAttribute("data-user", "true");
      elementCPT.innerHTML = '<span class="captionUser">You</span>';
      ContentChat.appendChild(elementCPT);

      let elementMSG = document.createElement("div");
      elementMSG.classList.add("message");
      elementMSG.setAttribute("data-user", "true");
      elementMSG.innerHTML = `<div class="user-response">${input.value}</div>`;
      ContentChat.appendChild(elementMSG);
      elementMSG.scrollIntoView();
      SendMsgByBot(input.value);
      input.value = "";
    }
  } else {
    console.log("triggered from button click");
    san1.classList.add("none");
    san2.classList.remove("none");

    let elementCPT = document.createElement("div");
    elementCPT.classList.add("message", "msgCaption");
    elementCPT.setAttribute("data-user", "true");
    elementCPT.innerHTML = '<span class="captionUser">You</span>';
    ContentChat.appendChild(elementCPT);

    let elementMSG = document.createElement("div");
    elementMSG.classList.add("message");
    elementMSG.setAttribute("data-user", "true");
    elementMSG.innerHTML = `<div class="user-response">${msg}</div>`;
    ContentChat.appendChild(elementMSG);
    elementMSG.scrollIntoView();
    SendMsgByBot(msg);
    document.getElementById("follow-up-btn-group").remove();
  }
}

// ---------------- message Bot ----------------

// Function Send message bot(RagBot) in content chat
async function SendMsgByBot(msg) {
  status_func_SendMsgByBot = 1;

  let elementCPT = document.createElement("div");
  elementCPT.classList.add("captionBot", "msgCaption");
  elementCPT.innerHTML = '<img src="./assets/favicon.png" alt="logo"> <span>GC Bot</span>';
  ContentChat.appendChild(elementCPT);
  elementCPT.scrollIntoView();

  let elementMSG = document.createElement("div");
  elementMSG.classList.add("message");
  elementMSG.innerHTML = `<div class="bot-response text" text-first="true"><svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="24px" height="30px" viewBox="0 0 24 30" style="enable-background:new 0 0 50 50;" xml:space="preserve"> <rect x="0" y="0" width="4" height="10" fill="rgb(155, 166, 178)"> <animateTransform attributeType="xml" attributeName="transform" type="translate" values="0 0; 0 20; 0 0" begin="0" dur="0.6s" repeatCount="indefinite"> </animateTransform> </rect> <rect x="10" y="0" width="4" height="10" fill="rgb(155, 166, 178)"> <animateTransform attributeType="xml" attributeName="transform" type="translate" values="0 0; 0 20; 0 0" begin="0.2s" dur="0.6s" repeatCount="indefinite"> </animateTransform> </rect> <rect x="20" y="0" width="4" height="10" fill="rgb(155, 166, 178)"> <animateTransform attributeType="xml" attributeName="transform" type="translate" values="0 0; 0 20; 0 0" begin="0.4s" dur="0.6s" repeatCount="indefinite"> </animateTransform> </rect> </svg></div>`;
  ContentChat.appendChild(elementMSG);

  let statusElement = document.getElementById("status");
  statusElement.innerHTML = "Typing...";

  let result;
  // setTimeout(async () => {
  console.log(JSON.stringify({
    "msg_lst": msg_lst,
    "query": msg,
  }));
  const response = await fetch(`${apiUrl}/ask`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      "msg_lst": msg_lst,
      "query": msg,
    }),
  });
  const responseData = await response.json();
  // const output = getFollowUpQuestion(responseData.response);
  reply = marked.parse(responseData.output);
  // let reply = "Hello world!"
  result = `
    <div class="bot-response text" text-first="true">${reply}</div>
    <div class="d-flex flex-column mt-3" id="follow-up-btn-group">
      </div>
    `;

  elementMSG.innerHTML = result;
  elementMSG.scrollIntoView();
  san1.classList.remove("none");
  san2.classList.add("none");
  status_func_SendMsgByBot = 0;
  statusElement.innerHTML = "Online";
  msg_lst.push(msg);
  msg_lst.push(responseData.output);
  // }, 2000);
  ContentChat.appendChild(elementMSG);
  elementMSG.scrollIntoView();
}


document.addEventListener("DOMContentLoaded", async () => {
// colored Console.log
  console.log("%cFrontend Version: 0.0.1@23-03-2024", "color: #FEBF10; font-weight: bold;");
  const ver = await fetch(apiUrl);
  const verData = await ver.json();
  console.log(`%cBackend Version: ${verData.version}`, "color: #FEBF10; font-weight: bold;");

  var isNew = localStorage.getItem("isNew");
  if (isNew === null) {
    localStorage.setItem("isNew", 1);
    isNew = 1;
  } else {
    isNew = 0;
  }
  let elementCPT = document.createElement("div");
  elementCPT.classList.add("captionBot", "msgCaption");
  elementCPT.innerHTML = '<img src="./assets/favicon.png" alt="logo"> <span>GC Bot</span>';
  ContentChat.appendChild(elementCPT);
  elementCPT.scrollIntoView();

  let elementMSG = document.createElement("div");
  elementMSG.classList.add("message");
  elementMSG.innerHTML = `<div class="bot-response text" text-first="true"><svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="24px" height="30px" viewBox="0 0 24 30" style="enable-background:new 0 0 50 50;" xml:space="preserve"> <rect x="0" y="0" width="4" height="10" fill="rgb(155, 166, 178)"> <animateTransform attributeType="xml" attributeName="transform" type="translate" values="0 0; 0 20; 0 0" begin="0" dur="0.6s" repeatCount="indefinite"> </animateTransform> </rect> <rect x="10" y="0" width="4" height="10" fill="rgb(155, 166, 178)"> <animateTransform attributeType="xml" attributeName="transform" type="translate" values="0 0; 0 20; 0 0" begin="0.2s" dur="0.6s" repeatCount="indefinite"> </animateTransform> </rect> <rect x="20" y="0" width="4" height="10" fill="rgb(155, 166, 178)"> <animateTransform attributeType="xml" attributeName="transform" type="translate" values="0 0; 0 20; 0 0" begin="0.4s" dur="0.6s" repeatCount="indefinite"> </animateTransform> </rect> </svg></div>`;
  ContentChat.appendChild(elementMSG);

  let statusElement = document.getElementById("status");
  statusElement.innerHTML = "Typing...";

  status_func_SendMsgByBot = 1;
  san1.classList.add("none");
  san2.classList.remove("none");
  elementMSG.scrollIntoView();

  // setTimeout(() => {
  // let reply = "Hello world!"
  if (isNew == 1) {
    try {
      reply = marked.parse("**Welcome to Get Catalyzed!** We're your one-stop shop for all IT and marketing solutions, enhancing your digital presence with a blend of creativity and technology. How can we assist you today?");
      // let reply = "Hello world!"
      elementMSG.innerHTML = `
    <div class="bot-response text" text-first="true">${reply}</div>
    <div class="d-flex flex-column mt-3" id="follow-up-btn-group">
      </div>
    `;
      elementMSG.scrollIntoView();
      san1.classList.remove("none");
      san2.classList.add("none");
      status_func_SendMsgByBot = 0;
      statusElement.innerHTML = "Online";
      ContentChat.appendChild(elementMSG);
      elementMSG.scrollIntoView();

    } catch (e) {
      console.log(e);
      elementMSG.innerHTML = `
      <div class="bot-response text" text-first="true">Sorry! We are currently Offline 😔! Try refreshing the page or come back in a few minutes.</div>`
      elementMSG.scrollIntoView();
      san1.classList.remove("none");
      san2.classList.add("none");
      status_func_SendMsgByBot = 0;
      statusElement.innerHTML = "Online";
      ContentChat.appendChild(elementMSG);
      elementMSG.scrollIntoView();
    }
  } else {
    // const input = getFollowUpQuestion("Welcome Back! It's great to see you again. Do you want to start a new conversation or continue the previous one?")
    let reply = marked.parse("Welcome Back to Get Catalyzed! It's great to see you again. How can we help you today?");
    elementMSG.innerHTML = `
        <div class="bot-response text" text-first="true">${reply}</div>
        <div class="d-flex flex-column mt-3" id="follow-up-btn-group">
      </div>
        `;
    elementMSG.scrollIntoView();
    san1.classList.remove("none");
    san2.classList.add("none");
    status_func_SendMsgByBot = 0;
    statusElement.innerHTML = "Online";
    ContentChat.appendChild(elementMSG);
    elementMSG.scrollIntoView();
  }
  // }, 2000)
});


// function getFollowUpQuestion(input) {
//   try {
//     const json = input.match(/\{\s*"follow_up"\s*:\s*(.+?)\s*\}/)[0];
//     const follow_ups = JSON.parse(json).follow_up;
//     const remaining = input.replace(json, "").replace("``````", "");
//     const output = {
//       "msg": remaining,
//       follow_ups
//     }
//     console.log(output);
//     return output
//   } catch (e) {
//     const follow_ups = ["Tell me about your Projects!", "What are your future plans?", "How do you spend your free time?"];
//     const remaining = input;
//     const output = {
//       "msg": remaining,
//       follow_ups
//     }
//     console.log(output);
//     return output
//   }
// }

document.getElementById("darkMode").addEventListener("change", (e) => {
  let darkMode = e.target.checked;
  if (darkMode === true) {
    // get all element with style var dark
    document.querySelector(":root").style.setProperty("--body-bg-color", "#000000");
    document.querySelector(":root").style.setProperty("--bot-response-bg-color", "#333333");
    document.querySelector(":root").style.setProperty("--bot-response-text-color", "#fff");
    document.querySelector(":root").style.setProperty("--bot-response-shadow", "20px 20px 60px #181818, -20px -20px 60px #000000");
    document.querySelector(":root").style.setProperty("--user-response-shadow", "24px 11px 26px #1F1F20, 3px -6px 13px #000000");
    document.querySelector(":root").style.setProperty("--bot-caption-text-color", "grey");
    document.querySelector(":root").style.setProperty("--content-chat-bg-color", "#1c1c1c");
    document.querySelector(":root").style.setProperty("--container", "#000");
  } else {
    document.querySelector(":root").style.setProperty("--body-bg-color", "#673ab7");
    document.querySelector(":root").style.setProperty("--bot-response-bg-color", "#fff");
    document.querySelector(":root").style.setProperty("--bot-response-text-color", "#000");
    document.querySelector(":root").style.setProperty("--bot-response-shadow", "20px 20px 60px #cecece, -20px -20px 60px #ffffff");
    document.querySelector(":root").style.setProperty("--user-response-shadow", "10px 11px 30px #a7a7a7, -20px -20px 60px #ffffff");
    document.querySelector(":root").style.setProperty("--bot-caption-text-color", "rgb(24, 25, 25)");
    document.querySelector(":root").style.setProperty("--content-chat-bg-color", "#f2f2f2");
    document.querySelector(":root").style.setProperty("--container", "#fff");
  }
})
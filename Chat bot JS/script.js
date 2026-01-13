const chat = document.getElementById('chat');
const form = document.getElementById('form');
const input = document.getElementById('input');
const botStatus = document.getElementById('botStatus');

const nowTime = () => new Date().toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'});
const scrollToBottom = () => chat.scrollTop = chat.scrollHeight;

function bubble({text, who='bot'}){
  const wrap = document.createElement('div');
  wrap.className = `msg ${who}`;
  const b = document.createElement('div');
  b.className = 'bubble';
  b.innerText = text;
  const t = document.createElement('div');
  t.className = 'time';
  t.textContent = nowTime();
  wrap.appendChild(b);
  wrap.appendChild(t);
  chat.appendChild(wrap);
  scrollToBottom();
}

function typing(on=true){
  if(on){
    const wrap = document.createElement('div');
    wrap.className = 'msg bot';
    wrap.id = 'typing';
    const b = document.createElement('div');
    b.className = 'bubble';
    b.innerHTML = '<span class="typing"><span></span><span></span><span></span></span>';
    const t = document.createElement('div');
    t.className = 'time';
    t.textContent = '...';
    wrap.appendChild(b); wrap.appendChild(t);
    chat.appendChild(wrap); scrollToBottom();
  } else {
    const el = document.getElementById('typing');
    if(el) el.remove();
  }
}

function intent(input){
  const txt = input.toLowerCase();
  const match = (arr) => arr.some(k => txt.includes(k));
  if(match(['oi','ola','olá','hey','bom dia','boa tarde','boa noite'])) return 'greet';
  if(match(['ajuda','help','como usar'])) return 'help';
  if(match(['hora','horário','que horas','time'])) return 'time';
  if(match(['contato','email','suporte'])) return 'contact';
  if(match(['quem é você','sobre'])) return 'about';
  if(match(['limpar','clear','apagar'])) return 'clear';
  return 'fallback';
}

const KB = {
  contact: 'Você pode falar com a equipe no e-mail suporte@exemplo.com.',
  about: 'Sou um bot de demonstração feito em HTML, CSS e JavaScript puro.'
};

async function respond(userText){
  const id = intent(userText);

  botStatus.textContent = 'digitando…';
  typing(true);
  await new Promise(r => setTimeout(r, 700 + Math.random()*600));
  typing(false);
  botStatus.textContent = 'online';

  switch(id){
    case 'greet':
      bubble({text: 'Olá! 👋 Como posso ajudar hoje?', who:'bot'});
      break;
    case 'help':
      bubble({text: 'Posso responder dúvidas rápidas.\nExperimente: "horário", "contato" ou pergunte algo livremente.', who:'bot'});
      break;
    case 'time':
      bubble({text: `Agora são ${new Date().toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}`, who:'bot'});
      break;
    case 'contact':
      bubble({text: KB.contact, who:'bot'});
      break;
    case 'about':
      bubble({text: KB.about, who:'bot'});
      break;
    case 'clear':
      chat.innerHTML = '';
      bubble({text:'Histórico limpo. Como posso ajudar?', who:'bot'});
      break;
    default:
      if(userText.toLowerCase().includes('preço')){
        bubble({text:'Sou apenas um demo: não tenho preços reais. Mas posso simular respostas! 💡 Digite "ajuda" para exemplos.', who:'bot'});
      } else if(userText.toLowerCase().includes('entrega')){
        bubble({text:'As entregas normalmente levam 3–5 dias úteis (exemplo). Digite "ajuda" para exemplos.', who:'bot'});
      } else {
        bubble({text:'Não tenho certeza se entendi. Digite "ajuda" para ver exemplos.', who:'bot'});
      }
  }
}

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const text = input.value.trim();
  if(!text) return;
  bubble({text, who:'user'});
  input.value = '';
  input.focus();
  await respond(text);
});

document.querySelectorAll('.chip').forEach(ch => {
  ch.addEventListener('click', () => {
    input.value = ch.dataset.suggest;
    input.focus();
  });
});

bubble({ text: 'Oi! Eu sou seu chatbot demo. Pergunte "ajuda" para ver o que eu faço. ✨', who:'bot' });

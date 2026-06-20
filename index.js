
// ---- mobile nav ----
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');
  navToggle.addEventListener('click', () => navLinks.classList.toggle('open'));
  navLinks.querySelectorAll('a').forEach(a => a.addEventListener('click', () => navLinks.classList.remove('open')));

  // ---- terminal typing effect ----
  const termBody = document.getElementById('termBody');
  const termLines = [
    {type:'cmd', text:'whoami'},
    {type:'out', text:'Ahmed Khan — Full Stack Developer & AI Engineer'},
    {type:'cmd', text:'cat stack.json'},
    {type:'out', text:'{ frontend: "React.js", backend: "Node.js + Express",'},
    {type:'out', text:'  database: "MongoDB", cloud: "AWS", ai: "Python" }'},
    {type:'cmd', text:'akdev --track-record'},
    {type:'ok', text:'✓ 30+ projects shipped to production'},
    {type:'ok', text:'✓ Avg. response time: under 3 hours'},
    {type:'ok', text:'✓ 5.0★ rating across client reviews'},
    {type:'cmd', text:'akdev --status'},
    {type:'ok', text:'✓ Available for freelance projects'},
    {type:'info', text:'→ Based in Hyderabad, Sindh, PK'},
    {type:'cmd', text:'akdev --hire-me'},
    {type:'highlight', text:'Let\'s build something people actually use.'},
  ];

  async function typeTerminal(){
    for(const line of termLines){
      const row = document.createElement('div');
      row.className = 'term-line';
      termBody.appendChild(row);

      if(line.type === 'cmd'){
        row.innerHTML = '<span class="term-prompt">ahmed@akdev</span><span class="term-line">:~$ </span>';
        const cmdSpan = document.createElement('span');
        cmdSpan.className = 'term-cmd';
        row.appendChild(cmdSpan);
        for(const ch of line.text){
          cmdSpan.textContent += ch;
          await sleep(28);
        }
        await sleep(280);
      } else if(line.type === 'ok'){
        row.innerHTML = `<span class="term-ok">${line.text}</span>`;
        await sleep(160);
      } else if(line.type === 'info'){
        row.innerHTML = `<span class="term-info">${line.text}</span>`;
        await sleep(160);
      } else if(line.type === 'highlight'){
        row.innerHTML = `<span class="term-highlight">${line.text}</span>`;
        await sleep(160);
      } else {
        row.innerHTML = `<span class="term-out">${line.text}</span>`;
        await sleep(180);
      }
    }
    const cursorRow = document.createElement('div');
    cursorRow.innerHTML = '<span class="term-prompt">ahmed@akdev</span><span class="term-line">:~$ </span><span class="cursor-blink"></span>';
    termBody.appendChild(cursorRow);
  }
  function sleep(ms){ return new Promise(r => setTimeout(r, ms)); }
  typeTerminal();

  // ---- scroll reveal for sections ----
  const revealEls = document.querySelectorAll('section, header');
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if(e.isIntersecting){
        e.target.style.opacity = '1';
        e.target.style.transform = 'translateY(0)';
      }
    });
  }, {threshold: 0.08});
  revealEls.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(24px)';
    el.style.transition = 'opacity .7s ease, transform .7s ease';
    io.observe(el);
  });
  document.querySelector('header').style.opacity = '1';
  document.querySelector('header').style.transform = 'translateY(0)';

  // ---- contact form (connects to backend) ----
  const API_BASE = 'http://localhost:5000'; // change this to your deployed Vercel URL when live

  async function handleSubmit(e){
    e.preventDefault();
    const form = e.target;
    const btn = form.querySelector('.submit-btn');
    const original = btn.innerHTML;

    btn.disabled = true;
    btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Sending...';

    try {
      const res = await fetch(`${API_BASE}/api/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: document.getElementById('name').value,
          email: document.getElementById('email').value,
          service: document.getElementById('service').value,
          message: document.getElementById('message').value
        })
      });
      const data = await res.json();

      if (data.success) {
        btn.innerHTML = '<i class="fa-solid fa-check"></i> Sent!';
        form.reset(); // ✅ only clears the form when the message actually sends
      } else {
        btn.innerHTML = '<i class="fa-solid fa-triangle-exclamation"></i> ' + (data.error || 'Failed, try again');
      }
    } catch (err) {
      btn.innerHTML = '<i class="fa-solid fa-triangle-exclamation"></i> Network error, try again';
    }

    setTimeout(() => {
      btn.innerHTML = original;
      btn.disabled = false;
    }, 2500);

    return false;
  }

  // ---- chatbot (connects to backend) ----
  const chatWindow = document.getElementById('chat-window');
  const chatBody = document.getElementById('chatBody');
  const chatIcon = document.getElementById('chatIcon');
  let chatOpen = false;

  function toggleChat(){
    chatOpen = !chatOpen;
    chatWindow.classList.toggle('open', chatOpen);
    chatIcon.className = chatOpen ? 'fa-solid fa-xmark' : 'fa-solid fa-comment-dots';
  }

  function addBubble(text, who){
    const b = document.createElement('div');
    b.className = 'chat-bubble ' + who;
    b.textContent = text;
    chatBody.appendChild(b);
    chatBody.scrollTop = chatBody.scrollHeight;
  }

  const botReplies = {
    services: "I offer 3 packages: Landing Page/MVP ($80+), Full MERN Web App ($250+), and AI-Integrated Platform ($500+). Check the Services section for full details!",
    pricing: "Pricing starts at $80 for a basic landing page and scales based on complexity. Want a custom quote? Use the contact form or WhatsApp button below.",
    contact: "You can reach Ahmed via the contact form, email, or WhatsApp — all linked in the Contact section. He usually replies within a few hours."
  };

  function quickReply(key){
    const labels = {services:'View services', pricing:'Pricing', contact:'Contact Ahmed'};
    addBubble(labels[key], 'user');
    const qr = document.getElementById('quickReplies');
    if (qr) qr.remove();
    setTimeout(() => addBubble(botReplies[key], 'bot'), 500);
  }

  async function sendChat(){
    const input = document.getElementById('chatInput');
    const text = input.value.trim();
    if (!text) return;

    addBubble(text, 'user');
    input.value = '';
    const qr = document.getElementById('quickReplies');
    if (qr) qr.remove();

    try {
      const res = await fetch(`${API_BASE}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text, sessionId: 'visitor-1' })
      });
      const data = await res.json();
      addBubble(data.success ? data.reply : data.error, 'bot');
    } catch (err) {
      addBubble('Sorry, something went wrong connecting to the server. Please try again.', 'bot');
    }
  }
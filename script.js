document.addEventListener('DOMContentLoaded', () => {
  const output = document.getElementById('terminalOutput');
  const terminalForm = document.getElementById('terminalForm');
  const terminalInput = document.getElementById('terminalInput');
  const terminalWindow = document.getElementById('terminalWindow');
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');
  const projectDialog = document.getElementById('projectDialog');
  const dialogContent = document.getElementById('dialogContent');
  const dialogClose = document.getElementById('dialogClose');
  const toTop = document.getElementById('toTop');

  const printLine = (text = '', className = '') => {
    const line = document.createElement('p');
    line.className = `terminal-line ${className}`.trim();
    line.textContent = text;
    output.appendChild(line);
    output.scrollTop = output.scrollHeight;
  };

  const printCommand = (command) => printLine(`brady@portfolio:~$ ${command}`, 'command');

  const scrollToSection = (id) => {
    const section = document.getElementById(id);
    if (section) section.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const commandOutput = {
    help: () => [
      ['AVAILABLE COMMANDS', 'success'],
      ['  whoami       display profile information', ''],
      ['  skills       inspect current skills and interests', ''],
      ['  projects     list project files', ''],
      ['  contact      show contact route', ''],
      ['  status       check interface status', ''],
      ['  clear        clear terminal output', 'muted']
    ],
    whoami: () => [
      ['NAME:    Brady Watts', ''],
      ['ROLE:    Cybersecurity student @ ICMS', ''],
      ['FOCUS:   Network security and defensive thinking', ''],
      ['GOAL:    Cybersecurity analyst', 'success'],
      ['NOTE:    Learning, testing, and improving one concept at a time.', 'muted']
    ],
    skills: () => [
      ['NETWORK:  firewalls / network configuration / threat awareness', ''],
      ['WEB:      HTML / CSS / JavaScript / responsive design', ''],
      ['CODE:     C++ / programming logic / debugging', ''],
      ['METHOD:   problem-solving / teamwork / continuous learning', 'success']
    ],
    projects: () => [
      ['PROJECT FILES FOUND: 04', 'success'],
      ['  [NET]  network-security-foundations.md', ''],
      ['  [LAB]  cyber-home-lab.md', ''],
      ['  [WEB]  interactive-portfolio.md', ''],
      ['  [CODE] programming-practice.md', 'muted'],
      ['Use the project cards below to open a file.', 'accent']
    ],
    contact: () => [
      ['SECURE CONTACT ROUTE', 'success'],
      ['email: bwatts26@students.icms.edu.au', ''],
      ['Scroll to the contact section to send a message.', 'muted']
    ],
    status: () => [
      ['PORTFOLIO STATUS', 'success'],
      ['interface: online', ''],
      ['mode: educational / defensive', ''],
      ['live systems accessed: none', 'muted']
    ]
  };

  const runCommand = (rawCommand, shouldScroll = true) => {
    const command = rawCommand.trim().toLowerCase();
    if (!command) return;
    if (shouldScroll) printCommand(command);

    if (command === 'clear') {
      output.innerHTML = '';
      printLine('Terminal cleared. Type help to see available commands.', 'muted');
      return;
    }

    const result = commandOutput[command];
    if (!result) {
      printLine(`command not found: ${command}. Type help for available commands.`, 'error');
      return;
    }
    result().forEach(([text, className]) => printLine(text, className));

    if (command === 'projects') {
      window.setTimeout(() => scrollToSection('projects'), 180);
    }
    if (command === 'contact') {
      window.setTimeout(() => scrollToSection('contact'), 180);
    }
  };

  const bootLines = [
    ['initialising brady.sec interface...', 'muted'],
    ['loading profile.json .................. OK', ''],
    ['loading project files .................. 04 FOUND', ''],
    ['access policy: educational / defensive', 'success'],
    ['', ''],
    ["Welcome. Type 'help' to inspect the portfolio.", 'accent']
  ];
  bootLines.forEach(([text, className], index) => {
    window.setTimeout(() => printLine(text, className), 180 + (index * 115));
  });

  const commandHistory = [];
  let historyIndex = -1;
  terminalForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const command = terminalInput.value.trim();
    if (!command) return;
    commandHistory.unshift(command);
    historyIndex = -1;
    runCommand(command);
    terminalInput.value = '';
  });

  terminalInput.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowUp') {
      event.preventDefault();
      if (historyIndex < commandHistory.length - 1) historyIndex += 1;
      terminalInput.value = commandHistory[historyIndex] || '';
    }
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      if (historyIndex > 0) historyIndex -= 1;
      else historyIndex = -1;
      terminalInput.value = historyIndex === -1 ? '' : commandHistory[historyIndex];
    }
  });

  document.querySelectorAll('[data-command]').forEach((button) => {
    button.addEventListener('click', () => {
      const command = button.dataset.command;
      terminalWindow.scrollIntoView({ behavior: 'smooth', block: 'center' });
      window.setTimeout(() => {
        runCommand(command);
        terminalInput.focus();
      }, 250);
    });
  });

  document.addEventListener('keydown', (event) => {
    const activeTag = document.activeElement?.tagName;
    if (event.key === '/' && !['INPUT', 'TEXTAREA'].includes(activeTag) && !projectDialog.open) {
      event.preventDefault();
      terminalWindow.scrollIntoView({ behavior: 'smooth', block: 'center' });
      window.setTimeout(() => terminalInput.focus(), 250);
    }
  });

  navToggle.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', String(isOpen));
    navToggle.setAttribute('aria-label', isOpen ? 'Close navigation' : 'Open navigation');
  });
  navLinks.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
    navToggle.setAttribute('aria-label', 'Open navigation');
  }));

  const projectDetails = {
    'network-security': {
      file: 'projects/network-security-foundations.md',
      title: 'Network Security Foundations',
      description: 'A learning project focused on the principles used to protect networked systems. The aim is to connect theory with practical security thinking rather than present unfinished learning as professional experience.',
      items: [
        ['focus', 'firewall principles, network configuration, and threat awareness'],
        ['learning outcome', 'understanding how traffic can be filtered, observed, and managed'],
        ['status', 'actively developing through cybersecurity study']
      ]
    },
    'home-lab': {
      file: 'projects/cyber-home-lab.md',
      title: 'Cyber Home Lab',
      description: 'A self-directed practice environment where I explore security ideas in a controlled setting. It gives me a place to test concepts, observe outcomes, and think about defensive responses.',
      items: [
        ['focus', 'controlled experimentation and defensive response'],
        ['method', 'simulate, observe, document, and improve'],
        ['status', 'in progress']
      ]
    },
    portfolio: {
      file: 'projects/interactive-portfolio.md',
      title: 'Interactive Portfolio Interface',
      description: 'This responsive portfolio demonstrates how I can combine semantic HTML, CSS layout, and JavaScript to communicate technical interests through an accessible interface.',
      items: [
        ['front end', 'HTML, CSS, responsive layout, and visual hierarchy'],
        ['interaction', 'terminal commands, project filters, modal files, and network nodes'],
        ['status', 'complete for current assessment version']
      ]
    },
    programming: {
      file: 'projects/programming-practice.md',
      title: 'Programming Practice',
      description: 'A collection of small exercises and experiments in C++ and JavaScript. The purpose is to strengthen programming logic, debugging habits, and confidence with solving technical problems.',
      items: [
        ['languages', 'C++ and JavaScript'],
        ['practice', 'logic, functions, iteration, and debugging'],
        ['status', 'ongoing']
      ]
    }
  };

  const openProject = (key) => {
    const project = projectDetails[key];
    if (!project) return;
    const list = project.items.map(([label, value]) => `<div><strong>${label}:</strong> ${value}</div>`).join('');
    dialogContent.innerHTML = `
      <span class="dialog-file">${project.file}</span>
      <h2 id="dialogTitle">${project.title}</h2>
      <p>${project.description}</p>
      <div class="dialog-list">${list}</div>
    `;
    if (typeof projectDialog.showModal === 'function') projectDialog.showModal();
    else projectDialog.setAttribute('open', '');
  };

  document.querySelectorAll('[data-project]').forEach((button) => {
    button.addEventListener('click', () => openProject(button.dataset.project));
  });
  dialogClose.addEventListener('click', () => projectDialog.close());
  projectDialog.addEventListener('click', (event) => {
    if (event.target === projectDialog) projectDialog.close();
  });

  const filterButtons = document.querySelectorAll('[data-filter]');
  const projectCards = document.querySelectorAll('.project-card');
  filterButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const filter = button.dataset.filter;
      filterButtons.forEach((item) => {
        item.classList.toggle('active', item === button);
        item.setAttribute('aria-pressed', String(item === button));
      });
      projectCards.forEach((card) => {
        const visible = filter === 'all' || card.dataset.category === filter;
        card.classList.toggle('is-hidden', !visible);
      });
    });
  });

  const nodeDetails = {
    internet: ['NODE // INTERNET', 'Public traffic', 'This is the external side of the system. Traffic enters from untrusted networks and should be treated carefully before it reaches an internal service.', 'MONITORED'],
    firewall: ['NODE // FIREWALL', 'Traffic checkpoint', 'A firewall applies rules to decide which network traffic is allowed, blocked, or sent for further inspection. The rules should be deliberate and regularly reviewed.', 'FILTERING'],
    server: ['NODE // WEB SERVER', 'Protected service', 'The server provides a service to users. Secure configuration, patching, access control, and input handling all help reduce its attack surface.', 'HARDENED'],
    logs: ['NODE // SECURITY LOGS', 'Evidence trail', 'Logs record useful events such as access attempts and errors. Reviewing them can help identify unusual activity and support a response.', 'OBSERVING']
  };
  const nodePanel = document.getElementById('nodePanel');
  document.querySelectorAll('[data-node]').forEach((button) => {
    button.addEventListener('click', () => {
      const details = nodeDetails[button.dataset.node];
      document.querySelectorAll('[data-node]').forEach((node) => {
        const active = node === button;
        node.classList.toggle('active', active);
        node.setAttribute('aria-pressed', String(active));
      });
      nodePanel.innerHTML = `
        <p class="panel-kicker">${details[0]}</p>
        <h3>${details[1]}</h3>
        <p>${details[2]}</p>
        <div class="panel-data"><span>signal</span><strong>${details[3]}</strong></div>
      `;
    });
  });

  const contactForm = document.getElementById('contactForm');
  const formMessage = document.getElementById('formMessage');
  const setFieldState = (field, valid) => {
    const wrapper = field.closest('.field');
    wrapper.classList.toggle('has-error', !valid);
    field.setAttribute('aria-invalid', String(!valid));
  };
  contactForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const name = document.getElementById('visitorName');
    const email = document.getElementById('visitorEmail');
    const message = document.getElementById('visitorMessage');
    const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim());
    const validName = name.value.trim().length > 1;
    const validMessage = message.value.trim().length > 5;
    setFieldState(name, validName);
    setFieldState(email, emailValid);
    setFieldState(message, validMessage);
    if (!validName || !emailValid || !validMessage) {
      formMessage.hidden = true;
      return;
    }
    formMessage.textContent = 'MESSAGE VALIDATED // This static demo did not transmit data. Connect a backend or form service to enable sending.';
    formMessage.hidden = false;
    contactForm.reset();
    [name, email, message].forEach((field) => field.setAttribute('aria-invalid', 'false'));
  });

  const revealItems = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries, instance) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          instance.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    revealItems.forEach((item) => observer.observe(item));
  } else {
    revealItems.forEach((item) => item.classList.add('revealed'));
  }

  window.addEventListener('scroll', () => {
    toTop.classList.toggle('visible', window.scrollY > 600);
  }, { passive: true });
  toTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
});

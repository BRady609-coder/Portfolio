document.addEventListener("DOMContentLoaded", function () {
  var year = document.getElementById("currentYear");
  if (year) year.textContent = "2026";

  var backToTop = document.getElementById("backToTop");
  if (backToTop) {
    window.addEventListener("scroll", function () {
      backToTop.classList.toggle("show", window.scrollY > 400);
    });
    backToTop.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  setupFilters();
  setupNetwork();
  setupContactForm();
});

function setupFilters() {
  var buttons = document.querySelectorAll(".filter-button");
  var cols = document.querySelectorAll(".project-col");
  if (!buttons.length || !cols.length) return;

  buttons.forEach(function (button) {
    button.addEventListener("click", function () {
      var filter = button.getAttribute("data-filter") || "all";
      buttons.forEach(function (item) { item.classList.remove("active"); });
      button.classList.add("active");

      cols.forEach(function (col) {
        var category = col.getAttribute("data-category") || "";
        var show = filter === "all" || category === filter;
        col.classList.toggle("is-hidden", !show);
      });
    });
  });
}

function setupNetwork() {
  var nodes = document.querySelectorAll(".network-node");
  var title = document.getElementById("nodeTitle");
  var text = document.getElementById("nodeText");
  if (!nodes.length || !title || !text) return;

  var data = {
    internet: {
      title: "Internet",
      text: "External traffic from untrusted networks should be inspected before it reaches internal services."
    },
    firewall: {
      title: "Firewall",
      text: "A firewall filters traffic entering and leaving the network and blocks traffic that does not match a security rule."
    },
    server: {
      title: "Web server",
      text: "The web server hosts the application. Only traffic allowed by the firewall should reach this service."
    },
    logs: {
      title: "Security logs",
      text: "Security logs record traffic and alerts so unusual activity can be reviewed."
    }
  };

  nodes.forEach(function (node) {
    node.addEventListener("click", function () {
      var info = data[node.getAttribute("data-node")];
      if (!info) return;
      nodes.forEach(function (item) { item.classList.remove("active"); });
      node.classList.add("active");
      title.textContent = info.title;
      text.textContent = info.text;
    });
  });
}

function setupContactForm() {
  var form = document.getElementById("contactForm");
  if (!form) return;

  form.addEventListener("submit", function (event) {
    event.preventDefault();
    form.classList.add("was-validated");

    var name = document.getElementById("visitorName");
    var email = document.getElementById("visitorEmail");
    var message = document.getElementById("visitorMessage");
    var status = document.getElementById("formStatus");
    if (!name || !email || !message) return;

    if (!form.checkValidity()) {
      if (status) status.textContent = "Please complete name, email and message.";
      return;
    }

    var subject = encodeURIComponent("Portfolio message from " + name.value.trim());
    var body = encodeURIComponent(
      "Name: " + name.value.trim() + "\nEmail: " + email.value.trim() + "\n\n" + message.value.trim()
    );
    window.location.href = "mailto:bwatts26@students.icms.edu.au?subject=" + subject + "&body=" + body;
    if (status) status.textContent = "Opening your email app...";
  });
}

const $ = id => document.getElementById(id);
    const views = [$("loginView"), $("signupView"), $("dashboardView")];

    function showView(view) {
      views.forEach(item => item.classList.add("hidden"));
      view.classList.remove("hidden");
      clearNotices();
    }

    function clearNotices() {
      ["loginNotice", "signupNotice"].forEach(id => {
        $(id).className = "notice";
        $(id).textContent = "";
      });
    }

    function notify(id, text, type = "error") {
      $(id).textContent = text;
      $(id).className = "notice show " + type;
    }

    function readUsers() {
      try {
        return JSON.parse(localStorage.getItem("mustPortalDemoUsers") || "{}");
      } catch {
        return {};
      }
    }

    document.querySelectorAll("[data-toggle]").forEach(button => {
      button.addEventListener("click", () => {
        const input = $(button.dataset.toggle);
        input.type = input.type === "password" ? "text" : "password";
      });
    });

    $("showSignup").addEventListener("click", () => showView($("signupView")));
    $("backToLogin").addEventListener("click", () => showView($("loginView")));

    $("signupForm").addEventListener("submit", event => {
      event.preventDefault();
      const name = $("fullName").value.trim();
      const email = $("signupEmail").value.trim().toLowerCase();
      const password = $("signupPassword").value;
      const confirmation = $("confirmPassword").value;

      if (password !== confirmation) {
        notify("signupNotice", "The passwords do not match. Please try again.");
        return;
      }

      const users = readUsers();
      if (users[email]) {
        notify("signupNotice", "An account with this email already exists.");
        return;
      }

      // Demonstration only: production accounts must use a secure server and password hashing.
      users[email] = { name, password };

      try {
        localStorage.setItem("mustPortalDemoUsers", JSON.stringify(users));
      } catch {
        notify("signupNotice", "Browser storage is unavailable. Please try another browser.");
        return;
      }

      $("signupForm").reset();
      showView($("loginView"));
      $("loginEmail").value = email;
      notify("loginNotice", "Demo account created! You can now sign in.", "success");
    });

    $("loginForm").addEventListener("submit", event => {
      event.preventDefault();
      const email = $("loginEmail").value.trim().toLowerCase();
      const password = $("loginPassword").value;
      const users = readUsers();

      if (!users[email] || users[email].password !== password) {
        notify("loginNotice", "Account not found or password incorrect. Create an account first or check your details.");
        return;
      }

      $("welcomeText").textContent = "Welcome, " + users[email].name + ". This is your student application dashboard.";
      showView($("dashboardView"));
    });

    $("signOut").addEventListener("click", () => {
      $("loginPassword").value = "";
      showView($("loginView"));
    });

    $("forgotButton").addEventListener("click", () => {
      notify("loginNotice", "Password recovery is a design demonstration. A real portal needs a secure password-reset process.", "success");
    });

    $("howApply").addEventListener("click", () => {
      notify("loginNotice", "Create an account, sign in, complete the application form, and submit the required documents. This prototype does not submit real applications.", "success");
    });
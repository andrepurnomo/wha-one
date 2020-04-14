// Install service worker
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("https://andrepurnomo.github.io/wha-one/service-worker.js")
      .then((reg) => {
        console.log("Service worker registered.", reg);
      });
  });
  document.getElementById("serviceInfo").style.display = "none";
} else {
  document.getElementById("installButton").style.display = "none";
}
// run for init
isSupportLocalStorage();

function isSupportLocalStorage() {
  // Check browser support for localstorage
  if (typeof Storage == "undefined")
    document.getElementById("historyButton").style.display = "none";

  return typeof Storage !== "undefined" ? true : false;
}

function chatButton() {
  name = document.getElementById("name").value;
  cc = document.getElementById("cc").value;
  tel = document.getElementById("tel").value;

  if (cc == "") alert("Please insert country code, eg: 62.");
  if (tel == "") alert("Please insert phone number.");

  if (cc != "" && tel != "") {
    createHistory(cc, tel, name);
    // alert(cc + tel);

    window.location.href = "https://wa.me/" + cc + tel;
    return false;
  }
}

function getDomHistoryCard(index, name, cc, tel) {
  return `<div class="card" id="history#${index}">
            <header class="card-header">
              <p class="card-header-title">
                ${name}
              </p>
              <i class="card-header-icon" aria-label="more options">
                ${cc.toString() + tel.toString()}
              </i>
            </header>
            <footer class="card-footer">
              <a
                href="#"
                class="card-footer-item"
                style="background-color: #00d1b2; color: white;"
                onclick="chatHistory(${cc}, ${tel})"
                >Chat</a
              >
              <a
                href="#"
                class="card-footer-item"
                style="background-color: #f14668; color: white;"
                onclick="deleteHistory(${index}, ${cc}, ${tel})"
                >Delete</a
              >
            </footer>
          </div>`;
}

function getHistories() {
  if (isSupportLocalStorage()) {
    return JSON.parse(localStorage.histories || "[]");
  }
}

function createHistory(cc, tel, name = "") {
  if (isSupportLocalStorage()) {
    if (name == "") name = cc.toString() + tel.toString();

    histories = getHistories();

    duplicated = histories.filter(function (data) {
      return data.cc == cc && data.tel == tel;
    });

    if (duplicated.length == 0)
      histories.push({ name: name, cc: cc, tel: tel });
    else {
      deleteHistory(1, cc, tel, false);
      histories.push({ name: name, cc: cc, tel: tel });
    }

    localStorage.histories = JSON.stringify(histories);
  }
}

function deleteHistory(index, cc, tel, removeDom = true) {
  if (isSupportLocalStorage()) {
    histories = getHistories();

    histories = histories.filter(function (data) {
      return data.cc != cc && data.tel != tel;
    });

    localStorage.histories = JSON.stringify(histories);
    if (removeDom) removeDomHistory(index);
  }
}

function removeDomHistory(index) {
  parent = document.getElementById("historyContainer");
  child = document.getElementById("history#" + index);
  parent.removeChild(child);
}

function renderHistory() {
  if (isSupportLocalStorage()) {
    histories = getHistories();
    for (var i = 0; i < histories.length; i++) {
      historyOne = histories[i];
      document.getElementById(
        "historyContainer"
      ).innerHTML += getDomHistoryCard(
        i,
        historyOne.name,
        historyOne.cc,
        historyOne.tel
      );
    }
  }
}

function chatHistory(cc, tel) {
  // alert(cc.toString() + tel.toString());

  window.location.href = "https://wa.me/" + cc + tel;
  return false;
}

// FOR HOME SCREEN
let deferredPrompt;

window.addEventListener("beforeinstallprompt", (e) => {
  // Prevent the mini-infobar from appearing on mobile
  e.preventDefault();
  // Stash the event so it can be triggered later.
  deferredPrompt = e;
  // Update UI notify the user they can install the PWA
  // showInstallPromotion();
});

document.getElementById("installButton").addEventListener("click", (e) => {
  // Hide the app provided install promotion
  // hideMyInstallPromotion();
  // Show the install prompt
  deferredPrompt.prompt();
  // Wait for the user to respond to the prompt
  deferredPrompt.userChoice.then((choiceResult) => {
    if (choiceResult.outcome === "accepted") {
      console.log("User accepted the install prompt");
    } else {
      console.log("User dismissed the install prompt");
    }
  });
});

window.addEventListener("load", () => {
  let params = new URL(document.location).searchParams;
  if (navigator.standalone) {
    document.getElementById("installButton").style.display = "none";
    console.log("Launched: Installed (iOS)");
  } else if (params.get("user_mode") == "app") {
    document.getElementById("installButton").style.display = "none";
    console.log("Launched: Installed (Android)");
  } else if (matchMedia("(display-mode: standalone)").matches) {
    document.getElementById("installButton").style.display = "none";
    console.log("Launched: Installed");
  } else {
    console.log("Launched: Browser Tab");
  }
});

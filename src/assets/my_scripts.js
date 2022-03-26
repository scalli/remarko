function headerToggleShow() {
    var x = document.getElementById("demo");
    if (x.className.indexOf("w3-show") == -1) {
      x.className += " w3-show";
    } else { 
      x.className = x.className.replace(" w3-show", "");
    }
  }
  function logout(){
  alert("you are logged out");
  }
  
  function userDropdown() {
    var x = document.getElementById("userDropdown");
    if (x.className.indexOf("w3-show") == -1) {
      x.className += " w3-show";
    } else { 
      x.className = x.className.replace(" w3-show", "");
    }
  }

  function closeUserDropdown() {
    var element = document.getElementById("userDropdown");
    element.classList.remove("w3-show");
}

  function settingsDropdown(){
    var x = document.getElementById("settingsDropdown");
    if (x.className.indexOf("w3-show") == -1) {
      x.className += " w3-show";
    } else { 
      x.className = x.className.replace(" w3-show", "");
    }
  }

  function closeSettingsDropdown() {
      var element = document.getElementById("settingsDropdown");
      element.classList.remove("w3-show");
  }

  function openFilter(id) {
    var x = document.getElementById(id);
    if (x.className.indexOf("w3-show") == -1) {
      x.className += " w3-show";
    } else { 
      x.className = x.className.replace(" w3-show", "");
    }
  }
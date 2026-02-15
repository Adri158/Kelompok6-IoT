const ESP32_IP = "192.168.18.132"; // ganti sesuai IP ESP32

document.body.classList.add("light");

function toggleTheme(){
  let body = document.body;
  let icon = document.getElementById("themeIcon");
  if(body.classList.contains("light")){
    body.classList.remove("light");
    body.classList.add("dark");
    icon.innerHTML="☀";
  } else {
    body.classList.remove("dark");
    body.classList.add("light");
    icon.innerHTML="🌙";
  }
}

// Hamburger menu
function toggleMenu(){
  document.getElementById("sidebar").classList.toggle("active");
  document.getElementById("overlay").classList.toggle("active");
}

// Section menu
function showSection(section){
  document.getElementById("dashboard").style.display = "none";
  document.getElementById("proses").style.display = "none";
  document.getElementById("tentang").style.display = "none";
  document.getElementById(section).style.display = "block";
  toggleMenu(); // otomatis tutup sidebar
}

// Tombol Pompa
document.getElementById("pumpBtn").addEventListener("click", ()=>{
  fetch(`http://${ESP32_IP}/togglePump`, { method:"POST" })
    .then(res=>res.json())
    .then(data=>{
      document.getElementById("relay").innerHTML = data.relay;
    })
    .catch(err=>console.log("ESP32 tidak terkoneksi", err));
});

// Tombol Mode
document.getElementById("modeBtn").addEventListener("click", ()=>{
  fetch(`http://${ESP32_IP}/toggleMode`, { method:"POST" })
    .then(res=>res.json())
    .then(data=>{
      document.getElementById("mode").innerHTML = data.mode;
    })
    .catch(err=>console.log("ESP32 tidak terkoneksi", err));
});

/* ===== REALTIME UPDATE ===== */
function updateData(){
  fetch(`http://${ESP32_IP}/data`)
    .then(res=>res.json())
    .then(data=>{
      
      document.getElementById("tempDHT").innerHTML = data.tempDHT + " °C";
      document.getElementById("tempDS").innerHTML = data.tempDS + " °C";
      document.getElementById("relay").innerHTML = data.relay;
      let pumpBtn = document.getElementById("pumpBtn");

      if(data.relay === "Aktif"){
      pumpBtn.innerHTML = "ON";
      pumpBtn.classList.remove("off");
      pumpBtn.classList.add("on");
      }else{
      pumpBtn.innerHTML = "OFF";
      pumpBtn.classList.remove("on");
      pumpBtn.classList.add("off");
    }

      document.getElementById("mode").innerHTML = data.mode;
      let modeBtn = document.getElementById("modeBtn");

      if(data.mode === "Otomatis"){
      modeBtn.innerHTML = "Auto";
      modeBtn.classList.remove("manual");
      modeBtn.classList.add("auto");
      }else{
      modeBtn.innerHTML = "Manual";
      modeBtn.classList.remove("auto");
      modeBtn.classList.add("manual");
    }

      // Soil indicator
      let soilEl = document.getElementById("soil");
      let soilFill = soilEl;
      soilFill.style.width = data.soil + "%";
      soilFill.innerHTML = data.soil + " %";

      if(data.soil < 30) soilFill.style.background = "#e74c3c"; // merah
      else if(data.soil < 60) soilFill.style.background = "#f1c40f"; // kuning
      else soilFill.style.background = "#2ecc71"; // hijau

      const statusEl = document.getElementById("espStatus");
      statusEl.innerHTML = "ONLINE";
      statusEl.style.backgroundColor = "green";
    })
    .catch(err => {
      // kalau fetch gagal, anggap ESP32 OFF
      const statusEl = document.getElementById("espStatus");
      statusEl.innerHTML = "OFFLINE";
      statusEl.style.backgroundColor = "red";
      console.log("ESP32 tidak terhubung:", err);
    });
}

setInterval(updateData,100);
updateData();
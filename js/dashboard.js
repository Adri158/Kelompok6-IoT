fetch("https://kelompok-6---iot-default-rtdb.asia-southeast1.firebasedatabase.app/sensor.json")


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

  fetch("https://kelompok-6---iot-default-rtdb.asia-southeast1.firebasedatabase.app/status/relay.json")
    .then(res => res.json())
    .then(current => {

      let newValue = current == 1 ? 0 : 1;

      fetch("https://kelompok-6---iot-default-rtdb.asia-southeast1.firebasedatabase.app/status/relay.json", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newValue)
      });

    });

});

// Tombol Mode
document.getElementById("modeBtn").addEventListener("click", ()=>{

  fetch("https://kelompok-6---iot-default-rtdb.asia-southeast1.firebasedatabase.app/status/mode.json")
    .then(res => res.json())
    .then(current => {

      let newValue = current == 1 ? 0 : 1;

      fetch("https://kelompok-6---iot-default-rtdb.asia-southeast1.firebasedatabase.app/status/mode.json", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newValue)
      });

    });

});

/* ===== REALTIME UPDATE ===== */
function updateData(){
  fetch("https://kelompok-6---iot-default-rtdb.asia-southeast1.firebasedatabase.app/.json")
    .then(res => res.json())
    .then(data => {

      let sensor = data.sensor;
      let status = data.status;

      document.getElementById("tempDHT").innerHTML = sensor.tempDHT + " °C";
      document.getElementById("tempDS").innerHTML = sensor.tempDS + " °C";

      document.getElementById("relay").innerHTML = status.relay ? "Aktif" : "Tidak Aktif";
      document.getElementById("mode").innerHTML = status.mode ? "Otomatis" : "Manual";

      // Tombol Pompa
      let pumpBtn = document.getElementById("pumpBtn");
      if(status.relay == 1){
        pumpBtn.innerHTML = "ON";
        pumpBtn.className = "on";
      } else {
        pumpBtn.innerHTML = "OFF";
        pumpBtn.className = "off";
      }

      // Tombol Mode
      let modeBtn = document.getElementById("modeBtn");
      if(status.mode == 1){
        modeBtn.innerHTML = "Auto";
        modeBtn.className = "auto";
      } else {
        modeBtn.innerHTML = "Manual";
        modeBtn.className = "manual";
      }

      if(status.mode == 1){
        document.getElementById("pumpBtn").disabled = true;
        document.getElementById("pumpBtn").style.opacity = "0.5";
      } else {
        document.getElementById("pumpBtn").disabled = false;
        document.getElementById("pumpBtn").style.opacity = "1";
      }


      // Soil indicator
      let soilFill = document.getElementById("soil");
      soilFill.style.width = sensor.soil + "%";
      soilFill.innerHTML = sensor.soil + " %";

      if(sensor.soil < 30) soilFill.style.background = "#e74c3c";
      else if(sensor.soil < 60) soilFill.style.background = "#f1c40f";
      else soilFill.style.background = "#2ecc71";

      document.getElementById("espStatus").innerHTML = "ONLINE";
      document.getElementById("espStatus").style.backgroundColor = "green";

    })
    .catch(err => {
      document.getElementById("espStatus").innerHTML = "OFFLINE";
      document.getElementById("espStatus").style.backgroundColor = "red";
      console.log("Firebase error:", err);
    });
}

setInterval(updateData,100);
updateData();
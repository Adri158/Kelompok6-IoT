const ESP32_IP = "192.168.18.132"; // ganti sesuai IP ESP32

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

function updateData(){
  fetch(`http://${ESP32_IP}/data`)
    .then(res=>res.json())
    .then(data=>{

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
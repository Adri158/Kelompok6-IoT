// =============================
// MQTT CONFIG
// =============================
const broker = "ws://103.160.62.201:9001";
const client = mqtt.connect(broker);

const pumpBtn = document.getElementById("pumpBtn");
const modeBtn = document.getElementById("modeBtn");
const espStatusEl = document.getElementById("espStatus");

let relayState = 0;
let autoMode = 1;
let deviceOnline = false;

// =============================
// CONNECT
// =============================
client.on("connect", () => {

  console.log("MQTT Connected");

  client.subscribe("smartgarden/status/relay");
  client.subscribe("smartgarden/status/mode");
  client.subscribe("smartgarden/sensor/dht");
  client.subscribe("smartgarden/sensor/ds18b20");
  client.subscribe("smartgarden/sensor/soil");
  client.subscribe("smartgarden/status/online");
});

// =============================
// MESSAGE HANDLER
// =============================
client.on("message", (topic, message) => {

  const msg = message.toString();

  // ===== STATUS =====
  if(topic === "smartgarden/status/relay"){
    relayState = msg === "ON" ? 1 : 0;
    updateRelayUI();
  }

  if(topic === "smartgarden/status/mode"){
    autoMode = msg === "AUTO" ? 1 : 0;
    updateModeUI();
  }

  // ===== SENSOR =====
  if(topic === "smartgarden/sensor/dht"){
    document.getElementById("tempDHT").innerHTML =
      msg + " °C";
  }

  if(topic === "smartgarden/sensor/ds18b20"){
    document.getElementById("tempDS").innerHTML =
      msg + " °C";
  }

  if(topic === "smartgarden/sensor/soil"){

    const soil = parseInt(msg);
    const soilFill = document.getElementById("soil");

    soilFill.style.width = soil + "%";
    soilFill.innerHTML = soil + " %";

    if(soil < 30) soilFill.style.background = "#e74c3c";
    else if(soil < 50) soilFill.style.background = "#f1c40f";
    else soilFill.style.background = "#2ecc71";
  }

  if(topic === "smartgarden/status/online"){
    if(msg === "ONLINE") setOnline();
    else setOffline();
  }
});

client.on("offline", setOffline);
client.on("error", setOffline);

// =============================
// BUTTON CONTROL
// =============================
pumpBtn.addEventListener("click", () => {

  if(!deviceOnline) return;
  if(autoMode === 1) return;

  const newState = relayState === 1 ? "OFF" : "ON";
  client.publish("smartgarden/control/relay", newState);
});

modeBtn.addEventListener("click", () => {

  if(!deviceOnline) return;

  const newMode = autoMode === 1 ? "MANUAL" : "AUTO";
  client.publish("smartgarden/control/mode", newMode);
});

// =============================
// UI UPDATE
// =============================
function updateRelayUI(){

  pumpBtn.className = "pump-btn " + (relayState ? "on" : "off");
  pumpBtn.innerHTML = relayState ? "ON" : "OFF";

  // 🔥 update card atas
  document.getElementById("relay").innerHTML =
    relayState ? "Aktif" : "Tidak Aktif";
}

function updateModeUI(){

  modeBtn.className = "mode-btn " + (autoMode ? "auto" : "manual");
  modeBtn.innerHTML = autoMode ? "Auto" : "Manual";

  pumpBtn.disabled = autoMode === 1;

  // 🔥 update card atas
  document.getElementById("mode").innerHTML =
    autoMode ? "Otomatis" : "Manual";
}

// =============================
// ONLINE STATUS
// =============================
function setOnline(){
  deviceOnline = true;

  espStatusEl.innerHTML = "ONLINE";
  espStatusEl.style.backgroundColor = "green";

  pumpBtn.disabled = autoMode === 1;
  modeBtn.disabled = false;
}

function setOffline(){
  deviceOnline = false;

  espStatusEl.innerHTML = "OFFLINE";
  espStatusEl.style.backgroundColor = "red";

  // reset tampilan atas
  document.getElementById("relay").innerHTML = "--";
  document.getElementById("mode").innerHTML = "--";

  document.getElementById("tempDHT").innerHTML = "-- °C";
  document.getElementById("tempDS").innerHTML = "-- °C";

  const soilFill = document.getElementById("soil");
  soilFill.style.width = "0%";
  soilFill.innerHTML = "   --";

  // disable tombol
  pumpBtn.disabled = true;
  modeBtn.disabled = true;
}
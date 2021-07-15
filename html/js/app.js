alt.on("speedometer:init", (data) => {
  let color = data.color;
  document.getElementById("container").style.color =
    "rgb(" + color.r + "," + color.g + "," + color.b;
});
alt.on("speedometer:data", (data) => {
  let speed = data.speed;
  let gear = data.gear;
  let fuel = data.fuel;
  let rpm = data.rpm;
  let engineHealth = data.engineHealth;
  let lightState = data.lightState;
  let highBeamState = data.highBeamState;

  if (engineHealth < 500) {
    document.getElementById("engineIcon").style.visibility = "visible";
  } else {
    document.getElementById("engineIcon").style.visibility = "hidden";
  }
  document.getElementById("speedValue").style.height = speed + "px";
  document.getElementById("fuelMeter").value = fuel;
  document.getElementById("rpmMeter").value = rpm;
  document.getElementById("speedText").innerHTML = speed;
  document.getElementById("gearText").innerHTML = gear;
  if (lightState || highBeamState) {
    document.getElementById("lightIcon").style.visibility = "visible";
    document.getElementById("lightIcon").style.color = "green";
    if (highBeamState) {
      document.getElementById("lightIcon").style.color = "blue";
    }
  } else {
    document.getElementById("lightIcon").style.visibility = "hidden";
  }
});

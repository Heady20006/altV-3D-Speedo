import * as alt from "alt-client";
import * as game from "natives";

let speedoObject;
let view = null;

alt.onServer("speedometer:hide", () => {
  if (speedoObject !== null) {
    game.deleteObject(speedoObject);
    if (view !== null) {
      view.destroy();
      view = null;
    }
  }
});

alt.onServer("speedometer:show", () => {
  showWebviewSpeedo(alt.Player.local.vehicle);
});

alt.everyTick(() => {
  if (view === null) return;
  let vehicle = alt.Player.local.vehicle;
  if (vehicle === null) return;
  let vehicleColor = game.getVehicleCustomPrimaryColour(vehicle);
  view.emit("speedometer:init", {
    color: {
      r: vehicleColor[1],
      g: vehicleColor[2],
      b: vehicleColor[3],
    },
  });
  let engineHealth = game.getVehicleEngineHealth(vehicle.scriptID);
  let vehicleFuel = vehicle.getSyncedMeta("FUEL");
  let vehicleLights = game.getVehicleLightsState(vehicle.scriptID, null, null);
  let vehicleLightState = vehicleLights[1];
  let vehicleHighBeamState = vehicleLights[2];
  view.emit("speedometer:data", {
    speed: parseInt((game.getEntitySpeed(vehicle.scriptID) * 3.6).toFixed(0)),
    gear: vehicle.gear,
    fuel: parseInt(vehicleFuel),
    rpm: vehicle.rpm * 10000,
    engineHealth: parseInt(engineHealth),
    lightState: vehicleLightState,
    highBeamState: vehicleHighBeamState,
  });
});

function showWebviewSpeedo(vehicle) {
  let speedoModel = "prop_tv_flat_01_screen";
  let modelHash = game.getHashKey(speedoModel);
  let speedoTexture = "script_rt_tvscreen";
  requestObjectModel(modelHash).then((succ) => {
    if (succ) {
      speedoObject = game.createObjectNoOffset(
        game.getHashKey(speedoModel),
        vehicle.pos.x,
        vehicle.pos.y,
        vehicle.pos.z,
        true,
        false,
        false
      );
      game.setEntityAlpha(speedoObject, 240, false);
      game.attachEntityToEntity(
        speedoObject,
        vehicle,
        game.getEntityBoneIndexByName(vehicle, "door_pside_f"),
        1.25,
        -1,
        0,
        -25,
        0,
        0,
        false,
        false,
        false,
        false,
        0,
        true
      );
      game.setEntityCollision(speedoObject, false, true);
      if (view === null) {
        let inter = alt.setInterval(() => {
          if (alt.isTextureExistInArchetype(modelHash, speedoTexture)) {
            view = new alt.WebView(
              "http://resource/html/speedometer.html",
              modelHash,
              speedoTexture
            );
            alt.clearInterval(inter);
            return;
          }
        }, 5);
      }
    }
  });
}

function requestObjectModel(modelHash) {
  return new Promise((resolve, reject) => {
    game.requestModel(modelHash);
    let inter = alt.setInterval(() => {
      if (game.hasModelLoaded(modelHash)) {
        alt.clearInterval(inter);
        return resolve(true);
      }
    }, 5);
  });
}

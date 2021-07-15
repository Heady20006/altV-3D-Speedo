import * as alt from "alt-server";

alt.on("playerEnteredVehicle", (player, vehicle, seat) => {
  vehicle.setSyncedMeta("FUEL", 50);
  alt.emitClient(player, "speedometer:show", vehicle);
});

alt.on("playerLeftVehicle", (player, vehicle, seat) => {
  alt.emitClient(player, "speedometer:hide", vehicle);
});

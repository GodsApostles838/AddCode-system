import { Player, system, world } from "@minecraft/server";
import { ActionFormData, ModalFormData } from "@minecraft/server-ui";
import { hasBadWords } from "./Functions.js";
import { Database } from "./database.js";
import { commandDatabase } from './CustomCommands.js';

function Addbounty(player) {
    const players = [...world.getPlayers()];
    new ModalFormData()
      .title(`[ Add Bounty]`)
      .dropdown(`Choose a player`, players.map(player => player.name))
      .show(player)
}


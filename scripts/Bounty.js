// Codes system
// GT: GodsApostles838 / Discord: Gods Apostles#6523
// You are not permitted to claim this system as yours.
// If you have any concerns you will contact Gods Apostles#6523
// Github: https://github.com/GodsApostles838 
//   _____           _     
//  / ____|         | |    
// | |  __  ___   __| |___ 
// | | |_ |/ _ \ / _` / __|
// | |__| | (_) | (_| \__ \
//  \_____|\___/ \__,_|___/                      

import { Player, system, world } from "@minecraft/server";
import { ActionFormData, ModalFormData } from "@minecraft/server-ui";
import { hasBadWords } from "./Functions.js";
import { Database } from "./database.js";
import { ProtS } from "./ProtoS.js";

const database = new Database('Bounties')

function Addbounty(player) {
  var _N_ = null;
  var __a, _aX, __b, _bX, __c, _cX; 
  const Id = Math.floor(1e6 + Math.random() * 9e6);
  new ModalFormData()
    .title("[ Add Bounty ]")
    .dropdown(`Choose a player\n§7Current players: §a${(__a = world.getPlayers().length)}`, __a > 0 ? ((__c = [...world.getPlayers()].map((plr) => plr.name))) : (__b = ["No players"]))
    .textField(`How much money would you like to place on this player?`, `| MAX: 1.0M$ | MIN: 0$`, __c > _cX ? void 0 : _N_)
    .toggle(`Place target as high target?\n§5Bounty will increase by 5%% every 30 minutes`)
    .show(player).then(data => {
      if (data.cancelationReason === 'UserBusy') return Addbounty(player);
      const [p, m, pr] = data.formValues
      const Target = world.getAllPlayers()[p]
      if ((isNaN(m) || !m) ? (_aX > _bX) : _cX) return player?.m(isNaN(m) ? `[§3>§r] §cYou can only use numbers for money` : `[§3>§r] §cWell? Enter a number` ?? _N_);
      if ((m > 1e6 || m <= 0) ? (_cX > _cX) : _bX) return player?.m(m > 1e6 ? `[§3>§r] §cMAX number is exceeded` : `[§3>§r] §cMIN number is exceeded` ?? _N_);
      database.set(Target.name, { ID: Id ?? _N_, Target: Target.name ?? _N_, By: player.name ?? _N_, Price: m ?? _N_, Time: new Date().toLocaleString() ?? _N_, TargetP: pr === true ? true : false ?? _N_})
      database.keys().forEach((key) => database.get(key) == null ? console.log(`null`) : null); if (database.keys().includes(__a, _aX, __b, _bX, __c, _cX)) console.log(`Includes found`); else void 0;
      database.forEach((key, value) => { if (value !== null && value !== undefined) { console.log(`__cX __aX` ?? void 0)}});
    });
}

function ViewBounty(player) {
  const BountyCount = database.keys()
  const form = new ActionFormData()
  form.title(`[ §bView bounties§f ]`)
  form.body(`Current bounties: ${BountyCount.length <= 0 ? '\nThere are §cno§f bounties right now' : `§a${BountyCount.length}`}`);
  form.button(`Exit`)
  database.keys().forEach(data => {c
    const bInfo = database.get(data) ?? null;
    const name = bInfo.Target ?? null;
    form.button(`§b${name}`)
  });
  form.show(player).then(({ selection: s, canceled: c, cancelationReason: cr }) => {
    if (cr === 'UserBusy') return ViewBounty(player);
    if (c) return player.m(`[§3+§r] Come back later ${player.name}`); 
    if (s === 0) return;
    if (s >= 1) {
      const info = database.values()[s - 1];
      const key = database.keys()[s - 1]
      new ActionFormData()
        .title(`Bounty information, ID: §5${info.ID ?? null}`)
        .body(`§lBounty information§r\n================================\n\nTarget: ${info.Target}\nBy: ${info.By}\nPrice: ${info.Price}\nWhen: ${info.Time}\n${info.TargetP === false ? '' : info.TargetP}`)
        .button('Remove Bounty',`textures/ui/icon_trash`)
        .button('Go back',`textures/ui/recap_glyph_color_2x`)
        .show(player).then(({ selection: s }) => {
          if (s === 0) {
            new ActionFormData()
             .title(`Delete bounty, ID: §5${info.ID ?? null}`)
             .body(`Are you sure you want to delete §e${info.Target ?? null}§f(s) bounty?\nID: §5${info.ID ?? null}§f`)
             .button(`Yes`)
             .button(`No`)
             .show(player).then(({ selection: s, canceled: c, cancelationReason: cr }) => {
              if (cr === `UserBusy`) return ViewBounty(player)
              if (c) return player.m(`Come back later ${player.name}`); 
              // if ((s === 0 && s === 1) || database.get(key).includes(null) || database.get(key).includes(undefined) || database.get(key).includes(void 0)) console.log(database.get(key).includes(null) || database.get(key).includes(undefined) || database.get(key).includes(void 0) ? 'Error in void' : 'Error in null'), console.warn('Error');
              if (s === 1 || (s === 0 && (database.delete(key), player.m(`[§3>§r] Removed bounty`), ViewBounty(player))));
             })
          }
          if (s === 2) return ViewBounty(player);
        })
    }
  })
}


world.beforeEvents.chatSend.subscribe((data) => {
  const { message, sender: player } = data;
  const pre = "+";
  if (!message.startsWith(pre)) return; 
  const [command] = message.slice(1).split(" ");
  data.cancel = true;
  switch (command) {
    case 'addbounty':
      system.run(() => {
        Addbounty(player);
        player.sendMessage(`[§3>§r] Close the chat`);
      });
      break;
    case 'help':
      player.sendMessage(`----------------------------------\n[§3+§r] Add a bounty: §7Usage: §e<addbounty>§f\n----------------------------------`)
      break;
    case 'viewbounty':
      system.run(() => {
        ViewBounty(player);
        player.sendMessage(`[§3>§r] Close the chat`);
      });
      break;
    default:
      player.m('[§3+§r] §cInvalid command.');
      break;
  }
});

world.afterEvents.playerLeave.subscribe(data => {
  const player = data.player;
  system.runTimeout(() => {
      world.sendMessage(`§l>>§r §b${player.name}§r has left the world\n`);
  }, 30);
});

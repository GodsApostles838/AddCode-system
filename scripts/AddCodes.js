// Codes system
// GT: GodsApostles838 / Discord: Gods Apostles#6523
// You are not permitted to claim this system as yours.
// If you have any concerns will contact Gods Apostles#6523
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

const database = new Database("Codes")
const database2 = new Database("ExpiredCodes")

function Codes(player) {
  new ActionFormData()
    .title(`[ §3Add codes§r ]`)
    .button(`§bAdd new code\n§7Add a new code for players§r`, `textures/ui/color_plus`)
    .button(`§bCodes\n§7View current codes`, `textures/ui/icon_book_writable`)
    .button(`§bExpired codes\n§7View expired codes`, `textures/ui/icon_trash`)
    .show(player)
    .then(({ selection: s, canceled: c, cancelationReason: cl }) => {
      if (c) { player.sendMessage(`Come back later ${player.name}`);
      } else if (!cl) {
        switch (s) {
          case 0: AddCode(player); break;
          case 1: viewCodes(player); break;
          case 2: ExpiredCodes(player); break;
        }
      }
    });
}

function AddCode(player) {
  const colorDropDown = ["§rNormal§r", "§cRed§r", "§bBlue§r", "§eYellow§r", "§6Orange§r", "§5Purple§r"]; 
  const permissionDropDown = ["Everyone", "Admins","Devs","Owners"];
  new ModalFormData()
      .title(`§b[ Add code ]`)
      .dropdown("\nColor §6[optional]§r", colorDropDown)
      .dropdown("\nPermissions §7\n[leave default for everyone]§r", permissionDropDown)
      .textField(`Code title\n§7(3-6 characters)\n§c[Mandatory]§r`,`Title here`).textField(`Code description\n§7(10-20 characters)\n§c[Mandatory]§r`, `Description here:`)
      .textField(`Code name\n§7(5-10 characters)\n§c[Mandatory]§r`, `Name here:`).textField(`How long before it expires\n§c[Mandatory]§r`,`1 - 1 second | 3600 - hour`)
      .textField(`How much money would you like to give to the player?\n§c[Mandatory]§r`,`You can only use numbers`)
      .show(player).then(({ formValues: [ c, p, t, d, n, ex], canceled: cl }) => {
          if (cl) return; const reg = /[!@#$%^&*()_+{}\[\]:;"'<>,.?\\|`~-]/; // Define regEx next to return
          if (hasBadWords(t) || hasBadWords(d) || hasBadWords(n)) return player.sendMessage(`§cYou cannot use those words.\n\n${hasBadWords(t) ? '§rBad - §cTitle' : '§rGood - §aTitle'}\n${hasBadWords(d) ? '§rBad - §cDescription' : '§rGood - §aDescription'}\n${hasBadWords(n) ? '§rBad - §cName' : '§rGood - §aName'}`);
          if (reg.test(t) || reg.test(d)) return player.sendMessage(`§cYou cannot use symbols for ${!n ? "title" : "description"}`); if (!t || !d || !n) return player.sendMessage(`§cfields need to be filled out`); if (isNaN(ex)) return player.sendMessage(`§cYou can only use numbers for expiring`);
          if (t.length < 3 || d.length < 10 || n.length < 5) return player.sendMessage(`§cYou need between ${t.length < 3 ? '3-6' : '10-20'} characters for title and ${n.length < 5 ? '5' : '5-10'} characters for description.`);
          if (database.keys().includes(n)) return player.sendMessage(`§cERROR, already made by another player`); const selectedColor = c === 0 ? "§cNone§r" : ["§r", "§c", "§b", "§e", "§6", "§5"][c]; const selectedPermissions = p === 0 ? "Everyone" : permissionDropDown[p - 1]; const ID = Math.round(Math.random() * 5000) + 1000;
          database.set(n, { Permissions: permissionDropDown[p] ?? null, ID: ID ?? null, Title: t ?? null, Name: n ?? null, Description: d ?? null, Time: new Date().toLocaleString() ?? null, By: player?.name ?? null, Color: colorDropDown[c] ?? null, color: selectedColor ?? null, Expires: ex ?? null, ReActivated: "" ?? null}), startExpirationCountdown(player, n), viewCodes(player);
          world.sendMessage
          (
           `
           §7| §r[§3+§r] §eA new code has been added to the game!§r
           §7|
           §7| §rTitle: §3${t}§r
           §7|
           §7| §rDescription: §a${d}§r
           §7|
           §7| §rCode: Redeem it now! §3${n}§r
           §7|
           §7| §rThis is for §e${permissionDropDown[p]}
           `
           )
      });
}

const pre = "-";
world.beforeEvents.chatSend.subscribe((data) => {
    const codeKeys = database.keys();
    const { message, sender: player } = data;
    if (!message.startsWith(pre)) return;
    const [command, code] = message.slice(1).split(" ");
    data.cancel = true;
    switch (command) {
        case 'help':
            player.sendMessage(`------------------------\n[§3+§r] Redeem a code: §7Usage: -redeem §3<CODE>§r\n------------------------`);
            break;
        case 'redeem':
            if (!code) {
                player.sendMessage('[§3+§r] Please provide a code to redeem. §7Usage: -redeem §3<CODE>');
                break;
            }
            const normalizedCode = code.toLowerCase();
            const codeEntry = database.get(normalizedCode);
            if (codeEntry) {
                if (codeEntry.RedeemedBy && codeEntry.RedeemedBy.includes(player.name)) {
                    player.sendMessage(`[§3+§r] You've already redeemed this code`);
                } else if (database2.get(key)) {
                    player.sendMessage(`[§3+§r] This code is expired.`);
                } else if (!player.hasTag(codeEntry.Permissions) && codeEntry.Permissions !== "Everyone") {
                    player.sendMessage("[§3+§r] §cYou don't have the permissions to redeem this code");
                } else {
                    player.sendMessage('[§3+§r] §aCode successfully redeemed!');
                    if (!codeEntry.RedeemedBy) codeEntry.RedeemedBy = [];
                    codeEntry.RedeemedBy.push(player.name);
                    database.set(key, codeEntry);
                }
            } else {
                player.sendMessage('[§3+§r] §cIncorrect code');
            }
            break;
        default:
            player.sendMessage('[§3+§r] §cInvalid command.');
            break;
    }
});

function viewCodes(player) {
  const form = new ActionFormData()
  const codeCount = database.length;
  form.title(`§b[ View codes ]`)
  form.body(`There ${codeCount === 0 ? "are §cno§f codes" : codeCount === 1 ? "is §b1§r code" : `are §b${codeCount}§r codes`} in the database.`);
  form.button(`Go back`)
  database.keys().forEach(data => {
    const codeInfo = database.get(data) ?? null;
    const title = codeInfo ? codeInfo.Title : player.sendMessage("§c[Title not available]");
    form.button(`§b${title}`,`textures/items/paper`)
  });
  form.show(player).then(({ selection: s, canceled: c }) => {
    if (c) return player.sendMessage(`Come back later ${player.name}`)
    if (s === 0) return Codes(player)
    if (s >= 1) {
      const info = database.values()[s - 1];
      const key = database.keys()[s - 1]
      new ActionFormData()
        .title(`Code information, ID: §5${info?.ID ?? null}`)
        .body(`§lCode Info§r\n================================\n\nID: §5${info?.ID ?? null}§r\nCode title: §e${info.Title}§r\nCode Description: §b${info.Description}§r\nCode name: §a${info.Name}§r\nPermissions: §3${info.Permissions}§r\nMade by: §6${info.By}§r\nAt: §e${info.Time}§r\nItems: ${info.Item}\nColor: ${info.Color}${info.Expires || info.ReActivated || info.ExpiredAt ? `\nExpires in: §3${formatTime(info.Expires)}§r` : ''}${info.ReActivated ? `\nRe-A at: §3${info.ReActivated}§r` : ''}${info.ExpiredAt ? `\nExpired at: §3${info.ExpiredAt}§r` : ''}`)
        .button('Remove code',`textures/ui/book_trash_default`)
        .button(`Expire code`,`textures/ui/player_offline_icon`)
        .button('Go back',`textures/ui/recap_glyph_color_2x`)
        .show(player).then(({ selection: s }) => {
          if (s === 0) return database.delete(key), player.sendMessage(`§aRemoved the code form the database`), viewCodes(player);
          if (s === 1) return player.sendMessage(`§6Expired the code from the database`), database2.set(key, { ...(database.get(key)), ExpiredAt: new Date().toLocaleString() }), database.delete(key), ExpiredCodes(player); 
          if (s === 2) return viewCodes(player);
        })
    }
  })
}

function ExpiredCodes(player, n) {
  const form = new ActionFormData();
  database.get(n);
  const codeCount = database2.length;
  form.title(`§b[ View expired codes ]`);
  form.body(`There ${codeCount === 0 ? "are §cno§f codes" : codeCount === 1 ? "is §b1§f code" : `are §b${codeCount}§f codes`} in the database.`);
  form.button(`Go back`);
  database2.keys().forEach((data) => {
    const codeInfo = database2.get(data) ?? null;
    const title = codeInfo ? codeInfo.Title : player.sendMessage("§c[Title not available]");
    form.button(`§b${title}`,`textures/items/paper`); });
  form.show(player).then(({ selection: s, canceled: c }) => {
    if (c) return player.sendMessage(`Come back later ${player.name}`);
    if (s === 0) return Codes(player);
    if (s >= 1) {
      const info = database2.values()[s - 1];
      const key = database2.keys()[s - 1];
      new ActionFormData()
        .title(`Code information, ID: §5${info?.ID ?? null}`)
        .body(`§lCode Info§r\n================================\n\nID: §5${info?.ID ?? null}§r\nCode title: §e${info.Title}§r\nCode Description: §b${info.Description}§r\nCode name: §a${info.Name}§r\nPermissions: §3${info.Permissions}§r\nMade by: §6${info.By}§r\nAt: §e${info.Time}§r\nItems: ${info.Item}\nColor: ${info.Color}\nExpired at: §3${info.ExpiredAt}§r`)
        .button('Remove code permanently', 'textures/ui/book_trash_default')
        .button(`Re-Activate code`, `textures/ui/player_online_icon`)
        .button('Go back', `textures/ui/recap_glyph_color_2x`)
        .show(player)
        .then(({ selection: s }) => {
          if (s === 0) {
            database2.delete(key);
            player.sendMessage(`§aRemoved the code from the database permanently`);
            ExpiredCodes(player, n); }
          if (s === 1) {
            new ModalFormData()
              .title(` §b[ set expire ]`)
              .textField(`How long before it expires\n§c[Mandatory]§r`, `1 - 1 second | 3600 - hour`)
              .show(player).then(({ formValues: [t], canceled: cl }) => {
                if (isNaN(t)) return player.sendMessage(`§cYou can only use numbers for expiring`); if (cl || !t) return player.sendMessage(`§cThere needs to be an expiration date`);
                player.sendMessage(`§aRe-Activated the code from the database`); const updatedInfo = { ...(database2.get(key)), Expires: parseInt(t) || null, ReActivated: new Date().toLocaleString() };
                database.set(key, updatedInfo); database2.delete(key);
                viewCodes(player); startExpirationCountdown(player, key, parseInt(t) || 0);
              });
          }
          if (s === 2) { ExpiredCodes(player, n); }
        });
    }
  });
}

function startExpirationCountdown(player, n) {
  const interval = system.runInterval(() => {
    const codeInfo = database.get(n) ?? null;
    const time = new Date().toLocaleString()
    const title = codeInfo ? codeInfo.Title : console.log(`Title is null`);
    if (!codeInfo) {
      system.clearRun(interval); return; }
    const keyEx = codeInfo.Expires;
    switch (true) {
      case keyEx >= 1: database.set(n, { ...codeInfo, Expires: keyEx - 1 }); break;
      case keyEx === 0: world.sendMessage(`[§3+§r] §r§cCode §e${title}§r has expired §3${player.name}`); database2.set(n, { ...database.get(n), ExpiredAt: time }); database.delete(n); system.clearRun(interval); break;
      default: system.clearRun(interval); }
  }, 20);
}

export function formatTime(seconds) {
  const TIME_UNITS = ["s", "m", "h", "d", "w", "y"];
  const unit = Math.floor(Math.log(seconds) / Math.log(60)); 
  if (unit === 0) {
      return `${seconds} (${TIME_UNITS[unit]})`;
  }
  const value = Math.round(seconds / Math.pow(60, unit));
  return `${value}§r(§3${TIME_UNITS[unit]}§r)`;
}

world.beforeEvents.itemUse.subscribe((data) => {
  if (data.source.typeId !== "minecraft:player") {
    return;
  }
  const player = data.source;
  const staff = player.hasTag("owners");
  system.run(() => {
    staff ? admin(player) : data.itemStack.typeId === "minecraft:apple" ? Codes(player) : null;
  });
});

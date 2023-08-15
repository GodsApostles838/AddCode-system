// Code system
// Gt: GodsApostles838 / Discord: Gods Apostles#6523
// You are not permitted to claim this system as yours.
// If you have any concerns will contact Gods Apostles#6523
// Github: https://github.com/GodsApostles838 
//   _____           _     
//  / ____|         | |    
// | |  __  ___   __| |___ 
// | | |_ |/ _ \ / _` / __|
// | |__| | (_) | (_| \__ \
//  \_____|\___/ \__,_|___/                      

import { system, world } from "@minecraft/server";
import { ActionFormData, ModalFormData } from "@minecraft/server-ui";
import { hasBadWords } from "./Functions.js";
import { Database } from "./database.js";

const database = new Database("Codes")
const database2 = new Database("ExpiredCodes")

function Codes(player) {
  new ActionFormData()
    .title(`[ §3Add codes§r ]`)
    .button(`§bAdd new code\n§7Add a new code§r`, `textures/ui/color_plus`)
    .button(`§bCodes\n§7Current codes`, `textures/ui/icon_book_writable`)
    .button(`§bExpired codes\n§7Expired codes`, `textures/ui/icon_trash`)
    .button(`§bCode stats\n§7Code status's`, `textures/ui/Ping_Green`)
    .show(player)
    .then(({ selection: s, canceled: c, cancelationReason: cl }) => {
      if (c) { player.sendMessage(`Come back later ${player.name}`);
      } else if (!cl) {
        switch (s) {
          case 0: AddCode(player); break;
          case 1: viewCodes(player); break;
          case 2: ExpiredCodes(player); break;
          case 3: viewCodeStats(player); break;
        }
      }
    });
}

function AddCode(player) {
  const permissionDropDown = [
     { display: "Everyone", value: "everyone"},
     { display: "Admins", value: "admin"},
     { display: "Developers", value: "dev"},
     { display: "Owners", value: "owner"}];
  const ItemDropDown = [
      { display: "Select", value: null },
      { display: "Diamonds", value: "minecraft:diamond" },
      { display: "Gold ingots", value: "minecraft:gold_ingot" },
      { display: "Emeralds", value: "minecraft:emerald" },
      { display: "Netherite bricks", value: "minecraft:netherite_brick" }];
  new ModalFormData()
      .title(`§b[ Add code ]`)
      .dropdown("\nItems §6[optional]§r", ItemDropDown.map(item => item.display))
      .dropdown("\nPermissions §7\n[leave default for everyone]§r", permissionDropDown.map(item => item.display))
      .textField(`Code title\n§7(3-6 characters)\n§c[Mandatory]§r`, `Title here`)
      .textField(`Code description\n§7(10-20 characters)\n§c[Mandatory]§r`, `Description here:`)
      .textField(`Code name\n§7(5-10 characters)\n§c[Mandatory]§r`, `Name here:`)
      .textField(`How long before it expires\n§c[Mandatory]§r`, `Usage: 1 s, m, h, d, w, y, [1s]`)
      .textField(`How much money would you like to give to the player?\n§c[Mandatory]§r`, `You can only use numbers`)
      .show(player).then(({ formValues: [i, p, t, d, n, ex, m], canceled: cl }) => {
          if (cl) return; 
          const exInSeconds = parseTime(ex); const reg = /[!@#$%^&*()_+{}\[\]:;"'<>,.?\\|`~-]/; const selectedItem = ItemDropDown[i].value; const selectedPermission = permissionDropDown[p].value; const ID = Math.round(Math.random() * 5000) + 1000;
          if (hasBadWords(t) || hasBadWords(d) || hasBadWords(n)) return player.sendMessage(`§cYou cannot use those words.\n\n${hasBadWords(t) ? '§rBad - §cTitle' : '§rGood - §aTitle'}\n${hasBadWords(d) ? '§rBad - §cDescription' : '§rGood - §aDescription'}\n${hasBadWords(n) ? '§rBad - §cName' : '§rGood - §aName'}`);
          if (reg.test(t) || reg.test(d)) return player.sendMessage(`§cYou cannot use symbols for ${!n ? "title" : "description"}`);
          if (isNaN(m) || !m) return player.sendMessage(`${isNaN(m) ? '§cYou can only use numbers for money' : '§cYou need to fill out money'}`)
          if (isNaN(exInSeconds) || !exInSeconds || exInSeconds <= 0) return player.sendMessage((isNaN(exInSeconds) || !exInSeconds) ? `§cIncorrect expiration time format. Please use a valid format, e.g., 1d, 2h, etc.` : `§cExpiration date cannot be past 0`);
          if (t.length < 3 || d.length < 10 || n.length < 5) return player.sendMessage(`§cYou need between ${t.length < 3 ? '3-6' : '10-20'} characters for title and ${n.length < 5 ? '5' : '5-10'} characters for description.`);
          if (database.keys().includes(n)) return player.sendMessage(`§cERROR, already made by another player`);
          database.set(n, {
              Permissions: selectedPermission[p] ?? null,
              ID: ID ?? null,
              Title: t ?? null,
              Name: n ?? null,
              Description: d ?? null,
              Time: new Date().toLocaleString() ?? null,
              By: player?.name ?? null,
              Expires: exInSeconds ?? null,
              ReActivated: "" ?? null,
              Item: selectedItem ?? null,
              Money: m ?? null}),
          startExpirationCountdown(player, n), viewCodes(player);
          if (database.get(n).includes(null) || database.get(n).includes(undefined) || database.get(n).includes(void 0) || database.get(n).includes(NaN)) return console.log(...JSON.stringify(database.get(n)));
          if (database.get(n).every(value => [Infinity, -Infinity, NaN].includes(value))) return console.log(...JSON.stringify(database.get(n)));
          world.sendMessage(`§7| §r[§3+§r] §eA new code has been added to the game!§r\n§7|\n§7| §rTitle: §3${t}§r\n§7|\n§7| §rDescription: §a${d}§r\n§7|\n§7| §rCode: Redeem it now! §3${n}§r\n§7|\n§7| §rThis is for §e${permissionDropDown[p]}`)
      });
}

function viewCodeStats(player, RedeemedBy) {
  const totalCodes = database.keys().length;
  const expiredCodes = database2.keys().length;
  const claimedCodes = Object.keys(database).filter(codeKey => database[codeKey].RedeemedBy).length;
  const unclaimedCodes = totalCodes - claimedCodes;
  new ActionFormData()
    .title(`§b[ Code statistics ]`)
    .body(`Total codes: §b${totalCodes}§f\nTotal expired codes: §b${expiredCodes}§f\n----------------------\nClaimed codes: §b${claimedCodes}§f\nUnclaimed codes: §b${unclaimedCodes}`)
    .button(`Go back`)
    .show(player)
    .then(({ selection: s, canceled: c }) => {
      if (c) return player.sendMessage(`Come back later ${player.name}`);
      if (s === 0) return Codes(player);
    });
}

const pre = "-";
world.beforeEvents.chatSend.subscribe(data => {
    const { message, sender: player } = data;
    if (!message.startsWith(pre)) return;
    const [command, code] = message.slice(1).split(" ");
    data.cancel = true;
    switch (command) {
        case 'help':
            player.sendMessage(`------------------------\n[§3+§r] Redeem a code: §7Usage: -redeem §3<CODE>§r\n------------------------`);
            break;
        case 'redeem':
            if (!code) return player.sendMessage('[§3+§r] Please provide a code to redeem. §7Usage: -redeem §3<CODE>');
            const normalizedCode = code.toLowerCase();
            const codeEntry = database.get(normalizedCode);
            const ExpiredCodeEntry = database2.get(normalizedCode);
            if (codeEntry) {
                if (codeEntry.RedeemedBy && codeEntry.RedeemedBy.includes(player.name)) return player.sendMessage(`[§3+§r] You've already redeemed this code`);
                if (ExpiredCodeEntry) return player.sendMessage(`[§3+§r] This code is expired.`);
                if (!player.hasTag(codeEntry.Permissions) && codeEntry.Permissions !== "Everyone") return player.sendMessage("[§3+§r] §cYou don't have the permissions to redeem this code"); 
                 player.sendMessage('[§3+§r] §aCode successfully redeemed!');
                 if (!codeEntry.RedeemedBy) codeEntry.RedeemedBy = [];
                  codeEntry.RedeemedBy.push(player.name);
                  database.set(normalizedCode, codeEntry);
            } else player.sendMessage('[§3+§r] §cIncorrect code');
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
    form.button(`§b${title}`,`textures/items/paper`) });
  form.show(player).then(({ selection: s, canceled: c }) => {
    if (c) return player.sendMessage(`Come back later ${player.name}`)
    if (s === 0) return Codes(player)
    if (s >= 1) {
      const info = database.values()[s - 1];
      const key = database.keys()[s - 1]
      new ActionFormData()
        .title(`Code information, ID: §5${info?.ID ?? null}`)
        .body(`§lCode Info§r\n================================\n\nID: §5${info?.ID ?? null}§r\nCode title: §e${info.Title}§r\nCode Description: §b${info.Description}§r\nCode name: §a${info.Name}§r\nPermissions: §3${info.Permissions}§r\nMade by: §6${info.By}§r\nAt: §e${info.Time}§r\nItems: ${info.Item}\n${info.Expires || info.ReActivated || info.ExpiredAt ? `\nExpires in: §3${formatTime(info.Expires)}§r` : ''}${info.ReActivated ? `\nRe-A at: §3${info.ReActivated}§r` : ''}${info.ExpiredAt ? `\nExpired at: §3${info.ExpiredAt}§r` : ''}`)
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
        .body(`§lCode Info§r\n================================\n\nID: §5${info?.ID ?? null}§r\nCode title: §e${info.Title}§r\nCode Description: §b${info.Description}§r\nCode name: §a${info.Name}§r\nPermissions: §3${info.Permissions}§r\nMade by: §6${info.By}§r\nAt: §e${info.Time}§r\nItems: ${info.Item}\nExpired at: §3${info.ExpiredAt}§r`)
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

function parseTime(timeStr) {
  const timeMap = {
    s: 1,
    m: 60,
    h: 3600,
    d: 86400,
    w: 604800,
    y: 31536000,
  };
  const timeRegex = /^(\d+)\s*([smhdwy])$/i;
  const matches = timeStr.match(timeRegex);
  if (!matches) return null;
  const value = parseInt(matches[1]);
  const unit = matches[2].toLowerCase();
  if (isNaN(value) || value <= 0) return null;
  if (!timeMap.hasOwnProperty(unit)) return null;
  return value * timeMap[unit];
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
  const staff = player.hasTag("owners1");
  system.run(() => {
    staff ? admin(player) : data.itemStack.typeId === "minecraft:torch" ? Codes(player) : null;
  });
});

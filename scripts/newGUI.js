import { world, ItemStack } from "@minecraft/server"
import { ActionFormData, ModalFormData, ModalFormResponse } from "@minecraft/server-ui"
import { system } from "@minecraft/server";

function Home(player) {
  const players = world.getPlayers()
  const FormHome = new ActionFormData()
    .title(`[ Home ]`)
    .body(`Current players online §a${players.length}§f\nCurrent money${Score(player, `Money`, `get`)}`)
    .button(`Warps`)
    .button(`Shop`)
    .button(`Credits`)
    .button(`Settings`)
    .button(`Codes`)
    if (player.getTags().some(value => ['Owner', 'Dev', 'Admin'].includes(value))) { FormHome.button(`Admin panel`); }
  FormHome.show(player).then(({ selection: s, canceled: c }) => {
    if (c) return;
    switch (s) {
      case 0: Warps(player); break;
      case 1: Shop(player); break;
      case 2: Credits(player); break;
      case 3: Settings(player); break;
      case 4: Codes(player); break;
      case 5: AdminPanel(player); break;
    }
  })
}

function Warps(player) {
  const WarpDropDown = [
    { display: "select", value: null },
    { display: "Go to §eSpawn§f", TeleportData:  { x: 0, y: -60, z: -10 } },
    { display: "Go to §ePvP§r",   TeleportData:  { x: 0, y: -60, z: -10 } },
    { display: "Go to §eshop§f",  TeleportData:  { x: 0, y: -60, z: -10 } },
    { display: "Go to §eshop§f",  TeleportData:  { x: 0, y: -60, z: -10 } }];
  const FormWarps = new ModalFormData()
    .title('[ Warps ]')
    .dropdown(`Select`, WarpDropDown.map(entry => entry.display))
    .toggle(`Are you sure you wanna teleport to this destination?\n\n§aYes§f/§cno`);
  FormWarps.show(player).then(({ formValues: [w, t], canceled: cl }) => {
    if (cl) return player.sendMessage(`>> Come back later ${player.name}!`);
    if (w <= 0 || !t) return player.sendMessage(`${w <= 0 ? `>> Choose a warp ${player.name}` : `>> §cYou need to agree, click§f "§aYes§f" or "§cNo§f"`}`);
    let i = 5;
    const interval = system.runInterval(() => {
      const { x, z } = player.getVelocity();
      const speed = (Math.sqrt(x * x + z * z) * 20).toFixed(1);
      const warpName = WarpDropDown[w].display.replace(/^Go to /, "");
      if (i > 0 && 0 <= speed) {
        player.sendMessage(`>> Warping in §e${i--}§f...`);
        if (speed > 0) { player.sendMessage(`>> §cYou cannot move while warping!`); system.clearRun(interval); }
      } else if (i <= 0) { system.clearRun(interval); player.teleport(WarpDropDown[w].TeleportData); player.sendMessage(`>> §aSuccessfully teleported to ${warpName}!`) }
    }, 20);
  });
}

function Shop(player) {
  const ShopData = {
    armor: [
      { Name: "Leather kit",         price: 100,   discount: 1, icon: "textures/items/leather_chestplate",         id: "minecraft:leather",          },
      { Name: "Chain kit",           price: 800,   discount: 0, icon: "textures/items/chainmail_chestplate",       id: "minecraft:chainmail",        },
      { Name: "Iron kit",            price: 3500,  discount: 0, icon: "textures/items/iron_chestplate",            id: "minecraft:iron",             },
      { Name: "Golden kit",          price: 8000,  discount: 0, icon: "textures/items/gold_chestplate",            id: "minecraft:golden",           },
      { Name: "Diamond kit",         price: 20000, discount: 0, icon: "textures/items/diamond_chestplate",         id: "minecraft:diamond",          },
      { Name: "Nether kit",          price: 80000, discount: 0, icon: "textures/items/netherite_chestplate",       id: "minecraft:netherite"         }
    ],
    weapons: [
      { Name: "Wooden sword",        price: 50,    discount: 0, icon: "textures/items/wood_sword",                 id: "minecraft:wooden_sword",     },
      { Name: "Stone sword",         price: 400,   discount: 0, icon: "textures/items/stone_sword",                id: "minecraft:stone_sword",      },
      { Name: "Iron sword",          price: 2500,  discount: 0, icon: "textures/items/iron_sword",                 id: "minecraft:iron_sword",       },
      { Name: "Golden sword",        price: 6000,  discount: 0, icon: "textures/items/gold_sword",                 id: "minecraft:golden_sword",     },
      { Name: "Diamond sword",       price: 15000, discount: 0, icon: "textures/items/diamond_sword",              id: "minecraft:diamond_sword",    },
      { Name: "Nether sword",        price: 30000, discount: 0, icon: "textures/items/netherite_sword",            id: "minecraft:netherite_sword",  },
      { Name: "Bow",                 price: 1500,  discount: 0, icon: "textures/items/bow_standby",                id: "minecraft:bow",              },
      { Name: "Cross bow",           price: 8000,  discount: 0, icon: "textures/items/crossbow_standby",           id: "minecraft:crossbow",         }
    ],
    potions: [
      { Name: "Speed (3:00)",        price: 10,    discount: 0, icon: "textures/items/potion_bottle_moveSpeed",    id: "minecraft:potion 1 14",      },
      { Name: "Jump boost (3:00)",   price: 50,    discount: 0, icon: "textures/items/potion_bottle_jump",         id: "minecraft:potion 1 9",       },  
      { Name: "Invisibility (3:00)", price: 150,   discount: 0, icon: "textures/items/potion_bottle_invisibility", id: "minecraft:potion 1 7",       },
      { Name: "Instant health",      price: 150,   discount: 0, icon: "textures/items/potion_bottle_healthBoost",  id: "minecraft:potion 1 14",      }
    ],
    items: [
      { Name: "Iron axe",            price: 500,   discount: 0, icon: "textures/items/iron_axe",                   id: "minecraft:iron_axe"          },
      { Name: "Iron hoe",            price: 1000,  discount: 0, icon: "textures/items/iron_hoe",                   id: "minecraft:iron_hoe"          },
      { Name: "Fishing rod",         price: 1000,  discount: 0, icon: "textures/items/fishing_rod_uncast",         id: "minecraft:fishing_rod"       },
      { Name: "Arrows",              price: 10,    discount: 0, icon: "textures/items/arrow",                      id: "minecraft:arrow"             }
    ],
    misc: [
      { Name: "Trident",             price: 10000, discount: 0, icon: "textures/items/trident",                    id: "minecraft:trident"           },
      { Name: "Elytra",              price: 15000, discount: 0, icon: "textures/items/elytra",                     id: "minecraft:elytra"            },
      { Name: "Totem of undying",    price: 50000, discount: 0, icon: "textures/items/totem",                      id: "minecraft:totem_of_undying"  }
    ]
  };
  const FormShop = new ActionFormData()
    .title(` [ shop ] `)
    .button(`Armor`)
    .button(`Weapons`)
    .button(`Potions`)
    .button(`Items`)
    .button(`Misc`);
  FormShop.show(player).then(({ selection: s, canceled: c }) => {
    if (c) return;
    const selectedCategory = Object.keys(ShopData)[s];
    const selectedItems = ShopData[selectedCategory];
    const SubForm = new ActionFormData()
      .title(` [ ${selectedCategory} ] `);
    for (const item of selectedItems) {
      SubForm.button(`${item.Name} - Price: §a${formatNum(item.price)}§f\n${item.discount <= 0 ? '' : `Discount: §e${item.discount}§f%%`}`, item.icon);
    }
    SubForm.show(player).then(({ selection: subSelection, canceled: subCanceled }) => {
      if (subCanceled) return;
      const selectedItem = selectedItems[subSelection];
      new ModalFormData()
        .title(selectedItem.Name)
        .slider(`Quantity`, 1, 50, 1)
        .toggle(`Are you sure you wanna buy this?\n\n§aYes§f/§cno`)
        .show(player).then(({ formValues: [b, t] }) => {
          if (!t) return player.sendMessage(`§cYou need to agree, click§f "§aYes§f" or "§cNo§f`)
          if (Score(player, 'Money', 'get') < selectedItem.price * b) return player.sendMessage(`>> §cNot enough money\n§f>> You need §f${formatNum((selectedItem.price * b) - Score(player, 'Money', 'get'))} more`);
          if (selectedCategory === 'armor') { 
            const armorPiece = selectedItem.id.split(':')[1];
            if (armorPiece) {
              addItems(player, [
                [`${armorPiece}_boots`, 1],
                [`${armorPiece}_leggings`, 1],
                [`${armorPiece}_chestplate`, 1],
                [`${armorPiece}_helmet`, 1]
              ]);
              player.sendMessage(`>> You have purchased §e${selectedItem.Name}\n§f>> For §e${formatNum(selectedItem.price * b)}`);
              Score(player, 'Money', 'remove', selectedItem.price * b)
            }
          } else if (selectedCategory === 'potion') {
            player.runCommand(`give @s ${selectedItem.id}`)
            player.sendMessage(`>> You have purchased §e${selectedItem.Name}\n§f>> For §e${formatNum(selectedItem.price * b)}`);
            Score(player, 'Money', 'remove', selectedItem.price * b);
          } else {
            addItems(player, [[`${selectedItem.id}`, 1]]); 
            player.sendMessage(`>> You have purchased §e${selectedItem.Name}\n§f>> For §e${formatNum(selectedItem.price * b)}`);
            Score(player, 'Money', 'remove', selectedItem.price * b)
          }
        });
    });
  });
}

const Builders = []; const Scripters = []; const Owners = []; 
function Credits(player) {
  const CreditForm = new ActionFormData()
   .title(`[ Credits ]`)
   .body(`Builders:\n${JSON.stringify(Builders)}\n\nScripters:\n${JSON.stringify(Scripters)}\n\nOwners:\n${JSON.stringify(Owners)}\n\n`)
   if (player.getTags().some(value => ['Owner', 'Dev', 'Admin'].includes(value))) { CreditForm.button(`Add/remove`); }
    CreditForm.show(player).then(({ selection: s, canceled: c }) => {
      if (c) return;
      if (s === 0) {
        const AddCredit = new ModalFormData()
        .title(`[ Add credits ] `)
        .dropdown(`Choose role\nSelect:`, [`Scripter`,`Builder`,`Owner`])
        .dropdown(`Choose a player\n§7Current players: §a${(world.getPlayers().length)}`,(([...world.getPlayers()].map((plr) => plr.name))))
        AddCredit.show(player).then(({ formValues: [r, p]}) => {
          const target = world.getPlayers()({ name: players[dropdown]?.name })[1];
          if (target === player.id) return player.sendMessage(`>> §cYou cant select yourself`)
        })
      }
   })
}

function getSpeedClassification(speed) {
  const roundedSpeed = Math.floor(speed)
  if (speed >= 10 && speed <= 15) return `Speed: §5Super Fast §b${roundedSpeed}§r blocks per second\n`;
  else if (speed > 15 && speed <= 25) return `Speed: §6God Speed §b${roundedSpeed}§r blocks per second\n`;
  else if (speed > 6) return `Speed: §aFast §b${roundedSpeed}§r blocks per second\n`;
  else if (speed > 3) return `Speed: §eAverage §b${roundedSpeed}§r blocks per second\n`;
  else if (speed > 1) return `Speed: §cSlow §b${roundedSpeed}§r blocks per second\n`;
  else return `You aren't moving\n`;
}

system.runInterval(() => {
  for (let player of world.getPlayers()) {
    if (player.hasTag('Speedtracker')) {
      const { x, z } = player.getVelocity();
      const speed = (Math.sqrt(x * x + z * z) * 20).toFixed(1);
      const speedDisplay = getSpeedClassification(speed);
      player.onScreenDisplay.setActionBar(speedDisplay);
    }
  }
}, 10)

function addItems(player, items) {
  try {
    const inv = player.getComponent('inventory').container;
    for (let [item, count] of items) {
      let stacksNeeded = Math.ceil(count / 64);
      for (let i = 0; i < stacksNeeded; i++) {
        const stackSize = Math.min(count, 64);
        inv.addItem(new ItemStack(item, stackSize));
        count -= stackSize;
      }
    }
  } catch (error) {
    console.warn('inventory', error);
  }
}

function formatNum(number) {
  const SI_SYMBOL = ["", "k", "M", "G", "T", "P", "E"];
  const tier = Math.log10(Math.abs(number)) / 3 | 0;
  if (tier == 0)
    return number;
  return (number / Math.pow(10, tier * 3)).toFixed(1) + SI_SYMBOL[tier];
}

world.beforeEvents.itemUse.subscribe((data) => {
  if (data.source.typeId !== "minecraft:player") return;
  const player = data.source;
  system.run(() => { data.itemStack.typeId === "minecraft:apple" ? Home(player) : null; });
});

function Score(entity, objective, objectiveVOID, operation, amount = 0, min = 0, max = 0) {
  try {
    const commands = {
      get: () => world.scoreboard.getObjective(objective).getScore(entity.scoreboardIdentity),
      add: () => entity.runCommandAsync(`scoreboard players add "${entity.name}" ${objective} ${amount}`),
      set: () => entity.runCommandAsync(`scoreboard players set "${entity.name}" ${objective} ${amount}`),
      test: () => entity.runCommandAsync(`scoreboard players test ${entity.name} ${objective} ${min} ${max}`),
      reset: () => entity.runCommandAsync(`scoreboard players reset ${entity.name} ${objective}`),
      remove: () => entity.runCommandAsync(`scoreboard players remove "${entity.name}" ${objective} ${amount}`),
      random: () => entity.runCommandAsync(`scoreboard players random "${entity.name}" ${objective} ${min} ${max}`),
      operation: () => entity.runCommandAsync(`scoreboard players operation "${entity.name}" ${objective} ${operation} ${entity.name} ${objectiveVOID}`),
    }; 
    return operation in commands ? commands[operation]() : 0;
  } catch (error) {
    return 0;
  }
}

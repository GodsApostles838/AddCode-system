import { world, Player, system, Dimension } from "@minecraft/server";
import { ActionFormData, ModalFormData } from "@minecraft/server-ui";

////////////////////////////////////////////////////////////////////////////// =============================================================
//                                                                          // * Such property will not be modified in any such way        |
//                           Crate System                                   // * Must give credit to the creator Gods Apostles             |
//                         By Gods Apostles838                              // * Must not claim this as your own                           |
//                                                                          // * No giving without permission from the owner GodsApostles  |
////////////////////////////////////////////////////////////////////////////// =============================================================

export function metricNumbers(value) {
  const types = ["", "K", "M", "B", "T"];
  const selectType = (Math.log10(value) / 3) | 0;
  if (selectType == 0)
      return value;
  let scaled = value / Math.pow(10, selectType * 3);
  return scaled.toFixed(1) + types[selectType];
}

export const scoreboards = {}
Object.defineProperties(Player.prototype, {
    score: {
        get() {
            /* @type {Player} */ 
            const player = this;
            return new Proxy({}, {
                get(target, key) {
                    try {
                        return (scoreboards[key] ??= world.scoreboard.getObjective(key)).getScore(player) ?? 0;
                    } catch {
                        return 0;
                    }
                },
                set(target, key, value) {
                    try {
                        (scoreboards[key] ??= world.scoreboard.getObjective(key)).setScore(player, value)
                    } catch {
                        player.runCommandAsync(`scoreboard players set @s ${key} ${value}`)
                    }
                    return true;
                },
            })
        },
    }
});

function Score(entity, objective, object, amount = 0) {
    try {
      const commands = {
        get: () => world.scoreboard.getObjective(objective).getScore(entity.scoreboardIdentity),
        add: () => entity.runCommandAsync(`scoreboard players add "${entity.name}" ${objective} ${amount}`),
        set: () => entity.runCommandAsync(`scoreboard players set "${entity.name}" ${objective} ${amount}`),
        remove: () => entity.runCommandAsync(`scoreboard players remove "${entity.name}" ${objective} ${amount}`)
      };
      return object in commands ? commands[object]() : (amount = 0);
    } catch (error) {
      console.error('Error:', error);
      return 0;
    }
  } 

  world.afterEvents.entityHitEntity.subscribe((data) => {
    const player = data.damagingEntity
    const hit = data.hitEntity
    if (!hit)
        return;
    if (!player || !(player instanceof Player))
        return;
    if (hit.typeId !== 'dhub:crate1')
        return; Crate1(player);
    if (hit.typeId !== 'dhub:crate2') 
        return; Crate2(player)
    if (hit.typeId !== 'dhub:crate3') 
        return; Crate3(player)
    if (hit.typeId !== 'dhub:crate4') 
        return; Crate4(player) 
    if (hit.typeId !== 'dhub:crate5') 
        return; Crate5(player) 
});

const Basic_items = {
    swords: {
      item1: { name: 'Wood Sword', ID: 'wooden_sword' },
      item2: { name: 'Stone Sword', ID: 'stone_sword' },
    },
    axes: {
      item1: { name: 'Stone Axe', ID: 'stone_axe' },
      item2: { name: 'Wooden Axe', ID: 'wooden_axe' },
    }
  };

  const Knight_items = {
    swords: {
      item1: { name: 'Stone Sword', ID: 'stone_sword' },
      item2: { name: 'Iron Sword', ID: 'iron_sword' },
    },
    axes: {
      item1: { name: 'Stone Axe', ID: 'stone_axe' },
      item2: { name: 'Iron Axe', ID: 'iron_axe' },
    },
    boosts: {
      item2: { name: `Speed 2x Boost`, ID: `blaze_powder`},
      item3: { name: `Fire 2x Boost`, ID: `fire_charge`}
    }
  };

  const Rich_items = {
    swords: {
      item1: { name: 'Iron Sword', ID: 'iron_sword' },
      item2: { name: 'Gold Sword', ID: 'golden_sword' }
    },
    axes: {
      item1: { name: 'Iron Axe', ID: 'iron_axe' },
      item2: { name: 'Gold Axe', ID: 'golden_axe' },
    },
    boosts: {
      item2: { name: `Speed 3x Boost`, ID: `blaze_powder`},
      item3: { name: `Fire 3x Boost`, ID: `fire_charge`}
    }
  };  

  const Million_items = {
    swords: {
      item1: { name: 'Gold Sword', ID: 'golden_sword' },
      item2: { name: 'Diamond Sword', ID: 'diamond_sword' }
    },
    axes: {
      item1: { name: 'Gold Axe', ID: 'golden_axe' },
      item2: { name: 'Diamond Axe', ID: 'diamond_axe' },
    },
    boosts: {
      item2: { name: `Speed 5x Boost`, ID: `blaze_powder`},
      item3: { name: `Fire 5x Boost`, ID: `fire_charge`}
    }
  };
  
  const God_items = {
    swords: {
      item1: { name: 'Netherite Sword', ID: 'netherite_sword' }
    },
    axes: {
      item1: { name: 'Netherite Axe', ID: 'netherite_axe' }
    },
    boosts: {
      item2: { name: `Speed 10x Boost`, ID: `blaze_powder`},
      item3: { name: `Fire 10x Boost`, ID: `fire_charge`}
    }
  }; 

  
  function Crate1(player) {
    const Basic_cashValues = [5, 10, 50, 80]; 

    new ActionFormData()
      .title('§m§b Basic Crate')
      .body(` 
      ╔═══════════╗
      ║      Crate Shop     ║    Chances cash:
      ╠═══════════╣    §b------------§r 
      ║ Type: §bBasic Crate§r  ║    1000$ 3§e%%§r
      ║                         ║    800$ 3§e%%§r
      ║ Items:                 ╝    500$ 3§e%%§r 
      ║ §b- Swords §r                  
      ║ §b- Apples§r                   Chance item:     
      ║ §b- Axes §r                    §b------------§r       
      ║ §b- Money §r             ╗    §bGolden§r Apple 3§e%%§r | §bEnchanted Golden§r Apple 3§e%%§r
      ║                         ║    
      ║ Price: $100          ║
      ╚═══════════╝

  `)
      .button(`§e   Yes \n§f[Click to buy]`)
      .button(`§e   No \n§f[Don't purchase]`)
      .show(player)
      .then(result => {
        if (result.selection === 0) {
          if (player.score.Money >= 100) {
            const categoryKeys = Object.keys(Basic_items);
            const randomCategoryKey = categoryKeys[Math.floor(Math.random() * categoryKeys.length)];
            const randomCategory = Basic_items[randomCategoryKey];
            const itemKeys = Object.keys(randomCategory);
            const randomItemKey = itemKeys[Math.floor(Math.random() * itemKeys.length)];
            const randomItem = randomCategory[randomItemKey];

             let randomCash;
             if (Math.random() < 0.03) {
               const possibleValues = [1000, 800, 500, 250, 100];
               randomCash = possibleValues[Math.floor(Math.random() * possibleValues.length)];
             } else {
               randomCash = Basic_cashValues.filter(value => value !== 1000 && value !== 800 && value !== 500 && value !==250 && value !== 100)[Math.floor(Math.random() * (Basic_cashValues.length - 2))];
             } 
             let itemToGive;
             if (Math.random() < 100) {
                const chance = Math.random();
                if (chance < 0.05) { 
                  player.sendMessage(`§b§l[§r Random Item §b§l] §r§r§7Golden Apple`);
                  player.sendMessage(`\n§b§l[§r Random Money §b§l] §r§r§7${randomCash}$`);
                  Score(player, 'Money', 'add', `${randomCash}`);
                  Score(player, 'Money', 'remove', 100);
                  player.runCommandAsync(`give @s golden_apple 1 0`);
                  player.playSound('random.levelup');
                  return

                } else if (chance < 0.03) { 
                  player.sendMessage(`§b§l[§r Random Item §b§l] §r§r§7Enchanted Golden Apple`);
                  player.sendMessage(`\n§b§l[§r Random Money §b§l] §r§r§7${randomCash}$`);
                  Score(player, 'Money', 'add', `${randomCash}`);
                  Score(player, 'Money', 'remove', 100);
                  player.runCommandAsync(`give @s enchanted_golden_apple 1 0`);
                  player.playSound('random.levelup');
                  return;
                } else {
                  itemToGive = randomItem.ID;
                }
              } else {
                itemToGive = randomItem.ID;
              }

            player.sendMessage(`§b§l[§r Random Item §b§l] §r§r§7${randomItem.name}`);
            player.sendMessage(`\n§b§l[§r Random Money §b§l] §r§r§7${randomCash}$`);
            Score(player, 'Money', 'add', `${randomCash}`);
            Score(player, 'Money', 'remove', 100);
            player.runCommandAsync(`give @s ${randomItem.ID} 1 0`);
            player.playSound('random.levelup'); 
  
          } else {
            player.sendMessage(`§cNot Enough Money §f${player.name}`);
          }
        }
      });
  }
  
  function Crate2(player) {
    const Knight_cashValues = [100, 200, 500];
  
    new ActionFormData()
      .title('§l§d- Knight crate -§r')
      .body(`
      ╔═══════════╗
      ║      Crate Shop     ║     Chances cash:
      ╠═══════════╣     §d------------§r 
      ║ Type: §dKnight Crate§r ║     8000$ 3§e%%§r
      ║                         ║     5000$ 3§e%%§r
      ║ Items:                 ╝     3000$ 3§e%%§r
      ║ §d- Swords §r                  
      ║ §d- Apples§r                    Chances item:
      ║ §d- Axes §r                     §d------------§r 
      ║ §d- Money §r                    §dGolden§r Apple 8§e%%§r | §dEnchanted Golden§r Apple 5§e%%§r 
      ║ §d- Boosts §r            ╗     §dGolden§r Axe 3§e%%§r | §dGoldend§r Sword 2§e%%§r
      ║                         ║    
      ║ Price: $2k            ║     
      ╚═══════════╝


  `)
      .button(`§e   Yes \n§f[Click to buy]`)
      .button(`§e   No \n§f[Don't purchase]`)
      .show(player)
      .then(result => {
        if (result.selection === 0) {
          if (player.score.Money >= 1000) {
            const categoryKeys = Object.keys(Knight_items);
            const randomCategoryKey = categoryKeys[Math.floor(Math.random() * categoryKeys.length)];
            const randomCategory = Knight_items[randomCategoryKey];
            const itemKeys = Object.keys(randomCategory);
            const randomItemKey = itemKeys[Math.floor(Math.random() * itemKeys.length)];
            const randomItem = randomCategory[randomItemKey];
            
            let randomCash;
            if (Math.random() < 0.03) {  
              const possibleValues = [5000, 8000, 3000, 1000, 800]; 
              randomCash = possibleValues[Math.floor(Math.random() * possibleValues.length)];
            } else {
              const filteredCashValues = Knight_cashValues.filter(value => value !== 5000 && value !== 8000 && value !== 3000 && value !== 1000 && value !== 800);
              if (filteredCashValues.length > 0) {
                randomCash = filteredCashValues[Math.floor(Math.random() * filteredCashValues.length)];
              } else {
                randomCash = 0; 
              }
            }
            
            let itemToGive;
            if (Math.random() < 100) {  
              const chance = Math.random();
              if (chance < 0.08) { 
                // Golden Apple
                player.sendMessage(`§a§l[§r Random Item §a§l] §r§r§7Golden Apple`);
                player.sendMessage(`\n§a§l[§r Random Money §a§l] §r§r§7${randomCash}$`);
                Score(player, 'Money', 'add', `${randomCash}`);
                Score(player, 'Money', 'remove', 1000);
                player.runCommandAsync(`give @s golden_apple 1 0`);
                player.playSound('random.levelup');
                return
                
                // Enchanted golden apple
              } else if (chance < 0.05) { 
                player.sendMessage(`§a§l[§r Random Item §a§l] §r§r§7Enchanted Golden Apple`);
                player.sendMessage(`\n§a§l[§r Random Money §a§l] §r§r§7${randomCash}$`);
                Score(player, 'Money', 'add', `${randomCash}`);
                Score(player, 'Money', 'remove', 1000);
                player.runCommandAsync(`give @s enchanted_golden_apple 1 0`);
                player.playSound('random.levelup');
                return

                // Golden sword
              } else if (chance < 0.03) {
                player.sendMessage(`§a§l[§r Random Item §a§l] §r§r§7Golden Axe`);
                player.sendMessage(`\n§a§l[§r Random Money §a§l] §r§r§7${randomCash}$`);
                Score(player, 'Money', 'add', `${randomCash}`);
                Score(player, 'Money', 'remove', 1000);
                player.runCommandAsync(`give @s golden_axe 1 0`);
                player.playSound('random.levelup');
                return

                // Golden sword
              } else if (chance < 0.02) {
                player.sendMessage(`§a§l[§r Random Item §a§l] §r§r§7Golden Sword`);
                player.sendMessage(`\n§a§l[§r Random Money §a§l] §r§r§7${randomCash}$`);
                Score(player, 'Money', 'add', `${randomCash}`);
                Score(player, 'Money', 'remove', 1000);
                player.runCommandAsync(`give @s golden_sword 1 0`);
                player.playSound('random.levelup');
                return
              }
            } else {
              itemToGive = randomItem.ID;
            }
            
            player.sendMessage(`§d§l[§r Random Item §d§l] §r§r§7${randomItem.name}`);
            player.sendMessage(`\n§d§l[§r Random Money §d§l] §r§r§7${randomCash}$`);
            Score(player, 'Money', 'add', `${randomCash}`);
            Score(player, 'Money', 'remove', 1000);
            player.runCommandAsync(`give @s ${randomItem.ID} 1 0`);
            player.playSound('random.levelup');

          } else {
            player.sendMessage(`§cNot Enough Money §f${player.name}`);
          }
        }
      });
  }

  function Crate3(player) {
    const Rich_cashValues = [1000, 2000, 500];
  
    new ActionFormData()
      .title('§l§e- Rich crate -§r')
      .body(`
      ╔═══════════╗
      ║      Crate Shop     ║     Chances cash:
      ╠═══════════╣     §e------------§r 
      ║ Type: §eRich Crate§r    ║    20,000$ 10§e%%§r
      ║                         ║     10,000$ 10§e%%§r
      ║ Items:                 ╝     5,000$ 10§e%%§r
      ║ §e- Swords §r                  
      ║ §e- Apples§r                    Chances item:
      ║ §e- Axes §r                     §e------------§r 
      ║ §e- Money §r                    §eGolden§r Apple 12§e%%§r | §eEnchanted Golden§r Apple 8§e%%§r 
      ║ §e- Boosts §r            ╗     §eDiamond§r Axe 3§e%%§r | §eDiamond§r Sword 2§e%%§r
      ║                         ║    
      ║ Price: $10k          ║     
      ╚═══════════╝


  `)
      .button(`§e   Yes \n§f[Click to buy]`)
      .button(`§e   No \n§f[Don't purchase]`)
      .show(player)
      .then(result => {
        if (result.selection === 0) {
          if (player.score.Money >= 10000){
            const categoryKeys = Object.keys(Rich_items);
            const randomCategoryKey = categoryKeys[Math.floor(Math.random() * categoryKeys.length)];
            const randomCategory = Rich_items[randomCategoryKey];
            const itemKeys = Object.keys(randomCategory);
            const randomItemKey = itemKeys[Math.floor(Math.random() * itemKeys.length)];
            const randomItem = randomCategory[randomItemKey];
            
            let randomCash;
            if (Math.random() < 0.10) {  
              const possibleValues = [20000, 10000, 5000]; 
              randomCash = possibleValues[Math.floor(Math.random() * possibleValues.length)];
            } else {
              const filteredCashValues = Rich_cashValues.filter(value => value !== 20000 && value !== 10000 && value !== 5000);
              if (filteredCashValues.length > 0) {
                randomCash = filteredCashValues[Math.floor(Math.random() * filteredCashValues.length)];
              } else {
                randomCash = 0; 
              }
            }
            
            let itemToGive;
            if (Math.random() < 100) {  
              const chance = Math.random();
              if (chance < 0.12) { 
                // Golden Apple
                player.sendMessage(`§a§l[§r Random Item §a§l] §r§r§7Golden Apple`);
                player.sendMessage(`\n§a§l[§r Random Money §a§l] §r§r§7${randomCash}$`);
                Score(player, 'Money', 'add', `${randomCash}`);
                Score(player, 'Money', 'remove', 10000);
                player.runCommandAsync(`give @s golden_apple 1 0`);
                player.playSound('random.levelup');
                return
                
                // Enchanted golden apple
              } else if (chance < 0.08) { 
                player.sendMessage(`§a§l[§r Random Item §a§l] §r§r§7Enchanted Golden Apple`);
                player.sendMessage(`\n§a§l[§r Random Money §a§l] §r§r§7${randomCash}$`);
                Score(player, 'Money', 'add', `${randomCash}`);
                Score(player, 'Money', 'remove', 10000);
                player.runCommandAsync(`give @s enchanted_golden_apple 1 0`);
                player.playSound('random.levelup');
                return

                // Diamond axe
              } else if (chance < 0.03) {
                player.sendMessage(`§a§l[§r Random Item §a§l] §r§r§7Diamond Axe`);
                player.sendMessage(`\n§a§l[§r Random Money §a§l] §r§r§7${randomCash}$`);
                Score(player, 'Money', 'add', `${randomCash}`);
                Score(player, 'Money', 'remove', 10000);
                player.runCommandAsync(`give @s diamond_axe 1 0`);
                player.playSound('random.levelup');
                return

                // Diamond sword
              } else if (chance < 0.02) {
                player.sendMessage(`§a§l[§r Random Item §a§l] §r§r§7Diamond Sword`);
                player.sendMessage(`\n§a§l[§r Random Money §a§l] §r§r§7${randomCash}$`);
                Score(player, 'Money', 'add', `${randomCash}`);
                Score(player, 'Money', 'remove', 10000);
                player.runCommandAsync(`give @s diamond_sword 1 0`);
                player.playSound('random.levelup');
                return
              }
            } else {
              itemToGive = randomItem.ID;
            }
            
            player.sendMessage(`§e§l[§r Random Item §e§l] §r§r§7${randomItem.name}`);
            player.sendMessage(`\n§e§l[§r Random Money §e§l] §r§r§7${randomCash}$`);
            Score(player, 'Money', 'add', `${randomCash}`);
            Score(player, 'Money', 'remove', 10000);
            player.runCommandAsync(`give @s ${randomItem.ID} 1 0`);
            player.playSound('random.levelup');
    
          } else {
            player.sendMessage(`§cNot Enough Money §f${player.name}`);
          }
        }
      });
  }

  function Crate4(player) {
    const Million_cashValues = [10000, 20000, 8000];
  
    new ActionFormData()
      .title('§l§e- Rich crate -§r')
      .body(`
      ╔═══════════╗
      ║      Crate Shop     ║     Chances cash:
      ╠═══════════╣     §a------------§r 
      ║ Type: §aMillion Crate§r  ║    220,000$ 10§e%%§r
      ║                         ║    150,000$ 10§e%%§r
      ║ Items:                 ╝    100,000$ 10§e%%§r
      ║ §a- Swords §r                  
      ║ §a- Apples§r                    Chances item:
      ║ §a- Axes §r                     §a------------§r 
      ║ §a- Money §r                    §aGolden§r Apple 15§e%%§r | §aEnchanted Golden§r Apple 10§e%%§r 
      ║ §a- Boosts §r            ╗     §aNetherite§r Axe 3§e%%§r | §aNetherite§r Sword 2§e%%§r
      ║                         ║    
      ║ Price: $80k          ║     
      ╚═══════════╝


  `)
      .button(`§e   Yes \n§f[Click to buy]`)
      .button(`§e   No \n§f[Don't purchase]`)
      .show(player)
      .then(result => {
        if (result.selection === 0) {
          if (player.score.Money >= 80000){
            const categoryKeys = Object.keys(Rich_items);
            const randomCategoryKey = categoryKeys[Math.floor(Math.random() * categoryKeys.length)];
            const randomCategory = Million_items[randomCategoryKey];
            const itemKeys = Object.keys(randomCategory);
            const randomItemKey = itemKeys[Math.floor(Math.random() * itemKeys.length)];
            const randomItem = randomCategory[randomItemKey];
            
            let randomCash;
            if (Math.random() < 0.10) {  
              const possibleValues = [220000, 150000, 100000]; 
              randomCash = possibleValues[Math.floor(Math.random() * possibleValues.length)];
            } else {
              const filteredCashValues = Million_cashValues.filter(value => value !== 220000 && value !== 150000 && value !== 100000);
              if (filteredCashValues.length > 0) {
                randomCash = filteredCashValues[Math.floor(Math.random() * filteredCashValues.length)];
              } else {
                randomCash = 0; 
              }
            }
            
            let itemToGive;
            if (Math.random() < 100) {  
              const chance = Math.random();
              if (chance < 0.15) { 
                // Golden Apple
                player.sendMessage(`§a§l[§r Random Item §a§l] §r§r§7Golden Apple`);
                player.sendMessage(`\n§a§l[§r Random Money §a§l] §r§r§7${randomCash}$`);
                Score(player, 'Money', 'add', `${randomCash}`);
                Score(player, 'Money', 'remove', 80000);
                player.runCommandAsync(`give @s golden_apple 1 0`);
                player.playSound('random.levelup');
                return
                
                // Enchanted golden apple
              } else if (chance < 0.10) { 
                player.sendMessage(`§a§l[§r Random Item §a§l] §r§r§7Enchanted Golden Apple`);
                player.sendMessage(`\n§a§l[§r Random Money §a§l] §r§r§7${randomCash}$`);
                Score(player, 'Money', 'add', `${randomCash}`);
                Score(player, 'Money', 'remove', 80000);
                player.runCommandAsync(`give @s enchanted_golden_apple 1 0`);
                player.playSound('random.levelup');
                return

                // Netherite axe
              } else if (chance < 0.03) {
                player.sendMessage(`§a§l[§r Random Item §a§l] §r§r§7Netherite Axe`);
                player.sendMessage(`\n§a§l[§r Random Money §a§l] §r§r§7${randomCash}$`);
                Score(player, 'Money', 'add', `${randomCash}`);
                Score(player, 'Money', 'remove', 80000);
                player.runCommandAsync(`give @s netherite_axe 1 0`);
                player.playSound('random.levelup');
                return

                // Netherite sword
              } else if (chance < 0.02) {
                player.sendMessage(`§a§l[§r Random Item §a§l] §r§r§7Netherite Sword`);
                player.sendMessage(`\n§a§l[§r Random Money §a§l] §r§r§7${randomCash}$`);
                Score(player, 'Money', 'add', `${randomCash}`);
                Score(player, 'Money', 'remove', 80000);
                player.runCommandAsync(`give @s netherite_sword 1 0`);
                player.playSound('random.levelup');
                return
              }
            } else {
              itemToGive = randomItem.ID;
            }
            
            player.sendMessage(`§a§l[§r Random Item §a§l] §r§r§7${randomItem.name}`);
            player.sendMessage(`\n§a§l[§r Random Money §a§l] §r§r§7${randomCash}$`);
            Score(player, 'Money', 'add', `${randomCash}`);
            Score(player, 'Money', 'remove', 80000);
            player.runCommandAsync(`give @s ${randomItem.ID} 1 0`);
            player.playSound('random.levelup');
    
          } else {
            player.sendMessage(`§cNot Enough Money §f${player.name}`);
          }
        }
      });
  }

  function Crate5(player) {
    const God_cashValues = [50000, 30000, 10000];
  
    new ActionFormData()
      .title('§l§e- Rich crate -§r')
      .body(`
      ╔═══════════╗
      ║      Crate Shop     ║     Chances cash:
      ╠═══════════╣    §c------------§r 
      ║ Type: §cGod Crate§r    ║    1,000,000$ 10§e%%§r
      ║                         ║    800,000$ 10§e%%§r
      ║ Items:                 ╝    500,000$ 10§e%%§r
      ║ §c- Swords §r                  
      ║ §c- Apples§r                    Chances item:
      ║ §c- Axes §r                     §c------------§r 
      ║ §c- Money §r                    §cGolden§r Apple 25§e%%§r | §cEnchanted Golden§r Apple 15§e%%§r 
      ║ §c- Boosts §r            ╗     
      ║                         ║    
      ║ Price: $300k         ║     
      ╚═══════════╝


  `)
      .button(`§e   Yes \n§f[Click to buy]`)
      .button(`§e   No \n§f[Don't purchase]`)
      .show(player)
      .then(result => {
        if (result.selection === 0) {
          if (player.score.Money >= 300000){
            const categoryKeys = Object.keys(Rich_items);
            const randomCategoryKey = categoryKeys[Math.floor(Math.random() * categoryKeys.length)];
            const randomCategory = God_items[randomCategoryKey];
            const itemKeys = Object.keys(randomCategory);
            const randomItemKey = itemKeys[Math.floor(Math.random() * itemKeys.length)];
            const randomItem = randomCategory[randomItemKey];
            
            let randomCash;
            if (Math.random() < 0.10) {  
              const possibleValues = [220000, 150000, 100000]; 
              randomCash = possibleValues[Math.floor(Math.random() * possibleValues.length)];
            } else {
              const filteredCashValues = God_cashValues.filter(value => value !== 1000000 && value !== 800000 && value !== 500000);
              if (filteredCashValues.length > 0) {
                randomCash = filteredCashValues[Math.floor(Math.random() * filteredCashValues.length)];
              } else {
                randomCash = 0;
              }
            }
            
            let itemToGive;
            if (Math.random() < 100) {  
              const chance = Math.random();
              if (chance < 0.25) { 
                // Golden Apple
                player.sendMessage(`§a§l[§r Random Item §a§l] §r§r§7Golden Apple`);
                player.sendMessage(`\n§a§l[§r Random Money §a§l] §r§r§7${randomCash}$`);
                Score(player, 'Money', 'add', `${randomCash}`);
                Score(player, 'Money', 'remove', 300000);
                player.runCommandAsync(`give @s golden_apple 1 0`);
                player.playSound('random.levelup');
                return
                
                // Enchanted golden apple
              } else if (chance < 0.15) { 
                player.sendMessage(`§a§l[§r Random Item §a§l] §r§r§7Enchanted Golden Apple`);
                player.sendMessage(`\n§a§l[§r Random Money §a§l] §r§r§7${randomCash}$`);
                Score(player, 'Money', 'add', `${randomCash}`);
                Score(player, 'Money', 'remove', 300000);
                player.runCommandAsync(`give @s enchanted_golden_apple 1 0`);
                player.playSound('random.levelup');
                return

                // Netherite axe
                //} else if (chance < 0.03) {
                //player.sendMessage(`§a§l[§r Random Item §a§l] §r§r§7Netherite Axe`);
                //player.sendMessage(`\n§a§l[§r Random Money §a§l] §r§r§7${randomCash}$`);
                //Score(player, 'Money', 'add', `${randomCash}`);
                //Score(player, 'Money', 'remove', 80000);
                //player.runCommandAsync(`give @s netherite_axe 1 0`);
                //player.playSound('random.levelup');
                //return

                // Netherite sword
                //} else if (chance < 0.02) {
                //player.sendMessage(`§a§l[§r Random Item §a§l] §r§r§7Netherite Sword`);
                //player.sendMessage(`\n§a§l[§r Random Money §a§l] §r§r§7${randomCash}$`);
                //Score(player, 'Money', 'add', `${randomCash}`);
                //Score(player, 'Money', 'remove', 80000);
                //player.runCommandAsync(`give @s netherite_sword 1 0`);
                //player.playSound('random.levelup');
                //return
              }
            } else {
              itemToGive = randomItem.ID;
            }
            
            player.sendMessage(`§c§l[§r Random Item §c§l] §r§r§7${randomItem.name}`);
            player.sendMessage(`\n§c§l[§r Random Money §c§l] §r§r§7${randomCash}$`);
            Score(player, 'Money', 'add', `${randomCash}`);
            Score(player, 'Money', 'remove', 300000);
            player.runCommandAsync(`give @s ${randomItem.ID} 1 0`);
            player.playSound('random.levelup');
    
            const server = getServer();
            const allPlayers = server.getOnlinePlayers();
            allPlayers.forEach(p => {
              if (p !== player) {
                p.sendMessage(`§e${player.name} received a lucky item: §r§7${randomItem.name}`);
                p.sendMessage(`§eThey also received lucky cash: §r§7${randomCash}$`);
              }
            });
          } else {
            player.sendMessage(`§cNot Enough Money §f${player.name}`);
          }
        }
      });
  }
  
    

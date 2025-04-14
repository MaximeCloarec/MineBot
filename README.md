# 🛠️ MineBot - Un Bot Minecraft en Node.js

**MineBot** est un bot Minecraft développé en JavaScript avec Node.js, utilisant la bibliothèque [mineflayer](https://github.com/PrismarineJS/mineflayer). Ce projet est conçu pour automatiser diverses tâches dans Minecraft, telles que la collecte de ressources, le crafting d'objets, et bien plus encore ! 🎮

---

## 🚀 Fonctionnalités

- 💡 **Collecte de ressources** : Commandes comme `gather` pour collecter des blocs spécifiques.
- 🔨 **Crafting intelligent** : Crée des objets tels que des planches et des tables de craft.
- 🧭 **Déplacement automatique** : Déplacement vers des joueurs ou des blocs spécifiques.
- 📦 **Gestion d'inventaire** : Liste les objets dans l'inventaire du bot.
- 🛠️ **Facilité de personnalisation** : Architecture modulaire pour ajouter de nouvelles commandes et fonctionnalités.

---

## 🏗️ Structure du Projet

* src/
* ├── commands/
* │   ├── craft.js # Commandes liées au crafting
* │   ├── gather.js # Commandes pour la collecte de ressources
* │   ├── inventory.js # Gestion de l'inventaire
* │   ├── moveTo.js # Déplacement vers des objectifs
* ├── utils/
* │   ├── block.js # Utilitaires pour gérer les blocs
* │   ├── navigation.js # Utilitaires pour les déplacements
* ├── index.js # Point d'entrée des commandes
* ├── app.js # Script principal du bot
* ├── stateChecks.js # Permet au bot de connaitre son status (faim,vie,ect)

- **commands/** : Contient les actions principales que le bot peut exécuter.
- **utils/** : Regroupe les fonctions utilitaires comme la gestion des blocs et des déplacements.

---

## 💻 Installation

1. **Cloner le dépôt :**
   ```bash
   git clone https://github.com/MaximeCloarec/MineBot.git
   cd MineBot

2. **Installer les dépendances :**
    ```bash
    npm install

3. **Configurer le bot :** 
   Assure-toi que ton serveur Minecraft est prêt et modifie le fichier app.js si nécessaire pour configurer l'adresse, le port et le pseudo du bot.

---

   🚨 Commandes Disponibles
En jeu, tape une commande dans le chat pour interagir avec le bot :

| Commande         |                            Description                            |
| ---------------- | :---------------------------------------------------------------: |
| loaded           | Indique que le bot est prêt une fois que les chunks sont chargés. |
| list             |       Affiche la liste des objets dans l'inventaire du bot.       |
| gather <res>     |    Collecte un type de ressource spécifique (ex. log, stone).     |
| breakBlock <res> |               Casse un bloc spécifique à proximité.               |
| find <res>       |              Trouve un bloc spécifique à proximité.               |
| craft <res>      |                     Craft un bloc spécifique                      |

---

🛠️ Comment Ajouter de Nouvelles Commandes
Crée un nouveau fichier dans src/commands (par exemple, example.js).
Ajoute ta fonction dans le fichier :
```javascript
module.exports = {
    exampleCommand: (bot, args) => {
        bot.chat("Ceci est une nouvelle commande !");
    }
};
```
Mets à jour le fichier index.js :
```javascript
module.exports = {
    ...,
    exampleCommand: (bot, args) => require("./commands/example").exampleCommand(bot, args),
};
```
Utilise la commande en jeu : exampleCommand.

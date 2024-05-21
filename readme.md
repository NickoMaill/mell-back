# Welcome on Template-cli - Here is your Nodejs Template Api Application

<!-- <p align="center">
  <img src="public/assets/icon/mstile-150x150.png" />
</p> -->

## I - Pré-requis

pour utiliser l'application vous allez besoin de :

-   un IDE de type [Vscode](https://code-visualstudio-com.translate.goog/?_x_tr_sl=en&_x_tr_tl=fr&_x_tr_hl=fr&_x_tr_pto=sc) ou [Sublime Text](https://www.sublimetext.com/)
-   [nodeJS](https://nodejs.org/en/)
-   [Docker](https://www.docker.com/)
-   une gestionnaire de db comme [pgadmin](https://www.pgadmin.org/) ou [beekeeper](https://www.beekeeperstudio.io/)

## II - Installations

Pour installer le projet suivez les commandes suivantes dans l'ordre :

1. Visez le dossier de votre choix avec votre terminal

2. Clonez le repo en tapant :

```sh
git clone https://github.com/Untel-Offficial/Untel-Api.git
```

3. Placer-vous dans le dossier cloné :

```sh
cd untel-back
```

3. Installez les différentes librairies :

```sh
npm install
```

4. copier le fichier fournis par votre administrateur .env.development.local

5. a la racine du projet executer ensuite la commande

  ```sh
  npm run docker
  ```

  laisser ensuite le processus se terminer.

  **vous devez avoir docker ouvert pour cela fonctionne !**

6. importer ensuite un dump de db (fourni par votre administrateur)
   **nous vous recommandons d'utiliser PGADMIN**
7. Pour lancer l'application executer la commande :

```sh
npm run dev
```

**Excellent vous pouvez tester cette route dans postman `localhost:8000/` pour tester l'api!**
``
## III - Gestion du serveur de production

*Le serveur de production est actuellement hébergé sur [Heroku](https://www.heroku.com/) a l'adresse suivante `https://untel-website-db.herokuapp.com/`. Il est possible de pouvoir acceder a la machine Linux directement depuis votre terminal.*

1. installer la CLI de Heroku 
 ```
 npm install -g heroku-cli 
 ```
 *effectuez un sudo si besoin*.

2. connectez votre machine a Heroku 
  ```
  heroku login
  ```
  cette commande devrait vous ouvrir un navigateur pour que vous puissiez vous connecter.
  Les identifiants vous seront fournis par l'administrateur du site.

Ça y est, vous êtes maintenant connecté a Heroku voici quelque ligne de commande utile pour gérer le serveur

acceder a la machine Linux

```
heroku run bash -app untel-website-db
```

Redémarer le serveur en cas de crash ou autre

```
heroku restart -app untel-website-db
```

Acceder au logs de la machine 

```
heroku logs --app untel-website-db
```
*ajouter `--tail` a la fin de la commande pour passer en mode live*
<template>
  <v-container>
    <h1>Patch notes 📝</h1>
    <h2>
      Patch note BETA 0.20.1: le Patch Stoph qui prefere la ComSA a sa meuf
    </h2>

    <h3>Index</h3>
    <ul>
      <li>☕️ can't unselect teams in filters #192</li>
      <li>☕️ filter by validation of validator #191</li>
      <li>☕️ add forgotten teams #183</li>
      <li>☕️ add forgotten password handlin</li>
    </ul>
    <h3>Validation</h3>
    <ul>
      <li>☕️ rich text editor not disabled when validated by humans #196</li>
      <li>☕️ refuse popup hide FA and is too small #190</li>
      <li>☕️ comments in FA don't take into account break lines #190</li>
    </ul>
    <h3>General</h3>
    <ul>
      <li>☕️ add types of FA #181</li>
      <li>☕️ order by alphabetical order users #180</li>
    </ul>
    <h3>Security</h3>
    <ul>
      <li>☕️ shallow copy on security passes #197</li>
    </ul>
    <ul>
      <li>☕️ fix shallow copies bug</li>
    </ul>
    <h3>Log</h3>
    <ul>
      <li>☕️ add search in materials #180</li>
    </ul>
    <h2>Patch note BETA 0.20: le Patch Mammi 🚨</h2>
    <ul>
      <li>☕️ Le cafe de Hamza</li>
      <li>💀 UN MILLARD DE CORRECTION SUR LES FA</li>
      <li>🚨 OverSigna pour simplifier le taffe de la signa</li>
      <li>🤐 gestion des pass secu dans les FA</li>
    </ul>
    <h2>Patch note BETA 0.19: le Patch FA</h2>
    <ul>
      <li>🥳 Gros rework des FA</li>
      <li>🥳 19.1 Gros rework des FT</li>
      <li>☠️ RIP keycloak, migration vers une authentification home made</li>
    </ul>

    <h2>Patch note BETA 0.18.1 : le Patch Urhino 💰</h2>
    <ul>
      <li>🤯 Mes transactions</li>
      <li>
        🥳 Ajout des etudes dans la liste des orga et recherche par # de tel
      </li>
      <li>🔨 1 milliard de changemenr sur les transactions</li>
      <li>📝 ajout de stat TRES IMPORTANTE</li>
    </ul>
    <h2>Patch note BETA 0.18 : le Patch Moula 💰</h2>
    <ul>
      <li>🔨 plus responsive</li>
      <li>🔨 rework du dashboard</li>
      <li>🤯 ecran SG</li>
      <li>🔨 QoL</li>
      <li>🔒 Plus joli</li>
      <li>🤯 Ajout des tranasctions</li>
      <li>🤯 On ne peut que swiper a droite sur Hamza</li>
    </ul>
    <h2>Patch note BETA 0.17.5 : le Patch Hublot</h2>
    <h3>🤯 Rectification de bugs</h3>
    <ul>
      <li>🔨 un peu plus responsive</li>
      <li>🔨 0.17.6 filtres et cotisation</li>
      <li>🔨fix du background d'acceuil</li>
      <li>🥳 verification des regex avant de les envoyer (Putain de Hublot)</li>
      <li>🤯 0.17.5 changer prenom nom d'un utilisateur et le supprimer ...</li>
      <li>🔨 0.17.4 QoL: trombi, charisme ...</li>
      <li>🔨 HOTFIX correction d'orthographe (Merci Maëlle)</li>
      <li>💻 lint</li>
      <li>🔒 fermeture des FA/FT depuis l'admin</li>
      <li>🔒 l'affect s'affiche que pour les humains</li>
    </ul>

    <h2>Patch note BETA 0.16</h2>
    <h3>🤯 Rectification de bugs et preparation au lancement</h3>
    <ul>
      <li>💻 l'affect marche beaucoup mieux</li>
      <li>🐞 signalisation de bug rederige vers le mail</li>
      <li>🔒 protection de la backend</li>
      <li>📝 demande d'orga dans un creneau de FT</li>
    </ul>

    <h1>Passage a la BETA</h1>
    <h2>Patch note 0.15</h2>
    <h3>🤯 Rectification de bugs</h3>
    <ul>
      <li>🔒 require robust password</li>
      <li>💻 lint project</li>
      <li>🐞 signalisation de bug rederige vers le gitlab</li>
      <li>❤️ autocomplete des amis</li>
      <li>💰 recharge des compte perso s'affiche mieux</li>
      <li>🐞 fix de bug</li>
      <li>📝 fix spelling errors</li>
    </ul>

    <h2>Patch note 0.14</h2>
    <h3>🤯 Rectification de bugs</h3>
    <ul>
      <li>📝 les FAs ont des id simple comme dans assomaker</li>
      <li>🗑 fix de le boutton delete des horaires dans les FA/FT</li>
      <li>🔨 fix des validateur de FT</li>
      <li>📸 fix de l'UI des horraires dans les FT FA</li>
    </ul>

    <h2>Patch note 0.13</h2>
    <h3>🤯 Rectification de bugs</h3>
    <ul>
      <li>🥳 Overbookd est pret pour acceuillir les orga</li>
      <li>🔨 fix des date de naissance</li>
      <li>📝 changement des surnom par les admin</li>
      <li>🔎 ajout de filters pour les humains</li>
      <li>🤑 gestion de virement (Beta)</li>
    </ul>

    <h2>Patch note 0.12</h2>
    <h3>🤯 ajout des filters humains et fix de bug</h3>
    <ul>
      <li>🔎 ajout de recherche par nom/prenom/surnom dans les humains</li>
      <li>🔤 filtrage par team permis des humains</li>
      <li>🤯 fix d'un bug pour bien sauvgarder le matos des FA (Merci Loic)</li>
      <li>
        ⚙ la base de donnee est mtn protege il faut etre co pour y acceder (ca
        change rien pour l'appli mais c'est plus secure mtn)
      </li>
    </ul>

    <h2>Patch note 0.11</h2>
    <h3>🤯 ajout du trombi et de filtres pour l'affect</h3>
    <ul>
      <li>🎆 ajout du trombi</li>
      <li>🔎 ajout de recherche par nom/prenom/surnom dans l'affect</li>
      <li>👀 lecture des infos du pelo selectionner dans l'affect</li>
      <li>🔤 filtrage par roles dans l'affect</li>
      <li>
        🗄 le clicker, page 404 et correction de la date de naissance de stoph
      </li>
    </ul>

    <h2>Patch note 0.10b</h2>
    <h3>
      🔥 hotfix d'un bug qui faisait que toute l'appli crash (Merci Tit), du
      coup la version 0.11 est sorti plus tot que prevu en tant que v0.10b
    </h3>
    <ul>
      <li>📝 ajout d'une page 404 (avec un petit meme b1sur)</li>
      <li>🥳 quand on est stoph on peut voir ca date de naissance</li>
      <li>🔨 LE CLICKER MARCHE</li>
      <li>🧹 nettoyage des fichiers static</li>
      <li>👀 petits corrections de l'interface</li>
    </ul>

    <h2>Patch note 0.10</h2>
    <h3>
      Corrections de quelques bugs signaler sur la page d'inscription et systeme
      de demande d'amis (Merci MAAF ❤️)
    </h3>
    <ul>
      <li>📝 l'appli check si tu as bien mis le meme mdp a l'inscription</li>
      <li>🤪 l'appli explique comment se co apres avoir creer un compte</li>
      <li>🔒 les champs avec un * sont obligatoirs</li>
      <li>😏 les mdp ne sont plus stocke dans la base de donnee</li>
      <li>
        ❤️ quand qqun nous accepte en ami il se rajoute dans la liste d'ami (il
        faut refresh quand meme)
      </li>
      <li>
        🧹 nettoyage du code de la backend (mais personne ne peux remaque la
        diff)
      </li>
      <li>
        👀 preparation pour le magnifique webservice de Tit pour la prochaine
        MaJ
      </li>
    </ul>

    <h2>Patch note 0.9</h2>
    <h3>ajout d'une idee conne d'Adele</h3>
    <ul>
      <li>❤️ ajout de OverTinder 🔥</li>
      <li>📸 possibilite d'ajouter une PP</li>
    </ul>

    <h2>Patch note 0.8</h2>
    <h3>ajout de filtrage pour les FA et fix des FA</h3>
    <ul>
      <li>📝 filtrage des FA par team et par status</li>
      <li>🔎 ajout des recherche de FA</li>
      <li>
        📆 on peut restreindre a qui s'affiche les dispo (hard only, bureau only
        ...)
      </li>
      <li>🔨 correction de bug</li>
    </ul>

    <h2>Patch note 0.7</h2>
    <h3>
      les fix apres les retours de Stoph et Tit, Début de la LOG (marche pas
      encore)️
    </h3>
    <ul>
      <li>
        🚚 interface de la log pour user.log (selectionner un outil demande en
        FT puis valider les FT)
      </li>
      <li>🗑 delete les FT (mercu stoph)</li>
      <li>👀 les icons sont un peu plus propre</li>
      <li>🗑 supp du code inutile (ca charge 0.002s plus rapidement)</li>
      <li>📝 un remercimenet au auteure</li>
      <li>🤯 fix buf des date de naissance qui s'affiche pas</li>
      <li>🤪 les humains ne peuvent plus se donner le role admin ou bureau</li>
      <li>
        📝 corrige un bug causant les FA a ne pas se sauvgarder (merci stoph ❤️)
      </li>
      <li>
        ⏰ on ne peut mettre que des multiple de 15 en minute (fix du format 24h
        )
      </li>
    </ul>

    <h2>Patch note 0.6</h2>
    <h3>les fix apres les retours de Stoph et Paul ❤️</h3>
    <ul>
      <li>
        🔨 ajout des dispo que par les admin humain bureau (modifiable depuis
        l'interface admin)
      </li>
      <li>
        📆 fix de la page calendrier qui affiche les creneau ou le pelo est
        assigné
      </li>
      <li>⚙️ ajout de la page de config (work still in progress)</li>
      <li>
        👀 le champs ou il faut mettre le nom de la FT s'affiche mieux (merci
        stoph)
      </li>
      <li>📈 FIX DU CHARISME s'update apres refresh</li>
    </ul>

    <h2>Patch note 0.5</h2>
    <h3>les fix apres les retours de Tit ❤️</h3>
    <ul>
      <li>🔨 ajout de page de config pour les admins</li>
      <li>🌙 mode sombre reste meme apres refresh</li>
      <li>🐞 interface du bug report depuis overbookd</li>
      <li>🥳 quality of life changes</li>
    </ul>

    <h2>Patch note 0.4</h2>
    <p>les fix apres les retours de Paul et Tit, Merci ❤️</p>
    <ul>
      <li>
        💰 fix des transactions dans les compte perso (pour de vrai cette fois
        ci)
      </li>
      <li>
        📆 possibilite d'ajout de dispo par les admin et bureau (et ajouter des
        creneaux)
      </li>
      <li>🔨 fix du systeme de broadcast (Merci Paul)</li>
      <li>🗑 possibilite de supp les notifications</li>
      <li>😱 l'ajout d'une page de patch note</li>
      <li>🥳 quality of life changes</li>
    </ul>

    <h2>Patch note 0.3</h2>
    <p>les fix apres les retours de Paul, Merci</p>
    <ul>
      <li>💰 fix des transactions dans les compte perso</li>
      <li>
        🎨 admin et bureau peuvent ajouter des roles au gens depuis la page
        humain
      </li>
      <li>😎 n'affiche plus les mdp en claire</li>
      <li>🔖 affiche les champs requis</li>
    </ul>

    <h2>Patch note 0.2</h2>
    <ul>
      <li>
        📈 ajout de la page stats, mais pour l'instant c'est juste un meme
      </li>
      <li>🤷‍♂️ l'affect marche des fois peut etre selon le mood d'overbookd</li>
      <li>🐞 ajout des instructions pour signaler les bug</li>
      <li>🟨 ajout d'un logo de ricard cache</li>
      <li>🔨 fix le logo blanc qui s'affiche pas des fois</li>
      <li>🔨 fix d'un bug ou le compte perso comptait 10 + 10 = 1010</li>
      <li>😎 fix d'un bug ou tous le monde avait 15 charisme</li>
    </ul>
  </v-container>
</template>

<script>
export default {
  name: "PatchNote",
};
</script>

<style scoped></style>

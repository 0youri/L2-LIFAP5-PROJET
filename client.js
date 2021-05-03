/* ******************************************************************
 * Constantes de configuration
 */
const serverUrl = "https://lifap5.univ-lyon1.fr";
const citations = `${serverUrl}/citations`;

/* ******************************************************************
 * Gestion des tabs "Voter" et "Toutes les citations"
 ******************************************************************** */


/**
 * Affiche/masque les divs "div-duel" et "div-tout"
 * selon le tab indiqué dans l'état courant.
 *
 * @param {Etat} etatCourant l'état courant
 */
function majTab(etatCourant) {
  console.log("CALL majTab");
  const dDuel = document.getElementById("div-duel");
  const tDuel = document.getElementById("tab-duel");
  const dTout = document.getElementById("div-tout");
  const tTout = document.getElementById("tab-tout");
  const dAdd = document.getElementById("div-add");
  const tAdd = document.getElementById("tab-add");
  if (etatCourant.tab === "duel")
    modalMajTab(dDuel, tDuel, dTout, tTout, dAdd, tAdd);
  else if ( etatCourant.tab === "tout" )
    modalMajTab(dTout, tTout, dDuel, tDuel, dAdd, tAdd);
  else
    modalMajTab(dAdd, tAdd, dDuel, tDuel, dTout, tTout);
}

/**
 * @brief Fonction affiche/cache les modals tabs
 * @param {id} dShow : div à afficher 
 * @param {id} tShow : tab à afficher
 * @param {id} dHide0 : div à cacher
 * @param {id} tHide0 : tab à cacher
 * @param {id} dHide1 : div à cacher
 * @param {id} tHide1 : tab à cacher
 */
function modalMajTab(dShow,tShow, dHide0, tHide0, dHide1,tHide1)
{
  console.log("CALL modalMajTab(...)");
  dShow.style.display = "flex"; tShow.classList.add("is-active");
  dHide0.style.display = "none"; tHide0.classList.remove("is-active");
  dHide1.style.display = "none"; tHide1.classList.remove("is-active");
}

/**
 * Mets au besoin à jour l'état courant lors d'un click sur un tab.
 * En cas de mise à jour, déclenche une mise à jour de la page.
 *
 * @param {String} tab le nom du tab qui a été cliqué
 * @param {Etat} etatCourant l'état courant
 */
function clickTab(tab, etatCourant) {
  console.log(`CALL clickTab(${tab},...)`);
  if (etatCourant.tab !== tab) {
    etatCourant.tab = tab;
    majPage(etatCourant);
  }
}

/**
 * Enregistre les fonctions à utiliser lorsque l'on clique
 * sur un des tabs.
 *
 * @param {Etat} etatCourant l'état courant 
 */
function registerTabClick(etatCourant) {
  console.log("CALL registerTabClick");
  document.getElementById("tab-duel").onclick = () =>
    clickTab("duel", etatCourant);
  document.getElementById("tab-tout").onclick = () =>
    clickTab("tout", etatCourant);
  document.getElementById("tab-add").onclick = () =>
    clickTab("add", etatCourant);
}

/* ******************************************************************
 * Gestion de la boîte de dialogue (a.k.a. modal) d'affichage de
 * l'utilisateur.
 * ****************************************************************** */

/**
 * Fait une requête GET authentifiée sur /whoami
 * @returns une promesse du login utilisateur ou du message d'erreur
 */
function fetchWhoami(apiKey) {
  return fetch(serverUrl + "/whoami", { headers: { "x-api-key": apiKey } })
    .then((response) => response.json())
    .then((jsonData) => {
      if (jsonData.status && Number(jsonData.status) != 200) {
        return { err: jsonData.message };
      }
      return jsonData;
    })
    .catch((erreur) => ({ err: erreur }));
}

/**
 * Fait une requête sur le serveur et insère le login dans
 * la modale d'affichage de l'utilisateur.
 * @returns Une promesse de mise à jour
 */
function lanceWhoamiEtInsereLogin() {
  const apiKey = document.getElementById("apiKey").value;
  let erreurlogin = document.getElementById("error-login");
  if (apiKey != "")
  {
    return fetchWhoami(apiKey).then((data) =>
    {
      const ok = data.err === undefined;
      if (!ok) erreurlogin.innerHTML= "Erreur: cette clé API n'est pas valide!";
      else Connect(apiKey,data.login);
      return ok;
    });
  }
}


/* ******************************************************************
 * Initialisation de la page et fonction de mise à jour
 * globale de la page.
 * ****************************************************************** */

/**
 * Mets à jour la page (contenu et événements) en fonction d'un nouvel état.
 *
 * @param {Etat} etatCourant l'état courant
 */
function majPage(etatCourant) {
  console.log("CALL majPage");
  majTab(etatCourant);
  registerTabClick(etatCourant);
}

/**
 * Appelé après le chargement de la page.
 * Met en place la mécanique de gestion des événements
 * en lançant la mise à jour de la page à partir d'un état initial.
 */
function initClientCitations() {
  console.log("CALL initClientCitations");
  const etatInitial = {
    tab: "duel",
    loginModal: false,
  };
  majPage(etatInitial);
  charge_donnees(citations, (data) =>
  {
    const tbody = document.getElementById('tbody-classement');
    tbody.innerHTML = filtre_quote_character(data);
    Duel(data);
  });
}

// Appel de la fonction init_client_duels au après chargement de la page
document.addEventListener("DOMContentLoaded", () => {
  console.log("Exécution du code après chargement de la page");
  initClientCitations();
});










////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////










// Partie noté

// Ajouter

/** Add quote
 * @brief Fonction addQuote() permet d'ajouter une nouvelle citation
 */
function addQuote()
{
  console.log("CALL addQuote()");
  const quote = document.getElementById('input-add-quote').value;
  const character = document.getElementById('input-add-character').value;
  const image = document.getElementById('input-add-image').value;
  let characterDirection = 
  document.getElementById('input-add-characterDirection').value;
  if ( characterDirection == "-1" && characterDirection == "0" ) 
    characterDirection = "";
  const origin = document.getElementById('input-add-origin').value;
  if ( quote != "" && character != "" && origin != "" ) {
    const apiKey = document.getElementById('button-deconnect').value;
    requeteAddQuote(apiKey,quote,character,image,characterDirection,origin);
    formAddQuote(quote,character,origin,true);
    setTimeout(updateDataTab, 20);
    return true;
  } else { formAddQuote(quote,character,origin,false); return false; }
}

/**
 * @brief Fonction qui renvoit la requete au serveur 
 * avec une nouvelle citation
 * @param {string} apiKey : clé API
 * @param {string} quote : citation
 * @param {string} character : personnage
 * @param {string} image : lien d'image
 * @param {string} characterDirection : direction d'image
 * @param {string} origin : origine
 */
function requeteAddQuote(apiKey,quote,character,image,characterDirection,origin)
{
  console.log("CALL requeteAddQuote(...)");
  fetch(serverUrl + "/citations", { 
    method: 'POST', 
    headers: { "x-api-key": apiKey, "Content-Type": "application/json" },
    body: JSON.stringify({
      "quote": quote, 
      "character": character, 
      "image": image, 
      "characterDirection": characterDirection, 
      "origin": origin})  });
}

/** Form add quote
 * @brief Fonction formAddQuote() affiche un message d'erreur 
 * si les champs obligatoires ne sont pas remplis
 * @param {String} quote : citation
 * @param {String} character : personnage
 * @param {String} origin : origine
 * @param {Bool} etat : etat du formulaire (true = ajouté, false = erreur)
 */
function formAddQuote(quote,character,origin, etat)
{
  console.log("CALL formAddQuote(...)");
  const input_quote = document.getElementById('input-add-quote');
  const input_character = document.getElementById('input-add-character');
  const input_origin = document.getElementById('input-add-origin');
  document.getElementById('form-message-add').style.display = "flex";
  if ( quote == "" ) input_quote.classList.add('is-danger');
  else input_quote.classList.remove('is-danger');
  if ( character == "") input_character.classList.add('is-danger');
  else input_character.classList.remove('is-danger');
  if ( origin == "" ) input_origin.classList.add('is-danger');
  else input_origin.classList.remove('is-danger');
  etatFormAddQuote(etat);
}

/**
 * @brief Fonction vérifie état du formulaire d'ajout
 * @param {bool} etat 
 */
function etatFormAddQuote(etat)
{
  console.log("etatFormAddQuote(...)");
  if ( etat == false )
  {
    document.getElementById('form-message-add').classList.remove('is-success'); 
    document.getElementById('form-message-add').classList.add('is-danger');
    document.getElementById('form-message-add').innerHTML = `
    <div class="message-body">
    Erreur: Veuillez remplir les champs qui sont en rouge!</div>`;
  } 
  else 
  {
    document.getElementById('form-message-add').classList.remove('is-danger'); 
    document.getElementById('form-message-add').classList.add('is-success');
    document.getElementById('form-message-add').innerHTML = `
    <div class="message-body">Votre citation a été ajouté avec succès!</div>`;
    clearFormAddQuote();
  }
}

/**
 * @brief Fonction clearFormAddQuote() vide tous les champs du formulaire
 */
function clearFormAddQuote()
{
  console.log("CALL clearFormAddQuote()");
  document.getElementById('input-add-quote').value = 
  document.getElementById('input-add-character').value = 
  document.getElementById('input-add-image').value =
  document.getElementById('input-add-origin').value = "";
  document.getElementById('input-add-characterDirection').value = "-1";
}


// Voter

/** Voter
 * @brief Fonction voter() envoie sur le serveur le résultat d'un vote
 * @param {String} winner : id de la personne pour laquelle on a voté
 * @param {String} looser : id de la personne pour laquelle on n'a pas voté
*/
function Voter(winner, looser)
{
  console.log("CALL Voter(...)");
  if ( document.getElementById('button-deconnect') ) {
    const apiKey = document.getElementById('button-deconnect').value;
    fetch(serverUrl + "/citations/duels", {
      method: 'POST',
      headers: { "x-api-key": apiKey, "Content-Type": "application/json" },
      body: JSON.stringify({"winner": winner, "looser": looser})
    });
    initClientCitations();
    return true;
  } else { alert("Veuillez vous connecter!"); return false; } 
}



// Duel

/** Duel
* @brief Fonction affiche les 2 citations à voter
* @param {tab objets} data : base de données du serveur
*/
function Duel(data)
{
  console.log("CALL Duel(...)");
  const left = randomNb(data.length, -1);
  const right = randomNb(data.length, left);
  const button_left = document.getElementById('button-column-left');
  const button_right = document.getElementById('button-column-right');
  const id_left = data[left]._id;
  const id_right = data[right]._id;
  duel_left(data[left].image, data[left].characterDirection, 
    data[left].quote, data[left].character);
  duel_right(data[right].image, data[right].characterDirection, 
    data[right].quote, data[right].character);
  button_left.setAttribute('onclick',`Voter('${id_left}','${id_right}');`);  
  button_right.setAttribute('onclick',`Voter('${id_right}','${id_left}');`);
}

/**
 * @brief Fonction affiche citation à gauche
 * @param {string} image : lien d'image
 * @param {string} characterDirection : direction d'image
 * @param {string} quote : citation
 * @param {string} character : personnage
 */
function duel_left(image, characterDirection, quote, character)
{
  console.log("CALL duel_left(...)");
  const image_column = document.getElementById('image-column-left');
  if ( image !== "" && image !== undefined )
    image_column.innerHTML = imageDirection(image, characterDirection, "Left");
  document.getElementById('title-column-left').innerHTML = `"${quote}"`;
  document.getElementById('subtitle-column-left').innerHTML = `${character}`;
}

/**
 * @brief Fonction affiche citation à droite
 * @param {string} image : lien d'image
 * @param {string} characterDirection : direction d'image
 * @param {string} quote : citation
 * @param {string} character : personnage
 */
function duel_right(image, characterDirection, quote, character)
{
  console.log("CALL duel_right(...)");
  const image_column = document.getElementById('image-column-right');
  if ( image !== "" && image !== undefined )
    image_column.innerHTML = imageDirection(image, characterDirection, "Right");
  document.getElementById('title-column-right').innerHTML = `"${quote}"`;
  document.getElementById('subtitle-column-right').innerHTML = `${character}`;
}


/** Random nombre
 * @brief Fonction randomNb() donne un nombre aléatoire évitant les doublons
 * @param {Number} max : nombre maximal
 * @param {Number} except : nombre à éviter
*/
function randomNb(max, except)
{
  console.log("CALL randomNb(...)");
  const nb = Math.floor(Math.random() * max);
  return nb == except ? randomNb(max, except) : nb;
}

/** Image direction
 * @brief Fonction imageDirection() renvoie le positonnement d'image voulu
 * @param {String} image : image sous forme d'un lien
 * @param {String} characterDirection : position de l'image (Left ou Right)
 * @param {String} direction : position de l'image voulue (Left ou Right)
*/
function imageDirection(image,characterDirection, direction)
{
  console.log("CALL imageDirection(...)");
  if ( (characterDirection == "Left" && direction == "Left") || 
  ( characterDirection == "Right" && direction == "Right" ) ) 
    return `<img src="${image}" />`;
  else return `<img src="${image}" style="transform: scaleX(-1)" />`;
}



// Déconnexion

/** Deconnect
 * @brief Fonction déconnecte une personne
 */
function Deconnect()
{
  console.log("CALL Deconnect()");
  document.getElementById("apiKey").value = "";
  document.getElementById("nav-login").innerHTML = `
  <div class="navbar-end"><div class="navbar-item"><div class="buttons">
  <a id="btn-open-login-modal" class="button is-success" 
  onclick="modalOpen('mdl-login');">Connexion</a></div></div></div>`;
  document.getElementById('tab-add').style.display = "none";
}

/**
 * @brief Fonction remplace modal Connexion par Déconnexion
 * @param {string} apiKey : clé API
 * @param {string} login : numéro d'étudiant
 */
function Connect(apiKey, login)
{
  console.log("CALL Connect(...)");
  document.getElementById("mdl-login").classList.remove("is-active");
  document.getElementById('tab-add').style.display = "flex";
  document.getElementById("nav-login").innerHTML = `
  <div class="navbar-end"><div class="navbar-item">
  <div>Bonjour, ${login} &nbsp;</div>
  <div class="buttons">
  <a class="button is-danger" onclick="Deconnect();">Déconexion</a>
   </div></div></div>`;
}



// Affichage et détail des citations

/**
 * @brief Fonction filtre_quote_character() filtre la base de données
 * @param {tab objets} data : base de données du serveur
 * @returns 
 */
function filtre_quote_character(data)
{
  console.log("CALL filtre_quote_character(...)");
  const data_html = data.map(formate_tr).join('\n');
  return data_html;
}

/**
 * @brief Fonction formate_tr() retourne une donnée sous forme html
 * @param {tab objets} data : objet pointée d'une base de données du serveur
 */
function formate_tr(data)
{
  console.log("CALL formate_tr(...)");
  return `<tr id="${data._id}"><th>x</th>
  <td>${data.character}</td><td>${data.quote}</td>
  <td class="bi bi-info-circle-fill" onclick="modalOpen('info${data._id}')">
  </td></tr>` + format_tr_detail(data);
}

/**
 * @brief Fonction retourne modal d'une donnée sous forme html
 * @param {tab objets} data : objet pointée d'une base de données du serveur
 */
function format_tr_detail(data)
{
  console.log("CALL format_tr_detail(...)");
  let image = `<img  src="${data.image}" width="100px">`;
  if ( data.image === "" || data.image === undefined ) image = "";
  return `<div id="info${data._id}" class="modal">
  <div class="modal-background" 
  onclick="modalClose('info${data._id}');"></div>
  <div class="modal-content box">
  <button class="modal-close is-large" aria-label="close" 
  onclick="modalClose('info${data._id}');"></button>
  <div style="float:left;">${image}</div>
  <div style="line-height:50px;">
  <p><b>Citation:</b> ${data.quote}</p>
  <p><b>Personnage:</b> ${data.character}</p>
  <p><b>Origine:</b> ${data.origin}</p>
  </div></div></div>`;
}


// Autres

/** Modal open
 * @brief Fonction modalOpen() ouvre un modal 
 * @param {String} element : id d'une balise
 */
function modalOpen(element)
{
  console.log("CALL modalOpen(...)");
  document.getElementById(element).classList.add('is-active');
}

/**
 * @brief Fonction modalCLose() ferme un modal 
 * @param {String} element : id d'une balise
 */
function modalClose(element)
{
  console.log("CALL modalClose(...)");
  document.getElementById(element).classList.remove('is-active');
}

/**
 * @brief Fonction met à jour le tableau de citations
 */
function updateDataTab()
{
  console.log("CALL updateDataTab()");
  charge_donnees(citations, (data) => 
  {
    const tbody = document.getElementById('tbody-classement');
    tbody.innerHTML = filtre_quote_character(data); 
  });
}

/**
 * Fonction permettant de charger des données depuis une ressource séparée
 * @param {string} url : lien
 * @param {tab objets} callback : données récuperées
 */
function charge_donnees(url, callback)
{
  console.log("CALL charge_donnees(...)");
  return fetch(url)
    .then((response) => { console.log(response); return response.text() })
    .then((txt) => {console.log(txt); return JSON.parse(txt)})
    .then(callback);
}
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DefaultAccessList = void 0;
exports.DefaultAccessList = [
    // Interfaces (navigation and main sections)
    {
        id: 100, // Préfixe 100 pour les interfaces principales
        name: "HOME",
        nameDescription: "Accès à la page d'accueil de l'application.",
        type: "interface",
    },
    {
        id: 101,
        name: "FICHIERS",
        nameDescription: "Accès à la gestion des fichiers et documents.",
        type: "interface",
    },
    {
        id: 102,
        name: "OPERATION",
        nameDescription: "Accès à la section des opérations bancaires/financières.",
        type: "interface",
    },
    {
        id: 103,
        name: "CREDIT",
        nameDescription: "Accès à la section de gestion des crédits.",
        type: "interface",
    },
    {
        id: 104,
        name: "IDENTIFICATION",
        nameDescription: "Accès à la section d'identification des membres/clients.",
        type: "interface",
    },
    {
        id: 105,
        name: "COMPTABILITE",
        nameDescription: "Accès à la section de comptabilité.",
        type: "interface",
    },
    {
        id: 106,
        name: "BILLETAGE",
        nameDescription: "Accès à la section de gestion du billetage (espèces).",
        type: "interface",
    },
    {
        id: 107,
        name: "PARAMETRES",
        nameDescription: "Accès à la section de configuration des paramètres de l'application.",
        type: "interface",
    },
    {
        id: 108,
        name: "PRODUITS",
        nameDescription: "Accès à la section de gestion des produits/services proposés.",
        type: "interface",
    },
    {
        id: 109,
        name: "APPROVISIONNEMENT",
        nameDescription: "Accès à la section de gestion de l'approvisionnement.",
        type: "interface",
    },
    {
        id: 110,
        name: "LISTE DES OPERATIONS",
        nameDescription: "Accès à la section qui affiche la liste des operations.",
        type: "interface",
    },
    {
        id: 111,
        name: "REGARDER LE SOLDE DES COMPTES",
        nameDescription: "Accès à l'interface de consultation du solde des comptes.",
        type: "interface",
    },
    {
        id: 112,
        name: "LISTE UTILISATEURS/ACCESS",
        nameDescription: "Accès à l'interface de gestion des utilisateurs et de leurs accès.",
        type: "interface",
    },
    {
        id: 113,
        name: "MESSAGES",
        nameDescription: "Accès à l'interface de gestion des messages.",
        type: "interface",
    },
    {
        id: 114,
        name: "SITE WEB",
        nameDescription: "Accès au site web.",
        type: "interface",
    },
    {
        id: 115,
        name: "SITE",
        nameDescription: "Liste des site web que gère l'entreprise",
        type: "interface",
    },
    {
        id: 116,
        name: "Abonnées",
        nameDescription: "Liste des abonnées au site web",
        type: "interface",
    },
    {
        id: 117,
        name: "Blog",
        nameDescription: "Liste des blogs du site web",
        type: "interface",
    },
    {
        id: 118,
        name: "Bloc de texte",
        nameDescription: "Liste des blocs de texte du site web",
        type: "interface",
    },
    {
        id: 119,
        name: "Catégorie des blogs",
        nameDescription: "La liste des catégories des blogs",
        type: "interface",
    },
    {
        id: 120,
        name: "Documentation API site web",
        nameDescription: "Cette interface donne la possibilité au dévéloppeur de connecter l'application ou le site web à cette partie admin",
        type: "interface",
    },
    {
        id: 121,
        name: "Visites",
        nameDescription: "Cette interface affiche les visite en cours sur le site web",
        type: "interface",
    },
    // Taches (Actions spécifiques)
    {
        id: 200, // Préfixe 200 pour les tâches générales
        name: "IDENTIFIER UN MEMBRE",
        nameDescription: "Permet d'identifier un membre/client dans le système.",
        type: "tache",
    },
    {
        id: 201,
        name: "IMPRIMER UN BON DE CAISSE",
        nameDescription: "Permet d'imprimer un bon de caisse.",
        type: "tache",
    },
    {
        id: 202,
        name: "FAIRE UNE FACTURE",
        nameDescription: "Permet de créer et d'émettre une facture.",
        type: "tache",
    },
    {
        id: 203,
        name: "LISTE DES TOUTES LES OPERATIONS",
        nameDescription: "Permet d'afficher la liste de toutes les opérations effectuées.",
        type: "tache",
    },
    {
        id: 204,
        name: "MODIFIER CREDIT",
        nameDescription: "Permet de modifier les informations d'un crédit existant.",
        type: "tache",
    },
    {
        id: 205,
        name: "SUPPRIMER OPERATION VALIDE",
        nameDescription: "Permet de supprimer une opération validée.",
        type: "tache",
    },
    {
        id: 206,
        name: "MODIFIER LE BILLETAGE",
        nameDescription: "Permet de modifier la répartition du billetage (espèces).",
        type: "tache",
    },
    {
        id: 207,
        name: "DONNER ACCESS",
        nameDescription: "Permet d'attribuer des accès à un utilisateur.",
        type: "tache",
    },
    {
        id: 208,
        name: "ENVOIE SMS",
        nameDescription: "Permet d'envoyer des SMS à des membres/clients.",
        type: "tache",
    },
    {
        id: 209,
        name: "REGARDER LE SOLDE DES COMPTES",
        nameDescription: "Permet de regarder le solde des comptes.",
        type: "tache",
    },
    // Operations (Actions liées aux opérations bancaires/financières)
    {
        id: 300, // Préfixe 300 pour les opérations
        name: "ENTREE",
        nameDescription: "Enregistrement d'une entrée d'argent.",
        type: "operation",
    },
    {
        id: 301,
        name: "SORTIE",
        nameDescription: "Enregistrement d'une sortie d'argent.",
        type: "operation",
    },
    {
        id: 302,
        name: "DEPOT",
        nameDescription: "Enregistrement d'un dépôt d'argent.",
        type: "operation",
    },
    {
        id: 303,
        name: "RETRAIT",
        nameDescription: "Enregistrement d'un retrait d'argent.",
        type: "operation",
    },
    {
        id: 304,
        name: "PAYEMENT",
        nameDescription: "Enregistrement d'un payement.",
        type: "operation",
    },
    {
        id: 305,
        name: "VIREMENT",
        nameDescription: "Enregistrement d'un virement d'argent.",
        type: "operation",
    },
    {
        id: 306,
        name: "CREDIT",
        nameDescription: "Enregistrement d'un crédit.",
        type: "operation",
    },
];

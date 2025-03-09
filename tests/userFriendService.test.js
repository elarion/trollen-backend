// Merci à copilot pour une partie des commentaires..
// du coup ça y est j'ai plus de token de génération gratosss.. je dois attendre le 4 avril.
const mongoose = require('mongoose'); // Importe Mongoose pour interagir avec MongoDB
require('dotenv').config(); // Charge les variables d'environnement depuis un fichier .env

const UserFriend = require('../models/users_friends'); // Importe notre modèle Mongoose
const { addFriend } = require('../services/userFriendService'); // Importe la fonction addFriend du service qui n'existe pas encore hahaha

// Avant tous les tests, connexion à la base MongoDB de test
beforeAll(async () => {
    // Se connecte à la base MongoDB avec mon .env
    try {
        await mongoose.connect(process.env.CONNECTION_STRING, { connectTimeoutMS: 2000, timeoutMS: 2000 });
    } catch (error) {
        throw new Error('Connection to mongoose failed =>', error); // mouais ça catch pas mais en meme temps voila quoi, l'idée est louable
    }
});

// Après tous les tests, fermeture de la connexion MongoDB
afterAll(async () => {
    await mongoose.connection.close();
    // Ferme proprement la connexion à la base de données à la fin, youhou, oui logique enfaite, meme si bon le test passe et voilà mais évite des fuite de connexion... 
});

// Après chaque test, suppression des données de la collection... mais en fait je vais pas faire comme ça pour de vrai par ce que bah voila quoi si ça tourne avec déjà des vrais datas...
// Donc je devrais plutot utilisé mongo memory server mais bon y'a un MVP a faire !
afterEach(async () => {
    await UserFriend.deleteMany();
});

// Début du bloc de tests pour la fonction addFriend
describe('addFriend Service', () => {

    // Numéro UNooooOOOoooO : Vérifie qu'on peut ajouter une relation d'amitié dans la collection
    it('should add a friendship in collection users_friends', async () => {
        const user1Id = new mongoose.Types.ObjectId(); // Génère un ID unique pour le premier utilisateur
        const user2Id = new mongoose.Types.ObjectId(); // Génère un ID unique pour le deuxième utilisateur

        const friendship = await addFriend(user1Id, user2Id); // Exécute la fonction addFriend pour créer une relation d'amitié

        expect(friendship).toHaveProperty('_id'); // Vérifie que l'objet retourné possède un identifiant unique
        expect(friendship.user_1.toString()).toBe(user1Id.toString()); // Vérifie que user_1 correspond bien à user1Id
        expect(friendship.user_2.toString()).toBe(user2Id.toString()); // Vérifie que user_2 correspond bien à user2Id
        expect(friendship.status).toBe('pending'); // Vérifie que le statut de la relation est "pending" par défaut parce que bah, faut quand meme le consentement hein...
    });

    //  Numéero Dos : Vérifie qu'on ne peut pas ajouter une relation d'amitié en double
    it('should avoid duplicate friendship', async () => {
        const user1Id = new mongoose.Types.ObjectId(); // Génère un ID unique pour le premier utilisateur
        const user2Id = new mongoose.Types.ObjectId(); // Génère un ID unique pour le deuxième utilisateur

        await addFriend(user1Id, user2Id); // Ajoute une première relation d'amitié
        await expect(addFriend(user1Id, user2Id)).rejects.toThrow('This friendship already exists.');
        // Vérifie qu'une deuxième tentative avec les mêmes IDs
    });

    // Numéro Tres : Vérifie qu'on ne peut pas ajouter une amitié si un ou les deux IDs sont manquants
    it('should refuse adding friend if user id are missing for one or both user', async () => {
        await expect(addFriend(null, 'validID')).rejects.toThrow('User\'s IDs required.');
        // Vérifie si user1Id est null

        await expect(addFriend('validID', null)).rejects.toThrow('User\'s IDs required.');
        // Vérifie si user2Id est null

        await expect(addFriend(null, null)).rejects.toThrow('User\'s IDs required.');
        // Vérifie si les deux IDs sont null
        // Mais en vrai, ce test, faut vraiment être bien fatigué pour qu'il ne passe pas...
    });

});


import {patateChaude} from '../models/spells'

const UserHasParty = require('../models/users_has_parties');

it('Test de la fonction getUserById', () => {
    test("devrait retourner l'utilisateur avec l'id 67c6f3d337c666e9c7754125", () => {
        const user = UserHasParty.getUserById('67c6f3d337c666e9c7754125');
        
        expect(user).toBeDefined();
        expect(user.name).toBe('Nebuchadnezzar');
    });

    test("return undefined si l'utilisateur avec l'id 67c7067a75266cda5a3c15f6 n'existe pas", () => {
        const user = UserHasParty.getUserById('67c7067a75266cda5a3c15f6'); 
        expect(user).toBeUndefined();
    });

    test("devrait retourner l'utilisateur avec l'id 67c7049375266cda5a3c15f0", () => {
        const user = UserHasParty.getUserById('67c7049375266cda5a3c15f0');
        expect(user).toBeDefined();
        expect(user.name).toBe('Neo');
    });
it('Test de la fonction spellAuthorization', () =>{
    test("devrait retourner true si l'utilisateur possède bien le spell")
        const user=UserHasParty.getUserById('67c6f3d337c666e9c7754125')
        const spell = UserHasParty.spellAuthorization(patateChaude)

        expect(user).toBeDefined()
        expect(spell).toBeDefined();
        expect(user.spells.some(e=>e.spell)).toBe(true)
})
})
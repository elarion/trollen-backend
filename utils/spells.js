const spells = {
	// FRANKLIN : ESPACE TOUTES LES 2 LETTRES
	franklin: (content) => {
		if (content.length > 0) {
			const characters = content.split('');

			for (let i = 2; i < characters.length; i += 3) {
				characters.splice(i, 0, ' ');
			}

			return characters.join('');
		}
		return content;
	},

	patatechaude: (content) => {
		if (/^éplucher|eplucher/i.test(content)) {
			return content.slice(9);
		}

		return "SPROUTCH !";
	},

	// BéBéGaiement
	bbgaiement: (content) => {
		// Alogorithme qui double ou tripler les 2 premières lettres de chaque mot de manière aléatoire
		if (content.length > 1) {
			return content
				.split(' ')
				.map(word => {
					// if (word.length <= 1) return word; // Ne pas modifier les mots d'une seule lettre

					const firstTwoChars = word.substring(0, Math.min(2, word.length));
					const rest = word.substring(Math.min(2, word.length));

					// Choisir aléatoirement entre doubler (2) ou tripler (3)
					const multiplier = Math.random() < 0.5 ? 2 : 3;

					// Répéter les deux premières lettres selon le multiplicateur
					const repeatedChars = firstTwoChars.repeat(multiplier);

					return repeatedChars + rest;
				})
				.join(' ');
		}
		return content;
	},

	// CoupéDécalé
	coupdcal: (content) => {
		if (content.length > 1) {
			const mid = Math.floor(content.length / 2);
			return content.slice(mid) + content.slice(0, mid);
		}
		return content;
	},

	// Megaraman : trouve un anagram pour chaque mot
	megaraman: (content) => {
		if (content.length > 1) {
			return content.split(' ').map(word => word.split('').sort().join('')).join(' ');
		}
		return content;
	},

	// Nalrev
	nalrev: (content) => {
		if (content.length > 1) {
			return content.split('').reverse().join('');
		}
		return content;
	},

	// MiroirMiroir
	miroirmiroir: (content) => {
		if (content.length > 1) {
			return content + content.split('').reverse().join('');
		}
		return content;
	},

	// Ssooossa : transforme les consonnes en double "ss"
	ssooossa: (content) => {
		if (content.length > 1) {
			return content.replace(/[bcdfghjklmnpqrstvwxyz]/gi, 'ss');
		}
		return content;
	},

	// Zéconome
	zeconome: (content, pileDeSortsSubis) => {
		if (pileDeSortsSubis.length > 0 && pileDeSortsSubis[0] === 'patateChaude') {
			return content;
		}
		return null;
	},

	// CrayonDansLaBouche
	crayonDansLaBouche: (content, pileDeSortsSubis) => {
		if (pileDeSortsSubis.length > 0 && pileDeSortsSubis[0] === 'bebegaiement') {
			return content;
		}
		return null;
	},

	// NonTe
	nonTe: (content, pileDeSortsSubis) => {
		if (pileDeSortsSubis.length > 0 && pileDeSortsSubis[0] === 'nalrev') {
			return content;
		}
		return null;
	},

	// AntiReflet
	antiReflet: (content, pileDeSortsSubis) => {
		if (pileDeSortsSubis.length > 0 && pileDeSortsSubis[0] === 'miroirMiroir') {
			return content;
		}
		return null;
	},

	// LangueFourchue
	langueFourchue: (content, pileDeSortsSubis) => {
		if (pileDeSortsSubis.length > 0 && pileDeSortsSubis[0] === 'ssooossa') {
			return content;
		}
		return null;
	}
};


module.exports = spells;

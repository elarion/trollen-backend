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
		if (content.startsWith("éplucher ")) {
			return content.slice(9);
		}

		return "SPROUTCH !";
	},

	// BéBéGaiement
	bbgaiement: (content) => {
		if (content.length > 1) {
			return content
				.split(' ')
				.map(word => word.length > 1 ? word[0] + word[1] + word : word)
				.join(' ');
		}
		return content;
	},

	// CoupéDécalé
	coupeDecale: (content) => {
		if (content.length > 1) {
			const mid = Math.floor(content.length / 2);
			return content.slice(mid) + content.slice(0, mid);
		}
		return content;
	},

	// MiroirMiroir
	miroirMiroir: (content) => {
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

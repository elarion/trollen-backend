const spell1 = () => {
	return 'spell1';
}

const spell2 = () => {
	return 'spell1';
}

const spell3 = () => {
	return 'spell1';
}

const coupedecale = (message) => {
	if (message.length > 0) {
		const splitword = message.split('');
		const wordlengthpart1 = (splitword.length / 2);
		const part1 = splitword.slice(0, wordlengthpart1).join('')
		const part2 = splitword.slice(wordlengthpart1).join('')
		return part2 + part1;
	}
}

module.exports = {
	spell1,
	spell2,
	spell3,
	coupedecale
};
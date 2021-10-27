module.exports = addIconsToScope;

// Adding icons

function getWordsFromString(theString) {
	const wordsList = theString.split(/(?=[A-Z])|-|_/);

	const words = {};
	for (let i = 0; i < wordsList.length; i++) {
		const loopedWord = wordsList[i].toLowerCase();
		words[loopedWord] = true;
	}

	return words;
}

const ruleCheckNames = [
	'isExactly',
	'hasText',
	'hasWord',
	'hasExactly',
	'hasTexts',
	'hasWords',
];

const makeCheckFunction = {
	isExactly(theString) {
		return (theWord) => theString === theWord;
	},
	hasText(theString) {
		const lowerCaseString = theString.toLowerCase();
		return (theWord) => lowerCaseString.includes(theWord);
	},
	hasWord(theString) {
		const words = getWordsFromString(theString);
		return (theWord) => words[theWord];
	},
	hasExactly(isExactly) {
		return (theExactTexts) => {
			for (let i = 0; i < theExactTexts.length; i++) {
				if (isExactly(theExactTexts[i])) {
					return true;
				}
			}
			return false;
		};
	},
	hasTexts(hasText) {
		return (theTexts) => {
			for (let i = 0; i < theTexts.length; i++) {
				if (hasText(theTexts[i])) {
					return true;
				}
			}
			return false;
		};
	},
	hasWords(hasWord) {
		return (theWords) => {
			for (let i = 0; i < theWords.length; i++) {
				if (hasWord(theWords[i])) {
					return true;
				}
			}
			return false;
		};
	},
};

const iconRules = {
	prop: { hasWord: 'props' },
	loop: {
		hasExactly: ['i', 'j'],
		hasWord: 'index',
	},
	length: { isExactly: 'length' },
	array: { hasTexts: ['array', 'list'] },
	text: { hasWords: ['text', 'string', 'str'] },
	key: { hasWords: ['key', 'keys'] },
	react: { hasWord: 'react' },
	style: { hasText: 'style' },
	event: {
		hasTexts: ['event', 'action'],
		isExactly: 'e',
		hasWords: ['press', 'pressed'],
	},
	options: {
		hasWord: 'options',
		hasText: 'settings',
	},
	global: { hasText: 'global' },
	identification: { hasWord: 'id' },
	state: { hasWord: 'state' },
	color: { hasWords: ['color', 'colour'] },
	page: { hasWord: 'page' },
	link: { hasWords: ['link', 'url'] },
	location: { hasWord: 'location' },
	history: { hasWord: 'history' },
	tag: { hasWords: ['tag', 'name'] },
	value: {
		hasWord: 'value',
		isExactly: 'v',
	},
	info: { hasText: 'info' },
	user: { hasWord: 'user' },
	group: { hasWord: 'group' },
	container: { hasWord: 'container' },
	image: {
		hasWords: ['image', 'img'],
		hasText: 'background',
	},
	path: { hasText: 'path' },
	child: { hasText: 'child' },
	order: {
		hasWord: 'order',
		hasText: 'sort',
	},
	className: { hasText: 'classname' },
	chain: { hasWord: 'chain' },
	this: { hasWord: 'this' },
	width: { hasWord: 'width' },
	height: { hasWord: 'height' },
	up: { hasWords: ['top', 'up'] },
	down: { hasWords: ['bottom', 'down'] },
	left: { hasWord: 'left' },
	right: { hasWord: 'right' },
	size: { hasWord: 'size' },
	position: { hasText: 'position' },
	object: { hasWord: 'object' },
	new: { hasWord: 'new' },
	data: { hasWord: 'data' },
	item: { hasWord: 'item' },
	tags: { hasWords: ['tags', 'names'] },
	element: { hasWord: 'element' },
	home: { hasWord: 'home' },
	timer: { hasText: 'time' },
	connect: { hasText: 'connect' },
	head: { hasText: 'head' },
	foot: { hasText: 'foot' },
	target: { hasText: 'target' },
	speed: { hasText: 'speed' },
	cache: { hasText: 'cache' },
	remove: { hasTexts: ['remove', 'delete'] },
	layer: { hasWord: 'layer' },
	layers: { hasWord: 'layers' },
	content: { hasText: 'content' },
	bar: { hasWord: 'bar' },
	visible: { hasText: 'visible' },
	camera: { hasText: 'camera' },
	light: { hasWord: 'light' },
	scene: { hasWord: 'scene' },
	mesh: { hasText: 'mesh' },
	div: { hasWord: 'div' },
	click: { hasText: 'click' },
	add: { hasWord: 'add' },
	package: { hasText: 'package' },
	bug: { hasWords: ['bug', 'bugs'] },
	storage: { hasWords: ['store', 'storage'] },
	direction: { hasText: 'direction' },
	change: { hasTexts: ['change', 'update'] },
	warn: { hasText: 'warn' },
	search: { hasText: 'search' },
	check: { hasText: 'check' },
	calculate: { hasWords: ['calculate', 'calculates', 'calc'] },
	sleep: { hasText: 'sleep' },
	clean: { hasText: 'clean' },
	undo: { hasText: 'undo' },
	random: { hasWords: ['random', 'rand'] },
	load: { hasText: 'load' },
	filter: { hasText: 'filter' },
	save: { hasText: 'save' },
	keyboard: { hasText: 'keyboard' },
	desktop: { hasText: 'desktop' },
	mobile: { hasText: 'mobile' },
	tablet: { hasText: 'tablet' },
	transform: { hasText: 'transform' },
	transition: { hasText: 'transition' },
	edit: { hasText: 'edit' },
	construct: { hasTexts: ['construct', 'build'] },
	super: { hasWord: 'super' },
	fix: { hasText: 'fix' },
	border: { hasText: 'border' },
	disable: { hasText: 'disable' },
	next: { hasText: 'next' },
	previous: { hasText: 'previous' },
	complete: { hasTexts: ['done', 'complete', 'finish'] },
	render: { hasWord: 'render' },
};

const iconRuleNames = Object.keys(iconRules);

function addIconsToScope(token) {
	let newScope = '';

	const isExactly = makeCheckFunction.isExactly(token);
	const hasText = makeCheckFunction.hasText(token);
	const hasWord = makeCheckFunction.hasWord(token);
	const hasExactly = makeCheckFunction.hasExactly(isExactly);
	const hasTexts = makeCheckFunction.hasTexts(hasText);
	const hasWords = makeCheckFunction.hasWords(hasWord);

	const ruleFunctions = {
		isExactly,
		hasText,
		hasWord,
		hasExactly,
		hasTexts,
		hasWords,
	};

	for (let i = 0; i < iconRuleNames.length; i++) {
		const theIconName = iconRuleNames[i];
		const theIconRules = iconRules[theIconName];

		for (let j = 0; j < ruleCheckNames.length; j++) {
			const theCheckName = ruleCheckNames[j];

			if (theIconRules[theCheckName]) {
				if (ruleFunctions[theCheckName](theIconRules[theCheckName])) {
					if (!newScope) newScope += ' syntax--semanticon';
					newScope += ' syntax--' + theIconName;
				}
			}
		}
	}

	return newScope;
}

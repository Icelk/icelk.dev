const themes = ['ice', 'sol'];

const cycleTheme = async () => {
	let theme = localStorage.getItem('theme') || ((window.getComputedStyle(document.documentElement).getPropertyValue('content') === '"light"') ? themes[1] : themes[0]);

	if (theme === themes[1]) {
		localStorage.setItem('theme', themes[0]);
		document.body.classList.replace(themes[1], themes[0]);
	} else {
		localStorage.setItem('theme', themes[1]);
		document.body.classList.replace(themes[0], themes[1]);
	}
}
const changeTheme = async (newTheme) => {
	localStorage.setItem('theme', newTheme);
	let body = document.body;

	for (let theme = 0; theme < themes.length; theme++) {
		body.classList.remove(themes[theme]);
	}
	body.classList.add(newTheme);
}


const init = async () => {
	// Load or define theme and hue setting
	let storedTheme = localStorage.getItem('theme') || ((window.getComputedStyle(document.documentElement).getPropertyValue('content') === '"light"') ? themes[1] : themes[0]);

	document.body.classList.add(storedTheme);

	for (let i = 0; i < themes.length; i++) {
		const element = themes[i];

	}
	for (let index = 0; index < themes.length; index++) {
		let button = document.getElementById(`set-theme-${themes[index]}`);
		button.addEventListener('click', () => changeTheme(themes[index]));
	}

	const projects = document.getElementById("top-bar").children;
	for (let child = 0; child < projects.length; child++) {
		const listItem = projects[child];
		const listItemChildren = listItem.children;
		let link;
		for (let liChild = 0; liChild < listItemChildren.length; liChild++) {
			const element = listItemChildren[liChild];
			let href = element.getAttribute("href");

			if (href !== undefined) {
				link = href;
				break;
			}
		}
		if (link === null) {
			continue;
		}

		if (link === window.location.pathname) {
			listItem.classList.add("visiting");
			break;
		}
	}
}

init();

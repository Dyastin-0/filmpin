const messageTemplate = (title, message, link, linkTitle) => {
	return (
		`
		<!DOCTYPE html>
		<html lang="en">

		<head>
			<meta charset="UTF-8">
			<meta name="viewport" content="width=device-width, initial-scale=1.0">
			<title>${title}</title>
			<style>
				:root {
					font-family: Inter, system-ui, Avenir, Helvetica, Arial, sans-serif;
					line-height: 1.5;
					font-weight: 400;
					background-color: #242424;
					font-synthesis: none;
					text-rendering: optimizeLegibility;
					-webkit-font-smoothing: antialiased;
					-moz-osx-font-smoothing: grayscale;

					--bg-primary: #F5F7F8;
					--bg-secondary: #EEEEEE;
					--accent: #FFFFFF;
					--highlight: #508C9B;
					--text-highlight: #FFFFFF;
					--text-secondary: #373A40;
					--text-primary: #686D76;
					--error: #C71B29;
					--success: #0E9B71;
				}

				html,
				body {
					height: calc(100% - 1rem);
					margin: 0;
				}

				body {
					display: flex;
					justify-content: center;
					align-items: center;
					padding: 1rem;
					background-color: var(--bg-secondary);
				}

				.parent {
					display: flex;
					justify-content: center;
					align-items: center;
					width: 100%;
					height: 100%;
					border-radius: 10px;
					background-color: var(--bg-primary);
				}

				.container {
					display: flex;
					flex-direction: column;
					width: calc(100% - 2rem);
					max-width: 250px;
					margin: 1rem;
					padding: 1rem;
					gap: 1rem;
					background-color: var(--accent);
					border-radius: 10px;
					box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.02);
					text-align: center;
				}

				h1 {
					font-size: 18px;
					margin: 0;
					color: var(--text-primary);
				}

				p {
					font-size: 0.75rem;
					margin: 0;
					color: var(--text-primary);
				}
					
				a {
					font-size: 0.75rem;
					color: var(--highlight);
					text-decoration: underline;
					text-underline-offset: 0.2rem;
				}
			</style>
		</head>

		<body>
			<div class="parent">
				<div class="container">
					<h1>${title}</h1>
					<p>${message}</p>
					${link ? `<a href='${link}'>${linkTitle}</a>` : ''}
				</div>
			</div>
		</body>

		</html>
		`
	);
}

module.exports = {
	messageTemplate
}
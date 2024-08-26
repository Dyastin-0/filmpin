const emailTemplate = (title, message, link, linkTitle) => {
	return (
		`
		<!DOCTYPE html>
		<html lang='en'>

		<head>
			<meta charset='UTF-8'>
			<meta name='viewport' content='width=device-width, initial-scale=1.0'>
			<title>${title}</title>
		</head>

		<body style='margin: 0; padding: 0; font-family: Arial, sans-serif;'>
			<center style='width: calc(100% - 2rem); padding: 1rem;'>
				<table style='width: 100%; max-width: 250px; margin: 0 auto; padding: 1rem; background-color: #FFFFFF; border: 1px solid #DDDDDD; border-radius: 10px; text-align: center;'>
					<tr>
						<td>
							<h1 style='font-size: 18px; color: #686D76; margin-bottom: 0.5rem;'>${title}</h1>
							<p style='font-size: 12px; color: #686D76; margin-bottom: 1rem;'>${message}</p>
							${link ? `<a href='${link}' style='font-size: 12px; color: #508C9B; text-decoration: underline;'>${linkTitle}</a>` : ''}
						</td>
					</tr>
				</table>
			</center>
		</body>

		</html>
		`
	);
}

module.exports = {
	emailTemplate
}

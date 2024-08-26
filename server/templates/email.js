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
				<table style='width: 100%; max-width: 250px; margin: 0 auto; padding: 1rem; background-color: #FFFFFF; border: 1px solid #DDDDDD; border-radius: 10px;'>
					<tr>
						<td style='text-align: center;'>
							<div style="display: inline-block; text-align: center; font-weight: 600;">
								<h1 style="display: inline; color: #508C9B; margin: 0;">Film</h1>
								<h1 style="display: inline; color: #686D76; margin: 0;">pin</h1>
							</div>
							<h1 style='font-size: 16px; color: #686D76; margin-top: 1rem; margin-bottom: 0.3rem;'>${title}</h1>
							<p style='font-size: 12px; color: #686D76; margin-bottom: 0.3rem;'>${message}</p>
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

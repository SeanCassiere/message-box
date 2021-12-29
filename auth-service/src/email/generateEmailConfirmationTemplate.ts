export function generateEmailConfirmationTemplate({
	token,
	host,
	path,
}: {
	token: string;
	host: string;
	path: string;
}) {
	const body = `
  <meta charset="utf-8" /><meta name="viewport" content="width=device-width" /><meta http-equiv="X-UA-Compatible" content="IE=edge" /><meta name="x-apple-disable-message-reformatting" />
<title></title>
<link href="https://fonts.googleapis.com/css?family=Poppins:200,300,400,500,600,700" rel="stylesheet" />
<center style="width: 100%; background-color: #f1f1f1; font-family: 'Poppins', sans-serif;">
<div style="
					display: none;
					font-size: 1px;
					max-height: 0px;
					max-width: 0px;
					opacity: 0;
					mso-hide: all;
					font-family: sans-serif;
				">&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;</div>

<div style="max-width: 600px; margin: 0 auto">
<table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="margin: auto" width="100%">
	<tbody>
		<tr>
			<td style="padding: 1em 2.5em 0 2.5em; background-color: #ffffff" valign="top">
			<table border="0" cellpadding="0" cellspacing="0" role="presentation" width="100%">
				<tbody>
					<tr>
						<td style="text-align: center">
						<h1 style="margin: 0"><a href="https://rentallsoftware.com" style="
															color: #36D1B7;
															font-size: 24px;
															font-weight: 700;
															font-family: 'Poppins', sans-serif;
															text-decoration: none;
														" target="_blank">MessageBox</a></h1>
						</td>
					</tr>
				</tbody>
			</table>
			</td>
		</tr>
		<!-- end tr -->
		<tr>
			<td style="padding: 2em 0 4em 0; background-color: #ffffff; position: relative; z-index: 0" valign="middle">
			<table border="0" cellpadding="0" cellspacing="0" role="presentation" width="100%">
				<tbody>
					<tr>
						<td style="padding: 0 2.5em; text-align: center; padding-bottom: 3em">
						<div style="color: rgba(0, 0, 0, 0.3)">
						<h2 style="color: #000; font-size: 34px; margin-bottom: 0; font-weight: 500; line-height: 1.4">Confirm your account.</h2>
						</div>
						</td>
					</tr>
					<tr>
						<td style="text-align: center">
						<div style="border: 1px solid rgba(0, 0, 0, 0.05); max-width: 50%; margin: 0 auto; padding: 2em"><img alt="" src="https://i.ibb.co/4YVjXcG/email.png" style="
															width: 100px;
															max-width: 600px;
															height: auto;
															margin: auto;
															display: block;
															padding-bottom: 20px;
														" />
						<h3 style="
															margin-bottom: 0;
															font-family: 'Poppins', sans-serif;
															color: #000000;
															margin-top: 0;
															font-weight: 400;
														">Click the link below</h3>

						<p><a href="${host}${path}${token}" style="
																text-decoration: none;
																padding: 10px 15px;
																display: inline-block;
																border-radius: 5px;
																background: #36D1B7;
																color: #ffffff; font-weight: 800;
															" target="_blank">CONFIRM ACCOUNT</a>&nbsp;</p>

						<p><a href="${host}${path}${token}" style="color: rgba(0, 0, 0, 0.3); text-decoration: underline; font-size: 12px;" target="_blank">something else here</a></p>
						</div>
						</td>
					</tr>
				</tbody>
			</table>
			</td>
		</tr>
		<!-- end tr --><!-- 1 Column Text + Button : END -->
	</tbody>
</table>

<table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="margin: auto" width="100%">
	<tbody>
		<tr>
			<td class="bg_light footer email-section" style="
									background: #f7fafa;
									border-top: 1px solid rgba(0, 0, 0, 0.05);
									color: rgba(0, 0, 0, 0.5);
									padding: 1rem 1rem 2.5em 1rem;
								" valign="middle">&nbsp;</td>
		</tr>
	</tbody>
</table>
<!-- end: tr -->

<p style="padding: 1rem 0.8rem; margin: 0; font-size: 11px;">* The pricing mentioned above only applies to the selected booking time. The final price may be subject to change based on your actual rental duration and/or usage.</p>
</div>
</center>

  `;

	return body;
}

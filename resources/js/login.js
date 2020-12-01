$(() => {
	if ($('#login-form').length) {
		$('#login-form').validate({
			rules: {
				email: {
					required: true,
					email: true,
				},
				password: {
					required: true,
				},
			},
			messages: {
				email: {
					required: 'Please enter an email address',
					email: 'Please enter a valid email',
				},
				password: {
					required: 'Please enter a password',
				},
			},
			submitHandler: (form) => {
				form.submit();
			},
		});
	}
});

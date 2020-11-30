$(() => {
	$.validator.methods.passwordrules = function (value, element) {
		return this.optional(element) || /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{8,}$/.test(value);
	};

	if ($('#register-form').length) {
		$('#register-form').validate({
			rules: {
				nickname: {
					required: true,
					minlength: 4,
					maxlength: 16,
				},
				email: {
					required: true,
					email: true,
				},
				password: {
					required: true,
					passwordrules: true,
				},
				confirm: {
					required: true,
					equalTo: '#password',
				},
			},
			messages: {
				nickname: {
					required: 'Please provide a valid nickname',
					minlength: 'Nickname must be at least 4 characters long',
					maxlength: 'Nickname must be at most 16 characters long',
				},
				email: {
					required: 'Please provide an email address',
					email: 'Please provide a valid email',
				},
				password: {
					required: 'Please provide a password',
					passwordrules:
						'The password must contain at least: 8 characters, 1 uppercase, 1 lowercase, 1 number',
				},
				confirm: {
					required: 'Please confirm the password',
					equalTo: 'The passwords must match',
				},
			},
			submitHandler: (form) => {
				form.submit();
			},
		});
	}
});

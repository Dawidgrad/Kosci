$(() => {
	$.validator.methods.passwordrules = function (value, element) {
		return this.optional(element) || /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{8,}$/.test(value);
	};

	if ($('#passwordForm').length) {
		$('#passwordForm').validate({
			rules: {
				oldPassword: {
					required: true,
				},
				newPassword: {
					required: true,
					passwordrules: true,
				},
				confirm: {
					required: true,
					equalTo: '#newPassword',
				},
			},
			messages: {
				oldPassword: {
					required: 'Please provide current password',
				},
				newPassword: {
					required: 'Please provide a new password',
					passwordrules:
						'The password must contain at least: 8 characters, 1 uppercase, 1 lowercase, 1 number',
				},
				confirm: {
					required: 'Please confirm the new password',
					equalTo: 'The passwords must match',
				},
			},
			submitHandler: (form) => {
				$('<input />').attr('type', 'hidden').attr('name', 'passwordChange').attr('value', true).appendTo(form);
				$('<input />')
					.attr('type', 'hidden')
					.attr('name', 'nickname')
					.attr('value', localStorage.nickname)
					.appendTo(form);
				form.submit();
			},
		});
	}

	if ($('#emailForm').length) {
		$('#emailForm').validate({
			rules: {
				oldEmail: {
					required: true,
					email: true,
				},
				newEmail: {
					required: true,
					email: true,
				},
			},
			messages: {
				oldEmail: {
					required: 'Please provide current email address',
					email: 'Please provide a valid email',
				},
				newEmail: {
					required: 'Please provide a new email address',
					email: 'Please provide a valid email',
				},
			},
			submitHandler: (form) => {
				$('<input />').attr('type', 'hidden').attr('name', 'emailChange').attr('value', true).appendTo(form);
				form.submit();
			},
		});
	}

	if ($('#nicknameForm').length) {
		$('#nicknameForm').validate({
			rules: {
				newNickname: {
					required: true,
					minlength: 4,
					maxlength: 16,
				},
			},
			messages: {
				newNickname: {
					required: 'Please provide a valid nickname',
					minlength: 'Nickname must be at least 4 characters long',
					maxlength: 'Nickname must be at most 16 characters long',
				},
			},
			submitHandler: (form) => {
				$('<input />').attr('type', 'hidden').attr('name', 'nicknameChange').attr('value', true).appendTo(form);
				form.submit();
			},
		});
	}
});

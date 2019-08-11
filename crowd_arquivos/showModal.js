(function () {
	'use strict';

	let $donationModal = $('.modal'),
		$donateButtons = $('.js-btn-donate');

	$donateButtons.on('click', () => {
		$donationModal.modal();
	});
})();

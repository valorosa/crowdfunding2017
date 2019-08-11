(function () {
	'use strict';

	const TOOLTIP_MESSAGES = {
		'texto': 'tooltip',
	};

	let $abbrTooltips = $('.abbr-tooltip');

	$abbrTooltips.tooltip({
		container: 'body',
		title: function () {
			return TOOLTIP_MESSAGES[$(this).text()];
		},
	});
})();

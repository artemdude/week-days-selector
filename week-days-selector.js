function WeekDaysSelector(el, options) {
	options.labels = options.labels || {};

	var $container = $(el),
		$button,
		$list,
		$noneSelectedLabel,
		$allSelectedLabel,
		$itemsSelectedLabel,

		init,
		setValue,
		getValue,
		disable,
		enable,
		getArrayValue,
		getFlagFromArray,
		getArrayFromFlag,
		render,
		bindElements,
		selectItems,
		checkItems,
		getItemValue,
		getItemLabel,

		onCheckboxChange,
		onLiClick,
		onButtonClick,
		hideList,
		showList,

		data = options.data,
		isOpened = options.isOpened || false,
		isDisabled = options.isDisabled || false,
		selectedValue = options.selectedValue || 0,

		selectedValuesArray = [],
		selectedLabelsArray = [],

		noneLabel = options.labels.none || 'Select Item',
		allLabel = options.labels.all || 'All Items';

	getValue = function () {
		return getFlagFromArray(selectedValuesArray);
	};

	setValue = function (val) {
		selectedValuesArray = getArrayFromFlag(val);
		checkItems();
		selectItems();
	};

	disable = function () {
		$button.prop('disabled', true);

		if ($list.is(':visible')) {
			$list.hide();
		}

		isDisabled = true;
	};

	enable = function () {
		$button.prop('disabled', false);
		isDisabled = false;
	};

	getArrayValue = function () {
		return selectedValuesArray;
	};

	init = function () {
		$container.html(render()).addClass('dropdown week-day-selector');
		bindElements();
		setValue(selectedValue);
	};

	bindElements = function() {
		$button = $container.find('.dropdown-toggle');
		$list = $container.find('.dropdown-menu');
		$noneSelectedLabel = $container.find('.none-selected');
		$allSelectedLabel = $container.find('.all-selected');
		$itemsSelectedLabel = $container.find('.items-selected');

		$(document).on('click', hideList);
		$button.on('click', onButtonClick);
		$list.on('click', 'li', onLiClick);
		$list.on('change', 'input[type=checkbox]', onCheckboxChange);
	};

	selectItems = function () {
		var itemsCount = $list.find('li').length;

		$allSelectedLabel.toggle(selectedLabelsArray.length === itemsCount);
		$itemsSelectedLabel.toggle(selectedLabelsArray.length > 0 && selectedLabelsArray.length < itemsCount);
		$noneSelectedLabel.toggle(selectedLabelsArray.length === 0);
		$itemsSelectedLabel.text(selectedLabelsArray.join(", "));
	};

	checkItems = function () {
		selectedLabelsArray = [];
		$list.find('input').prop('checked', false);

		$list.find('input').each(function (i, item) {
			if ($.inArray(getItemValue($(item)), selectedValuesArray) !== -1) {
				$(item).prop('checked', true);
				selectedLabelsArray.push(getItemLabel($(item)));
			}
		});
	};

	onCheckboxChange = function (e) {
		selectedValuesArray = [];
		selectedLabelsArray = [];

		$list.find('input').each(function(i, item) {
			if ($(item).is(':checked')) {
				selectedValuesArray.push(getItemValue($(item)));
				selectedLabelsArray.push(getItemLabel($(item)));
			}
		});

		selectItems();

		if (typeof options.onChange === 'function') {
			options.onChange(getItemValue($(this)), $(this).is(':checked'));
		}

		e.stopPropagation();
	};

	onLiClick = function (e) {
		//prevent closing the popup
		e.stopPropagation();
	};

	onButtonClick = function (e) {
		if (isOpened) {
			hideList();
		}
		else {
			showList();
		}

		e.stopPropagation();
	};

	hideList = function () {
		$list.hide();

		if (isOpened) {
			isOpened = false;

			if (typeof options.onHide === 'function') {
				options.onHide(getFlagFromArray(selectedValuesArray));
			}
		}
	};

	showList = function() {
		$list.show();

		if (!isOpened) {
			isOpened = true;

			if (typeof options.onShow === 'function') {
				options.onShow(getFlagFromArray(selectedValuesArray));
			}
		}
	};

	render = function () {
		var result = '<button class="btn btn-default dropdown-toggle" ' + (isDisabled ? 'disabled="disabled"' : '') + ' type="button">' +
					'<span class="none-selected">' + noneLabel + '</span>' +
					'<span class="all-selected">' + allLabel + '</span>' +
					'<span class="items-selected"></span>' +
					'<span class="caret"></span>' +
					'</button><ul class="dropdown-menu">';

		for (var i = 0; i < data.length; i++) {
			result += '<li><a href="javascript:void(0);"><label class="checkbox"><input type="checkbox" data-value="' + data[i].value + '" data-label="' + (data[i].short ? data[i].short : data[i].title) + '"> ' + data[i].title + '</label></a></li>';
		}

		result += '</ul>';

		return result;
	};

	getItemValue = function(itemEl) {
		return Number(itemEl.data('value'));
	};

	getItemLabel = function (itemEl) {
		return itemEl.data('label');
	};

	getFlagFromArray = function (arrayValue) {
		var result = 0;

		if (arrayValue.length) {
			result = arrayValue.reduce(function (a, b) {
				return a + b;
			});
		}

		return result;
	};

	getArrayFromFlag = function (flagValue) {
		var i = 0, s, c,
			result = [],
			values = $.map(data, function (n) {
				return n.value;
			});

		for (i; i < values.length; i++) {
			c = values[i],
			s = (flagValue & c) === c;

			if (s) {
				result.push(c);
			}
		}

		return result;
	};

	init();

	this.setValue = setValue;
	this.getValue = getValue;
	this.disable = disable;
	this.enable = enable;
	this.getArrayValue = getArrayValue;
};
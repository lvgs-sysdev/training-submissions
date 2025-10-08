function parseDate(dateString) {
	const monthNames = [
		'Jan',
		'Feb',
		'Mar',
		'Apr',
		'May',
		'Jun',
		'Jul',
		'Aug',
		'Sep',
		'Oct',
		'Nov',
		'Dec',
	];

	const date = new Date(dateString);

	const day = date.getUTCDate();
	const month = monthNames[date.getUTCMonth()];
	const year = date.getUTCFullYear();

	const formattedDay = String(day).padStart(2, '0');

	const formattedDate = `${formattedDay} ${month} ${year}`;

	return formattedDate;
}

export default parseDate;

function paramToValue(param) {
	const urlParams = new URLSearchParams(window.location.search);
	const targetValue = urlParams.get(param);
	const sanitizedTargetValue = DOMPurify.sanitize(targetValue);
	return sanitizedTargetValue;
}

export default paramToValue;

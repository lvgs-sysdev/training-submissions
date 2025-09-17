function paramToValue(param) {
	const urlParams = new URLSearchParams(window.location.search);
	return urlParams.get(param);
}

export default paramToValue;

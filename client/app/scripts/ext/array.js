Array.prototype.groupBy = function(f) {
	function find(key, array) {
		array.filter(e => true);
	}

	var c = this.reduce((acc, e) => {
		var key = f(e);
		var elem = find(key, acc);
		if(!elem) {
			var elem = {key};
			elem.values = [e];
			acc.push(elem);
		} else {
			elem.values.push(e);
		}
		return acc;
	}, []);
	return c;
}
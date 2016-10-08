
//Start off with what passes the first test.
function KNN(kSize){
	this.kSize = kSize;
	this.points = [];
}

KNN.prototype.train = function(dataArr) {
	this.points = this.points.concat(dataArr);
}


KNN.prototype._distance = function(arr1, arr2) {
	return Math.sqrt(arr1.reduce((total, curr, index) => {
		return total + Math.pow((curr - arr2[index]), 2)
	}, 0));
}

KNN.prototype._distances = function(unclassArr, trainingData) {
	return trainingData.map((trainingPoint) => {
		return [this._distance(trainingPoint[0], unclassArr), trainingPoint[1]]
	})
}

// taking output of ._distances, a 2D arr where :
// 	[0] is distance and [1] is value
KNN.prototype._sorted = function(distanceArr) {
	return distanceArr
	.sort( (a, b) => a[0] - b[0] )
	.map( (distAndVal) => distAndVal[1] )
}

KNN.prototype._majority = function(k, rankedNeighbors) {
	let kneighbors = rankedNeighbors.slice(0, k);
	let frequency = {};

	kneighbors.forEach(function(ele) {
		if (!frequency[ele]) {
			frequency[ele] = 1;
		} else {
			frequency[ele]++;
		}
	})

	let modeTotal = 0;
	let mode;

	Object.keys(frequency).forEach(function(key) {
		if (frequency[key] > modeTotal) {
			modeTotal = frequency[key];
			mode = key;
		}
	})
	return Number(mode);
}

KNN.prototype.predictSingle = function(vector) {
	let dists = this._distances(vector, this.points);
	let sorted = this._sorted(dists);
	let major = this._majority(this.kSize, sorted);
	return major;
}

KNN.prototype.predict = function(arrOfVectors) {
	return arrOfVectors.map(vect => this.predictSingle(vect));
}


KNN.prototype.score = function(sampleData) {
	let actualScores = sampleData.map(i => i[1]);
	let toPredict = sampleData.map(i => i[0]);
	let predictions = this.predict(toPredict);

	let scoreSum = predictions
	.map((val, index) => {
		return (val === actualScores[index]) ? 1 : 0 })
	.reduce((a, b) => a + b);

	return scoreSum / predictions.length;

} 


module.exports = KNN
import CPU from "./cpu.js";

var black1810sPopulation = 0.19; // https://en.wikipedia.org/wiki/Historical_racial_and_ethnic_demographics_of_the_United_States#endnote_BlackPop
var federalist1816Support = 0.309; // https://en.wikipedia.org/wiki/1816_United_States_presidential_election

export default class Population{
    constructor(n, { federalistSplit = federalist1816Support, richSplit = 0.2, blackSplit = black1810sPopulation } = {}){
		this.adults = [];
        this.kids = [];

		n += n % 2;
		for(var i = 0; i < n; i++){
			this.adults.push(new CPU({
				ideals: i < n * federalistSplit ? Math.random() * 0.4 : 0.6 + Math.random() * 0.4,
				occupation: Math.random(),
				income: i < n * richSplit ? 0.8 + Math.random() * 0.2 : Math.random() * 0.5,
				race: i > 1 - n * blackSplit ? Math.random() * 0.2 : 0.2 + Math.random() * 0.8
			}));
		}
    }

	nextGeneration({ ideals = 0, occupation = 0, income = 0, race = 0 } = {}){
		var people = [...this.adults];
		var average = CPU.average(...this.adults);
		var influence = new CPU({
			ideals: Math.min(1, Math.max(0, average.ideals + ideals)),
			occupation: Math.min(1, Math.max(0, average.occupation + occupation)),
			income: Math.min(1, Math.max(0, average.income + income)),
			race: Math.min(1, Math.max(0, average.race + race))
		});

		while(people.length){
			var target = people[0];
			people.shift();

			var bestMatch = [0, Infinity];
			for(var i = 0; i < people.length; i++){
				var match = target.distance(people[i]);
				if(match < bestMatch[1]) bestMatch = [i, match];
			}
			
			this.kids.push(CPU.average(target, people[bestMatch[0]], average));
			people.splice(bestMatch[0], 1);
		}

		if(this.kids.length == this.adults.length){
			this.adults = this.kids;
			this.kids = [];
		}
		
		return [average, influence];
	}
}
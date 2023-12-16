import CPU from "./cpu.js";

var black1810sPopulation = 0.19;
var federalist1816Support = 0.476;

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
				race: i > n * (1 - blackSplit) ? Math.random() * 0.25 : 0.5 + Math.random() * 0.5
			}));
		}
    }

	vote(candidates){
		var results = {};

		for(var candidate of Object.keys(candidates)) results[candidate] = [0, 0];
		for(var cpu of this.adults){
			if(cpu.race <= 0.25) continue;
			var best = ["", -1];
			for(var candidate of Object.keys(candidates)){
				var match = cpu.match(candidates[candidate]) * candidates[candidate].quality;
				if(match < best[1]) continue;
				if(match == best[1] && Math.random() > 0.5) continue;
				best[0] = candidate;
				best[1] = match;
			}

			var income = cpu.get("income");
			results[best[0]][0]++;
			results[best[0]][1] += cpu.income < 0.6 ? 0 : (income - 50) * match * 0.1;
		}

		return results;
	}

	nextGeneration({ ideals = 0, occupation = 0, income = 0 } = {}){
		var people = [...this.adults];
		var average = CPU.average(...this.adults);
		var influence = new CPU({
			ideals: Math.min(1, Math.max(0, average.ideals + ideals)),
			occupation: Math.min(1, Math.max(0, average.occupation + occupation)),
			income: Math.min(1, Math.max(0, average.income + income))
		});

		while(people.length){
			var target = people[0];
			people.shift();

			var bestMatch = [0, Infinity];
			for(var i = 0; i < people.length; i++){
				var match = target.distance(people[i]);
				if(match < bestMatch[1]) bestMatch = [i, match];
			}
			
			var cpu = CPU.average(target, people[bestMatch[0]], average);
			cpu.race = (target.race + people[bestMatch[0]]) / 2;
			this.kids.push(cpu);
			people.splice(bestMatch[0], 1);
		}

		if(this.kids.length == this.adults.length){
			this.adults = this.kids;
			this.kids = [];
		}
		
		return [average, influence];
	}
}
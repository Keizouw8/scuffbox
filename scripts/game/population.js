import CPU from "./cpu.js";

var black1810sPopulation = 0.19;
var federalist1816Support = 0.476;

export default class Population{
    constructor(n, { federalistSplit = federalist1816Support, richSplit = 0.2, blackSplit = black1810sPopulation } = {}){
		this.generations = [[], []];

		n += n % 2;
		for(var o = 0; o < 2; o++){
			for(var i = 0; i < n / 2; i++){
				this.generations[o].push(new CPU({
					ideals: i < n * federalistSplit / 2 ? Math.random() * 0.4 : 0.6 + Math.random() * 0.4,
					occupation: Math.random(),
					income: i < n * richSplit / 2 ? 0.8 + Math.random() * 0.2 : Math.random() * 0.5,
					race: i > n * (1 - blackSplit) / 2 ? Math.random() * 0.25 : 0.5 + Math.random() * 0.5
				}));
			}
		}
    }

	vote(candidates){
		var results = {};

		for(var candidate of Object.keys(candidates)) results[candidate] = [0, 0];
		for(var cpu of [...this.generations[0], ...this.generations[1]]){
			if(cpu.race <= 0.25) continue;
			var best = [];
			for(var candidate of Object.keys(candidates)) best.push([candidate, cpu.match(candidates[candidate]) * candidates[candidate].quality]);
			best.sort((a, b) => Math.pow(-1, a[1] == b[1] ? Math.round(Math.random()) : a[1] > b[1]));

			var income = cpu.get("income");
			results[best[0][0]][0] += 1;
			results[best[0][0]][1] += cpu.income < 0.6 ? 0 : (income - 50) * best[0][1] * 0.1;
			if(best[1][0]){
				results[best[1][0]][0] += 0.5;
				results[best[1][0]][1] += cpu.income < 0.6 ? 0 : (income - 50) * best[1][1] * 0.05;
			}
		}

		return results;
	}

	nextGeneration(){
		var people = [...this.generations[0], ...this.generations[1]];
		var average = CPU.average(...people);
		var kids = [];

		while(people.length){
			var target = people[0];
			people.shift();

			var bestMatch = [0, Infinity];
			for(var i = 0; i < people.length; i++){
				var match = target.distance(people[i]);
				if(match < bestMatch[1]) bestMatch = [i, match];
			}
			
			var cpu = CPU.average(target, people[bestMatch[0]], [average, 0.1]);
			cpu.race = (target.race + people[bestMatch[0]].race) / 2;
			cpu.income = (target.income + people[bestMatch[0]].income) / 2;
			kids.push(cpu);
			people.splice(bestMatch[0], 1);
		}
		
		this.generations.shift();
		this.generations.push(kids);
	}
}
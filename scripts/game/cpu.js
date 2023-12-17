var parties = ["Federalist", "Moderate", "Democratic-Republican"];
var extremeties = ["Extreme ", "", "Moderate "];
var occupations = ["Independent Farmer", "Farm Owner", "Investor", "Speculator"];
var skinTones = ["#513021", "#874c2c", "#b66837", "#f9bf91", "#ecc19f"];

export default class CPU{
    constructor({ ideals, occupation, income, race } = {}){
        this.ideals = ideals || Math.random();
        this.occupation = occupation || Math.random();
        this.income = income || Math.random();
		this.race = race || Math.random();
    }
 
    static average(...cpus){
		var totalWeight = 0;
		var totalStats = {
			ideals: 0,
			occupation: 0,
			income: 0,
			race: 0
		};

		for(var i = 0; i < cpus.length; i++){
			if(!Array.isArray(cpus[i])) cpus[i] = [cpus[i], 1];
			totalWeight += cpus[i][1];
			totalStats.ideals += cpus[i][0].ideals * cpus[i][1];
			totalStats.occupation += cpus[i][0].occupation * cpus[i][1];
			totalStats.income += cpus[i][0].income * cpus[i][1];
			totalStats.race += cpus[i][0].race * cpus[i][1];
		}

        return new CPU({
            ideals: totalStats.ideals / totalWeight,
            occupation: totalStats.occupation / totalWeight,
            income: totalStats.income / totalWeight,
			race: totalStats.race / totalWeight
        });
    }

	match(candidate){
		var raceMatch = this.race < 0.25 ? candidate.stances.racialEquality : 1 - candidate.stances.racialEquality;
		var genderMatch = 1 - candidate.stances.genderEquality;
		var sufficiencyMatch = Math.abs(1 - candidate.stances.selfSufficiency);
		var nativeMatch = (1 - candidate.legislation.nativeLand / 1656000) * Math.min(0.75, this.occupation) * Math.min(0.75, this.ideals) * 0.25;
		var taxMatch = Math.min(1, Math.max(0, Math.max(0.5, this.occupation) + (this.income > 0.8 ? candidate.legislation.tax - 1 : 1 - candidate.legislation.tax)));
	
		return (raceMatch + genderMatch + sufficiencyMatch + nativeMatch + taxMatch) / 4.25;
	}

	distance(cpu){
		return Math.sqrt(3 * Math.pow(this.ideals - cpu.ideals, 2) + Math.pow(this.occupation - cpu.occupation, 2) + 10 * Math.pow(this.income - cpu.income, 2) + 5 * Math.pow(this.race - cpu.race, 2));
	}

	get(field, verbose = false){
		if(field == "ideals"){
			if(this.ideals > 0.4 && this.ideals < 0.6) return verbose ? "Moderate" : [1, 0];

			var isRepublican = this.ideals >= 0.6;
			var adjusted = 0.4 * isRepublican + (1 - 2 * isRepublican) * (this.ideals - 0.6 * isRepublican);

			var leaning = 1;
			if(adjusted < 0.1) leaning = 0;
			if(adjusted > 0.3) leaning = 2;

			return verbose ? extremeties[leaning] + parties[isRepublican * 2] : [isRepublican * 2, leaning];
		}

		if(field == "occupation") return verbose ? occupations[parseInt(this.occupation * occupations.length)] : this.occupation;
		
		if(field == "income"){
			if(this.income < 0.25){
				var dollar = 3 + 48 * this.income;
			}else if(this.income < 0.6){
				var dollar = 50 - Math.pow(this.income - 0.6, 2) * 2000 / 7;
			}else{
				var dollar = 50 + Math.pow(this.income - 0.6, 2) * 937.5;
			}
			return verbose ? `$${dollar.toFixed(2)}` : dollar;
		}

		if(field == "race"){
			return verbose ? skinTones[Math.floor(this.race * skinTones.length)] : this.race;
		}
	}
}
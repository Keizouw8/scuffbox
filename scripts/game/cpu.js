var average1810sWage = 15; // https://www.nber.org/system/files/chapters/c2486/c2486.pdf

var parties = ["Federalist", "Moderate", "Democratic-Republican"];
var extremeties = ["Extreme ", "", "Moderate "];
var occupations = ["Independent Farmer", "Farm Owner", "Investor", "Speculator"];

export default class CPU{
    constructor({ ideals, occupation, income } = {}){
        this.ideals = ideals || Math.random();
        this.occupation = occupation || Math.random();
        this.income = income || Math.random();
    }
 
    static average(...cpus){
        return new CPU({
            ideals: cpus.reduce((a, i) => a + i.ideals, 0) / cpus.length,
            occupation: cpus.reduce((a, i) => a + i.occupation, 0) / cpus.length,
            income: cpus.reduce((a, i) => a + i.income, 0) / cpus.length
        });
    }

	distance(cpu){
		return Math.sqrt(Math.pow(this.ideals - cpu.ideals, 2) + Math.pow(this.occupation - cpu.occupation, 2) + Math.pow(this.income - cpu.income, 2));
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
	}
}
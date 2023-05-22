/**
 * @author Minimouse
 */
class gmoney {
	constructor(type, object="") {
		this.type = type;
		this.object = object;
	}
	set(player, value) {
		if (this.type == "llmoney") {
			money.set(player.xuid, value);
		} else if (this.type == "scoreboard") {
			let scoreboard = mc.getScoreObjective(this.object);
			scoreboard.setScore(player, value)
		}
	}
	reduce(player, value) {
		if (this.type == "llmoney") {
			money.reduce(player.xuid, value);
		} else if (this.type == "scoreboard") {
			let scoreboard = mc.getScoreObjective(this.object);
			scoreboard.reduceScore(player, value)
		}
	}
	get(player) {
		switch (this.type) {
			case "scoreboard": {
				return player.getScore(this.object);
				break;
			}
			case "llmoney": {
				return money.get(player.xuid);
				break;
			}
			case "TMEssential": {
				let func = ll.import("TMETApi", "getMoney");
				return func(player.realName);
			}
		}
	}
}
module.exports=gmoney;
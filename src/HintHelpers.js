export const fillHintArrayHelper = (data) => {
  var updatedHints = [];

  // Hint #1
  updatedHints[0] = data.isActive 
    ? "This player is currently active" 
    : "This player is retired";

  // Hint #2
  const regSeasonGamesPlayed = data.careerTotals.regularSeason.gamesPlayed;
  const regSeasonGamesSingOrPlural = (regSeasonGamesPlayed == 1) ? "game" : "games";
  updatedHints[1] = "This player has played in " + regSeasonGamesPlayed + " NHL regular season " + regSeasonGamesSingOrPlural;
  
  // Hint #3
  const regSeasonGoals = data.careerTotals.regularSeason.goals;
  const regSeasonGoalsSingOrPlural = (regSeasonGoals == 1) ? "goal" : "goals";
  updatedHints[2] = "This player has scored " + regSeasonGoals + " regular season " + regSeasonGoalsSingOrPlural;

  // Hint #4
  const regSeasonAssists = data.careerTotals.regularSeason.assists;
  const regSeasonAssistsSingOrPlural = (regSeasonAssists == 1) ? "assist" : "assists";
  updatedHints[3] = "This player has " + regSeasonAssists + " regular season " + regSeasonAssistsSingOrPlural;

  // Hint #5
  updatedHints[4] = "This player has " + data.careerTotals.regularSeason.pim + " career NHL regular season penalty minutes";
  
  // Hint #6
  updatedHints[5] = "This player is a " + getPositionFromAbbr(data.position);

  // Hint #7
  const playoffGamesPlayed = data.careerTotals.playoffs.gamesPlayed;
  const playoffGamesSingOrPlural = (playoffGamesPlayed == 1) ? "game" : "games";
  updatedHints[6] = "This player has played in " + playoffGamesPlayed + " NHL playoff " + playoffGamesSingOrPlural;

  // Hint #8
  const playoffGoals = data.careerTotals.playoffs.goals;
  const playoffGoalsSingOrPlural = (playoffGoals == 1) ? "goal" : "goals";
  updatedHints[7] = "This player has scored " + playoffGoals + " NHL playoff " + playoffGoalsSingOrPlural;
  
  // Hint #9
  const playoffAssists = data.careerTotals.playoffs.assists;
  const playoffAssistsSingOrPlural = (playoffAssists == 1) ? "assist" : "assists";
  updatedHints[8] = "This player has " + data.careerTotals.playoffs.assists + " NHL playoff " + playoffAssistsSingOrPlural;
  
  // Hint #10
  const numStanleyCups = countStanleyCups(data);
  const cupsSingOrPlural = (numStanleyCups == 1) ? "Cup" : "Cups";
  updatedHints[9] = "This player has won " + numStanleyCups + " Stanley " + cupsSingOrPlural; 

  // Hint #11
  updatedHints[10] = "This player was born in " + getCountryFromAbbr(data.birthCountry);
  
  // Hint #12
  updatedHints[11] = "This player shoots " + translateLeftRight(data.shootsCatches);
  
  // Hint #13 
  updatedHints[12] = "This player most recently wore number " + data.sweaterNumber;

  // Hint #14
  const teamName = getTeamNameFromAbbr(data);
  updatedHints[13] = (teamName == "undrafted")
    ? "This player was undrafted"
    : "This player was drafted by the " + getTeamNameFromAbbr(data);
  
  // Hint #15
  updatedHints[14] = (teamName == "undrafted")
    ? "This player was born in " + data.birthDate.substring(0,4)
    : "This player was drafted in " + data.draftDetails.year;
  
  // Hint #16
  updatedHints[15] = "This player has played for the " + getTeamsPlayedFor(data); 
  
  // Hint #17
  updatedHints[16] = "This player's first name starts with the letter " + data.firstName.default.charAt(0);

  // Hint #18
  updatedHints[17] = "This player's last name starts with the letter " + data.lastName.default.charAt(0);
  
  // Hint #19
  updatedHints[18] = "This player's first name is " + data.firstName.default;

  // Hint #19 - Placeholder for picture
  updatedHints[19] = "Placeholder"


  // Set the updated hints
  return updatedHints;
  
};

const getTeamsPlayedFor = (data) => {
  var teamList = [];
  data.seasonTotals.forEach(season => {
    if (season.leagueAbbrev == "NHL") {
      teamList.push(season.teamName.default)
    }
  })
  const uniqueTeamSet = new Set(teamList);
  const uniqueTeamList = [...uniqueTeamSet];

  var teamListStr = "";

  //Only one team
  if (uniqueTeamList.length == 1) {
    return uniqueTeamList[0];
  }

  //Two teams
  if (uniqueTeamList.length == 2) {
    return uniqueTeamList[0] + " and " + uniqueTeamList[1];
  }

  //More than two teams
  for (let i = 0; i < uniqueTeamList.length; ++i) {
    if (i == uniqueTeamList.length - 1) {
      teamListStr += "and " + uniqueTeamList[i];
    }
    teamListStr += uniqueTeamList[i] + ", "
  }
  return teamListStr;
}

const countStanleyCups = (data) => {
  var stanleyCupCount = 0;
  if (!data.hasOwnProperty("awards")) {
    return 0;
  }
  data.awards.forEach(award => {
    if (award.trophy.default == "Stanley Cup") {
      stanleyCupCount += award.seasons.length;
    }
  })
  return stanleyCupCount;
}


const translateLeftRight = (hand) => {
  var fullHand;
  switch (hand) {
    case "L": 
      fullHand = "left-handed";
      break;
    case "R":
      fullHand = "right-handed";
      break;
  }
  return fullHand;
}

const translateRound = (num) => {
  var round;
  switch (num) {
    case 1: 
      round = "first";
      break;
    case 2:
      round = "second";
      break;
    case 3:
      round = "third";
      break;
    case 4:
      round = "fourth";
      break;
    case 5:
      round = "fifth";
      break;
    case 6:
      round = "sixth";
      break;
    case 7:
      round = "seventh";
      break;
  }
  return round;
}


export const getPositionFromAbbr = (abbr) => {
  var position;
  switch (abbr) {
    case "C": 
      position = "center";
      break;
    case "RW":
      position = "right wing";
      break;
    case "LF":
      position = "left wing";
      break;
    case "D":
      position = "defenseman";
      break;
  }
  return position;
}

export const getCountryFromAbbr = (abbr) => {
  var countryName;
  switch (abbr) {
    case "CAN": 
      countryName = "Canada";
      break;
    case "USA":
      countryName = "the United States";
      break;
    case "SWE":
      countryName = "Sweden";
      break;
  }
  return countryName;
}

const getTeamNameFromAbbr = (data) => {
  var fullName;

  if (!data.hasOwnProperty("draftDetails")) {
    return "undrafted";
  }

  const abbr = data.draftDetails.teamAbbrev;
  switch (abbr) {
    case "ANA":
      fullName = "Anaheim Ducks";
      break;
    case "BOS":
      fullName = "Boston Bruins";
      break;
    case "BUF":
      fullName = "Buffalo Sabres";
      break;
    case "CAR":
      fullName = "Carolina Hurricanes";
      break;
    case "CBJ":
      fullName = "Columbus Blue Jackets";
      break;
    case "CGY":
      fullName = "Calgary Flames";
      break;
    case "CHI":
      fullName = "Chicago Blackhawks";
      break;
    case "COL":
      fullName = "Colorado Avalanche";
      break;
    case "DAL":
      fullName = "Dallas Stars";
      break;
    case "DET":
      fullName = "Detroit Red Wings";
      break;
    case "EDM":
      fullName = "Edmonton Oilers";
      break;
    case "FLA":
      fullName = "Florida Panthers";
      break;
    case "LAK":
      fullName = "Los Angeles Kings";
      break;
    case "MIN":
      fullName = "Minnesota Wild";
      break;
    case "MTL":
      fullName = "Montreal Canadians";
      break;
    case "NJD":
      fullName = "New Jersey Devils";
      break;
    case "NSH":
      fullName = "Nashville Predators";
      break;
    case "NYI":
      fullName = "New York Islanders";
      break;
    case "NYR":
      fullName = "New York Rangers";
      break;
    case "OTT":
      fullName = "Ottawa Senators";
      break;
    case "PHI":
      fullName = "Philadelphia Flyers";
      break;
    case "PIT":
      fullName = "Pittsburgh Penguins";
      break;
    case "SEA":
      fullName = "Seattle Kraken";
      break;
    case "SJS":
      fullName = "San Jose Sharks";
      break;
    case "STL":
      fullName = "St Louis Blues";
      break;
    case "TBL":
      fullName = "Tampa Bay Lightning";
      break;
    case "TOR":
      fullName = "Toronto Maple Leafs";
      break;
    case "UTA":
      fullName = "Utah Hockey Club";
      break;
    case "VAN":
      fullName = "Vancouver Canucks";
      break;
    case "VGK":
      fullName = "Vegas Golden Knights";
      break;
    case "WPG":
      fullName = "Winnipeg Jets";
      break;
    case "WSH":
      fullName = "Washington Capitals";
      break;
  }
  return fullName;
}
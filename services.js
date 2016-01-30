function minbet(gs) {
  return gs.current_buy_in - gs.players[gs.in_action]['bet'] + gs.minimum_raise;
}

var l = console.log;

function checkCard(card) {
  switch (card) {
    case "J" :
      card = 11;
      break;
    case "Q" :
      card = 12;
      break;
    case "K" :
      card = 13;
      break;
    case "A" :
      card = 14;
      break;
    default:
      card = card;
  }
  return card;
}

function calculateBet(gs) {
  var bet;
  var r = ranking(gs)
  if (r) {
    return minbet(gs) + raise(r);
  } else {
    return highCards(gs);
  }
}

function highCards(gs) {
  var ours = gs.players[gs.in_action].hole_cards;
  var card1 = checkCard(ours[0].rank);
  var card2 = checkCard(ours[1].rank);

  if (card1 < 2 && card2 < 2) {
    return 10;
  } else if (card1 < 6 && card2 < 6 && !lotsOfMoney(gs)) {
    l("low cards");
    return minbet(gs);
  } else if (card1 < 10 && card2 < 10 && !lotsOfMoney(gs)) {
    l("middle cards");
    return minbet(gs) + 50;
  } else {
    l("high cards");
    return minbet(gs) + 200;
  }
}

function cardholder(game_state) {
    var ours = game_state.players[game_state.in_action].hole_cards;
    var common = game_state.community_cards;
    var cards = common.map(function(x) {
        return checkCard(x.rank);
    });
    cards.push(checkCard(ours[0].rank));
    cards.push(checkCard(ours[1].rank));
    return cards.sort();
}

function findPair(game_state) {
    var cards = cardholder(game_state);
    for (var i in cards) {
        if (i = cards.length) return false;
        if (cards[i] === cards[i+1]) {
            return true;
        }
    }
}

function twoPair(game_state) {
    var cards = cardholder(game_state);
    counter = 0;
    for (var i = 0; i < cards.length - 2; i++) {
        if (cards[i] === cards[i+1]) {
            counter++;
            i++;
        }
    }
    if (counter >= 2) {
        return true;
    }
}

function threeOfaKind(game_state) {
    var cards = cardholder(game_state);
     for (var i in cards) {
        if (cards[i] === cards[i+1] && cards[i+1] === cards[i+2]) {
           return true;
        }
    }
}

function raise(rank) {
    var small = 100;
    var big = 300;
    return big * rank;
}

function lotsOfMoney(gs) {
    if (minbet(gs) >= gs.players[gs.in_action].stack / 2) {
        return true;
    }
}

function ranking(gs) {
  if (threeOfaKind(gs)) return odds.three
  if (twoPair(gs)) return odds.twoPair;
  if (findPair(gs)) {
    return odds.pair;
  } else {
    return false;
  }
}

var odds = {
  highCard : 1,
  pair : 1.37,
  twoPair : 20,
  three : 46.3,
  straight : 254
}


module.exports = {
  calBet: calculateBet,
  minbet: minbet,
  checkCard: checkCard,
  calculateBet: calculateBet,
  highCards: highCards,
  cardholder: cardholder,
  findPair: findPair,
  twoPair: twoPair,
  threeOfaKind: threeOfaKind,
  raise: raise,
  lotsOfMoney: lotsOfMoney,
  ranking: ranking,
}

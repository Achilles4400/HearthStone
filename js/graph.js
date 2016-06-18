function getBipartiteGraph(){
    var graph = {};
    var fileCards = JSON.parse(readJSON("data/cards.json"));
    var decks = JSON.parse(readJSON("data/decks.json"));

    graph.nodes = [];
    for(cardSet in fileCards) {
        var cardSet = fileCards[cardSet];
        for(var card in cardSet) {
            graph.nodes.push(cardSet[card]);
        }
    }

    graph.links = [];
    for(var i in decks){
        var deck = decks[i];
        for(var j = 0; j < deck.deckList.length; j++) {
            var cardIdSource = deck.deckList[j];
            for(var k = j+1; k < deck.deckList.length; k++){
                var cardIdTarget = deck.deckList[k];
                var link = {};
                link.source = cardIdSource;
                link.target = cardIdTarget;
                if(!linkExist(graph.links, link))
                    graph.links.push(link);
            }
        }
    }

    return graph;
}

function linkExist(links, link) {
    for(var i in links) {
        if(links[i].source == link.source && links[i].target == link.target ||
            links[i].source == link.target && links[i].target == link.source){
            return true;
        }
    }
    return false;
}

function getCard(cards, cardId) {
    for(var i in cards) {
        if (cards[i].cardId == cardId) {
            return cards[i];
        }
    }
    return null;
}

function getCardIndex(cards, cardId) {
    var i = 0;
    for(var card in cards) {
        if (cards[card].cardId == card) {
            return i;
        }
        i++;
    }
    return -1;
}

function readJSON(file) {
    var request = new XMLHttpRequest();
    request.open('GET', file, false);
    request.send(null);
    if (request.status == 200)
        return request.responseText;
}
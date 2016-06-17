function getBipartiteGraph(){
    var graph = {};
    var cards = JSON.parse(readJSON("data/cards.json"));
    var decks = JSON.parse(readJSON("data/decks.json"));

    graph.nodes = [];
    for(cardSet in cards) {
        var cardSet = cards[cardSet]
        for(card in cardSet) {
            graph.nodes.push(cardSet[card]);
        }
    }

    graph.links = [];
    for(deck in decks) {
        graph.nodes.push(decks[decks]);
        for(cardId in decks[deck].deckList) {
            for(card in graph.nodes){
                if(graph.nodes[card].cardId == cardId) {

                }
            }
        }
    }

    return graph;
}

function readJSON(file) {
    var request = new XMLHttpRequest();
    request.open('GET', file, false);
    request.send(null);
    if (request.status == 200)
        return request.responseText;
}
function dhars(node) {
    const graph = makeAdjList(); //calls array that pairs edges and vertices
    //let nodes = JSON.parse(localStorage['fsm'])['nodes'];
    
    //list of integers corresponding to the chips on nodes 0, 1, 2, ...
    let chips = [];
    let legalFire = new Set();
    let nodeNum = 0;
    nodes.forEach(nodeIt => { 
        chips.push(parseInt(nodeIt['text'])); //adding chip values of each vertex to chips array
        legalFire.add(nodeNum); //adding all vertices to legal firing set to start
        nodeNum += 1;
    });

    let q = [];

    q.push(node); //add chosen node to q
    legalFire.delete(node); //remove chosen node from legal firing set

    //while there is a node in q, decrement chips at each neighbor by 1
    // if neighbor's chips are less than 0, add to q and remove from legal firing set
    while (q.length) {
        let n = q.shift();
        let neighbors = graph[n];
        neighbors.forEach(neighbor => {
            chips[neighbor] -= 1;
            if (chips[neighbor] < 0 && legalFire.has(neighbor)) {
                q.push(neighbor);
                legalFire.delete(neighbor);
            }
        })
    }

    let ret = new Set();
    for (num of legalFire) {
        ret.add(nodes[num]);
    }
    
    chipBags = [];
    chipBags.push(ret);

    console.log(legalFire);
    return ret; //returning legal firing set
}
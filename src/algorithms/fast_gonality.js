/*
Code adapted from dgon-tools by gonality on github

This implementation utilizes the lowerbound optimization
min(n, \lambda(G)) <= gon(G) 
*/

let winning_divisor = []

/*
Runs one iteration of Dhar's burning algorithm to compute a legal firing set

v: integer label of target vertex of q-reduction
divisor: map from V \to Z
*/
function burn(v, divisor){
    const graph = makeAdjList()

    let visited = new Set()
    let burnt_edges = []
    let q = []

    for(let i = 0; i < nodes.length; i++){
        burnt_edges[i] = 0;
    }
        
    visited.add(v)
    q.push(v)

    while(q.length != 0){
        let curr = q.pop()
        // console.log("curr: ", curr)
        // console.log("neighbors: ", graph[curr])
        // console.log("burnt_edges: ", burnt_edges)
        // console.log("q: ", q)
        // console.log("visited: ", visited)
        
        graph[curr].forEach((node) => {
            // console.log("looking at neighbor: ", node)
            burnt_edges[node] = burnt_edges[node] + 1

            if(burnt_edges[node] > divisor[node] && !visited.has(node)){
                visited.add(node)
                q.push(node)
            }
        })
        
        /*for(node in graph[curr]){
            // console.log("looking at neighbor: ", node)
            burnt_edges[node] = burnt_edges[node] + 1

            if(burnt_edges[node] > divisor[node] && !visited.has(node)){
                visited.add(node)
                q.push(node)
            }
        }*/
    }

    // visited.forEach(key => // console.log(key))

    let legal_firing_set = new Set()
    for(let i = 0; i < nodes.length; i++){
        if(!visited.has(i)){
            legal_firing_set.add(i);
        }
    }

    return legal_firing_set
}

/*
Checks whether graph is simple
*/
function simple_graph(){
    const graph = makeAdjList()

    for(let u = 0; u < nodes.length; u++){
        for(let v = 0; v < graph[u].length; v++){
            if(graph[u].indexOf(graph[u][v]) != graph[u].lastIndexOf(graph[u][v])){
                return false
            }
        }
    }
    return true
}

/*
Implementation of Edmond-Karp Max-Flow algorithm
*/
function edmond_karp(src, sink){
    const graph = makeAdjList()
    
    let max_flow = 0

    let limiting_flow = []
    let parent = []
    let residual_capacity = []

    for(let i = 0; i<nodes.length; i++){
        parent.push(-1)
        residual_capacity.push([])
        for(let j =0; j < nodes.length; j++){
            residual_capacity[i].push(0)
        }
    }

    for(let u = 0; u<nodes.length; u++){
        graph[u].forEach(v => {
            residual_capacity[u][v]++
        })
    }

    function bfs(){
        let q = []
        let visited = new Set()

        for(let i = 0; i<nodes.length; i++){
            limiting_flow[i] = nodes.length // double check this
        }

        q.push(src)
        visited.add(src)
        while(q.length != 0){
            let u = q.pop()
            
            for(let v = 0; v < nodes.length; v++){
                if(!visited.has(v) && residual_capacity[u][v] != 0){
                    limiting_flow[v] = Math.min(limiting_flow[v], residual_capacity[u][v])
                    parent[v] = u
                    visited.add(v)
                    q.push(v)
                    if(v == sink){
                        return 1
                    }
                }
            }
        }

        return 0
    }


    while(bfs()){
        max_flow += limiting_flow[sink]

        let v = sink
        let u = -1
        while(v != src){
            u = parent[v]
            residual_capacity[u][v] -= limiting_flow[sink]
            residual_capacity[v][u] += limiting_flow[sink]
            v = u
        }
    }

    return max_flow
}


/*
Computes lowerbound on rth-gonality
For simple graphs, delta(G) ≤ gon(G)
In general, min(n, lambda(G)) ≤ gon(G)
*/
function gonalityLowerBound(){
    const graph = makeAdjList()
    // console.log('simple_graph() = ', simple_graph())
    if(simple_graph()){
        let min_degree = nodes.length

        for(let u =0; u<nodes.length; u++){
            min_degree = Math.min(min_degree, graph[u].length)
        }

        console.log('Simple Graph Lower Bound: ', min_degree)
        return min_degree
    }
    else{ // edmond-karp's
        let lambda = links.length
        for(let u=0; u< nodes.length; u++){
            for(let v = u+1; v < nodes.length; v++){
                lambda = Math.min(lambda, edmond_karp(u,v))
            }
        }

        console.log('Multi-graph Lower Bound: ', Math.min(nodes.length, lambda))

        return Math.min(nodes.length, lambda)
    }
}

/*
Checks whether rank(divisor) ≥ order
*/
function check_rank(divisor, order){
    // console.log("Checking Rank of: ", divisor)
    
    const graph = makeAdjList()
    let running_divisor = []
    let dp = []

    for(let i = 0; i < nodes.length; i++){
        running_divisor[i] = divisor[i]
        dp[i] = divisor[i] >= order ? 1 : 0
    }

    for(let i = 0; i < nodes.length; i++){
        while(dp[i] == 0){
            let firing_set = burn(i, running_divisor)
            if(firing_set.size == 0){
                return false
            }

            firing_set.forEach(u =>{
                graph[u].forEach((neighbor) => {
                    running_divisor[u] = running_divisor[u] - 1
                    running_divisor[neighbor] = running_divisor[neighbor] + 1
                })
            })


            /*for(u in firing_set){
                for(v in graph[u]){
                    running_divisor[u]--
                    running_divisor[v]++
                }
            }*/

            for(let i = 0; i < nodes.length; i++){
                if(running_divisor[i] >= order){
                    dp[i] = 1
                }
            }
        }
    }

    return true
}

/*
Finds r-gonality winning divisor with degree = chips if one exists
*/
function find_winner(chips, divisor_length, order){
    // console.log('chips: ' + chips + ' divisor_length: ' + divisor_length)
    if(divisor_length >= nodes.length){
        // let b = burn(0, winning_divisor)
        // let pr = check_positive_rank(winning_divisor)
        
        // console.log('chips: ' + chips + ' winning_divisor: ' + winning_divisor)
        // console.log("burn? ", b.size)
        // console.log("positive rank? ", pr)

        return chips == 0 && winning_divisor[0] > 0 && burn(0, winning_divisor).size == 0 && check_rank(winning_divisor, order) 
    }
    
    let stop = divisor_length == 0 ? 1 : 0
    for(let i = chips; i >= stop; i--){
        winning_divisor[divisor_length] = i
        if(find_winner(chips - i, divisor_length+1, order)){
            return true
        }
    }
    winning_divisor[divisor_length] = -1
    return false
}

/*
Driver function for optimized gonality computation
*/
function fast_gonality(order){
    let gonDegree = nodes.length

    // console.log('checkpoint 1')

    for(let i = 0; i < nodes.length; i++){
        winning_divisor[i] = 0
    }

    // console.log('checkpoint 2')


    // try divisors with every degree starting from 1
    for(let i = gonalityLowerBound(); true; i++){
        if(find_winner(i, 0, order)){
            gonDegree = i
            break
        }
    }

    // console.log('checkpoint 3')

    /*nodes.forEach(node => {
        nodes[node]['text'] = `${winning_divisor[node.label-1]}`;
    })*/


    // update the visuals
    for (node in nodes) {
        nodes[node]['text'] = `${winning_divisor[node]}`;
    }

    alert(`Gonality of this graph: ${gonDegree}`)
    resetScript()
    draw();
}
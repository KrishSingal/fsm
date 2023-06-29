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

function lowerBound(){
    return 1
}

function check_positive_rank(divisor){
    // console.log("Checking Rank of: ", divisor)
    
    const graph = makeAdjList()
    let running_divisor = []
    let dp = []

    for(let i = 0; i < nodes.length; i++){
        running_divisor[i] = divisor[i]
        dp[i] = divisor[i] > 0 ? 1 : 0
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
                if(running_divisor[i] > 0){
                    dp[i] = 1
                }
            }
        }
    }

    return true
}

function find_winner(chips, divisor_length){
    // console.log('chips: ' + chips + ' divisor_length: ' + divisor_length)
    if(divisor_length >= nodes.length){
        let b = burn(0, winning_divisor)
        let pr = check_positive_rank(winning_divisor)
        
        // console.log('chips: ' + chips + ' winning_divisor: ' + winning_divisor)
        // console.log("burn? ", b.size)
        // console.log("positive rank? ", pr)

        return chips == 0 && winning_divisor[0] > 0 && burn(0, winning_divisor).size == 0 && check_positive_rank(winning_divisor) 
    }
    
    let stop = divisor_length == 0 ? 1 : 0
    for(let i = chips; i >= stop; i--){
        winning_divisor[divisor_length] = i
        if(find_winner(chips - i, divisor_length+1)){
            return true
        }
    }
    winning_divisor[divisor_length] = -1
    return false
}

function fast_gonality(){
    const graph = makeAdjList()
    
    for(let i = 0; i < nodes.length; i++){
        // console.log(graph[i])
    }

    let gonDegree = nodes.length

    // console.log('checkpoint 1')

    for(let i = 0; i < nodes.length; i++){
        winning_divisor[i] = 0
    }

    // console.log('checkpoint 2')

    for(let i = 1; i<=nodes.length; i++){
        if(find_winner(i, 0)){
            gonDegree = i
            break
        }
    }

    // console.log('checkpoint 3')

    /*nodes.forEach(node => {
        nodes[node]['text'] = `${winning_divisor[node.label-1]}`;
    })*/

    for (node in nodes) {
        nodes[node]['text'] = `${winning_divisor[node]}`;
    }

    alert(`Gonality of this graph: ${gonDegree}`)
    resetScript()
    draw();
}

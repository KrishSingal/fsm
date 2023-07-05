/*
Finds r-multiplicity free gonality winning divisor with degree = chips if one exists
*/
function find_mf_winner(chips, divisor_length, order){
    // console.log('chips: ' + chips + ' divisor_length: ' + divisor_length)
    if(divisor_length >= nodes.length){
        // let b = burn(0, winning_divisor)
        // let pr = check_positive_rank(winning_divisor)
        
        // console.log('chips: ' + chips + ' winning_divisor: ' + winning_divisor)
        // console.log("burn? ", b.size)
        // console.log("positive rank? ", pr)


        if(order == 1){
            return chips == 0 && check_positive_rank(winning_divisor) 
        }
        else{
            // console.log(winning_divisor)
            return chips == 0 && check_rank(winning_divisor, order) 
        }
    }
    
    let allowable_chips = chips > 0 ? 1 : 0
    for(let i = allowable_chips; i >= 0; i--){
        winning_divisor[divisor_length] = i
        if(find_mf_winner(chips - i, divisor_length+1, order)){
            return true
        }
    }
    winning_divisor[divisor_length] = -1
    return false
}


/*
Driver function for multiplicity free gonality computation
*/
function mfgon(order){
    let gonDegree = nodes.length

    // console.log('checkpoint 1')

    for(let i = 0; i < nodes.length; i++){
        winning_divisor[i] = 0
    }

    // console.log('checkpoint 2')


    // try divisors with every degree starting from 1
    for(let i = gonalityLowerBound(); i<=nodes.length; i++){
        if(find_mf_winner(i, 0, order)){
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

    if(winning_divisor[0] == -1){
        alert(`Order ${order} multiplicity free gonality of this graph is infinite`)
    }
    else{
        alert(`Order ${order} multiplicity free gonality of this graph: ${gonDegree}`)
    }
    
    resetScript()
    draw();
}
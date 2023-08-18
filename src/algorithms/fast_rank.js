function fast_rank(){
    let divisor = []
    let r = 0;

    for (node in nodes) {
        divisor.push(parseInt(nodes[node]['text']));
    }

    while(check_rank(divisor, r+1)){
        r++;
    }

    alert(`Rank of divisor is ${r}`)
    return r;
} 
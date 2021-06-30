const PD = require("probability-distributions");

exports.addNoise = (value, {typeOfDistribution, distributionParameters, valueParameters}) => {
    /**
     * need map for distributions -> functions of the PD-package (https://statisticsblog.com/probability-distributions/)
     * like: 
     * { binominal: PD.rbinom, ...}
     */
    
    //add type checking

    if(value && value instanceof Number || typeof value == "number"){
        //valueParameters musst say, whether this is an int or not
        return value -100 //+ PD.rbinom(1,10,0.5)[0]
    }

    if(value && value instanceof Date){
        //do something here
    }
    
    return -2;
}

exports.generalize = () => {
    return 3;
}

exports.suppress = () => {
    return null;
}

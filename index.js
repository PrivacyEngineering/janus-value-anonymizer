const PD = require("probability-distributions");
const moment = require("moment");
const CryptoJs = require("crypto-js");

const distributions = {
    binomial: {
        f: PD.rbinom,
        parameters: ["number", "probability"]
    },
    beta: {
        f: PD.rbeta,
        parameters: ["alpha", "beta"]
    },
    cauchy: {
        f: PD.rcauchy,
        parameters: ["scale", "location"]
    },
    chiSquared: {
        f: PD.rchisq,
        parameters: ["degrees"]
    },
    exponential: {
        f: PD.rexp,
        parameters: ["rate"]
    },
    fdistribution: {
        f: PD.rf,
        parameters: ["degree1", "degree2"]
    },
    gamma: {
        f: PD.rgamma,
        parameters: ["shape", "rate"]
    },
    laplace:{
        f: PD.rnorm,
        parameters: ["mean", "standardDeviation"]
    },
    logNormal: {
        f: PD.rlnorm,
        parameters: ["logMean", "logStandardDeviation"]
    },
    negativeBinomial: {
        f: PD.rnbinom,
        parameters: ["failures", "probability"]
    },
    normal: {
        f: PD.rnorm,
        parameters: ["mean", "standardDeviation"]
    },
    poisson: {
        f: PD.rpois,
        parameters: ["mean"]
    },
    uniform: {
        f: PD.runif,
        parameters: ["min", "max"]
    },
    uniformInt: {
        f: PD.rint,
        parameters: ["min", "max"]
    },
}

const dateUnits = ["millisecond", "second", "minute", "hour", "day", "month", "year"];

const dateUnitMultiplier = [1, 1000, 60, 60, 24, 30, 12];

exports.addNoise = (value, {typeOfDistribution, distributionParameters, valueParameters}) => {
    //get arguments for distribution
    var a = new Array();
    a.push(1); //must be added, but since we only use one sample, 1 fits.

    if(!typeOfDistribution || !distributionParameters) throw new AnonymizationError("No distribution or corresponding parameters specified.");
    
    const distribution = distributions[typeOfDistribution];

    if(!distribution) throw new AnonymizationError("No corresponding distribution defined.")

    for(p of distribution["parameters"]){
        a.push(distributionParameters[p])
    }

    if (a.length-1 != distribution["parameters"].length) throw new AnonymizationError("Not all parameters could be mapped.")

    //evaluate numbers
    if(value && value instanceof Number || typeof value == "number"){
        var newVal = value + distribution["f"].bind(PD)(...a)[0] 
        if(valueParameters && valueParameters["isInt"]) {
            newVal = Math.round(newVal)
        }
        return newVal;
    }

    //evaluate dates
    if(value && value instanceof Date){
        const noise = distribution["f"].bind(PD)(...a)[0];
        
        if(!valueParameters && !valueParameters["addNoiseToUnit"]) throw new AnonymizationError("Unit for noise on date not given.") 

        return addValueToDate(value, valueParameters["addNoiseToUnit"], noise);
    }
    
    throw new AnonymizationError("Called anonymization with not supported data type.");
}

exports.generalize = (value, {generalizationParameters}) => {
    if(value && value instanceof String || typeof value == "string"){        
        if(!generalizationParameters || !generalizationParameters["hideCharactersFromPosition"]) throw new AnonymizationError("No fitting generalization parameteres given.")
        
        var val = [];
        const hideCharactersFromPosition = generalizationParameters["hideCharactersFromPosition"];

        for(let i = 0; i < value.length; i++){
            if(i < hideCharactersFromPosition) {
                val.push(value[i]);
            } else {
                val.push("*");
            }
        }
        return val.join("");
        
    }

    if(value && value instanceof Number || typeof value == "number"){
        if(!generalizationParameters || !generalizationParameters["stepSize"]) throw new AnonymizationError("No fitting generalization parameteres given.")
        
        const stepSize = generalizationParameters["stepSize"];

        return ~~(value / stepSize) * stepSize
    }

    if(value && value instanceof Date){
        if(!generalizationParameters || !generalizationParameters["dateUnit"]) throw new AnonymizationError("No fitting generalization parameteres given.");
        
        return moment(value).startOf(generalizationParameters["dateUnit"]).toDate();        
    }

    throw new AnonymizationError("Called anonymization with not supported data type.");
}

exports.hash = (value, {hashingParameters, convertion}) => {
    const hash = CryptoJs.SHA3(value, hashingParameters);

    if(!convertion || convertion == "Base64"){
        return hash.toString(CryptoJs.enc.Base64)
    }else if (convertion == "Hex"){
        return hash.toString(CryptoJs.enc.Hex)
    }
}

class AnonymizationError extends Error{
    constructor(message) {
        super(message);
        this.name = "AnonymizationError"
    }
}

exports.AnonymizationError = AnonymizationError;

function addValueToDate(date, unit, noise) {
    unitIndex = dateUnits.indexOf(unit);
    if (unitIndex < 0)
        throw new AnonymizationError("Could not match date unit.");

    multiplier = dateUnitMultiplier.slice(0, unitIndex + 1).reduce((a, b) => a * b, 1);

    return new Date(date.getTime() + multiplier * noise);
}

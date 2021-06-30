const PD = require("probability-distributions");

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

exports.addNoise = (value, {typeOfDistribution, distributionParameters, valueParameters}) => {
    //get arguments for distribution
    var a = new Array();
    a.push(1); //must be added, but since we only use one sample, 1 fits.

    if(!typeOfDistribution) return null;
    
    const distribution = distributions[typeOfDistribution];

    for(p of distribution["parameters"]){
        a.push(distributionParameters[p])
    }

    //evaluate numbers
    if(value && value instanceof Number || typeof value == "number"){
        var newVal = value + distribution["f"].bind(PD)(...a)[0] 
        if(valueParameters && valueParameters["isInt"]) {
            newVal = Math.round(newVal)
        }
        return newVal;
    }

    Date.prototype.addValueToUnit = function(unit, val){
        const dateUnitsGetter = {
            "millisecond": this.getMilliseconds, 
            "second": this.getSeconds,
            "minute": this.getMinutes, 
            "hour": this.getHours, 
            "day": this.getDay, 
            "month": this.getMonth,
            "year": this.getFullYear
        };
        const dateUnitsSetter = {
            "millisecond": this.setMilliseconds, 
            "second": this.setSeconds,
            "minute": this.setMinutes, 
            "hour": this.setHours, 
            "day": this.setDate, 
            "month": this.setMonth,
            "year": this.setFullYear
        };
        dateUnitsSetter[unit].bind(this)(dateUnitsGetter[unit].bind(this)()+Math.round(val))
        return this;
    }

    //evaluate dates
    if(value && value instanceof Date){
        const noise = distribution["f"].bind(PD)(...a)[0];
        if(valueParameters && valueParameters["addNoiseToUnit"]){
            return value.addValueToUnit(valueParameters["addNoiseToUnit"], noise);
        }
    }
    
    return null;
}

exports.generalize = () => {
    return 3;
}

exports.suppress = () => {
    return null;
}

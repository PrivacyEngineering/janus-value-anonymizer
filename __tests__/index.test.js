const { addNoise } = require("../index");

describe("Test Distribution Call", () => {
    //test stuff
    test("Normal Distribution", () => {
        const val = addNoise(10, {
            typeOfDistribution:"normal", 
            distributionParameters: {
                mean: 100,
                standardDeviation: 1
            }, 
            valueParameters: {
                isInt: true
            }
        });
        expect(Number.isInteger(val)).toEqual(true);
    }) 
})

describe("Test Types", () => {
    //test stuff
    test("Date", () => {
        const val = addNoise(new Date(2020,0,1,10), {
            typeOfDistribution:"uniform", 
            distributionParameters: {
                min: -5,
                max: 5
            }, 
            valueParameters: {
                addNoiseToUnit: "hour"
            }
        });
        expect(val.getDate()).toEqual(1);
    }) 
})

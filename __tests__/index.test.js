const { addNoise, generalize, AnonymizationError } = require("../index");

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

describe("Generalization", () => {
    test("String Last Elements", () => {
        const val = generalize("ThisIsText", {
            generalizationParameters: {
                hideCharactersFromPosition: 4
            }
        });
        expect(val).toEqual("This******");
    });

    test("Integer with different step sizes", () => {
        const val1 = generalize(65, {
            generalizationParameters: {
                stepSize: 4
            }
        });
        expect(val1).toEqual(64);

        const val2 = generalize(112, {
            generalizationParameters: {
                stepSize: 30
            }
        });
        expect(val2).toEqual(90);

        const val3 = generalize(-10, {
            generalizationParameters: {
                stepSize: 3
            }
        });
        expect(val3).toEqual(-9);
    });

    test("Wrong type", () => {
        var throwedError = false;
        try{
            generalize([1,2], {
                generalizationParameters: {
                    hideCharactersFromPosition: 4
                }
            });
        } catch (e) {
            expect(e).toBeInstanceOf(AnonymizationError);
            throwedError = true;
        }
        expect(throwedError).toEqual(true)
    });
})

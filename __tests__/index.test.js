const { addNoise, generalize, AnonymizationError, hash } = require("../index");

describe("Noise", () => {
    test("Return type Integer", () => {
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
    });

    test("Date hour noise does not influence higher unit.", () => {
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
    });

    test("Date hour gives expected value.", () => {
        const d = new Date(2020,0,1,10);
        const val = addNoise(d, {
            typeOfDistribution:"uniform", 
            distributionParameters: {
                min: 5,
                max: 5
            }, 
            valueParameters: {
                addNoiseToUnit: "hour"
            }
        });
        expect(val.getHours()).toEqual(15);
    });
})

describe("Generalization", () => {
    test("String 4 characters plain", () => {
        const val = generalize("ThisIsText", {
            generalizationParameters: {
                hideCharactersFromPosition: 4
            }
        });
        expect(val).toEqual("This******");
    });

    test("String 4 characters plain and 3 hide characters", () => {
        const val = generalize("ThisIsText", {
            generalizationParameters: {
                hideCharactersFromPosition: 4,
                numberOfHideCharacters: 3
            }
        });
        expect(val).toEqual("This***");
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

    test("Date hour", () => {
        const val = generalize(new Date(2020,0,1,10), {
            generalizationParameters: {
                dateUnit: "day"
            }
        });
        expect(val).toEqual(new Date(2020,0,1,0));
    });

    test("Date day", () => {
        const val = generalize(new Date(2020,0,15,10), {
            generalizationParameters: {
                dateUnit: "month"
            }
        });
        expect(val).toEqual(new Date(2020,0,1,0));
    });
})

describe("Hashing", () => {
    test("Base64 Hash", () => {
        const val = hash("Message", {
            hashingParameters: {
                outputLength: 256
            }
        });
        expect(val).toEqual("mlnvvEcbU0kcgDj9XV/jvgoimHMwK6+6kMGfvn18fzU=")
    });
    test("Hex Hash", () => {
        const val = hash("Message", {
            hashingParameters: {
                outputLength: 256
            },
            convertion: "Hex"
        });
        expect(val).toEqual("9a59efbc471b53491c8038fd5d5fe3be0a229873302bafba90c19fbe7d7c7f35")
    })
})

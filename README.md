# value-anonymizer

**Janus/value-anonymizer is part of a peer-reviewed publication. Please see the paper [here](https://link.springer.com/chapter/10.1007/978-3-031-09917-5_22) or a preprint on [arXiv](https://arxiv.org/pdf/2203.09903).**

```
@inproceedings{pallas2022configurable,
  title={Configurable Per-Query Data Minimization for Privacy-Compliant Web APIs},
  author={Frank Pallas and David Hartmann and Paul Heinrich and Josefine Kipke and Elias Grünewald},
  booktitle={Web Engineering: 22nd International Conference, ICWE 2022, Bari, Italy, July 5--8, 2022},
  volume={13362},
  pages={325},
  year={2022},
  organization={Springer Nature}
}
```
---

## Usage
### Installation
```sh
npm install value-anonymizer
```

### Overview
The anonymizer package consists of three anonymizing methods, that are working for the folloing data types: 

- noise: ```Number, Date```
- generalize: ```Number, String, Date```
- hash: ```Number, String, Date```

Each function needs some anonymization parameters. In general, the call of the function is 
```js
functionName(value, parameters)
``` 
Which type of parameters object is required will be explained in the following.
### Noise 
In general, when using noise, one has to define a certain distribution that is used to sample the noise value that is added to the original value. Therefore, every distribution of the ```probability-distributions``` package (https://www.npmjs.com/package/probability-distributions) is available. To use them, pass parameter object as follows:
```js
{   
    typeOfDistribution:"normal", 
    distributionParameters: {
        mean: 100,
        standardDeviation: 1
    }, 
    valueParameters: {
        isInt: true
    }
}
```
There are the following distributions available: 
- "binomial", parameters: ["number", "probability"]
- "beta", parameters: ["alpha", "beta"]
- "cauchy", parameters: ["scale", "location"]
- "chiSquared", parameters: parameters: ["degrees"]
- "exponential", parameters: ["rate"]
- "fdistribution", parameters: ["degree1", "degree2"]
- "gamma", parameters: ["shape", "rate"]
- "laplace", parameters: ["mean", "standardDeviation"]
- "logNormal", parameters: ["logMean", "logStandardDeviation"]
- "negativeBinomial", parameters: ["failures", "probability"]
- "normal", parameters: ["mean", "standardDeviation"]
- "poisson", parameters: ["mean"]
- "uniform", parameters: ["min", "max"]
- "uniformInt", parameters: ["min", "max"]

For the valueParameters, on can specify for numbers wheter the output should be and Integer by ```isInt``` and for dates which unit the noise has by ```addNoiseToUnit```.  
### Generalization
#### Strings
Pass a parameter object like
```js
{
    generalizationParameters: {
        hideCharactersFromPosition: 4,
        numberOfHideCharacters: 3
    }
}
```
Returns ```"This***"``` for ```"ThisIsText"``` as input.
#### Numbers
Pass a parameter object like
```js
{
    generalizationParameters: {
        stepSize: 10
    }
}
```
Values are always rounded down to the next smaller step size boundary. By way of example: If the stepsize is 10, there would be limits of 0 (representing 0-9), 10 (for 10-19), 20 (for 20-29), and so on. This ensures that exactly one number (0,10,20,...) represents a range.
Thus, returns ```20``` for ```29``` as input.

#### Dates
```js
{
    generalizationParameters: {
        dateUnit: "day"
    }
}
```
The resulting date is truncated to this Unit. Returns ```Date(2021,10,0)``` for ```Date(2021,10,23,2)``` as input.

### Hashing
Uses the SHA3 hash function of crypto-js.
```js
{
    hashingParameters: {
        outputLength: 256
    }
}
```

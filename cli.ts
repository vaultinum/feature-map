#!/usr/bin/env node
import * as YAML from "yaml"
import { existsSync, readFileSync, writeFileSync, mkdirSync } from "fs"
import { program } from "commander"
import { FeatureMapConfig } from "./FeatureMapConfig"
import { FeatureMap } from "./FeatureMap"
import { toSafeProperty, buildFeatureMapObject } from "./FeatureMapBuilder"
import { bindJestResults } from "./FeatureMapJestTestsBinder"

const defaultFeatureMapConfig: FeatureMapConfig = {
    debug: false,
    featuremap: "featuremap.yaml",
    outputFolder: "./",
    buildObject: {
        target: "typescript"
    },
    bindTests: {
        target: "jest",
        inputFile: "jest-results.json"
    }
}

program
    .option("--config <featuremap config file>", "FeatureMap configuration", "featuremap.config.json")
    .option("--debug", "Display debug information");

program.parse(process.argv);
const options = program.opts();

// 1. Load configuration
const configFilePath = options.config;
let config = defaultFeatureMapConfig;
if(!existsSync(configFilePath)) {
    console.log(`No configuration file provided: using default config`);
}else{
    console.log(`Using featuremap configuration file: ${configFilePath}`);
    const configFromFile = require(configFilePath);
    config = {
        ...defaultFeatureMapConfig,
        ...configFromFile
    }
}

// 2. Ensure featuremap.yaml exits
if(!existsSync(config.featuremap)){
    console.error(`Could not find feature map file: ${config.featuremap}`);
    process.exit(1);
}

// 3. Read feature-map yaml file
console.log(`Using feature-map file: ${config.featuremap}`);
const featureMapFile = readFileSync(config.featuremap, "utf8");
let featureMap: FeatureMap = YAML.parse(featureMapFile);

// 4. Ensure output folder exists
if(config.outputFolder) {  
    if(!existsSync(config.outputFolder)){
        mkdirSync(config.outputFolder, { recursive: true });
    }
}else{
    console.error("No output folder path provided");
    process.exit(1);
}

// 5. Check if featuremap object building is required
if(config.buildObject) {
    // 5.1 Convert yaml file to Object
    const featureMapObjectCode = buildFeatureMapObject(featureMap);
    if (options.debug) {
        console.log(featureMapObjectCode);
    }
    // 5.2 Write object to file
    mkdirSync(config.outputFolder, { recursive: true });
    if(config.buildObject.target === "typescript") {
        const outputFile = `${config.outputFolder}/${toSafeProperty(featureMap.productName)}FeatureMap.ts`
        console.log(`Creating feature-map object file: ${outputFile}`);
        writeFileSync(outputFile, featureMapObjectCode);
    }else{
        console.error(`Unkown object output target: ${config.buildObject.target}`);
    }
}

// 6. Check if test binding is required
if(config.bindTests) {
    // 6.1 Check file path and target
    if (config.bindTests.inputFile) {
        if(existsSync(config.bindTests.inputFile)){
            if(config.bindTests.target === "jest"){
                // 6.2 Read Jest test results and combine with FeatureMap
                console.log(`Using ${config.bindTests.target} test results file: ${config.bindTests.inputFile}`);
                const jestTestResults = JSON.parse(readFileSync(config.bindTests.inputFile, "utf8"));
                featureMap = bindJestResults(featureMap, jestTestResults);
            }else{
                console.error(`Unsupported test result target: ${config.bindTests.target}`);
            }
        }else{
            console.error(`Could not find test results input file: ${config.bindTests.inputFile}`);    
        }
    }else{
        console.error(`Missing test results input file path`);
    }
}

// 7. Output featuremap to expected format (json only for now)
const featureMapOutputFile = `${config.outputFolder}/featuremap.json`;
console.log(`Writing combined feature-map: ${featureMapOutputFile}`);
writeFileSync(featureMapOutputFile, JSON.stringify(featureMap, null, 4));

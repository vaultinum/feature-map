#!/usr/bin/env node
import * as YAML from "yaml"
import { existsSync, readFileSync, writeFileSync, mkdirSync } from "fs"
import { program } from "commander"
import { FeatureMapConfig } from "./FeatureMapConfig"
import { FeatureMap } from "./FeatureMap"
import { loadConnectors } from "./connectors"
import { bindTestResults, buildFeatureMapObject } from "./ConnectorService"

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
    .option("--config <featuremap config file>", "FeatureMap configuration", "./featuremap.config.json")
    .option("--debug", "Display debug information");

program.parse(process.argv);
const options = program.opts();

loadConnectors();
// 1. Load configuration
const configFilePath = options.config;
let config = defaultFeatureMapConfig;
if (!existsSync(configFilePath)) {
    console.log(`No configuration file provided: using default config`);
} else {
    console.log(`Using featuremap configuration file: ${configFilePath}`);
    const configFromFile = JSON.parse(readFileSync(configFilePath).toString());
    config = {
        ...defaultFeatureMapConfig,
        ...configFromFile
    }
}
const { debug } = config;
if (debug) {
    console.log(`Configuration used: ${JSON.stringify(config, null, 4)}`);
}

// 2. Ensure featuremap.yaml exits
if (!existsSync(config.featuremap)) {
    console.error(`Could not find feature map file: ${config.featuremap}`);
    process.exit(0);
}

// 3. Read feature-map yaml file
console.log(`Using feature-map file: ${config.featuremap}`);
const featureMapFile = readFileSync(config.featuremap, "utf8");
let featureMap: FeatureMap = YAML.parse(featureMapFile);

// 4. Ensure output folder exists
if (config.outputFolder) {
    if (!existsSync(config.outputFolder)) {
        mkdirSync(config.outputFolder, { recursive: true });
    }
} else {
    console.error("No output folder path provided");
    process.exit(0);
}

// 5. Check if featuremap object building is required
if (config.buildObject) {
    try{
        if (config.buildObject.target === "typescript") {
            // 5.1 Create output folder if needed
            mkdirSync(config.outputFolder, { recursive: true });
            // 5.2 Convert yaml file to Object
            buildFeatureMapObject(config.buildObject.target, featureMap, config.outputFolder);
        }
    }catch(e){
        console.error(`Failed to build featuremap object: ${e}`);
        process.exit(0);
    }
}

// 6. Check if test binding is required
if (config.bindTests) {
    try {
        if (!config.bindTests.target) throw new Error("Missing bind test target");
        if (!config.bindTests.inputFile) throw new Error(`Missing test results input file path`);
        if (!existsSync(config.bindTests.inputFile)) throw new Error(`Could not find test results input file: ${config.bindTests.inputFile}`);
        // 6.1 Read test results and combine with FeatureMap
        featureMap = bindTestResults(config.bindTests.target, featureMap, config.bindTests.inputFile);
    } catch (e) {
        console.error(`Failed to bind test: ${e}`);
        process.exit(0);
    }
}

// 7. Output featuremap to expected format (json only for now)
const featureMapOutputFile = `${config.outputFolder}/featuremap.json`;
console.log(`Writing combined feature-map: ${featureMapOutputFile}`);
writeFileSync(featureMapOutputFile, JSON.stringify(featureMap, null, 4));

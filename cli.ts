#!/usr/bin/env node
import * as YAML from "yaml"
import { readFileSync, writeFileSync, mkdirSync } from "fs"
import { program }  from "commander"
import { toSafeProperty, createConstantFromFeatureMap } from "./FeatureMapInterfaceBuilder"
import { FeatureMap } from "./FeatureMap"

program
    .option("--out <output-directory>", "Output directory", "./")
    .option("--feature-map <feature-map-file>", "Input feature-map file to use", "feature-map.yaml")
    .option("--debug", "Display generated FeatureMap content");

program.parse(process.argv);
const options = program.opts();

// 1. Read feature-map yaml file
const featureMapFilePath = options.featureMap;
console.log(`Using feature-map file: ${featureMapFilePath}`);
const featureMapFile = readFileSync(featureMapFilePath, "utf8");
const featureMapData: FeatureMap = YAML.parse(featureMapFile);

// 2. Convert yaml file to Object
const featureMapInterfaceCode = createConstantFromFeatureMap(featureMapData); 
if(options.debug === "true"){
    console.log(featureMapInterfaceCode);
}

// 3. Write object to file
const outputFolder = options.out;
mkdirSync(outputFolder, { recursive: true });
const outputFile = `${outputFolder}/${toSafeProperty(featureMapData.productName)}FeatureMap.ts`
console.log(`Creating feature-map file: ${outputFile}`);
writeFileSync(outputFile, featureMapInterfaceCode, options);

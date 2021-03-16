import * as YAML from "yaml"
import { readFileSync, writeFileSync } from "fs"
import { toSafeProperty, createConstantFromFeatureMap } from "./FeatureMapInterfaceBuilder";
import { FeatureMap } from "./FeatureMap";

const featureMapFilePath = process.argv[2] || "./feature-map.yaml";
console.log(`Using feature-map file: ${featureMapFilePath}`);
const featureMapFile = readFileSync(featureMapFilePath, "utf8");
const featureMapData: FeatureMap = YAML.parse(featureMapFile);

const featureMapInterfaceCode = createConstantFromFeatureMap(featureMapData);
console.log(featureMapInterfaceCode);

writeFileSync(`${toSafeProperty(featureMapData.productName)}.ts`, featureMapInterfaceCode);

import { writeFileSync } from "fs";
import * as indentString from "indent-string";
import { camelCase, upperFirst } from "lodash";
import { Connector } from "../Connector";
import { Feature, FeatureMap } from "../FeatureMap";

export const toSafeProperty = (name: string) => upperFirst(camelCase(name));

const objectToString = (properties: [string, string?][], prefix?: string): string => `${prefix || ""}{
${properties.filter(([key, value]) => value !== undefined).map(([key, value]) => indentString(`${key}: ${value}`, 4)).join(",\n")}
}`;

const createDefaultExportString = (properties: [string, string][]): string => {
    return objectToString(properties, "export default = ");
}

const createFeatureString = (featureName: string, feature?: Feature): string => {
    return objectToString([
        ["$name", `"${featureName}"`],
        ...Object.keys(feature?.features || {}).map(featureName => [toSafeProperty(featureName), createFeatureString(featureName, feature?.features?.[featureName])] as [string, string])
    ]);
}

export const buildFeatureMapObject = (featureMap: FeatureMap): string => {
    return `// GENERATED CODE - DO NOT MODIFY
${createDefaultExportString(Object
    .keys(featureMap.features)
    .map(featureName => [toSafeProperty(featureName), createFeatureString(featureName, featureMap.features[featureName])])
)}`;
}

const typeScriptConnector: Connector = {
    name: "typescript",
    buildFeatureMapObject: (featureMap: FeatureMap, outputFolder: string) => {
        const featureMapObjectCode = buildFeatureMapObject(featureMap);
        const outputFile = `${outputFolder}/${toSafeProperty(featureMap.productName)}FeatureMap.ts`
        console.log(`Creating feature-map object file: ${outputFile}`);
        writeFileSync(outputFile, featureMapObjectCode);
    }
}

export default typeScriptConnector;

import * as indentString from "indent-string";
import { camelCase, upperFirst } from "lodash";
import { Feature, FeatureMap } from "./FeatureMap";

export const toSafeProperty = (name: string) => upperFirst(camelCase(name));

const objectToString = (properties: [string, string?][], prefix?: string): string => `${prefix || ""}{
${properties.filter(([key, value]) => value !== undefined).map(([key, value]) => indentString(`${key}: ${value}`, 4)).join(",\n")}
}`;

const createConstantString = (constantName: string, properties: [string, string][]): string => {
    return objectToString(properties, `export const ${toSafeProperty(constantName)} = `);
}

const createFeatureString = (featureName: string, feature?: Feature): string => {
    return objectToString([
        ["$name", `"${featureName}"`],
        ...Object.keys(feature?.features || {}).map(featureName => [toSafeProperty(featureName), createFeatureString(featureName, feature?.features?.[featureName])] as [string, string])
    ]);
}

export const buildFeatureMapObject = (featureMap: FeatureMap) => {
    return createConstantString(`${featureMap.productName}FeatureMap`, 
        Object
            .keys(featureMap.features)
            .map( featureName => [toSafeProperty(featureName), createFeatureString(featureName, featureMap.features[featureName])])
    );
}

import { FeatureMap } from "./FeatureMap";

export interface Connector {
    name: string;
    buildFeatureMapObject?: (featureMap: FeatureMap, outputFolder: string) => Promise<void> | void;
    bindTestResults?: (featureMap: FeatureMap, testResultsInputFile: string) => FeatureMap;
    export?: (featureMap: FeatureMap) => Promise<void> | void;
}

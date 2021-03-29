import { isEqual, mapValues } from "lodash";
import { readFileSync } from "fs";
import { Connector } from "../Connector";
import { Feature, FeatureMap, TestCase, TestStatus } from "../FeatureMap";
import { Jest } from "./JestTestResults";

const mapStatus = (status: Jest.TestStatus): TestStatus => {
    switch(status){
        case Jest.TestStatus.failed: return TestStatus.failed;
        case Jest.TestStatus.passed: return TestStatus.passed;
        default: return TestStatus.failed;
    }
}

const bindJestResultsToFeature = (path: string[], feature: Feature, testResults: Jest.AssertionResult[]): Feature => {
    const tests: TestCase[] = testResults
        .filter( testResult => isEqual(testResult.ancestorTitles, path))
        .map(testResult => ({
            name: testResult.title,
            status: mapStatus(testResult.status)
        }));
    return {
        ...feature,
        features: mapValues(feature.features, (subFeature, subFeatureName) => bindJestResultsToFeature([...path, subFeatureName], subFeature, testResults)),
        tests
    }
}

const jestConnector: Connector = {
    name: "jest",
    bindTestResults: (featureMap: FeatureMap, testResultsInputFile: string): FeatureMap => {
        // 6.2 Read Jest test results and combine with FeatureMap
        const jestTestResults: Jest.ExecutionResults = JSON.parse(readFileSync(testResultsInputFile, "utf8"));
        const testResults = jestTestResults.testResults.flatMap(testResult => testResult.assertionResults);
        return {
            ...featureMap,
            features: mapValues(featureMap.features, (feature, featureName) => bindJestResultsToFeature([featureName], feature, testResults))
        };
    }
}

export default jestConnector;
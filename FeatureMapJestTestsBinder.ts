import { isEqual, mapValues } from "lodash";
import { Feature, FeatureMap, TestCase, TestStatus } from "./FeatureMap";
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

export const bindJestResults = (featureMap: FeatureMap, jestExecutionResults: Jest.ExecutionResults): FeatureMap => {
    const testResults = jestExecutionResults.testResults.flatMap(testResult => testResult.assertionResults);
    return {
        ...featureMap,
        features: mapValues(featureMap.features, (feature, featureName) => bindJestResultsToFeature([featureName], feature, testResults))
    };
}
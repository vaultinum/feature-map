import { Connector } from "../Connector";
import { FeatureMap } from "../FeatureMap";

const mochawesomeConnector: Connector = {
    name: "mochawesome",
    bindTestResults: (featureMap: FeatureMap, testResultsInputFile: string) => {
        return featureMap;
    }
};

export default mochawesomeConnector;

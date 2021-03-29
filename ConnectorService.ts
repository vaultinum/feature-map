import { FeatureMap } from "./FeatureMap";
import { Connector } from "./Connector";

const connectors = new Map<string, Connector>();

export const addConnector = (connector: Connector) => {
    connectors.set(connector.name, connector);
}

export const bindTestResults = (target: string, featureMap: FeatureMap, inputFile: string): FeatureMap => {
    if(connectors.has(target)){
        console.log(`Binding test results: target=${target}, inputFile=${inputFile}`);
        const connector = connectors.get(target);
        if(connector?.bindTestResults){
            return connector.bindTestResults(featureMap, inputFile);
        }
    } 
    throw new Error(`Unsupported test results binding: ${target}`);
}

export const buildFeatureMapObject = async (target: string, featureMap: FeatureMap, outputFolder: string): Promise<void> => {
    if(connectors.has(target)){
        console.log(`Building featuremap object: target=${target}, outputFolder=${outputFolder}`);
        const connector = connectors.get(target);
        if(connector?.buildFeatureMapObject){
            return await connector.buildFeatureMapObject(featureMap, outputFolder);
        }
    } 
    throw new Error(`Unsupported featuremap object: target=${target}`);
}
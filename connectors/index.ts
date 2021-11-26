import { addConnector } from "../ConnectorService";
import jestConnector from "./JestConnector";
import mochawesomeConnector from "./MochawesomeConnector";
import typeScriptConnector from "./TypeScriptFeatureMapBuilder";

export const loadConnectors = () => {
    addConnector(jestConnector);
    addConnector(mochawesomeConnector);
    addConnector(typeScriptConnector);
};

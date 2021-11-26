export interface FeatureMapConfig {
    debug: boolean;
    featuremap: string;
    outputFolder: string;
    buildObject?: {
        target?: string;
    };
    bindTests?: {
        target?: string;
        inputFile?: string;
    };
}

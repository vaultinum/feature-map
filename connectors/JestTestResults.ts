export namespace Jest {
    export enum TestStatus {
        failed = "failed",
        pending = "pending",
        passed = "passed"
    }

    export interface AssertionResult {
        fullName: string;
        status: TestStatus;
        title: string;
        ancestorTitles: string[];
        failureMessages: string[];
        location: null | {
            column: number;
            line: number;
        };
    }

    export interface TestResult {
        assertionResults: AssertionResult[];
        endTime: number;
        message: string;
        name: string;
        startTime: number;
        status: TestStatus;
        summary: string;
    }

    export interface ExecutionResults {
        testResults: TestResult[];
    }
}

import { ExampleProductFeatureMap } from "./ExampleProductFeatureMap";

const { Authentication, MainApplication } = ExampleProductFeatureMap;
describe(Authentication.$name, () => {
    describe(Authentication.LoginPage.$name, () => {
        describe(Authentication.LoginPage.Login.$name, () => {
            test("A user can login with a existing login/password", () => {
                // Do some test...
                console.log("Given a valid login/password");
                console.log("Then the application page is loaded");
            });
            test("A user is rejected with a wrong login/password", () => {
                // fail();
            });
        });

        describe(Authentication.LoginPage.ForgotPassword.$name, () => {
            test("A email is sent when providing a registered email", () => {
                // Do some test...
            });
            test("the same message is displayed when a non-existing email is provided", () => {
                // Do some test...
            });
        });
    });
});

describe(MainApplication.$name, () => {
    describe(MainApplication.AccountManagement.$name, () => {
        describe(MainApplication.AccountManagement.UserProfile.$name, () => {
            test("A user can change his profile picture", () => {
                // Do some test...
            });
        });
    });
});

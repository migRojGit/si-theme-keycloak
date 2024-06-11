import { PageProps } from "keycloakify/login";
import { KcContext } from "../kcContext";
import { I18n } from "../i18n";
import { useGetClassName } from "keycloakify/login/lib/useGetClassName";
import { useState } from "react";
import Template from "../Template";


export default function LoginResetPassword(props: PageProps<Extract<KcContext, { pageId: "login-reset-password.ftl"; }>, I18n>) {
    const { kcContext, i18n, doUseDefaultCss, classes } = props;
    const { getClassName} = useGetClassName({ doUseDefaultCss, classes });
    const { social, realm, url, usernameHidden, login, auth, registrationDisabled } = kcContext
    const { msg, msgStr } = i18n;
    const [isLoginButtonDisabled, setIsLoginButtonDisabled] = useState(true);
    
    return (
        <Template
            {...{ kcContext, i18n, doUseDefaultCss, classes }}
        >
            <h1>Reset Credentials</h1>
        </Template>
    );
}
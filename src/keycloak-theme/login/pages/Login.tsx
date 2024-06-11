import React, { useEffect, useState, type FormEventHandler } from "react";
import { clsx } from "keycloakify/tools/clsx";
import { useConstCallback } from "keycloakify/tools/useConstCallback";
import type { PageProps } from "keycloakify/login/pages/PageProps";
import { useGetClassName } from "keycloakify/login/lib/useGetClassName";
import type { KcContext } from "../kcContext";
import type { I18n } from "../i18n";
import { checkRut, useRut, formatRut } from "react-rut-formatter";

const my_custom_param = new URL(window.location.href).searchParams.get("my_custom_param");
// interface IndexRealm {
//     [key: string]           : string,
//     'confuturo-sso-qa'      : string,
//     'confuturo-sso'         : string,
//     'myrealm'               : string,
//     'sitio-intermediario'   : string,
// }
/**VALIDAR CLIENTID en relación al reino PROD y QA */
// interface indexClient {
//     [key: string]   : string,
//     'sitio-intermediario' : string,
//     ''
// }

if (my_custom_param !== null) {
    console.log("my_custom_param:", my_custom_param);
}

export default function Login(props: PageProps<Extract<KcContext, { pageId: "login.ftl" }>, I18n>) {
    const { kcContext, i18n, doUseDefaultCss, Template, classes } = props;
    const { getClassName } = useGetClassName({
        doUseDefaultCss,
        classes
    });
    // const indexRealm: IndexRealm = {
    //     'confuturo-sso-qa'      : 'https://sitio-intermediario-qa.confuturo.cl/recover-password',
    //     'confuturo-sso'         : 'https://sitio-intermediario.confuturo.cl/recover-password',
    //     'myrealm'               : 'https://sitio-intermediario-qa.confuturo.cl/recover-password',
    //     'sitio-intermediario'   : 'https://sitio-intermediario-qa.confuturo.cl/recover-password',
    // }
    const { rut, updateRut } = useRut();
    const { social, realm, url, usernameHidden, login, auth, registrationDisabled } = kcContext;
    const { msg, msgStr } = i18n;
    const [isLoginButtonDisabled, setIsLoginButtonDisabled] = useState(true);
    const [isValidTaxId, setIsValidTaxId] = useState(false);
    const [passValue, setPassValue] = useState("");
    console.log({ kcContext })
    // const realmName: string = realm?.name ?? "myRealm";
    // url.loginResetCredentialsUrl = indexRealm[realmName] 
    // console.log('sitio-intermediario',indexRealm)
    // console.log({ kcContext })
    // console.log(realmName)
    const validateUsername = ({ target: { value } }: React.ChangeEvent<HTMLInputElement>): void => {
        const rutAux = formatRut(value)
        updateRut(rutAux);
       if (!checkRut(rutAux)) {
        setIsValidTaxId(false);
        setPassValue('');
        return
       }
       setIsValidTaxId(true);
    }

    const passwordValidate = (event: React.ChangeEvent<HTMLInputElement>): void => {
       const passAux = event.target.value
       setPassValue(passAux);
       validateProps()
    }

    const validateProps = (): void => {
        const result = isValidTaxId && passValue.length > 4 ? false : true;
        setIsLoginButtonDisabled(result);
    }

    useEffect(() => {
        validateProps();
    }, [isValidTaxId, passValue])

   
    const onSubmit = useConstCallback<FormEventHandler<HTMLFormElement>>(e => {        
        e.preventDefault();
        setIsLoginButtonDisabled(true);

        const formElement = e.target as HTMLFormElement;

        //NOTE: Even if we login with email Keycloak expect username and password in
        //the POST request.
        formElement.querySelector("input[name='email']")?.setAttribute("name", "username");

        formElement.submit();
    });

    const changeLabelText = (label: any) => {
        return label === 'usernameOrEmail' || label === 'username' ? 'Ingresa tu RUT' : msg(label)
    }

    return (
        <Template
            {...{ kcContext, i18n, doUseDefaultCss, classes }}
            displayInfo={
                realm.password &&
                realm.registrationAllowed &&
                !registrationDisabled
            }
            displayWide={realm.password && social.providers !== undefined}
            headerNode={msg("doLogIn")}
            infoNode={
                <div id="kc-registration">
                    <span>
                        {msg("noAccount")}
                        <a tabIndex={6} href={url.registrationUrl}>
                            {msg("doRegister")}
                        </a>
                    </span>
                </div>
            }
        >
            <div id="kc-form" className={clsx(realm.password && social.providers !== undefined && getClassName("kcContentWrapperClass"))}>
                <div
                    id="kc-form-wrapper"
                    className={clsx(
                        realm.password &&
                        social.providers && [getClassName("kcFormSocialAccountContentClass"), getClassName("kcFormSocialAccountClass")]
                    )}
                >
                    {realm.password && (
                        <form id="kc-form-login" onSubmit={onSubmit} action={url.loginAction} method="post">
                            <div className={getClassName("kcFormGroupClass")}>
                                {!usernameHidden &&
                                    (() => {
                                        const label = !realm.loginWithEmailAllowed
                                            ? "username"
                                            : realm.registrationEmailAsUsername
                                                ? "email"
                                                : "usernameOrEmail";

                                        const autoCompleteHelper: typeof label = label === "usernameOrEmail" ? "username" : label;

                                        return (
                                            <>
                                                <label htmlFor={autoCompleteHelper} className={getClassName("kcLabelClass")}>
                                                    {changeLabelText(label)}
                                                </label>
                                                <input
                                                    tabIndex={1}
                                                    id={autoCompleteHelper}
                                                    className={getClassName("kcInputClass")}
                                                    //NOTE: This is used by Google Chrome auto fill so we use it to tell
                                                    //the browser how to pre fill the form but before submit we put it back
                                                    //to username because it is what keycloak expects.
                                                    name={autoCompleteHelper}
                                                    value={rut.formatted}
                                                    onChange={validateUsername}
                                                    type="text"
                                                    autoFocus={true}
                                                    autoComplete="off"
                                                    maxLength={12}
                                                />
                                            </>
                                        );
                                    })()}
                            </div>
                            <div className={getClassName("kcFormGroupClass")}>
                                <label htmlFor="password" className={getClassName("kcLabelClass")}>
                                    {msg("password")}
                                </label>
                                <input
                                    tabIndex={2}
                                    id="password"
                                    className={getClassName("kcInputClass")}
                                    name="password"
                                    type="password"
                                    autoComplete="off"
                                    maxLength={20}
                                    disabled={!checkRut(rut.formatted)}
                                    onChange={ e => passwordValidate(e) }
                                    value={passValue}
                                />
                            </div>
                            <div className={clsx(getClassName("kcFormGroupClass"), getClassName("kcFormSettingClass"))}>
                                <div id="kc-form-options">
                                    {realm.rememberMe && !usernameHidden && (
                                        <div className="checkbox">
                                            <label>
                                                <input
                                                    tabIndex={3}
                                                    id="rememberMe"
                                                    name="rememberMe"
                                                    type="checkbox"
                                                    {...(login.rememberMe === "on"
                                                        ? {
                                                            "checked": true
                                                        }
                                                        : {})}
                                                />
                                                {msg("rememberMe")}
                                            </label>
                                        </div>
                                    )}
                                </div>
                                <div className={getClassName("kcFormOptionsWrapperClass")}>
                                    {realm.resetPasswordAllowed && (
                                        <span>
                                            <a tabIndex={5} href={url.loginResetCredentialsUrl}>
                                                {msg("doForgotPassword")}
                                            </a>
                                        </span>
                                    )}
                                </div>
                            </div>
                            <div id="kc-form-buttons" className={getClassName("kcFormGroupClass")}>
                                <input
                                    type="hidden"
                                    id="id-hidden-input"
                                    name="credentialId"
                                    {...(auth?.selectedCredential !== undefined
                                        ? {
                                            "value": auth.selectedCredential
                                        }
                                        : {})}
                                />
                                <input
                                    tabIndex={4}
                                    className={clsx(
                                        getClassName("kcButtonClass"),
                                        getClassName("kcButtonPrimaryClass"),
                                        getClassName("kcButtonBlockClass"),
                                        getClassName("kcButtonLargeClass")
                                    )}
                                    name="login"
                                    id="kc-login"
                                    type="submit"
                                    value={msgStr("doLogIn")}
                                    disabled={ isLoginButtonDisabled }
                                />
                            </div>
                        </form>
                    )}
                </div>
                {realm.password && social.providers !== undefined && (
                    <div
                        id="kc-social-providers"
                        className={clsx(getClassName("kcFormSocialAccountContentClass"), getClassName("kcFormSocialAccountClass"))}
                    >
                        <ul
                            className={clsx(
                                getClassName("kcFormSocialAccountListClass"),
                                social.providers.length > 4 && getClassName("kcFormSocialAccountDoubleListClass")
                            )}
                        >
                            {social.providers.map((p) => (
                                <li key={p.providerId} className={getClassName("kcFormSocialAccountListLinkClass")}>
                                    <a href={p.loginUrl} id={`zocial-${p.alias}`} className={clsx("zocial", p.providerId)}>
                                        <span>{p.displayName}</span>
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        </Template>
    );
}

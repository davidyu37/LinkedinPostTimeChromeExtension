import logo from "url:../images/icon256.png";

export const App = () => {
    return (
        <>
            <img src={logo} alt="Logo" />
            <h1>Linkedin Post Time Inspector</h1>
            <div>v{chrome.runtime.getManifest().version}</div>
        </>
    );
};


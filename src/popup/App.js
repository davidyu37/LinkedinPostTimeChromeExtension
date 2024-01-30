import logo from "url:../images/icon256.png";

export const App = () => {
    return (
        <>
            <img src={logo} alt="Logo" />
            <h1>PostTime</h1>
            <div>v{chrome.runtime.getManifest().version}</div>
        </>
    );
};

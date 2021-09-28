import cogoToast from 'cogo-toast';

export default () => {
    localStorage.clear();
    window.location.href = '/';

    void cogoToast.success('You have been logged out.');
    return <></>;
};

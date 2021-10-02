import cogoToast from 'cogo-toast';
import { useEffect } from 'react';

export default () => {
    useEffect(() => {
        localStorage.clear();
        window.location.href = '/';

        void cogoToast.success('Deslogueado.');
    }, []);
    return <></>;
};

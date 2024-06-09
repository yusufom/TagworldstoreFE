import cogoToast from 'cogo-toast';

export const successToast = (message) => {
    return cogoToast.success(message, {position: "top-center"});
}

export const errorToast = (message) => {
    return cogoToast.error(message, {position: "top-center"});
}

export const warningToast = (message) => {
    return cogoToast.warn(message, {position: "top-center"});
}